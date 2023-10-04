// @ts-check
import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import { createNode, addChild, updateNode } from "../../hooks/useTree";
import { v4 } from "uuid";
import { useFunctions } from "../../hooks/useFunctions";
import FontsizeIcon from "../../assets/Icons/FontsizeIcon";
import StrickthroughIcon from "../../assets/Icons/StrickthroughIcon";
import ItalicIcon from "../../assets/Icons/ItalicIcon";
import BoldIcon from "../../assets/Icons/BoldIcon";
import ColorIcon from "../../assets/Icons/ColorIcon";

const AddEditNode = () => {
  // destructuring state from context
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    addEditNode,
    setAddEditNode,
    setUpdate,
    defaultNodeConfig,
  } = useStateContext();

  // destructuring functions from custom hook
  const { handlePositionCalculation } = useFunctions();

  // local state
  const [node, setNode] = useState({
    title: "",
    data: [],
    config: {},
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
      const newChildNode = createNode(v4(), node.title, node.data, node.config);
      addChild(parentNode, newChildNode);
      handlePositionCalculation(root);
    }
    // else if edit node then update node
    else if (addEditNode.type === "edit") {
      updateNode(parentNode, node.title, node.data, null, node.config);
    }

    // update currentFlowPlan and database
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateDb(root, currentFlowPlan.refId);

    // reset local state and close addEditNode component
    setNode({
      title: "",
      data: [],
      config: {},
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
        config:
          parentNode?.config && Object.keys(parentNode?.config)?.length
            ? parentNode?.config
            : defaultNodeConfig,
      });
    } else {
      setNode({
        title: "",
        data: [],
        config: defaultNodeConfig,
      });
    }
    console.log("run");
    // focus on input element after 200ms
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 200);
  }, [addEditNode.show, addEditNode.location, addEditNode.type]);

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
        <div className="w-full h-full flex flex-col justify-center items-center gap-1 border-b-2 border-[var(--border-primary)]">
          {/* Header if addEditNode.type is add then show add node else show edit node */}
          <h3 className="px-2 py-2 w-full text-center text-[var(--text-primary)] text-lg font-medium tracking-wider border-b-2 border-[var(--border-primary)] ">
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
        addEditNode.show
          ? "-translate-x-[24px] rotate-180"
          : "-translate-x-[24px] rotate-180"
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
      className="w-full flex-1 flex flex-col mt-1 gap-2 px-2 py-3"
      onSubmit={handleAddEditNode}
    >
      <div className="flex-1 flex flex-col justify-start items-center gap-2">
        <InputTitle node={node} setNode={setNode} inputRef={inputRef} />
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

const InputTitle = ({ node, setNode, inputRef }) => {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    console.log("S", node.config);
    setConfig(node.config);
  }, [node]);
  return (
    <div className="w-full flex flex-col justify-center items-start gap-1">
      <label
        htmlFor="title"
        className="text-[var(--text-primary)] text-sm font-medium"
      >
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
        style={{
          fontSize: `${config?.titleConfig?.fontSize}px`,
          textDecoration: `${
            config?.titleConfig?.strickthrough ? "line-through" : "none"
          }`,
          fontStyle: `${config?.titleConfig?.italic ? "italic" : "normal"}`,
          fontWeight: `${config?.titleConfig?.bold ? "bold" : "normal"}`,
          color: `${config?.titleConfig?.color}`,
        }}
      />
      <InputTitleButtons config={config} node={node} setNode={setNode} />
    </div>
  );
};

