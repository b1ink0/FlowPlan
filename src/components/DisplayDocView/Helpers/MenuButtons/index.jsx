import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useState } from "react";
import TextIcon from "../../../../assets/Icons/TextIcon.jsx";
import ParagraphIcon from "../../../../assets/Icons/ParagraphIcon.jsx";
import ListIcon from "../../../../assets/Icons/ListIcon.jsx";
import TodoListIcon from "../../../../assets/Icons/TodoListIcon.jsx";
import NumberListIcon from "../../../../assets/Icons/NumberListIcon.jsx";
import LinkIcon from "../../../../assets/Icons/LinkIcon.jsx";
import ImageIcon from "../../../../assets/Icons/ImageIcon.jsx";
import FileIcon from "../../../../assets/Icons/FileIcon.jsx";
import TableIcon from "../../../../assets/Icons/TableIcon.jsx";
import SeparatorIcon from "../../../../assets/Icons/SeparatorIcon.jsx";
import TopbarIcon from "../../../../assets/Icons/TopbarIcon.jsx";
import TimeStampIcon from "../../../../assets/Icons/TimeStampIcon.jsx";
import DurationIcon from "../../../../assets/Icons/DurationIcon.jsx";
import DurationTimelineIcon from "../../../../assets/Icons/DurationTimelineIcon.jsx";
import CodeIcon from "../../../../assets/Icons/CodeIcon.jsx";
import { v4 } from "uuid";
import { Button } from "../Button/index.jsx";
import PasteIcon from "../../../../assets/Icons/PasteIcon.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const MenuButtons = ({
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

  const { handleUpdateIndexDB } = useDatabase();

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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
