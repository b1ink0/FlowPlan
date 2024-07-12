import { useStateContext } from "../../../../context/StateContext.jsx";
import { v4 } from "uuid";
import { InputTitleButtons } from "../InputTitleButtons/index.jsx";
import React from "react";

export const InputTitle = ({
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
