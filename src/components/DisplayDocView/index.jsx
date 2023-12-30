// @ts-check
import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import CloseBtnIcon from "../../assets/Icons/CloseBtnIcon";
import TextIcon from "../../assets/Icons/TextIcon";
import ParagraphIcon from "../../assets/Icons/ParagraphIcon";
import ListIcon from "../../assets/Icons/ListIcon";
import TodoListIcon from "../../assets/Icons/TodoListIcon";
import NumberListIcon from "../../assets/Icons/NumberListIcon";
import LinkIcon from "../../assets/Icons/LinkIcon";
import ImageIcon from "../../assets/Icons/ImageIcon";
import FileIcon from "../../assets/Icons/FileIcon";
import TableIcon from "../../assets/Icons/TableIcon";
import SeparatorIcon from "../../assets/Icons/SeparatorIcon";
import TimeStampIcon from "../../assets/Icons/TimeStampIcon";
import CodeIcon from "../../assets/Icons/CodeIcon";
import { useFunctions } from "../../hooks/useFunctions";
import useClickOutside from "../../hooks/useClickOutside";
import FontsizeIcon from "../../assets/Icons/FontsizeIcon";
import StrickthroughIcon from "../../assets/Icons/StrickthroughIcon";
import ItalicIcon from "../../assets/Icons/ItalicIcon";
import BoldIcon from "../../assets/Icons/BoldIcon";
import ColorIcon from "../../assets/Icons/ColorIcon";
import RandomIcon from "../../assets/Icons/RandomIcon";
import FontIcon from "../../assets/Icons/FontIcon";
import ResetToDefaultIcon from "../../assets/Icons/ResetToDefaultIcon";
import LeftAlignIcon from "../../assets/Icons/LeftAlignIcon";
import CenterAlignIcon from "../../assets/Icons/CenterAlignIcon";
import RightAlignIcon from "../../assets/Icons/RightAlignIcon";
import { v4 } from "uuid";
import EditIcon from "../../assets/Icons/EditIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";

