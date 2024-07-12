import { useStateContext } from "../../../../context/StateContext.jsx";
import { v4 } from "uuid";
import ColorIcon from "../../../../assets/Icons/ColorIcon.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import React from "react";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const Separator = ({
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

    const { handleUpdateIndexDB } = useDatabase();

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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
