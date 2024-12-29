import { useStateContext } from "../../../../context/StateContext.jsx";
import { v4 } from "uuid";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import ColorIcon from "../../../../assets/Icons/ColorIcon.jsx";
import AddIcon from "../../../../assets/Icons/AddIcon.jsx";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";
import React from "react";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const Table = ({
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
    setCurrentFieldType(null);
    setCurrentField(null);
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
