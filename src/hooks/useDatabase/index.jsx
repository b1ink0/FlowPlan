// @ts-check
import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { deleteNode, moveNode, removeChild, reorderNode } from "../useTree";
import { fsdb, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { handlePositionCalculation } from "../helpers/PositionCalculation";
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
    const remoteUpdateTracking = await handleGetUpdateTracking();
    if (!remoteUpdateTracking) return;
    const localUpdateTracking = await db.flowPlans.toArray();
    if (!localUpdateTracking) return;
    console.log("Remote Update Tracking", remoteUpdateTracking);
    console.log("Local Update Tracking", localUpdateTracking);

    const newPlans = [];
    const updatedPlans = [];
    const deletedPlans = [];

    remoteUpdateTracking.forEach((remote) => {
      const local = localUpdateTracking.find((l) => l.refId === remote.refId);
      if (!local) {
        console.log("Local record not found", remote.refId);
        newPlans.push(remote.refId);
        return;
      }
      let newNodes = [];
      let updatedNodes = [];
      let deletedNodes = [];
      Object.keys(remote.updateTracking).forEach(async (key) => {
        if (!local.updateTracking[key]) {
          newNodes.push(key);
          return;
        }
        if (
          handleCompareTimestamps(
            remote.updateTracking[key],
            local.updateTracking[key]
          )
        ) {
          updatedNodes.push(key);
          return;
        }
      });
      Object.keys(local.updateTracking).forEach((key) => {
        if (!remote.updateTracking[key]) {
          deletedNodes.push(key);
          return;
        }
      });

      if (
        newNodes.length === 0 &&
        deletedNodes.length === 0 &&
        updatedNodes.length === 0
      )
        return;

      updatedPlans.push({
        refId: remote.refId,
        newNodes: newNodes,
        updatedNodes: updatedNodes,
        deletedNodes: deletedNodes,
      });
      console.log(updatedPlans);
    });

    localUpdateTracking.forEach((local) => {
      const remote = remoteUpdateTracking.find((r) => r.refId === local.refId);
      if (!remote) {
        console.log("Remote record not found", local.refId);
        deletedPlans.push(local.refId);
        return;
      }
    });

    console.log("New Plans", newPlans);
    console.log("Updated Plans", updatedPlans);
    console.log("Deleted Plans", deletedPlans);

    await handleSyncNewPlans(newPlans);
    // await handleSyncUpdatedPlans(updatedPlans);
    await handleSyncUpdatedPlansNotEfficientButIDontHaveTimeToOptimizeIt(
      updatedPlans
    );
    await handleSyncDeletedPlans(deletedPlans);
  };

  const handleSyncNewPlans = async (newPlans) => {
    if (newPlans.length === 0) return;

    const plans = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowPlan-retrieve-bulk`,
      {
        method: "POST",
        body: JSON.stringify({ refIds: newPlans }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!plans) {
      console.log("Error fetching new plans");
      return;
    }

    plans.forEach(async (plan) => {
      await handleAddNewPlan(plan, false);
      console.log("New Plan Added", plan.refId);
    });
    console.log("New Plans processed!");
  };

  const handleSyncUpdatedPlansNotEfficientButIDontHaveTimeToOptimizeIt = async (
    updatedPlans
  ) => {
    if (updatedPlans.length === 0) return;

    const temp = [];
    updatedPlans.forEach((plan) => {
      temp.push(plan.refId);
    });

    const plans = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowPlan-retrieve-bulk`,
      {
        method: "POST",
        body: JSON.stringify({ refIds: temp }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!plans) {
      console.log("Error fetching new plans");
      return;
    }

    plans.forEach(async (plan) => {
      const localPlan = await db.flowPlans
        .where("refId")
        .equals(plan.refId)
        .first();
      if (!localPlan) {
        console.log("Plan not found in indexedDB", plan.refId);
        return;
      }
      // update the whole plan
      await db.flowPlans
        .where("refId")
        .equals(plan.refId)
        .modify({
          ...plan,
        });
      console.log("Plan updated in indexedDB", plan.refId);
    });

    console.log("Updated Plans processed!");
  };

  const handleSyncUpdatedPlans = async (updatedPlans) => {
    console.log(updatedPlans);
    if (updatedPlans.length === 0) return;

    await handleSyncUpdateNodes(updatedPlans);

    updatedPlans.forEach(async (plan) => {
      await handleDeleteNodes(plan);
    });
  };

  const handleSyncUpdateNodes = async (updatedPlans) => {
    if (updatedPlans.length === 0) return;
    let temp = [];
    updatedPlans.forEach((plan) => {
      // updatedNodes = [...updatedNodes, ...(plan.updatedNodes.contat(plan.newNodes))];
      temp.push({
        refId: plan.refId,
        nodes: plan.updatedNodes,
      });
    });
    console.log(temp);

    const planNodes = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowPlan-retrieve-nodes`,
      {
        method: "POST",
        body: JSON.stringify({ plans: temp }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(planNodes);

    if (!planNodes) {
      console.log("Error fetching plan nodes");
      return;
    }

    planNodes.forEach(async (plan) => {
      const localPlan = await db.flowPlans
        .where("refId")
        .equals(plan.refId)
        .first();
      if (!localPlan) {
        console.log("Plan not found in indexedDB", plan.refId);
        return;
      }

      console.log(localPlan);

      localPlan.root = handleUpdateNodesInPlan(plan.nodes, localPlan.root);
      // await db.flowPlans.where("refId").equals(plan.refId).modify({
      //   root: localPlan.root,
      //   updatedAt: new Date(),
      // });
      // console.log("Plan updated in indexedDB", plan.refId);
    });
  };

  const handleUpdateNodesInPlan = (nodes, root) => {
    console.log(nodes, root);
    if (!nodes || nodes.length === 0) return root;

    if (!root?.location) root.location = [];

    nodes.forEach((node) => {
      if (!node?.location) return;
      if (node.location.length === 0) {
        // root = node;
        return;
      }
      let parent = root;
      node.location.forEach((i, index) => {
        parent = parent.children[i];
        if (index === node.location.length - 1) {
          // parent = node;
        }
      });

      console.log(parent);
    });

    // Find the updated version of the current node
    // const updatedNode = nodes.find((n) => n.id === node.id);

    // // If the current node needs to be updated, return the updated node
    // if (updatedNode) {
    //   return { ...node, ...updatedNode };
    // }

    // // If the current node has children, recursively update them
    // if (node?.children && node.children.length > 0) {
    //   node.children = node.children.map((child) =>
    //     handleUpdateNodesInPlan(nodes, child)
    //   );
    // }

    // return node;
  };

  const handleDeleteNodes = async (plan) => {
    if (plan.deletedNodes.length === 0) return;
    const localPlan = await db.flowPlans
      .where("refId")
      .equals(plan.refId)
      .first();
    if (!localPlan) {
      console.log("Plan not found in indexedDB", plan.refId);
      return;
    }

    localPlan.root = handleDeleteNodesFromPlan(
      plan.deletedNodes,
      localPlan.root
    );
    console.log(localPlan.root);
    await db.flowPlans.where("refId").equals(plan.refId).modify({
      root: localPlan.root,
      updatedAt: new Date(),
    });
  };

  const handleDeleteNodesFromPlan = (deletedNodes, node) => {
    if (deletedNodes.length === 0) return node;
    if (deletedNodes.includes(node.id)) {
      return null;
    }
    if (node?.children.length > 0) {
      node.children = node.children
        .map((child) => handleDeleteNodesFromPlan(deletedNodes, child))
        .filter((child) => child !== null);
    }
    return node;
  };

  const handleSyncDeletedPlans = async (deletedPlans) => {
    if (deletedPlans.length === 0) return;
    deletedPlans.forEach(async (refId) => {
      await handleDeleteFlowPlanFromDB(refId, false);
    });
  };

  const handleCompareTimestamps = (remote, local) => {
    const remoteTimestamp = new Date(remote).getTime();
    const localTimestamp = new Date(local).getTime();
    return remoteTimestamp > localTimestamp;
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
      `${FlowPlanAPIURL}/flowPlan-list`
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
    return flowPlanList;
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
    if (!typeOfUpdate) return;
    if (!data) return;

    switch (typeOfUpdate) {
      case "updateNode":
        // @marker UpdateNode
        await handleUpdateNode(refId, data);
        break;
      case "addEditNode":
        // @marker AddEditNode
        console.log(data);
        if (data.type === "edit") {
          // update the node doc
          await handleUpdateNode(refId, data.node);
          break;
        }
        await handleAddNodeToParent(refId, data);
        break;
      case "deleteNodeWithoutItsChildren":
        // @marker DeleteNodeWithoutItsChildren
        // delete the node doc , add the ids of children of node to parent of node,
        // remove the node from the children of parent of node
        await handleDeleteNodeWithoutItsChildren(refId, data);
        break;
      case "deleteNodeWithItsChildren":
        // @marker DeleteNodeWithItsChildren
        // delete the node doc and all its children docs,
        // remove node id form parent of node,
        await handleDeleteNodeWithItsChildren(refId, data);
        break;
      case "moveNode":
        // @marker MoveNode
        // remove node id from old parent and add it to new parent
        await handleMoveNode(refId, data);
        break;
      case "reorderNode":
        // @marker ReorderNode
        // remove node id from old parent and add it to new parent
        await handleMoveNode(refId, data);
        break;
      case "expanded":
        // @marker Expanded
        await handleUpdateNode(refId, data);
        break;
      case "pasteNode":
        // @marker PasteNode
        // add new node and update teh parent of node
        await handleAddNodeToParent(refId, {
          parentNode: data.parent,
          node: data.node,
        });
        break;
      default:
        break;
    }
  };

  const handleDeleteNodeWithItsChildren = async (refId, data) => {
    let tempData = structuredClone(data);

    let parentChildrenIds = [];

    tempData.parent.children.forEach((child) => {
      parentChildrenIds.push(child.id);
    });

    let childrenIds = [];

    childrenIds = handleAgrigateChildrenIds(tempData.node);

    const request = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplan-delete-node-with-children`,
      {
        method: "POST",
        body: JSON.stringify({
          refId: refId,
          parentId: tempData.parent.id,
          nodeId: tempData.node.id,
          newParentChildOrder: parentChildrenIds,
          childrenIds: childrenIds,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!request) {
      console.log("Error deleting node", request);
      return;
    }

    console.log("Node deleted", request);

    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        updateTracking: {
          ...request.updateTracking,
        },
      });

    console.log("Node deleted in indexedDB", refId);
  };

  const handleAgrigateChildrenIds = (node) => {
    let childrenIds = [];

    if (!node.children || node.children.length === 0) return childrenIds;

    node.children.forEach((child) => {
      childrenIds.push(child.id);
    });

    node.children.forEach((child) => {
      childrenIds = [...childrenIds, ...handleAgrigateChildrenIds(child)];
    });

    return childrenIds;
  };

  const handleDeleteNodeWithoutItsChildren = async (refId, data) => {
    let tempData = structuredClone(data);

    const childrenIds = [];

    tempData.parent.children.forEach((child) => {
      childrenIds.push(child.id);
    });

    const request = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplan-delete-node-without-children`,
      {
        method: "POST",
        body: JSON.stringify({
          refId: refId,
          parentId: tempData.parent.id,
          nodeId: tempData.node.id,
          newParentChildOrder: childrenIds,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!request) {
      console.log("Error deleting node", request);
      return;
    }

    console.log("Node deleted", request);

    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        updateTracking: {
          ...request.updateTracking,
        },
      });

    console.log("Node deleted in indexedDB", refId);
  };

  const handleMoveNode = async (refId, data) => {
    const oldParentChildOrder = [];

    data.oldParent.children.forEach((child) => {
      oldParentChildOrder.push(child.id);
    });

    const newParentChildOrder = [];

    data.newParent.children.forEach((child) => {
      newParentChildOrder.push(child.id);
    });

    const request_movenode = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplan-move-child-node`,
      {
        method: "POST",
        body: JSON.stringify({
          refId: refId,
          childId: data.node.id,
          oldParentId: data.oldParent.id,
          newParentId: data.newParent.id,
          oldParentChildOrder: oldParentChildOrder,
          newParentChildOrder: newParentChildOrder,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!request_movenode) {
      console.log("Error moving node", request_movenode);
      return;
    }

    console.log("Node moved", request_movenode);

    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        updateTracking: {
          ...request_movenode.updateTracking,
        },
      });

    console.log("Node moved in indexedDB", refId);
  };

  const handleAddNodeToParent = async (refId, data) => {
    data = structuredClone(data);

    const childrenIds = [];

    console.log("Parent Node", data);

    data.parentNode.children.forEach((child) => {
      childrenIds.push(child.id);
    });

    console.log("Children Ids", childrenIds);
    console.log("Parent Node", data.parentNode?.id);
    console.log("New Node", data.node?.id);

    const request = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplan-add-child-node`,
      {
        method: "POST",
        body: JSON.stringify({
          refId: refId,
          parentId: data.parentNode.id,
          childOrder: childrenIds,
          newChildNode: data.node,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!request) {
      console.log("Error adding child node", request);
      return;
    }

    console.log("Child node added", request);

    const localPlan = await db.flowPlans.where("refId").equals(refId).first();

    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        updateTracking: {
          ...localPlan.updateTracking,
          ...request.updateTracking,
        },
      });
  };

  const handleUpdateNode = async (refId, data) => {
    let tempData = structuredClone(data);

    let childrenIds = [];

    tempData.children.forEach((child) => {
      childrenIds.push(child.id);
    });

    tempData.children = childrenIds;

    const request = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplan-update-node`,
      {
        method: "POST",
        body: JSON.stringify({
          refId: refId,
          nodeId: data.id,
          newNode: tempData,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!request) {
      console.log("Error updating node");
      return;
    }

    console.log("Node updated", request);

    const localPlan = await db.flowPlans.where("refId").equals(refId).first();

    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        updateTracking: {
          ...localPlan.updateTracking,
          [data.id]: request.newTimestamp,
        },
      });

    console.log("Node updated in indexedDB", refId);
  };

  const handleAddNewPlan = async (plan, remote = true) => {
    // @marker AddNewPlan
    await db.flowPlans.add(plan);

    if (!remote) return;

    let tempPLan = structuredClone(plan);

    await handleAddBulkFlowPlans([tempPLan]);

    console.log("New flow plan added", plan.refId);
  };

  const handleAddBulkFlowPlans = async (plans) => {
    // @marker AddBulkFlowPlans
    plans = structuredClone(plans);
    plans = await handleProcessFlowPlanFileUpload(plans);

    const flowPlanUpdateTrackingData = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplan-add-bulk`,
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
      console.log("Plan updated in indexedDB", plan.refId, update);
    });
    console.log("Bulk flow plans processed!");
  };

  const handleDeleteFlowPlanFromDB = async (refId, remote = true) => {
    // @marker DeleteFlowPlanFromDB
    await db.flowPlans.where("refId").equals(refId).delete();

    if (!remote) return;

    console.log("Deleting flow plan", refId);

    const flowPlanUpdateTrackingData = await handleAuthenticatedFetch(
      `${FlowPlanAPIURL}/flowplan-delete`,
      {
        method: "POST",
        body: JSON.stringify({ refId: refId }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!flowPlanUpdateTrackingData) {
      console.log("Error deleting flow plan");
      return;
    }

    console.log("Flow plan deleted", flowPlanUpdateTrackingData);
  };

  const handleProcessFlowPlanFileUpload = async (flowPlans) => {
    const promises = flowPlans.map(async (plan) => {
      const root = await handleProcessNodeFileUpload(plan.root);
      plan.root = root;
      handlePositionCalculation(plan.root);
      console.log(plan);
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

  const handleUpdateFlowPlanTitle = async (refId, title) => {
    await db.flowPlans.where("refId").equals(refId).modify({
      title: title,
      updatedAt: new Date(),
    });

    // const request = await handleAuthenticatedFetch(
    //   `${FlowPlanAPIURL}/flowplan-update-title`,
    //   {
    //     method: "POST",
    //     body: JSON.stringify({ refId: refId, title: title }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // if (!request) {
    //   console.log("Error updating title");
    //   return;
    // }

    // console.log("Title updated", request);
  };

  return {
    handleUpdateIndexDB,
    handleAddNewPlan,
    handleAddBulkFlowPlans,
    handleDeleteFlowPlanFromDB,
    handleSync,
    handleUpdateFlowPlanTitle,
  };
};
