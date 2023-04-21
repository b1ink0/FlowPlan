import { useStateContext } from "../../context/StateContext";
import { deleteNode, removeChild } from "../useTree";

export const useFunctions = () => {
  const {
    db,
    currentTreeNote,
    setCurrentTreeNote,
    update,
    setUpdate,
    currentExpanded,
  } = useStateContext();

  const handleDelete = async (node, setDeleted, location, setPaths) => {
    let root = node.parent;
    deleteNode(node, location);
    while (root.parent) {
      root = root.parent;
    }
    setCurrentTreeNote((prev) => ({ ...prev, root: root }));
    await db.treeNotes
      .where("refId")
      .equals(currentTreeNote.refId)
      .modify({ root: root });
    setDeleted(false);
    let newExpanded = currentExpanded;
    if (newExpanded.hasOwnProperty(node.id)) {
      delete newExpanded[node.id];
    }
    setPaths((paths) => {
      const indexToDelete = paths.findIndex(
        (element) => element.id === node.id
      );
      if (indexToDelete !== -1) {
        paths.splice(indexToDelete, 1);
      }
      return paths;
    });
    await db.treeNotesExpanded
      .where("refId")
      .equals(currentTreeNote.refId)
      .modify((expanded) => {
        expanded.expanded = newExpanded;
      });

    setTimeout(() => {
      setDeleted(true);
      setTimeout(() => {
        setUpdate(update + 1);
      }, 100);
    }, 100);
  };

  const handleMove = () => {
    
  }

  return { handleDelete, handleMove };
};
