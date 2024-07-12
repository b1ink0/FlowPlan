import { useStateContext } from "../../../../context/StateContext.jsx";
import { v4 } from "uuid";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";
import React from "react";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const TimeStamp = ({
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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
