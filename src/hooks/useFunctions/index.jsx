import { v4 } from "uuid";
import { useStateContext } from "../../context/StateContext";
import { deleteNode, moveNode, removeChild, reorderNode } from "../useTree";

export const useFunctions = () => {
  // destructure state from context
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    update,
    setUpdate,
    move,
    setMove,
  } = useStateContext();

  // function to handle update tree note
  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  // function to handle delete node without its children
  const handleDeleteNodeWithoutItsChildren = async (parent, node, location) => {
    // function to delete node
    deleteNode(parent, node, location);
    // update current tree note
    let root = currentFlowPlan?.root;
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    // update tree note in indexedDB
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    // handle position calculation
    handlePositionCalculation(root);
    // update state
    setUpdate(update + 1);
  };

  // function to handle delete node with its children
  const handleDeleteNodeWithItsChildren = async (parent, node) => {
    let root = currentFlowPlan.root;
    // function to delete node
    removeChild(parent, node);
    // update current tree note
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    // update tree note in indexedDB
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    // handle position calculation
    handlePositionCalculation(root);
    // update state
    setUpdate(update + 1);
  };

  // function to handle move node
  const handleMoveNode = async (node) => {
    let root = currentFlowPlan.root;
    // function to move node
    moveNode(move.parent, move.node, node);
    // update current tree note
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    // reset move
    setMove({
      enable: false,
      node: null,
    });
    // update tree note in indexedDB
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    // handle position calculation
    handlePositionCalculation(root);
    // update state
    setUpdate(update + 1);
  };

  // function to handle reorder node
  const handleReorderNode = async (parent, type, location) => {
    let root = currentFlowPlan.root;
    // function to reorder node
    reorderNode(
      move.parent,
      parent,
      move.node,
      // if the node is the first child of its parent, then the location will be 0
      type === "first"
        ? 0
        : // if the node is the middle child of its parent, then the location will be the location of the node + 1
        type === "middle"
          ? location + 1
          : // if the node is the last child of its parent, then the location will be the length of the children of the parent
          type === "last"
            ? parent.children.length
            : 0,
      // last location of the node
      move.location[move.location.length - 1],
    );
    // update current tree note
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    // reset move
    setMove({
      enable: false,
      node: null,
    });
    // update tree note in indexedDB
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    // handle position calculation
    handlePositionCalculation(root);
    // update state
    setUpdate(update + 1);
  };

  // function to handle export tree note
  const handleExportFlowPlan = async (refIds) => {
    // initialize empty array to store tree notes
    const flowPlans = [];
    // loop through refIds
    for (let refId of refIds) {
      // get tree note from indexedDB
      const flowPlan = await db.flowPlans.where("refId").equals(refId).first();
      // push tree note to tree notes array
      flowPlans.push(flowPlan);
    }
    // create a data url
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(flowPlans));
    // create a download anchor node to download the json file
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `FlowPlans.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // function to handle import tree note
  const handleImport = async (flowPlans) => {
    try {
      // assign new refIds
      const refIds = {};
      for (let flowPlan of flowPlans) {
        refIds[flowPlan.refId] = v4();
      }
      //
      let promises = [];

      // loop through flow plans to add them to indexedDB
      for (let flowPlan of flowPlans) {
        const FlowPlansPromise = db.flowPlans.add({
          // assign new refId
          refId: refIds[flowPlan.refId],
          title: flowPlan.title,
          root: {
            ...flowPlan.root,
            id: refIds[flowPlan.root.id],
          },
          createdAt: new Date(flowPlan.createdAt),
          updatedAt: new Date(flowPlan.updatedAt),
        });
        // push promise to promises array
        promises.push(FlowPlansPromise);
      }
      // wait for all promises to resolve
      promises = await Promise.all(promises);
      // update state
      setUpdate(update + 1);
      return promises;
    } catch (error) {
      console.log("Failed to import", error);
    }
  };

  // function to handle import FlowPlans
  const handleImportFlowPlan = async (e, type = 1) => {
    switch (type) {
      // type 1: import from file
      case 1:
        // get file
        const file = e.target.files[0];
        // create a new file reader to read the file
        const reader = new FileReader();
        // when the file is loaded, parse the json file and call handleImport function
        reader.onload = async (e) => {
          // parse the json file
          const result = JSON.parse(e.target.result);
          await handleImport(result);
        };
        // read the file as text
        reader.readAsText(file);
        break;
      // type 2: import from url
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

  // function to handle delete tree note
  const handleDeleteFlowPlan = async (refId) => {
    // find tree note by refId and delete it
    await db.flowPlans.where("refId").equals(refId).delete();
    if (currentFlowPlan?.refId === refId) {
      setCurrentFlowPlan(null);
    }
  };

  // function to handle share tree note
  const handleShareFlowPlan = async (refId, setCopied) => {
    const flowPlans = [];
    const flowPlan = await db.flowPlans.where("refId").equals(refId).first();
    flowPlans.push(flowPlan);
    const jsonStr = JSON.stringify(flowPlans);
    const jsonb64 = btoa(jsonStr);

    const url = `${window.location.origin}?name=${flowPlan.title}&note=${jsonb64}`;
    copyToClipboard(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  // function to copy to clipboard
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

  // function to calculate the number of all children for that parent
  const handleNumberOfAllChildrenForThatParent = (node, i = 1, root) => {
    // if the node has no children or the node is not expanded,
    // then the number of all children for that parent is 1
    if (node?.children?.length === 0 || node?.expanded === false) {
      node.numberOfAllChildren = 1;
      // update the number of levels
      if (i > root.numberOfLevels || !root?.numberOfLevels)
        root.numberOfLevels = i;
      return 1;
    }
    // initialize count
    let count = 0;
    // loop through children of the node
    node?.children?.forEach((child) => {
      // add the number of all children for that child to count
      count += handleNumberOfAllChildrenForThatParent(child, i + 1, root);
    });
    // update the number of children for that parent
    node.numberOfAllChildren = count;
    // return count
    return count;
  };

  // function to calculate the final position of the node
  const handleFinalPositionCalculation = (node, i) => {
    let count = i;
    // final position of the node is the number of all children for that parent / 2 + i
    node.fp = node.numberOfAllChildren / 2 + i;
    // loop through children of the node
    node?.children?.forEach((child) => {
      // add the number of all children for that child to count
      count = count + handleFinalPositionCalculation(child, count);
    });
    // return number of all children for that parent
    return node.numberOfAllChildren;
  };

  // function to handle position calculation
  const handlePositionCalculation = (root) => {
    // reseting number of levels
    root.numberOfLevels = 1;
    handleNumberOfAllChildrenForThatParent(root, 1, root);
    handleFinalPositionCalculation(root, 0);
  };

  // function to handle expanded
  const handleExpanded = async (node) => {
    // toggle expanded
    node.expanded = !node.expanded;
    let root = currentFlowPlan.root;
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    // update tree note in indexedDB
    await handleUpdateIndexDB(currentFlowPlan.refId, root, false);
    // handle position calculation
    handlePositionCalculation(root);
    // update state
    setUpdate(update + 1);
  };
  const handleGetValueFromProperty = (property) => {
    try {
      const rootStyle = getComputedStyle(document.documentElement);
      property = property.replace("var(", "").replace(")", "");
      return rootStyle.getPropertyValue(property);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const handleGetRandomColor = () => {
    const colors = [
      "#FF6633",
      "#FFB399",
      "#FF33FF",
      "#FFFF99",
      "#00B3E6",
      "#E6B333",
      "#3366E6",
      "#999966",
      "#99FF99",
      "#B34D4D",
      "#80B300",
      "#809900",
      "#E6B3B3",
      "#6680B3",
      "#66991A",
      "#FF99E6",
      "#CCFF1A",
      "#FF1A66",
      "#E6331A",
      "#33FFCC",
      "#66994D",
      "#B366CC",
      "#4D8000",
      "#B33300",
      "#CC80CC",
      "#66664D",
      "#991AFF",
      "#E666FF",
      "#4DB3FF",
      "#1AB399",
      "#E666B3",
      "#33991A",
      "#CC9999",
      "#B3B31A",
      "#00E680",
      "#4D8066",
      "#809980",
      "#E6FF80",
      "#1AFF33",
      "#999933",
      "#FF3380",
      "#CCCC00",
      "#66E64D",
      "#4D80CC",
      "#9900B3",
      "#E64D66",
      "#4DB380",
      "#FF4D4D",
      "#99E6E6",
      "#6666FF",
      "#993366",
      "#FFFFCC",
      "#CC6699",
      "#66B2FF",
      "#B2FF66",
      "#FFCC00",
      "#FF99CC",
      "#FF6666",
      "#66FF66",
      "#CCFF00",
      "#00FFCC",
      "#CCFFCC",
      "#FF6600",
      "#66FFCC",
      "#FF0066",
      "#33FF66",
      "#FFFF00",
      "#00FF00",
      "#00FFFF",
      "#FF00FF",
      "#FF0000",
      "#00FF33",
      "#FF9900",
      "#6600FF",
      "#FF3366",
      "#66FFFF",
      "#FF9933",
      "#33FF99",
      "#FF3300",
      "#FFCC33",
      "#9933FF",
      "#66CCFF",
      "#3366FF",
      "#FF6699",
      "#FFCC99",
      "#66FF33",
      "#99FF66",
      "#FF6666",
      "#FF9966",
      "#66FF66",
      "#66FF66",
      "#66FF66",
      "#66FF66",
      "#66FF66",
      "#66FF66",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    // return randomColor;
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  // return functions
  return {
    handleDeleteNodeWithoutItsChildren,
    handleDeleteNodeWithItsChildren,
    handleMoveNode,
    handleReorderNode,
    handleExportFlowPlan,
    handleImportFlowPlan,
    handleShareFlowPlan,
    handleDeleteFlowPlan,
    handlePositionCalculation,
    handleExpanded,
    handleGetValueFromProperty,
    handleGetRandomColor,
    copyToClipboard,
  };
};
