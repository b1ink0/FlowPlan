import React, { useEffect, useState } from "react";
import { DurationGraphView } from "../../Helpers/DurationGraphView/index.jsx";

export const DurationTimelineView = ({
  i,
  node,
  field,
  currentField,
  onDoubleClick,
  currentFlowPlan,
}) => {
  const [formated, setFormated] = useState({
    start: null,
    end: null,
    current: null,
    currentISO: null,
    startISO: null,
    endISO: null,
    duration: null,
    durations: [],
    displayType: null,
    displayDuration: [],
  });

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
    console.log(type, durations);
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
    console.log(overlap);
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

  const handleGetFormatedDateTime = (iso) => {
    if (!iso) return "";
    if (iso === null) return "";
    let date = new Date(iso);
    console.log(iso, field?.data?.durationTimeline?.format?.input);
    if (!field?.data?.durationTimeline?.format?.input)
      return date.toLocaleString();
    const string = new Intl.DateTimeFormat(
      "en-IN",
      field?.data?.durationTimeline?.format?.input
    ).format(date);
    return string;
  };

  const handleSetFormated = () => {
    let duration = handleCalculateDuration(
      field?.data?.durationTimeline?.type,
      field?.config?.overlap
    );
    if (!duration) return;
    setFormated((prev) => ({
      ...prev,
      start: handleGetFormatedDateTime(duration.start.toISOString()),
      end: handleGetFormatedDateTime(duration.end.toISOString()),
      currentISO:
        field?.config?.current ??
        duration.start.toISOString() ??
        new Date().toISOString(),
      current:
        handleGetCurrent(
          field?.config?.current ??
            duration.start.toISOString() ??
            new Date().toISOString(),
          field?.data?.durationTimeline?.displayFormat?.type
        ) +
        handleGetFormatedDateTime(
          field?.config?.current ??
            duration.start.toISOString() ??
            new Date().toISOString()
        ),
      startISO: duration.start.toISOString(),
      endISO: duration.end.toISOString(),
      duration: handleFormatDuration(duration),
      durations: duration.durations,
    }));
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
  const getWeekNumber = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const dayOfWeek = firstDayOfMonth.getDay();

    // Calculate the week number in the month
    return "Week " + Math.ceil((dayOfMonth + dayOfWeek) / 7) + " - ";
  };

  // Function to get the month from a date
  const getMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "long" }) + " - ";
  };

  // Function to get the year from a date
  const getYear = (date) => {
    return date.getFullYear() + " - ";
  };

  const handleGetCurrent = (iso, type) => {
    let date;
    if (iso === null) {
      date = new Date();
    }
    date = new Date(iso);
    console.log(iso, type);
    switch (type) {
      case "week":
        return getWeekNumber(date);
      case "month":
        return getMonth(date);
      case "year":
        return getYear(date);
      default:
        return "";
    }
  };

  const handleCalculateRange = (type, selectedDate) => {
    if (formated.durations.length === 0) return;
    if (!formated.start) return;
    if (!selectedDate) {
      if (formated.startISO) {
        selectedDate = new Date(formated.startISO);
      } else {
        selectedDate = new Date();
      }
    }
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

  useEffect(() => {
    handleSetFormated();
    handleCalculateRange(
      field?.data?.durationTimeline?.displayFormat?.type,
      field?.config?.current
    );
  }, [
    field?.data?.durationTimeline?.type,
    field?.config?.overlap,
    field?.config?.current,
    field?.data?.durationTimeline?.displayFormat?.type,
  ]);

  useEffect(() => {
    handleCalculateRange(
      field?.data?.durationTimeline?.displayFormat?.type,
      field?.config?.current
    );
    console.log(formated, field?.config);
  }, [formated.durations]);
  return (
    <div
      style={{
        backgroundColor: `${field?.config?.color}`,
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      onDoubleClick={onDoubleClick}
      className="w-full flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md gap-2"
    >
      <div className="w-full flex flex-col justify-start items-center">
        <div
          style={{
            backgroundColor: `${field?.config?.color}`,
          }}
          className="flex flex-wrap justify-between items-center text-sm w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-t-md"
        >
          {field?.config?.showFromTo && (
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
        {field?.config?.showGraph && (
          <div
            style={{
              backgroundColor: `${field?.config?.color}`,
            }}
            className="w-full flex flex-wrap justify-between items-center text-s px-2 bg-[var(--btn-secondary)] rounded-b-md"
          >
            {formated.displayDuration.length > 0 && (
              <DurationGraphView
                durations={formated.displayDuration}
                type={field?.data?.durationTimeline?.displayFormat?.type}
                color={field?.config?.color}
              />
            )}
            <span className="w-full text-center text-[10px]">
              {formated.current}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
