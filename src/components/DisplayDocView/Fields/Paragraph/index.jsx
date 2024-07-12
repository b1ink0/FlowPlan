import React, { useEffect, useRef } from "react";
import { useStateContext } from "../../../../context/StateContext.jsx";
import { v4 } from "uuid";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const Paragraph = ({
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

  const { handleUpdateIndexDB } = useDatabase();

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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
