// @ts-check
import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import { createNode, addChild, updateNode } from "../../hooks/useTree";
import { v4 } from "uuid";
import { useFunctions } from "../../hooks/useFunctions";

const AddEditNode = () => {
  // destructuring state from context
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    addEditNode,
    setAddEditNode,
    setUpdate,
  } = useStateContext();

  // destructuring functions from custom hook
  const { handlePositionCalculation } = useFunctions();

  // local state
  const [node, setNode] = useState({
    title: "",
    data: [],
  });

  // refence to input element
  const inputRef = useRef(null);

  // helper function for updating database
  const handleUpdateDb = async (node, refId) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({ root: node, updatedAt: new Date() });
  };

  // helper function for adding and editing a node
  const handleAddEditNode = async (e) => {
    // prevent default form submission
    e.preventDefault();
    // root node
    let root = currentFlowPlan.root;
    let parentNode = currentFlowPlan.root;

    // loop through location array to get parent node to edit
    addEditNode.location.forEach((index) => {
      parentNode = parentNode.children[index];
    });

    // if add node then create new node and add it to parent node
    if (addEditNode.type === "add") {
      const newChildNode = createNode(v4(), node.title, node.data);
      addChild(parentNode, newChildNode);
      handlePositionCalculation(root);
    }
    // else if edit node then update node
    else if (addEditNode.type === "edit") {
      updateNode(parentNode, node.title, node.data);
    }

    // update currentFlowPlan and database
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateDb(root, currentFlowPlan.refId);

    // reset local state and close addEditNode component
    setNode({
      title: "",
      data: [],
    });
    setAddEditNode((prev) => ({ ...prev, location: null, show: false }));

    // update DisplayTree component
    setUpdate((prev) => prev + 1);
  };

  // set node title and data when addEditNode component is opened
  useEffect(() => {
    // if addEditNode component is not open then return
    if (!addEditNode.show) return;
    // if inputRef is not set then return
    if (!inputRef.current) return;
    // if addEditNode type is add then set node title and data to empty string
    if (addEditNode.type === "edit") {
      let parentNode = currentFlowPlan.root;
      addEditNode.location.forEach((index) => {
        parentNode = parentNode.children[index];
      });
      setNode({
        title: parentNode.title,
        data: parentNode.data,
      });
    }
    // focus on input element after 200ms
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  }, [addEditNode.show, addEditNode.location]);

  return (
    <div
      className={`${
        // if addEditNode.show is true then show component else hide component
        !addEditNode.show ? "translate-x-full" : ""
      } z-10 transition-all duration-200 w-[280px] grow-0 h-full absolute right-0 top-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-l-2 border-[var(--border-primary)]`}
    >
      <OpenCloseButton
        addEditNode={addEditNode}
        setAddEditNode={setAddEditNode}
      />

      {/* if addEditNode.location is null then show select a node else show addEditNode component */}
      {addEditNode.location === null ? (
        <h1 className="text-[var(--text-primary)]">Select A Node!</h1>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center p-3 px-2 gap-1 border-b-2 border-[var(--border-primary)]">
          {/* Header if addEditNode.type is add then show add node else show edit node */}
          <h3 className="text-[var(--text-primary)] text-lg font-medium tracking-wider ">
            {addEditNode.type === "add" ? "Add" : "Edit"} Node
          </h3>

          {/* Form for adding and editing a node */}
          <Form
            handleAddEditNode={handleAddEditNode}
            addEditNode={addEditNode}
            inputRef={inputRef}
            setNode={setNode}
            node={node}
          />
        </div>
      )}
    </div>
  );
};

// Button components
const OpenCloseButton = ({ addEditNode, setAddEditNode }) => {
  return (
    <button
      className={`${
        // if addEditNode.show is true then rotate close open button else rotate backIcon 180deg
        addEditNode.show ? "-translate-x-[24px] rotate-180" : "-translate-x-[24px] rotate-180"
      } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute left-0 z-10 bg-[var(--bg-tertiary)] flex justify-center items-center p-1 cursor-pointer border-r-2 border-t-2 border-b-2 border-[var(--border-primary)]`}
      onClick={() => setAddEditNode((prev) => ({ ...prev, show: !prev.show }))}
    >
      <BackIcon />
    </button>
  );
};

// Other components
const Form = ({ handleAddEditNode, addEditNode, inputRef, setNode, node }) => {
  return (
    <form
      className="w-full flex-1 flex flex-col mt-1 gap-2"
      onSubmit={handleAddEditNode}
    >
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <div className="w-full flex flex-col justify-center items-start gap-1">
          <label htmlFor="title" className="text-[var(--text-primary)] text-sm font-medium">
            Title:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={node.title}
            onChange={(e) => setNode({ ...node, title: e.target.value })}
            placeholder="Enter note title..."
            required
            className="text-[var(--text-primary)] w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          />
        </div>
      </div>
      <button
        type="submit"
        className="text-[var(--text-primary)] h-fit bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
      >
        {addEditNode.type === "add" ? "Add" : "Edit"}
      </button>
    </form>
  );
};

export default AddEditNode;
