import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { ProgressBar } from "../../Helpers/ProgressBar/index.jsx";
import CheckedIcon from "../../../../assets/Icons/CheckedIcon.jsx";
import UncheckedIcon from "../../../../assets/Icons/UncheckedIcon.jsx";
import BackIcon from "../../../../assets/Icons/BackIcon.jsx";
import ColorIcon from "../../../../assets/Icons/ColorIcon.jsx";
import PInIcon from "../../../../assets/Icons/PInIcon.jsx";
import DeleteIcon from "../../../../assets/Icons/DeleteIcon.jsx";
import { useDatabase } from "../../../../hooks/useDatabase/index.jsx";

export const Progress = ({
  setShowAdd,
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
    defaultNodeConfig,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
  } = useStateContext();

  const [progress, setProgress] = useState(currentField?.data?.progress ?? 0);
  const [pin, setPin] = useState(currentField?.config?.pin);
  const [tasklists, setTasklists] = useState([]);
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
    {
      type: "custom",
      des: "Select Custom Progress",
    },
  ];

  const { handleUpdateIndexDB } = useDatabase();

  const handleProcessTasklists = () => {
    let selected = [];
    tasklists.forEach((tasklist) => {
      selected.push({
        id: tasklist.id,
        title: tasklist.title,
        selected: tasklist.selected,
        minimized: tasklist.minimized,
        location: tasklist.location,
        tasks: tasklist.tasks.map((task) => ({
          id: task.id,
          selected: task.selected,
          minimized: task.minimized ? true : false,
        })),
      });
    });
    return selected;
  };

  const handleSave = async (e, index = null) => {
    e?.preventDefault();

    let finalField = {
      ...currentField,
      data: {
        ...currentField.data,
        progress: {
          ...currentField.data.progress,
          progress: progress,
          selected: handleProcessTasklists(),
        },
      },
      config: {
        ...currentField.config,
        pin: pin,
      },
      id: v4(),
    };

    let root = currentFlowPlan.root;
    let node = root;
    currentFlowPlanNode.forEach((i) => {
      node = node.children[i];
    });

    if (pin) {
      node.data = node.data.map((item) => {
        if (item.type === "progress") {
          item.config.pin = false;
        }
        return item;
      });
    }

    if (index !== null) {
      node.data[index] = finalField;
      node.pin = {
        show: pin,
        index: index,
        id: finalField.id,
      };
    } else if (dataIndex !== null) {
      node.data.splice(dataIndex + 1, 0, finalField);
      node.pin = {
        show: pin,
        index: dataIndex + 1,
        id: finalField.id,
      };
      handleResetShowAdd();
    } else {
      node.data.push(finalField);
      node.pin = {
        show: pin,
        index: node.data.length - 1,
        id: finalField.id,
      };
    }
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    setCurrentFieldType(null);
    setCurrentField(null);
    await handleUpdateIndexDB(currentFlowPlan.refId, root, true, "updateNode", node);
  };

  const handleCalculateProgressCurrentDoc = () => {
    let total = 0;
    let completed = 0;
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          total++;
          if (task.completed) {
            completed++;
          }
        });
      }
    });
    console.log(total, completed);
    return total === 0 ? 100 : (completed / total) * 100;
  };

  const handleCalculateProgress = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        item.data.list.forEach((task) => {
          info.total++;
          if (task.completed) {
            info.completed++;
          }
        });
      }
    });
    if (node.children.length > 0) {
      node.children.forEach((item) => {
        const childInfo = handleCalculateProgress(item);
        info.total += childInfo.total;
        info.completed += childInfo.completed;
      });
    }
    return info;
  };

  const handleCalculateProgressCurrentDocAndChild = (node) => {
    let info = {
      total: 0,
      completed: 0,
    };
    info = handleCalculateProgress(node);
    return info.total === 0 ? 100 : (info.completed / info.total) * 100;
  };

  const handleGetTaskLists = (node, location) => {
    let tasklists = [];
    node?.data.forEach((item) => {
      if (item?.type === "taskList") {
        if (item?.config?.repeat) return;
        if (tasklists.length === 0) {
          tasklists.push({
            title: node.title,
            id: node.id,
            location: location,
            selected: false,
            minimized: false,
            tasks: [
              {
                ...item,
                id: item.id,
                selected: false,
                minimized: false,
              },
            ],
          });
        } else {
          tasklists[0].tasks.push({
            ...item,
            id: item.id,
            selected: false,
            minimized: false,
          });
        }
      }
    });
    if (node.children.length > 0) {
      node.children.forEach((item, i) => {
        tasklists = tasklists.concat(
          handleGetTaskLists(item, location.concat([i]))
        );
      });
    }
    return tasklists;
  };

  const handleCalculateProgressCustom = (lists) => {
    let total = 0;
    let completed = 0;
    lists.forEach((tasklist) => {
      tasklist.tasks.forEach((task) => {
        if (!task.selected) return;
        task.data.list.forEach((item) => {
          total++;
          if (item.completed) {
            completed++;
          }
        });
      });
    });
    return total === 0 ? 100 : (completed / total) * 100;
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

  const handleWhatToCalculate = (type) => {
    switch (type) {
      case "doc":
        setProgress(handleCalculateProgressCurrentDoc());
        break;
      case "docChild":
        setProgress(handleCalculateProgressCurrentDocAndChild(node));
        break;
      case "docAll":
        setProgress(
          handleCalculateProgressCurrentDocAndChild(currentFlowPlan.root)
        );
        break;
      case "custom":
        setTasklists(handleGetTaskLists(currentFlowPlan.root, [0]));
      default:
        setProgress(0);
        break;
    }
  };

  const handleToggleSelectInTasklist = (tasklistIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.selected = !tasklist.selected;
        for (let i = 0; i < tasklist.tasks.length; i++) {
          tasklist.tasks[i].selected = tasklist.selected;
        }
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleToggleSelectInTask = (tasklistIndex, taskIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.tasks = tasklist.tasks.map((task, i) => {
          if (i === taskIndex) {
            task.selected = !task.selected;
            if (!task.selected) {
              tasklist.selected = false;
            }
          }
          return task;
        });
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleToggleMinimizeTasklist = (tasklistIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.minimized = !tasklist.minimized;
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleToggleMinimizeTask = (tasklistIndex, taskIndex) => {
    let newTasklists = tasklists.map((tasklist, index) => {
      if (index === tasklistIndex) {
        tasklist.tasks = tasklist.tasks.map((task, i) => {
          if (i === taskIndex) {
            task.minimized = !task.minimized;
          }
          return task;
        });
      }
      return tasklist;
    });
    setTasklists(newTasklists);
  };

  const handleInitilizeTasklists = () => {
    if (currentField?.data?.progress?.selected) {
      let tasklists = handleGetTaskLists(currentFlowPlan.root, [0]);
      let currentTasklists = currentField?.data?.progress?.selected;
      tasklists = tasklists.map((tasklist, i) => {
        tasklist.selected = currentTasklists[i]?.selected;
        tasklist.tasks = tasklist.tasks.map((task, j) => {
          task.selected = currentTasklists[i]?.tasks[j]?.selected;
          return task;
        });
        return tasklist;
      });
      setTasklists(tasklists);
    }
  };

  useEffect(() => {
    if (!tasklists) return;
    if (!tasklists?.length) return;
    if (currentField?.data?.progress?.type === "custom") {
      setProgress(handleCalculateProgressCustom(tasklists));
    }
  }, [tasklists]);

  useEffect(() => {
    handleWhatToCalculate(currentField?.data?.progress?.type);
  }, [currentField?.data?.progress?.type]);

  useEffect(() => {
    handleInitilizeTasklists();
  }, []);

  return (
    <form
      onSubmit={handleSave}
      className="w-full flex flex-col justify-start items-center bg-[var(--bg-secondary)] rounded-md gap-2"
    >
      <ProgressBar
        showPercentage={currentField?.config?.showPercentage}
        progress={progress}
        multiColor={currentField?.config?.multiColor}
        color={currentField?.config?.color}
      />
      {currentField?.data?.progress?.type === "custom" && (
        <div className="w-full p-2 h-[300px] small-scroll-bar scroll-bar-inverse rounded-md bg-[var(--btn-secondary)] overflow-y-auto overflow-x-hidden flex flex-col justify-start items-start gap-2">
          {tasklists.map((tasklist, index) => (
            <div
              key={tasklist.title}
              className="w-full flex flex-col justify-start items-start gap-2"
            >
              {(index !== 0 || index === tasklists.length - 1) && (
                <span className="block rounded-md w-full h-[2px] bg-[var(--text-primary)]"></span>
              )}
              <span className="w-full flex justify-start items-start text-sm text-[var(--text-primary)] font-bold bg-transparent outline-none break-all">
                <button
                  type="button"
                  onClick={() => handleToggleSelectInTasklist(index)}
                  className="w-5 h-5 mr-1 block shrink-0 cursor-pointer group"
                >
                  {tasklist?.selected ? <CheckedIcon /> : <UncheckedIcon />}
                </button>
                {tasklist?.title}
                <button
                  type="button"
                  onClick={() => handleToggleMinimizeTasklist(index)}
                  className="ml-3 shrink-0 relative w-5 h-5 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
                  title="Minimize"
                >
                  <span
                    style={{
                      rotate: tasklist?.minimized ? "0deg" : "90deg",
                    }}
                    className="flex justify-center items-center text-lg font-bold"
                  >
                    <BackIcon />
                  </span>
                </button>
              </span>
              {!tasklist?.minimized &&
                tasklist?.tasks.map((field, i) => (
                  <div
                    key={field.id}
                    className="pl-3 w-full flex flex-col justify-between items-center gap-2"
                  >
                    <span className="w-full text-xs items-center flex text-[var(--text-primary)] bg-transparent outline-none break-all">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectInTask(index, i)}
                        className="w-5 h-5 mr-1 block shrink-0 cursor-pointer group"
                      >
                        {field?.selected ? <CheckedIcon /> : <UncheckedIcon />}
                      </button>
                      Tasklist - {i + 1}
                      <button
                        type="button"
                        onClick={() => handleToggleMinimizeTask(index, i)}
                        className="ml-3 shrink-0 relative w-3 h-3 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
                        title="Minimize"
                      >
                        <span
                          style={{
                            rotate: field?.minimized ? "0deg" : "90deg",
                          }}
                          className="flex justify-center items-center text-lg font-bold"
                        >
                          <BackIcon />
                        </span>
                      </button>
                    </span>
                    {!field?.minimized && (
                      <div
                        style={{
                          display:
                            field?.id === currentField?.id ? "none" : "flex",
                          paddingLeft: `${
                            field?.config?.indentation * 10 || 4
                          }px`,
                        }}
                        className="w-full bg-[var(--bg-secondary)] p-1 rounded-md flex flex-col gap-1"
                      >
                        {field?.data?.list?.map((item, j) => (
                          <div
                            key={`shown-list-item-${item?.id || j}`}
                            className="w-full flex flex-col justify-center items-center text-sm"
                          >
                            <span
                              className="w-full flex text-[var(--text-primary)] bg-transparent outline-none break-all"
                              style={{
                                fontSize: `${field?.config?.fontSize}px`,
                                textDecoration: `${
                                  field?.config?.strickthrough
                                    ? "line-through"
                                    : "none"
                                }`,
                                fontStyle: `${
                                  field?.config?.italic ? "italic" : "normal"
                                }`,
                                fontWeight: `${
                                  field?.config?.bold ? "bold" : "normal"
                                }`,
                                fontFamily: `${field?.config?.fontFamily}`,
                                color: `${field?.config?.color}`,
                                textAlign: `${field?.config?.align}`,
                              }}
                            >
                              <span
                                style={{
                                  color: `${field?.config?.color}`,
                                }}
                                className="w-5 h-5 mr-1 block shrink-0 cursor-pointer group"
                              >
                                {item?.completed ? (
                                  <CheckedIcon />
                                ) : (
                                  <UncheckedIcon />
                                )}
                              </span>
                              {item?.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
      <div className="w-full flex justify-center items-center gap-2 flex-wrap mt-2">
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
        <select
          title="Type of Progress"
          className="w-[150px] group h-7 bg-[var(--btn-secondary)] text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center p-1 outline-none"
          value={currentField?.data?.progress?.type}
          onChange={(e) => {
            setCurrentField({
              ...currentField,
              data: {
                ...currentField.data,
                progress: {
                  ...currentField.data.progress,
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
        <button
          type="button"
          title="Toggle Percentage"
          className="relative w-8 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                showPercentage: !currentField?.config?.showPercentage,
              },
            });
          }}
        >
          {!currentField?.config?.showPercentage && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            %
          </span>
        </button>
        <button
          type="button"
          title="Toggle Multi Color"
          className="relative w-8 h-8 px-2 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setCurrentField({
              ...currentField,
              config: {
                ...currentField.config,
                multiColor: !currentField?.config?.multiColor,
              },
            });
          }}
        >
          {!currentField?.config?.multiColor && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <ColorIcon />
          </span>
        </button>
        <button
          type="button"
          title="Toggle Multi Color"
          className="relative w-8 h-8 px-1 text-xs rounded-md flex justify-center items-center bg-[var(--btn-secondary)] transition-colors duration-300 cursor-pointer"
          onClick={() => setPin((prev) => !prev)}
        >
          {!pin && (
            <span className="absolute w-[3px] h-full bg-[var(--logo-primary)] rotate-45 rounded-md flex"></span>
          )}
          <span className="flex justify-center items-center text-lg font-bold">
            <PInIcon />
          </span>
        </button>
        <div className="w-8 h-8 bg-[var(--btn-secondary)] text-center text-[var(--text-primary)] text-xs font-bold rounded-md flex justify-center items-center outline-none relative">
          <input
            className="w-full h-full opacity-0 bg-transparent outline-none cursor-pointer"
            type="color"
            title="Progress Bar Color"
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
    </form>
  );
};
