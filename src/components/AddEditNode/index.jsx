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
import InheritIcon from "../../assets/Icons/InheritIcon";
import ResetToDefaultIcon from "../../assets/Icons/ResetToDefaultIcon";
import useClickOutside from "../../hooks/useClickOutside";
import FontIcon from "../../assets/Icons/FontIcon";
import PreviewIcon from "../../assets/Icons/PreviewIcon";
import MoveIcon from "../../assets/Icons/MoveIcon";
import EditBtnIcon from "../../assets/Icons/EditBtnIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import RandomIcon from "../../assets/Icons/RandomIcon";
import CopyIcon from "../../assets/Icons/CopyIcon";
import PasteIcon from "../../assets/Icons/PasteIcon";
import CustomizeIcon from "../../assets/Icons/CustomizeIcon";

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
  const [currentNodeConfig, setCurrentNodeConfig] = useState(null);

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

      const config =
        parentNode?.config && Object.keys(parentNode?.config)?.length
          ? parentNode?.config
          : defaultNodeConfig;

      setNode({
        title: parentNode.title,
        data: parentNode.data,
        config: config,
      });
      setCurrentNodeConfig(structuredClone(config));
    } else {
      setNode({
        title: "",
        data: [],
        config: defaultNodeConfig,
      });
    }
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
      } z-10 transition-all duration-200 w-max-[280px] w-[280px] grow-0 h-full absolute right-0 top-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-l-2 border-[var(--border-primary)]`}
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
            currentNodeConfig={currentNodeConfig}
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
const Form = ({
  handleAddEditNode,
  addEditNode,
  inputRef,
  setNode,
  node,
  currentNodeConfig,
}) => {
  const {setCurrentFlowPlanNode, setAddEditNode} = useStateContext();
  const [config, setConfig] = useState(null);
  useEffect(() => {
    setConfig(node.config);
  }, [node.config]);

  const handleOpenDocView = () => {
    setCurrentFlowPlanNode(addEditNode.location)
    setAddEditNode((prev) => ({ ...prev, show: false }));
  }

  return (
    <form
      className="w-full h-[calc(100%_-_46px)] flex flex-col justify-between gap-2 py-1"
      onSubmit={handleAddEditNode}
    >
      <div className="w-full overflow-x-auto flex flex-col justify-start items-center gap-2">
        <InputTitle
          node={node}
          setNode={setNode}
          inputRef={inputRef}
          config={config}
        />
        <NodeConfig
          node={node}
          setNode={setNode}
          config={config}
          currentNodeConfig={currentNodeConfig}
        />
      </div>
      <div className="w-full flex-grow flex flex-col gap-2 px-2">
        <button
          className="cursor-pointer w-full flex-grow rounded-md border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          type="button"
          onClick={handleOpenDocView}
        >
          Click To Add More Fields!
        </button>
        <button
          type="submit"
          className="w-full text-[var(--text-primary)] h-fit bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
        >
          {addEditNode.type === "add" ? "Add" : "Save"}
        </button>
      </div>
    </form>
  );
};

const InputTitle = ({ node, setNode, inputRef, config }) => {
  const handleTitleChange = (e) => {
    setNode({ ...node, title: e.target.value });
  };
  return (
    <div className="w-full flex flex-col justify-center items-start gap-1 px-2">
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
        onChange={handleTitleChange}
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
          fontFamily: `${config?.titleConfig?.fontFamily}`,
          color: `${config?.titleConfig?.color}`,
        }}
      />
      <InputTitleButtons config={config} node={node} setNode={setNode} />
    </div>
  );
};

const InputTitleButtons = ({ config, node, setNode }) => {
  const { defaultNodeConfig } = useStateContext();
  const { handleGetRandomColor } = useFunctions();
  const {
    ref: fontSizeRef,
    isActive: fontSizeActive,
    setIsActive: setFontSizeActive,
  } = useClickOutside(false);
  const {
    ref: colorRef,
    isActive: colorActive,
    setIsActive: setColorActive,
  } = useClickOutside(false);
  const {
    ref: fontFamilyRef,
    isActive: fontFamilyActive,
    setIsActive: setFontFamilyActive,
  } = useClickOutside(false);

  const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26];
  const colors = [
    "#e5e7eb",
    "#000000",
    "#ff0000",
    "#a9f0d1",
    "#ffc100",
    "#2a9d8f",
  ];
  const fontFamilies = [
    "Poppins",
    "Monospace",
    "Times",
    "Courier New",
    "Courier",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
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

  const handleFontFamilyClick = () => {
    setFontFamilyActive((prev) => !prev);
  };

  const handleFontFamilytChange = (e) => {
    e.stopPropagation();
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: {
          ...config.titleConfig,
          fontFamily: e.target.value,
        },
      },
    });
    setFontFamilyActive(false);
  };

  const handleSetTitleColor = (color) => {
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: {
          ...config.titleConfig,
          color: color,
        },
      },
    });
  };

  const handleResetToDefaultTitleConfig = () => {
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: {
          ...defaultNodeConfig.titleConfig,
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
          <div
            ref={fontSizeRef}
            className="hide z-10 absolute flex flex-col w-8 top-9 rounded-md  bg-[var(--btn-secondary)] border border-[var(--border-primary)]"
          >
            {fontSizes.map((fontSize) => (
              <label
                key={`fontsize-id-${fontSize}`}
                className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300 text-[var(--text-primary)]"
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
          <div
            ref={colorRef}
            className="hide z-10 absolute flex flex-col items-center gap-1 w-8 top-9 p-1 rounded-md  bg-[var(--btn-secondary)] overflow-hidden"
          >
            {colors.map((color) => (
              <label
                key={`color-id-${color}`}
                className="shrink-0 w-6 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300 hover:cursor-pointer"
                style={{
                  background: color,
                }}
              >
                <input
                  className="w-full h-full absolute opacity-0 cursor-pointer"
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
                className="w-full h-full absolute opacity-0 cursor-pointer"
                type="color"
                value={config?.titleConfig?.color}
                onChange={handleActiveColorChange}
              />
            </label>
            <label className="shrink-0 w-6 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300">
              <RandomIcon />
              <button
                type="button"
                className="w-full h-full absolute opacity-0 cursor-pointer"
                onClick={() => handleSetTitleColor(handleGetRandomColor())}
              ></button>
            </label>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={handleFontFamilyClick}
          className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300 relative"
        >
          <FontIcon />
          <span
            style={{
              fontFamily: `${config?.titleConfig?.fontFamily}`,
            }}
            className="absolute -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium"
          >
            Aa
          </span>
        </button>
        {fontFamilyActive && (
          <div
            ref={fontFamilyRef}
            className="hide z-10 absolute flex flex-col w-8 top-9 rounded-md  bg-[var(--btn-secondary)] border border-[var(--border-primary)]"
          >
            {fontFamilies.map((fontFamily) => (
              <label
                key={`fontsize-id-${fontFamily}`}
                className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300 text-[var(--text-primary)]"
                style={{
                  fontFamily: `${fontFamily}`,
                  backgroundColor: `${
                    config?.titleConfig?.fontFamily === fontFamily
                      ? "var(--btn-edit)"
                      : ""
                  }`,
                }}
              >
                <input
                  title={fontFamily}
                  className="w-full h-full bg-blue-500 absolute opacity-0"
                  type="radio"
                  value={fontFamily}
                  checked={config?.titleConfig?.fontFamily === fontFamily}
                  onChange={handleFontFamilytChange}
                />
                Aa
              </label>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleResetToDefaultTitleConfig}
        title="Reset To Default"
        className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300 relative"
      >
        <ResetToDefaultIcon />
      </button>
    </div>
  );
};

const NodeConfig = ({ node, setNode, config, currentNodeConfig }) => {
  return (
    <div className="w-full flex flex-col justify-start items-center ">
      <h4
        className="text-[var(--text-primary)] text-sm font-medium 
      border-t-2 py-1 border-[var(--border-primary)] w-full text-center
     "
      >
        Node Settings
      </h4>
      <div className="w-full flex flex-col justify-start items-start px-2">
        <NodePreview node={node} setNode={setNode} config={config} />
        <RandomColors node={node} setNode={setNode} config={config} />
        <CustomizeColors node={node} config={config} setNode={setNode} />
        <OpacitySelector config={config} node={node} setNode={setNode} />
        <CopyPasteNodeConfig config={config} node={node} setNode={setNode} />
        <MoreOptions
          config={config}
          node={node}
          setNode={setNode}
          currentNodeConfig={currentNodeConfig}
        />
      </div>
    </div>
  );
};
const NodePreview = ({ node, setNode, config }) => {
  const [showPreview, setShowPreview] = useState(false);
  const handleShowPreview = () => {
    setShowPreview((prev) => !prev);
  };
  return (
    <div className="shrink-0 w-full flex flex-col justify-start items-center">
      <button
        type="button"
        onClick={handleShowPreview}
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
      >
        <span>{showPreview ? "Hide" : "Show"} Node Preview</span>
        <span className="rounded-md inline-block w-8 h-5 cursor-pointer border border-[var(--border-primary)]">
          <PreviewIcon />
        </span>
      </button>
      {showPreview && (
        <div className="duration-500 pb-1">
          <div
            className={`overflow-hidden flex flex-col justify-between items-center border-2 border-[var(--border-primary)] bg-[var(--bg-quaternary)] text-gray-200 rounded-md gap-1`}
            // set node width and height from settings
            style={{
              width: 220 + "px",
              height: 100 + "px",
              background: node.config?.nodeConfig?.backgroundColor,
              borderColor: node.config?.nodeConfig?.borderColor,
            }}
            ref={(n) =>
              n?.style?.setProperty(
                "opacity",
                // "0.5",
                `${node?.config?.nodeConfig?.opacity / 100}`,
                "important"
              )
            }
          >
            {/* Node Body */}
            <div className="w-full h-full flex flex-col justify-between items-center">
              {/* Node Title */}
              <h3
                style={{
                  fontSize: `${node?.config?.titleConfig?.fontSize}px`,
                  textDecoration: `${
                    node?.config?.titleConfig?.strickthrough
                      ? "line-through"
                      : "none"
                  }`,
                  fontStyle: `${
                    node?.config?.titleConfig?.italic ? "italic" : "normal"
                  }`,
                  fontWeight: `${
                    node?.config?.titleConfig?.bold ? "bold" : "normal"
                  }`,
                  color: `${node?.config?.titleConfig?.color}`,
                  fontFamily: `${node?.config?.titleConfig?.fontFamily}`,
                  borderColor: `${node?.config?.nodeConfig?.borderColor}`,
                }}
                className="text-[var(--text-primary)] w-full text-center text-2xl truncate border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
              >
                {node?.title}
              </h3>
              {/* Node Buttons */}
              <ButtonsWrapper node={node} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RandomColors = ({ node, setNode, config }) => {
  const { handleGetRandomColor } = useFunctions();
  const handleRandomColors = () => {
    setNode({
      ...node,
      config: {
        ...config,
        nodeConfig: {
          ...config.nodeConfig,
          backgroundColor: handleGetRandomColor(),
          borderColor: handleGetRandomColor(),
          buttonColor: handleGetRandomColor(),
          pathColor: handleGetRandomColor(),
        },
      },
    });
  };
  return (
    <div className="shrink-0 w-full flex justify-center items-center gap-2">
      <button
        type="button"
        onClick={handleRandomColors}
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
      >
        <span>Random Colors</span>
        <span className="rounded-md inline-block w-8 h-5 cursor-pointer border border-[var(--border-primary)]">
          <RandomIcon />
        </span>
      </button>
    </div>
  );
};

const CustomizeColors = ({ node, setNode, config }) => {
  const [showCustomizeColors, setShowCustomizeColors] = useState(false);
  const handleShowCustomizeColors = () => {
    setShowCustomizeColors((prev) => !prev);
  };
  return (
    <>
      <div className="shrink-0 w-full flex justify-center items-center gap-2">
        <button
          type="button"
          onClick={handleShowCustomizeColors}
          className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
        >
          <span>{showCustomizeColors ? "Hide" : "Show"} Customize Colors</span>
          <span className="rounded-md inline-block w-8 h-5 cursor-pointer border border-[var(--border-primary)]">
            <CustomizeIcon/>
          </span>
        </button>
      </div>
      {showCustomizeColors && (
        <>
          <ColorSelector
            config={config}
            node={node}
            setNode={setNode}
            title={"Background Color"}
            type={"backgroundColor"}
          />
          <ColorSelector
            config={config}
            node={node}
            setNode={setNode}
            title={"Border Color"}
            type={"borderColor"}
          />
          <ColorSelector
            config={config}
            node={node}
            setNode={setNode}
            title={"Button Color"}
            type={"buttonColor"}
          />
          <ColorSelector
            config={config}
            node={node}
            setNode={setNode}
            title={"Connection Color"}
            type={"pathColor"}
          />
        </>
      )}
    </>
  );
};
// Buttons For Node Component
const ButtonsWrapper = ({ node }) => {
  // function to handle move node

  return (
    // Buttons Wrapper
    <div className="shrink-0 w-full flex justify-center items-center gap-2 p-2">
      {/* Move Node Button */}
      <button
        className={`cursor-pointer w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-move)] transition-colors duration-300`}
        style={{
          background: node?.config?.nodeConfig?.buttonColor,
        }}
      >
        <MoveIcon />
      </button>
      {/* Add Node Button */}
      <button
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-add)] transition-colors duration-300"
        style={{
          background: node?.config?.nodeConfig?.buttonColor,
        }}
      >
        <span className="absolute group-hover:rotate-90 transition-all duration-300 block w-[3px] rounded-md h-4 bg-[var(--logo-primary)]"></span>
        <span className="absolute group-hover:rotate-90 transition-all duration-300 block w-4 rounded-md h-[3px] bg-[var(--logo-primary)]"></span>
      </button>
      {/* Expand Node Button */}
      {
        // check if node has children
        node?.children?.length > 0 && (
          //  then show expand node button
          <button
            className="w-8 h-8 group text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-expand)] transition-colors duration-300"
            style={{
              background: node?.config?.nodeConfig?.buttonColor,
            }}
          >
            <span
              className={`w-full h-full -rotate-90 flex justify-center items-center transition-all duration-300 transform group-hover:scale-125`}
            >
              <BackIcon />
            </span>
          </button>
        )
      }
      {/* Edit Node Button */}
      <button
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
        style={{
          background: node?.config?.nodeConfig?.buttonColor,
        }}
      >
        <EditBtnIcon />
      </button>
      {/* Delete Node Button */}
      <button
        className="w-8 h-8 flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
        style={{
          background: node?.config?.nodeConfig?.buttonColor,
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

const ColorSelector = ({ title, type, node, setNode, config }) => {
  const {
    ref: colorRef,
    isActive: colorActive,
    setIsActive: setColorActive,
  } = useClickOutside(false);
  const { handleGetValueFromProperty, handleGetRandomColor } = useFunctions();
  const colors = ["#e5e7eb", "#000000", "#ff0000", "#a9f0d1", "#ffc100"];
  const handleColorClick = () => {
    setColorActive((prev) => !prev);
  };
  const handleColorChange = (e) => {
    e.stopPropagation();
    setNode({
      ...node,
      config: {
        ...config,
        nodeConfig: {
          ...config.nodeConfig,
          [type]: e.target.value,
        },
      },
    });
  };

  const handleSetColor = (color) => {
    setNode({
      ...node,
      config: {
        ...config,
        nodeConfig: {
          ...config.nodeConfig,
          [type]: color,
        },
      },
    });
  };

  return (
    <div className="shrink-0 w-full flex flex-col">
      <label
        htmlFor="title"
        className="relative w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium  "
      >
        <button
          type="button"
          onClick={handleColorClick}
          className="absolute rounded-md w-full h-full cursor-pointer"
        ></button>
        {title}

        <span
          style={{
            background: config?.nodeConfig ? config?.nodeConfig[type] : "",
          }}
          className="rounded-md inline-block w-8 h-4 cursor-pointer border border-[var(--border-primary)]"
        ></span>
      </label>
      {colorActive && (
        <div
          ref={colorRef}
          className="relative flex justify-center items-center gap-1 w-full p-2 rounded-md  bg-[var(--btn-secondary)] mb-1"
        >
          <span
            className="absolute w-3 h-3 rounded-full inline-block -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium"
            style={{
              background:
                config?.nodeConfig !== undefined
                  ? config?.nodeConfig[type]
                  : "",
            }}
          ></span>
          {colors.map((color) => (
            <label
              key={`color-id-${color}-${type}`}
              className="shrink-0 w-8 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300 hover:cursor-pointer  border border-[var(--border-primary)]"
              style={{
                background: color,
              }}
            >
              <input
                className="w-full h-full absolute opacity-0"
                type="radio"
                value={color}
                checked={
                  config?.nodeConfig !== undefined
                    ? config?.nodeConfig[type] === color
                    : false
                }
                onChange={handleColorChange}
              />
            </label>
          ))}
          <label
            className="shrink-0 w-8 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,190,0,1) 35%, rgba(0,213,255,1) 100%)",
            }}
          >
            <input
              className="w-full h-full absolute opacity-0"
              type="color"
              value={
                config?.nodeConfig[type]?.includes("var")
                  ? handleGetValueFromProperty(config?.nodeConfig[type])
                  : config?.nodeConfig[type]
              }
              onChange={handleColorChange}
            />
          </label>
          <label className="shrink-0 w-8 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300">
            <RandomIcon />
            <button
              type="button"
              className="w-full h-full absolute opacity-0"
              onClick={() => handleSetColor(handleGetRandomColor())}
            ></button>
          </label>
        </div>
      )}
    </div>
  );
};
const OpacitySelector = ({ node, setNode, config }) => {
  const {
    ref: opacityRef,
    isActive: opacityActive,
    setIsActive: setOpacityActive,
  } = useClickOutside(false);
  const opacitys = [20, 30, 40, 50, 60, 70, 80, 90, 100];
  const handleOpacityClick = (e) => {
    e.stopPropagation();
    setOpacityActive((prev) => !prev);
  };
  const handleOpacityChange = (e) => {
    e.stopPropagation();
    setNode({
      ...node,
      config: {
        ...config,
        nodeConfig: {
          ...config.nodeConfig,
          opacity: parseInt(e.target.value) ?? config?.nodeConfig?.opacity,
        },
      },
    });
  };

  return (
    <div className="shrink-0 w-full flex flex-col">
      <label className="relative w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium">
        Opacity
        <button
          type="button"
          onClick={handleOpacityClick}
          className="absolute rounded-md w-full h-full cursor-pointer"
        ></button>
        <span
          style={{
            opacity: config?.nodeConfig
              ? config?.nodeConfig?.opacity / 100
              : "",
          }}
          className="rounded-md w-8 h-4 cursor-pointer"
        >
          {config?.nodeConfig?.opacity}%
        </span>
      </label>
      {opacityActive && (
        <div
          ref={opacityRef}
          className="relative flex justify-center items-center gap-1 w-full p-2 rounded-md  bg-[var(--btn-secondary)] mb-1"
        >
          <span
            className="absolute w-3 h-3 rounded-full inline-block -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium"
            style={{
              opacity:
                config?.nodeConfig !== undefined
                  ? config?.nodeConfig?.opacity / 100
                  : "",
            }}
          ></span>
          {opacitys.map((opacity) => (
            <label
              key={`opacity-id-${opacity}`}
              className="shrink-0 w-6 h-4 rounded-md flex justify-center items-center relative transition-colors duration-300 hover:cursor-pointer text-[var(--text-primary)]"
              style={{
                opacity: opacity / 100,
              }}
            >
              <input
                className="w-full h-full absolute opacity-0"
                type="radio"
                value={opacity}
                checked={
                  config?.nodeConfig !== undefined
                    ? config?.nodeConfig?.opacity === opacity
                    : false
                }
                onChange={handleOpacityChange}
              />
              {opacity}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const CopyPasteNodeConfig = ({ node, setNode, config }) => {
  const { copyPasteNodeConfig, setCopyPasteNodeConfig } = useStateContext();
  const handleCopyNodeConfig = () => {
    setCopyPasteNodeConfig(config);
  };
  const handlePasteNodeConfig = () => {
    setNode({
      ...node,
      config: copyPasteNodeConfig,
    });
  };
  return (
    <div className="shrink-0 w-full flex flex-col justify-center items-center gap-">
      <button
        type="button"
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
        onClick={handleCopyNodeConfig}
      >
        <span>Copy Node Settings</span>
        <span className="rounded-md inline-block w-8 h-5 cursor-pointer border border-[var(--border-primary)]">
          <CopyIcon />
        </span>
      </button>
      <button
        type="button"
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
        onClick={handlePasteNodeConfig}
      >
        <span>Paste Node Settings</span>
        <span className="rounded-md inline-block w-8 h-5 cursor-pointer border border-[var(--border-primary)]">
          <PasteIcon />
        </span>
      </button>
    </div>
  );
};

const MoreOptions = ({ node, setNode, config, currentNodeConfig }) => {
  const { defaultNodeConfig, addEditNode, currentFlowPlan } = useStateContext();

  const handleGetParentNode = () => {
    const { location, type } = addEditNode;
    if (!location?.length) return;
    const tempLocation = structuredClone(location);
    if (type === "edit") tempLocation.pop();
    let parentNode = currentFlowPlan?.root;
    tempLocation.forEach((loc) => {
      parentNode = parentNode.children[loc];
    });
    return parentNode;
  };

  const handleCopyParentNodeSettingsToChildNode = () => {
    let parentNode = handleGetParentNode();
    const parentNodeConfig = structuredClone(parentNode?.config?.nodeConfig);
    if (!parentNodeConfig) return;
    setNode({
      ...node,
      config: {
        ...config,
        nodeConfig: parentNodeConfig,
      },
    });
  };
  const handleCopyParentTitleSettingsToChildNode = () => {
    let parentNode = handleGetParentNode();
    const parentTitleConfig = structuredClone(parentNode?.config?.titleConfig);
    if (!parentTitleConfig) return;
    setNode({
      ...node,
      config: {
        ...config,
        titleConfig: parentTitleConfig,
      },
    });
  };

  const handleResetToCurrent = () => {
    setNode({
      ...node,
      config: structuredClone(currentNodeConfig),
    });
  };

  const handleResetToDefault = () => {
    setNode({
      ...node,
      config: structuredClone(defaultNodeConfig),
    });
  };
  return (
    <div className="shrink-0 w-full flex flex-col">
      <label
        htmlFor="title"
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
      >
        Inherit Parent Node Settings
        <button
          type="button"
          className="rounded-md inline-block w-8 h-5 cursor-pointer hover:bg-[var(--btn-secondary)]"
          onClick={handleCopyParentNodeSettingsToChildNode}
        >
          <InheritIcon />
        </button>
      </label>
      <label
        htmlFor="title"
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
      >
        Inherit Parent Title Settings
        <button
          type="button"
          className="rounded-md inline-block w-8 h-5 cursor-pointer hover:bg-[var(--btn-secondary)]"
          onClick={handleCopyParentTitleSettingsToChildNode}
        >
          <InheritIcon />
        </button>
      </label>

      <label
        htmlFor="title"
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
      >
        Reset To Current
        <button
          type="button"
          className="rounded-md inline-block w-8 h-5 cursor-pointer hover:bg-[var(--btn-secondary)]"
          onClick={handleResetToCurrent}
        >
          <ResetToDefaultIcon />
        </button>
      </label>

      <label
        htmlFor="title"
        className="w-full rounded-md mb-1 p-2 flex justify-between gap-3 items-center  bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium"
      >
        Reset To Default
        <button
          type="button"
          className="rounded-md inline-block w-8 h-5 cursor-pointer hover:bg-[var(--btn-secondary)]"
          onClick={handleResetToDefault}
        >
          <ResetToDefaultIcon />
        </button>
      </label>
    </div>
  );
};

export default AddEditNode;
