// @ts-check
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useStateContext } from "../../context/StateContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as Themes from "react-syntax-highlighter/dist/esm/styles/prism";
import * as Languages from "react-syntax-highlighter/dist/esm/languages/prism";
import LinewrapIcon from "../../assets/Icons/LinewrapIcon";
import CopyIcon from "../../assets/Icons/CopyIcon";
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
import ArrowDot from "../../assets/Icons/ArrowDot";
import DotIcon from "../../assets/Icons/DotIcon";
import DateIcon from "../../assets/Icons/DateIcon.jsx";
import BorderDot from "../../assets/Icons/BorderDot";
import SquareDot from "../../assets/Icons/SquareDot";
import DiamondDot from "../../assets/Icons/DiamondDot";
import StarDot from "../../assets/Icons/StarDot";
import CheckedIcon from "../../assets/Icons/CheckedIcon";
import UncheckedIcon from "../../assets/Icons/UncheckedIcon";
import RomanLIstIcon from "../../assets/Icons/RomanLIstIcon";
import AlphabetListIcon from "../../assets/Icons/AlphabetListIcon";
import PreviewIcon from "../../assets/Icons/PreviewIcon";
import DownloadIcon from "../../assets/Icons/DownloadIcon";
import AddIcon from "../../assets/Icons/AddIcon";
import FullScreenIcon from "../../assets/Icons/FullScreenIcon";
import EditBtnIcon from "../../assets/Icons/EditBtnIcon";
import MoveIcon from "../../assets/Icons/MoveIcon";
import BackIcon from "../../assets/Icons/BackIcon";
import { TimeAndDate } from "../Helpers/TimeAndDate";
import { SortableList } from "../Helpers/DND/SortableList.jsx";
import IndentationIcon from "../../assets/Icons/IndentationIcon.jsx";
import PasteIcon from "../../assets/Icons/PasteIcon.jsx";
import TopbarIcon from "../../assets/Icons/TopbarIcon.jsx";
import CopyStyleIcon from "../../assets/Icons/CopyStyleIcon.jsx";
import PasteStyleIcon from "../../assets/Icons/PasteStyleIcon.jsx";
import DublicateIcon from "../../assets/Icons/DublicateIcon.jsx";
import InheritIcon from "../../assets/Icons/InheritIcon.jsx";
import PInIcon from "../../assets/Icons/PInIcon.jsx";
import DurationIcon from "../../assets/Icons/DurationIcon.jsx";
import DurationTimelineIcon from "../../assets/Icons/DurationTimelineIcon.jsx";
import OverlapIcon from "../../assets/Icons/OverlapIcon.jsx";
import GraphIcon from "../../assets/Icons/GraphIcon.jsx";
import RepeatIcon from "../../assets/Icons/RepeatIcon.jsx";

function DisplayDocView() {
  const {
    settings,
    setSettings,
    currentFlowPlan,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
    defaultNodeConfig,
  } = useStateContext();
  const [currentFieldType, setCurrentFieldType] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [move, setMove] = useState({
    move: false,
    id: null,
  });
  const [showAdd, setShowAdd] = useState({
    show: false,
    index: null,
  });
  const [node, setNode] = useState(null);
  const [nodeNavigation, setNodeNavigation] = useState({
    preSibling: null,
    nextSibling: null,
    parent: null,
    firstChild: null,
  });
  const [showNodeNavigation, setShowNodeNavigation] = useState(false);
  const [progress, setProgress] = useState(0);

  const { docConfig } = settings;

  const handleMouseDown = () => {
    let resize = true;
    document.body.style.cursor = "ew-resize";
    document.onmousemove = (e) => {
      if (!resize) return;
      const newWidth = window.innerWidth - e.clientX;
      localStorage.setItem("docWidth", newWidth);
      setSettings((prev) => ({
        ...prev,
        docConfig: {
          ...prev.docConfig,
          width: newWidth,
        },
      }));
    };
    document.onmouseup = () => {
      console.log("mouseup");
      document.body.style.cursor = "default";
      resize = false;
    };
  };

  const handleEditField = (field, i) => {
    if (field?.type === "durationEnd") return;
    handleResetShowAdd(false);
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

  const handleFullScreen = () => {
    setSettings((prev) => ({
      ...prev,
      docConfig: {
        ...prev.docConfig,
        fullscreen: prev.docConfig.fullscreen !== "true" ? "true" : "false",
      },
    }));
    localStorage.setItem(
      "fullscreen",
      docConfig.fullscreen !== "true" ? "true" : "false"
    );
  };

  const handleResetShowAdd = (delay = true) => {
    setTimeout(
      () => {
        setShowAdd(() => ({
          show: false,
          index: null,
        }));
      },
      delay ? 200 : 0
    );
  };

  const handleNavigation = (node) => {
    if (!node) return;
    setCurrentFlowPlanNode(node);
  };

  const handleCalculateProgressCurrentDoc = () => {
    let total = 0;
    let completed = 0;
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          total++;
          if (task.completed) {
            completed++;
          }
        });
      }
    });
    return total === 0 ? 100 : (completed / total) * 100;
  };

  const handleCalculateProgress = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          info.total++;
          if (task.completed) {
            info.completed++;
          }
        });
      }
    });
    if (node.children.length > 0) {
      node.children.forEach((item) => {
        const childInfo = handleCalculateProgress(item);
        info.total += childInfo.total;
        info.completed += childInfo.completed;
      });
    }
    return info;
  };

  const handleCalculateProgressCurrentDocAndChild = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    info = handleCalculateProgress(node);
    return info.total === 0 ? 100 : (info.completed / info.total) * 100;
  };

  const handleCalculateCustomProgress = (node, selected = undefined) => {
    let info = {
      total: 0,
      completed: 0,
    };

    let filtered = selected?.filter((i) => i?.id === node?.id);
    if (filtered.length > 0) {
      node?.data.forEach((item) => {
        if (item?.type === "taskList") {
          if (item?.config?.repeat) return;
          let filteredList = filtered[0]?.tasks?.filter(
            (i) => i?.id === item?.id
          );
          if (filteredList.length === 0) return;
          if (filteredList[0]?.id !== item?.id) return;
          if (!filteredList[0]?.selected) return;
          item.data.list.forEach((task) => {
            info.total++;
            if (task.completed) {
              info.completed++;
            }
          });
        }
      });
    }
    if (node.children.length > 0) {
      node.children.forEach((item) => {
        const childInfo = handleCalculateCustomProgress(item, selected);
        info.total += childInfo.total;
        info.completed += childInfo.completed;
      });
    }
    return info;
  };

  const handleCalculateProgressCustom = (node, selected) => {
    let info = {
      total: 0,
      completed: 0,
    };
    info = handleCalculateCustomProgress(node, selected);
    return info.total === 0 ? 100 : (info.completed / info.total) * 100;
  };

  const handleCalculateProgressField = (type) => {
    try {
      if (type === "doc") {
        return handleCalculateProgressCurrentDoc();
      } else if (type === "docChild") {
        return handleCalculateProgressCurrentDocAndChild(node);
      } else if (type === "docAll") {
        return handleCalculateProgressCurrentDocAndChild(currentFlowPlan.root);
      } else if (type === "custom") {
        return handleCalculateProgressCustom(
          currentFlowPlan.root,
          node?.data[node?.pin?.index]?.data?.progress?.selected
        );
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  useEffect(() => {
    if (
      !(
        node?.pin?.show &&
        node?.data[node?.pin?.index] &&
        node?.pin?.id === node?.data[node?.pin?.index].id
      )
    )
      return;
    setProgress(
      handleCalculateProgressField(
        node?.data[node?.pin?.index]?.data?.progress?.type
      )
    );
  }, [node]);

  useEffect(() => {
    if (!currentFlowPlanNode) {
      setNode(null);
      return;
    }
    let root = currentFlowPlan.root;
    let node = root;
    let parentNodeChildrenLength = null;
    const currentFlowPlanNodeLength = currentFlowPlanNode.length;
    currentFlowPlanNode.forEach((i, index) => {
      if (index === currentFlowPlanNodeLength - 1) {
        parentNodeChildrenLength = node.children.length;
      }
      node = node.children[i];
    });
    setNode(node);

    let tempNodeNavigation = structuredClone(nodeNavigation);
    if (currentFlowPlanNodeLength === 0) {
      tempNodeNavigation.parent = null;
      tempNodeNavigation.preSibling = null;
      tempNodeNavigation.nextSibling = null;
      tempNodeNavigation.firstChild =
        currentFlowPlan.root.children.length === 0 ? null : [0];
    } else if (currentFlowPlanNodeLength === 1) {
      tempNodeNavigation.preSibling =
        currentFlowPlanNode[0] === 0 ? null : [currentFlowPlanNode[0] - 1];
      tempNodeNavigation.nextSibling =
        currentFlowPlanNode[0] + 1 > parentNodeChildrenLength - 1
          ? null
          : [currentFlowPlanNode[0] + 1];
      tempNodeNavigation.parent = [];
      tempNodeNavigation.firstChild =
        node.children.length === 0 ? null : currentFlowPlanNode.concat(0);
    } else {
      tempNodeNavigation.parent = currentFlowPlanNode.slice(0, -1);
      tempNodeNavigation.preSibling =
        currentFlowPlanNode[currentFlowPlanNodeLength - 1] === 0
          ? null
          : currentFlowPlanNode
              .slice(0, -1)
              .concat(currentFlowPlanNode[currentFlowPlanNodeLength - 1] - 1);
      tempNodeNavigation.nextSibling =
        currentFlowPlanNode[currentFlowPlanNodeLength - 1] + 1 >
        parentNodeChildrenLength - 1
          ? null
          : currentFlowPlanNode
              .slice(0, -1)
              .concat(currentFlowPlanNode[currentFlowPlanNodeLength - 1] + 1);
      tempNodeNavigation.firstChild =
        node.children.length === 0 ? null : currentFlowPlanNode.concat(0);
    }
    setNodeNavigation(tempNodeNavigation);
  }, [currentFlowPlanNode]);
  return (
    <div
      style={{
        width: `${
          docConfig?.fullscreen === "true" ? "100vw" : `${docConfig.width}px`
        }`,
      }}
      className={`${
        // if addEditNode.show is true then show component else hide component
        !node ? "translate-x-full" : ""
      } z-10 transition-all duration-200 max-md:w-full max-w-[100vw] w-[750px] bg-[var(--bg-secondary)]  px-1 grow-0 h-full absolute right-0 top-0 text-gray-200 flex flex-col justify-between items-center gap-1 border-l-2 border-[var(--border-primary)]`}
    >
      <button
        onMouseDown={handleMouseDown}
        className="w-[2px] hover:w-2 transition-all bg-[var(--border-primary)] z-[20] h-full absolute top-0 -left-1 cursor-ew-resize"
      ></button>
      <div
        style={
          node?.pin?.show &&
          node?.data[node?.pin?.index] &&
          node?.pin?.id === node?.data[node?.pin?.index].id
            ? {
                height: "60px",
                paddingBottom: "5px",
              }
            : { height: "35px" }
        }
        className="absolute flex flex-col justify-between items-center top-0 z-10 w-full h-[35px] bg-[var(--border-primary)] px-2"
      >
        <div className="flex justify-between items-center w-full h-fit">
          <button className="w-8 h-8 rounded-full" onClick={handleCloseDocView}>
            <CloseBtnIcon />
          </button>
          {showNodeNavigation && (
            <button
              style={{
                cursor: !nodeNavigation.parent ? "not-allowed" : "pointer",
                opacity: !nodeNavigation.parent ? "0.5" : "1",
              }}
              onClick={() => handleNavigation(nodeNavigation.parent)}
              className="w-24 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
              disabled={!nodeNavigation.parent}
            >
              <span className="block w-3 h-3 rotate-180">
                <BackIcon />
              </span>
              <span>Parent</span>
            </button>
          )}

          <button
            className="w-8 h-8"
            onClick={() => setShowNodeNavigation((prev) => !prev)}
            title="Show Node Navigation"
          >
            <InheritIcon />
          </button>
          {showNodeNavigation && (
            <button
              style={{
                cursor: !nodeNavigation.firstChild ? "not-allowed" : "pointer",
                opacity: !nodeNavigation.firstChild ? "0.5" : "1",
              }}
              onClick={() => handleNavigation(nodeNavigation.firstChild)}
              className="w-28 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
              disabled={!nodeNavigation.firstChild}
            >
              <span>First Child</span>
              <span className="block w-3 h-3">
                <BackIcon />
              </span>
            </button>
          )}
          <button onClick={handleFullScreen} className="w-5 h-5 rounded-full">
            <FullScreenIcon />
          </button>
        </div>
        {node?.pin?.show &&
          node?.data[node?.pin?.index] &&
          node?.pin?.id === node?.data[node?.pin?.index].id && (
            <ProgressBar
              progress={progress}
              border={true}
              color={node?.data[node?.pin?.index]?.config?.color}
              multiColor={node?.data[node?.pin?.index]?.config?.multiColor}
              showPercentage={
                node?.data[node?.pin?.index]?.config?.showPercentage
              }
            />
          )}
      </div>
      <div
        style={
          node?.pin?.show &&
          node?.data[node?.pin?.index] &&
          node?.pin?.id === node?.data[node?.pin?.index].id
            ? {
                height: "calc(100% - 60px)",
                marginTop: "60px",
              }
            : { height: `calc(100% - ${showNodeNavigation ? "78px" : "35px"}` }
        }
        className="mt-[35px] w-full flex flex-col justify-start items-center"
      >
        <div className=" w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1 pb-14 overflow-x-hidden">
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
              // borderColor: `${node?.config?.nodeConfig?.borderColor}`,
            }}
            className="shrink-0 text-[var(--text-primary)] relative w-full text-left text-2xl border-b border-[var(--border-primary)] py-2 pb-3 px-2  transition-colors duration-300"
          >
            {node?.title}
          </h3>
          <div className="w-full h-fit flex justify-between px-2">
            {node?.createdAt && (
              <span className="block text-xs  text-[var(--text-secondary)]">
                <span className="">Created: </span>
                <TimeAndDate
                  absolute={false}
                  timeDate={new Date(node?.createdAt)}
                />
              </span>
            )}
            {node?.updatedAt && (
              <span className="block text-xs text-[var(--text-secondary)]">
                <span className="">Updated: </span>
                <TimeAndDate
                  absolute={false}
                  timeDate={new Date(node?.updatedAt)}
                />
              </span>
            )}
          </div>
          {node?.data?.length ? (
            <DocRenderViewContainer
              node={node}
              move={move}
              setMove={setMove}
              setNode={setNode}
              showAdd={showAdd}
              setShowAdd={setShowAdd}
              currentField={currentField}
              setCurrentField={setCurrentField}
              currentFieldType={currentFieldType}
              setCurrentFieldType={setCurrentFieldType}
              handleEditField={handleEditField}
              handleResetShowAdd={handleResetShowAdd}
            />
          ) : (
            <div className=" flex justify-center items-center flex-col">
              <p className="text-[var(--text-primary)]">
                Add Something From Below Menu
              </p>
            </div>
          )}
          {!currentField?.id && !showAdd.show && (
            <AddEditField
              setShowAdd={setShowAdd}
              setCurrentFieldType={setCurrentFieldType}
              node={node}
              setNode={setNode}
              type={currentFieldType}
              currentField={currentField}
              setCurrentField={setCurrentField}
              currentFieldType={currentFieldType}
              dataIndex={null}
              handleResetShowAdd={handleResetShowAdd}
            />
          )}

          <MenuButtons
            node={node}
            setCurrentField={setCurrentField}
            setType={setCurrentFieldType}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
          />
        </div>
      </div>
      {showNodeNavigation && (
        <div className="shrink-0 h-fit flex justify-between items-center w-full gap-5 mb-1">
          <button
            style={{
              cursor: !nodeNavigation.preSibling ? "not-allowed" : "pointer",
              opacity: !nodeNavigation.preSibling ? "0.5" : "1",
            }}
            onClick={() => handleNavigation(nodeNavigation.preSibling)}
            className="w-40 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
            disabled={!nodeNavigation.preSibling}
          >
            <span className="block w-3 h-3 rotate-180">
              <BackIcon />
            </span>
            <span>Previous Sibling</span>
          </button>
          <button
            style={{
              cursor: !nodeNavigation.nextSibling ? "not-allowed" : "pointer",
              opacity: !nodeNavigation.nextSibling ? "0.5" : "1",
            }}
            onClick={() => handleNavigation(nodeNavigation.nextSibling)}
            className="w-40 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
            disabled={!nodeNavigation.nextSibling}
          >
            <span>Next Sibling</span>
            <span className="block w-3 h-3">
              <BackIcon />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
const DocRenderViewContainer = ({
  node,
  move,
  setMove,
  setNode,
  showAdd,
  setShowAdd,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleEditField,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleMove = async (items) => {
    if (items?.length === 0) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    node.data = items;
    node.updatedAt = new Date();
    handleResetShowAdd();
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <SortableList
      items={node?.data}
      onChange={handleMove}
      renderItem={(item, active, setActive, index) => (
        <SortableList.Item id={item.id}>
          <DocRenderView
            key={"field-id-" + item.type + "-" + item.id}
            field={item}
            i={index}
            length={node.data.length}
            node={node}
            move={move}
            setMove={setMove}
            setNode={setNode}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
            currentField={currentField}
            setCurrentField={setCurrentField}
            currentFieldType={currentFieldType}
            setCurrentFieldType={setCurrentFieldType}
            handleEditField={handleEditField}
            handleResetShowAdd={handleResetShowAdd}
            DragHandle={SortableList.DragHandle}
            active={active}
            setActive={setActive}
          />
        </SortableList.Item>
      )}
    />
  );
};

const DocRenderView = ({
  field,
  i,
  length,
  node,
  move,
  setMove,
  setNode,
  showAdd,
  setShowAdd,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleEditField,
  handleResetShowAdd,
  DragHandle,
  active,
  setActive,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
    fieldStyles,
    setFieldStyles,
    copyField,
    setCopyField,
    dragDurationAll,
    setDragDurationAll,
  } = useStateContext();
  const { copyToClipboard } = useFunctions();

  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [progress, setProgress] = useState(0);
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
      icon: (n) => n + 1,
    },
    {
      type: "roman",
      a: "i",
      icon: (n) => handleNumberToRoman(n + 1),
    },
    {
      type: "alphabet",
      a: "A",
      icon: (n) => handleNumberToAlphabet(n + 1),
    },
  ];
  const handleNumberToRoman = (num) => {
    const romanNumerals = [
      { value: 1000, numeral: "M" },
      { value: 900, numeral: "CM" },
      { value: 500, numeral: "D" },
      { value: 400, numeral: "CD" },
      { value: 100, numeral: "C" },
      { value: 90, numeral: "XC" },
      { value: 50, numeral: "L" },
      { value: 40, numeral: "XL" },
      { value: 10, numeral: "X" },
      { value: 9, numeral: "IX" },
      { value: 5, numeral: "V" },
      { value: 4, numeral: "IV" },
      { value: 1, numeral: "I" },
    ];

    let result = "";

    for (const pair of romanNumerals) {
      while (num >= pair.value) {
        result += pair.numeral;
        num -= pair.value;
      }
    }

    return result;
  };
  const handleNumberToAlphabet = (num) => {
    if (num < 1) {
      return "Number out of range (>= 1)";
    }

    let result = "";
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }
    return result;
  };

  const handleSetAdd = () => {
    setShowAdd((prev) => {
      setCurrentField(null);
      return { show: true, index: i };
    });
  };

  const handleSetMove = () => {
    if (field?.type === "durationEnd" || field?.type === "duration") return;
    setMove((prev) => ({
      move: !prev.move,
      id: field.id,
    }));
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

  const handleMoveUp = async () => {
    if (i === 0) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let temp = node.data[i];
    node.data[i] = node.data[i - 1];
    node.data[i - 1] = temp;
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

  const handleMoveDown = async () => {
    if (i === length - 1) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let temp = node.data[i];
    node.data[i] = node.data[i + 1];
    node.data[i + 1] = temp;
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };
  const handleDublicateField = async (i, duplicateContainingFields = false) => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let temp;
    if (field.type === "durationEnd") return;
    if (field.type === "duration") {
      let tempDuration = structuredClone(node.data[i]);
      tempDuration.id = v4();
      let tempFields = [];
      for (let j = i + 1; j < node.data.length; j++) {
        if (node?.data[j]?.type === "durationEnd") {
          if (node?.data[j]?.data?.durationId === node?.data[i]?.id) {
            let tempDurationEnd = structuredClone(node.data[j]);
            tempDurationEnd.id = v4();
            tempDurationEnd.data.durationId = tempDuration.id;
            node.data.splice(j + 1, 0, tempDuration);
            node.data.splice(j + 2, 0, tempDurationEnd);
            node.data.splice(j + 2, 0, ...tempFields);
            break;
          }
        } else {
          if (!duplicateContainingFields) continue;
          temp = structuredClone(node.data[j]);
          temp.id = v4();
          if (
            field.type === "unorderedList" ||
            field.type === "numberList" ||
            field.type === "taskList"
          ) {
            temp.data.list = temp.data.list.map((item) => {
              item.id = v4();
              return item;
            });
          }
          tempFields.push(temp);
        }
      }
    } else {
      temp = structuredClone(node.data[i]);
      temp.id = v4();
      if (
        field.type === "unorderedList" ||
        field.type === "numberList" ||
        field.type === "taskList"
      ) {
        temp.data.list = temp.data.list.map((item) => {
          item.id = v4();
          return item;
        });
      }
      node.data.splice(i + 1, 0, temp);
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };
  const handleDeleteField = async (deleteContainingFields = false) => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    const fieldType = node?.data[i]?.type;
    if (fieldType === "durationEnd") return;
    if (fieldType === "duration") {
      for (let j = i + 1; j < node.data.length; j++) {
        if (node?.data[j]?.type === "durationEnd") {
          if (node?.data[j]?.data?.durationId === node?.data[i]?.id) {
            if (!deleteContainingFields) {
              node.data.splice(j, 1);
              break;
            }
            node.data.splice(i + 1, j - i);
          }
        }
      }
    }
    node.data.splice(i, 1);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

  const handleCopyFieldStyles = () => {
    setFieldStyles({
      type: field.type,
      config: structuredClone(field.config),
    });
  };

  const handlePasteFieldStyles = async () => {
    if (!fieldStyles.config) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });

    if (fieldStyles.type !== field.type) {
      let oldConfig = structuredClone(node.data[i].config);
      let newConfig = structuredClone(fieldStyles.config);
      Object.keys(oldConfig).forEach((key) => {
        if (newConfig[key]) {
          oldConfig[key] = newConfig[key];
        }
      });
      node.data[i].config = structuredClone(oldConfig);
    } else {
      node.data[i].config = structuredClone(fieldStyles.config);
    }

    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

  const handleCopyField = (i, copyContainingFields = false) => {
    const fieldType = node?.data[i]?.type;
    if (fieldType === "durationEnd") return;
    if (fieldType === "duration") {
      let tempDuration = structuredClone(node.data[i]);
      let tempFields = [];
      for (let j = i + 1; j < node.data.length; j++) {
        if (node?.data[j]?.type === "durationEnd") {
          if (node?.data[j]?.data?.durationId === node?.data[i]?.id) {
            let tempDurationEnd = structuredClone(node.data[j]);
            tempDurationEnd.id = v4();
            tempDuration.id = v4();
            tempDurationEnd.data.durationId = tempDuration.id;
            tempDuration.containingFields = tempFields;
            tempDuration.durationEnd = tempDurationEnd;
            setCopyField(tempDuration);
            return;
          }
        } else {
          if (!copyContainingFields) continue;
          let temp = structuredClone(node.data[j]);
          temp.id = v4();
          if (
            field.type === "unorderedList" ||
            field.type === "numberList" ||
            field.type === "taskList"
          ) {
            temp.data.list = temp.data.list.map((item) => {
              item.id = v4();
              return item;
            });
          }
          tempFields.push(temp);
        }
      }
    }
    let newField = structuredClone(field);
    setCopyField(newField);
  };

  const handlePasteField = async () => {
    if (!copyField) return;
    const fieldType = copyField?.type;
    if (fieldType === "durationEnd") return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    const currentFieldType = node?.data[i]?.type;
    if (currentFieldType === "duration" && fieldType === "duration") return;
    let durationEnd = false;
    for (let j = i; j < node.data.length; j++) {
      if (node?.data[j]?.type === "durationEnd") {
        durationEnd = true;
        break;
      } else if (node?.data[j]?.type === "duration") {
        durationEnd = false;
        break;
      }
    }
    console.log(fieldType, durationEnd);
    if (fieldType === "duration" && durationEnd) return;

    if (fieldType === "duration") {
      console.log(copyField);
      let tempDuration = structuredClone(copyField);
      let tempFields = structuredClone(tempDuration?.containingFields);
      let tempDurationEnd = structuredClone(tempDuration?.durationEnd);
      delete tempDuration.containingFields;
      delete tempDuration.durationEnd;
      node.data.splice(i + 1, 0, tempDuration);
      node.data.splice(i + 2, 0, tempDurationEnd);
      node.data.splice(i + 2, 0, ...tempFields);
    } else {
      let newField = structuredClone(copyField);
      if (
        newField.type === "unorderedList" ||
        newField.type === "numberList" ||
        newField.type === "taskList"
      ) {
        newField.data.list = newField.data.list.map((item) => {
          item.id = v4();
          return item;
        });
      }
      newField.id = v4();

      node.data.splice(i + 1, 0, newField);
    }

    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

  const handleCalculateProgressCurrentDoc = () => {
    let total = 0;
    let completed = 0;
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          total++;
          if (task.completed) {
            completed++;
          }
        });
      }
    });
    return total === 0 ? 100 : (completed / total) * 100;
  };

  const handleCalculateProgress = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };

    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          info.total++;
          if (task.completed) {
            info.completed++;
          }
        });
      }
    });
    if (node.children.length > 0) {
      node.children.forEach((item) => {
        const childInfo = handleCalculateProgress(item);
        info.total += childInfo.total;
        info.completed += childInfo.completed;
      });
    }
    return info;
  };

  const handleCalculateCustomProgress = (node, selected = undefined) => {
    let info = {
      total: 0,
      completed: 0,
    };

    let filtered = selected?.filter((i) => i?.id === node?.id);
    if (filtered.length > 0) {
      node?.data.forEach((item) => {
        if (item?.type === "taskList") {
          if (item?.config?.repeat) return;
          let filteredList = filtered[0]?.tasks?.filter(
            (i) => i?.id === item?.id
          );
          if (filteredList.length === 0) return;
          if (filteredList[0]?.id !== item?.id) return;
          if (!filteredList[0]?.selected) return;
          item.data.list.forEach((task) => {
            info.total++;
            if (task.completed) {
              info.completed++;
            }
          });
        }
      });
    }
    if (node.children.length > 0) {
      node.children.forEach((item) => {
        const childInfo = handleCalculateCustomProgress(item, selected);
        info.total += childInfo.total;
        info.completed += childInfo.completed;
      });
    }
    return info;
  };

  const handleCalculateProgressCurrentDocAndChild = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    info = handleCalculateProgress(node);
    return info.total === 0 ? 100 : (info.completed / info.total) * 100;
  };

  const handleCalculateProgressCustom = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    info = handleCalculateCustomProgress(node, field?.data?.progress?.selected);
    return info.total === 0 ? 100 : (info.completed / info.total) * 100;
  };

  const handleCalculateProgressField = (type) => {
    try {
      if (type === "doc") {
        return handleCalculateProgressCurrentDoc();
      } else if (type === "docChild") {
        return handleCalculateProgressCurrentDocAndChild(node);
      } else if (type === "docAll") {
        return handleCalculateProgressCurrentDocAndChild(currentFlowPlan.root);
      } else if (type === "custom") {
        return handleCalculateProgressCustom(currentFlowPlan.root);
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  useEffect(() => {
    if (field?.type === "progress") {
      setProgress(handleCalculateProgressField(field?.data?.progress?.type));
    }
  }, []);

  return (
    <div
      onClick={() => setShowMenu(true)}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => {
        setShowMenu(false);
        setShowSubMenu(false);
      }}
      id={"field_id_" + field.id}
      className=" group w-full relative flex justify-center items-center flex-col gap-1"
      style={
        active?.id === field?.id
          ? {
              border: "2px solid",
              borderRadius: "5px",
              borderColor: "var(--btn-add)",
            }
          : active?.id
          ? {
              // border: "2px solid",
              // borderRadius: "5px",
              // borderColor: "var(--btn-move)",
              // marginBottom: "4px",
            }
          : {}
      }
    >
      {field.type === "heading" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "block",
          }}
          className="w-full"
        >
          <h3
            style={{
              fontSize: `${field?.config?.fontSize}px`,
              textDecoration: `${
                field?.config?.strickthrough ? "line-through" : "none"
              }`,
              fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
              fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
              color: `${field?.config?.color}`,
              fontFamily: `${field?.config?.fontFamily}`,
              borderColor: `${field?.config?.nodeConfig?.borderColor}`,
              textAlign: `${field?.config?.align}`,
            }}
            className="relative p-1 bg-[var(--bg-secondary)] rounded-md group text-[var(--text-primary)] w-full h-fit text-center text-2xl transition-colors duration-300 cursor-pointer"
            onDoubleClick={() => handleEditField(field, i)}
          >
            {field?.data?.text}
          </h3>
        </div>
      )}
      {field.type === "paragraph" && (
        <p
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md"
          onDoubleClick={() => handleEditField(field, i)}
          style={{
            textDecoration: `${
              field?.config?.strickthrough ? "line-through" : "none"
            }`,
            fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
            fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
            color: `${field?.config?.color}`,
            fontFamily: `${field?.config?.fontFamily}`,
            borderColor: `${field?.config?.nodeConfig?.borderColor}`,
            textAlign: `${field?.config?.align}`,
            display: field?.id === currentField?.id ? "none" : "block",
            whiteSpace: "pre-wrap",
            lineHeight: "1.25rem",
          }}
        >
          {field?.data?.text}
        </p>
      )}
      {field.type === "unorderedList" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
            paddingLeft: `${field?.config?.indentation * 10 || 4}px`,
          }}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
        >
          {field?.data?.list?.map((item, j) => (
            <div
              key={`shown-list-item-${item?.id || j}`}
              className="w-full flex justify-center items-center text-sm"
              onDoubleClick={() => handleEditField(field, i)}
            >
              <span
                className="w-full flex text-[var(--text-primary)] bg-transparent outline-none break-all"
                style={{
                  fontSize: `${field?.config?.fontSize}px`,
                  textDecoration: `${
                    field?.config?.strickthrough ? "line-through" : "none"
                  }`,
                  fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
                  fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
                  fontFamily: `${field?.config?.fontFamily}`,
                  color: `${field?.config?.color}`,
                  textAlign: `${field?.config?.align}`,
                }}
              >
                <span
                  style={{
                    color: `${field?.config?.color}`,
                  }}
                  className="w-3 h-5 mr-1 block shrink-0"
                >
                  {
                    listStyles?.find(
                      (listStyle) => listStyle.type === field.config?.listStyle
                    )?.icon
                  }
                </span>

                {item?.value ?? item}
              </span>
            </div>
          ))}
        </div>
      )}
      {field.type === "taskList" && (
        <TaskListDisplay
          field={field}
          i={i}
          node={node}
          setNode={setNode}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          handleEditField={handleEditField}
        />
      )}
      {field.type === "numberList" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
            paddingLeft: `${field?.config?.indentation * 10 || 4}px`,
          }}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
        >
          {field?.data?.list?.map((item, j) => (
            <div
              key={`shown-list-item-${item?.id || j}`}
              className="w-full flex justify-center items-center text-sm"
              onDoubleClick={() => handleEditField(field, i)}
            >
              <span
                className="w-full flex text-[var(--text-primary)] bg-transparent outline-none break-all"
                style={{
                  fontSize: `${field?.config?.fontSize}px`,
                  textDecoration: `${
                    field?.config?.strickthrough ? "line-through" : "none"
                  }`,
                  fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
                  fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
                  fontFamily: `${field?.config?.fontFamily}`,
                  color: `${field?.config?.color}`,
                  textAlign: `${field?.config?.align}`,
                }}
              >
                <span
                  style={{
                    color: `${field?.config?.color}`,
                  }}
                  className="w-3 h-5 mr-1 shrink-0 flex justify-center items-center text-sm"
                >
                  {numberListStyles
                    ?.find(
                      (listStyle) => listStyle.type === field?.config?.listStyle
                    )
                    ?.icon(j) + "."}
                </span>

                {item?.value ?? item}
              </span>
            </div>
          ))}
        </div>
      )}
      {field.type === "link" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
          }}
          onDoubleClick={() => handleEditField(field, i)}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-2"
        >
          <div className="w-full flex justify-start items-center overflow-x-hidden">
            <a
              href={field?.data?.link}
              target="_blank"
              rel="noreferrer"
              className="w-fit flex text-[var(--text-primary)] cursor-pointer bg-transparent outline-none hover:underline break-all"
              style={{
                fontSize: `${field?.config?.fontSize}px`,
                textDecoration: `${
                  field?.config?.strickthrough ? "line-through" : "none"
                }`,
                fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
                fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
                fontFamily: `${field?.config?.fontFamily}`,
                color: `${field?.config?.color}`,
                textAlign: `${field?.config?.align}`,
              }}
            >
              <span
                style={{
                  color: `${field?.config?.color}`,
                }}
                className="w-3 h-5 mr-1 block shrink-0"
              >
                <LinkIcon />
              </span>
              {field?.data?.link}
            </a>
          </div>
          {field?.config?.preview && (
            <LinkPreview
              previewLink={field?.data?.previewLink}
              link={field?.data?.link}
            />
          )}
        </div>
      )}
      {field.type === "image" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
          }}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
          onDoubleClick={() => handleEditField(field, i)}
        >
          <div className="w-full flex justify-center items-center overflow-x-hidden">
            <img
              src={field?.data?.image?.url}
              alt={field?.data?.image?.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
      )}
      {field.type === "file" && (
        <FileView
          field={field}
          i={i}
          node={node}
          setNode={setNode}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          handleEditField={handleEditField}
        />
      )}
      {field.type === "table" && (
        <TableView
          field={field}
          i={i}
          node={node}
          setNode={setNode}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          handleEditField={handleEditField}
        />
      )}
      {field.type === "separator" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
          }}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
          onDoubleClick={() => handleEditField(field, i)}
        >
          <span
            className="w-full h-0 rounded-full"
            style={{
              borderWidth: `${field?.config?.borderWidth}px`,
              borderColor: `${field?.config?.borderColor}`,
              borderStyle: `${field?.config?.borderStyle}`,
            }}
          ></span>
        </div>
      )}
      {field.type === "timestamp" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
          }}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
          onDoubleClick={() => handleEditField(field, i)}
        >
          <span
            className="w-full text-[var(--text-primary)] bg-transparent outline-none hover:underline break-all"
            style={{
              fontSize: `${field?.config?.fontSize}px`,
              textDecoration: `${
                field?.config?.strickthrough ? "line-through" : "none"
              }`,
              fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
              fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
              fontFamily: `${field?.config?.fontFamily}`,
              color: `${field?.config?.color}`,
              textAlign: `${field?.config?.align}`,
            }}
          >
            {field?.data?.timestamp?.string}
          </span>
        </div>
      )}
      {field.type === "codeBlock" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
          }}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col"
          onDoubleClick={() => handleEditField(field, i)}
        >
          {!field?.data?.code?.hideTop && (
            <div className="w-full h-fit text-xs text-[var(--text-primary)] flex justify-between items-center gap-2 flex-wrap py-1 px-2 bg-[var(--bg-tertiary)] rounded-t-md">
              <span>{field?.data?.code?.language}</span>
              <button
                onClick={() =>
                  copyToClipboard(currentField?.data?.code?.string)
                }
                className="w-6 h-6 p-1 flex justify-center items-center hover:bg-[var(--bg-secondary)] rounded-md bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
                title="Copy Code"
              >
                <span className="w-full h-full flex justify-center items-center">
                  <CopyIcon />
                </span>
              </button>
            </div>
          )}
          <SyntaxHighlighter
            customStyle={{
              width: "100%",
              margin: "0px",
              padding: "3px",
              borderRadius: field?.data?.code?.hideTop
                ? "5px"
                : "0px 0px 5px 5px",
            }}
            className="small-scroll-bar"
            showLineNumbers={field?.data?.code?.lineNumbers ?? false}
            showInlineLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
            language={field?.data?.code?.language}
            style={Themes[field?.data?.code?.theme] ?? Themes["dracula"]}
          >
            {field?.data?.code?.string}
          </SyntaxHighlighter>
        </div>
      )}
      {field.type === "progress" && (
        <div
          style={{
            display: field?.id === currentField?.id ? "none" : "flex",
          }}
          className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col"
          onDoubleClick={() => handleEditField(field, i)}
        >
          <ProgressBar
            progress={progress}
            color={field?.config?.color}
            multiColor={field?.config?.multiColor}
            showPercentage={field?.config?.showPercentage}
          />
        </div>
      )}
      {field.type === "duration" && (
        <DurationDisplay
          onDoubleClick={() => handleEditField(field, i)}
          currentField={currentField}
          field={field}
        />
      )}
      {field.type === "durationEnd" && (
        <DurationEndDisplay
          node={node}
          field={field}
          currentField={currentField}
        />
      )}
      {field.type === "durationTimeline" && (
        <DurationTimelineDisplay
          i={i}
          node={node}
          field={field}
          currentFlowPlan={currentFlowPlan}
          currentField={currentField}
          onDoubleClick={() => handleEditField(field, i)}
        />
      )}

      {currentField?.id !== field?.id && showAdd.index !== i && !move.move && (
        <span
          style={{
            opacity: showMenu ? 1 : 0,
            pointerEvents: showMenu ? "all" : "none",
            top:
              field.type === "codeBlock" || field?.config?.repeat
                ? "40px"
                : "4px",
            height: showSubMenu ? "55px" : "",
            width: showSubMenu
              ? field.type === "duration"
                ? "230px"
                : "165px"
              : "",
          }}
          onMouseLeave={() => setShowSubMenu(false)}
          className="transition-opacity absolute flex justify-end items-start gap-1 w-fit h-6 right-1 top-1 z-10"
        >
          {field.type === "duration" && (
            <div
              onMouseDown={() => {
                setDragDurationAll(true);
              }}
            >
              <DragHandle
                setActive={setActive}
                title="Drag Duration and its containing fields"
                className="w-6 h-6 shrink-0 bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center"
              />
            </div>
          )}
          <DragHandle
            title="Drag"
            setActive={setActive}
            className="w-6 h-6 shrink-0 bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center"
          />
          <button
            onClick={() => handleEditField(field, i)}
            className="w-6 h-6 shrink-0 bg-[var(--bg-tertiary)] p-1 rounded-md"
          >
            <EditBtnIcon />
          </button>
          <button
            onClick={handleSetAdd}
            className="w-6 h-6 shrink-0 bg-[var(--bg-tertiary)] p-1 rounded-md"
          >
            <AddIcon />
          </button>
          <button
            onClick={handleSetMove}
            className="w-6 h-6 shrink-0 bg-[var(--bg-tertiary)] p-1 rounded-md"
          >
            <MoveIcon />
          </button>
          <span
            className="w-6 h-6 shrink-0 bg-[var(--bg-tertiary)] p-1 rounded-md relative cursor-pointer"
            onClick={() => setShowSubMenu(true)}
            onMouseEnter={() => setShowSubMenu(true)}
          >
            <EditIcon />
            {showSubMenu && (
              <div
                style={{
                  right: field.type === "duration" ? "225px" : "140px",
                }}
                className="w-full h-full gap-1 absolute right-[140px] top-7 flex"
              >
                <button
                  onClick={() => handleCopyField(i)}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Copy Field"
                >
                  <CopyIcon />
                </button>
                {field.type === "duration" && (
                  <button
                    onClick={() => handleCopyField(i, true)}
                    className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                    title="Copy Duration and its containing fields"
                  >
                    <CopyIcon />
                  </button>
                )}

                <button
                  onClick={handlePasteField}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0 "
                  title="Paste Field Below"
                >
                  <PasteIcon />
                </button>
                <button
                  onClick={() => handleDublicateField(i)}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Duplicate Field"
                >
                  <DublicateIcon />
                </button>
                {field.type === "duration" && (
                  <button
                    onClick={() => handleDublicateField(i, true)}
                    className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                    title="Duplicate Duration and its containing fields"
                  >
                    <DublicateIcon />
                  </button>
                )}

                <button
                  onClick={handleCopyFieldStyles}
                  className="w-6 h-6  bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Copy Field Styles"
                >
                  <CopyStyleIcon />
                </button>
                <button
                  onClick={handlePasteFieldStyles}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Paste Field Styles"
                >
                  <PasteStyleIcon />
                </button>

                <button
                  onClick={() => handleDeleteField()}
                  className="w-6 h-6 hover:bg-[var(--btn-delete)]  bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Delete Field"
                >
                  <DeleteIcon />
                </button>

                {field.type === "duration" && (
                  <button
                    onClick={() => handleDeleteField(true)}
                    className="w-6 h-6 hover:bg-[var(--btn-delete)]  bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                    title="Delete Field and its containing fields"
                  >
                    <DeleteIcon />
                  </button>
                )}
              </div>
            )}
          </span>
        </span>
      )}
      {move.move && move.id === field.id && (
        <div className="absolute bottom-0 w-fit h-fit rounded-md flex justify-center items-center gap-2">
          <button
            onClick={handleMoveUp}
            className="w-8 h-8 bg-[var(--bg-tertiary)] p-2 rounded-md -rotate-90"
            title="Move Up"
          >
            <BackIcon />
          </button>
          <button
            onClick={() => setMove((prev) => !prev)}
            className="w-8 h-8 bg-[var(--bg-tertiary)] p-1 rounded-md "
            title="Close Move Menu"
          >
            <span className="w-full h-full flex justify-center items-center">
              <CloseBtnIcon />
            </span>
          </button>
          <button
            onClick={handleMoveDown}
            className="w-8 h-8 bg-[var(--bg-tertiary)] p-2 rounded-md rotate-90"
            title="Move Down"
          >
            <BackIcon />
          </button>
        </div>
      )}
      {showAdd.show && showAdd.index === i && (
        <AddEditField
          setShowAdd={setShowAdd}
          setCurrentFieldType={setCurrentFieldType}
          node={node}
          setNode={setNode}
          type={currentFieldType}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          dataIndex={i}
          handleResetShowAdd={handleResetShowAdd}
        />
      )}
      {showAdd.show && showAdd.index === i && (
        <div className="flex justify-center items-center">
          <MenuButtons
            node={node}
            setCurrentField={setCurrentField}
            setType={setCurrentFieldType}
            setShowAdd={setShowAdd}
            showAdd={showAdd}
            hide={true}
            currentFieldIndex={i}
            extrabuttons={[
              {
                handle: handleResetShowAdd,
                icon: <CloseBtnIcon />,
                toolTip: "Close",
              },
            ]}
          />
        </div>
      )}
      {currentField?.id === field?.id && (
        <AddEditField
          dataIndex={i}
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
  );
};

