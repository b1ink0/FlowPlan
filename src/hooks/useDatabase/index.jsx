// @ts-check
import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { deleteNode, moveNode, removeChild, reorderNode } from "../useTree";

export const useDatabase = () => {
  // destructure state from context
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    update,
    setUpdate,
    move,
    setMove,
    setCopyNode,
  } = useStateContext();

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

  return {
    handleUpdateIndexDB,
    handleAddNewPlan,
    handleAddBulkFlowPlans,
    handleDeleteFlowPlanFromDB,
  };
};
