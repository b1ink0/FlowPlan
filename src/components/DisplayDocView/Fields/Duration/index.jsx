import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import PreviewIcon from "../../../../assets/Icons/PreviewIcon.jsx";
import ColorIcon from "../../../../assets/Icons/ColorIcon.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";

export const Duration = ({
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
