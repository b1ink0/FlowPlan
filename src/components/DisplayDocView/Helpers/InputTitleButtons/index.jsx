import { useStateContext } from "../../../../context/StateContext.jsx";
import { useFunctions } from "../../../../hooks/useFunctions/index.jsx";
import useClickOutside from "../../../../hooks/useClickOutside/index.jsx";
import LeftAlignIcon from "../../../../assets/Icons/LeftAlignIcon.jsx";
import CenterAlignIcon from "../../../../assets/Icons/CenterAlignIcon.jsx";
import RightAlignIcon from "../../../../assets/Icons/RightAlignIcon.jsx";
import DotIcon from "../../../../assets/Icons/DotIcon.jsx";
import BorderDot from "../../../../assets/Icons/BorderDot.jsx";
import SquareDot from "../../../../assets/Icons/SquareDot.jsx";
import DiamondDot from "../../../../assets/Icons/DiamondDot.jsx";
import StarDot from "../../../../assets/Icons/StarDot.jsx";
import ArrowDot from "../../../../assets/Icons/ArrowDot.jsx";
import NumberListIcon from "../../../../assets/Icons/NumberListIcon.jsx";
import RomanLIstIcon from "../../../../assets/Icons/RomanLIstIcon.jsx";
import AlphabetListIcon from "../../../../assets/Icons/AlphabetListIcon.jsx";
import React, { useState } from "react";
import { v4 } from "uuid";
import TopbarIcon from "../../../../assets/Icons/TopbarIcon.jsx";
import { ToolTip } from "../ToolTip/index.jsx";
import DateIcon from "../../../../assets/Icons/DateIcon.jsx";
import RepeatIcon from "../../../../assets/Icons/RepeatIcon.jsx";
import IndentationIcon from "../../../../assets/Icons/IndentationIcon.jsx";
import PreviewIcon from "../../../../assets/Icons/PreviewIcon.jsx";
import { LinkPreviewConfig } from "../LinkPreviewConfig/index.jsx";
import FontsizeIcon from "../../../../assets/Icons/FontsizeIcon.jsx";
import StrickthroughIcon from "../../../../assets/Icons/StrickthroughIcon.jsx";
import ItalicIcon from "../../../../assets/Icons/ItalicIcon.jsx";
import BoldIcon from "../../../../assets/Icons/BoldIcon.jsx";
import ColorIcon from "../../../../assets/Icons/ColorIcon.jsx";
import RandomIcon from "../../../../assets/Icons/RandomIcon.jsx";
import FontIcon from "../../../../assets/Icons/FontIcon.jsx";
import ResetToDefaultIcon from "../../../../assets/Icons/ResetToDefaultIcon.jsx";
import CopyStyleIcon from "../../../../assets/Icons/CopyStyleIcon.jsx";
import PasteStyleIcon from "../../../../assets/Icons/PasteStyleIcon.jsx";
import DublicateIcon from "../../../../assets/Icons/DublicateIcon.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const InputTitleButtons = ({
  config,
  node,
  setNode,
  currentField,
  setCurrentField,
  setCurrentFieldType,
  handleSave,
  type,
  handleGetDefaultConfig,
  linkPreviewLoading,
  linkPreview,
  setLinkPreview,
  defaultTaskList = null,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    currentFlowPlanNode,
    fieldStyles,
    setFieldStyles,
    settings,
  } = useStateContext();
  const { rootConfig } = settings;
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
  const {
    ref: listStyleRef,
    isActive: listStyleActive,
    setIsActive: setListStyleActive,
  } = useClickOutside(false);
  const {
    ref: numberListStyleRef,
    isActive: numberListStyleActive,
    setIsActive: setNumberListStyleActive,
  } = useClickOutside(false);
  const {
    ref: indentationRef,
    isActive: indentationActive,
    setIsActive: setIndentationActive,
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
  const fontFamilies = rootConfig.fonts;
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
  const listStyles = [
    {
      type: "filledCircle",
      icon: <DotIcon />,
    },
    {
      type: "emptyCircle",
      icon: <BorderDot />,
    },
    {
      type: "filledSquare",
      icon: <SquareDot />,
    },
    {
      type: "filledDiamond",
      icon: <DiamondDot />,
    },
    {
      type: "filledStar",
      icon: <StarDot />,
    },
    {
      type: "filledArrow",
      icon: <ArrowDot />,
    },
  ];
  const numberListStyles = [
    {
      type: "number",
      a: "1",
      icon: <NumberListIcon />,
    },
    {
      type: "roman",
      a: "i",
      icon: <RomanLIstIcon />,
    },
    {
      type: "alphabet",
      a: "A",
      icon: <AlphabetListIcon />,
    },
  ];

  const indentations = [
    {
      type: 0,
    },
    {
      type: 1,
    },
    {
      type: 2,
    },
    {
      type: 3,
    },
    {
      type: 4,
    },
  ];

  const [showToolTip, setShowToolTip] = useState({
    show: false,
    type: null,
  });

  const [showPreviewConfig, setShowPreviewConfig] = useState(false);

  const handleIndentationClick = () => {
    setIndentationActive((prev) => !prev);
  };

  const handleIndentationChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        indentation: parseInt(e.target.value),
      },
    });
    setIndentationActive(false);
  };

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
        ...handleGetDefaultConfig(type),
      },
    });
  };

  const handleListStyleClick = () => {
    setListStyleActive((prev) => !prev);
  };
  const handleListStyleChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        listStyle: e.target.value,
      },
    });
    setListStyleActive(false);
  };
  const handleNumberListStyleClick = () => {
    setNumberListStyleActive((prev) => !prev);
  };
  const handleNumberListStyleChange = (e) => {
    e.stopPropagation();
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        listStyle: e.target.value,
      },
    });
    setNumberListStyleActive(false);
  };
  const handlePreviewLinkClick = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        preview: !currentField.config.preview,
      },
    });
  };
  const handleCancel = () => {
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const { handleUpdateIndexDB } = useDatabase();
  const handleDelete = async (index) => {
    console.log(currentField);
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    node.data.splice(index, 1);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handleDublicateField = async (i) => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((j) => {
      node = node.children[j];
    });
    let temp = structuredClone(node.data[i]);
    temp.id = v4();
    if (
      node.data[i].type === "unorderedList" ||
      node.data[i].type === "numberList" ||
      node.data[i].type === "taskList"
    ) {
      temp.data.list = temp.data.list.map((item) => {
        item.id = v4();
        return item;
      });
    }
    node.data.splice(i + 1, 0, temp);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
  };

  const handleCopyFieldStyles = (i) => {
    setFieldStyles({
      type: currentField.type,
      config: structuredClone(currentField.config),
    });
  };

  const handlePasteFieldStyles = async (i) => {
    if (!fieldStyles.config) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((j) => {
      node = node.children[j];
    });

    if (fieldStyles.type !== currentField.type) {
      let oldConfig = structuredClone(node.data[i].config);
      let newConfig = structuredClone(fieldStyles.config);
      Object.keys(oldConfig).forEach((key) => {
        if (newConfig[key]) {
          oldConfig[key] = newConfig[key];
        }
      });
      setCurrentField((prev) => ({ ...prev, config: oldConfig }));
    } else {
      setCurrentField((prev) => ({ ...prev, config: fieldStyles.config }));
    }
  };

  const handleSetPreviewLink = (key) => {
    setLinkPreview((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        show: prev[key].show ? false : true,
      },
    }));
  };

  const handleToggleDateInfoClick = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        showDateInfo:
          currentField.config.showDateInfo === undefined
            ? true
            : !currentField.config.showDateInfo,
      },
    });
  };

  const handleToggleRepeatClick = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        repeat:
          currentField.config.repeat === undefined
            ? true
            : !currentField.config.repeat,
      },
      data: {
        ...currentField.data,
        taskList:
          currentField.data?.taskList === undefined
            ? defaultTaskList
            : currentField.data?.taskList,
      },
    });
  };

  const handleToggleProgressBarClick = () => {
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        progressBar:
          currentField.config.progressBar === undefined
            ? true
            : !currentField.config.progressBar,
      },
    });
  };

  return (
    <div className="w-full mt-2 mb-1  flex flex-wrap justify-center items-center gap-2">
      <button
        type="button"
        onClick={handleCancel}
        className="w-14 h-8 group flex justify-center items-center relative text-xs text-[var(--text-primary)] bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
      >
        Cancel
      </button>

      {currentField?.type === "unorderedList" && (
        <div className="relative">
          <button
            type="button"
            onClick={handleListStyleClick}
            className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300 relative"
          >
            {
              listStyles?.find(
                (listStyle) => listStyle.type === currentField.config?.listStyle
              )?.icon
            }
            <span className="absolute w-2 h-2 -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium">
              {
                listStyles?.find(
                  (listStyle) =>
                    listStyle.type === currentField.config?.listStyle
                )?.icon
              }
            </span>
          </button>
          {listStyleActive && (
            <div
              ref={listStyleRef}
              className="hide z-10 absolute flex flex-col w-8 top-9 rounded-md  bg-[var(--btn-secondary)] border border-[var(--border-primary)]"
            >
              {listStyles.map((listStyle) => (
                <label
                  key={`listStyle-id-${listStyle?.type}`}
                  className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300 text-[var(--text-primary)]"
                  style={{
                    backgroundColor: `${
                      currentField?.config?.listStyle === listStyle.type
                        ? "var(--btn-edit)"
                        : ""
                    }`,
                  }}
                >
                  <input
                    className="w-full h-full bg-blue-500 absolute opacity-0"
                    type="radio"
                    value={listStyle.type}
                    checked={currentField?.config?.listStyle === listStyle.type}
                    onChange={handleListStyleChange}
                  />
                  <span className="absolute w-4 h-4 rounded-full inline-block text-[var(--text-primary)] text-xs font-medium">
                    {listStyle.icon}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {currentField?.type === "numberList" && (
        <div className="relative">
          <button
            type="button"
            onClick={handleNumberListStyleClick}
            className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-[6px] rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300 relative"
          >
            {
              numberListStyles?.find(
                (listStyle) => listStyle.type === currentField.config?.listStyle
              )?.icon
            }
            <span className="absolute w-2 h-2 -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium">
              {
                numberListStyles?.find(
                  (listStyle) =>
                    listStyle.type === currentField.config?.listStyle
                )?.a
              }
            </span>
          </button>
          {numberListStyleActive && (
            <div
              ref={numberListStyleRef}
              className="hide z-10 absolute flex flex-col w-8 top-9 rounded-md  bg-[var(--btn-secondary)] border border-[var(--border-primary)]"
            >
              {numberListStyles.map((listStyle) => (
                <label
                  key={`listStyle-id-${listStyle?.type}`}
                  className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300 text-[var(--text-primary)]"
                  style={{
                    backgroundColor: `${
                      currentField?.config?.listStyle === listStyle.type
                        ? "var(--btn-edit)"
                        : ""
                    }`,
                  }}
                >
                  <input
                    className="w-full h-full bg-blue-500 absolute opacity-0"
                    type="radio"
                    value={listStyle.type}
                    checked={currentField?.config?.listStyle === listStyle.type}
                    onChange={handleNumberListStyleChange}
                  />
                  <span className="absolute w-6 h-6 rounded-full inline-block text-[var(--text-primary)] text-xs font-medium">
                    {listStyle.icon}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {currentField?.type === "taskList" && (
        <>
          <button
            type="button"
            title="Toggle Progress Bar"
            onClick={handleToggleProgressBarClick}
            className="w-8 h-8 group flex justify-center items-center relative text-xs text-[var(--text-primary)] bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
            onMouseEnter={() =>
              setShowToolTip({ show: true, type: "Toggle Progress Bar" })
            }
            onMouseLeave={() => setShowToolTip({ show: false, type: null })}
          >
            <TopbarIcon />
            {!currentField?.config?.progressBar && (
              <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
            )}
            {showToolTip.show && showToolTip.type === "Toggle Progress Bar" && (
              <ToolTip text="Toggle Progress Bar" />
            )}
          </button>
          <button
            type="button"
            title="Toggle Date Info"
            onClick={handleToggleDateInfoClick}
            className="w-8 h-8 group flex justify-center items-center relative text-xs text-[var(--text-primary)] bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-expand)] transition-colors duration-300"
            onMouseEnter={() =>
              setShowToolTip({ show: true, type: "Toggle Date Info" })
            }
            onMouseLeave={() => setShowToolTip({ show: false, type: null })}
          >
            <DateIcon />
            {!currentField?.config?.showDateInfo && (
              <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
            )}
            {showToolTip.show && showToolTip.type === "Toggle Date Info" && (
              <ToolTip text="Toggle Date Info" />
            )}
          </button>
          <button
            type="button"
            title="Toggle Repeat"
            onClick={handleToggleRepeatClick}
            className="w-8 h-8 group flex justify-center items-center relative text-xs text-[var(--text-primary)] bg-[var(--btn-secondary)] py-1 px-[6px] rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
            onMouseEnter={() =>
              setShowToolTip({ show: true, type: "Toggle Repeat" })
            }
            onMouseLeave={() => setShowToolTip({ show: false, type: null })}
          >
            <RepeatIcon />
            {!currentField?.config?.repeat && (
              <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
            )}
            {showToolTip.show && showToolTip.type === "Toggle Repeat" && (
              <ToolTip text="Toggle Repeat" />
            )}
          </button>
        </>
      )}

      {(currentField?.type === "unorderedList" ||
        currentField?.type === "numberList" ||
        currentField?.type === "taskList") && (
        <div className="relative">
          <button
            type="button"
            title="Indentation"
            onClick={handleIndentationClick}
            className="w-8 h-8 group flex justify-center items-center relative text-xs text-[var(--text-primary)] bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-add)] transition-colors duration-300"
            onMouseEnter={() =>
              setShowToolTip({ show: true, type: "Indentation" })
            }
            onMouseLeave={() => setShowToolTip({ show: false, type: null })}
          >
            <IndentationIcon />
            <span className="absolute w-2 h-2 -top-1 -right-1 text-[var(--text-primary)] text-xs font-medium">
              {currentField?.config?.indentation ?? 0}
            </span>
            {showToolTip.show && showToolTip.type === "Indentation" && (
              <ToolTip text="Indentation" />
            )}
          </button>
          {indentationActive && (
            <div
              ref={indentationRef}
              className="hide z-10 absolute flex flex-col w-8 top-9 rounded-md  bg-[var(--btn-secondary)] border border-[var(--border-primary)]"
            >
              {indentations.map((indentation) => (
                <label
                  key={`indentation-id-${indentation.type}`}
                  className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300 text-[var(--text-primary)]"
                  style={{
                    backgroundColor: `${
                      currentField?.config?.indentation === indentation.type
                        ? "var(--btn-edit)"
                        : ""
                    }`,
                  }}
                >
                  <input
                    className="w-full h-full bg-blue-500 absolute opacity-0"
                    type="radio"
                    value={indentation.type}
                    checked={
                      currentField?.config?.indentation === indentation.type
                    }
                    onChange={handleIndentationChange}
                  />
                  <span className="absolute w-4 h-4 rounded-full inline-block text-[var(--text-primary)] text-sm text-center font-medium">
                    {indentation.type}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {currentField?.type === "link" && (
        <div className="relative group flex gap-2">
          <button
            type="button"
            onClick={handlePreviewLinkClick}
            title="Preview Details"
            className="w-8 h-8 shrink-0 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
          >
            <PreviewIcon />
            {!currentField?.config?.preview && (
              <span className="absolute block w-[2px] rotate-45 rounded-full h-6 bg-[var(--logo-primary)]"></span>
            )}
          </button>
          <div className="relative w-full shrink-0 flex flex-col gap-2">
            <button
              type="button"
              disabled={!currentField?.config?.preview || linkPreviewLoading}
              style={
                !currentField?.config?.preview || linkPreviewLoading
                  ? {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    }
                  : {}
              }
              onClick={() => setShowPreviewConfig((prev) => !prev)}
              className="w-fit h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
            >
              Preview Config
            </button>
            {showPreviewConfig &&
              currentField?.config?.preview &&
              !linkPreviewLoading &&
              linkPreview !== null && (
                <LinkPreviewConfig
                  linkPreview={linkPreview}
                  setLinkPreview={setLinkPreview}
                />
              )}
          </div>
        </div>
      )}

      {currentField?.type === "heading" && (
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

      {currentField?.type !== "image" && (
        <>
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
                    value={config?.color}
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
                    key={`fontsize-id-${fontFamily.value}`}
                    className="shrink-0 w-8 h-8 flex justify-center items-center relative hover:bg-[var(--btn-edit)] transition-colors duration-300 text-[var(--text-primary)]"
                    style={{
                      fontFamily: `${fontFamily.value}`,
                      backgroundColor: `${
                        config?.fontFamily === fontFamily
                          ? "var(--btn-edit)"
                          : ""
                      }`,
                    }}
                  >
                    <input
                      title={fontFamily.label}
                      className="w-full h-full bg-blue-500 absolute opacity-0"
                      type="radio"
                      value={fontFamily.value}
                      checked={config?.fontFamily === fontFamily.value}
                      onChange={handleFontFamilytChange}
                    />
                    Aa
                  </label>
                ))}
              </div>
            )}
          </div>

          {(currentField.type === "heading" ||
            currentField.type === "paragraph" ||
            currentField.type === "table") && (
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
          )}
          <button
            type="button"
            onClick={handleResetToDefaultTitleConfig}
            title="Reset To Default"
            className="w-8 h-8 group flex justify-center items-center text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300 relative"
          >
            <ResetToDefaultIcon />
          </button>
        </>
      )}
      {/* {currentField?.id && (
        <> */}
      <button
        type="button"
        onClick={() => handleCopyFieldStyles(currentField.index)}
        title="Copy Field Style"
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md transition-colors duration-300"
      >
        <CopyStyleIcon />
      </button>
      <button
        type="button"
        onClick={() => handlePasteFieldStyles(currentField.index)}
        title="Paste Field Styles"
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md transition-colors duration-300"
      >
        <PasteStyleIcon />
      </button>
      <button
        type="button"
        onClick={() => handleDublicateField(currentField.index)}
        title="Dublicate Field"
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md transition-colors duration-300"
      >
        <DublicateIcon />
      </button>

      <button
        type="button"
        onClick={() => handleDelete(currentField.index)}
        className="w-8 h-8 group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
      >
        <DeleteIcon />
      </button>
      {/* </>
      )} */}

      <button
        type="submit"
        className="w-14 h-8 text-[var(--text-primary)] group flex justify-center items-center relative text-xs bg-[var(--btn-secondary)] py-1 px-2 rounded-md hover:bg-[var(--btn-edit)] transition-colors duration-300"
        onClick={(e) => handleSave(e, currentField?.index ?? null)}
      >
        Save
      </button>
    </div>
  );
};
