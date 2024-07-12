import { useStateContext } from "../../../../context/StateContext.jsx";
import React, { useEffect, useState } from "react";

export const AddToQuickAccess = ({ node, currentFlowPlanNode }) => {
  const {
    sharedQuickAccess,
    setSharedQuickAccess,
    currentFlowPlan,
    settings,
    setSettings,
  } = useStateContext();
  const { docConfig } = settings;
  const [current, setCurrent] = useState({
    id: null,
    show: "false",
    title: null,
    location: null,
  });
  const handleUpdateState = () => {
    let index = sharedQuickAccess.findIndex((item) => item?.id === node?.id);
    if (index !== -1) {
      setSharedQuickAccess((prev) => {
        let temp = [...prev];
        temp[index] = {
          refId: currentFlowPlan.refId,
          id: node?.id,
          show: current?.show === "true" ? "false" : "true",
          title: node?.title,
          location: currentFlowPlanNode,
        };
        localStorage.setItem("sharedQuickAccess", JSON.stringify(temp));
        return temp;
      });
    } else {
      setSharedQuickAccess((prev) => {
        let temp = [...prev];
        temp.push({
          refId: currentFlowPlan.refId,
          id: node?.id,
          show: current?.show === "true" ? "false" : "true",
          title: node?.title,
          location: currentFlowPlanNode,
        });
        localStorage.setItem("sharedQuickAccess", JSON.stringify(temp));
        return temp;
      });
    }

    setCurrent({
      id: node?.id,
      show: current?.show === "true" ? "false" : "true",
      title: node?.title,
      location: currentFlowPlanNode,
    });
  };

  const handleChangeFieldGap = (e) => {
    let value = e.target.value;
    if (value === "") return;
    if (value < 0) return;
    value = Number(value);
    if (Number.isNaN(value)) return;
    value = "" + value;

    setSettings((prev) => ({
      ...prev,
      docConfig: {
        ...prev.docConfig,
        gap: value,
      },
    }));
    localStorage.setItem("docSpacing", value);
  };

  useEffect(() => {
    if (sharedQuickAccess?.length > 0) {
      let index = sharedQuickAccess.findIndex((item) => item?.id === node?.id);
      if (index !== -1) {
        setCurrent({
          id: sharedQuickAccess[index]?.id,
          show: sharedQuickAccess[index]?.show,
          title: sharedQuickAccess[index]?.title,
          location: sharedQuickAccess[index]?.location,
        });
        return;
      }
      console.log(sharedQuickAccess, index);
      setCurrent({
        id: null,
        show: "false",
        title: null,
        location: null,
      });
    }
  }, [sharedQuickAccess, node?.id, currentFlowPlanNode]);
  return (
    <div className="w-full h-fit flex flex-col overflow-hidden rounded-md bg-[var(--bg-primary)] border-2 border-[var(--border-primary)] p-1 gap-1">
      <div className="flex flex-col text-sm gap-1">
        <div className=" w-full flex h-8 justify-between items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">
            Add Doc To Shared Quick Access
          </span>
          <span
            onClick={handleUpdateState}
            className="cursor-pointer flex justify-start items-center w-7 h-3 rounded-md bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          >
            <span
              style={{
                transform:
                  current?.show === "true"
                    ? "translateX(18px)"
                    : "translateX(2px)",
              }}
              className="block w-2 h-2 rounded-md bg-[var(--logo-primary)] transition-transform"
            ></span>
          </span>
        </div>
      </div>
      <div className="flex flex-col text-sm gap-1">
        <div className="flex justify-between  items-center gap-2 px-1 py-1 rounded-md bg-[var(--bg-secondary)]">
          <span className="text-[var(--text-primary)]">Field Gap:</span>
          <input
            type="number"
            min={0}
            value={docConfig?.gap}
            onChange={(e) => handleChangeFieldGap(e)}
            className="w-[40px] h-6 rounded-md bg-[var(--bg-primary)] px-2 focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
