import { useStateContext } from "../../../context/StateContext.jsx";
import { useFunctions } from "../../../hooks/useFunctions/index.jsx";
import React, { useEffect, useState } from "react";
import DotIcon from "../../../assets/Icons/DotIcon.jsx";
import BorderDot from "../../../assets/Icons/BorderDot.jsx";
import SquareDot from "../../../assets/Icons/SquareDot.jsx";
import DiamondDot from "../../../assets/Icons/DiamondDot.jsx";
import StarDot from "../../../assets/Icons/StarDot.jsx";
import ArrowDot from "../../../assets/Icons/ArrowDot.jsx";
import { v4 } from "uuid";
import { TaskListView } from "../FieldViews/TaskListView/index.jsx";
import LinkIcon from "../../../assets/Icons/LinkIcon.jsx";
import { LinkView } from "../FieldViews/LinkView/index.jsx";
import { FileView } from "../FieldViews/FileView/index.jsx";
import { TableView } from "../Fields/TableView/index.jsx";
import CopyIcon from "../../../assets/Icons/CopyIcon.jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as Themes from "react-syntax-highlighter/dist/cjs/styles/prism/index.js";
import { ProgressBar } from "../Helpers/ProgressBar/index.jsx";
import { DurationView } from "../FieldViews/DurationView/index.jsx";
import { DurationEndView } from "../FieldViews/DurationEndView/index.jsx";
import { DurationTimelineView } from "../FieldViews/DurationTimelineView/index.jsx";
import EditBtnIcon from "../../../assets/Icons/EditBtnIcon.jsx";
import AddIcon from "../../../assets/Icons/AddIcon.jsx";
import MoveIcon from "../../../assets/Icons/MoveIcon.jsx";
import EditIcon from "../../../assets/Icons/EditIcon.jsx";
import PasteIcon from "../../../assets/Icons/PasteIcon.jsx";
import DuplicateIcon from "../../../assets/Icons/DublicateIcon.jsx";
import CopyStyleIcon from "../../../assets/Icons/CopyStyleIcon.jsx";
import PasteStyleIcon from "../../../assets/Icons/PasteStyleIcon.jsx";
import DeleteIcon from "../../../assets/Icons/DeleteIcon.jsx";
import BackIcon from "../../../assets/Icons/BackIcon.jsx";
import CloseBtnIcon from "../../../assets/Icons/CloseBtnIcon.jsx";
import { AddEditField } from "../Helpers/AddEditField/index.jsx";
import { MenuButtons } from "../Helpers/MenuButtons/index.jsx";

export const DocRenderView = ({
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
    currentFlowPlanNode,
    fieldStyles,
    setFieldStyles,
    copyField,
    setCopyField,
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
    setShowAdd(() => {
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
  const handleDuplicateField = async (i, duplicateContainingFields = false) => {
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
    console.log(newField);
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
        <TaskListView
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
            <LinkView
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
        <DurationView
          onDoubleClick={() => handleEditField(field, i)}
          currentField={currentField}
          field={field}
        />
      )}
      {field.type === "durationEnd" && (
        <DurationEndView
          node={node}
          field={field}
          currentField={currentField}
        />
      )}
      {field.type === "durationTimeline" && (
        <DurationTimelineView
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
                  onClick={() => handleDuplicateField(i)}
                  className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                  title="Duplicate Field"
                >
                  <DuplicateIcon />
                </button>
                {field.type === "duration" && (
                  <button
                    onClick={() => handleDuplicateField(i, true)}
                    className="w-6 h-6 bg-[var(--bg-tertiary)] p-1 rounded-md shrink-0"
                    title="Duplicate Duration and its containing fields"
                  >
                    <DuplicateIcon />
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