const InputTitleButtons = ({ config, node, setNode }) => {
  const [colorActive, setColorActive] = useState(false);
  const [fontSizeActive, setFontSizeActive] = useState(false);
  const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26];
  const colors = [
    "#e5e7eb",
    "#000000",
    "#ff0000",
    "#a9f0d1",
    "#ffc100",
    "#2a9d8f",
  ];
  const handleFontSizeClick = () => {
    setFontSizeActive((prev) => !prev);
  };
  const handleColorClick = () => {
    setColorActive((prev) => !prev);
  };
  const handleFontSizeChange = (e) => {
    e.stopPropagation();
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: {
          ...config.titleConfig,
          fontSize: parseInt(e.target.value),
        },
      },
    });
    setFontSizeActive(false);
  };
  const handleColorChange = (e) => {
    e.stopPropagation();
    setNode({
      ...node,
      config: {
        ...config,

        titleConfig: {
          ...config.titleConfig,
          color: e.target.value,
        },
      },
    });
    setColorActive(false);
  };
  const handleActiveColorChange = (e) => {
    e.stopPropagation();
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: {
          ...config.titleConfig,
          color: e.target.value,
        },
      },
    });
  };

  const handleStrickthroughClick = () => {
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: {
          ...config.titleConfig,
          strickthrough: !config.titleConfig.strickthrough,
        },
      },
    });
  };
  const handleItalicClick = () => {
    setNode({
      ...node,
      config: {
        ...config,

        titleConfig: {
          ...config.titleConfig,
          italic: !config.titleConfig.italic,
        },
      },
    });
  };

  const handleBoldClick = () => {
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: {
          ...config.titleConfig,
          bold: !config.titleConfig.bold,
        },
      },
    });
  };

  return (
    <div className="w-full mt-1 flex justify-center items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={handleFontSizeClick}
          className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300 relative"
        >
          <FontsizeIcon />
          <span className="absolute -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium">
            {config?.titleConfig?.fontSize}
          </span>
        </button>
        {fontSizeActive && (
          <div className="hide absolute flex flex-col w-8 top-9 rounded-md  bg-[var(--btn-secondary)]">
            {fontSizes.map((fontSize) => (
              <label
                key={`fontsize-id-${fontSize}`}
                className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300"
                style={{
                  fontSize: `${fontSize}px`,
                  backgroundColor: `${
                    config?.titleConfig?.fontSize === fontSize
                      ? "var(--btn-edit)"
                      : ""
                  }`,
                }}
              >
                <input
                  className="w-full h-full bg-blue-500 absolute opacity-0"
                  type="radio"
                  value={fontSize}
                  checked={config?.titleConfig?.fontSize === fontSize}
                  onChange={handleFontSizeChange}
                />
                {fontSize}
              </label>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-add)] transition-colors duration-300"
        onClick={handleStrickthroughClick}
      >
        <StrickthroughIcon />
        <span
          style={{
            textDecoration: `${
              config?.titleConfig?.strickthrough ? "line-through" : "none"
            }`,
          }}
          className="absolute -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium"
        >
          T
        </span>
      </button>
      <button
        type="button"
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-move)] transition-colors duration-300"
        onClick={handleItalicClick}
      >
        <ItalicIcon />
        <span
          style={{
            fontStyle: `${config?.titleConfig?.italic ? "italic" : "normal"}`,
          }}
          className="absolute -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium"
        >
          T
        </span>
      </button>
      <button
        type="button"
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-add)] transition-colors duration-300"
        onClick={handleBoldClick}
      >
        <BoldIcon />
        <span
          style={{
            fontWeight: `${config?.titleConfig?.bold ? "bold" : "normal"}`,
          }}
          className="absolute -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium"
        >
          T
        </span>
      </button>

      <div className="relative">
        <button
          type="button"
          className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
          onClick={handleColorClick}
        >
          <ColorIcon />
          <span
            className="absolute w-3 h-3 rounded-full inline-block -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium"
            style={{
              background: config?.titleConfig?.color,
            }}
          ></span>
        </button>
        {colorActive && (
          <div className="hide absolute flex flex-col items-center gap-1 w-8 top-9 p-1 rounded-md  bg-[var(--btn-secondary)] overflow-hidden">
            {colors.map((color) => (
              <label
                key={`color-id-${color}`}
                className="shrink-0 w-6 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300 hover:cursor-pointer"
                style={{
                  background: color,
                }}
              >
                <input
                  className="w-full h-full absolute opacity-0"
                  type="radio"
                  value={color}
                  checked={config?.titleConfig?.color === color}
                  onChange={handleColorChange}
                />
              </label>
            ))}
            <label
              className="shrink-0 w-6 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,190,0,1) 35%, rgba(0,213,255,1) 100%)",
              }}
            >
              <input
                className="w-full h-full absolute opacity-0"
                type="color"
                onChange={handleActiveColorChange}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditNode;
