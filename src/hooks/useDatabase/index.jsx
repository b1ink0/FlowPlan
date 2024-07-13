// @ts-check
import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { deleteNode, moveNode, removeChild, reorderNode } from "../useTree";
import { fsdb } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    if (! await handleCreateUserDoc()) return;
    if (! await handleCreateFlowPlanRecord()) return;
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

  const handleCreateFlowPlanRecord = async () => {
    // first check if the flow plan record exists
    const flowPlanList = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowPlanlist`
    );
    if (!flowPlanList) {
      console.log("Error fetching flow plan list");
      return false;
    }

    if (flowPlanList.data.length === 0) {
      console.log("No flow plan record exists");
      const flowPlans = await db.flowPlans.toArray();
      if (flowPlans.length === 0) {
        console.log("No flow plan record in indexedDB");
        return false;
      }
      handleAddBulkFlowPlans(flowPlans);
      return true;
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

  };

  const handleDeleteFlowPlanFromDB = async (refId) => {
    // @marker DeleteFlowPlanFromDB
    await db.flowPlans.where("refId").equals(refId).delete();
  };

  const handleProcessFlowPlan = async (flowPlan) => {
    // @marker ProcessFlowPlan
  };

  const handleProcessNode = async (node) => {

  }

  return {
    handleUpdateIndexDB,
    handleAddNewPlan,
    handleAddBulkFlowPlans,
    handleDeleteFlowPlanFromDB,
    handleSync,
  };
};
