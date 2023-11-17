import React, { useState } from "react";
import CloseBtnIcon from "../../assets/Icons/CloseBtnIcon";
import TickIcon from "../../assets/Icons/TickIcon";
import { useStateContext } from "../../context/StateContext";

function DetailNode({
  node,
  translate,
  showDetailNode,
  setShowDetailNode,
  treeConfig,
}) {
  const { config } = node;
  const { db, currentFlowPlan, setCurrentFlowPlan } = useStateContext();
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  if (!showDetailNode) return null;

  const handleUpdateDb = async (node, refId) => {
    await db.flowPlans
      .where("refId")
      .equals(refId)
      .modify({ root: node, updatedAt: new Date() });
  };

  const handleTaskDone = async (index) => {
    const newTasks = node.tasks.map((task, i) => {
      if (i === index) {
        return {
          ...task,
          done: !task.done,
        };
      }
      return task;
    });
    node.tasks = newTasks;
    let root = currentFlowPlan.root;
    setCurrentFlowPlan((prev) => ({ ...prev, root: root }));
    await handleUpdateDb(root, currentFlowPlan.refId);
    setUpdate((prev) => prev + 1);
  };
  return (
    <div
      style={{
        transform:
          treeConfig?.renderType === "verticalTree"
            ? `translate(${translate?.x + 315}px, ${translate?.y}px)`
            : `translate(${translate?.y + 225}px, ${translate?.x}px)`,
      }}
      className="absolute z-20 flex flex-col items-center justify-center"
    >
      <div
        className="flex flex-col items-center justify-center rounded-md w-[400px] h-fit bg-[var(--bg-secondary)] border-[3px] border-[var(--border-primary)] overflow-hidden relative"
        style={{
          backgroundColor: config?.nodeConfig?.backgroundColor,
          borderColor: config?.nodeConfig?.borderColor,
          opacity: config?.nodeConfig?.opacity / 100,
        }}
      >
        <div className="w-full flex flex-col items-center justify-center">
          <button
            onClick={() => setShowDetailNode(false)}
            className="absolute top-0 right-0 w-8 h-8 rounded-full"
          >
            <CloseBtnIcon />
          </button>
          <h1
            style={{
              borderColor: config?.nodeConfig?.borderColor,
              color: config?.titleConfig?.color,
              fontFamily: config?.titleConfig?.fontFamily,
              fontSize: config?.titleConfig?.fontSize,
              fontWeight: config?.titleConfig?.bold ? "bold" : "normal",
              fontStyle: config?.titleConfig?.italic ? "italic" : "normal",
              textDecoration: config?.titleConfig?.strickthrough
                ? "line-through"
                : "none",
            }}
            className="w-full p-2 text-center text-[var(--text-primary)] text-2xl font-bold border-b-[3px]"
          >
            {node.title}
          </h1>
          {node?.description && (
            <p
              style={{
                borderColor: config?.nodeConfig?.borderColor,
              }}
              className="max-h-[150px]  overflow-y-auto p-2 text-[var(--text-primary)] text-lg  border-b-[3px] text-left"
            >
              {showMoreDescription
                ? node.description
                : node.description.length > 150
                ? node.description.slice(0, 100)
                : node.description}
              <span
                onClick={() => setShowMoreDescription((prev) => !prev)}
                style={{
                  color: config?.nodeConfig?.borderColor,
                }}
                className="text-[var(--text-primary)]"
              >
                {showMoreDescription ? "...show less" : "...show more"}
              </span>
            </p>
          )}
          {node?.tasks && node.tasks.length > 0 && (
            <div className="width-full flex flex-col items-center justify-center ">
              <h1
                style={{
                  borderColor: config?.nodeConfig?.borderColor,
                }}
                className="text-[var(--text-primary)] w-full text-center text-lg font-bold border-b-[3px]"
              >
                Tasks
              </h1>
              <div className="h-[250px] shrink-0 overflow-y-auto w-full flex flex-col items-start justify-start p-2 gap-1">
                {node.tasks.map((task, i) => (
                  <div
                    key={task?.title}
                    className="shrink-0 flex flex-col items-center justify-center gap-1 w-full rounded-md"
                  >
                    {/* Tick with task */}
                    <div className="shrink-0 w-full flex items-center justify-start gap-2">
                      <div
                        style={{
                          borderColor: config?.nodeConfig?.borderColor,
                        }}
                        className="w-6 h-6 shrink-0 cursor-pointer rounded-sm border-[3px] flex items-center justify-center"
                        onClick={() => handleTaskDone(i)}
                      >
                        {task?.done && (
                          <span className="w-4 h-4 flex items-center justify-center">
                            <TickIcon />
                          </span>
                        )}
                      </div>
                      <h1 className="text-[var(--text-primary)] text-lg">
                        {task?.title}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailNode;