const MenuButtons = ({
  node,
  setType,
  setCurrentField,
  showAdd,
  setShowAdd,
  hide = false,
  currentFieldIndex = null,
  extrabuttons = null,
}) => {
  const {
    db,
    copyField,
    currentFlowPlan,
    setCurrentFlowPlan,
    currentFlowPlanNode,
  } = useStateContext();
  const [showToolTip, setShowToolTip] = useState({
    show: false,
    index: null,
  });
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
      type: "progress",
      text: "Progress",
      icon: <TopbarIcon />,
    },
    {
      type: "timestamp",
      text: "Timestamp",
      icon: <TimeStampIcon />,
    },
    {
      type: "duration",
      text: "Duration",
      icon: <DurationIcon />,
    },
    {
      type: "durationTimeline",
      text: "Duration Timeline",
      icon: <DurationTimelineIcon />,
    },
    {
      type: "codeBlock",
      text: "Code Block",
      icon: <CodeIcon />,
    },
  ];

  const handleButtonClick = (type) => {
    if (!hide) {
      setShowAdd({ show: false, index: null });
    }
    setCurrentField(null);
    setType((prev) => {
      if (prev === type) return null;
      if (prev !== type) return type;
      if (prev === null) return type;
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

  const handlePasteField = async () => {
    if (!copyField) return;
    let i = currentFieldIndex;
    const fieldType = copyField?.type;
    if (fieldType === "durationEnd") return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (i !== null) {
      const currentFieldType = node?.data[i]?.type;
      if (currentFieldType === "duration" && fieldType === "duration") return;
      let durationEnd = false;
      for (let j = i; j < node.data.length; j++) {
        if (node?.data[j]?.type === "durationEnd") {
          durationEnd = true;
          break;
        } else if (node?.data[j]?.type === "duration") {
          durationEnd = false;
          break;
        }
      }
      if (fieldType === "duration" && durationEnd) return;
    }

    if (fieldType === "duration") {
      console.log(copyField);
      let tempDuration = structuredClone(copyField);
      let tempFields = structuredClone(tempDuration?.containingFields);
      let tempDurationEnd = structuredClone(tempDuration?.durationEnd);
      delete tempDuration.containingFields;
      delete tempDuration.durationEnd;
      if (i === null) {
        node.data.push(tempDuration);
        node.data.push(...tempFields);
        node.data.push(tempDurationEnd);
      } else {
        node.data.splice(i + 1, 0, tempDuration);
        node.data.splice(i + 2, 0, tempDurationEnd);
        node.data.splice(i + 2, 0, ...tempFields);
      }
    } else {
      let newField = structuredClone(copyField);
      if (
        newField.type === "unorderedList" ||
        newField.type === "numberList" ||
        newField.type === "taskList"
      ) {
        newField.data.list = newField.data.list.map((item) => {
          item.id = v4();
          return item;
        });
      }
      newField.id = v4();
      if (i === null) {
        node.data.push(newField);
      } else {
        node.data.splice(i + 1, 0, newField);
      }
    }

    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

  return (
    <div className="w-fit rounded-md h-fit flex justify-center items-center flex-wrap gap-2 p-1 bg-[var(--bg-secondary)] mt-2">
      {buttons.map((button, i) => (
        <Button
          i={i}
          key={"option-button-id-" + i}
          onClick={() => handleButtonClick(button.type)}
          text={button.text}
          showToolTip={showToolTip}
          setShowToolTip={setShowToolTip}
        >
          {button.icon}
        </Button>
      ))}
      {copyField && (
        <Button
          onClick={handlePasteField}
          text={"Paste Field"}
          showToolTip={showToolTip}
          setShowToolTip={setShowToolTip}
        >
          <PasteIcon />
        </Button>
      )}
      {extrabuttons &&
        extrabuttons.map((button, i) => (
          <Button
            i={i + buttons.length}
            key={"extra-button-id-" + i}
            onClick={button.handle}
            text={button.toolTip}
            showToolTip={showToolTip}
            setShowToolTip={setShowToolTip}
          >
            {button.icon}
          </Button>
        ))}
    </div>
  );
};
const Button = ({
  i,
  children,
  onClick,
  text,
  showToolTip,
  setShowToolTip,
}) => {
  return (
    <button
      onClick={onClick}
      className="shrink-0 group relative w-8 h-8 rounded-md bg-[var(--bg-tertiary)] p-[6px] flex justify-center "
      onMouseEnter={() => setShowToolTip({ show: true, index: i })}
      onMouseLeave={() => setShowToolTip({ show: false, index: null })}
    >
      {children}
      {showToolTip.show && showToolTip.index === i && <ToolTip text={text} />}
    </button>
  );
};

const ToolTip = ({ text }) => {
  return (
    <div className="z-10 flex justify-center items-center absolute -bottom-8 text-center whitespace-nowrap w-fit h-6 bg-[var(--bg-tertiary)] rounded-md px-2">
      <span className="absolute inline-block -top-1 w-3 h-3 rotate-45 bg-[var(--bg-tertiary)] -z-10"></span>
      <span className="text-xs">{text}</span>
    </div>
  );
};

const AddEditField = ({
  setShowAdd,
  dataIndex,
  setCurrentFieldType,
  currentFieldType,
  type,
  node,
  setNode,
  currentField,
  setCurrentField,
  handleResetShowAdd,
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
      case "unorderedList":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          listStyle: "filledCircle",
          indentation: 0,
        };
      case "taskList":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          indentation: 0,
          showDateInfo: false,
          progressBar: false,
          repeat: false,
        };
      case "numberList":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          listStyle: "number",
          indentation: 0,
        };
      case "link":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 14,
          color: "#94edff",
          preview: true,
        };
      case "image":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
        };
      case "file":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
        };
      case "table":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 14,
          borderColor: "var(--border-primary)",
          borderStyle: "solid",
          borderWidth: 2,
        };
      case "separator":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "left",
          fontSize: 16,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "var(--text-primary)",
        };
      case "timestamp":
        return {
          ...defaultNodeConfig.titleConfig,
          align: "center",
          fontSize: 16,
        };
      case "codeBlock":
        return {
          fontSize: 14,
        };
      case "progress":
        return {
          showPercentage: true,
          multiColor: true,
          color: "#199d19",
          pin: false,
        };
      case "duration":
        return {
          color: "#334155",
          showFromTo: true,
        };
      case "durationEnd":
        return {
          color: "#334155",
        };
      case "durationTimeline":
        return {
          color: "#334155",
          showFromTo: true,
          showGraph: true,
          overlap: false,
          type: "day",
          current: null,
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
        list: [],
        taskList: {
          repeat: {
            data: [],
            format: {
              type: "daily",
              des: "Daily",
            },
            custom: [
              {
                type: "monday",
                des: "Monday",
                shortDes: "Mon",
                checked: true,
              },
              {
                type: "tuesday",
                des: "Tuesday",
                shortDes: "Tue",
                checked: true,
              },
              {
                type: "wednesday",
                des: "Wednesday",
                shortDes: "Wed",
                checked: true,
              },
              {
                type: "thursday",
                des: "Thursday",
                shortDes: "Thu",
                checked: true,
              },
              {
                type: "friday",
                des: "Friday",
                shortDes: "Fri",
                checked: true,
              },
              {
                type: "saturday",
                des: "Saturday",
                shortDes: "Sat",
                checked: true,
              },
              {
                type: "sunday",
                des: "Sunday",
                shortDes: "Sun",
                checked: true,
              },
            ],
          },
        },
        link: "",
        image: {
          name: "",
          url: "",
          mimeType: "",
        },
        file: {
          name: "",
          url: "",
          mimeType: "",
        },
        table: [
          {
            type: "head",
            data: [
              {
                text: "Heading 1",
              },
              {
                text: "Heading 2",
              },
            ],
          },
          {
            type: "body",
            data: [
              {
                text: "",
              },
              {
                text: "",
              },
            ],
          },
        ],
        timestamp: {
          string: "",
          iso: new Date().toISOString(),
          format: {
            type: "Date Only",
            input: { day: "2-digit", month: "2-digit", year: "numeric" },
          },
        },
        code: {
          language: "javascript",
          theme: "dracula",
          lineNumbers: true,
          wrapLines: true,
          string: "",
          hideTop: false,
        },
        progress: {
          progress: 0,
          type: "doc",
          list: [],
        },
        duration: {
          start: new Date().toISOString(),
          end: null,
          format: {
            type: "Date and Time (12-Hour)",
            input: {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            },
          },
        },
        durationEnd: { durationId: null },
        durationTimeline: {
          type: "doc",
          format: {
            type: "Date and Time (12-Hour)",
            input: {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            },
          },
          displayFormat: {
            type: "week",
            des: "Week",
          },
        },
      },
      config: handleGetConfig(type),
    });
  }, [type]);
  switch (currentField?.type) {
    case "heading":
      return (
        <InputTitle
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          node={node}
          setNode={setNode}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "paragraph":
      return (
        <Paragraph
          setShowAdd={setShowAdd}
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "unorderedList":
      return (
        <UnorderedList
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "taskList":
      return (
        <TaskList
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "numberList":
      return (
        <NumberList
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "link":
      return (
        <Link
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "image":
      return (
        <Image
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "file":
      return (
        <FileSelector
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "table":
      return (
        <Table
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "separator":
      return (
        <Separator
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "timestamp":
      return (
        <TimeStamp
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "codeBlock":
      return (
        <CodeBlock
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "progress":
      return (
        <Progress
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "duration":
      return (
        <Duration
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    case "durationEnd":
      return (
        <>
          {/* <DurationEnd
            node={node}
            //   handleGetDefaultConfig={handleGetConfig}
            //   currentField={currentField}
            //   setCurrentField={setCurrentField}
            //   currentFieldType={currentFieldType}
            //   setCurrentFieldType={setCurrentFieldType}
            //   dataIndex={dataIndex}
            handleResetShowAdd={handleResetShowAdd}
          /> */}
        </>
      );
    case "durationTimeline":
      return (
        <DurationTimeline
          node={node}
          handleGetDefaultConfig={handleGetConfig}
          currentField={currentField}
          setCurrentField={setCurrentField}
          currentFieldType={currentFieldType}
          setCurrentFieldType={setCurrentFieldType}
          dataIndex={dataIndex}
          handleResetShowAdd={handleResetShowAdd}
        />
      );
    default:
      break;
  }
};
const InputTitle = ({
  dataIndex,
  setCurrentFieldType,
  node,
  setNode,
  currentField,
  setCurrentField,
  handleGetDefaultConfig,
  handleResetShowAdd,
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
    if (currentField.data.text === "") return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (index !== null) {
      node.data[index] = currentField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...currentField,
        id: v4(),
      });
      handleResetShowAdd();
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
      className="w-full flex flex-col justify-center items-start gap-0 bg-[var(--bg-secondary)] rounded-md"
    >
      <input
        type="text"
        autoFocus={true}
        value={currentField?.data?.text ?? ""}
        onChange={handleTitleChange}
        placeholder="Enter heading..."
        required
        className="text-[var(--text-primary)] bg-[var(--bg-secondary)] p-1 w-full rounded-md focus:outline-none focus:border-transparent"
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
        handleGetDefaultConfig={handleGetDefaultConfig}
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
    console.log(currentField);
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
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
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

const LinkPreviewConfig = ({ linkPreview, setLinkPreview }) => {
  const previewFields = [
    {
      type: "title",
      text: "Title",
    },
    {
      type: "description",
      text: "Description",
    },
    {
      type: "favicon",
      text: "Favicon",
    },
    {
      type: "siteName",
      text: "Sitename",
    },
    {
      type: "previewImages",
      text: "Images",
    },
  ];
  const handleSetPreviewLink = (key) => {
    setLinkPreview((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        show: prev[key]?.show ? false : true,
      },
    }));
  };
  return (
    <div className="absolute px-2 py-1 rounded-md left-0 top-9 w-fit flex flex-col gap-2 bg-[var(--btn-secondary)] z-10">
      {previewFields?.map((item) => (
        <div
          key={`preview-id-${item.type}`}
          className="w-full flex gap-1 justify-start items-center "
        >
          <span
            className="w-4 h-4 mr-1 block cursor-pointer"
            onClick={() => handleSetPreviewLink(item.type)}
          >
            {linkPreview[item.type] && linkPreview[item.type]?.show ? (
              <CheckedIcon />
            ) : (
              <UncheckedIcon />
            )}
          </span>
          <label className="text-xs text-[var(--text-primary)]">
            {item.text}
          </label>
        </div>
      ))}
    </div>
  );
};

const Duration = ({
  node,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  handleResetShowAdd,
  dataIndex,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();
  const formats = [
    {
      type: "Date Only",
      input: { day: "2-digit", month: "2-digit", year: "numeric" },
    },
    {
      type: "Time Only (12-Hour)",
      input: { hour: "2-digit", minute: "2-digit", hour12: true },
    },
    {
      type: "Time Only (24-Hour)",
      input: { hour: "2-digit", minute: "2-digit", hour12: false },
    },

    {
      type: "Date and Time (12-Hour)",
      input: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Date and Time (24-Hour)",
      input: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
    {
      type: "Weekday and Time (12-Hour)",
      input: {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Weekday and Time (24-Hour)",
      input: {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
    {
      type: "Month and Year",
      input: { year: "numeric", month: "long" },
    },
    {
      type: "Day of the Week, Month, Day, and Year",
      input: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    },
    {
      type: "Day of the Week, Date, and Time (12-Hour)",
      input: {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Day of the Week, Date, and Time (24-Hour)",
      input: {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
  ];

  const addDurations = [
    {
      type: "1h",
      value: "1h",
    },
    {
      type: "45m",
      value: "45m",
    },
    {
      type: "30m",
      value: "30m",
    },
    {
      type: "15m",
      value: "15m",
    },
    {
      type: "10m",
      value: "10m",
    },
  ];

  const [addOrSub, setAddOrSub] = useState("add");
  const [customDuration, setCustomDuration] = useState("");

  const handleGetFormatedDateTime = (iso) => {
    if (iso === null) return "";
    let date = new Date(iso);
    if (!currentField?.data?.duration?.format?.input)
      return date.toLocaleString();
    const string = new Intl.DateTimeFormat(
      "en-IN",
      currentField?.data?.duration?.format?.input
    ).format(date);
    return string;
  };

  const handleGetDateTime = (iso) => {
    let utcDate;
    if (iso === null) {
      utcDate = new Date();
    } else {
      utcDate = new Date(iso);
    }
    let finalIso = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${utcDate
      .getDate()
      .toString()
      .padStart(2, "0")}T${utcDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${utcDate.getMinutes().toString().padStart(2, "0")}`;
    return finalIso;
  };

  const handleSetDateTime = (e, type) => {
    let time = e.target.value;
    let newDate = new Date(time);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        duration: {
          ...currentField.data.duration,
          [type]: newDate.toISOString(),
        },
      },
    });
  };

  const handleCalculateDuration = (start, end) => {
    if (!start || !end) return null;
    // Parse the ISO date strings into Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculate the difference in milliseconds
    let diffMilliseconds = endDate - startDate;

    // Check if the difference is negative
    if (diffMilliseconds < 0) {
      // diffMilliseconds = 0;
      // Adjust the end date to be the same as the start date
      // endDate.setTime(startDate.getTime());
    }

    // Convert the difference to various units
    const diffSeconds = diffMilliseconds / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;

    // Calculate the difference in months and years
    let diffYears = endDate.getFullYear() - startDate.getFullYear();
    let diffMonths = endDate.getMonth() - startDate.getMonth();

    // Adjust years and months if necessary
    if (diffMonths < 0) {
      diffYears--;
      diffMonths += 12;
    }

    // Convert the total months to include the year part
    const totalMonths = diffYears * 12 + diffMonths;

    return {
      milliseconds: diffMilliseconds,
      seconds: diffSeconds,
      minutes: diffMinutes,
      hours: diffHours,
      days: diffDays,
      months: totalMonths,
      years: diffYears,
      start: startDate,
      end: endDate,
    };
  };

  const handleCheckInvalidDuration = (e, type, start, end) => {
    if (type === "end" && end === null) {
      handleSetDateTime(e, type);
      return;
    }

    if (type === "start") {
      let duration = handleCalculateDuration(start, end);
      if (duration?.milliseconds < 0) {
        handleSetDateTime(e, type);
        return;
      }
    }

    if (type === "end") {
      let duration = handleCalculateDuration(start, end);
      if (duration.milliseconds < 0) {
        console.log(duration);
        handleSetDateTime(e, type);
        return;
      }
    }

    handleSetDateTime(e, type);
  };

  const handleFormatDuration = (duration) => {
    if (!duration) return "";
    let years = Math.floor(duration.years);
    let months = Math.floor(duration.months);
    let days = Math.floor(duration.days);
    let hours = Math.floor(duration.hours) % 24;
    let minutes = Math.floor(duration.minutes) % 60;
    let seconds = Math.floor(duration.seconds) % 60;

    const all = [years, months, days, hours, minutes];

    let string = "";
    all.forEach((item, index) => {
      if (item > 0) {
        if (index === 0) {
          string += `${item}y `;
        } else if (index === 1) {
          string += `${item}m `;
        } else if (index === 2) {
          string += `${item}d `;
        } else if (index === 3) {
          string += `${item}h `;
        } else if (index === 4) {
          string += `${item}m `;
        } else if (index === 5) {
          string += `${item}s `;
        }
      }
    });
    return string;
  };

  const handleParseDuration = (durationStr) => {
    const regex = /(\d+d)?(\d+h)?(\d+m)?(\d+s)?/;
    const matches = durationStr.match(regex);

    const days = matches[1] ? parseInt(matches[1], 10) : 0;
    const hours = matches[2] ? parseInt(matches[2], 10) : 0;
    const minutes = matches[3] ? parseInt(matches[3], 10) : 0;
    const seconds = matches[4] ? parseInt(matches[4], 10) : 0;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const handleAddOrSubDurationToDate = (date, durationStr, add = true) => {
    const duration = handleParseDuration(durationStr);

    // Add duration to the given date
    const newDate = new Date(date);
    newDate.setDate(
      add
        ? newDate.getDate() + duration.days
        : newDate.getDate() - duration.days
    );
    newDate.setHours(
      add
        ? newDate.getHours() + duration.hours
        : newDate.getHours() - duration.hours
    );
    newDate.setMinutes(
      add
        ? newDate.getMinutes() + duration.minutes
        : newDate.getMinutes() - duration.minutes
    );
    newDate.setSeconds(
      add
        ? newDate.getSeconds() + duration.seconds
        : newDate.getSeconds() - duration.seconds
    );

    return newDate;
  };

  const handleAddOrSubDuration = (duration) => {
    let startDate = new Date(currentField?.data?.duration?.start);
    let endDate = new Date(currentField?.data?.duration?.end ?? startDate);
    let newEndDate = new Date(endDate);
    newEndDate = handleAddOrSubDurationToDate(
      newEndDate,
      duration,
      addOrSub === "add" ? true : false
    );
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        duration: {
          ...currentField.data.duration,
          end: newEndDate.toISOString(),
        },
      },
    });
  };

  const handleSelectChange = (e) => {
    let type = e.target.value;
    let format = formats.find((format) => format.type === type);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        duration: {
          ...currentField.data.duration,
          format: format,
        },
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
    const finalFieldId = v4();
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        duration: {
          ...currentField.data.duration,
        },
      },
    };

    let durationEndField = {
      id: v4(),
      type: "durationEnd",
      data: {
        durationId: finalFieldId,
      },
      config: finalField.config,
    };

    if (index !== null) {
      node.data[index] = finalField;
      for (let i = index + 1; i < node.data.length; i++) {
        if (node.data[i].type === "durationEnd") {
          if (node.data[i].data.durationId === finalField.id) {
            node.data[i].config = finalField.config;
            break;
          }
        }
      }
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: finalFieldId,
      });
      node.data.splice(dataIndex + 2, 0, durationEndField);
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: finalFieldId });
      node.data.push(durationEndField);
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handleDelete = async (i, deleteContainingFields = false) => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    const fieldType = node?.data[i]?.type;
    if (fieldType === "durationEnd") return;
    if (fieldType === "duration") {
      for (let j = i + 1; j < node.data.length; j++) {
        if (node?.data[j]?.type === "durationEnd") {
          if (node?.data[j]?.data?.durationId === node?.data[i]?.id) {
            if (!deleteContainingFields) {
              node.data.splice(j, 1);
              break;
            }
            node.data.splice(i + 1, j - i);
          }
        }
      }
    }
    node.data.splice(i, 1);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };
  const [formated, setFormated] = useState({
    start: handleGetFormatedDateTime(currentField?.data?.duration?.start),
    end: handleGetFormatedDateTime(currentField?.data?.duration?.end),
    duration: handleFormatDuration(
      handleCalculateDuration(
        currentField?.data?.duration?.start,
        currentField?.data?.duration?.end
      )
    ),
  });

  useEffect(() => {
    setFormated({
      start: handleGetFormatedDateTime(currentField?.data?.duration?.start),
      end: handleGetFormatedDateTime(currentField?.data?.duration?.end),
      duration: handleFormatDuration(
        handleCalculateDuration(
          currentField?.data?.duration?.start,
          currentField?.data?.duration?.end
        )
      ),
    });
  }, [
    currentField?.data?.duration?.start,
    currentField?.data?.duration?.end,
    currentField?.data?.duration?.format,
  ]);

  return (
    <form
      onSubmit={handleSave}
      className="w-full flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md gap-2"
    >
      <div
        style={{
          backgroundColor: `${currentField?.config?.color}`,
        }}
        className="flex flex-wrap justify-between items-center text-sm w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-t-md"
      >
        {currentField?.config?.showFromTo && (
          <div className="text-xs">
            <span className="w-fit">
              From: {formated.start || "Select Start DateTime"}
            </span>
            <span>{" - To: "}</span>
            <span className="w-fit">
              {formated.end || "Select End DateTime"}
            </span>
          </div>
        )}
        <div className="flex justify-center items-center">
          <span className="text-xs text-[var(--text-primary)]">
            Duration: {formated.duration || "Not Yet"}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-center items-center gap-4 flex-wrap p-2">
        <div className="w-fit h-fit relative flex justify-center items-center gap-2">
          <label className="text-sm text-[var(--text-primary)]">From:</label>
          <input
            type="datetime-local"
            className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
            value={handleGetDateTime(currentField?.data?.duration?.start)}
            max={handleGetDateTime(currentField?.data?.duration?.end)}
            onChange={(e) =>
              handleCheckInvalidDuration(
                e,
                "start",
                currentField?.data?.duration?.start,
                currentField?.data?.duration?.end
              )
            }
          />
        </div>

        <div className="w-fit h-fit relative flex justify-center items-center gap-2">
          <label className="text-sm text-[var(--text-primary)]">to:</label>
          <input
            type="datetime-local"
            className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
            value={handleGetDateTime(currentField?.data?.duration?.end)}
            min={handleGetDateTime(currentField?.data?.duration?.start)}
            onChange={(e) =>
              handleCheckInvalidDuration(
                e,
                "end",
                currentField?.data?.duration?.start,
                currentField?.data?.duration?.end
              )
            }
          />
        </div>
      </div>
      <div className="w-fit h-fit relative flex justify-center items-center gap-2 flex-wrap">
        <select
          title="Add or Subtract Duration"
          value={addOrSub}
          onChange={(e) => setAddOrSub(e.target.value)}
          className="w-13 group h-8 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center px-2 outline-none"
        >
          <option
            className="text-xs font-bold text-[var(--text-primary)] bg-[var(--btn-secondary)]"
            value="add"
          >
            +Add
          </option>
          <option
            className="text-xs font-bold text-[var(--text-primary)] bg-[var(--btn-secondary)]"
            value="subtract"
          >
            -Sub
          </option>
        </select>

        {addDurations.map((addDuration) => (
          <button
            key={`field-${currentField.type}-addduration-${addDuration.value}`}
            type="button"
            className="w-10 shrink-0 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={() => handleAddOrSubDuration(addDuration.value)}
          >
            {addDuration.type}
          </button>
        ))}
        <input
          type="text"
          className="w-20 px-2 h-8 text-xs rounded-md outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
          title="Custom Duration"
          placeholder="2h30m"
          value={customDuration}
          onChange={(e) => setCustomDuration(e.target.value)}
        />
        <button
          type="button"
          className="w-8 text-2xl shrink-0 h-8 px-1 rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          title="Add Custom Duration"
          onClick={() => {
            handleAddOrSubDuration(customDuration);
            setCustomDuration("");
          }}
        >
          {addOrSub === "add" ? "+" : "-"}
        </button>
      </div>
      <div className="w-full flex justify-center items-center gap-2 flex-wrap my-2">
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          type="button"
          onClick={() => {
            setCurrentFieldType(null);
            setCurrentField(null);
          }}
        >
          Cancel
        </button>

        <div className="w-fit h-fit flex justify-center items-center gap-2 flex-wrap">
          <select
            title="Date Format"
            className="w-40 group h-8 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
            value={currentField?.data?.duration?.format?.type}
            onChange={handleSelectChange}
          >
            {formats.map((format) => (
              <option key={format.type} value={format.type}>
                {format.type}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          title="Toggle Show From To"
          className="relative w-8 h-8 px-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                showFromTo: !currentField?.config?.showFromTo ?? false,
              },
            });
          }}
        >
          {!currentField?.config?.showFromTo && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <PreviewIcon />
          </span>
        </button>
        <div className="w-8 h-8 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center outline-none relative">
          <input
            className="w-full h-full opacity-0 bg-transparent outline-none cursor-pointer"
            type="color"
            title="Duration Color"
            value={currentField?.config?.color}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                config: {
                  ...currentField.config,
                  color: e.target.value,
                },
              });
            }}
          />
          <span className="pointer-events-none absolute  top-0 left-0 w-full h-full p-[8px]">
            <ColorIcon />
          </span>
          <span
            style={{
              backgroundColor: `${currentField?.config?.color}`,
            }}
            className="-top-1 -right-1 absolute w-3 h-3 rounded-full"
          ></span>
        </div>
        {currentField?.id && (
          <>
            <button
              type="button"
              className="w-8 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] hover:bg-[var(--btn-delete)] transition-colors duration-300 cursor-pointer"
              onClick={() => handleDelete(currentField?.index)}
              title="Delete Field"
            >
              <span className="">
                <DeleteIcon />
              </span>
            </button>
            <button
              type="button"
              className="w-8 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] hover:bg-[var(--btn-delete)] transition-colors duration-300 cursor-pointer"
              onClick={() => handleDelete(currentField?.index, true)}
              title="Delete Duration and containing Fields"
            >
              <span className="">
                <DeleteIcon />
              </span>
            </button>
          </>
        )}
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={(e) => handleSave(e, currentField?.index)}
        >
          Save
        </button>
      </div>
    </form>
  );
};
const DurationDisplay = ({ field, currentField, onDoubleClick }) => {
  const handleGetFormatedDateTime = (iso) => {
    if (iso === null) return "";
    let date = new Date(iso);
    if (!field?.data?.duration?.format?.input) return date.toLocaleString();
    const string = new Intl.DateTimeFormat(
      "en-IN",
      field?.data?.duration?.format?.input
    ).format(date);
    return string;
  };

  const handleCalculateDuration = (start, end) => {
    if (!start || !end) return null;
    // Parse the ISO date strings into Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculate the difference in milliseconds
    let diffMilliseconds = endDate - startDate;

    // Check if the difference is negative
    if (diffMilliseconds < 0) {
      // diffMilliseconds = 0;
      // Adjust the end date to be the same as the start date
      // endDate.setTime(startDate.getTime());
    }

    // Convert the difference to various units
    const diffSeconds = diffMilliseconds / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;

    // Calculate the difference in months and years
    let diffYears = endDate.getFullYear() - startDate.getFullYear();
    let diffMonths = endDate.getMonth() - startDate.getMonth();

    // Adjust years and months if necessary
    if (diffMonths < 0) {
      diffYears--;
      diffMonths += 12;
    }

    // Convert the total months to include the year part
    const totalMonths = diffYears * 12 + diffMonths;

    return {
      milliseconds: diffMilliseconds,
      seconds: diffSeconds,
      minutes: diffMinutes,
      hours: diffHours,
      days: diffDays,
      months: totalMonths,
      years: diffYears,
      start: startDate,
      end: endDate,
    };
  };

  const handleFormatDuration = (duration) => {
    if (!duration) return "";
    let years = Math.floor(duration.years);
    let months = Math.floor(duration.months);
    let days = Math.floor(duration.days);
    let hours = Math.floor(duration.hours) % 24;
    let minutes = Math.floor(duration.minutes) % 60;
    let seconds = Math.floor(duration.seconds) % 60;

    const all = [years, months, days, hours, minutes];

    let string = "";
    all.forEach((item, index) => {
      if (item > 0) {
        if (index === 0) {
          string += `${item}y `;
        } else if (index === 1) {
          string += `${item}m `;
        } else if (index === 2) {
          string += `${item}d `;
        } else if (index === 3) {
          string += `${item}h `;
        } else if (index === 4) {
          string += `${item}m `;
        } else if (index === 5) {
          string += `${item}s `;
        }
      }
    });
    return string;
  };
  const [formated, setFormated] = useState({
    start: handleGetFormatedDateTime(field?.data?.duration?.start),
    end: handleGetFormatedDateTime(field?.data?.duration?.end),
    duration: handleFormatDuration(
      handleCalculateDuration(
        field?.data?.duration?.start,
        field?.data?.duration?.end
      )
    ),
  });

  useEffect(() => {
    setFormated({
      start: handleGetFormatedDateTime(field?.data?.duration?.start),
      end: handleGetFormatedDateTime(field?.data?.duration?.end),
      duration: handleFormatDuration(
        handleCalculateDuration(
          field?.data?.duration?.start,
          field?.data?.duration?.end
        )
      ),
    });
  }, [field?.data?.duration?.start, field?.data?.duration?.end]);

  return (
    <div
      style={{
        backgroundColor: `${field?.config?.color}`,
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      onDoubleClick={onDoubleClick}
      className="flex mb-1 flex-wrap justify-between items-center text-sm w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-tr-md rounded-tl-md"
    >
      {field?.config?.showFromTo && (
        <div className="text-xs">
          {/* <div className="w-fit h-7 flex justify-center items-center gap-2 flex-wrap"> */}
          <span className="w-fit">
            From: {formated.start || "Select Start DateTime"}
          </span>
          {/* </div> */}
          <span>{" - To: "}</span>
          {/* <div className="w-fit h-7 flex justify-center items-center gap-2 flex-wrap"> */}
          <span className="w-fit">{formated.end || "Select End DateTime"}</span>
          {/* </div> */}
        </div>
      )}
      <div className="flex justify-center items-center">
        <span className="text-xs text-[var(--text-primary)]">
          Duration: {formated.duration || "Not Yet"}
        </span>
      </div>
    </div>
  );
};

const DurationEndDisplay = ({ node, field, currentField }) => {
  return (
    <div
      style={{
        backgroundColor: `${field?.config?.color}`,
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      className="flex mb-2 mt-1 flex-wrap justify-between items-center text-xs w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-br-md rounded-bl-md"
    >
      <div className="w-full flex justify-center items-center gap-2 flex-wrap">
        <span className="w-full text-center">End of Duration</span>
      </div>
    </div>
  );
};

const DurationTimeline = ({
  node,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  handleResetShowAdd,
  dataIndex,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();
  const formats = [
    {
      type: "Date Only",
      input: { day: "2-digit", month: "2-digit", year: "numeric" },
    },
    {
      type: "Time Only (12-Hour)",
      input: { hour: "2-digit", minute: "2-digit", hour12: true },
    },
    {
      type: "Time Only (24-Hour)",
      input: { hour: "2-digit", minute: "2-digit", hour12: false },
    },

    {
      type: "Date and Time (12-Hour)",
      input: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Date and Time (24-Hour)",
      input: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
    {
      type: "Weekday and Time (12-Hour)",
      input: {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Weekday and Time (24-Hour)",
      input: {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
    {
      type: "Month and Year",
      input: { year: "numeric", month: "long" },
    },
    {
      type: "Day of the Week, Month, Day, and Year",
      input: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    },
    {
      type: "Day of the Week, Date, and Time (12-Hour)",
      input: {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Day of the Week, Date, and Time (24-Hour)",
      input: {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
  ];
  const displayFormats = [
    {
      type: "week",
      des: "Week",
    },
    {
      type: "month",
      des: "Month",
    },
    {
      type: "year",
      des: "Year",
    },
  ];
  const list = [
    {
      type: "doc",
      des: "Current Document Progress",
    },
    {
      type: "docChild",
      des: "Current and All Child Document Progress",
    },
    {
      type: "docAll",
      des: "All Document Progress",
    },
    // {
    //   type: "custom",
    //   des: "Select Custom Progress",
    // },
  ];

  const handleGetFormatedDateTime = (iso) => {
    if (iso === null) return "";
    let date = new Date(iso);
    if (!currentField?.data?.durationTimeline?.format?.input)
      return date.toLocaleString();
    const string = new Intl.DateTimeFormat(
      "en-IN",
      currentField?.data?.durationTimeline?.format?.input
    ).format(date);
    return string;
  };
  const handleGetDateTime = (iso) => {
    let utcDate;
    if (iso === null) {
      utcDate = new Date();
    } else {
      utcDate = new Date(iso);
    }
    let finalIso = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${utcDate
      .getDate()
      .toString()
      .padStart(2, "0")}T${utcDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${utcDate.getMinutes().toString().padStart(2, "0")}`;
    return finalIso;
  };

  const handleSetDateTime = (e) => {
    let time = e.target.value;
    let newDate = new Date(time);
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        current: newDate.toISOString(),
      },
    });
  };
  const handleGetDurations = (node, stop = false) => {
    let durations = [];
    node?.data?.forEach((field, index) => {
      if (!field) return;
      if (field?.type === "duration") {
        let duration = field?.data?.duration;
        if (!duration) return;
        if (!duration?.end) return;
        if (duration?.end === null) return;
        durations.push({
          id: field.id,
          index: index,
          start: new Date(duration.start),
          end: new Date(duration.end),
        });
      }
    });

    if (stop) return durations;
    if (node?.children?.length > 0) {
      node.children.forEach((child) => {
        durations = [...durations, ...handleGetDurations(child)];
      });
    }

    return durations;
  };

  const handleCalculateDuration = (type, overlap = false) => {
    if (!type) return null;
    // Parse the ISO date strings into Date objects
    console.log(type);
    let start = null;
    let end = null;
    let duration = 0;
    let durations = [];

    switch (type) {
      case "doc":
        durations = handleGetDurations(node, true);
        break;
      case "docChild":
        durations = handleGetDurations(node);
        break;
      case "docAll":
        durations = handleGetDurations(currentFlowPlan.root);
        break;
      default:
        break;
    }
    if (durations.length === 0) return null;

    durations.sort((a, b) => a.start - b.start);
    start = durations[0]?.start;
    end = durations[durations.length - 1]?.end;

    durations.forEach((duration) => {
      if (duration.start < start) {
        start = duration.start;
      }
      if (duration.end > end) {
        end = duration.end;
      }
    });
    if (!overlap) {
      durations.forEach((d) => {
        duration += d.end - d.start;
      });
    } else {
      let mergedIntervals = [];
      let currentInterval = durations[0];
      for (let i = 1; i < durations.length; i++) {
        let currentStart = currentInterval.start;
        let currentEnd = currentInterval.end;
        let nextStart = durations[i].start;
        let nextEnd = durations[i].end;

        // Check if intervals overlap
        if (nextStart <= currentEnd) {
          // Merge intervals
          currentInterval.end = new Date(Math.max(currentEnd, nextEnd));
        } else {
          // Push the current interval and move to the next
          mergedIntervals.push(currentInterval);
          currentInterval = durations[i];
        }
      }
      mergedIntervals.push(currentInterval);
      mergedIntervals.forEach((d) => {
        duration += d.end - d.start;
        console.log(duration / 1000 / 60);
      });
      durations = mergedIntervals;
    }

    // Calculate the difference in milliseconds
    let diffMilliseconds = duration;

    // Convert the difference to various units
    const diffSeconds = diffMilliseconds / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;
    console.log(diffHours);
    return {
      milliseconds: diffMilliseconds,
      seconds: diffSeconds,
      minutes: diffMinutes,
      hours: diffHours,
      days: diffDays,
      start: start,
      end: end,
      durations: durations,
    };
  };

  const handleFormatDuration = (duration) => {
    if (!duration) return "";
    let days = Math.floor(duration.days);
    let hours = Math.floor(duration.hours) % 24;
    let minutes = Math.floor(duration.minutes) % 60;
    let seconds = Math.floor(duration.seconds) % 60;

    const all = [days, hours, minutes];

    let string = "";
    all.forEach((item, index) => {
      if (item > 0) {
        if (index === 0) {
          string += `${item}d `;
        } else if (index === 1) {
          string += `${item}h `;
        } else if (index === 2) {
          string += `${item}m `;
        } else if (index === 3) {
          string += `${item}s `;
        }
      }
    });
    return string;
  };
  const handleSetFormated = () => {
    let duration = handleCalculateDuration(
      currentField?.data?.durationTimeline?.type,
      currentField?.config?.overlap
    );
    if (!duration) return;
    console.log(handleFormatDuration(duration));
    setFormated((prev) => ({
      ...prev,
      start: handleGetFormatedDateTime(duration.start.toISOString()),
      end: handleGetFormatedDateTime(duration.end.toISOString()),
      startISO: duration.start.toISOString(),
      endISO: duration.end.toISOString(),
      duration: handleFormatDuration(duration),
      durations: duration.durations,
    }));
  };

  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return [startOfWeek, endOfWeek];
  };

  const getMonthRange = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return [startOfMonth, endOfMonth];
  };

  const getYearRange = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    return [startOfYear, endOfYear];
  };

  const splitEventByDay = (event) => {
    const segments = [];
    let currentStart = new Date(event.start);
    const end = new Date(event.end);

    while (currentStart < end) {
      const currentEnd = new Date(currentStart);
      currentEnd.setHours(23, 59, 59, 999); // End of the current day
      if (currentEnd > end) currentEnd.setTime(end.getTime());

      segments.push({
        id: event.id,
        index: event.index,
        start: new Date(currentStart),
        end: new Date(currentEnd),
      });

      currentStart = new Date(currentEnd);
      currentStart.setHours(24, 0, 0, 0); // Start of the next day
    }

    return segments;
  };

  const calculateDurations = (events, rangeStart, rangeEnd, unit) => {
    const dayDurations = {};

    events.forEach((event) => {
      const segments = splitEventByDay(event);

      segments.forEach((segment) => {
        const start = new Date(segment.start);
        const end = new Date(segment.end);

        if (start >= rangeStart && start <= rangeEnd) {
          const dayKey = start.toISOString().split("T")[0]; // Format as YYYY-MM-DD
          if (!dayDurations[dayKey]) {
            dayDurations[dayKey] = 0;
          }
          dayDurations[dayKey] += end - start; // Duration in milliseconds
        }
      });
    });

    const durations = [];

    if (unit === "week") {
      for (let i = 0; i < 7; i++) {
        const day = new Date(rangeStart);
        day.setDate(day.getDate() + i);
        const dayKey = day.toISOString().split("T")[0];
        const dayName = day.toLocaleDateString("en-US", { weekday: "long" });
        durations.push({
          label: dayName,
          duration: dayDurations[dayKey] || 0,
        });
      }
    } else if (unit === "month") {
      const weeks = {};
      const current = new Date(rangeStart);
      while (current <= rangeEnd) {
        const weekKey = `${current.getFullYear()}-W${Math.ceil(
          (current.getDate() + 6 - current.getDay()) / 7
        )}`;
        if (!weeks[weekKey]) {
          weeks[weekKey] = 0;
        }
        const dayKey = current.toISOString().split("T")[0];
        weeks[weekKey] += dayDurations[dayKey] || 0;
        current.setDate(current.getDate() + 1);
      }
      Object.entries(weeks).forEach(([weekKey, duration]) => {
        durations.push({
          label: "w-" + weekKey.split("-W")[1],
          duration,
        });
      });
    } else if (unit === "year") {
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(rangeStart.getFullYear(), i, 1);
        const monthEnd = new Date(rangeStart.getFullYear(), i + 1, 0);
        let monthDuration = 0;
        for (
          let day = new Date(monthStart);
          day <= monthEnd;
          day.setDate(day.getDate() + 1)
        ) {
          const dayKey = day.toISOString().split("T")[0];
          monthDuration += dayDurations[dayKey] || 0;
        }
        const monthName = monthStart.toLocaleDateString("en-US", {
          month: "long",
        });
        durations.push({
          label: monthName,
          duration: monthDuration,
        });
      }
      let jan = durations[durations.length - 1];
      durations.unshift(jan);
      durations.pop();
    }

    return durations.map((item) => ({
      ...item,
      milliseconds: item.duration,
      seconds: item.duration / 1000,
      minutes: item.duration / 60000,
      hours: item.duration / 3600000,
    }));
  };
  const getWeeklyDuration = (events, selectedDate) => {
    const [weekStart, weekEnd] = getWeekRange(selectedDate);
    return calculateDurations(events, weekStart, weekEnd, "week");
  };

  const getMonthlyDuration = (events, selectedDate) => {
    const [monthStart, monthEnd] = getMonthRange(selectedDate);
    return calculateDurations(events, monthStart, monthEnd, "month");
  };

  const getYearlyDuration = (events, selectedDate) => {
    const [yearStart, yearEnd] = getYearRange(selectedDate);
    return calculateDurations(events, yearStart, yearEnd, "year");
  };

  const handleCalculateRange = (type, selectedDate) => {
    if (formated.durations.length === 0) return;
    if (!formated.start) return;
    selectedDate = new Date(selectedDate || formated.startISO);
    console.log(selectedDate);
    let durations = [];
    switch (type) {
      case "week":
        durations = getWeeklyDuration(formated.durations, selectedDate);
        break;
      case "month":
        durations = getMonthlyDuration(formated.durations, selectedDate);
        break;
      case "year":
        durations = getYearlyDuration(formated.durations, selectedDate);
        break;
      default:
        break;
    }
    setFormated((prev) => ({
      ...prev,
      displayType: type,
      displayDuration: durations,
    }));
  };

  const getNextWeek = (date) => {
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  };

  const getPreviousWeek = (date) => {
    const previousWeek = new Date(date);
    previousWeek.setDate(previousWeek.getDate() - 7);
    return previousWeek;
  };

  const getNextMonth = (date) => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const getPreviousMonth = (date) => {
    const previousMonth = new Date(date);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    return previousMonth;
  };

  const getNextYear = (date) => {
    const nextYear = new Date(date);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear;
  };

  const getPreviousYear = (date) => {
    const previousYear = new Date(date);
    previousYear.setFullYear(previousYear.getFullYear() - 1);
    return previousYear;
  };

  const handleGetDateNavigationFunction = (iso, durationType, direction) => {
    const navigationFunctions = {
      week: {
        next: getNextWeek,
        prev: getPreviousWeek,
      },
      month: {
        next: getNextMonth,
        prev: getPreviousMonth,
      },
      year: {
        next: getNextYear,
        prev: getPreviousYear,
      },
    };

    let newDate = navigationFunctions[durationType]?.[direction](iso);
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        current: newDate.toISOString(),
      },
    });
  };

  const handleSelectChange = (e) => {
    let type = e.target.value;
    let format = formats.find((format) => format.type === type);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        durationTimeline: {
          ...currentField.data.durationTimeline,
          format: format,
        },
      },
    });
  };
  const handleSelectDisplayFormatChange = (e) => {
    let type = e.target.value;
    let displayFormat = displayFormats.find(
      (displayFormat) => displayFormat.type === type
    );
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        durationTimeline: {
          ...currentField.data.durationTimeline,
          displayFormat: displayFormat,
        },
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
    const finalFieldId = v4();
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        durationTimeline: {
          ...currentField.data.durationTimeline,
        },
      },
      config: {
        ...currentField.config,
        current: currentField.config.current || new Date().toISOString(),
      }
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: finalFieldId,
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: finalFieldId });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handleDelete = async (i) => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    node.data.splice(i, 1);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

  const [formated, setFormated] = useState({
    start: null,
    end: null,
    startISO: null,
    endISO: null,
    duration: null,
    durations: [],
    displayType: null,
    displayDuration: [],
  });

  useEffect(() => {
    handleSetFormated();
    handleCalculateRange(
      currentField?.data?.durationTimeline?.displayFormat?.type,
      currentField?.config?.current
    );
  }, [
    currentField?.data?.durationTimeline?.type,
    currentField?.config?.overlap,
    currentField?.config?.current,
    currentField?.data?.durationTimeline?.displayFormat?.type,
    currentField?.data?.durationTimeline?.format,
  ]);

  useEffect(() => {
    handleCalculateRange(
      currentField?.data?.durationTimeline?.displayFormat?.type,
      currentField?.config?.current
    );
  }, [formated.durations]);

  return (
    <form
      onSubmit={handleSave}
      className="w-full flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md gap-2"
    >
      <div className="w-full flex flex-col justify-start items-center">
        <div
          style={{
            backgroundColor: `${currentField?.config?.color}`,
          }}
          className="flex flex-wrap justify-between items-center text-sm w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-t-md"
        >
          {currentField?.config?.showFromTo && (
            <div className="text-xs">
              <span className="w-fit">
                From: {formated.start || "Select Start DateTime"}
              </span>
              <span>{" - To: "}</span>
              <span className="w-fit">
                {formated.end || "Select End DateTime"}
              </span>
            </div>
          )}
          <div className="flex justify-center items-center">
            <span className="text-xs text-[var(--text-primary)]">
              Duration: {formated.duration || "Not Yet"}
            </span>
          </div>
        </div>
        {currentField?.config?.showGraph && (
          <div
            style={{
              backgroundColor: `${currentField?.config?.color}`,
            }}
            className="w-full flex flex-wrap justify-between items-center text-s px-2 pb-2 bg-[var(--btn-secondary)] rounded-b-md"
          >
            {formated.displayDuration.length > 0 && (
              <DisplayDurationGraph
                durations={formated.displayDuration}
                type={currentField?.data?.durationTimeline?.displayFormat?.type}
                color={currentField?.config?.color}
              />
            )}
          </div>
        )}
      </div>
      {currentField?.config?.showGraph && (
        <div className="w-full flex flex-col justify-center items-center gap-2 flex-wrap p-2">
          <span>
            Select A {currentField?.data?.durationTimeline?.displayFormat?.des}:
          </span>
          <div className="w-full flex justify-center items-center gap-2 flex-wrap">
            <button
              className=" relative w-8 h-8 p-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
              type="button"
              onClick={() =>
                handleGetDateNavigationFunction(
                  currentField?.config?.current ?? formated?.startISO,
                  currentField?.data?.durationTimeline?.displayFormat?.type,
                  "prev"
                )
              }
            >
              <span className="rotate-180 flex justify-center items-center text-lg font-bold">
                <BackIcon />
              </span>
            </button>
            <input
              type="datetime-local"
              className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
              value={handleGetDateTime(
                currentField?.config?.current ?? formated?.startISO
              )}
              onChange={handleSetDateTime}
            />
            <button
              className=" relative w-8 h-8 p-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
              type="button"
              onClick={() =>
                handleGetDateNavigationFunction(
                  currentField?.config?.current ?? formated?.startISO,
                  currentField?.data?.durationTimeline?.displayFormat?.type,
                  "next"
                )
              }
            >
              <span className="flex justify-center items-center text-lg font-bold">
                <BackIcon />
              </span>
            </button>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center items-center gap-2 flex-wrap">
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          type="button"
          onClick={() => {
            setCurrentFieldType(null);
            setCurrentField(null);
          }}
        >
          Cancel
        </button>
        <div className="w-fit h-fit flex justify-center items-center gap-2 flex-wrap">
          <select
            title="Date Format"
            className="w-40 group h-8 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
            value={currentField?.data?.durationTimeline?.format?.type}
            onChange={handleSelectChange}
          >
            {formats.map((format) => (
              <option key={format.type} value={format.type}>
                {format.type}
              </option>
            ))}
          </select>
          <select
            title="Type of Duration Timeline"
            className="w-[150px] group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
            value={currentField?.data?.durationTimeline?.type}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                data: {
                  ...currentField.data,
                  durationTimeline: {
                    ...currentField.data.durationTimeline,
                    type: e.target.value,
                  },
                },
              });
            }}
          >
            {list.map((item) => (
              <option key={item.type} value={item.type}>
                {item.des}
              </option>
            ))}
          </select>
          <select
            title="Type of Display Format"
            className="w-[60px] group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
            value={currentField?.data?.durationTimeline?.displayFormat?.type}
            onChange={handleSelectDisplayFormatChange}
          >
            {displayFormats.map((item) => (
              <option key={item.type} value={item.type}>
                {item.des}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          title="Toggle Show From To"
          className="relative w-8 h-8 px-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                showFromTo: !currentField?.config?.showFromTo ?? false,
              },
            });
          }}
        >
          {!currentField?.config?.showFromTo && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <PreviewIcon />
          </span>
        </button>
        <button
          type="button"
          title="Toggle Show Graph"
          className="relative w-8 h-8 px-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                showGraph: !currentField?.config?.showGraph ?? false,
              },
            });
          }}
        >
          {!currentField?.config?.showGraph && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <GraphIcon />
          </span>
        </button>
        <button
          type="button"
          title="Toggle Overlap Duration"
          className="relative w-8 h-8 px-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                overlap: !currentField?.config?.overlap ?? false,
              },
            });
          }}
        >
          {!currentField?.config?.overlap && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <OverlapIcon />
          </span>
        </button>
        <div className="w-8 h-8 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center outline-none relative">
          <input
            className="w-full h-full opacity-0 bg-transparent outline-none cursor-pointer"
            type="color"
            title="Duration Color"
            value={currentField?.config?.color}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                config: {
                  ...currentField.config,
                  color: e.target.value,
                },
              });
            }}
          />
          <span className="pointer-events-none absolute  top-0 left-0 w-full h-full p-[8px]">
            <ColorIcon />
          </span>
          <span
            style={{
              backgroundColor: `${currentField?.config?.color}`,
            }}
            className="-top-1 -right-1 absolute w-3 h-3 rounded-full"
          ></span>
        </div>
        {currentField?.id && (
          <button
            type="button"
            className="w-8 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] hover:bg-[var(--btn-delete)] transition-colors duration-300 cursor-pointer"
            onClick={() => handleDelete(currentField?.index)}
            title="Delete Field"
          >
            <span className="">
              <DeleteIcon />
            </span>
          </button>
        )}
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={(e) => handleSave(e, currentField?.index)}
        >
          Save
        </button>
      </div>
    </form>
  );
};

