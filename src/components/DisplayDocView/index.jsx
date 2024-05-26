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
      <div className="absolute flex justify-between items-center top-0 z-10 w-full h-[35px] bg-[var(--border-primary)] px-2">
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
      <div
      style={{
        height: `calc(100% - ${showNodeNavigation ? "78px" : "35px"})`
      }}
      className="mt-[35px] w-full flex flex-col justify-start items-center">
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
  setActive
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
  } = useStateContext();
  const { copyToClipboard } = useFunctions();

  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
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
  const handleDublicateField = async () => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let temp = structuredClone(node.data[i]);
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
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };
  const handleDeleteField = async () => {
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
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

  const handleCopyField = () => {
    let newField = structuredClone(field);
    setCopyField(newField);
  };

  const handlePasteField = async () => {
    if (!copyField) return;
    console.log(copyField);
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
    console.log(newField);
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    node.data.splice(i + 1, 0, newField);
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateIndexDB(currentFlowPlan.refId, root);
  };

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
                  className="w-5 h-5 mr-1 block shrink-0 cursor-pointer group"
                >
                  {item?.completed ? <CheckedIcon /> : <UncheckedIcon />}
                </span>
                {item?.text}
              </span>
            </div>
          ))}
        </div>
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
      {currentField?.id !== field?.id && showAdd.index !== i && !move.move && (
        <span
          style={{
            opacity: showMenu ? 1 : 0,
            pointerEvents: showMenu ? "all" : "none",
            top: field.type === "codeBlock" ? "40px" : "4px",
            height: showSubMenu ? "55px" : "",
            width: showSubMenu ? "165px" : "",
          }}
          onMouseLeave={() => setShowSubMenu(false)}
          className="transition-opacity absolute flex justify-end items-start gap-1 w-fit h-6 right-1 top-1 z-10"
        >
          <DragHandle ac setActive={setActive} className="w-6 h-6 shrink-0 bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center" />

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
              <div className="w-full h-full gap-1 absolute right-[140px] top-7 flex">
                <button
                  onClick={handleCopyField}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Copy Field"
                >
                  <CopyIcon />
                </button>

                <button
                  onClick={handlePasteField}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0 "
                  title="Paste Field Below"
                >
                  <PasteIcon />
                </button>
                <button
                  onClick={handleDublicateField}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Duplicate Field"
                >
                  <DublicateIcon />
                </button>

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
                  onClick={handleDeleteField}
                  className="w-6 h-6 hover:bg-[var(--btn-delete)]  bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Delete Field"
                >
                  <DeleteIcon />
                </button>
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
    console.log(copyField);
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
    console.log(newField);
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    if (currentFieldIndex !== null) {
      node.data.splice(currentFieldIndex + 1, 0, newField);
    } else {
      node.data.push(newField);
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
              !linkPreviewLoading && (
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
      {currentField?.id && (
        <>
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
        </>
      )}

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
        show: prev[key].show ? false : true,
      },
    }));
  };
  return (
    <div className="absolute px-2 py-1 rounded-md left-0 top-9 w-fit flex flex-col gap-2 bg-[var(--btn-secondary)] z-10">
      {previewFields.map((item) => (
        <div
          key={`preview-id-${item.type}`}
          className="w-full flex gap-1 justify-start items-center "
        >
          <span
            className="w-4 h-4 mr-1 block cursor-pointer"
            onClick={() => handleSetPreviewLink(item.type)}
          >
            {linkPreview[item.type]?.show ? <CheckedIcon /> : <UncheckedIcon />}
          </span>
          <label className="text-xs text-[var(--text-primary)]">
            {item.text}
          </label>
        </div>
      ))}
    </div>
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
        renderItem={(item, active, index) => (
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
  const [item, setItem] = useState({
    text: "",
    completed: false,
  });

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

  const handleCompleteToggle = (e, index = null) => {
    console.log(index);
    if (index !== null) {
      let newList = [...list];
      newList[index] = {
        ...newList[index],
        completed: !newList[index].completed,
      };
      setList(newList);
    } else {
      setItem((prev) => ({ ...prev, completed: !prev.completed }));
    }
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
        renderItem={(item, active, index) => (
          <SortableList.Item id={item?.id}>
            <div
              key={`tasklist-item-${item?.id}`}
              className="group w-full flex justify-center items-center text-sm relative"
            >
              <span
                style={{
                  color: `${currentField?.config?.color}`,
                }}
                className="w-5 h-5 mr-1 block cursor-pointer"
                onClick={(e) => handleCompleteToggle(e, index)}
              >
                {item.completed ? <CheckedIcon /> : <UncheckedIcon />}
              </span>
              <input
                required
                type="text"
                placeholder="Enter List Item..."
                value={item?.text}
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
          className="w-5 h-5 mr-1 block cursor-pointer"
          onClick={handleCompleteToggle}
        >
          {item.completed ? <CheckedIcon /> : <UncheckedIcon />}
        </span>
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
        renderItem={(item, active, index) => (
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
                show:
                  currentField?.data?.previewLink?.previewImages?.value[i]
                    ?.show ?? true,
              })),
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
    if (src === "") return "";
    if (src.startsWith("data:image")) return src;
    if (src.match(/^(ftp|http|https):\/\/[^ "]+$/)) return src;
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
      console.log(tempPreview);
      setPreview(tempPreview);
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
    if (src.startsWith("data:image")) return src;
    if (src.match(/^(ftp|http|https):\/\/[^ "]+$/)) return src;
    let domain = link.split("/")[2];
    return "https://" + domain + src;
  };

  useEffect(() => {
    handlePreview();
  }, [link, previewLink]);

  return (
    <div className="w-full h-fit flex justify-center items-center flex-col">
      {loading ? (
        <>
          {previewLink?.favicon && (
            <div className="w-full flex justify-start items-center gap-1 ">
              {previewLink?.favicon?.show && (
                <img
                  src={handleFaviconSrc(previewLink.favicon?.value, link)}
                  alt="favicon"
                  className="w-5 h-5 rounded-full"
                />
              )}
              {previewLink?.siteName?.show && (
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {previewLink.siteName?.value}
                </span>
              )}
            </div>
          )}
          {previewLink?.title?.show && (
            <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
              {previewLink.title?.value}
            </h1>
          )}
          {previewLink?.description?.show && (
            <p className="w-full text-[var(--text-primary)] text-xs text-start">
              {previewLink.description?.value}
            </p>
          )}
          {previewLink?.previewImages?.show &&
            previewLink?.previewImages?.value?.length > 0 &&
            previewLink.previewImages?.value.map((image, i) =>
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
              {previewLink?.favicon?.show && (
                <img
                  src={handleFaviconSrc(preview?.favicon?.value, link)}
                  alt="favicon"
                  className="w-5 h-5 rounded-full"
                />
              )}
              {previewLink?.siteName?.show && (
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {preview?.siteName?.value}
                </span>
              )}
            </div>
          )}
          {previewLink?.title?.show && (
            <h1 className="w-full text-[var(--text-primary)]  text-sm font-medium">
              {preview?.title?.value}
            </h1>
          )}
          {previewLink?.description?.show && (
            <p className="w-full text-[var(--text-primary)] text-xs text-start">
              {preview?.description?.value}
            </p>
          )}
          {previewLink?.previewImages?.show &&
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
              className="w-[170px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
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
