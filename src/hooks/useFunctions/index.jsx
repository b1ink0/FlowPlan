import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { deleteNode, moveNode, removeChild } from "../useTree";
import { toJSON, fromJSON } from "flatted";

export const useFunctions = () => {
  const {
    db,
    currentTreeNote,
    setCurrentTreeNote,
    update,
    setUpdate,
    currentExpanded,
    setCurrentExpanded,
    move,
    setMove,
  } = useStateContext();

  const handleDeleteNodeWithoutItsChildren = async (
    node,
    setDeleted,
    location,
    setPaths
  ) => {
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

  const handleDeletePathAndExpanded = async (node, setPaths) => {
    if (node.children.length > 0) {
      for (let child of node.children) {
        handleDeletePathAndExpanded(child, setPaths);
      }
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
        delete expanded.expanded[node.id];
      });
  };

  const handleDeleteNodeWithItsChildren = async (
    node,
    setDeleted,
    location,
    setPaths
  ) => {
    handleDeletePathAndExpanded(node, setPaths);

    let root = node.parent;
    removeChild(root, node);
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

  const handleMoveNode = async (
    node,
    location,
    setIsExpanded,
    setRootExpanded
  ) => {
    if (node.parent === null) {
      moveNode(move.node, node);
      setCurrentTreeNote((prev) => ({ ...prev, root: node }));
      setMove((prev) => ({ enable: false, node: null }));
      await db.treeNotes
        .where("refId")
        .equals(currentTreeNote.refId)
        .modify({ root: root });
      // setDeleted(true);
      setTimeout(() => {
        setUpdate(update + 1);
      }, 100);
    } else {
      let root = node.parent;

      moveNode(move.node, node);
      while (root.parent) {
        root = root.parent;
      }
      setCurrentTreeNote((prev) => ({ ...prev, root: root }));
      setMove((prev) => ({
        enable: false,
        node: null,
        location: null,
        position: null,
        parentPosition: null,
      }));
      // setCurrentExpanded((prev) => ({...prev, [currentTreeNote.root.refId]: false}));
      setRootExpanded(false);

      setTimeout(async () => {
        setIsExpanded(true);
        const newPrev = {
          ...currentExpanded,
          [node?.id]: true,
        };
        await db.treeNotes
          .where("refId")
          .equals(currentTreeNote.refId)
          .modify({ root: root });
        await db.treeNotesExpanded
          .where("refId")
          .equals(currentTreeNote.refId)
          .modify((expanded) => {
            expanded.expanded = newPrev;
          });
        setTimeout(() => {
          setRootExpanded(true);
          setTimeout(() => {
            setUpdate(update + 1);
          }, 100);
        }, 100);
      }, 100);
    }
  };

  const handleExportTreeNote = async (refIds) => {
    const treeNotes = [];
    const treeNotesIndex = [];
    const treeNotesExpanded = [];
    for (let refId of refIds) {
      const treeNote = await db.treeNotes.where("refId").equals(refId).first();
      const treeNoteIndex = await db.treeNotesIndex
        .where("refId")
        .equals(refId)
        .first();
      const treeNoteExpanded = await db.treeNotesExpanded
        .where("refId")
        .equals(refId)
        .first();
      treeNotes.push(treeNote);
      treeNotesIndex.push(treeNoteIndex);
      treeNotesExpanded.push(treeNoteExpanded);
    }
    const result = {
      treeNotes,
      treeNotesIndex,
      treeNotesExpanded,
    };
    const json = toJSON(result);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `TreeNote.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportTreeNote = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = JSON.parse(e.target.result);
      const cjson = fromJSON(result);
      const { treeNotes, treeNotesIndex, treeNotesExpanded } = cjson;
      const refIds = {};
      for (let treeNote of treeNotes) {
        refIds[treeNote.refId] = v4();
      }
      for (let treeNote of treeNotes) {
        console.log(treeNote);
        await db.treeNotes.add({
          refId: refIds[treeNote.refId],
          title: treeNote.title,
          root: {
            ...treeNote.root,
            id: refIds[treeNote.root.id],
          },
          createdAt: new Date(treeNote.createdAt),
          updatedAt: new Date(treeNote.updatedAt),
        });
      }
      for (let treeNoteIndex of treeNotesIndex) {
        await db.treeNotesIndex.add({
          refId: refIds[treeNoteIndex.refId],
          title: treeNoteIndex.title,
          createdAt: new Date(treeNoteIndex.createdAt),
          updatedAt: new Date(treeNoteIndex.updatedAt),
        });
      }
      for (let treeNoteExpanded of treeNotesExpanded) {
        await db.treeNotesExpanded.add({
          refId: refIds[treeNoteExpanded.refId],
          expanded: {
            ...treeNoteExpanded.expanded,
            [refIds[treeNoteExpanded.refId]]: treeNoteExpanded.expanded[
              treeNoteExpanded.refId
            ],
          },
        });
      }
      setUpdate(update + 1);
    };
    reader.readAsText(file);
  };

  return {
    handleDeleteNodeWithoutItsChildren,
    handleDeleteNodeWithItsChildren,
    handleMoveNode,
    handleExportTreeNote,
    handleImportTreeNote,
  };
};