const DurationTimelineDisplay = ({
  i,
  node,
  field,
  currentField,
  onDoubleClick,
  currentFlowPlan,
}) => {
  const [formated, setFormated] = useState({
    start: null,
    end: null,
    current: null,
    currentISO: null,
    startISO: null,
    endISO: null,
    duration: null,
    durations: [],
    displayType: null,
    displayDuration: [],
  });

  const handleGetDurations = (node, stop = false) => {
    let durations = [];
    node?.data?.forEach((field, index) => {
      if (!field) return;
      if (field?.type === "duration") {
        let duration = field?.data?.duration;
        if (!duration) return;
        if (!duration?.end) return;
        if (duration?.end === null) return;
        durations.push({
          id: field.id,
          index: index,
          start: new Date(duration.start),
          end: new Date(duration.end),
        });
      }
    });

    if (stop) return durations;
    if (node?.children?.length > 0) {
      node.children.forEach((child) => {
        durations = [...durations, ...handleGetDurations(child)];
      });
    }

    return durations;
  };
  const handleCalculateDuration = (type, overlap = false) => {
    if (!type) return null;
    // Parse the ISO date strings into Date objects
    let start = null;
    let end = null;
    let duration = 0;
    let durations = [];

    switch (type) {
      case "doc":
        durations = handleGetDurations(node, true);
        break;
      case "docChild":
        durations = handleGetDurations(node);
        break;
      case "docAll":
        durations = handleGetDurations(currentFlowPlan.root);
        break;
      default:
        break;
    }
    console.log(type, durations);
    if (durations.length === 0) return null;

    durations.sort((a, b) => a.start - b.start);
    start = durations[0]?.start;
    end = durations[durations.length - 1]?.end;

    durations.forEach((duration) => {
      if (duration.start < start) {
        start = duration.start;
      }
      if (duration.end > end) {
        end = duration.end;
      }
    });
    console.log(overlap);
    if (!overlap) {
      durations.forEach((d) => {
        duration += d.end - d.start;
      });
    } else {
      let mergedIntervals = [];
      let currentInterval = durations[0];
      for (let i = 1; i < durations.length; i++) {
        let currentStart = currentInterval.start;
        let currentEnd = currentInterval.end;
        let nextStart = durations[i].start;
        let nextEnd = durations[i].end;

        // Check if intervals overlap
        if (nextStart <= currentEnd) {
          // Merge intervals
          currentInterval.end = new Date(Math.max(currentEnd, nextEnd));
        } else {
          // Push the current interval and move to the next
          mergedIntervals.push(currentInterval);
          currentInterval = durations[i];
        }
      }
      mergedIntervals.push(currentInterval);
      mergedIntervals.forEach((d) => {
        duration += d.end - d.start;
        console.log(duration / 1000 / 60);
      });
      durations = mergedIntervals;
    }

    // Calculate the difference in milliseconds
    let diffMilliseconds = duration;

    // Convert the difference to various units
    const diffSeconds = diffMilliseconds / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;
    console.log(diffHours);
    return {
      milliseconds: diffMilliseconds,
      seconds: diffSeconds,
      minutes: diffMinutes,
      hours: diffHours,
      days: diffDays,
      start: start,
      end: end,
      durations: durations,
    };
  };

  const handleFormatDuration = (duration) => {
    if (!duration) return "";
    let days = Math.floor(duration.days);
    let hours = Math.floor(duration.hours) % 24;
    let minutes = Math.floor(duration.minutes) % 60;
    let seconds = Math.floor(duration.seconds) % 60;

    const all = [days, hours, minutes];

    let string = "";
    all.forEach((item, index) => {
      if (item > 0) {
        if (index === 0) {
          string += `${item}d `;
        } else if (index === 1) {
          string += `${item}h `;
        } else if (index === 2) {
          string += `${item}m `;
        } else if (index === 3) {
          string += `${item}s `;
        }
      }
    });
    return string;
  };

  const handleGetFormatedDateTime = (iso) => {
    if (!iso) return "";
    if (iso === null) return "";
    let date = new Date(iso);
    console.log(iso, field?.data?.durationTimeline?.format?.input);
    if (!field?.data?.durationTimeline?.format?.input)
      return date.toLocaleString();
    const string = new Intl.DateTimeFormat(
      "en-IN",
      field?.data?.durationTimeline?.format?.input
    ).format(date);
    return string;
  };

  const handleSetFormated = () => {
    let duration = handleCalculateDuration(
      field?.data?.durationTimeline?.type,
      field?.config?.overlap
    );
    if (!duration) return;
    setFormated((prev) => ({
      ...prev,
      start: handleGetFormatedDateTime(duration.start.toISOString()),
      end: handleGetFormatedDateTime(duration.end.toISOString()),
      currentISO:
        field?.config?.current ??
        duration.start.toISOString() ??
        new Date().toISOString(),
      current:
        handleGetCurrent(
          field?.config?.current ??
            duration.start.toISOString() ??
            new Date().toISOString(),
          field?.data?.durationTimeline?.displayFormat?.type
        ) +
        handleGetFormatedDateTime(
          field?.config?.current ??
            duration.start.toISOString() ??
            new Date().toISOString()
        ),
      startISO: duration.start.toISOString(),
      endISO: duration.end.toISOString(),
      duration: handleFormatDuration(duration),
      durations: duration.durations,
    }));
  };

  const splitEventByDay = (event) => {
    const segments = [];
    let currentStart = new Date(event.start);
    const end = new Date(event.end);

    while (currentStart < end) {
      const currentEnd = new Date(currentStart);
      currentEnd.setHours(23, 59, 59, 999); // End of the current day
      if (currentEnd > end) currentEnd.setTime(end.getTime());

      segments.push({
        id: event.id,
        index: event.index,
        start: new Date(currentStart),
        end: new Date(currentEnd),
      });

      currentStart = new Date(currentEnd);
      currentStart.setHours(24, 0, 0, 0); // Start of the next day
    }

    return segments;
  };
  const calculateDurations = (events, rangeStart, rangeEnd, unit) => {
    const dayDurations = {};

    events.forEach((event) => {
      const segments = splitEventByDay(event);

      segments.forEach((segment) => {
        const start = new Date(segment.start);
        const end = new Date(segment.end);

        if (start >= rangeStart && start <= rangeEnd) {
          const dayKey = start.toISOString().split("T")[0]; // Format as YYYY-MM-DD
          if (!dayDurations[dayKey]) {
            dayDurations[dayKey] = 0;
          }
          dayDurations[dayKey] += end - start; // Duration in milliseconds
        }
      });
    });

    const durations = [];

    if (unit === "week") {
      for (let i = 0; i < 7; i++) {
        const day = new Date(rangeStart);
        day.setDate(day.getDate() + i);
        const dayKey = day.toISOString().split("T")[0];
        const dayName = day.toLocaleDateString("en-US", { weekday: "long" });
        durations.push({
          label: dayName,
          duration: dayDurations[dayKey] || 0,
        });
      }
    } else if (unit === "month") {
      const weeks = {};
      const current = new Date(rangeStart);
      while (current <= rangeEnd) {
        const weekKey = `${current.getFullYear()}-W${Math.ceil(
          (current.getDate() + 6 - current.getDay()) / 7
        )}`;
        if (!weeks[weekKey]) {
          weeks[weekKey] = 0;
        }
        const dayKey = current.toISOString().split("T")[0];
        weeks[weekKey] += dayDurations[dayKey] || 0;
        current.setDate(current.getDate() + 1);
      }
      Object.entries(weeks).forEach(([weekKey, duration]) => {
        durations.push({
          label: "w-" + weekKey.split("-W")[1],
          duration,
        });
      });
    } else if (unit === "year") {
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(rangeStart.getFullYear(), i, 1);
        const monthEnd = new Date(rangeStart.getFullYear(), i + 1, 0);
        let monthDuration = 0;
        for (
          let day = new Date(monthStart);
          day <= monthEnd;
          day.setDate(day.getDate() + 1)
        ) {
          const dayKey = day.toISOString().split("T")[0];
          monthDuration += dayDurations[dayKey] || 0;
        }
        const monthName = monthStart.toLocaleDateString("en-US", {
          month: "long",
        });
        durations.push({
          label: monthName,
          duration: monthDuration,
        });
      }
      let jan = durations[durations.length - 1];
      durations.unshift(jan);
      durations.pop();
    }

    return durations.map((item) => ({
      ...item,
      milliseconds: item.duration,
      seconds: item.duration / 1000,
      minutes: item.duration / 60000,
      hours: item.duration / 3600000,
    }));
  };
  const getWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return [startOfWeek, endOfWeek];
  };

  const getMonthRange = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return [startOfMonth, endOfMonth];
  };

  const getYearRange = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    return [startOfYear, endOfYear];
  };
  const getWeeklyDuration = (events, selectedDate) => {
    const [weekStart, weekEnd] = getWeekRange(selectedDate);
    return calculateDurations(events, weekStart, weekEnd, "week");
  };

  const getMonthlyDuration = (events, selectedDate) => {
    const [monthStart, monthEnd] = getMonthRange(selectedDate);
    return calculateDurations(events, monthStart, monthEnd, "month");
  };

  const getYearlyDuration = (events, selectedDate) => {
    const [yearStart, yearEnd] = getYearRange(selectedDate);
    return calculateDurations(events, yearStart, yearEnd, "year");
  };
  const getWeekNumber = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const dayOfWeek = firstDayOfMonth.getDay();

    // Calculate the week number in the month
    return "Week " + Math.ceil((dayOfMonth + dayOfWeek) / 7) + " - ";
  };

  // Function to get the month from a date
  const getMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "long" }) + " - ";
  };

  // Function to get the year from a date
  const getYear = (date) => {
    return date.getFullYear() + " - ";
  };

  const handleGetCurrent = (iso, type) => {
    let date;
    if (iso === null) {
      date = new Date();
    }
    date = new Date(iso);
    console.log(iso, type);
    switch (type) {
      case "week":
        return getWeekNumber(date);
      case "month":
        return getMonth(date);
      case "year":
        return getYear(date);
      default:
        return "";
    }
  };

  const handleCalculateRange = (type, selectedDate) => {
    if (formated.durations.length === 0) return;
    if (!formated.start) return;
    if (!selectedDate) {
      if (formated.startISO) {
        selectedDate = new Date(formated.startISO);
      } else {
        selectedDate = new Date();
      }
    }
    let durations = [];
    switch (type) {
      case "week":
        durations = getWeeklyDuration(formated.durations, selectedDate);
        break;
      case "month":
        durations = getMonthlyDuration(formated.durations, selectedDate);
        break;
      case "year":
        durations = getYearlyDuration(formated.durations, selectedDate);
        break;
      default:
        break;
    }
    setFormated((prev) => ({
      ...prev,
      displayType: type,
      displayDuration: durations,
    }));
  };

  useEffect(() => {
    handleSetFormated();
    handleCalculateRange(
      field?.data?.durationTimeline?.displayFormat?.type,
      field?.config?.current
    );
  }, [
    field?.data?.durationTimeline?.type,
    field?.config?.overlap,
    field?.config?.current,
    field?.data?.durationTimeline?.displayFormat?.type,
  ]);

  useEffect(() => {
    handleCalculateRange(
      field?.data?.durationTimeline?.displayFormat?.type,
      field?.config?.current
    );
    console.log(formated, field?.config);
  }, [formated.durations]);
  return (
    <div
      style={{
        backgroundColor: `${field?.config?.color}`,
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      onDoubleClick={onDoubleClick}
      className="w-full flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md gap-2"
    >
      <div className="w-full flex flex-col justify-start items-center">
        <div
          style={{
            backgroundColor: `${field?.config?.color}`,
          }}
          className="flex flex-wrap justify-between items-center text-sm w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-t-md"
        >
          {field?.config?.showFromTo && (
            <div className="text-xs">
              <span className="w-fit">
                From: {formated.start || "Select Start DateTime"}
              </span>
              <span>{" - To: "}</span>
              <span className="w-fit">
                {formated.end || "Select End DateTime"}
              </span>
            </div>
          )}
          <div className="flex justify-center items-center">
            <span className="text-xs text-[var(--text-primary)]">
              Duration: {formated.duration || "Not Yet"}
            </span>
          </div>
        </div>
        {field?.config?.showGraph && (
          <div
            style={{
              backgroundColor: `${field?.config?.color}`,
            }}
            className="w-full flex flex-wrap justify-between items-center text-s px-2 bg-[var(--btn-secondary)] rounded-b-md"
          >
            {formated.displayDuration.length > 0 && (
              <DisplayDurationGraph
                durations={formated.displayDuration}
                type={field?.data?.durationTimeline?.displayFormat?.type}
                color={field?.config?.color}
              />
            )}
            <span className="w-full text-center text-[10px]">
              {formated.current}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const DisplayDurationGraph = ({ durations, type, color}) => {
  const hours = {
    week: [24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0],
    month: [168, 153, 137, 122, 107, 92, 76, 61, 46, 31, 15, 0],
    year: [744, 672, 620, 558, 496, 434, 372, 310, 248, 186, 124, 62, 0],
  };

  useEffect(() => {
    console.log(durations);
  }, []);
  return (
    <div className="w-full h-[300px] bg-[var(--bg-secondary)] rounded-md flex justify-center items-center">
      <div className="w-[20px] h-full flex justify-between py-2 items-end">
        <div className="h-full flex flex-col justify-end items-center gap-2">
          <div className="h-full flex flex-col justify-between">
            {hours[type].map((hour, index) => {
              return (
                <div
                  key={"duration-graph-hours-" + index}
                  className="w-[30px] h-full flex flex-col justify-end items-center"
                >
                  <span className="w-full h-fit text-[10px] text-center text-[var(--text-primary)]">
                    {hour}
                  </span>
                </div>
              );
            })}
          </div>
          <span className="text-xs text-[var(--text-primary)]">H</span>
        </div>
      </div>
      <div className="w-full h-full flex justify-between items-end p-2 gap-1">
        {durations.map((duration, index) => (
          <div
            key={"duration-graph-data" + index}
            className="w-full h-full flex flex-col justify-end items-center"
          >
            <div className="w-full h-full flex flex-col justify-end items-center gap-2">
              {duration.duration !== 0 && (
                <div
                  className="w-full h-0 transition-all rounded-md text-center items-center relative"
                  style={{
                    height: `${
                      (duration.duration /
                        1000 /
                        60 /
                        60 /
                        (type === "week" ? 24 : type === "month" ? 168 : 744)) *
                      100
                    }%`,
                    backgroundColor: color,
                  }}
                >
                  <span className="w-full h-fit text-[10px] text-center text-[var(--text-primary)] #rotate-45 absolute top-0.5 left-0">
                    {duration.duration / 1000 / 60 / 60 > 1
                      ? `${Math.floor(
                          duration.duration / 1000 / 60 / 60
                        )}h${Math.round(
                          (duration.duration / 1000 / 60 / 60 -
                            Math.floor(duration.duration / 1000 / 60 / 60)) *
                            60
                        )}m`
                      : `${Math.round(duration.duration / 1000 / 60)}m`}
                  </span>
                </div>
              )}
              <span className="text-xs text-[var(--text-primary)]">
                {duration?.label?.slice(0, 3)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Progress = ({
  setShowAdd,
  node,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  handleResetShowAdd,
  dataIndex,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();

  const [progress, setProgress] = useState(currentField?.data?.progress ?? 0);
  const [pin, setPin] = useState(currentField?.config?.pin);
  const [tasklists, setTasklists] = useState([]);
  const list = [
    {
      type: "doc",
      des: "Current Document Progress",
    },
    {
      type: "docChild",
      des: "Current and All Child Document Progress",
    },
    {
      type: "docAll",
      des: "All Document Progress",
    },
    {
      type: "custom",
      des: "Select Custom Progress",
    },
  ];

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleProcessTasklists = () => {
    let selected = [];
    tasklists.forEach((tasklist) => {
      selected.push({
        id: tasklist.id,
        title: tasklist.title,
        selected: tasklist.selected,
        minimized: tasklist.minimized,
        location: tasklist.location,
        tasks: tasklist.tasks.map((task) => ({
          id: task.id,
          selected: task.selected,
          minimized: task.minimized ? true : false,
        })),
      });
    });
    return selected;
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();

    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        progress: {
          ...currentField.data.progress,
          progress: progress,
          selected: handleProcessTasklists(),
        },
      },
      config: {
        ...currentField.config,
        pin: pin,
      },
      id: v4(),
    };

    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });

    if (pin) {
      node.data = node.data.map((item) => {
        if (item.type === "progress") {
          item.config.pin = false;
        }
        return item;
      });
    }

    if (index !== null) {
      node.data[index] = finalField;
      node.pin = {
        show: pin,
        index: index,
        id: finalField.id,
      };
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, finalField);
      node.pin = {
        show: pin,
        index: dataIndex + 1,
        id: finalField.id,
      };
      handleResetShowAdd();
    } else {
      node.data.push(finalField);
      node.pin = {
        show: pin,
        index: node.data.length - 1,
        id: finalField.id,
      };
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handleCalculateProgressCurrentDoc = () => {
    let total = 0;
    let completed = 0;
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          total++;
          if (task.completed) {
            completed++;
          }
        });
      }
    });
    console.log(total, completed);
    return total === 0 ? 100 : (completed / total) * 100;
  };

  const handleCalculateProgress = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          info.total++;
          if (task.completed) {
            info.completed++;
          }
        });
      }
    });
    if (node.children.length > 0) {
      node.children.forEach((item) => {
        const childInfo = handleCalculateProgress(item);
        info.total += childInfo.total;
        info.completed += childInfo.completed;
      });
    }
    return info;
  };

  const handleCalculateProgressCurrentDocAndChild = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    info = handleCalculateProgress(node);
    return info.total === 0 ? 100 : (info.completed / info.total) * 100;
  };

  const handleGetTaskLists = (node, location) => {
    let tasklists = [];
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        if (tasklists.length === 0) {
          tasklists.push({
            title: node.title,
            id: node.id,
            location: location,
            selected: false,
            minimized: false,
            tasks: [
              {
                ...item,
                id: item.id,
                selected: false,
                minimized: false,
              },
            ],
          });
        } else {
          tasklists[0].tasks.push({
            ...item,
            id: item.id,
            selected: false,
            minimized: false,
          });
        }
      }
    });
    if (node.children.length > 0) {
      node.children.forEach((item, i) => {
        tasklists = tasklists.concat(
          handleGetTaskLists(item, location.concat([i]))
        );
      });
    }
    return tasklists;
  };

  const handleCalculateProgressCustom = (lists) => {
    let total = 0;
    let completed = 0;
    lists.forEach((tasklist) => {
      tasklist.tasks.forEach((task) => {
        if (!task.selected) return;
        task.data.list.forEach((item) => {
          total++;
          if (item.completed) {
            completed++;
          }
        });
      });
    });
    return total === 0 ? 100 : (completed / total) * 100;
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

  const handleWhatToCalculate = (type) => {
    switch (type) {
      case "doc":
        setProgress(handleCalculateProgressCurrentDoc());
        break;
      case "docChild":
        setProgress(handleCalculateProgressCurrentDocAndChild(node));
        break;
      case "docAll":
        setProgress(
          handleCalculateProgressCurrentDocAndChild(currentFlowPlan.root)
        );
        break;
      case "custom":
        setTasklists(handleGetTaskLists(currentFlowPlan.root, [0]));
      default:
        setProgress(0);
        break;
    }
  };

  const handleToggleSelectInTasklist = (tasklistIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.selected = !tasklist.selected;
        for (let i = 0; i < tasklist.tasks.length; i++) {
          tasklist.tasks[i].selected = tasklist.selected;
        }
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleToggleSelectInTask = (tasklistIndex, taskIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.tasks = tasklist.tasks.map((task, i) => {
          if (i === taskIndex) {
            task.selected = !task.selected;
            if (!task.selected) {
              tasklist.selected = false;
            }
          }
          return task;
        });
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleToggleMinimizeTasklist = (tasklistIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.minimized = !tasklist.minimized;
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleToggleMinimizeTask = (tasklistIndex, taskIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.tasks = tasklist.tasks.map((task, i) => {
          if (i === taskIndex) {
            task.minimized = !task.minimized;
          }
          return task;
        });
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleInitilizeTasklists = () => {
    if (currentField?.data?.progress?.selected) {
      let tasklists = handleGetTaskLists(currentFlowPlan.root, [0]);
      let currentTasklists = currentField?.data?.progress?.selected;
      tasklists = tasklists.map((tasklist, i) => {
        tasklist.selected = currentTasklists[i]?.selected;
        tasklist.tasks = tasklist.tasks.map((task, j) => {
          task.selected = currentTasklists[i]?.tasks[j]?.selected;
          return task;
        });
        return tasklist;
      });
      setTasklists(tasklists);
    }
  };

  useEffect(() => {
    if (!tasklists) return;
    if (!tasklists?.length) return;
    if (currentField?.data?.progress?.type === "custom") {
      setProgress(handleCalculateProgressCustom(tasklists));
    }
  }, [tasklists]);

  useEffect(() => {
    handleWhatToCalculate(currentField?.data?.progress?.type);
  }, [currentField?.data?.progress?.type]);

  useEffect(() => {
    handleInitilizeTasklists();
  }, []);

  return (
    <form
      onSubmit={handleSave}
      className="w-full flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md gap-2"
    >
      <ProgressBar
        showPercentage={currentField?.config?.showPercentage}
        progress={progress}
        multiColor={currentField?.config?.multiColor}
        color={currentField?.config?.color}
      />
      {currentField?.data?.progress?.type === "custom" && (
        <div className="w-full p-2 h-[300px] small-scroll-bar scroll-bar-inverse rounded-md bg-[var(--btn-secondary)] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-start gap-2">
          {tasklists.map((tasklist, index) => (
            <div
              key={tasklist.title}
              className="w-full flex flex-col justify-start items-start gap-2"
            >
              {(index !== 0 || index === tasklists.length - 1) && (
                <span className="block rounded-md w-full h-[2px] bg-[var(--text-primary)]"></span>
              )}
              <span className="w-full flex justify-start items-start text-sm text-[var(--text-primary)] font-bold bg-transparent outline-none break-all">
                <button
                  type="button"
                  onClick={() => handleToggleSelectInTasklist(index)}
                  className="w-5 h-5 mr-1 block shrink-0 cursor-pointer group"
                >
                  {tasklist?.selected ? <CheckedIcon /> : <UncheckedIcon />}
                </button>
                {tasklist?.title}
                <button
                  type="button"
                  onClick={() => handleToggleMinimizeTasklist(index)}
                  className="ml-3 shrink-0 relative w-5 h-5 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
                  title="Minimize"
                >
                  <span
                    style={{
                      rotate: tasklist?.minimized ? "0deg" : "90deg",
                    }}
                    className="flex justify-center items-center text-lg font-bold"
                  >
                    <BackIcon />
                  </span>
                </button>
              </span>
              {!tasklist?.minimized &&
                tasklist?.tasks.map((field, i) => (
                  <div
                    key={field.id}
                    className="pl-3 w-full flex flex-col justify-between items-center gap-2"
                  >
                    <span className="w-full text-xs items-center flex text-[var(--text-primary)] bg-transparent outline-none break-all">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectInTask(index, i)}
                        className="w-5 h-5 mr-1 block shrink-0 cursor-pointer group"
                      >
                        {field?.selected ? <CheckedIcon /> : <UncheckedIcon />}
                      </button>
                      Tasklist - {i + 1}
                      <button
                        type="button"
                        onClick={() => handleToggleMinimizeTask(index, i)}
                        className="ml-3 shrink-0 relative w-3 h-3 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
                        title="Minimize"
                      >
                        <span
                          style={{
                            rotate: field?.minimized ? "0deg" : "90deg",
                          }}
                          className="flex justify-center items-center text-lg font-bold"
                        >
                          <BackIcon />
                        </span>
                      </button>
                    </span>
                    {!field?.minimized && (
                      <div
                        style={{
                          display:
                            field?.id === currentField?.id ? "none" : "flex",
                          paddingLeft: `${
                            field?.config?.indentation * 10 || 4
                          }px`,
                        }}
                        className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
                      >
                        {field?.data?.list?.map((item, j) => (
                          <div
                            key={`shown-list-item-${item?.id || j}`}
                            className="w-full flex flex-col justify-center items-center text-sm"
                          >
                            <span
                              className="w-full flex text-[var(--text-primary)] bg-transparent outline-none break-all"
                              style={{
                                fontSize: `${field?.config?.fontSize}px`,
                                textDecoration: `${
                                  field?.config?.strickthrough
                                    ? "line-through"
                                    : "none"
                                }`,
                                fontStyle: `${
                                  field?.config?.italic ? "italic" : "normal"
                                }`,
                                fontWeight: `${
                                  field?.config?.bold ? "bold" : "normal"
                                }`,
                                fontFamily: `${field?.config?.fontFamily}`,
                                color: `${field?.config?.color}`,
                                textAlign: `${field?.config?.align}`,
                              }}
                            >
                              <span
                                style={{
                                  color: `${field?.config?.color}`,
                                }}
                                className="w-5 h-5 mr-1 block shrink-0 cursor-pointer group"
                              >
                                {item?.completed ? (
                                  <CheckedIcon />
                                ) : (
                                  <UncheckedIcon />
                                )}
                              </span>
                              {item?.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
      <div className="w-full flex justify-center items-center gap-2 flex-wrap mt-2">
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          type="button"
          onClick={() => {
            setCurrentFieldType(null);
            setCurrentField(null);
          }}
        >
          Cancel
        </button>
        <select
          title="Type of Progress"
          className="w-[150px] group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          value={currentField?.data?.progress?.type}
          onChange={(e) => {
            setCurrentField({
              ...currentField,
              data: {
                ...currentField.data,
                progress: {
                  ...currentField.data.progress,
                  type: e.target.value,
                },
              },
            });
          }}
        >
          {list.map((item) => (
            <option key={item.type} value={item.type}>
              {item.des}
            </option>
          ))}
        </select>
        <button
          type="button"
          title="Toggle Percentage"
          className="relative w-8 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                showPercentage: !currentField?.config?.showPercentage,
              },
            });
          }}
        >
          {!currentField?.config?.showPercentage && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            %
          </span>
        </button>
        <button
          type="button"
          title="Toggle Multi Color"
          className="relative w-8 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                multiColor: !currentField?.config?.multiColor,
              },
            });
          }}
        >
          {!currentField?.config?.multiColor && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <ColorIcon />
          </span>
        </button>
        <button
          type="button"
          title="Toggle Multi Color"
          className="relative w-8 h-8 px-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => setPin((prev) => !prev)}
        >
          {!pin && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <PInIcon />
          </span>
        </button>
        <div className="w-8 h-8 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center outline-none relative">
          <input
            className="w-full h-full opacity-0 bg-transparent outline-none cursor-pointer"
            type="color"
            title="Progress Bar Color"
            value={currentField?.config?.color}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                config: {
                  ...currentField.config,
                  color: e.target.value,
                },
              });
            }}
          />
          <span className="pointer-events-none absolute  top-0 left-0 w-full h-full p-[8px]">
            <ColorIcon />
          </span>
          <span
            style={{
              backgroundColor: `${currentField?.config?.color}`,
            }}
            className="-top-1 -right-1 absolute w-3 h-3 rounded-full"
          ></span>
        </div>
        {currentField?.id && (
          <button
            type="button"
            className="w-8 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={() => handleDelete(currentField?.index)}
          >
            <span className="">
              <DeleteIcon />
            </span>
          </button>
        )}
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={(e) => handleSave(e, currentField?.index)}
        >
          Save
        </button>
      </div>
    </form>
  );
};

const Paragraph = ({
  setShowAdd,
  node,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  handleResetShowAdd,
  dataIndex,
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
    if (currentField?.data?.text === "") return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (index !== null) {
      node.data[index] = currentField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...currentField,
        id: v4(),
      });
      handleResetShowAdd();
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
      className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md"
    >
      <textarea
        type="text"
        autoFocus={true}
        placeholder="Paragraph"
        value={currentField?.data?.text}
        onChange={handleParaChange}
        required
        className="w-full h-fit bg-[var(--bg-secondary)] p-1 text-[var(--text-primary)] text-sm outline-none transition-colors duration-300 cursor-pointer resize-none"
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
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </form>
  );
};

const UnorderedList = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();

  const [list, setList] = useState(currentField?.data?.list ?? []);
  const [item, setItem] = useState("");
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

  const handleItemChange = (e, i = null) => {
    let newList = [...list];
    if (i !== null) {
      newList[i] = {
        id: list[i].id,
        value: e.target.value,
      };
      setList(newList);
    } else {
      setItem(e.target.value);
    }
    console.log(list);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        id: v4(),
        value: item,
      },
    ]);
    setItem("");
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
    let finalList =
      item === ""
        ? list
        : [
            ...list,
            {
              id: v4(),
              value: item,
            },
          ];
    if (finalList.length === 0) {
      return;
    }
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        list: finalList,
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };
  const handleMove = (items) => {
    setList(items);
  };
  const handleDelete = async (index) => {
    let newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  return (
    <div
      style={{
        paddingLeft: `${currentField?.config?.indentation * 10 || 4}px`,
      }}
      className="w-full h-fit flex flex-col justify-start items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-md"
    >
      <SortableList
        items={list}
        onChange={handleMove}
        className="flex flex-col gap-1"
        renderItem={(item, active, setActive, index) => (
          <SortableList.Item id={item?.id}>
            <div
              key={`list-item-${item?.id}`}
              className="group w-full flex justify-center items-center text-sm relative"
            >
              <span
                style={{
                  color: `${currentField?.config?.color}`,
                }}
                className="w-3 h-3 mr-1 block"
              >
                {
                  listStyles?.find(
                    (listStyle) =>
                      listStyle.type === currentField.config?.listStyle
                  )?.icon
                }
              </span>
              <input
                required
                type="text"
                placeholder="Enter List Item..."
                value={item.value}
                onChange={(e) => handleItemChange(e, index)}
                className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
                style={{
                  fontSize: `${currentField?.config?.fontSize}px`,
                  textDecoration: `${
                    currentField?.config?.strickthrough
                      ? "line-through"
                      : "none"
                  }`,
                  fontStyle: `${
                    currentField?.config?.italic ? "italic" : "normal"
                  }`,
                  fontWeight: `${
                    currentField?.config?.bold ? "bold" : "normal"
                  }`,
                  fontFamily: `${currentField?.config?.fontFamily}`,
                  color: `${currentField?.config?.color}`,
                  textAlign: `${currentField?.config?.align}`,
                }}
              />
              <SortableList.DragHandle className="opacity-0 group-hover:opacity-100 w-5 h-5 absolute right-9 bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center" />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="opacity-0 group-hover:opacity-100 w-7 h-5 flex justify-center items-center absolute right-1 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
              >
                <DeleteIcon />
              </button>
            </div>
          </SortableList.Item>
        )}
      />

      <form
        onSubmit={handleAdd}
        className="w-full flex justify-center items-center text-sm"
      >
        <span
          style={{
            color: `${currentField?.config?.color}`,
          }}
          className="w-3 h-3 mr-1 block"
        >
          {
            listStyles?.find(
              (listStyle) => listStyle.type === currentField.config?.listStyle
            )?.icon
          }
        </span>
        <input
          required
          autoFocus
          type="text"
          placeholder="Enter List Item..."
          value={item}
          onChange={handleItemChange}
          className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
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
      </form>
      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </div>
  );
};

const TaskList = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();
  const [list, setList] = useState(currentField?.data?.list ?? []);
  const [repeatData, setRepeatData] = useState(
    currentField?.data?.taskList?.repeat?.data ?? []
  );

  const [item, setItem] = useState({
    text: "",
    completed: false,
    createdAt: new Date(),
    completedAt: null,
  });
  const inputRefs = useRef([]);
  const [showChangeDateInfo, setShowChangeDateInfo] = useState({
    show: false,
    index: null,
  });
  const [progress, setProgress] = useState(0);
  const repeatFormats = [
    {
      type: "daily",
      des: "Daily",
    },
    {
      type: "weekdays",
      des: "Weekdays (Mon to Fri)",
    },
    {
      type: "weekends",
      des: "Weekends (Sat and Sun)",
    },
    {
      type: "customDays",
      des: "Custom Days",
    },
    {
      type: "weekly",
      des: "Weekly",
    },
    {
      type: "monthly",
      des: "Monthly",
    },
    {
      type: "customMonths",
      des: "Custom Months",
    },
    {
      type: "yearly",
      des: "Yearly",
    },
  ];
  const defaultCustomDays = [
    {
      type: "monday",
      des: "Monday",
      shortDes: "Mon",
      checked: true,
    },
    {
      type: "tuesday",
      des: "Tuesday",
      shortDes: "Tue",
      checked: true,
    },
    {
      type: "wednesday",
      des: "Wednesday",
      shortDes: "Wed",
      checked: true,
    },
    {
      type: "thursday",
      des: "Thursday",
      shortDes: "Thu",
      checked: true,
    },
    {
      type: "friday",
      des: "Friday",
      shortDes: "Fri",
      checked: true,
    },
    {
      type: "saturday",
      des: "Saturday",
      shortDes: "Sat",
      checked: true,
    },
    {
      type: "sunday",
      des: "Sunday",
      shortDes: "Sun",
      checked: true,
    },
  ];
  const defaultCustomMonths = [
    {
      type: "january",
      des: "January",
      shortDes: "Jan",
      checked: true,
    },
    {
      type: "february",
      des: "February",
      shortDes: "Feb",
      checked: true,
    },
    {
      type: "march",
      des: "March",
      shortDes: "Mar",
      checked: true,
    },
    {
      type: "april",
      des: "April",
      shortDes: "Apr",
      checked: true,
    },
    {
      type: "may",
      des: "May",
      shortDes: "May",
      checked: true,
    },
    {
      type: "june",
      des: "June",
      shortDes: "Jun",
      checked: true,
    },
    {
      type: "july",
      des: "July",
      shortDes: "Jul",
      checked: true,
    },
    {
      type: "august",
      des: "August",
      shortDes: "Aug",
      checked: true,
    },
    {
      type: "september",
      des: "September",
      shortDes: "Sep",
      checked: true,
    },
    {
      type: "october",
      des: "October",
      shortDes: "Oct",
      checked: true,
    },
    {
      type: "november",
      des: "November",
      shortDes: "Nov",
      checked: true,
    },
    {
      type: "december",
      des: "December",
      shortDes: "Dec",
      checked: true,
    },
  ];
  const defaultTaskList = {
    repeat: {
      format: {
        type: "daily",
        des: "Daily",
      },
      custom: defaultCustomDays,
    },
  };

  const handleSetChangeDateInfo = (index) => {
    setShowChangeDateInfo((prev) => ({
      show: prev.index === index ? !prev.show : prev.show,
      index: index,
    }));
  };

  const handleGetCustom = (type) => {
    return type === "monthly" || type === "customMonths"
      ? defaultCustomMonths
      : type === "daily" || type === "customDays"
      ? defaultCustomDays
      : type === "weekdays"
      ? defaultCustomDays.map((day) =>
          day.type === "saturday" || day.type === "sunday"
            ? { ...day, checked: false }
            : {
                ...day,
                checked: true,
              }
        )
      : type === "weekends"
      ? defaultCustomDays.map((day) =>
          day.type === "saturday" || day.type === "sunday"
            ? { ...day, checked: true }
            : {
                ...day,
                checked: false,
              }
        )
      : defaultCustomDays;
  };

  const handleSelectChange = (e) => {
    let type = e.target.value;
    let format = repeatFormats.find((format) => format.type === type);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        taskList: {
          ...(currentField.data.taskList === undefined
            ? defaultTaskList
            : currentField.data.taskList),
          repeat: {
            ...(currentField.data.taskList === undefined
              ? defaultTaskList.repeat
              : currentField.data.taskList.repeat),
            format: format,
            custom: handleGetCustom(format?.type),
          },
        },
      },
    });
    setRepeatData([]);
    setCurrentRepeatList(handleGetCurrentRepeatList(currentDate.current, []));
  };

  const getRelativeDayString = (date) => {
    const inputDate = new Date(date);
    const today = new Date();

    // Clear the time part for accurate date comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    const timeDifference = inputDate.getTime() - today.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    if (dayDifference === 0) {
      return "Today";
    } else if (dayDifference === 1) {
      return "Tomorrow";
    } else if (dayDifference === -1) {
      return "Yesterday";
    } else {
      const type = currentField?.data?.taskList?.repeat?.format?.type;
      const dayTypes = ["daily", "weekdays", "weekends", "customDays"];
      const monthTypes = ["monthly", "customMonths"];
      const isTypeDay = dayTypes.includes(type);
      const isTypeMonth = monthTypes.includes(type);
      return isTypeDay
        ? inputDate.toLocaleDateString("en-US", { weekday: "short" })
        : isTypeMonth
        ? inputDate.toLocaleDateString("en-US", { month: "short" })
        : inputDate.toLocaleDateString("en-US", { year: "numeric" });
    }
  };

  const [currentDate, setCurrentDate] = useState({
    current: new Date(),
    formated: getRelativeDayString(new Date()),
  });

  const areAllCustomUnchecked = (customs) => {
    return customs.every((custom) => !custom.checked);
  };

  const getDayStringFromDate = (date) => {
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayMap = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return dayMap[dayOfWeek];
  };

  const getNextCheckedDay = (date) => {
    date = new Date(date);
    const currentDay = getDayStringFromDate(date);
    const days = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(days)) return;
    const currentIndex = days.findIndex((day) => day.type === currentDay);
    const totalDays = days.length;
    let nextIndex = currentIndex;
    const nextDate = new Date(date);

    do {
      nextIndex = (nextIndex + 1) % totalDays;
      nextDate.setDate(nextDate.getDate() + 1);
    } while (!days[nextIndex].checked && nextIndex !== currentIndex);

    return nextDate;
  };

  const getPreviousCheckedDay = (date) => {
    date = new Date(date);
    const currentDay = getDayStringFromDate(date);
    const days = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(days)) return;
    const currentIndex = days.findIndex((day) => day.type === currentDay);
    const totalDays = days.length;
    let previousIndex = currentIndex;
    const previousDate = new Date(date);

    do {
      previousIndex = (previousIndex - 1 + totalDays) % totalDays;
      previousDate.setDate(previousDate.getDate() - 1);
    } while (!days[previousIndex].checked && previousIndex !== currentIndex);

    return previousDate;
  };

  const getNextWeek = (date) => {
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  };

  const getPreviousWeek = (date) => {
    const previousWeek = new Date(date);
    previousWeek.setDate(previousWeek.getDate() - 7);
    return previousWeek;
  };

  const getNextMonth = (date) => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const getPreviousMonth = (date) => {
    const previousMonth = new Date(date);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    return previousMonth;
  };

  const getNextCheckedMonth = (date) => {
    let currentDate = new Date(date);
    const months = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(months)) return;
    const currentIndex = currentDate.getMonth(); // 0 (January) to 11 (December)
    const totalMonths = months?.length;
    let nextIndex = currentIndex;
    const nextDate = new Date(currentDate);

    do {
      nextIndex = (nextIndex + 1) % totalMonths;
      nextDate.setMonth(nextDate.getMonth() + 1);
    } while (!months[nextIndex].checked && nextIndex !== currentIndex);

    return nextDate;
  };

  const getPreviousCheckedMonth = (date) => {
    let currentDate = new Date(date);
    const months = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(months)) return;
    const currentIndex = currentDate.getMonth(); // 0 (January) to 11 (December)
    const totalMonths = months?.length;
    let previousIndex = currentIndex;
    const previousDate = new Date(currentDate);

    do {
      previousIndex = (previousIndex - 1 + totalMonths) % totalMonths;
      previousDate.setMonth(previousDate.getMonth() - 1);
    } while (!months[previousIndex].checked && previousIndex !== currentIndex);

    return previousDate;
  };

  const getNextYear = (date) => {
    const nextYear = new Date(date);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear;
  };

  const getPreviousYear = (date) => {
    const previousYear = new Date(date);
    previousYear.setFullYear(previousYear.getFullYear() - 1);
    return previousYear;
  };

  const handleGetDateNavigationFunction = (iso, repeatType, direction) => {
    const navigationFunctions = {
      daily: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekdays: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekends: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      customDays: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekly: {
        next: getNextWeek,
        prev: getPreviousWeek,
      },
      monthly: {
        next: getNextMonth,
        prev: getPreviousMonth,
      },
      customMonths: {
        next: getNextCheckedMonth,
        prev: getPreviousCheckedMonth,
      },
      yearly: {
        next: getNextYear,
        prev: getPreviousYear,
      },
    };

    let newDate = navigationFunctions[repeatType]?.[direction](iso);
    setCurrentDate({
      current: newDate,
      formated: getRelativeDayString(newDate),
    });
  };

  const handleCheck = (index) => {
    let newDays = [...currentField?.data?.taskList?.repeat?.custom];
    newDays[index] = {
      ...newDays[index],
      checked: !newDays[index].checked,
    };
    if (areAllCustomUnchecked(newDays)) return;
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        taskList: {
          ...currentField.data.taskList,
          repeat: {
            ...currentField.data.taskList.repeat,
            custom: newDays,
          },
        },
      },
    });
  };

  const handleSetDateTime = (e) => {
    let time = e.target.value;
    let newDate = new Date(time);
    setCurrentDate({
      current: newDate,
      formated: getRelativeDayString(newDate),
    });
  };

  const handleItemChange = (e, i = null) => {
    let newList = [...list];
    if (i !== null) {
      newList[i] = {
        ...newList[i],
        id: newList[i].id,
        text: e.target.value,
      };

      setList(newList);
    } else {
      setItem({
        ...item,
        text: e.target.value,
      });
    }
  };

  const handleKeyDown = (event, i) => {
    if (event?.key === "Enter") {
      console.log("Enter key pressed", event);
      let newItem = {
        text: "",
        completed: false,
        createdAt: new Date(),
        completedAt: null,
        id: v4(),
      };
      setList((prev) => {
        let newList = [...prev];
        newList.splice(i + 1, 0, newItem);
        return newList;
      });
      setTimeout(() => {
        if (inputRefs.current[i + 1]) {
          inputRefs.current[i + 1].focus();
        }
      }, 100);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        ...item,
        id: v4(),
      },
    ]);
    setItem({
      text: "",
      completed: false,
      createdAt: new Date(),
      completedAt: null,
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
    let finalList =
      item.text === ""
        ? list
        : [
            ...list,
            {
              ...item,
              id: v4(),
            },
          ];
    if (finalList.length === 0) {
      return;
    }
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        list: finalList,
        taskList:
          currentField?.data?.taskList === undefined
            ? defaultTaskList
            : {
                ...currentField.data.taskList,
                repeat: {
                  ...currentField.data.taskList.repeat,
                  data: repeatData,
                },
              },
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isSameWeek = (date1, date2) => {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    // Set both dates to the start of their respective weeks
    firstDate.setHours(0, 0, 0, 0);
    secondDate.setHours(0, 0, 0, 0);

    const dayOfWeek = (date) => (date.getDay() + 6) % 7; // 0 (Monday) to 6 (Sunday)

    const firstDayOfWeek = dayOfWeek(firstDate);
    const secondDayOfWeek = dayOfWeek(secondDate);

    // Move to the start of the week (Monday)
    firstDate.setDate(firstDate.getDate() - firstDayOfWeek);
    secondDate.setDate(secondDate.getDate() - secondDayOfWeek);

    // Compare the adjusted dates
    return firstDate.getTime() === secondDate.getTime();
  };

  const isSameMonth = (date1, date2) => {
    return date1.getMonth() === date2.getMonth();
  };

  const isSameYear = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear();
  };

  const findObjectByDate = (array, targetDate, type) => {
    const index = array.findIndex((item) => {
      switch (type) {
        case "daily":
        case "weekdays":
        case "weekends":
        case "customDays":
          return isSameDate(new Date(item.date), new Date(targetDate));
        case "weekly":
          return isSameWeek(new Date(item.date), new Date(targetDate));
        case "monthly":
        case "customMonths":
          return isSameMonth(new Date(item.date), new Date(targetDate));
        case "yearly":
          return isSameYear(new Date(item.date), new Date(targetDate));
        default:
          return;
      }
    });
    return index !== -1 ? { index, object: array[index] } : null;
  };

  const handleSetRepeatData = (date, newList, index) => {
    date = date.toISOString();
    let dateObject = findObjectByDate(
      repeatData,
      date,
      currentField?.data?.taskList?.repeat?.format?.type
    );

    if (dateObject) {
      let data = dateObject.object.data;
      let itemIndex = data.findIndex((item) => item.id === newList[index].id);
      if (itemIndex !== -1) {
        data[itemIndex] = {
          id: newList[index].id,
          completed: newList[index].completed,
        };
      } else {
        data.push({
          id: newList[index].id,
          completed: newList[index].completed,
        });
      }

      setRepeatData((prev) => {
        let newRepeatData = [...prev];
        newRepeatData[dateObject.index] = {
          date: date,
          data: data,
        };
        return newRepeatData;
      });

      setCurrentRepeatList((prev) => {
        let newCurrentRepeatList = [...prev];
        newCurrentRepeatList[index] = {
          ...newCurrentRepeatList[index],
          completed: newList[index].completed,
        };
        return newCurrentRepeatList;
      });
    } else {
      let newRepeatData = [
        ...repeatData,
        {
          date: date,
          data: [
            {
              id: newList[index].id,
              completed: newList[index].completed,
            },
          ],
        },
      ];

      setRepeatData(newRepeatData);
      setCurrentRepeatList((prev) => {
        let newCurrentRepeatList = [...prev];
        newCurrentRepeatList[index] = {
          ...newCurrentRepeatList[index],
          completed: newList[index].completed,
        };
        return newCurrentRepeatList;
      });
    }
  };

  const handleCompleteToggle = (e, index = null) => {
    if (index !== null) {
      let newList = [
        ...(currentField?.config?.repeat ? currentRepeatList : list),
      ];
      newList[index] = {
        ...newList[index],
        completed: !newList[index].completed,
        completedAt: !newList[index].completed ? new Date() : null,
      };

      if (currentField?.config?.repeat) {
        handleSetRepeatData(currentDate.current, newList, index);
      }

      setList(newList);
    } else {
      setItem((prev) => ({
        ...prev,
        completed: !prev.completed,
        completedAt: !prev.completed ? new Date() : null,
      }));
    }
  };

  const handleGetCurrentRepeatList = (date, repeatData) => {
    let repeatList = structuredClone(list);
    let currentDate = date;
    if (!currentDate) {
      currentDate = new Date();
    }
    console.log(repeatData);
    let repeatObject = findObjectByDate(
      repeatData,
      currentDate.toISOString(),
      currentField?.data?.taskList?.repeat?.format?.type
    );
    if (repeatObject) {
      let repeatObjectData = repeatObject.object.data;
      repeatList = list.map((item) => {
        let repeatItem = repeatObjectData.find((data) => data.id === item.id);
        return repeatItem
          ? {
              ...item,
              completed: repeatItem.completed,
            }
          : {
              ...item,
              completed: false,
            };
      });

      return repeatList;
    } else {
      return repeatList.map((item) => ({
        ...item,
        completed: false,
      }));
    }
  };

  const [currentRepeatList, setCurrentRepeatList] = useState(list);

  const handleDelete = async (index) => {
    let newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleMove = (items) => {
    setList(items);
  };

  const handleGetDateTime = (iso) => {
    if (!iso) {
      iso = new Date().toISOString();
    }
    let utcDate = new Date(iso);
    let finalIso = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${utcDate
      .getDate()
      .toString()
      .padStart(2, "0")}T${utcDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${utcDate.getMinutes().toString().padStart(2, "0")}`;
    return finalIso;
  };

  const handleDateInfoChange = (e, index, type) => {
    let newList = [...list];
    newList[index] = {
      ...newList[index],
      [type]: e.target.value,
    };
    setList(newList);
  };

  const handleCalculateProgress = (list) => {
    if (!currentField?.config?.progressBar) return;
    if (list.length === 0) return;
    let total = 0;
    list?.forEach((item) => {
      if (item.completed) {
        total++;
      }
    });

    if (item.text !== "" && item.completed) {
      total++;
    }

    let progress = (total / (list?.length + (item.text === "" ? 0 : 1))) * 100;
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        progress: progress,
      },
    });
    setProgress(progress);
  };

  useEffect(() => {
    if (currentField?.config?.repeat) {
      handleCalculateProgress(currentRepeatList);
    } else {
      handleCalculateProgress(list);
    }
  }, [list, item, currentRepeatList]);

  useEffect(() => {
    if (!currentField?.config?.repeat) return;
    setCurrentRepeatList(
      handleGetCurrentRepeatList(currentDate.current, repeatData)
    );
  }, [currentDate, list, currentField?.config?.repeat]);

  return (
    <div
      style={{
        paddingLeft: `${currentField?.config?.indentation * 10 || 4}px`,
      }}
      className="w-full h-fit flex flex-col justify-start items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-md"
    >
      {currentField?.config?.repeat && (
        <div className="flex h-7 mb-1 flex-wrap justify-between items-center text-sm w-full px-2 bg-[var(--btn-secondary)] rounded-tr-md rounded-tl-md">
          <button
            className=" relative w-6 h-6 p-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
            type="button"
            onClick={() =>
              handleGetDateNavigationFunction(
                currentDate.current,
                currentField?.data?.taskList?.repeat?.format?.type,
                "prev"
              )
            }
          >
            <span className="rotate-180 flex justify-center items-center text-lg font-bold">
              <BackIcon />
            </span>
          </button>
          <div className="flex justify-center items-center">
            <span className="text-[10px] font-bold text-[var(--text-primary)]">
              {currentDate.formated}
              {" : "}
            </span>
            <input
              type="datetime-local"
              className="w-[170px] h-7 cursor-pointer  text-[10px] font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
              value={handleGetDateTime(currentDate.current)}
              onChange={handleSetDateTime}
            />
          </div>
          <button
            className=" relative w-6 h-6 p-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
            type="button"
            onClick={() =>
              handleGetDateNavigationFunction(
                currentDate.current,
                currentField?.data?.taskList?.repeat?.format?.type,
                "next"
              )
            }
          >
            <span className="flex justify-center items-center text-lg font-bold">
              <BackIcon />
            </span>
          </button>
        </div>
      )}
      {currentField?.config?.progressBar && <ProgressBar progress={progress} />}
      <SortableList
        items={list}
        onChange={handleMove}
        className=" flex flex-col gap-1"
        renderItem={(item, active, setActive, index) => (
          <SortableList.Item id={item?.id}>
            <div
              key={`tasklist-item-${item?.id}`}
              className="group w-full flex justify-center items-center flex-col text-sm relative"
            >
              <div className="w-full flex">
                <button
                  type="button"
                  style={{
                    color: `${currentField?.config?.color}`,
                  }}
                  className="w-5 h-5 mr-1 block cursor-pointer"
                  onClick={(e) => handleCompleteToggle(e, index)}
                >
                  {currentField?.config?.repeat ? (
                    currentRepeatList[index]?.completed ? (
                      <CheckedIcon />
                    ) : (
                      <UncheckedIcon />
                    )
                  ) : item.completed ? (
                    <CheckedIcon />
                  ) : (
                    <UncheckedIcon />
                  )}
                </button>
                <input
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  placeholder="Enter List Item..."
                  value={item?.text}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onChange={(e) => handleItemChange(e, index)}
                  className="w-full pr-[80px] text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
                  style={{
                    fontSize: `${currentField?.config?.fontSize}px`,
                    textDecoration: `${
                      currentField?.config?.strickthrough
                        ? "line-through"
                        : "none"
                    }`,
                    fontStyle: `${
                      currentField?.config?.italic ? "italic" : "normal"
                    }`,
                    fontWeight: `${
                      currentField?.config?.bold ? "bold" : "normal"
                    }`,
                    fontFamily: `${currentField?.config?.fontFamily}`,
                    color: `${currentField?.config?.color}`,
                    textAlign: `${currentField?.config?.align}`,
                  }}
                />
              </div>
              {currentField.config?.showDateInfo && (
                <div className="w-full opacity-100 flex justify-between items-center flex-wrap">
                  <TimeAndDate
                    group={false}
                    absolute={false}
                    text={`Completed: ${item?.completed ? "" : "Not yet"}`}
                    timeDate={
                      item.completed ? new Date(item.completedAt) : undefined
                    }
                  />
                  <TimeAndDate
                    group={false}
                    absolute={false}
                    text="Created: "
                    timeDate={
                      item.createdAt ? new Date(item.createdAt) : undefined
                    }
                  />
                </div>
              )}
              <SortableList.DragHandle className="opacity-0 group-hover:opacity-100 w-5 h-5 absolute right-[52px] bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center" />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex justify-center items-center absolute right-1 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
              >
                <DeleteIcon />
              </button>
              <button
                type="button"
                title="Change Dates"
                onClick={() => handleSetChangeDateInfo(index)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex justify-center items-center absolute right-7 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-add)] transition-colors duration-300"
              >
                <TimeStampIcon />
              </button>
              {(currentField?.config?.showDateInfo === true ||
                currentField?.config?.showDateInfo === undefined) &&
                showChangeDateInfo.show &&
                showChangeDateInfo.index === index && (
                  <div className="w-full flex justify-between flex-wrap gap-1 bg-[var(--bg-secondary)] p-1 rounded-md">
                    {item.completed && (
                      <input
                        className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
                        onChange={(e) =>
                          handleDateInfoChange(e, index, "completedAt")
                        }
                        value={handleGetDateTime(item.completedAt)}
                        type="datetime-local"
                      />
                    )}
                    <input
                      className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
                      onChange={(e) =>
                        handleDateInfoChange(e, index, "createdAt")
                      }
                      value={handleGetDateTime(item.createdAt)}
                      type="datetime-local"
                    />
                  </div>
                )}
            </div>
          </SortableList.Item>
        )}
      />

      <form
        onSubmit={handleAdd}
        className="w-full flex justify-center items-center text-sm"
      >
        <button
          type="button"
          style={{
            color: `${currentField?.config?.color}`,
          }}
          className="w-5 h-5 mr-1 block cursor-pointer"
          onClick={handleCompleteToggle}
        >
          {item.completed ? <CheckedIcon /> : <UncheckedIcon />}
        </button>
        <input
          required
          autoFocus
          type="text"
          placeholder="Enter List Item..."
          value={item.text}
          onChange={handleItemChange}
          className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
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
      </form>
      {currentField?.config?.repeat && (
        <div className="w-full flex flex-col justify-center items-center gap-2 flex-wrap mt-2">
          <div className="w-fit h-fit flex justify-center items-center gap-2 flex-wrap">
            <select
              title="Repeat Type"
              className="w-[130px] group h-8 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
              value={currentField?.data?.taskList?.repeat?.format?.type}
              onChange={handleSelectChange}
            >
              {repeatFormats.map((format) => (
                <option key={format.type} value={format.type}>
                  {format.des}
                </option>
              ))}
            </select>
          </div>
          <div className="w-fit h-fit flex justify-center items-center gap-2 flex-wrap">
            {(currentField?.data?.taskList?.repeat?.format?.type ===
              "customDays" ||
              currentField?.data?.taskList?.repeat?.format?.type ===
                "customMonths") &&
              currentField?.data?.taskList?.repeat?.custom?.map(
                (custom, index) => (
                  <button
                    key={custom.type}
                    type="button"
                    onClick={() => handleCheck(index)}
                    className={`w-fit px-2 h-8 flex justify-center items-center rounded-md ${
                      custom.checked
                        ? "bg-[var(--btn-secondary)]"
                        : "bg-[var(--btn-primary)]"
                    } text-[var(--text-primary)] text-xs font-bold`}
                  >
                    <span className="w-4 h-4 mr-1 block cursor-pointer">
                      {custom.checked ? <CheckedIcon /> : <UncheckedIcon />}
                    </span>
                    {custom.shortDes}
                  </button>
                )
              )}
          </div>
        </div>
      )}

      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
        defaultTaskList={defaultTaskList}
      />
    </div>
  );
};

const TaskListDisplay = ({
  field,
  currentField,
  setCurrentField,
  i,
  handleEditField,
}) => {
  const { db, currentFlowPlan, currentFlowPlanNode, setCurrentFlowPlan } =
    useStateContext();

  const getRelativeDayString = (date) => {
    const inputDate = new Date(date);
    const today = new Date();

    // Clear the time part for accurate date comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    const timeDifference = inputDate.getTime() - today.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    if (dayDifference === 0) {
      return "Today";
    } else if (dayDifference === 1) {
      return "Tomorrow";
    } else if (dayDifference === -1) {
      return "Yesterday";
    } else {
      const type = field?.data?.taskList?.repeat?.format?.type;
      const dayTypes = ["daily", "weekdays", "weekends", "customDays"];
      const monthTypes = ["monthly", "customMonths"];
      const isTypeDay = dayTypes.includes(type);
      const isTypeMonth = monthTypes.includes(type);
      return isTypeDay
        ? inputDate.toLocaleDateString("en-US", { weekday: "short" })
        : isTypeMonth
        ? inputDate.toLocaleDateString("en-US", { month: "short" })
        : inputDate.toLocaleDateString("en-US", { year: "numeric" });
    }
  };
  const [list, setList] = useState(field?.data?.list ?? []);
  const [currentRepeatList, setCurrentRepeatList] = useState(
    field?.data?.list ?? []
  );
  const [currentDate, setCurrentDate] = useState({
    current: new Date(),
    formated: getRelativeDayString(new Date()),
  });
  const [repeatData, setRepeatData] = useState(
    field?.data?.taskList?.repeat?.data ?? []
  );
  const [progress, setProgress] = useState(0);

  const defaultCustomDays = [
    {
      type: "monday",
      des: "Monday",
      shortDes: "Mon",
      checked: true,
    },
    {
      type: "tuesday",
      des: "Tuesday",
      shortDes: "Tue",
      checked: true,
    },
    {
      type: "wednesday",
      des: "Wednesday",
      shortDes: "Wed",
      checked: true,
    },
    {
      type: "thursday",
      des: "Thursday",
      shortDes: "Thu",
      checked: true,
    },
    {
      type: "friday",
      des: "Friday",
      shortDes: "Fri",
      checked: true,
    },
    {
      type: "saturday",
      des: "Saturday",
      shortDes: "Sat",
      checked: true,
    },
    {
      type: "sunday",
      des: "Sunday",
      shortDes: "Sun",
      checked: true,
    },
  ];
  const defaultCustomMonths = [
    {
      type: "january",
      des: "January",
      shortDes: "Jan",
      checked: true,
    },
    {
      type: "february",
      des: "February",
      shortDes: "Feb",
      checked: true,
    },
    {
      type: "march",
      des: "March",
      shortDes: "Mar",
      checked: true,
    },
    {
      type: "april",
      des: "April",
      shortDes: "Apr",
      checked: true,
    },
    {
      type: "may",
      des: "May",
      shortDes: "May",
      checked: true,
    },
    {
      type: "june",
      des: "June",
      shortDes: "Jun",
      checked: true,
    },
    {
      type: "july",
      des: "July",
      shortDes: "Jul",
      checked: true,
    },
    {
      type: "august",
      des: "August",
      shortDes: "Aug",
      checked: true,
    },
    {
      type: "september",
      des: "September",
      shortDes: "Sep",
      checked: true,
    },
    {
      type: "october",
      des: "October",
      shortDes: "Oct",
      checked: true,
    },
    {
      type: "november",
      des: "November",
      shortDes: "Nov",
      checked: true,
    },
    {
      type: "december",
      des: "December",
      shortDes: "Dec",
      checked: true,
    },
  ];
  const defaultTaskList = {
    repeat: {
      format: {
        type: "daily",
        des: "Daily",
      },
      custom: defaultCustomDays,
    },
  };

  const areAllCustomUnchecked = (customs) => {
    return customs.every((custom) => !custom.checked);
  };

  const getDayStringFromDate = (date) => {
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayMap = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return dayMap[dayOfWeek];
  };

  const getNextCheckedDay = (date) => {
    date = new Date(date);
    const currentDay = getDayStringFromDate(date);
    const days = field?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(days)) return;
    const currentIndex = days.findIndex((day) => day.type === currentDay);
    const totalDays = days.length;
    let nextIndex = currentIndex;
    const nextDate = new Date(date);

    do {
      nextIndex = (nextIndex + 1) % totalDays;
      nextDate.setDate(nextDate.getDate() + 1);
    } while (!days[nextIndex].checked && nextIndex !== currentIndex);

    return nextDate;
  };

  const getPreviousCheckedDay = (date) => {
    date = new Date(date);
    const currentDay = getDayStringFromDate(date);
    const days = field?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(days)) return;
    const currentIndex = days.findIndex((day) => day.type === currentDay);
    const totalDays = days.length;
    let previousIndex = currentIndex;
    const previousDate = new Date(date);

    do {
      previousIndex = (previousIndex - 1 + totalDays) % totalDays;
      previousDate.setDate(previousDate.getDate() - 1);
    } while (!days[previousIndex].checked && previousIndex !== currentIndex);

    return previousDate;
  };

  const getNextWeek = (date) => {
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  };

  const getPreviousWeek = (date) => {
    const previousWeek = new Date(date);
    previousWeek.setDate(previousWeek.getDate() - 7);
    return previousWeek;
  };

  const getNextMonth = (date) => {
    const nextMonth = new Date(date);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const getPreviousMonth = (date) => {
    const previousMonth = new Date(date);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    return previousMonth;
  };

  const getNextCheckedMonth = (date) => {
    let currentDate = new Date(date);
    const months = field?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(months)) return;
    const currentIndex = currentDate.getMonth(); // 0 (January) to 11 (December)
    const totalMonths = months?.length;
    let nextIndex = currentIndex;
    const nextDate = new Date(currentDate);

    do {
      nextIndex = (nextIndex + 1) % totalMonths;
      nextDate.setMonth(nextDate.getMonth() + 1);
    } while (!months[nextIndex].checked && nextIndex !== currentIndex);

    return nextDate;
  };

  const getPreviousCheckedMonth = (date) => {
    let currentDate = new Date(date);
    const months = field?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(months)) return;
    const currentIndex = currentDate.getMonth(); // 0 (January) to 11 (December)
    const totalMonths = months?.length;
    let previousIndex = currentIndex;
    const previousDate = new Date(currentDate);

    do {
      previousIndex = (previousIndex - 1 + totalMonths) % totalMonths;
      previousDate.setMonth(previousDate.getMonth() - 1);
    } while (!months[previousIndex].checked && previousIndex !== currentIndex);

    return previousDate;
  };

  const getNextYear = (date) => {
    const nextYear = new Date(date);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear;
  };

  const getPreviousYear = (date) => {
    const previousYear = new Date(date);
    previousYear.setFullYear(previousYear.getFullYear() - 1);
    return previousYear;
  };

  const handleGetDateNavigationFunction = (iso, repeatType, direction) => {
    const navigationFunctions = {
      daily: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekdays: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekends: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      customDays: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekly: {
        next: getNextWeek,
        prev: getPreviousWeek,
      },
      monthly: {
        next: getNextMonth,
        prev: getPreviousMonth,
      },
      customMonths: {
        next: getNextCheckedMonth,
        prev: getPreviousCheckedMonth,
      },
      yearly: {
        next: getNextYear,
        prev: getPreviousYear,
      },
    };

    let newDate = navigationFunctions[repeatType]?.[direction](iso);
    setCurrentDate({
      current: newDate,
      formated: getRelativeDayString(newDate),
    });
  };

  const handleSetDateTime = (e) => {
    let time = e.target.value;
    let newDate = new Date(time);
    setCurrentDate({
      current: newDate,
      formated: getRelativeDayString(newDate),
    });
  };

  const handleGetDateTime = (iso) => {
    if (!iso) {
      iso = new Date().toISOString();
    }
    let utcDate = new Date(iso);
    let finalIso = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${utcDate
      .getDate()
      .toString()
      .padStart(2, "0")}T${utcDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${utcDate.getMinutes().toString().padStart(2, "0")}`;
    return finalIso;
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

  const handleCalculateProgress = (list) => {
    if (!field?.config?.progressBar) return;
    if (list.length === 0) return;
    let total = 0;
    list?.forEach((item) => {
      if (item.completed) {
        total++;
      }
    });

    let progress = (total / list?.length) * 100;
    setProgress(progress);
  };

  const handleGetRepeatData = (date, newList, index) => {
    date = date.toISOString();
    let dateObject = findObjectByDate(
      repeatData,
      date,
      field?.data?.taskList?.repeat?.format?.type
    );
    let newRepeatData = [];
    let newCurrentRepeatList = [];

    if (dateObject) {
      let data = dateObject.object.data;
      let itemIndex = data.findIndex((item) => item.id === newList[index].id);
      if (itemIndex !== -1) {
        data[itemIndex] = {
          id: newList[index].id,
          completed: newList[index].completed,
        };
      } else {
        data.push({
          id: newList[index].id,
          completed: newList[index].completed,
        });
      }

      newRepeatData = [...repeatData];
      newRepeatData[dateObject.index] = {
        date: date,
        data: data,
      };

      newCurrentRepeatList = [...currentRepeatList];
      newCurrentRepeatList[index] = {
        ...newCurrentRepeatList[index],
        completed: newList[index].completed,
      };
    } else {
      newRepeatData = [
        ...repeatData,
        {
          date: date,
          data: [
            {
              id: newList[index].id,
              completed: newList[index].completed,
            },
          ],
        },
      ];

      newCurrentRepeatList = [...currentRepeatList];
      newCurrentRepeatList[index] = {
        ...newCurrentRepeatList[index],
        completed: newList[index].completed,
      };
    }

    return {
      repeatData: newRepeatData,
      currentRepeatList: newCurrentRepeatList,
    };
  };

  const handleCompleteToggle = (e, index) => {
    let newList = [
      ...(field?.config?.repeat ? currentRepeatList : field?.data?.list),
    ];
    newList[index] = {
      ...newList[index],
      completed: !newList[index].completed,
      completedAt: !newList[index].completed ? new Date() : null,
    };

    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });

    let result = null;
    if (field?.config?.repeat) {
      result = handleGetRepeatData(currentDate.current, newList, index);
      if (result) {
        setRepeatData(result.repeatData);
        setCurrentRepeatList(result.currentRepeatList);
      }
    }

    node.data[i] = {
      ...field,
      data: {
        ...field.data,
        list: field?.config?.repeat ? field?.data.list : newList,
        taskList:
          field?.data?.taskList === undefined
            ? {
                ...defaultTaskList,
                repeat: {
                  ...defaultTaskList.repeat,
                  data: result?.repeatData ?? repeatData,
                },
              }
            : {
                ...field.data.taskList,
                repeat: {
                  ...field.data.taskList.repeat,
                  data: result?.repeatData ?? repeatData,
                },
              },
      },
    };
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isSameWeek = (date1, date2) => {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    // Set both dates to the start of their respective weeks
    firstDate.setHours(0, 0, 0, 0);
    secondDate.setHours(0, 0, 0, 0);

    const dayOfWeek = (date) => (date.getDay() + 6) % 7; // 0 (Monday) to 6 (Sunday)

    const firstDayOfWeek = dayOfWeek(firstDate);
    const secondDayOfWeek = dayOfWeek(secondDate);

    // Move to the start of the week (Monday)
    firstDate.setDate(firstDate.getDate() - firstDayOfWeek);
    secondDate.setDate(secondDate.getDate() - secondDayOfWeek);

    // Compare the adjusted dates
    return firstDate.getTime() === secondDate.getTime();
  };

  const isSameMonth = (date1, date2) => {
    return date1.getMonth() === date2.getMonth();
  };

  const isSameYear = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear();
  };

  const findObjectByDate = (array, targetDate, type) => {
    const index = array.findIndex((item) => {
      switch (type) {
        case "daily":
        case "weekdays":
        case "weekends":
        case "customDays":
          return isSameDate(new Date(item.date), new Date(targetDate));
        case "weekly":
          return isSameWeek(new Date(item.date), new Date(targetDate));
        case "monthly":
        case "customMonths":
          return isSameMonth(new Date(item.date), new Date(targetDate));
        case "yearly":
          return isSameYear(new Date(item.date), new Date(targetDate));
        default:
          return;
      }
    });
    return index !== -1 ? { index, object: array[index] } : null;
  };

  const handleGetCurrentRepeatList = (date, repeatData) => {
    let repeatList = structuredClone(list);
    let currentDate = date;
    if (!currentDate) {
      currentDate = new Date();
    }
    let repeatObject = findObjectByDate(
      repeatData,
      currentDate.toISOString(),
      field?.data?.taskList?.repeat?.format?.type
    );
    if (repeatObject) {
      let repeatObjectData = repeatObject.object.data;
      repeatList = list.map((item) => {
        let repeatItem = repeatObjectData.find((data) => data.id === item.id);
        return repeatItem
          ? {
              ...item,
              completed: repeatItem.completed,
            }
          : {
              ...item,
              completed: false,
            };
      });

      return repeatList;
    } else {
      return repeatList.map((item) => ({
        ...item,
        completed: false,
      }));
    }
  };

  useEffect(() => {
    if (field?.config?.repeat) {
      handleCalculateProgress(currentRepeatList);
    } else {
      handleCalculateProgress(field?.data?.list);
    }
  }, [currentRepeatList, field?.config?.repeat, field?.data?.list]);

  useEffect(() => {
    if (!field?.config?.repeat) return;
    console.log(currentDate.current, repeatData);
    setCurrentRepeatList(
      handleGetCurrentRepeatList(currentDate.current, repeatData)
    );
  }, [currentDate, repeatData, field?.config?.repeat]);

  useEffect(() => {
    if (!field?.config?.repeat) return;
    setRepeatData(field?.data?.taskList?.repeat?.data ?? []);
  }, [field?.data?.taskList?.repeat?.data]);

  return (
    <div
      style={{
        display: field?.id === currentField?.id ? "none" : "flex",
        paddingLeft: `${field?.config?.indentation * 10 || 4}px`,
      }}
      className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
    >
      {field?.config?.repeat && (
        <div className="flex h-7 mb-1 flex-wrap justify-between items-center text-sm w-full px-2 bg-[var(--btn-secondary)] rounded-tr-md rounded-tl-md">
          <button
            className=" relative w-6 h-6 p-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
            type="button"
            onClick={() =>
              handleGetDateNavigationFunction(
                currentDate.current,
                field?.data?.taskList?.repeat?.format?.type,
                "prev"
              )
            }
          >
            <span className="rotate-180 flex justify-center items-center text-lg font-bold">
              <BackIcon />
            </span>
          </button>
          <div className="flex justify-center items-center">
            <span className="text-[10px] font-bold text-[var(--text-primary)]">
              {currentDate.formated}
              {" : "}
            </span>
            <input
              type="datetime-local"
              className="w-[170px] h-7 cursor-pointer  text-[10px] font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
              value={handleGetDateTime(currentDate.current)}
              onChange={handleSetDateTime}
            />
          </div>
          <button
            className=" relative w-6 h-6 p-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
            type="button"
            onClick={() =>
              handleGetDateNavigationFunction(
                currentDate.current,
                field?.data?.taskList?.repeat?.format?.type,
                "next"
              )
            }
          >
            <span className="flex justify-center items-center text-lg font-bold">
              <BackIcon />
            </span>
          </button>
        </div>
      )}
      {field?.config?.progressBar && <ProgressBar progress={progress} />}
      {field?.data?.list?.map((item, j) => (
        <div
          key={`shown-list-item-${item?.id || j}`}
          className="w-full flex flex-col justify-center items-center text-sm"
          onDoubleClick={() => handleEditField(field, i)}
        >
          <span
            className="w-full flex text-[var(--text-primary)] bg-transparent outline-none break-all"
            style={{
              fontSize: `${field?.config?.fontSize}px`,
              textDecoration: `${
                field?.config?.strickthrough ? "line-through" : "none"
              }`,
              fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
              fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
              fontFamily: `${field?.config?.fontFamily}`,
              color: `${field?.config?.color}`,
              textAlign: `${field?.config?.align}`,
            }}
          >
            <button
              type="button"
              style={{
                color: `${field?.config?.color}`,
              }}
              className="w-5 shrink-0 h-5 mr-1 block cursor-pointer"
              onClick={(e) => handleCompleteToggle(e, j)}
            >
              {field?.config?.repeat ? (
                currentRepeatList[j]?.completed ? (
                  <CheckedIcon />
                ) : (
                  <UncheckedIcon />
                )
              ) : item.completed ? (
                <CheckedIcon />
              ) : (
                <UncheckedIcon />
              )}
            </button>
            {item?.text}
          </span>
          {field.config?.showDateInfo && (
            <div className="w-full opacity-100 flex justify-between items-center flex-wrap">
              <TimeAndDate
                group={false}
                absolute={false}
                text={`Completed: ${item?.completed ? "" : "Not yet"}`}
                timeDate={
                  item.completed ? new Date(item.completedAt) : undefined
                }
              />
              <TimeAndDate
                group={false}
                absolute={false}
                text="Created: "
                timeDate={item.createdAt ? new Date(item.createdAt) : undefined}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ProgressBar = ({
  progress,
  showPercentage = true,
  multiColor = true,
  color = null,
  border = false,
}) => {
  return (
    <div className="w-full overflow-hidden h-4 flex justify-center items-center rounded-md relative">
      {showPercentage && (
        <span
          style={{
            textShadow: "0 0 5px rgba(0,0,0,1)",
          }}
          className="absolute text-xs text-[var(--text-primary)] font-bold"
        >
          {Math.floor(progress)}%
        </span>
      )}
      <div
        style={{
          background: border ? "var(--bg-quaternary)" : "",
        }}
        className="w-full h-2 bg-[var(--btn-secondary)] rounded-md "
      >
        <div
          className="h-full rounded-md transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: multiColor
              ? progress < 20
                ? "red"
                : progress < 40
                ? "#9129d4"
                : progress < 60
                ? "orange"
                : progress < 80
                ? "yellow"
                : progress < 100
                ? "skyblue"
                : progress === 100
                ? "#199d19"
                : ""
              : color,
          }}
        ></div>
      </div>
    </div>
  );
};

const NumberList = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const {
    db,
    currentFlowPlan,
    setCurrentFlowPlan,
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();
  const [list, setList] = useState(currentField?.data?.list ?? []);
  const [item, setItem] = useState("");
  const listStyles = [
    {
      type: "number",
      icon: (n) => n + 1,
    },
    {
      type: "roman",
      icon: (n) => handleNumberToRoman(n + 1),
    },
    {
      type: "alphabet",
      icon: (n) => handleNumberToAlphabet(n + 1),
    },
  ];

  const handleNumberToRoman = (num) => {
    const romanNumerals = [
      { value: 1000, numeral: "M" },
      { value: 900, numeral: "CM" },
      { value: 500, numeral: "D" },
      { value: 400, numeral: "CD" },
      { value: 100, numeral: "C" },
      { value: 90, numeral: "XC" },
      { value: 50, numeral: "L" },
      { value: 40, numeral: "XL" },
      { value: 10, numeral: "X" },
      { value: 9, numeral: "IX" },
      { value: 5, numeral: "V" },
      { value: 4, numeral: "IV" },
      { value: 1, numeral: "I" },
    ];

    let result = "";

    for (const pair of romanNumerals) {
      while (num >= pair.value) {
        result += pair.numeral;
        num -= pair.value;
      }
    }

    return result;
  };
  const handleNumberToAlphabet = (num) => {
    if (num < 1) {
      return "Number out of range (>= 1)";
    }

    let result = "";
    console.log(num);
    while (num > 0) {
      const remainder = (num - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      num = Math.floor((num - 1) / 26);
    }
    console.log(result);
    return result;
  };

  const handleItemChange = (e, i = null) => {
    let newList = [...list];
    if (i !== null) {
      newList[i] = {
        id: newList[i].id,
        value: e.target.value,
      };
      setList(newList);
    } else {
      setItem(e.target.value);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        id: v4(),
        value: item,
      },
    ]);
    setItem("");
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
    let finalList =
      item === ""
        ? list
        : [
            ...list,
            {
              id: v4(),
              value: item,
            },
          ];
    if (finalList.length === 0) {
      return;
    }
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        list: finalList,
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handleDelete = async (index) => {
    let newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleMove = (items) => {
    setList(items);
  };

  return (
    <div
      style={{
        paddingLeft: `${currentField?.config?.indentation * 10 || 4}px`,
      }}
      className="w-full h-fit flex flex-col justify-start items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-md"
    >
      <SortableList
        items={list}
        onChange={handleMove}
        className="flex flex-col gap-1"
        renderItem={(item, active, setActive, index) => (
          <SortableList.Item id={item?.id}>
            <div
              key={`numberlist-item-${item?.id}`}
              className="group w-full flex justify-center items-center text-sm relative"
            >
              <span
                style={{
                  color: `${currentField?.config?.color}`,
                }}
                className="w-3 h-full mr-1  flex justify-center items-center"
              >
                {listStyles
                  ?.find(
                    (listStyle) =>
                      listStyle.type === currentField.config?.listStyle
                  )
                  ?.icon(index) + "."}
              </span>
              <input
                required
                type="text"
                placeholder="Enter List Item..."
                value={item?.value}
                onChange={(e) => handleItemChange(e, index)}
                className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
                style={{
                  fontSize: `${currentField?.config?.fontSize}px`,
                  textDecoration: `${
                    currentField?.config?.strickthrough
                      ? "line-through"
                      : "none"
                  }`,
                  fontStyle: `${
                    currentField?.config?.italic ? "italic" : "normal"
                  }`,
                  fontWeight: `${
                    currentField?.config?.bold ? "bold" : "normal"
                  }`,
                  fontFamily: `${currentField?.config?.fontFamily}`,
                  color: `${currentField?.config?.color}`,
                  textAlign: `${currentField?.config?.align}`,
                }}
              />
              <SortableList.DragHandle className="opacity-0 group-hover:opacity-100 w-5 h-5 absolute right-9 bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center" />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="opacity-0 group-hover:opacity-100 w-7 h-5 flex justify-center items-center absolute right-1 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
              >
                <DeleteIcon />
              </button>
            </div>
          </SortableList.Item>
        )}
      />

      <form
        onSubmit={handleAdd}
        className="w-full flex justify-center items-center text-sm"
      >
        <span
          style={{
            color: `${currentField?.config?.color}`,
          }}
          className="w-3 h-full mr-1  flex justify-center items-center"
        >
          {listStyles
            ?.find(
              (listStyle) => listStyle.type === currentField.config?.listStyle
            )
            ?.icon(list.length) + "."}
        </span>
        <input
          required
          autoFocus
          type="text"
          placeholder="Enter List Item..."
          value={item}
          onChange={handleItemChange}
          className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
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
      </form>
      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </div>
  );
};

const Link = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();

  const [link, setLink] = useState(currentField?.data?.link ?? "");
  const [isValidLink, setIsValidLink] = useState(true);
  const [preview, setPreview] = useState(
    currentField?.data?.previewLink ?? null
  );
  const [loading, setLoading] = useState(false);

  const handleLinkChange = (e) => {
    if (e.target.value === "") {
      setIsValidLink(true);
    } else {
      setIsValidLink(e.target.value.match(/^(ftp|http|https):\/\/[^ "]+$/));
    }
    setLink(e.target.value);
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
    if (link === "") return;
    if (!isValidLink) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });

    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        link: link,
        previewLink: {
          title: preview?.title,
          description: preview?.description,
          previewImages: preview?.previewImages,
          favicon: preview?.favicon,
          siteName: preview?.siteName,
        },
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  const handlePreview = async () => {
    setPreview(null);
    setLoading(true);
    if (link === "") return setLoading(false);
    if (!isValidLink) return setLoading(false);
    try {
      const url = "https://get-website-preview.vercel.app" + "?link=" + link;
      const data = await fetch(url, {
        method: "GET",
        // mode: "no-cors",
      });
      let res = await data.json();
      console.log(res);
      if (!res.success) {
        setPreview(null);
        setLoading(false);
        return;
      }
      let tempPreview = {};
      Object.keys(res.data).forEach((key) => {
        if (res.data[key] !== "") {
          if (key === "previewImages") {
            tempPreview[key] = {
              value: res.data[key].map((image, i) => {
                return {
                  url: image,
                  show: currentField?.data?.previewLink?.previewImages?.value
                    ? currentField?.data?.previewLink?.previewImages?.value[i]
                        ?.show ?? true
                    : true,
                };
              }),
              show:
                currentField?.data?.previewLink?.previewImages?.show ?? true,
            };
          } else {
            tempPreview[key] = {
              value: res.data[key],
              show: currentField?.data?.previewLink?.[key]?.show ?? true,
            };
          }
        }
      });

      setPreview(tempPreview);
      setCurrentField({
        ...currentField,
        config: {
          ...currentField.config,
          preview: true,
        },
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setPreview(null);
      setLoading(false);
    }
  };

  const handleFaviconSrc = (src, link) => {
    if (!src) return "";
    if (src === "") return "";
    if (src?.startsWith("data:image")) return src;
    if (src?.match(/^(ftp|http|https):\/\/[^ "]+$/)) return src;
    let domain = link.split("/")[2];
    return "https://" + domain + src;
  };

  const handlePreviewImageShow = (index) => {
    setPreview((prev) => ({
      ...prev,
      previewImages: {
        ...prev.previewImages,
        value: prev.previewImages.value.map((image, i) => ({
          ...image,
          show: i === index ? !image.show : image.show,
        })),
      },
    }));
  };

  useEffect(() => {
    if (!currentField?.config?.preview) return;
    handlePreview();
  }, [link, currentField?.config?.preview]);

  return (
    <form
      onSubmit={handleSave}
      className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md"
    >
      <div className="w-full flex justify-center items-center p-1">
        <span className="w-3 h-3 flex justify-center items-center">
          <LinkIcon />
        </span>
        <input
          type="text"
          autoFocus={true}
          placeholder="Link"
          value={link}
          onChange={handleLinkChange}
          required
          className="w-full h-fit bg-[var(--bg-secondary)] p-1 text-[var(--text-primary)] text-sm outline-none transition-colors duration-300 cursor-pointer resize-none"
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
      </div>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          Loading Preview...
        </div>
      ) : (
        currentField?.config?.preview && (
          <div className="w-full h-fit flex justify-center items-center flex-col p-1">
            {preview?.favicon && (
              <div className="w-full flex justify-start items-center gap-1 ">
                {preview?.favicon?.show && (
                  <img
                    src={handleFaviconSrc(preview.favicon.value, link)}
                    alt="favicon"
                    className="w-5 h-5 rounded-full"
                  />
                )}
                {preview?.siteName?.show && (
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {preview.siteName.value}
                  </span>
                )}
              </div>
            )}
            {preview?.title?.show && (
              <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
                {preview.title.value}
              </h1>
            )}
            {preview?.description?.show && (
              <p className="w-full text-start text-[var(--text-primary)] text-xs">
                {preview.description.value}
              </p>
            )}
            {preview?.previewImages?.show &&
              preview?.previewImages?.value?.length > 0 &&
              preview?.previewImages?.value?.map((image, i) => (
                <div
                  key={`preview-image-${currentField?.id}-${i}-`}
                  className="w-full h-fit relative flex justify-center items-center"
                >
                  <img
                    src={image?.url}
                    alt="preview"
                    className="mt-2 rounded-md object-contain"
                  />
                  <div className="absolute bottom-0 right-0 w-fit h-fit flex justify-center items-center">
                    <button
                      type="button"
                      onClick={() => handlePreviewImageShow(i)}
                      className="w-6 h-6 flex justify-center items-center bg-[var(--bg-tertiary)] p-1 rounded-tl-md transition-colors duration-300"
                      title="Show This Image"
                    >
                      {image?.show ? <CheckedIcon /> : <UncheckedIcon />}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )
      )}
      {!isValidLink && (
        <span className="text-[var(--btn-delete)] text-xs font-bold">
          Enter a Valid Link!
        </span>
      )}
      <InputTitleButtons
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        handleSave={handleSave}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
        linkPreviewLoading={loading}
        linkPreview={preview}
        setLinkPreview={setPreview}
      />
    </form>
  );
};

const LinkPreview = ({ link, previewLink }) => {
  const [previewInfo, setPreviewInfo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    setPreview(null);
    setLoading(true);

    if (link === "") return;
    try {
      const url = "https://get-website-preview.vercel.app" + "?link=" + link;
      const data = await fetch(url, {
        method: "GET",
      });
      let res = await data.json();
      if (!res.success) {
        setPreview(null);
        setLoading(false);
        return;
      }

      let tempPreview = {};
      Object.keys(res.data).forEach((key) => {
        if (res.data[key] !== "") {
          if (key === "previewImages") {
            tempPreview[key] = {
              value: res.data[key].map((image, i) => ({
                url: image,
                show: previewLink[key]?.value?.[i]?.show ?? true,
              })),
              show: previewLink[key]?.show || true,
            };
          } else {
            tempPreview[key] = {
              value: res.data[key],
              show: previewLink[key]?.show || true,
            };
          }
        }
      });
      setPreview(tempPreview);
      if (Object.keys(previewLink).length === 0) {
        setPreviewInfo(tempPreview);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setPreview(null);
      setLoading(false);
    }
  };

  const handleFaviconSrc = (src, link) => {
    if (!src) return "";
    if (src === "") return "";
    if (src?.startsWith("data:image")) return src;
    if (src?.match(/^(ftp|http|https):\/\/[^ "]+$/)) return src;
    let domain = link.split("/")[2];
    return "https://" + domain + src;
  };

  useEffect(() => {
    setPreviewInfo(previewLink);
    handlePreview();
    console.log(previewLink);
  }, [link, previewLink]);

  return (
    <div className="w-full h-fit flex justify-center items-center flex-col">
      {loading ? (
        <>
          {previewInfo?.favicon && (
            <div className="w-full flex justify-start items-center gap-1 ">
              {previewInfo?.favicon?.show && (
                <img
                  src={handleFaviconSrc(previewInfo.favicon?.value, link)}
                  alt="favicon"
                  className="w-5 h-5 rounded-full"
                />
              )}
              {previewInfo?.siteName?.show && (
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {previewInfo.siteName?.value}
                </span>
              )}
            </div>
          )}
          {previewInfo?.title?.show && (
            <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
              {previewInfo.title?.value}
            </h1>
          )}
          {previewInfo?.description?.show && (
            <p className="w-full text-[var(--text-primary)] text-xs text-start">
              {previewInfo.description?.value}
            </p>
          )}
          {previewInfo?.previewImages?.show &&
            previewInfo?.previewImages?.value?.length > 0 &&
            previewInfo.previewImages?.value.map((image, i) =>
              image?.show ? (
                <div
                  key={`preview-image-${i}-${image.url}`}
                  className="w-full h-fit relative flex justify-center items-center overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt="Preview Image"
                    className="mt-2 rounded-md object-contain"
                  />
                </div>
              ) : null
            )}
        </>
      ) : (
        <>
          {(preview?.favicon || preview?.siteName) && (
            <div className="w-full flex justify-start items-center gap-1 ">
              {previewInfo?.favicon?.show && (
                <img
                  src={handleFaviconSrc(preview?.favicon?.value, link)}
                  alt="favicon"
                  className="w-5 h-5 rounded-full"
                />
              )}
              {previewInfo?.siteName?.show && (
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {preview?.siteName?.value}
                </span>
              )}
            </div>
          )}
          {previewInfo?.title?.show && (
            <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
              {preview?.title?.value}
            </h1>
          )}
          {previewInfo?.description?.show && (
            <p className="w-full text-[var(--text-primary)] text-xs text-start">
              {preview?.description?.value}
            </p>
          )}
          {previewInfo?.previewImages?.show &&
            preview?.previewImages?.value?.length > 0 &&
            preview?.previewImages?.value?.map((image, i) =>
              image?.show ? (
                <div
                  key={`preview-image-${i}-${image?.url}`}
                  className="w-full h-fit relative flex justify-center items-center overflow-hidden"
                >
                  <ImageWithPlaceholder
                    key={`preview-image-${i}`}
                    src={image?.url}
                    placeholderSrc={preview?.favicon?.value}
                    alt="preview"
                  />
                </div>
              ) : null
            )}
        </>
      )}
    </div>
  );
};

const ImageWithPlaceholder = ({ src, placeholderSrc, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {!imageLoaded && (
        <img
          src={placeholderSrc}
          alt="Placeholder"
          className="mt-2 rounded-md object-contain"
        />
      )}

      <img
        src={src}
        alt={alt}
        className="mt-2 rounded-md object-contain"
        onLoad={handleImageLoad}
      />
    </>
  );
};

const Image = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();
  const [image, setImage] = useState(currentField?.data?.image?.url ?? null);
  const [name, setName] = useState(currentField?.data?.image?.name ?? null);
  const [error, setError] = useState(null);
  const handleImageChange = (e) => {
    setError(null);
    if (!e.target.files[0]) return;
    const maxSizeInBytes = 1024 * 1024 * 1;
    if (e.target.files[0].size > maxSizeInBytes) {
      setError("Image size should be less than 1MB");
      return;
    }
    setImage(e.target.files[0]);
    setName(e.target.files[0].name);
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

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsDataURL(file);
    });
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    if (!image) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (typeof image === "string") {
      setCurrentFieldType(null);
      setCurrentField(null);
      return;
    }
    let imageB64 = await handleFileToBase64(image);
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        image: {
          url: imageB64,
          name: name,
          mimiType: image.type,
        },
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md">
      <div className="w-full h-fit flex justify-center items-center flex-col p-1 gap-2">
        {error && (
          <span className="text-[var(--btn-delete)] text-xs font-bold">
            {error}
          </span>
        )}
        {image && (
          <div className="w-full h-fit relative flex justify-center items-center overflow-hidden">
            <img
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt="preview"
              className="w-full rounded-md object-contain"
            />
          </div>
        )}
        <div className="w-full h-16 relative">
          <input
            className="w-full h-full opacity-0 cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pointer-events-none">
            <button className="w-full h-full flex justify-center items-center border-2 border-dashed  border-[var(--border-primary)] rounded-md text-[var(--text-primary)] text-xs font-bold">
              <span className="w-6 h-6 mr-1 flex justify-center items-center">
                <ImageIcon />
              </span>
              <span className="text-[var(--text-primary)] text-sm">
                {image ? "Change Image" : "Select Image"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </div>
  );
};

const FileSelector = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();
  const [file, setFile] = useState(currentField?.data?.file?.url ?? null);
  const [name, setName] = useState(currentField?.data?.file?.name ?? null);
  const [error, setError] = useState(null);
  const handleFileChange = (e) => {
    setError(null);
    if (!e.target.files[0]) return;
    const maxSizeInBytes = 1024 * 1024 * 5;
    if (e.target.files[0].size > maxSizeInBytes) {
      setError("File size should be less than 5MB");
      return;
    }
    setFile(e.target.files[0]);
    setName(e.target.files[0].name);
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

  const handleFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.readAsDataURL(file);
    });
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    if (!file) return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let fileB64;

    if (typeof file === "string") {
      fileB64 = file;
    } else {
      fileB64 = await handleFileToBase64(file);
    }

    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        file: {
          url: fileB64,
          name: name,
          mimiType: file?.type ?? currentField?.data?.file?.mimiType ?? null,
        },
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md">
      <div className="w-full h-fit flex justify-center items-center flex-col p-1 gap-2">
        <input
          type="text"
          placeholder="File Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-fit bg-[var(--bg-secondary)] p-1 text-[var(--text-primary)] text-sm outline-none transition-colors duration-300 cursor-pointer resize-none"
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
        {error && (
          <span className="text-[var(--btn-delete)] text-xs font-bold">
            {error}
          </span>
        )}
        <div className="w-full h-16 relative">
          <input
            className="w-full h-full opacity-0 cursor-pointer"
            type="file"
            accept="*"
            onChange={handleFileChange}
          />
          <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center pointer-events-none">
            <button className="w-full h-full flex justify-center items-center border-2 border-dashed  border-[var(--border-primary)] rounded-md text-[var(--text-primary)] text-xs font-bold">
              <span className="w-5 h-5 mr-2 flex justify-center items-center">
                <FileIcon />
              </span>
              <span className="text-[var(--text-primary)] text-sm">
                {file ? "Change File" : "Select File"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </div>
  );
};

const FileView = ({
  field,
  i,
  node,
  setNode,
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleEditField,
}) => {
  const handleDownload = () => {
    const base64Data = field?.data?.file?.url;
    const [, mimeType, base64String] = base64Data.match(
      /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/
    );

    // Convert the base64 string to a Uint8Array
    const binaryData = atob(base64String);
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: mimeType });

    // Create a File from the Blob
    const file = new File(
      [blob],
      field?.data?.file?.name + "." + mimeType.split("/")[1],
      { type: mimeType }
    );

    // You can now use the 'file' variable as a File object
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(file);
    link.download = field?.data?.file?.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
      onDoubleClick={() => handleEditField(field, i)}
    >
      <div className="w-full flex justify-center items-center overflow-x-hidden gap-1 pr-1">
        <span
          href={field?.data?.file?.url}
          target="_blank"
          rel="noreferrer"
          className="w-full flex gap-1 text-[var(--text-primary)] bg-transparent outline-none hover:underline break-all"
          style={{
            fontSize: `${field?.config?.fontSize}px`,
            textDecoration: `${
              field?.config?.strickthrough ? "line-through" : "none"
            }`,
            fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
            fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
            fontFamily: `${field?.config?.fontFamily}`,
            color: `${field?.config?.color}`,
            textAlign: `${field?.config?.align}`,
          }}
        >
          <span
            style={{
              color: `${field?.config?.color}`,
            }}
            className="w-4 h-4 shrink-0 ml-1 mr-1 block"
          >
            <FileIcon />
          </span>
          <span
            className=" shrink-0 w-4 h-4 p-0 flex justify-center items-center bg-[var(--bg-secondary)] rounded-sm hover:bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={handleDownload}
          >
            <DownloadIcon />
          </span>
          {field?.data?.file?.name}
        </span>
      </div>
    </div>
  );
};

const Table = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();

  const handleChange = (e, i, j) => {
    let table = [...currentField.data.table];
    table[i].data[j].text = e.target.value;
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        table: table,
      },
    });
  };

  const handleAddRow = () => {
    let table = [...currentField.data.table];
    let row = [];
    for (let i = 0; i < table[0].data.length; i++) {
      row.push({ text: "" });
    }
    table.push({ data: row });
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        table: table,
      },
    });
  };

  const handleAddColumn = () => {
    let table = [...currentField.data.table];
    table.forEach((row) => {
      row.data.push({ text: "" });
    });
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        table: table,
      },
    });
  };

  const handleDeleteRow = (i) => {
    let table = [...currentField.data.table];
    table.splice(i, 1);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        table: table,
      },
    });
  };

  const handleDeleteColumn = (i) => {
    let table = [...currentField.data.table];
    table.forEach((row) => {
      row.data.splice(i, 1);
    });
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        table: table,
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
    let finalField = {
      ...currentField,
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md">
      <div className="w-full h-fit flex justify-center items-center flex-col p-1 gap-2">
        <table className="w-full h-fit">
          <tbody>
            {currentField.data?.table?.map((row, i) => (
              <tr key={`table-row-${i}`}>
                {row?.data?.map((cell, j) => (
                  <td
                    key={`table-cell-${i}-${j}`}
                    className="p-1"
                    style={{
                      borderWidth: `${currentField?.config?.borderWidth}px`,
                      borderColor: `${currentField?.config?.borderColor}`,
                      borderStyle: `${currentField?.config?.borderStyle}`,
                    }}
                  >
                    <input
                      className="w-full h-full bg-transparent outline-none"
                      style={{
                        fontSize: `${currentField?.config?.fontSize}px`,
                        textDecoration: `${
                          currentField?.config?.strickthrough
                            ? "line-through"
                            : "none"
                        }`,
                        fontStyle: `${
                          currentField?.config?.italic ? "italic" : "normal"
                        }`,
                        fontWeight: `${
                          currentField?.config?.bold ? "bold" : "normal"
                        }`,
                        fontFamily: `${currentField?.config?.fontFamily}`,
                        color: `${currentField?.config?.color}`,
                        textAlign: `${currentField?.config?.align}`,
                      }}
                      value={cell?.text}
                      onChange={(e) => handleChange(e, i, j)}
                      placeholder="Enter Text..."
                    />
                  </td>
                ))}
                <td
                  style={{
                    borderWidth: `${currentField?.config?.borderWidth}px`,
                    borderColor: `${currentField?.config?.borderColor}`,
                    borderStyle: `${currentField?.config?.borderStyle}`,
                  }}
                >
                  <button
                    onClick={() => handleDeleteRow(i)}
                    className="w-full h-full flex justify-center items-center hover:bg-[var(--btn-delete)] transition-colors duration-300 cursor-pointer"
                  >
                    <span
                      style={{
                        color: `${currentField?.config?.color}`,
                      }}
                      className="w-4 h-4 flex justify-center items-center"
                    >
                      <DeleteIcon />
                    </span>
                  </button>
                </td>
              </tr>
            ))}
            <tr className="w-full h-7">
              {currentField.data?.table[0]?.data?.map((cell, i) => (
                <td
                  key={`table-cell-${i}`}
                  className="h-full"
                  style={{
                    borderWidth: `${currentField?.config?.borderWidth}px`,
                    borderColor: `${currentField?.config?.borderColor}`,
                    borderStyle: `${currentField?.config?.borderStyle}`,
                  }}
                >
                  <button
                    onClick={() => handleDeleteColumn(i)}
                    className="w-full h-full flex justify-center items-center hover:bg-[var(--btn-delete)] transition-colors duration-300 cursor-pointer"
                  >
                    <span
                      style={{
                        color: `${currentField?.config?.color}`,
                      }}
                      className="w-4 h-4 mr-1  flex justify-center items-center"
                    >
                      <DeleteIcon />
                    </span>
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="w-full h-7 flex justify-center items-center gap-2 bg-[var(--bg-secondary)] p-1 rounded-md">
          <div className="relative">
            <select
              title="Border Style"
              className="w-20 group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
              value={currentField?.config?.borderStyle}
              onChange={(e) => {
                setCurrentField({
                  ...currentField,
                  config: {
                    ...currentField.config,
                    borderStyle: e.target.value,
                  },
                });
              }}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          <input
            title="Border Width"
            className="w-7 h-7 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
            type="number"
            min="0"
            max="10"
            value={currentField?.config?.borderWidth}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                config: {
                  ...currentField.config,
                  borderWidth: e.target.value,
                },
              });
            }}
          />
          <div className="w-7 h-7 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center outline-none relative">
            <input
              className="w-full h-full opacity-0 bg-transparent outline-none cursor-pointer"
              type="color"
              title="Border Color"
              value={currentField?.config?.borderColor}
              onChange={(e) => {
                setCurrentField({
                  ...currentField,
                  config: {
                    ...currentField.config,
                    borderColor: e.target.value,
                  },
                });
              }}
            />
            <span className="pointer-events-none absolute  top-0 left-0 w-full h-full p-[6px]">
              <ColorIcon />
            </span>
            <span
              style={{
                backgroundColor: `${currentField?.config?.borderColor}`,
              }}
              className="-top-1 -right-1 absolute w-3 h-3 rounded-full"
            ></span>
          </div>
          <button
            className="w-fit h-7 px-2 rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={handleAddRow}
          >
            <span
              style={{
                color: `${currentField?.config?.color}`,
              }}
              className="w-3 h-3 mr-1  flex justify-center items-center"
            >
              <AddIcon />
            </span>
            <span className="text-[var(--text-primary)] text-xs font-bold">
              Row
            </span>
          </button>
          <button
            className="w-fit h-7 px-2 rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={handleAddColumn}
          >
            <span
              style={{
                color: `${currentField?.config?.color}`,
              }}
              className="w-3 h-3 mr-1  flex justify-center items-center"
            >
              <AddIcon />
            </span>
            <span className="text-[var(--text-primary)] text-xs font-bold">
              Column
            </span>
          </button>
        </div>
      </div>
      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
      />
    </div>
  );
};

