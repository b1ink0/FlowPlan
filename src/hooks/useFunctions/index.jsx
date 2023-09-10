import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { deleteNode, moveNode, removeChild, reorderNode } from "../useTree";
import { toJSON, fromJSON } from "flatted";

export const useFunctions = () => {
  const {
    db,
    currentTreeNote,
    setCurrentTreeNote,
    update,
    setUpdate,
    move,
    setMove,
  } = useStateContext();

  const handleDeleteNodeWithoutItsChildren = async (parent, node, location) => {
    deleteNode(parent, node, location);
    let root = currentTreeNote?.root;
    setCurrentTreeNote((prev) => ({ ...prev, root: root }));
    await db.treeNotes
      .where("refId")
      .equals(currentTreeNote.refId)
      .modify({ root: root });
    handlePositionCalculation(root);
    setUpdate(update + 1);
  };

  const handleDeleteNodeWithItsChildren = async (parent, node) => {
    let root = currentTreeNote.root;
    removeChild(parent, node);
    setCurrentTreeNote((prev) => ({ ...prev, root: root }));
    await db.treeNotes
      .where("refId")
      .equals(currentTreeNote.refId)
      .modify({ root: root });
    handlePositionCalculation(root);
    setUpdate(update + 1);
  };

  const handleMoveNode = async (node) => {
    let root = currentTreeNote.root;
    moveNode(move.parent, move.node, node);
    setCurrentTreeNote((prev) => ({ ...prev, root: root }));
    setMove({
      enable: false,
      node: null,
    });
    await db.treeNotes.where("refId").equals(currentTreeNote.refId).modify({
      updatedAt: new Date(),
      root: root,
    });
    handlePositionCalculation(root);
    setUpdate(update + 1);
  };

  const handleReorderNode = async (parent, type, location) => {
    let root = currentTreeNote.root;
    reorderNode(
      move.parent,
      parent,
      move.node,
      type === "first"
        ? 0
        : type === "middle"
        ? location + 1
        : type === "last"
        ? parent.children.length
        : 0,
      move.location[move.location.length - 1]
    );
    setCurrentTreeNote((prev) => ({ ...prev, root: root }));
    setMove({
      enable: false,
      node: null,
    });
    await db.treeNotes.where("refId").equals(currentTreeNote.refId).modify({
      updatedAt: new Date(),
      root: root,
    });
    handlePositionCalculation(root);
    setUpdate(update + 1);
  };

  const handleExportTreeNote = async (refIds) => {
    const treeNotes = [];
    for (let refId of refIds) {
      const treeNote = await db.treeNotes.where("refId").equals(refId).first();

      treeNotes.push(treeNote);
    }
    const result = {
      treeNotes,
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

  const handleDeleteTreeNote = async (refId) => {
    await db.treeNotes.where("refId").equals(refId).delete();
  };

  const handleImport = async (result) => {
    try {
      const cjson = fromJSON(result);
      const { treeNotes } = cjson;
      const refIds = {};
      console.log(cjson);
      for (let treeNote of treeNotes) {
        refIds[treeNote.refId] = v4();
      }
      let promises = [];

      for (let treeNote of treeNotes) {
        console.log(treeNote);
        const treeNotesPromise = db.treeNotes.add({
          refId: refIds[treeNote.refId],
          title: treeNote.title,
          root: {
            ...treeNote.root,
            id: refIds[treeNote.root.id],
          },
          createdAt: new Date(treeNote.createdAt),
          updatedAt: new Date(treeNote.updatedAt),
        });
        promises.push(treeNotesPromise);
      }

      promises = await Promise.all(promises);
      setUpdate(update + 1);
      return promises;
    } catch (error) {
      console.log("Failed to import", error);
    }
  };

  const handleImportTreeNote = async (e, type = 1) => {
    switch (type) {
      case 1:
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = JSON.parse(e.target.result);
          await handleImport(result);
        };
        reader.readAsText(file);
        break;
      case 2:
        const url = e;
        const result = JSON.parse(atob(url));
        await handleImport(result);
        window.location.href = "/";
        break;
      default:
        break;
    }
  };

  const handleShareTreeNote = async (refId, setCopied) => {
    const treeNotes = [];
    const treeNote = await db.treeNotes.where("refId").equals(refId).first();
    treeNotes.push(treeNote);
    const result = {
      treeNotes,
    };
    const json = toJSON(result);
    const jsonStr = JSON.stringify(json);
    const jsonb64 = btoa(jsonStr);

    const url = `${window.location.origin}?name=${treeNote.title}&note=${jsonb64}`;
    copyToClipboard(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    console.log("copied", str);
  };

  const handleNumberOfAllChildrenForThatParent = (node, i = 1, root) => {
    if (node?.children?.length === 0 || node?.expanded === false) {
      node.numberOfAllChildren = 1;
      if (i > root.numberOfLevels || !root?.numberOfLevels)
        root.numberOfLevels = i;
      return 1;
    }
    let count = 0;
    node?.children?.forEach((child) => {
      count += handleNumberOfAllChildrenForThatParent(child, i + 1, root);
    });

    node.numberOfAllChildren = count;
    return count;
  };

  const handleFinalPositionCalculation = (node, i) => {
    // if (node?.expanded === false) return 1;
    let count = i;
    node.fp = node.numberOfAllChildren / 2 + i;
    node?.children?.forEach((child) => {
      count = count + handleFinalPositionCalculation(child, count);
    });
    return node.numberOfAllChildren;
  };

  const handlePositionCalculation = (root) => {
    handleNumberOfAllChildrenForThatParent(root, 1, root);
    handleFinalPositionCalculation(root, 0);
  };

  const handleExpanded = (node) => {
    node.expanded = !node.expanded;
    setCurrentTreeNote((prev) => {
      db.treeNotes
        .where("refId")
        .equals(prev.refId)
        .modify({ root: prev.root });
      handlePositionCalculation(prev.root);
      return { ...prev };
    });
    setUpdate(update + 1);
  };

  return {
    handleDeleteNodeWithoutItsChildren,
    handleDeleteNodeWithItsChildren,
    handleMoveNode,
    handleReorderNode,
    handleExportTreeNote,
    handleImportTreeNote,
    handleShareTreeNote,
    handleDeleteTreeNote,
    handlePositionCalculation,
    handleExpanded,
  };
};
