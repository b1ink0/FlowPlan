import { useStateContext } from "../../../../context/StateContext.jsx";
import { v4 } from "uuid";
import React, { useEffect, useState } from "react";
import { DurationGraphView } from "../../Helpers/DurationGraphView/index.jsx";
import BackIcon from "../../../../assets/Icons/BackIcon.jsx";
import PreviewIcon from "../../../../assets/Icons/PreviewIcon.jsx";
import GraphIcon from "../../../../assets/Icons/GraphIcon.jsx";
import OverlapIcon from "../../../../assets/Icons/OverlapIcon.jsx";
import ColorIcon from "../../../../assets/Icons/ColorIcon.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const DurationTimeline = ({
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
    startOfWeek.setSeconds(0);
    startOfWeek.setMilliseconds(0);
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
        const weekKey = `${Math.ceil(
          (current.getDate() + 6 - current.getDay()) / 7
        )}`;
        if (!weeks[weekKey]) {
          weeks[weekKey] = 0;
        }
        const dayKey = current.toISOString().split("T")[0];
        if (new Date(dayKey).getDay() === 6) {
          // if saturday
          if (!weeks[weekKey - 1]) {
            weeks[weekKey] += dayDurations[dayKey] || 0;
          }
          weeks[weekKey - 1] += dayDurations[dayKey] || 0;
        } else {
          weeks[weekKey] += dayDurations[dayKey] || 0;
        }
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

  const { handleUpdateIndexDB } = useDatabase();

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
      },
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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
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
              <DurationGraphView
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