const TableView = ({ field, i, currentField, handleEditField }) => {
  return (
    <div
      style={{
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
      onDoubleClick={() => handleEditField(field, i)}
    >
      <table className="w-full h-fit">
        <tbody>
          {field.data?.table?.map((row, i) => (
            <tr key={`table-row-${i}`}>
              {row?.data?.map((cell, j) => (
                <td
                  key={`table-cell-${i}-${j}`}
                  className="p-1"
                  style={{
                    borderWidth: `${field?.config?.borderWidth}px`,
                    borderColor: `${field?.config?.borderColor}`,
                    borderStyle: `${field?.config?.borderStyle}`,
                  }}
                >
                  <span
                    style={{
                      color: `${field?.config?.color}`,
                    }}
                    className="w-full h-full block"
                  >
                    {cell?.text}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Separator = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();

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
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
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
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md py-2 px-1">
      <span
        className="w-full h-0 rounded-full block"
        style={{
          borderWidth: `${currentField?.config?.borderWidth}px`,
          borderColor: `${currentField?.config?.borderColor}`,
          borderStyle: `${currentField?.config?.borderStyle}`,
        }}
      ></span>
      <div className="w-full h-7 flex justify-center items-center gap-2 flex-wrap mt-2">
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentFieldType(null);
            setCurrentField(null);
          }}
        >
          Cancel
        </button>
        <select
          title="Border Style"
          className="w-20 group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          value={currentField?.config?.borderStyle}
          onChange={(e) => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                borderStyle: e.target.value,
              },
            });
          }}
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
        <input
          title="Border Width"
          className="w-7 h-7 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          type="number"
          min="0"
          max="10"
          value={currentField?.config?.borderWidth}
          onChange={(e) => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                borderWidth: e.target.value,
              },
            });
          }}
        />
        <div className="w-7 h-7 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center outline-none relative">
          <input
            className="w-full h-full opacity-0 bg-transparent outline-none cursor-pointer"
            type="color"
            title="Border Color"
            value={currentField?.config?.borderColor}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                config: {
                  ...currentField.config,
                  borderColor: e.target.value,
                },
              });
            }}
          />
          <span className="pointer-events-none absolute  top-0 left-0 w-full h-full p-[6px]">
            <ColorIcon />
          </span>
          <span
            style={{
              backgroundColor: `${currentField?.config?.borderColor}`,
            }}
            className="-top-1 -right-1 absolute w-3 h-3 rounded-full"
          ></span>
        </div>
        {currentField?.id && (
          <button
            className="w-8 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={() => handleDelete(currentField?.index)}
          >
            <span className="">
              <DeleteIcon />
            </span>
          </button>
        )}
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={(e) => handleSave(e, currentField?.index)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

const TimeStamp = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();
  const formats = [
    {
      type: "Date Only",
      input: { day: "2-digit", month: "2-digit", year: "numeric" },
    },
    {
      type: "Time Only (12-Hour)",
      input: { hour: "2-digit", minute: "2-digit", hour12: true },
    },
    {
      type: "Time Only (24-Hour)",
      input: { hour: "2-digit", minute: "2-digit", hour12: false },
    },

    {
      type: "Date and Time (12-Hour)",
      input: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Date and Time (24-Hour)",
      input: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
    {
      type: "Weekday and Time (12-Hour)",
      input: {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Weekday and Time (24-Hour)",
      input: {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
    {
      type: "Month and Year",
      input: { year: "numeric", month: "long" },
    },
    {
      type: "Day of the Week, Month, Day, and Year",
      input: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    },
    {
      type: "Day of the Week, Date, and Time (12-Hour)",
      input: {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    },
    {
      type: "Day of the Week, Date, and Time (24-Hour)",
      input: {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
    },
  ];

  const handleGetFormatedDateTime = () => {
    let date = new Date(currentField?.data?.timestamp?.iso);
    if (!currentField?.data?.timestamp?.format?.input)
      return date.toLocaleString();
    const string = new Intl.DateTimeFormat(
      "en-IN",
      currentField?.data?.timestamp?.format?.input
    ).format(date);
    return string;
  };

  const handleGetDateTime = () => {
    let iso = currentField?.data?.timestamp?.iso;
    if (!iso) return "";
    let utcDate = new Date(iso);
    let finalIso = `${utcDate.getFullYear()}-${(utcDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${utcDate
      .getDate()
      .toString()
      .padStart(2, "0")}T${utcDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${utcDate.getMinutes().toString().padStart(2, "0")}`;
    return finalIso;
  };

  const handleSetDateTime = (e) => {
    let time = e.target.value;
    let newDate = new Date(time);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        timestamp: {
          ...currentField.data.timestamp,
          iso: newDate.toISOString(),
        },
      },
    });
  };

  const handleSelectChange = (e) => {
    let type = e.target.value;
    let format = formats.find((format) => format.type === type);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        timestamp: {
          ...currentField.data.timestamp,
          format: format,
        },
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
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        timestamp: {
          ...currentField.data.timestamp,
          string: handleGetFormatedDateTime(),
        },
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  return (
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md">
      <div className="w-full h-fit flex justify-center items-center flex-col p-1 gap-2">
        <div className="w-full h-7 flex justify-center items-center gap-2 flex-wrap">
          <span
            className="w-full"
            style={{
              fontSize: `${currentField?.config?.fontSize}px`,
              textDecoration: `${
                currentField?.config?.strickthrough ? "line-through" : "none"
              }`,
              fontStyle: `${
                currentField?.config?.italic ? "italic" : "normal"
              }`,
              fontWeight: `${currentField?.config?.bold ? "bold" : "normal"}`,
              fontFamily: `${currentField?.config?.fontFamily}`,
              color: `${currentField?.config?.color}`,
              textAlign: `${currentField?.config?.align}`,
            }}
          >
            {handleGetFormatedDateTime()}
          </span>
        </div>
        <div className="w-full h-fit flex justify-center items-center gap-2 flex-wrap">
          <div className="w-fit h-fit relative">
            <input
              type="datetime-local"
              className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
              value={handleGetDateTime()}
              onChange={handleSetDateTime}
            />
          </div>
          <select
            title="Date Format"
            className="w-40 group h-8 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
            value={currentField?.data?.timestamp?.format?.type}
            onChange={handleSelectChange}
          >
            {formats.map((format) => (
              <option key={format.type} value={format.type}>
                {format.type}
              </option>
            ))}
          </select>
        </div>
        <InputTitleButtons
          handleSave={handleSave}
          config={currentField?.config}
          currentField={currentField}
          setCurrentField={setCurrentField}
          setCurrentFieldType={setCurrentFieldType}
          type={currentField.type}
          handleGetDefaultConfig={handleGetDefaultConfig}
        />
      </div>
    </div>
  );
};

const CodeBlock = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
  handleResetShowAdd,
}) => {
  const { db, currentFlowPlan, setCurrentFlowPlan, currentFlowPlanNode } =
    useStateContext();
  const { copyToClipboard } = useFunctions();
  const allThemes = Object.keys(Themes);
  const allLanguages = Object.keys(Languages);
  const [theme, setTheme] = useState(
    currentField?.data?.code?.theme ?? "dracula"
  );
  const [language, setLanguage] = useState(
    currentField?.data?.code?.language ?? "javascript"
  );
  const textareaRef = useRef(null);
  const handleParaChange = (e) => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          string: e.target.value,
        },
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

  const handleChangeLanguageSelect = (e) => {
    let language = e.target.value;
    setLanguage(language);
  };

  const handleChangeThemeSelect = (e) => {
    let theme = e.target.value;
    setTheme(theme);
  };

  const handleLineNumbers = () => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          lineNumbers: !currentField?.data?.code?.lineNumbers,
        },
      },
    });
  };

  const handleWrapLines = () => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          wrapLines: !currentField?.data?.code?.wrapLines,
        },
      },
    });
  };

  const handleHideTop = () => {
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          hideTop: !currentField?.data?.code?.hideTop,
        },
      },
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

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    if (currentField?.data?.code?.string === "") return;
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        code: {
          ...currentField.data.code,
          language: language,
          theme: theme,
        },
      },
    };

    if (index !== null) {
      node.data[index] = finalField;
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, {
        ...finalField,
        id: v4(),
      });
      handleResetShowAdd();
    } else {
      node.data.push({ ...finalField, id: v4() });
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
    setCurrentFieldType(null);
    setCurrentField(null);
  };

  useEffect(() => {
    handleTextareaChange();
  }, [currentField?.data?.code?.string]);

  return (
    <div className="w-full h-fit flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md p-1">
      {!currentField?.data?.code?.hideTop && (
        <div className="w-full h-fit text-xs text-[var(--text-primary)] flex justify-between items-center gap-2 flex-wrap py-1 px-2 bg-[var(--bg-tertiary)] rounded-t-md">
          <span>{language ?? "javascript"}</span>
          <button
            onClick={() => copyToClipboard(currentField?.data?.code?.string)}
            className="w-6 h-6 p-1 flex justify-center items-center hover:bg-[var(--bg-secondary)] rounded-md bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            title="Copy Code"
          >
            <span className="w-full h-full flex justify-center items-center">
              <CopyIcon />
            </span>
          </button>
        </div>
      )}
      <SyntaxHighlighter
        customStyle={{
          width: "100%",
          margin: "0px",
          padding: "3px",
          borderRadius: currentField?.data?.code?.hideTop
            ? "5px"
            : "0px 0px 5px 5px",
        }}
        className="small-scroll-bar"
        showLineNumbers={currentField?.data?.code?.lineNumbers ?? false}
        showInlineLineNumbers={currentField?.data?.code?.lineNumbers ?? false}
        wrapLines={true}
        wrapLongLines={true}
        language={language}
        style={Themes[theme] ?? Themes["dracula"]}
      >
        {currentField?.data?.code?.string !== ""
          ? currentField?.data?.code?.string
          : "// Example\nconsole.log('Hello World')"}
      </SyntaxHighlighter>
      <textarea
        type="text"
        autoFocus={true}
        placeholder="Enter Code..."
        value={currentField?.data?.code?.string ?? ""}
        onChange={handleParaChange}
        required
        className="mt-2 w-full h-fit bg-[var(--bg-secondary)] p-1 text-[var(--text-primary)] text-sm outline-none transition-colors duration-300 cursor-pointer resize-none border-2 border-[var(--border-primary)] rounded-md small-scroll-bar whitespace-nowrap"
        ref={textareaRef}
      />
      <div className="w-full flex justify-center items-center gap-2 flex-wrap mt-2">
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentFieldType(null);
            setCurrentField(null);
          }}
        >
          Cancel
        </button>
        <select
          title="Code Block Languages"
          className="w-20 group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          value={language}
          onChange={handleChangeLanguageSelect}
        >
          {allLanguages?.map((language) => (
            <option key={`code-language-${language}`} value={language}>
              {language}
            </option>
          ))}
        </select>
        <button
          onClick={handleWrapLines}
          className="relative w-8 h-8 px-[4px] text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          title="Wrap Lines"
        >
          <span className="">
            <LinewrapIcon />
          </span>
          {!currentField?.data?.code?.wrapLines && (
            <span className="absolute w-8 h-[2px] rounded-full bg-[var(--logo-primary)] -rotate-45"></span>
          )}
        </button>
        <select
          title="Code Block Themes"
          className="w-20 group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          value={theme}
          onChange={handleChangeThemeSelect}
        >
          {allThemes?.map((theme) => (
            <option key={`code-theme-${theme}`} value={theme}>
              {theme}
            </option>
          ))}
        </select>
        <button
          onClick={handleLineNumbers}
          title="Line Numbers"
          className="relative w-8 h-8 px-[6px] text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
        >
          <span className="">
            <NumberListIcon />
          </span>
          {!currentField?.data?.code?.lineNumbers && (
            <span className="absolute w-8 h-[2px] rounded-full bg-[var(--logo-primary)] -rotate-45"></span>
          )}
        </button>
        <button
          title="Toggle Topbar"
          className="w-8 h-8 px-1 relative text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={handleHideTop}
        >
          <span className="">
            <TopbarIcon />
          </span>
          {currentField?.data?.code?.hideTop && (
            <span className="absolute w-8 h-[2px] rounded-full bg-[var(--logo-primary)] -rotate-45"></span>
          )}
        </button>

        {currentField?.id && (
          <button
            className="w-8 h-8 px-2 text-xs rounded-md flex justify-between items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
            onClick={() => handleDelete(currentField?.index)}
          >
            <span className="">
              <DeleteIcon />
            </span>
          </button>
        )}
        <button
          className="w-14 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={(e) => handleSave(e, currentField?.index)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DisplayDocView;