function DisplayDocView() {
  const {
    currentFlowPlan,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
    defaultNodeConfig,
  } = useStateContext();
  const config = currentFlowPlanNode?.config;
  const [currentFieldType, setCurrentFieldType] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [node, setNode] = useState(null);

  const handleEditField = (field, i) => {
    setCurrentFieldType(field.type);
    setCurrentField({
      ...field,
      index: i,
    });
  };

  const handleCloseDocView = () => {
    setCurrentFlowPlanNode(null);
    setNode(null);
  };

  useEffect(() => {
    if (!currentFlowPlanNode) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    setNode(node);
    console.log(node);
  }, [currentFlowPlanNode]);
  return (
    <div
      className={`${
        // if addEditNode.show is true then show component else hide component
        !node ? "translate-x-full" : ""
      } z-10 transition-all duration-200 w-1/2 grow-0 h-full absolute right-0 top-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-l-2 border-[var(--border-primary)]`}
    >
      <button
        className="absolute top-0 right-0 w-8 h-8 rounded-full"
        onClick={handleCloseDocView}
      >
        <CloseBtnIcon />
      </button>
      <div className="w-full h-full flex flex-col justify-start items-center gap-1">
        <h3
          style={{
            fontSize: `${config?.titleConfig?.fontSize}px`,
            textDecoration: `${
              config?.titleConfig?.strickthrough ? "line-through" : "none"
            }`,
            fontStyle: `${config?.titleConfig?.italic ? "italic" : "normal"}`,
            fontWeight: `${config?.titleConfig?.bold ? "bold" : "normal"}`,
            color: `${config?.titleConfig?.color}`,
            fontFamily: `${config?.titleConfig?.fontFamily}`,
            borderColor: `${config?.nodeConfig?.borderColor}`,
          }}
          className="text-[var(--text-primary)] w-full text-center text-2xl truncate border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300"
        >
          {node?.title}
        </h3>
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          {node?.data?.length ? (
            <div></div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <p className="text-[var(--text-primary)]">
                Add Something From Below Menu
              </p>
            </div>
          )}

          <div className="shrink-0 w-full h-full flex flex-col justify-start items-center gap-0 overflow-y-auto">
            {node?.data?.map((field, i) => (
              <div
                key={"field-id-" + field.type + "-" + i}
                className="group w-full relative"
              >
                {field.type === "heading" && (
                  <div className="w-full">
                    <h3
                      style={{
                        fontSize: `${field?.config?.fontSize}px`,
                        textDecoration: `${
                          field?.config?.strickthrough ? "line-through" : "none"
                        }`,
                        fontStyle: `${
                          field?.config?.italic ? "italic" : "normal"
                        }`,
                        fontWeight: `${
                          field?.config?.bold ? "bold" : "normal"
                        }`,
                        color: `${field?.config?.color}`,
                        fontFamily: `${field?.config?.fontFamily}`,
                        borderColor: `${field?.config?.nodeConfig?.borderColor}`,
                        textAlign: `${field?.config?.align}`,
                        display:
                          field?.id === currentField?.id ? "none" : "block",
                      }}
                      className="relative group text-[var(--text-primary)] w-full h-fit text-center text-2xl transition-colors duration-300 cursor-pointer"
                      onDoubleClick={() => handleEditField(field, i)}
                    >
                      {field?.data?.text}
                    </h3>
                  </div>
                )}
                {field.type === "paragraph" && (
                  <p
                    className="w-full"
                    onDoubleClick={() => handleEditField(field, i)}
                    style={{
                      textDecoration: `${
                        field?.config?.strickthrough ? "line-through" : "none"
                      }`,
                      fontStyle: `${
                        field?.config?.italic ? "italic" : "normal"
                      }`,
                      fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
                      color: `${field?.config?.color}`,
                      fontFamily: `${field?.config?.fontFamily}`,
                      borderColor: `${field?.config?.nodeConfig?.borderColor}`,
                      textAlign: `${field?.config?.align}`,
                      display:
                        field?.id === currentField?.id ? "none" : "block",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.25rem",
                    }}
                  >
                    {field?.data?.text}
                  </p>
                )}
                <span className="group-hover:opacity-100 opacity-0  transition-opacity absolute flex justify-center items-center w-8 h-5 right-1 top-0">
                  <button
                    onClick={() => handleEditField(field, i)}
                    className="w-full h-full bg-[var(--bg-tertiary)] px-1 rounded-md"
                  >
                    <EditIcon />
                  </button>
                </span>
                {currentField?.id === field?.id && (
                  <AddEditField
                    setCurrentFieldType={setCurrentFieldType}
                    node={node}
                    setNode={setNode}
                    type={currentFieldType}
                    currentField={currentField}
                    setCurrentField={setCurrentField}
                    currentFieldType={currentFieldType}
                  />
                )}
              </div>
            ))}
            {!currentField?.id && (
              <AddEditField
                setCurrentFieldType={setCurrentFieldType}
                node={node}
                setNode={setNode}
                type={currentFieldType}
                currentField={currentField}
                setCurrentField={setCurrentField}
                currentFieldType={currentFieldType}
              />
            )}

            <MenuButtons
              setCurrentField={setCurrentField}
              setType={setCurrentFieldType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const MenuButtons = ({ setType, setCurrentField }) => {
  const buttons = [
    {
      type: "heading",
      text: "Heading",
      icon: <TextIcon />,
    },
    {
      type: "paragraph",
      text: "Paragraph",
      icon: <ParagraphIcon />,
    },
    {
      type: "unorderedList",
      text: "Unordered List",
      icon: <ListIcon />,
    },
    {
      type: "taskList",
      text: "Task List",
      icon: <TodoListIcon />,
    },
    {
      type: "numberList",
      text: "Number List",
      icon: <NumberListIcon />,
    },
    {
      type: "link",
      text: "Link",
      icon: <LinkIcon />,
    },
    {
      type: "image",
      text: "Add Image",
      icon: <ImageIcon />,
    },
    {
      type: "file",
      text: "Add File",
      icon: <FileIcon />,
    },
    {
      type: "table",
      text: "Table",
      icon: <TableIcon />,
    },
    {
      type: "separator",
      text: "Separator",
      icon: <SeparatorIcon />,
    },
    {
      type: "timestamp",
      text: "Timestamp",
      icon: <TimeStampIcon />,
    },
    {
      type: "codeBlock",
      text: "Code Block",
      icon: <CodeIcon />,
    },
  ];

  const handleButtonClick = (type) => {
    setCurrentField(null);
    setType((prev) => (prev === null ? type : null));
  };

  return (
    <div className="w-fit rounded-md h-fit flex justify-center items-center flex-wrap gap-2 p-1 bg-[var(--bg-secondary)] mt-2">
      {buttons.map((button, i) => (
        <Button
          key={i}
          onClick={() => handleButtonClick(button.type)}
          text={button.text}
        >
          {button.icon}
        </Button>
      ))}
    </div>
  );
};
const Button = ({ children, onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="shrink-0 group relative w-8 h-8 rounded-md bg-[var(--bg-tertiary)] p-[6px] flex justify-center "
    >
      {children}
      <ToolTip text={text} />
    </button>
  );
};

const ToolTip = ({ text }) => {
  return (
    <div className="hidden group-hover:flex justify-center items-center absolute -bottom-8 text-center whitespace-nowrap w-fit h-6 bg-[var(--bg-tertiary)] rounded-md px-2">
      <span className="absolute inline-block -top-1 w-3 h-3 rotate-45 bg-[var(--bg-tertiary)] -z-10"></span>
      <span className="text-xs">{text}</span>
    </div>
  );
};

const AddEditField = ({
  setCurrentFieldType,
  currentFieldType,
  type,
  node,
  setNode,
  currentField,
  setCurrentField,
}) => {
  const { currentFlowPlan, setCurrentFlowPlan, defaultNodeConfig } =
    useStateContext();
  const handleGetConfig = (type) => {
    switch (type) {
      case "heading":
        return { ...defaultNodeConfig.titleConfig, align: "left" };
      case "paragraph":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
        };
      default:
        break;
    }
  };
  useEffect(() => {
    if (currentField) return;
    setCurrentField({
      type: type,
      data: {
        text: "",
      },
      config: handleGetConfig(type),
    });
  }, [type]);
  switch (currentField?.type) {
    case "heading":
      return (
        <InputTitle
          currentField={currentField}
          setCurrentField={setCurrentField}
          node={node}
          setNode={setNode}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
        />
      );
    case "paragraph":
      return (
        <Paragraph
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
        />
      );
    case "unorderedList":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="text"
            placeholder="Unordered List"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "taskList":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="text"
            placeholder="Task List"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "numberList":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="text"
            placeholder="Number List"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font
                    -bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "link":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="text"
            placeholder="Link"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "image":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="file"
            placeholder="Image"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "file":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="file"
            placeholder="File"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "table":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="text"
            placeholder="Table"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "separator":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <hr className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] transition-colors duration-300 cursor-pointer" />
        </div>
      );
    case "timestamp":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <input
            type="datetime-local"
            placeholder="Timestamp"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    case "codeBlock":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <textarea
            type="text"
            placeholder="Code Block"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-[var(--border-primary)] transition-colors duration-300 cursor-pointer"
          />
        </div>
      );
    default:
      break;
  }
};
const InputTitle = ({
  setCurrentFieldType,
  node,
  setNode,
  currentField,
  setCurrentField,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();

  const handleTitleChange = (e) => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        text: e.target.value,
      },
    });
  };

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (index !== null) {
      node.data[index] = currentField;
    } else {
      node.data.push({ ...currentField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <form
      onSubmit={(e) => handleSave(e, currentField?.index ?? null)}
      className="w-full flex flex-col justify-center items-start gap-0"
    >
      <input
        type="text"
        autoFocus={true}
        value={currentField?.data?.text ?? ""}
        onChange={handleTitleChange}
        placeholder="Enter heading..."
        required
        className="text-[var(--text-primary)] w-full rounded-md bg-transparent focus:outline-none focus:border-transparent"
        style={{
          fontSize: `${currentField?.config?.fontSize}px`,
          textDecoration: `${
            currentField?.config?.strickthrough ? "line-through" : "none"
          }`,
          fontStyle: `${currentField?.config?.italic ? "italic" : "normal"}`,
          fontWeight: `${currentField?.config?.bold ? "bold" : "normal"}`,
          fontFamily: `${currentField?.config?.fontFamily}`,
          color: `${currentField?.config?.color}`,
          textAlign: `${currentField?.config?.align}`,
        }}
      />
      <InputTitleButtons
        config={currentField?.config}
        node={node}
        setNode={setNode}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        handleSave={handleSave}
      />
    </form>
  );
};

const InputTitleButtons = ({
  config,
  node,
  setNode,
  currentField,
  setCurrentField,
  setCurrentFieldType,
  handleSave,
  type,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();
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
  const {
    ref: alignRef,
    isActive: alignActive,
    setIsActive: setAlignActive,
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
  const aligns = [
    {
      a: "L",
      type: "left",
      icon: <LeftAlignIcon />,
    },
    {
      a: "C",
      type: "center",
      icon: <CenterAlignIcon />,
    },
    {
      a: "R",
      type: "right",
      icon: <RightAlignIcon />,
    },
  ];

  const handleFontSizeClick = () => {
    setFontSizeActive((prev) => !prev);
  };
  const handleColorClick = () => {
    setColorActive((prev) => !prev);
  };
  const handleFontSizeChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        fontSize: parseInt(e.target.value),
      },
    });
    setFontSizeActive(false);
  };
  const handleColorChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        color: e.target.value,
      },
    });
    setColorActive(false);
  };
  const handleActiveColorChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        color: e.target.value,
      },
    });
  };

  const handleStrickthroughClick = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        strickthrough: !currentField.config.strickthrough,
      },
    });
  };
  const handleItalicClick = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        italic: !currentField.config.italic,
      },
    });
  };

  const handleBoldClick = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        bold: !currentField.config.bold,
      },
    });
  };

  const handleFontFamilyClick = () => {
    setFontFamilyActive((prev) => !prev);
  };

  const handleFontFamilytChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        fontFamily: e.target.value,
      },
    });
    setFontFamilyActive(false);
  };

  const handleAlignClick = () => {
    setAlignActive((prev) => !prev);
  };

  const handleAlignChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        align: e.target.value,
      },
    });
    setAlignActive(false);
  };

  const handleSetTitleColor = (color) => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        color: color,
      },
    });
  };

  const handleResetToDefaultTitleConfig = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...defaultNodeConfig.titleConfig,
      },
    });
  };

  const handleCancel = () => {
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleDelete = async (index) => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    node.data.splice(index, 1);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <div className="w-full my-1  flex flex-wrap justify-center items-center gap-2">
      <button
        type="button"
        onClick={handleCancel}
        className="w-14 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
      >
        Cancel
      </button>
      {currentField.type === "heading" && (
        <div className="relative">
          <button
            type="button"
            onClick={handleFontSizeClick}
            className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300 relative"
          >
            <FontsizeIcon />
            <span className="absolute -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium">
              {config?.fontSize}
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
                      config?.fontSize === fontSize ? "var(--btn-edit)" : ""
                    }`,
                  }}
                >
                  <input
                    className="w-full h-full bg-blue-500 absolute opacity-0"
                    type="radio"
                    value={fontSize}
                    checked={config?.fontSize === fontSize}
                    onChange={handleFontSizeChange}
                  />
                  {fontSize}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-add)] transition-colors duration-300"
        onClick={handleStrickthroughClick}
      >
        <StrickthroughIcon />
        <span
          style={{
            textDecoration: `${
              config?.strickthrough ? "line-through" : "none"
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
            fontStyle: `${config?.italic ? "italic" : "normal"}`,
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
            fontWeight: `${config?.bold ? "bold" : "normal"}`,
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
              background: config?.color,
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
                  checked={config?.color === color}
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
              fontFamily: `${config?.fontFamily}`,
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
                    config?.fontFamily === fontFamily ? "var(--btn-edit)" : ""
                  }`,
                }}
              >
                <input
                  title={fontFamily}
                  className="w-full h-full bg-blue-500 absolute opacity-0"
                  type="radio"
                  value={fontFamily}
                  checked={config?.fontFamily === fontFamily}
                  onChange={handleFontFamilytChange}
                />
                Aa
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={handleAlignClick}
          className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300 relative"
        >
          {config?.align ? (
            aligns.find((item) => item.type === config?.align)?.icon
          ) : (
            <LeftAlignIcon />
          )}
          <span className="absolute -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium">
            {config?.align
              ? aligns.find((item) => item.type === config?.align)?.a
              : "L"}
          </span>
        </button>
        {alignActive && (
          <div
            ref={alignRef}
            className="hide z-10 absolute flex flex-col w-8 top-9 rounded-md  bg-[var(--btn-secondary)] border border-[var(--border-primary)]"
          >
            {aligns.map((align) => (
              <label
                key={`align-id-${align.type}`}
                className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300 text-[var(--text-primary)]"
                style={{
                  backgroundColor: `${
                    config?.align === align.type ? "var(--btn-add)" : ""
                  }`,
                }}
              >
                <input
                  title={align.type}
                  className="w-full h-full bg-blue-500 absolute opacity-0"
                  type="radio"
                  value={align.type}
                  checked={config?.align === align.type}
                  onChange={handleAlignChange}
                />
                <span className="w-5 h-5 flex justify-center items-center">
                  {align.icon}
                </span>
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
      {currentField?.id && (
        <button
          type="button"
          onClick={() => handleDelete(currentField.index)}
          className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
        >
          <DeleteIcon />
        </button>
      )}

      <button
        type="submit"
        className="w-14 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
        onClick={(e) => handleSave(e, currentField?.index ?? null)}
      >
        Save
      </button>
    </div>
  );
};

const Paragraph = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
}) => {
  const textareaRef = useRef(null);
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();

  const handleParaChange = (e) => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        text: e.target.value,
      },
    });
  };

  const handleTextareaChange = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the new height
    }
  };

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (index !== null) {
      node.data[index] = currentField;
    } else {
      node.data.push({ ...currentField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };
  useEffect(() => {
    handleTextareaChange();
  }, [currentField?.data?.text]);
  return (
    <form
      onSubmit={handleSave}
      className="w-full h-fit flex flex-col justify-start items-center"
    >
      <textarea
        type="text"
        autoFocus={true}
        placeholder="Paragraph"
        value={currentField?.data?.text}
        onChange={handleParaChange}
        required
        className="w-full h-fit bg-transparent text-[var(--text-primary)] border-t-2 border-b-2 border-[var(--border-primary)] text-sm outline-none transition-colors duration-300 cursor-pointer resize-none"
        ref={textareaRef}
        style={{
          fontSize: `${currentField?.config?.fontSize}px`,
          textDecoration: `${
            currentField?.config?.strickthrough ? "line-through" : "none"
          }`,
          fontStyle: `${currentField?.config?.italic ? "italic" : "normal"}`,
          fontWeight: `${currentField?.config?.bold ? "bold" : "normal"}`,
          fontFamily: `${currentField?.config?.fontFamily}`,
          color: `${currentField?.config?.color}`,
          textAlign: `${currentField?.config?.align}`,
          height: "auto",
          overflowY: "hidden",
        }}
      />
      <InputTitleButtons
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        handleSave={handleSave}
        type={currentField.type}
      />
    </form>
  );
};
export default DisplayDocView;
