// @ts-check
import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { deleteNode, moveNode, removeChild, reorderNode } from "../useTree";
import { fsdb, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const FlowPlanAPIURL = import.meta.env.VITE_FLOWPLAN_API_URL;

export const useDatabase = () => {
  // destructure state from context
  const { db } = useStateContext();
  const { currentUser } = useAuth();

  const handleUserLogedIn = () => {
    return currentUser ? true : false;
  };

  const handleGetIdToken = async () => {
    if (!handleUserLogedIn) return;
    const idToken = await currentUser.getIdToken();
    return idToken;
  };

  const handleAuthenticatedFetch = async (url, options = {}) => {
    if (!handleUserLogedIn) return;
    try {
      const idToken = await handleGetIdToken();
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        console.log("Error fetching data from server", response);
        return false;
      }

      const jsonResponce = await response.json();
      return jsonResponce;
    } catch (e) {
      console.log("Error fetching data from server", e);
      return false;
    }
  };

  const handleSync = async () => {
    if (!handleUserLogedIn) return;
    if (!(await handleCreateUserDoc())) return;
    if (!(await handleGetUpdateTracking())) return;
  };

  const handleCreateUserDoc = async () => {
    // fist check if the user doc exists
    const useDocRef = doc(fsdb, "users", currentUser.uid);
    try {
      const docSnap = await getDoc(useDocRef);
      if (docSnap.exists()) {
        console.log("User doc exists", docSnap.data());
        return true;
      } else {
        // doc doesn't exist, create one
        const user = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(useDocRef, user);
        console.log("User doc created");
        return true;
      }
    } catch (e) {
      console.log("Error getting document from user collection", e);
      return false;
    }
  };

  const handleGetUpdateTracking = async () => {
    // first check if the flow plan record exists
    const flowPlanList = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowPlanlist`
    );
    if (!flowPlanList) {
      console.log("Error fetching flow plan list");
      return false;
    }

    if (flowPlanList.length === 0) {
      console.log("No flow plan record exists");
      const flowPlans = await db.flowPlans.toArray();
      if (flowPlans.length === 0) {
        console.log("No flow plan record in indexedDB");
        return false;
      }
      await handleAddBulkFlowPlans(flowPlans);
      return false;
    }
    console.log("Flow plan record exists", flowPlanList);
  };

  const handleUpdateIndexDB = async (
    refId,
    root,
    updateDate = true,
    typeOfUpdate,
    data
  ) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });

    // handle dates and images and files
    // add updated timestamp to all the nodes that are updated

    // return if no user is logged in
    if (!handleUserLogedIn) return;

    switch (typeOfUpdate) {
      case "updateNode":
        // @marker UpdateNode
        break;
      case "addEditNode":
        // @marker AddEditNode
        break;
      case "deleteNodeWithoutItsChildren":
        // @marker DeleteNodeWithoutItsChildren
        // delete the node doc , add the ids of children of node to parent of node,
        // remove the node from the children of parent of node
        break;
      case "deleteNodeWithItsChildren":
        // @marker DeleteNodeWithItsChildren
        // delete the node doc and all its children docs,
        // remove node id form parent of node,
        break;
      case "moveNode":
        // @marker MoveNode
        // remove node id from old parent and add it to new parent
        break;
      case "reorderNode":
        // @marker ReorderNode
        // remove node id from old parent and add it to new parent
        break;
      case "expanded":
        // @marker Expanded
        break;
      case "pasteNode":
        // @marker PasteNode
        // add new node and update teh parent of node
        break;
      default:
        break;
    }
  };

  const handleAddNewPlan = async (plan) => {
    // @marker AddNewPlan
    await db.flowPlans.add(plan);
  };

  const handleAddBulkFlowPlans = async (plans) => {
    // @marker AddBulkFlowPlans
    plans = structuredClone(plans);
    plans = await handleProcessFlowPlanFileUpload(plans);

    const flowPlanUpdateTrackingData = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplanaddbulk`,
      {
        method: "POST",
        body: JSON.stringify({ plans: plans }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!flowPlanUpdateTrackingData) {
      console.log("Error adding bulk flow plans");
      return;
    }

    console.log("Bulk flow plans added", flowPlanUpdateTrackingData);

    await flowPlanUpdateTrackingData.forEach(async (plan) => {
      const getPlan = await db.flowPlans
        .where("refId")
        .equals(plan.refId)
        .first();
      if (!getPlan) {
        console.log("Plan not found in indexedDB", plan.refId);
        return;
      }

      const update = await db.flowPlans
        .where("refId")
        .equals(plan.refId)
        .modify({
          updateTracking: plan.updateTracking,
        });
      console.log("Plan updated in indexedDB", update);
    });
    console.log("Bulk flow plans processed!");
  };

  const handleDeleteFlowPlanFromDB = async (refId) => {
    // @marker DeleteFlowPlanFromDB
    await db.flowPlans.where("refId").equals(refId).delete();
  };

  const handleProcessFlowPlanFileUpload = async (flowPlans) => {
    const promises = flowPlans.map(async (plan) => {
      const root = await handleProcessNodeFileUpload(plan.root);
      plan.root = root;
      console.log("Processed Plan", plan?.refId);
    });
    await Promise.all(promises);
    return flowPlans;
  };

  const handleProcessNodeFileUpload = async (node) => {
    if (node?.data) {
      // @marker ProcessNode
      const promises = node.data.map(async (field) => {
        if (field?.type === "image" || field?.type === "file") {
          // @marker ProcessField
          if (!field.data[field.type].url.startsWith("data:")) return;
          const blob = await handleBase64ToBlob(
            field.data[field.type].url,
            field.data[field.type].mimiType
          );

          const storageRef = ref(storage, `${currentUser.uid}/${v4()}`);

          // Upload the file (optional step depending on your needs)
          console.log("Uploading file", field.data[field.type].name);
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          // const downloadURL = "https://www.google.com";
          console.log(
            "File Complete",
            field.data[field.type].name,
            downloadURL
          );
          field.data[field.type].url = downloadURL;
        }
      });
      // Wait for all the promises to resolve
      await Promise.all(promises);
      console.log("Porcessed Node", node?.id);
    }

    if (node?.children) {
      // @marker ProcessChildren
      const promises = node.children.map(async (child) => {
        await handleProcessNodeFileUpload(child);
      });
      // Wait for all the promises to resolve
      await Promise.all(promises);
    }
    return node;
  };

  const handleBase64ToBlob = (base64, mimeType) => {
    return new Promise((resolve, reject) => {
      try {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: mimeType });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    handleUpdateIndexDB,
    handleAddNewPlan,
    handleAddBulkFlowPlans,
    handleDeleteFlowPlanFromDB,
    handleSync,
  };
};
