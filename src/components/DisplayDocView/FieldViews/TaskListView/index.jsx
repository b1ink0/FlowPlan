import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useEffect, useState } from "react";
import BackIcon from "../../../../assets/Icons/BackIcon.jsx";
import { ProgressBar } from "../../Helpers/ProgressBar/index.jsx";
import CheckedIcon from "../../../../assets/Icons/CheckedIcon.jsx";
import UncheckedIcon from "../../../../assets/Icons/UncheckedIcon.jsx";
import { TimeAndDate } from "../../../Helpers/TimeAndDate/index.jsx";

export const TaskListView = ({
  field,
  currentField,
  setCurrentField,
  i,
  handleEditField,
}) => {
  const { db, currentFlowPlan, currentFlowPlanNode, setCurrentFlowPlan } =
    useStateContext();

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
      const type = field?.data?.taskList?.repeat?.format?.type;
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
  const [list, setList] = useState(field?.data?.list ?? []);
  const [currentRepeatList, setCurrentRepeatList] = useState(
    field?.data?.list ?? []
  );
  const [currentDate, setCurrentDate] = useState({
    current: new Date(),
    formated: getRelativeDayString(new Date()),
  });
  const [repeatData, setRepeatData] = useState(
    field?.data?.taskList?.repeat?.data ?? []
  );
  const [progress, setProgress] = useState(0);

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
    const days = field?.data?.taskList?.repeat?.custom;
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
    const days = field?.data?.taskList?.repeat?.custom;
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
    const months = field?.data?.taskList?.repeat?.custom;
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
    const months = field?.data?.taskList?.repeat?.custom;
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

  const handleSetDateTime = (e) => {
    let time = e.target.value;
    let newDate = new Date(time);
    setCurrentDate({
      current: newDate,
      formated: getRelativeDayString(newDate),
    });
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

  const handleUpdateIndexDB = async (refId, root, updateDate = true) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({
        root: root,
        ...(updateDate && { updatedAt: new Date() }),
      });
  };

  const handleCalculateProgress = (list) => {
    if (!field?.config?.progressBar) return;
    if (list.length === 0) return;
    let total = 0;
    list?.forEach((item) => {
      if (item.completed) {
        total++;
      }
    });

    let progress = (total / list?.length) * 100;
    setProgress(progress);
  };

  const handleGetRepeatData = (date, newList, index) => {
    date = date.toISOString();
    let dateObject = findObjectByDate(
      repeatData,
      date,
      field?.data?.taskList?.repeat?.format?.type
    );
    let newRepeatData = [];
    let newCurrentRepeatList = [];

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

      newRepeatData = [...repeatData];
      newRepeatData[dateObject.index] = {
        date: date,
        data: data,
      };

      newCurrentRepeatList = [...currentRepeatList];
      newCurrentRepeatList[index] = {
        ...newCurrentRepeatList[index],
        completed: newList[index].completed,
      };
    } else {
      newRepeatData = [
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

      newCurrentRepeatList = [...currentRepeatList];
      newCurrentRepeatList[index] = {
        ...newCurrentRepeatList[index],
        completed: newList[index].completed,
      };
    }

    return {
      repeatData: newRepeatData,
      currentRepeatList: newCurrentRepeatList,
    };
  };

  const handleCompleteToggle = (e, index) => {
    let newList = [
      ...(field?.config?.repeat ? currentRepeatList : field?.data?.list),
    ];
    newList[index] = {
      ...newList[index],
      completed: !newList[index].completed,
      completedAt: !newList[index].completed ? new Date() : null,
    };

    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });

    let result = null;
    if (field?.config?.repeat) {
      result = handleGetRepeatData(currentDate.current, newList, index);
      if (result) {
        setRepeatData(result.repeatData);
        setCurrentRepeatList(result.currentRepeatList);
      }
    }

    node.data[i] = {
      ...field,
      data: {
        ...field.data,
        list: field?.config?.repeat ? field?.data.list : newList,
        taskList:
          field?.data?.taskList === undefined
            ? {
                ...defaultTaskList,
                repeat: {
                  ...defaultTaskList.repeat,
                  data: result?.repeatData ?? repeatData,
                },
              }
            : {
                ...field.data.taskList,
                repeat: {
                  ...field.data.taskList.repeat,
                  data: result?.repeatData ?? repeatData,
                },
              },
      },
    };
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    handleUpdateIndexDB(currentFlowPlan.refId, root);
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

  const handleGetCurrentRepeatList = (date, repeatData) => {
    let repeatList = structuredClone(list);
    let currentDate = date;
    if (!currentDate) {
      currentDate = new Date();
    }
    let repeatObject = findObjectByDate(
      repeatData,
      currentDate.toISOString(),
      field?.data?.taskList?.repeat?.format?.type
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

  useEffect(() => {
    if (field?.config?.repeat) {
      handleCalculateProgress(currentRepeatList);
    } else {
      handleCalculateProgress(field?.data?.list);
    }
  }, [currentRepeatList, field?.config?.repeat, field?.data?.list]);

  useEffect(() => {
    if (!field?.config?.repeat) return;
    console.log(currentDate.current, repeatData);
    setCurrentRepeatList(
      handleGetCurrentRepeatList(currentDate.current, repeatData)
    );
  }, [currentDate, repeatData, field?.config?.repeat]);

  useEffect(() => {
    if (!field?.config?.repeat) return;
    setRepeatData(field?.data?.taskList?.repeat?.data ?? []);
  }, [field?.data?.taskList?.repeat?.data]);

  return (
    <div
      style={{
        display: field?.id === currentField?.id ? "none" : "flex",
        paddingLeft: `${field?.config?.indentation * 10 || 4}px`,
      }}
      className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
    >
      {field?.config?.repeat && (
        <div className="flex h-7 mb-1 flex-wrap justify-between items-center text-sm w-full px-2 bg-[var(--btn-secondary)] rounded-tr-md rounded-tl-md">
          <button
            className=" relative w-6 h-6 p-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointers"
            type="button"
            onClick={() =>
              handleGetDateNavigationFunction(
                currentDate.current,
                field?.data?.taskList?.repeat?.format?.type,
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
                field?.data?.taskList?.repeat?.format?.type,
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
      {field?.config?.progressBar && <ProgressBar progress={progress} />}
      {field?.data?.list?.map((item, j) => (
        <div
          key={`shown-list-item-${item?.id || j}`}
          className="w-full flex flex-col justify-center items-center text-sm"
          onDoubleClick={() => handleEditField(field, i)}
        >
          <span
            className="w-full flex text-[var(--text-primary)] bg-transparent outline-none break-words"
            style={{
              fontSize: `${field?.config?.fontSize}px`,
              textDecoration: `${
                field?.config?.strickthrough ? "line-through" : "none"
              }`,
              fontStyle: `${field?.config?.italic ? "italic" : "normal"}`,
              fontWeight: `${field?.config?.bold ? "bold" : "normal"}`,
              fontFamily: `${field?.config?.fontFamily}`,
              color: `${field?.config?.color}`,
              textAlign: `${field?.config?.align}`,
            }}
          >
            <button
              type="button"
              style={{
                color: `${field?.config?.color}`,
              }}
              className="w-5 shrink-0 h-5 mr-1 block cursor-pointer"
              onClick={(e) => handleCompleteToggle(e, j)}
            >
              {field?.config?.repeat ? (
                currentRepeatList[j]?.completed ? (
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
            {item?.text}
          </span>
          {field.config?.showDateInfo && (
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
                timeDate={item.createdAt ? new Date(item.createdAt) : undefined}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
