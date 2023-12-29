// @ts-check
import React, { useEffect, useState } from "react";
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

function DisplayDocView() {
  const { currentFlowPlanNode, setCurrentFlowPlanNode, defaultNodeConfig } =
    useStateContext();
  const { config } = currentFlowPlanNode;
  const [currentFieldType, setCurrentFieldType] = useState(null);
  const [node, setNode] = useState(currentFlowPlanNode);

  const handleNode = (type) => {
    switch (type) {
      case "displayDocView":
        setCurrentFieldType(null);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`${
        // if addEditNode.show is true then show component else hide component
        !currentFlowPlanNode ? "translate-x-full" : ""
      } z-10 transition-all duration-200 w-1/2 grow-0 h-full absolute right-0 top-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-l-2 border-[var(--border-primary)]`}
    >
      <button
        className="absolute top-0 right-0 w-8 h-8 rounded-full"
        onClick={() => setCurrentFlowPlanNode(null)}
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
          className="text-[var(--text-primary)] w-full text-center text-2xl truncate border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          onClick={() => handleNode("displayDocView")}
        >
          {currentFlowPlanNode?.title}
        </h3>
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          {node?.data?.length ? (
            <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1"></div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <span>＞﹏＜</span>
              <p className="text-[var(--text-primary)]">
                Add Something From Below Menu
              </p>
            </div>
          )}
          <AddEditField node={node} setNode={setNode} type={currentFieldType} />
          <div className="shrink-0 w-full h-full flex flex-col justify-start items-center gap-2 overflow-y-auto">
            <MenuButtons setType={setCurrentFieldType} />
          </div>
        </div>
      </div>
    </div>
  );
}

const MenuButtons = ({ setType }) => {
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

  const handleButtonClick = (text) => {
    setType(text);
  };

  return (
    <div className="w-fit rounded-md h-fit flex justify-center items-center flex-wrap gap-2 p-1 bg-[var(--bg-secondary)]">
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

const AddEditField = ({ type, node, setNode }) => {
  switch (type) {
    case "heading":
      return <InputTitle node={node} setNode={setNode} config={node.config} />;
    case "paragraph":
      return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1">
          <textarea
            type="text"
            placeholder="Paragraph"
            className="w-full h-full bg-[var(--bg-secondary)] text-[var(--text-primary)] text-center text-2xl font-bold border-b border-[var(--border-primary)] py-2 px-2  transition-colors duration-300 cursor-pointer"
          />
        </div>
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
const InputTitle = ({ node, setNode, inputRef, config }) => {
  const handleTitleChange = (e) => {
    setNode({
      ...node,
      data: [
        ...node.data,
        {
          type: "heading",
          data: e.target.value,
          config: {
            ...config,
            titleConfig: {
              ...config.titleConfig,
            },
          },
        },
      ],
    });
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
export default DisplayDocView;
