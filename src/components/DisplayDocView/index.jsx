import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import CloseBtnIcon from "../../assets/Icons/CloseBtnIcon";
import FullScreenIcon from "../../assets/Icons/FullScreenIcon";
import BackIcon from "../../assets/Icons/BackIcon";
import { TimeAndDate } from "../Helpers/TimeAndDate";
import InheritIcon from "../../assets/Icons/InheritIcon.jsx";
import SettingsIcon from "../../assets/Icons/SettingsIcon.jsx";
import { ProgressBar } from "./Helpers/ProgressBar/index.jsx";
import { AddEditField } from "./Helpers/AddEditField/index.jsx";
import { MenuButtons } from "./Helpers/MenuButtons/index.jsx";
import { AddToQuickAccess } from "./Helpers/AddToQuickAccess/index.jsx";
import { DocRenderViewContainer } from "./DocRenderViewContainer/index.jsx";

function DisplayDocView() {
  const {
    settings,
    setSettings,
    currentFlowPlan,
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
    defaultNodeConfig,
  } = useStateContext();
  const scrollableDiv = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isScrolledUp, setScrolledUp] = useState(false);
  const [currentFieldType, setCurrentFieldType] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [move, setMove] = useState({
    move: false,
    id: null,
  });
  const [showAdd, setShowAdd] = useState({
    show: false,
    index: null,
  });
  const [node, setNode] = useState(null);
  const [nodeNavigation, setNodeNavigation] = useState({
    preSibling: null,
    nextSibling: null,
    parent: null,
    firstChild: null,
  });
  const [showNodeNavigation, setShowNodeNavigation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDocViewSettings, setShowDocViewSettings] = useState(false);

  const { docConfig } = settings;

  const handleMouseDown = () => {
    let resize = true;
    document.body.style.cursor = "ew-resize";
    document.onmousemove = (e) => {
      if (!resize) return;
      const newWidth = window.innerWidth - e.clientX;
      localStorage.setItem("docWidth", newWidth);
      setSettings((prev) => ({
        ...prev,
        docConfig: {
          ...prev.docConfig,
          width: newWidth,
        },
      }));
    };
    document.onmouseup = () => {
      console.log("mouseup");
      document.body.style.cursor = "default";
      resize = false;
    };
  };

  const handleEditField = (field, i) => {
    if (field?.type === "durationEnd") return;
    handleResetShowAdd(false);
    setCurrentFieldType(field.type);
    setCurrentField({
      ...field,
      index: i,
    });
  };

  const handleCloseDocView = () => {
    setCurrentFlowPlanNode(null);
    setNode(null);
  };

  const handleFullScreen = () => {
    setSettings((prev) => ({
      ...prev,
      docConfig: {
        ...prev.docConfig,
        fullscreen: prev.docConfig.fullscreen !== "true" ? "true" : "false",
      },
    }));
    localStorage.setItem(
      "fullscreen",
      docConfig.fullscreen !== "true" ? "true" : "false"
    );
  };

  const handleResetShowAdd = (delay = true) => {
    setTimeout(
      () => {
        setShowAdd(() => ({
          show: false,
          index: null,
        }));
      },
      delay ? 200 : 0
    );
  };

  const handleNavigation = (node) => {
    if (!node) return;
    setCurrentFlowPlanNode(node);
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

  const handleCalculateCustomProgress = (node, selected = undefined) => {
    let info = {
      total: 0,
      completed: 0,
    };

    let filtered = selected?.filter((i) => i?.id === node?.id);
    if (filtered.length > 0) {
      node?.data.forEach((item) => {
        if (item?.type === "taskList") {
          if (item?.config?.repeat) return;
          let filteredList = filtered[0]?.tasks?.filter(
            (i) => i?.id === item?.id
          );
          if (filteredList.length === 0) return;
          if (filteredList[0]?.id !== item?.id) return;
          if (!filteredList[0]?.selected) return;
          item.data.list.forEach((task) => {
            info.total++;
            if (task.completed) {
              info.completed++;
            }
          });
        }
      });
    }
    if (node.children.length > 0) {
      node.children.forEach((item) => {
        const childInfo = handleCalculateCustomProgress(item, selected);
        info.total += childInfo.total;
        info.completed += childInfo.completed;
      });
    }
    return info;
  };

  const handleCalculateProgressCustom = (node, selected) => {
    let info = {
      total: 0,
      completed: 0,
    };
    info = handleCalculateCustomProgress(node, selected);
    return info.total === 0 ? 100 : (info.completed / info.total) * 100;
  };

  const handleCalculateProgressField = (type) => {
    try {
      if (type === "doc") {
        return handleCalculateProgressCurrentDoc();
      } else if (type === "docChild") {
        return handleCalculateProgressCurrentDocAndChild(node);
      } else if (type === "docAll") {
        return handleCalculateProgressCurrentDocAndChild(currentFlowPlan.root);
      } else if (type === "custom") {
        return handleCalculateProgressCustom(
          currentFlowPlan.root,
          node?.data[node?.pin?.index]?.data?.progress?.selected
        );
      }
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  // Function to scroll to the bottom
  const handleScrollToBottom = () => {
    if (scrollableDiv.current) {
      scrollableDiv.current.scrollTop = scrollableDiv.current.scrollHeight;
    }
  };

  // Function to scroll to the top
  const handleScrollToTop = () => {
    if (scrollableDiv.current) {
      scrollableDiv.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if (
      !(
        node?.pin?.show &&
        node?.data[node?.pin?.index] &&
        node?.pin?.id === node?.data[node?.pin?.index].id
      )
    )
      return;
    setProgress(
      handleCalculateProgressField(
        node?.data[node?.pin?.index]?.data?.progress?.type
      )
    );
  }, [node]);

  useEffect(() => {
    if (!currentFlowPlanNode) {
      setNode(null);
      return;
    }
    let root = currentFlowPlan.root;
    let node = root;
    let parentNodeChildrenLength = null;
    const currentFlowPlanNodeLength = currentFlowPlanNode.length;
    currentFlowPlanNode.forEach((i, index) => {
      if (index === currentFlowPlanNodeLength - 1) {
        parentNodeChildrenLength = node.children.length;
      }
      node = node.children[i];
    });
    setNode(node);

    let tempNodeNavigation = structuredClone(nodeNavigation);
    if (currentFlowPlanNodeLength === 0) {
      tempNodeNavigation.parent = null;
      tempNodeNavigation.preSibling = null;
      tempNodeNavigation.nextSibling = null;
      tempNodeNavigation.firstChild =
        currentFlowPlan.root.children.length === 0 ? null : [0];
    } else if (currentFlowPlanNodeLength === 1) {
      tempNodeNavigation.preSibling =
        currentFlowPlanNode[0] === 0 ? null : [currentFlowPlanNode[0] - 1];
      tempNodeNavigation.nextSibling =
        currentFlowPlanNode[0] + 1 > parentNodeChildrenLength - 1
          ? null
          : [currentFlowPlanNode[0] + 1];
      tempNodeNavigation.parent = [];
      tempNodeNavigation.firstChild =
        node.children.length === 0 ? null : currentFlowPlanNode.concat(0);
    } else {
      tempNodeNavigation.parent = currentFlowPlanNode.slice(0, -1);
      tempNodeNavigation.preSibling =
        currentFlowPlanNode[currentFlowPlanNodeLength - 1] === 0
          ? null
          : currentFlowPlanNode
              .slice(0, -1)
              .concat(currentFlowPlanNode[currentFlowPlanNodeLength - 1] - 1);
      tempNodeNavigation.nextSibling =
        currentFlowPlanNode[currentFlowPlanNodeLength - 1] + 1 >
        parentNodeChildrenLength - 1
          ? null
          : currentFlowPlanNode
              .slice(0, -1)
              .concat(currentFlowPlanNode[currentFlowPlanNodeLength - 1] + 1);
      tempNodeNavigation.firstChild =
        node.children.length === 0 ? null : currentFlowPlanNode.concat(0);
    }
    setNodeNavigation(tempNodeNavigation);
  }, [currentFlowPlanNode]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = scrollableDiv.current;
      if (scrollable) {
        const isAtTop = scrollable?.scrollTop === 0;
        const isAtBottom =
          scrollable?.scrollHeight - scrollable?.scrollTop ===
          scrollable?.clientHeight;
        const canScroll = scrollable?.scrollHeight > scrollable?.clientHeight;
        setIsScrollable(canScroll);
        setIsScrolledDown(!isAtTop);
        setScrolledUp(!isAtBottom);
      }
    };

    const scrollable = scrollableDiv.current;
    if (scrollable) {
      scrollable?.addEventListener("scroll", handleScroll);
      handleScroll(); // Initialize the state based on current scroll position
    }

    return () => {
      if (scrollable) {
        scrollable?.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      style={{
        width: `${
          docConfig?.fullscreen === "true" ? "100vw" : `${docConfig.width}px`
        }`,
      }}
      className={`${
        // if addEditNode.show is true then show component else hide component
        !node ? "translate-x-full" : ""
      } z-10 transition-all duration-200 max-md:w-full max-w-[100vw] w-[750px] bg-[var(--bg-secondary)]  px-1 grow-0 h-full absolute right-0 top-0 text-gray-200 flex flex-col justify-between items-center gap-1 border-l-2 border-[var(--border-primary)]`}
    >
      <button
        onMouseDown={handleMouseDown}
        className="w-[2px] hover:w-2 transition-all bg-[var(--border-primary)] z-[20] h-full absolute top-0 -left-1 cursor-ew-resize"
      ></button>
      <div
        style={
          node?.pin?.show &&
          node?.data[node?.pin?.index] &&
          node?.pin?.id === node?.data[node?.pin?.index].id
            ? {
                height: "60px",
                paddingBottom: "5px",
              }
            : { height: "35px" }
        }
        className="absolute flex flex-col justify-between items-center top-0 z-10 w-full h-[35px] bg-[var(--border-primary)] px-2"
      >
        <div className="flex justify-between items-center w-full h-fit">
          <button className="w-8 h-8 rounded-full" onClick={handleCloseDocView}>
            <CloseBtnIcon />
          </button>
          {showNodeNavigation && (
            <button
              style={{
                cursor: !nodeNavigation.parent ? "not-allowed" : "pointer",
                opacity: !nodeNavigation.parent ? "0.5" : "1",
              }}
              onClick={() => handleNavigation(nodeNavigation.parent)}
              className="w-24 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
              disabled={!nodeNavigation.parent}
            >
              <span className="block w-3 h-3 rotate-180">
                <BackIcon />
              </span>
              <span>Parent</span>
            </button>
          )}

          <button
            className="w-8 h-8"
            onClick={() => setShowNodeNavigation((prev) => !prev)}
            title="Show Node Navigation"
          >
            <InheritIcon />
          </button>
          <button
            className="w-8 h-8 p-[6px]"
            onClick={() => setShowDocViewSettings((prev) => !prev)}
            title="Document View Settings"
          >
            <SettingsIcon />
          </button>
          {showNodeNavigation && (
            <button
              style={{
                cursor: !nodeNavigation.firstChild ? "not-allowed" : "pointer",
                opacity: !nodeNavigation.firstChild ? "0.5" : "1",
              }}
              onClick={() => handleNavigation(nodeNavigation.firstChild)}
              className="w-28 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
              disabled={!nodeNavigation.firstChild}
            >
              <span>First Child</span>
              <span className="block w-3 h-3">
                <BackIcon />
              </span>
            </button>
          )}
          <button onClick={handleFullScreen} className="w-5 h-5 rounded-full">
            <FullScreenIcon />
          </button>
        </div>
        {showDocViewSettings && (
          <div className="bg-[var(--bg-tertiary)]  rounded-md">
            <AddToQuickAccess
              node={node}
              currentFlowPlanNode={currentFlowPlanNode}
            />
          </div>
        )}
        {node?.pin?.show &&
          node?.data[node?.pin?.index] &&
          node?.pin?.id === node?.data[node?.pin?.index].id && (
            <ProgressBar
              progress={progress}
              border={true}
              color={node?.data[node?.pin?.index]?.config?.color}
              multiColor={node?.data[node?.pin?.index]?.config?.multiColor}
              showPercentage={
                node?.data[node?.pin?.index]?.config?.showPercentage
              }
            />
          )}
      </div>
      <div
        style={
          node?.pin?.show &&
          node?.data[node?.pin?.index] &&
          node?.pin?.id === node?.data[node?.pin?.index].id
            ? {
                height: "calc(100% - 60px)",
                marginTop: "60px",
              }
            : { height: `calc(100% - ${showNodeNavigation ? "78px" : "35px"}` }
        }
        className="mt-[35px] w-full flex flex-col justify-start items-center"
      >
        <div
          ref={scrollableDiv}
          className="relative scroll-smooth w-full h-full flex flex-col justify-start items-center gap-1 overflow-y-auto p-1 pb-14 overflow-x-hidden"
        >
          {isScrollable && (
            <div className="flex flex-col gap-1 fixed right-5 bottom-11  z-[100]">
              {isScrolledDown && (
                <button
                  className="p-2 bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] rounded-full"
                  onClick={handleScrollToTop}
                >
                  <span className="block w-3 h-3 -rotate-90">
                    <BackIcon />
                  </span>
                </button>
              )}
              {isScrolledUp && (
                <button
                  className="p-2 bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] rounded-full"
                  onClick={handleScrollToBottom}
                >
                  <span className="block w-3 h-3 rotate-90">
                    <BackIcon />
                  </span>
                </button>
              )}
            </div>
          )}
          <h3
            style={{
              fontSize: `${node?.config?.titleConfig?.fontSize}px`,
              textDecoration: `${
                node?.config?.titleConfig?.strickthrough
                  ? "line-through"
                  : "none"
              }`,
              fontStyle: `${
                node?.config?.titleConfig?.italic ? "italic" : "normal"
              }`,
              fontWeight: `${
                node?.config?.titleConfig?.bold ? "bold" : "normal"
              }`,
              color: `${node?.config?.titleConfig?.color}`,
              fontFamily: `${node?.config?.titleConfig?.fontFamily}`,
              // borderColor: `${node?.config?.nodeConfig?.borderColor}`,
            }}
            className="shrink-0 text-[var(--text-primary)] relative w-full text-left text-2xl border-b border-[var(--border-primary)] py-2 pb-3 px-2  transition-colors duration-300"
          >
            {node?.title}
          </h3>
          <div className="w-full h-fit flex justify-between px-2">
            {node?.createdAt && (
              <span className="block text-xs  text-[var(--text-secondary)]">
                <span className="">Created: </span>
                <TimeAndDate
                  absolute={false}
                  timeDate={new Date(node?.createdAt)}
                />
              </span>
            )}
            {node?.updatedAt && (
              <span className="block text-xs text-[var(--text-secondary)]">
                <span className="">Updated: </span>
                <TimeAndDate
                  absolute={false}
                  timeDate={new Date(node?.updatedAt)}
                />
              </span>
            )}
          </div>
          {node?.data?.length ? (
            <DocRenderViewContainer
              node={node}
              move={move}
              setMove={setMove}
              setNode={setNode}
              showAdd={showAdd}
              setShowAdd={setShowAdd}
              currentField={currentField}
              setCurrentField={setCurrentField}
              currentFieldType={currentFieldType}
              setCurrentFieldType={setCurrentFieldType}
              handleEditField={handleEditField}
              handleResetShowAdd={handleResetShowAdd}
            />
          ) : (
            <div className=" flex justify-center items-center flex-col">
              <p className="text-[var(--text-primary)]">
                Add Something From Below Menu
              </p>
            </div>
          )}
          {!currentField?.id && !showAdd.show && (
            <AddEditField
              setShowAdd={setShowAdd}
              setCurrentFieldType={setCurrentFieldType}
              node={node}
              setNode={setNode}
              type={currentFieldType}
              currentField={currentField}
              setCurrentField={setCurrentField}
              currentFieldType={currentFieldType}
              dataIndex={null}
              handleResetShowAdd={handleResetShowAdd}
            />
          )}

          <MenuButtons
            node={node}
            setCurrentField={setCurrentField}
            setType={setCurrentFieldType}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
          />
        </div>
      </div>
      {showNodeNavigation && (
        <div className="shrink-0 h-fit flex justify-between items-center w-full gap-5 mb-1">
          <button
            style={{
              cursor: !nodeNavigation.preSibling ? "not-allowed" : "pointer",
              opacity: !nodeNavigation.preSibling ? "0.5" : "1",
            }}
            onClick={() => handleNavigation(nodeNavigation.preSibling)}
            className="w-40 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
            disabled={!nodeNavigation.preSibling}
          >
            <span className="block w-3 h-3 rotate-180">
              <BackIcon />
            </span>
            <span>Previous Sibling</span>
          </button>
          <button
            style={{
              cursor: !nodeNavigation.nextSibling ? "not-allowed" : "pointer",
              opacity: !nodeNavigation.nextSibling ? "0.5" : "1",
            }}
            onClick={() => handleNavigation(nodeNavigation.nextSibling)}
            className="w-40 flex justify-center items-center gap-1 bg-[var(--bg-tertiary)] p-1 rounded-md"
            disabled={!nodeNavigation.nextSibling}
          >
            <span>Next Sibling</span>
            <span className="block w-3 h-3">
              <BackIcon />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default DisplayDocView;
