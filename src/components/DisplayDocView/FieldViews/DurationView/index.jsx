import React, { useEffect, useState } from "react";

export const DurationView = ({ field, currentField, onDoubleClick }) => {
  const handleGetFormatedDateTime = (iso) => {
    if (iso === null) return "";
    let date = new Date(iso);
    if (!field?.data?.duration?.format?.input) return date.toLocaleString();
    const string = new Intl.DateTimeFormat(
      "en-IN",
      field?.data?.duration?.format?.input
    ).format(date);
    return string;
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
  const [formated, setFormated] = useState({
    start: handleGetFormatedDateTime(field?.data?.duration?.start),
    end: handleGetFormatedDateTime(field?.data?.duration?.end),
    duration: handleFormatDuration(
      handleCalculateDuration(
        field?.data?.duration?.start,
        field?.data?.duration?.end
      )
    ),
  });

  useEffect(() => {
    setFormated({
      start: handleGetFormatedDateTime(field?.data?.duration?.start),
      end: handleGetFormatedDateTime(field?.data?.duration?.end),
      duration: handleFormatDuration(
        handleCalculateDuration(
          field?.data?.duration?.start,
          field?.data?.duration?.end
        )
      ),
    });
  }, [field?.data?.duration?.start, field?.data?.duration?.end]);

  return (
    <div
      style={{
        backgroundColor: `${field?.config?.color}`,
        display: field?.id === currentField?.id ? "none" : "flex",
      }}
      onDoubleClick={onDoubleClick}
      className="flex mb-1 flex-wrap justify-between items-center text-sm w-full px-2 py-1 bg-[var(--btn-secondary)] rounded-tr-md rounded-tl-md"
    >
      {field?.config?.showFromTo && (
        <div className="text-xs">
          {/* <div className="w-fit h-7 flex justify-center items-center gap-2 flex-wrap"> */}
          <span className="w-fit">
            From: {formated.start || "Select Start DateTime"}
          </span>
          {/* </div> */}
          <span>{" - To: "}</span>
          {/* <div className="w-fit h-7 flex justify-center items-center gap-2 flex-wrap"> */}
          <span className="w-fit">{formated.end || "Select End DateTime"}</span>
          {/* </div> */}
        </div>
      )}
      <div className="flex justify-center items-center">
        <span className="text-xs text-[var(--text-primary)]">
          Duration: {formated.duration || "Not Yet"}
        </span>
      </div>
    </div>
  );
};
