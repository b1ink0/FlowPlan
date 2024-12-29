import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import BackIcon from "../../../../assets/Icons/BackIcon.jsx";
import { ProgressBar } from "../../Helpers/ProgressBar/index.jsx";
import { SortableList } from "../../../Helpers/DND/SortableList/index.jsx";
import CheckedIcon from "../../../../assets/Icons/CheckedIcon.jsx";
import UncheckedIcon from "../../../../assets/Icons/UncheckedIcon.jsx";
import { TimeAndDate } from "../../../Helpers/TimeAndDate/index.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import TimeStampIcon from "../../../../assets/Icons/TimeStampIcon.jsx";
import { InputTitleButtons } from "../../Helpers/InputTitleButtons/index.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const TaskList = ({
  currentField,
  setCurrentField,
  currentFieldType,
  setCurrentFieldType,
  handleGetDefaultConfig,
  dataIndex,
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
  const [list, setList] = useState(currentField?.data?.list ?? []);
  const [repeatData, setRepeatData] = useState(
    currentField?.data?.taskList?.repeat?.data ?? []
  );

  const [item, setItem] = useState({
    text: "",
    completed: false,
    createdAt: new Date(),
    completedAt: null,
  });
  const inputRefs = useRef([]);
  const [showChangeDateInfo, setShowChangeDateInfo] = useState({
    show: false,
    index: null,
  });
  const [progress, setProgress] = useState(0);
  const repeatFormats = [
    {
      type: "daily",
      des: "Daily",
    },
    {
      type: "weekdays",
      des: "Weekdays (Mon to Fri)",
    },
    {
      type: "weekends",
      des: "Weekends (Sat and Sun)",
    },
    {
      type: "customDays",
      des: "Custom Days",
    },
    {
      type: "weekly",
      des: "Weekly",
    },
    {
      type: "monthly",
      des: "Monthly",
    },
    {
      type: "customMonths",
      des: "Custom Months",
    },
    {
      type: "yearly",
      des: "Yearly",
    },
  ];
  const defaultCustomDays = [
    {
      type: "monday",
      des: "Monday",
      shortDes: "Mon",
      checked: true,
    },
    {
      type: "tuesday",
      des: "Tuesday",
      shortDes: "Tue",
      checked: true,
    },
    {
      type: "wednesday",
      des: "Wednesday",
      shortDes: "Wed",
      checked: true,
    },
    {
      type: "thursday",
      des: "Thursday",
      shortDes: "Thu",
      checked: true,
    },
    {
      type: "friday",
      des: "Friday",
      shortDes: "Fri",
      checked: true,
    },
    {
      type: "saturday",
      des: "Saturday",
      shortDes: "Sat",
      checked: true,
    },
    {
      type: "sunday",
      des: "Sunday",
      shortDes: "Sun",
      checked: true,
    },
  ];
  const defaultCustomMonths = [
    {
      type: "january",
      des: "January",
      shortDes: "Jan",
      checked: true,
    },
    {
      type: "february",
      des: "February",
      shortDes: "Feb",
      checked: true,
    },
    {
      type: "march",
      des: "March",
      shortDes: "Mar",
      checked: true,
    },
    {
      type: "april",
      des: "April",
      shortDes: "Apr",
      checked: true,
    },
    {
      type: "may",
      des: "May",
      shortDes: "May",
      checked: true,
    },
    {
      type: "june",
      des: "June",
      shortDes: "Jun",
      checked: true,
    },
    {
      type: "july",
      des: "July",
      shortDes: "Jul",
      checked: true,
    },
    {
      type: "august",
      des: "August",
      shortDes: "Aug",
      checked: true,
    },
    {
      type: "september",
      des: "September",
      shortDes: "Sep",
      checked: true,
    },
    {
      type: "october",
      des: "October",
      shortDes: "Oct",
      checked: true,
    },
    {
      type: "november",
      des: "November",
      shortDes: "Nov",
      checked: true,
    },
    {
      type: "december",
      des: "December",
      shortDes: "Dec",
      checked: true,
    },
  ];
  const defaultTaskList = {
    repeat: {
      format: {
        type: "daily",
        des: "Daily",
      },
      custom: defaultCustomDays,
    },
  };

  const handleSetChangeDateInfo = (index) => {
    setShowChangeDateInfo((prev) => ({
      show: prev.index === index ? !prev.show : prev.show,
      index: index,
    }));
  };

  const handleGetCustom = (type) => {
    return type === "monthly" || type === "customMonths"
      ? defaultCustomMonths
      : type === "daily" || type === "customDays"
      ? defaultCustomDays
      : type === "weekdays"
      ? defaultCustomDays.map((day) =>
          day.type === "saturday" || day.type === "sunday"
            ? { ...day, checked: false }
            : {
                ...day,
                checked: true,
              }
        )
      : type === "weekends"
      ? defaultCustomDays.map((day) =>
          day.type === "saturday" || day.type === "sunday"
            ? { ...day, checked: true }
            : {
                ...day,
                checked: false,
              }
        )
      : defaultCustomDays;
  };

  const handleSelectChange = (e) => {
    let type = e.target.value;
    let format = repeatFormats.find((format) => format.type === type);
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        taskList: {
          ...(currentField.data.taskList === undefined
            ? defaultTaskList
            : currentField.data.taskList),
          repeat: {
            ...(currentField.data.taskList === undefined
              ? defaultTaskList.repeat
              : currentField.data.taskList.repeat),
            format: format,
            custom: handleGetCustom(format?.type),
          },
        },
      },
    });
    setRepeatData([]);
    setCurrentRepeatList(handleGetCurrentRepeatList(currentDate.current, []));
  };

  const getRelativeDayString = (date) => {
    const inputDate = new Date(date);
    const today = new Date();

    // Clear the time part for accurate date comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    const timeDifference = inputDate.getTime() - today.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    if (dayDifference === 0) {
      return "Today";
    } else if (dayDifference === 1) {
      return "Tomorrow";
    } else if (dayDifference === -1) {
      return "Yesterday";
    } else {
      const type = currentField?.data?.taskList?.repeat?.format?.type;
      const dayTypes = ["daily", "weekdays", "weekends", "customDays"];
      const monthTypes = ["monthly", "customMonths"];
      const isTypeDay = dayTypes.includes(type);
      const isTypeMonth = monthTypes.includes(type);
      return isTypeDay
        ? inputDate.toLocaleDateString("en-US", { weekday: "short" })
        : isTypeMonth
        ? inputDate.toLocaleDateString("en-US", { month: "short" })
        : inputDate.toLocaleDateString("en-US", { year: "numeric" });
    }
  };

  const [currentDate, setCurrentDate] = useState({
    current: new Date(),
    formated: getRelativeDayString(new Date()),
  });

  const areAllCustomUnchecked = (customs) => {
    return customs.every((custom) => !custom.checked);
  };

  const getDayStringFromDate = (date) => {
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const dayMap = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return dayMap[dayOfWeek];
  };

  const getNextCheckedDay = (date) => {
    date = new Date(date);
    const currentDay = getDayStringFromDate(date);
    const days = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(days)) return;
    const currentIndex = days.findIndex((day) => day.type === currentDay);
    const totalDays = days.length;
    let nextIndex = currentIndex;
    const nextDate = new Date(date);

    do {
      nextIndex = (nextIndex + 1) % totalDays;
      nextDate.setDate(nextDate.getDate() + 1);
    } while (!days[nextIndex].checked && nextIndex !== currentIndex);

    return nextDate;
  };

  const getPreviousCheckedDay = (date) => {
    date = new Date(date);
    const currentDay = getDayStringFromDate(date);
    const days = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(days)) return;
    const currentIndex = days.findIndex((day) => day.type === currentDay);
    const totalDays = days.length;
    let previousIndex = currentIndex;
    const previousDate = new Date(date);

    do {
      previousIndex = (previousIndex - 1 + totalDays) % totalDays;
      previousDate.setDate(previousDate.getDate() - 1);
    } while (!days[previousIndex].checked && previousIndex !== currentIndex);

    return previousDate;
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

  const getNextCheckedMonth = (date) => {
    let currentDate = new Date(date);
    const months = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(months)) return;
    const currentIndex = currentDate.getMonth(); // 0 (January) to 11 (December)
    const totalMonths = months?.length;
    let nextIndex = currentIndex;
    const nextDate = new Date(currentDate);

    do {
      nextIndex = (nextIndex + 1) % totalMonths;
      nextDate.setMonth(nextDate.getMonth() + 1);
    } while (!months[nextIndex].checked && nextIndex !== currentIndex);

    return nextDate;
  };

  const getPreviousCheckedMonth = (date) => {
    let currentDate = new Date(date);
    const months = currentField?.data?.taskList?.repeat?.custom;
    if (areAllCustomUnchecked(months)) return;
    const currentIndex = currentDate.getMonth(); // 0 (January) to 11 (December)
    const totalMonths = months?.length;
    let previousIndex = currentIndex;
    const previousDate = new Date(currentDate);

    do {
      previousIndex = (previousIndex - 1 + totalMonths) % totalMonths;
      previousDate.setMonth(previousDate.getMonth() - 1);
    } while (!months[previousIndex].checked && previousIndex !== currentIndex);

    return previousDate;
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

  const handleGetDateNavigationFunction = (iso, repeatType, direction) => {
    const navigationFunctions = {
      daily: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekdays: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekends: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      customDays: {
        next: getNextCheckedDay,
        prev: getPreviousCheckedDay,
      },
      weekly: {
        next: getNextWeek,
        prev: getPreviousWeek,
      },
      monthly: {
        next: getNextMonth,
        prev: getPreviousMonth,
      },
      customMonths: {
        next: getNextCheckedMonth,
        prev: getPreviousCheckedMonth,
      },
      yearly: {
        next: getNextYear,
        prev: getPreviousYear,
      },
    };

    let newDate = navigationFunctions[repeatType]?.[direction](iso);
    setCurrentDate({
      current: newDate,
      formated: getRelativeDayString(newDate),
    });
  };

  const handleCheck = (index) => {
    let newDays = [...currentField?.data?.taskList?.repeat?.custom];
    newDays[index] = {
      ...newDays[index],
      checked: !newDays[index].checked,
    };
    if (areAllCustomUnchecked(newDays)) return;
    setCurrentField({
      ...currentField,
      data: {
        ...currentField.data,
        taskList: {
          ...currentField.data.taskList,
          repeat: {
            ...currentField.data.taskList.repeat,
            custom: newDays,
          },
        },
      },
    });
  };

  const handleSetDateTime = (e) => {
    let time = e.target.value;
    let newDate = new Date(time);
    setCurrentDate({
      current: newDate,
      formated: getRelativeDayString(newDate),
    });
  };

  const handleItemChange = (e, i = null) => {
    let newList = [...list];
    if (i !== null) {
      newList[i] = {
        ...newList[i],
        id: newList[i].id,
        text: e.target.value,
      };

      setList(newList);
    } else {
      setItem({
        ...item,
        text: e.target.value,
      });
    }
  };

  const handleKeyDown = (event, i) => {
    if (event?.key === "Enter") {
      console.log("Enter key pressed", event);
      let newItem = {
        text: "",
        completed: false,
        createdAt: new Date(),
        completedAt: null,
        id: v4(),
      };
      setList((prev) => {
        let newList = [...prev];
        newList.splice(i + 1, 0, newItem);
        return newList;
      });
      setTimeout(() => {
        if (inputRefs.current[i + 1]) {
          inputRefs.current[i + 1].focus();
        }
      }, 100);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        ...item,
        id: v4(),
      },
    ]);
    setItem({
      text: "",
      completed: false,
      createdAt: new Date(),
      completedAt: null,
    });
  };

  const { handleUpdateIndexDB } = useDatabase();

  const handleSave = async (e, index = null) => {
    e?.preventDefault();
    let finalList =
      item.text === ""
        ? list
        : [
            ...list,
            {
              ...item,
              id: v4(),
            },
          ];
    if (finalList.length === 0) {
      return;
    }
    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });
    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        list: finalList,
        taskList:
          currentField?.data?.taskList === undefined
            ? defaultTaskList
            : {
                ...currentField.data.taskList,
                repeat: {
                  ...currentField.data.taskList.repeat,
                  data: repeatData,
                },
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
    setCurrentFieldType(null);
    setCurrentField(null);
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isSameWeek = (date1, date2) => {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);

    // Set both dates to the start of their respective weeks
    firstDate.setHours(0, 0, 0, 0);
    secondDate.setHours(0, 0, 0, 0);

    const dayOfWeek = (date) => (date.getDay() + 6) % 7; // 0 (Monday) to 6 (Sunday)

    const firstDayOfWeek = dayOfWeek(firstDate);
    const secondDayOfWeek = dayOfWeek(secondDate);

    // Move to the start of the week (Monday)
    firstDate.setDate(firstDate.getDate() - firstDayOfWeek);
    secondDate.setDate(secondDate.getDate() - secondDayOfWeek);

    // Compare the adjusted dates
    return firstDate.getTime() === secondDate.getTime();
  };

  const isSameMonth = (date1, date2) => {
    return date1.getMonth() === date2.getMonth();
  };

  const isSameYear = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear();
  };

  const findObjectByDate = (array, targetDate, type) => {
    const index = array.findIndex((item) => {
      switch (type) {
        case "daily":
        case "weekdays":
        case "weekends":
        case "customDays":
          return isSameDate(new Date(item.date), new Date(targetDate));
        case "weekly":
          return isSameWeek(new Date(item.date), new Date(targetDate));
        case "monthly":
        case "customMonths":
          return isSameMonth(new Date(item.date), new Date(targetDate));
        case "yearly":
          return isSameYear(new Date(item.date), new Date(targetDate));
        default:
          return;
      }
    });
    return index !== -1 ? { index, object: array[index] } : null;
  };

  const handleSetRepeatData = (date, newList, index) => {
    date = date.toISOString();
    let dateObject = findObjectByDate(
      repeatData,
      date,
      currentField?.data?.taskList?.repeat?.format?.type
    );

    if (dateObject) {
      let data = dateObject.object.data;
      let itemIndex = data.findIndex((item) => item.id === newList[index].id);
      if (itemIndex !== -1) {
        data[itemIndex] = {
          id: newList[index].id,
          completed: newList[index].completed,
        };
      } else {
        data.push({
          id: newList[index].id,
          completed: newList[index].completed,
        });
      }

      setRepeatData((prev) => {
        let newRepeatData = [...prev];
        newRepeatData[dateObject.index] = {
          date: date,
          data: data,
        };
        return newRepeatData;
      });

      setCurrentRepeatList((prev) => {
        let newCurrentRepeatList = [...prev];
        newCurrentRepeatList[index] = {
          ...newCurrentRepeatList[index],
          completed: newList[index].completed,
        };
        return newCurrentRepeatList;
      });
    } else {
      let newRepeatData = [
        ...repeatData,
        {
          date: date,
          data: [
            {
              id: newList[index].id,
              completed: newList[index].completed,
            },
          ],
        },
      ];

      setRepeatData(newRepeatData);
      setCurrentRepeatList((prev) => {
        let newCurrentRepeatList = [...prev];
        newCurrentRepeatList[index] = {
          ...newCurrentRepeatList[index],
          completed: newList[index].completed,
        };
        return newCurrentRepeatList;
      });
    }
  };

  const handleCompleteToggle = (e, index = null) => {
    if (index !== null) {
      let newList = [
        ...(currentField?.config?.repeat ? currentRepeatList : list),
      ];
      newList[index] = {
        ...newList[index],
        completed: !newList[index].completed,
        completedAt: !newList[index].completed ? new Date() : null,
      };

      if (currentField?.config?.repeat) {
        handleSetRepeatData(currentDate.current, newList, index);
      }

      setList(newList);
    } else {
      setItem((prev) => ({
        ...prev,
        completed: !prev.completed,
        completedAt: !prev.completed ? new Date() : null,
      }));
    }
  };

  const handleGetCurrentRepeatList = (date, repeatData) => {
    let repeatList = structuredClone(list);
    let currentDate = date;
    if (!currentDate) {
      currentDate = new Date();
    }
    console.log(repeatData);
    let repeatObject = findObjectByDate(
      repeatData,
      currentDate.toISOString(),
      currentField?.data?.taskList?.repeat?.format?.type
    );
    if (repeatObject) {
      let repeatObjectData = repeatObject.object.data;
      repeatList = list.map((item) => {
        let repeatItem = repeatObjectData.find((data) => data.id === item.id);
        return repeatItem
          ? {
              ...item,
              completed: repeatItem.completed,
            }
          : {
              ...item,
              completed: false,
            };
      });

      return repeatList;
    } else {
      return repeatList.map((item) => ({
        ...item,
        completed: false,
      }));
    }
  };

  const [currentRepeatList, setCurrentRepeatList] = useState(list);

  const handleDelete = async (index) => {
    let newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleMove = (items) => {
    setList(items);
  };

  const handleGetDateTime = (iso) => {
    if (!iso) {
      iso = new Date().toISOString();
    }
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

  const handleDateInfoChange = (e, index, type) => {
    let newList = [...list];
    newList[index] = {
      ...newList[index],
      [type]: e.target.value,
    };
    setList(newList);
  };

  const handleCalculateProgress = (list) => {
    if (!currentField?.config?.progressBar) return;
    if (list.length === 0) return;
    let total = 0;
    list?.forEach((item) => {
      if (item.completed) {
        total++;
      }
    });

    if (item.text !== "" && item.completed) {
      total++;
    }

    let progress = (total / (list?.length + (item.text === "" ? 0 : 1))) * 100;
    setCurrentField({
      ...currentField,
      config: {
        ...currentField.config,
        progress: progress,
      },
    });
    setProgress(progress);
  };

  useEffect(() => {
    if (currentField?.config?.repeat) {
      handleCalculateProgress(currentRepeatList);
    } else {
      handleCalculateProgress(list);
    }
  }, [list, item, currentRepeatList]);

  useEffect(() => {
    if (!currentField?.config?.repeat) return;
    setCurrentRepeatList(
      handleGetCurrentRepeatList(currentDate.current, repeatData)
    );
  }, [currentDate, list, currentField?.config?.repeat]);

  return (
    <div
      style={{
        paddingLeft: `${currentField?.config?.indentation * 10 || 4}px`,
      }}
      className="w-full h-fit flex flex-col justify-start items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-md"
    >
      {currentField?.config?.repeat && (
        <div className="flex h-7 mb-1 flex-wrap justify-between items-center text-sm w-full px-2 bg-[var(--btn-secondary)] rounded-tr-md rounded-tl-md">
          <button
            className=" relative w-6 h-6 p-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
            type="button"
            onClick={() =>
              handleGetDateNavigationFunction(
                currentDate.current,
                currentField?.data?.taskList?.repeat?.format?.type,
                "prev"
              )
            }
          >
            <span className="rotate-180 flex justify-center items-center text-lg font-bold">
              <BackIcon />
            </span>
          </button>
          <div className="flex justify-center items-center">
            <span className="text-[10px] font-bold text-[var(--text-primary)]">
              {currentDate.formated}
              {" : "}
            </span>
            <input
              type="datetime-local"
              className="w-[170px] h-7 cursor-pointer  text-[10px] font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
              value={handleGetDateTime(currentDate.current)}
              onChange={handleSetDateTime}
            />
          </div>
          <button
            className=" relative w-6 h-6 p-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
            type="button"
            onClick={() =>
              handleGetDateNavigationFunction(
                currentDate.current,
                currentField?.data?.taskList?.repeat?.format?.type,
                "next"
              )
            }
          >
            <span className="flex justify-center items-center text-lg font-bold">
              <BackIcon />
            </span>
          </button>
        </div>
      )}
      {currentField?.config?.progressBar && <ProgressBar progress={progress} />}
      <SortableList
        items={list}
        onChange={handleMove}
        className=" flex flex-col gap-1"
        renderItem={(item, active, setActive, index) => (
          <SortableList.Item id={item?.id}>
            <div
              key={`tasklist-item-${item?.id}`}
              className="group w-full flex justify-center items-center flex-col text-sm relative"
            >
              <div className="w-full flex">
                <button
                  type="button"
                  style={{
                    color: `${currentField?.config?.color}`,
                  }}
                  className="w-5 h-5 mr-1 block cursor-pointer"
                  onClick={(e) => handleCompleteToggle(e, index)}
                >
                  {currentField?.config?.repeat ? (
                    currentRepeatList[index]?.completed ? (
                      <CheckedIcon />
                    ) : (
                      <UncheckedIcon />
                    )
                  ) : item.completed ? (
                    <CheckedIcon />
                  ) : (
                    <UncheckedIcon />
                  )}
                </button>
                <input
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  placeholder="Enter List Item..."
                  value={item?.text}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onChange={(e) => handleItemChange(e, index)}
                  className="w-full pr-[80px] text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
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
                />
              </div>
              {currentField.config?.showDateInfo && (
                <div className="w-full opacity-100 flex justify-between items-center flex-wrap">
                  <TimeAndDate
                    group={false}
                    absolute={false}
                    text={`Completed: ${item?.completed ? "" : "Not yet"}`}
                    timeDate={
                      item.completed ? new Date(item.completedAt) : undefined
                    }
                  />
                  <TimeAndDate
                    group={false}
                    absolute={false}
                    text="Created: "
                    timeDate={
                      item.createdAt ? new Date(item.createdAt) : undefined
                    }
                  />
                </div>
              )}
              <SortableList.DragHandle className="opacity-0 group-hover:opacity-100 w-5 h-5 absolute right-[52px] bg-[var(--bg-tertiary)] p-1 rounded-md flex justify-center items-center" />
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex justify-center items-center absolute right-1 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-delete)] transition-colors duration-300"
              >
                <DeleteIcon />
              </button>
              <button
                type="button"
                title="Change Dates"
                onClick={() => handleSetChangeDateInfo(index)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex justify-center items-center absolute right-7 text-xs bg-[var(--btn-secondary)] py-1 px-1 rounded-md hover:bg-[var(--btn-add)] transition-colors duration-300"
              >
                <TimeStampIcon />
              </button>
              {(currentField?.config?.showDateInfo === true ||
                currentField?.config?.showDateInfo === undefined) &&
                showChangeDateInfo.show &&
                showChangeDateInfo.index === index && (
                  <div className="w-full flex justify-between flex-wrap gap-1 bg-[var(--bg-secondary)] p-1 rounded-md">
                    {item.completed && (
                      <input
                        className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
                        onChange={(e) =>
                          handleDateInfoChange(e, index, "completedAt")
                        }
                        value={handleGetDateTime(item.completedAt)}
                        type="datetime-local"
                      />
                    )}
                    <input
                      className="w-[200px] h-8 cursor-pointer text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none bg-[var(--btn-secondary)] text-[var(--text-primary)]"
                      onChange={(e) =>
                        handleDateInfoChange(e, index, "createdAt")
                      }
                      value={handleGetDateTime(item.createdAt)}
                      type="datetime-local"
                    />
                  </div>
                )}
            </div>
          </SortableList.Item>
        )}
      />

      <form
        onSubmit={handleAdd}
        className="w-full flex justify-center items-center text-sm"
      >
        <button
          type="button"
          style={{
            color: `${currentField?.config?.color}`,
          }}
          className="w-5 h-5 mr-1 block cursor-pointer"
          onClick={handleCompleteToggle}
        >
          {item.completed ? <CheckedIcon /> : <UncheckedIcon />}
        </button>
        <input
          required
          autoFocus
          type="text"
          placeholder="Enter List Item..."
          value={item.text}
          onChange={handleItemChange}
          className="w-full text-[var(--text-primary)] cursor-pointer bg-transparent outline-none"
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
      </form>
      {currentField?.config?.repeat && (
        <div className="w-full flex flex-col justify-center items-center gap-2 flex-wrap mt-2">
          <div className="w-fit h-fit flex justify-center items-center gap-2 flex-wrap">
            <select
              title="Repeat Type"
              className="w-[130px] group h-8 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
              value={currentField?.data?.taskList?.repeat?.format?.type}
              onChange={handleSelectChange}
            >
              {repeatFormats.map((format) => (
                <option key={format.type} value={format.type}>
                  {format.des}
                </option>
              ))}
            </select>
          </div>
          <div className="w-fit h-fit flex justify-center items-center gap-2 flex-wrap">
            {(currentField?.data?.taskList?.repeat?.format?.type ===
              "customDays" ||
              currentField?.data?.taskList?.repeat?.format?.type ===
                "customMonths") &&
              currentField?.data?.taskList?.repeat?.custom?.map(
                (custom, index) => (
                  <button
                    key={custom.type}
                    type="button"
                    onClick={() => handleCheck(index)}
                    className={`w-fit px-2 h-8 flex justify-center items-center rounded-md ${
                      custom.checked
                        ? "bg-[var(--btn-secondary)]"
                        : "bg-[var(--btn-primary)]"
                    } text-[var(--text-primary)] text-xs font-bold`}
                  >
                    <span className="w-4 h-4 mr-1 block cursor-pointer">
                      {custom.checked ? <CheckedIcon /> : <UncheckedIcon />}
                    </span>
                    {custom.shortDes}
                  </button>
                )
              )}
          </div>
        </div>
      )}

      <InputTitleButtons
        handleSave={handleSave}
        config={currentField?.config}
        currentField={currentField}
        setCurrentField={setCurrentField}
        setCurrentFieldType={setCurrentFieldType}
        type={currentField.type}
        handleGetDefaultConfig={handleGetDefaultConfig}
        defaultTaskList={defaultTaskList}
      />
    </div>
  );
};
