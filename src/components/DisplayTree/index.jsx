// @ts-check
import React, { useContext, useEffect, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ResetIcon from "../../assets/Icons/ResetIcon";
import DisplayNode from "../DisplayNode";
import Background from "../Background";

const DisplayTree = ({ node }) => {
  // destructure state from context
  const {
    settings,
    setSettings,
    currentFlowPlan,
    move,
    update,
    animation,
    currentTransformState,
  } = useStateContext();
  const { treeConfig } = settings;
  // local state
  const transformState =
    treeConfig.useSavedTransformState === "true"
      ? JSON.parse(localStorage.getItem("currentTransformState"))
      : treeConfig.renderType === "verticalTree"
      ? {
          positionX: 0,
          positionY: 200,
          scale: 1,
        }
      : {
          positionX: 300,
          positionY: 0,
          scale: 1,
        };

  return (
    <div className="hide-scroll-bar relative h-full grow  flex justify-center items-center overflow-hidden cursor-grab">
      <Background />
      {/* Transform component for zoom and drag */}
      <TransformWrapper
        doubleClick={{ disabled: true }}
        minScale={0.1}
        limitToBounds={false}
        wheel={{ step: treeConfig.scaleMultiplier }}
        initialPositionX={transformState?.positionX}
        initialPositionY={transformState?.positionY}
        initialScale={transformState?.scale ?? 1}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <TransformComponent>
              {/* Wrapper for svg and node */}
              <div
                style={{
                  justifyContent:
                    treeConfig.renderType === "verticalTree"
                      ? "center"
                      : "flex-start",
                  alignItems:
                    treeConfig.renderType === "verticalTree"
                      ? "flex-start"
                      : "center",
                }}
                className=" active:cursor-grabbing min-w-[100vw] min-h-[100vh] relative  flex  transition-all duration-100 p-2"
              >
                {/* Svg for paths */}
                <Svg
                  settings={settings}
                  currentFlowPlan={currentFlowPlan}
                  update={update}
                  move={move}
                />
                {/* Node for displaying tree */}
                <DisplayNode node={currentFlowPlan?.root} />
              </div>
            </TransformComponent>
            {/* Zoom helper for zoom in, zoom out and reset transform */}
            <ZoomHelper
              rest={rest}
              settings={settings}
              setSettings={setSettings}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetTransform={resetTransform}
            />
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

// Zoom helper for zoom in, zoom out and reset transform
const ZoomHelper = ({
  rest,
  settings,
  setSettings,
  zoomIn,
  zoomOut,
  resetTransform,
}) => {
  // destructure tree configuration from settings
  const { treeConfig } = settings;
  const { setCurrentTransformState } = useStateContext();

  const handleResetTransform = () => {
    const x = treeConfig.renderType === "verticalTree" ? 0 : 300;
    const y = treeConfig.renderType === "verticalTree" ? 200 : 0;
    rest?.setTransform(x, y, 1);
  };

  useEffect(() => {
    if (treeConfig.useSavedTransformState === "false") return;
    let interval = setInterval(() => {
      setCurrentTransformState(() => {
        localStorage.setItem(
          "currentTransformState",
          JSON.stringify(rest?.instance?.transformState)
        );
        return rest?.instance?.transformState;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [treeConfig.useSavedTransformState]);
  return (
    <div className="absolute bottom-2 right-2 flex flex-col justify-center items-end gap-2">
      {/* Input for scaleMultiplier */}
      <input
        value={treeConfig.scaleMultiplier}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev,
            treeConfig: { ...prev.treeConfig, scaleMultiplier: e.target.value },
          }))
        }
        type="number"
        className="text-[var(--text-primary)] w-9 h-9 outline-none border-none flex justify-center text-center items-center bottom-2 right-2 z-10 p-1 bg-[var(--btn-secondary)] rounded-lg"
      />
      {/* Buttons for zoom in */}
      <button
        onClick={() => zoomIn(treeConfig.scaleMultiplier)}
        className="w-9 h-9 flex justify-center items-center bottom-12 right-2 z-10 p-1 bg-[var(--btn-secondary)] rounded-lg text-gray-100 cursor-zoom-in"
      >
        <span className="absolute block w-1 rounded-md h-6 bg-[var(--logo-primary)]"></span>
        <span className="absolute block w-6 rounded-md h-1 bg-[var(--logo-primary)]"></span>
      </button>
      {/* Buttons for zoom out */}
      <button
        onClick={() => zoomOut(treeConfig.scaleMultiplier)}
        className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-[var(--btn-secondary)] rounded-lg text-gray-100 cursor-zoom-out"
      >
        <span className="absolute block w-6 rounded-md h-1 bg-[var(--logo-primary)]"></span>
      </button>
      {/* Buttons for reset transform */}
      <button
        onClick={handleResetTransform}
        className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-[var(--btn-secondary)] rounded-lg text-gray-100 cursor-progress"
      >
        <ResetIcon />
      </button>
    </div>
  );
};

// Svg wrapper for paths
const Svg = ({ settings, currentFlowPlan, update, move }) => {
  // destructure node configuration from settings
  const { nodeConfig, treeConfig } = settings;
  // local state
  // svgSize is used to set width and height of svg
  const [svgSize, setSvgSize] = useState(null);
  // showPaths is used to show paths after svgSize is set
  const [showPaths, setShowPaths] = useState(true);

  // calculate width and height of svg after tree is updated
  const handleResize = () => {
    let w =
      // currentFlowPlan?.root?.fp is mid point and location of root node
      // nodeConfig.nodeWidthMargin is width with margin of node
      // nodeConfig.nodeWidth is width of node
      // currentFlowPlan?.root?.fp * nodeConfig.nodeWidthMargin gives width of half of tree so multiply by 2
      treeConfig.renderType === "verticalTree"
        ? // if tree is vertical then multiply by nodeConfig.nodeWidthMargin
          currentFlowPlan?.root?.fp * nodeConfig.nodeWidthMargin * 2 -
          // subtract nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth to get width of svg without margin
          (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth)
        : // if tree is horizontal then multiply by nodeConfig.nodeWidth
          currentFlowPlan?.root?.fp * nodeConfig.nodeHeightMargin * 2 -
          // subtract nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth to get width of svg without margin
          (nodeConfig.nodeHeightMargin - nodeConfig.nodeHeight) * 1;
    let h =
      // currentFlowPlan?.root?.numberOfLevels is number of levels in tree
      // nodeConfig.nodeHeightMargin is height with margin of node
      // nodeConfig.nodeHeight is height of node
      // currentFlowPlan?.root?.numberOfLevels * nodeConfig.nodeHeightMargin gives height of half of tree so multiply by 2

      treeConfig.renderType === "verticalTree"
        ? // if tree is vertical then multiply by nodeConfig.nodeHeightMargin
          currentFlowPlan?.root?.numberOfLevels *
            nodeConfig.nodeHeightMargin *
            2 -
          nodeConfig.nodeHeightMargin
        : // else multiply by nodeConfig.nodeWidth + nodeConfig.nodeHeight
          currentFlowPlan?.root?.numberOfLevels *
            (nodeConfig.nodeWidth + nodeConfig.nodeHeight) *
            1 -
          // subtract nodeConfig.nodeHeight to get height of svg without margin
          nodeConfig.nodeHeight;
    return {
      width: w,
      height: h,
    };
  };

  // set svgSize after tree is updated is set
  useEffect(() => {
    // if currentFlowPlan is null then return
    if (!currentFlowPlan?.root) return;
    setSvgSize(handleResize());
  }, [update, treeConfig.renderType]);

  // hide paths after svgSize is set and show paths after 500ms
  // this is done to prevent paths from animating when tree is updated
  useEffect(() => {
    setShowPaths(false);
    setTimeout(() => {
      setShowPaths(true);
    }, 500);
  }, [svgSize]);

  // when paths are hidden or svgSize is not set then return empty fragment
  if (!showPaths || !svgSize) return <></>;

  return (
    <svg
      style={{
        width:
          treeConfig.renderType === "verticalTree"
            ? // if tree is vertical then width is width of svg
              svgSize?.width + "px"
            : // else width is height of svg
              svgSize?.height + "px",
        height:
          treeConfig.renderType === "verticalTree"
            ? // if tree is vertical then height is height of svg
              svgSize?.height + "px"
            : // else height is width of svg
              svgSize?.width + "px",
        transition: "all 0.5s ease-in-out",
      }}
      className="absolute overflow-visible duration-500"
    >
      {/* Paths for tree */}
      <Paths
        key={"path-" + currentFlowPlan?.root?.id}
        node={currentFlowPlan?.root}
      />
      {/* Paths for live node when moving node */}
      {move?.node && <LivePath move={move} />}
    </svg>
  );
};

// Paths for tree
const Paths = ({ node, parentPosition = { x: 0, y: 0 }, level = 1 }) => {
  // destructure state from context
  const { settings } = useStateContext();
  // destructure node configuration from settings
  const { nodeConfig, treeConfig } = settings;

  // calculate path for node
  const handlePath = () => {
    // initialize path
    let path = "";
    let x1, y1, x2, y2, x3, y3, x4, y4;
    let adjust1, adjust2, adjust3;

    // strucutre of path
    // M x1 y1 C x2 y2, x3 y3, x4 y4
    // M is move to
    // C is curve to
    // x1 y1 is starting point
    // x2 y2 is first control point to adjust curve
    // x3 y3 is second control point to adjust curve
    // x4 y4 is end point

    // initializing some variables for adjusting path
    adjust2 = nodeConfig.nodeHeightMargin;

    // calculating starting point
    if (treeConfig.renderType === "verticalTree") {
      adjust1 = (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2;
      adjust3 = 24;
      // if tree is vertical then starting point is parentPosition.x + adjust1 and parentPosition.y
      x1 = parentPosition.x - adjust1;
      y1 = parentPosition.y + adjust3 - 1;
      x2 = parentPosition.x - adjust1;
      y2 = parentPosition.y + adjust2 - adjust1 * 2;
      x3 = node?.fp * nodeConfig.nodeWidthMargin - adjust1;
      y3 = parentPosition.y + adjust1 * 2;
      x4 = node?.fp * nodeConfig.nodeWidthMargin - adjust1;
      y4 = parentPosition.y + adjust2 - adjust1 * 2;
    } else {
      adjust1 = (nodeConfig.nodeHeightMargin - nodeConfig.nodeHeight) / 2;
      adjust3 = 24;
      // else starting point is parentPosition.x - adjust1 and parentPosition.y + adjust1 * 2
      y1 = parentPosition.x - adjust1;
      x1 = parentPosition.y + adjust1 * 2 + adjust3 - 1;
      y2 = parentPosition.x - adjust1;
      x2 = parentPosition.y + adjust2 - adjust1 * 2;
      y3 = node?.fp * nodeConfig.nodeHeightMargin - adjust1;
      x3 = parentPosition.y + adjust1 * 2 + adjust3 - 1;
      y4 = node?.fp * nodeConfig.nodeHeightMargin - adjust1;
      x4 = parentPosition.y + adjust2;
    }

    // finalizing path
    path = `M${x1} ${y1} C ${x2} ${y2}, ${x3} ${y3}, ${x4} ${y4}`;
    // return path for node
    return path;
  };

  // initialize path
  let path = handlePath();

  useEffect(() => {
    path = handlePath();
  }, [treeConfig.renderType]);

  return (
    <>
      {/* don't show for root node */}
      {parentPosition.y !== 0 && (
        <path
          id="curve"
          d={path}
          className={`fade-in-path opacity-0 stroke-current text-[var(--path-primary)] duration-500 delay-1000`}
          style={{
            transition: "all 0.5s ease-in-out",
            color: node?.config?.nodeConfig?.pathColor,
          }}
          ref={(n) =>
            n?.style?.setProperty(
              "opacity",
              // "0.5",
              `${node?.config?.nodeConfig?.opacity / 100}`,
              "important"
            )
          }
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
        ></path>
      )}
      {/* do not show if children are hidden */}
      {node?.expanded &&
        // loop through children
        node?.children?.map((child, i) => {
          return (
            <Paths
              key={"path-" + child.id}
              node={child}
              // parentPosition is used to calculate path for child
              parentPosition={{
                x:
                  treeConfig.renderType === "verticalTree"
                    ? // if tree is vertical then x is node?.fp * nodeConfig.nodeWidthMargin
                      node?.fp * nodeConfig.nodeWidthMargin
                    : // else x is node?.fp * nodeConfig.nodeHeightMargin
                      node?.fp * nodeConfig.nodeHeightMargin,
                y:
                  treeConfig.renderType === "verticalTree"
                    ? // if tree is vertical then y is nodeConfig.nodeHeightMargin * 1 * level
                      nodeConfig.nodeHeight * 2 * level - nodeConfig.nodeHeight
                    : // else y is nodeConfig.nodeWidth + nodeConfig.nodeHeight * 1 * level
                      (nodeConfig.nodeWidth + nodeConfig.nodeHeight) *
                        1 *
                        level -
                      nodeConfig.nodeHeightMargin,
              }}
              level={level + 1}
            />
          );
        })}
    </>
  );
};

// Paths for live node when moving node
const LivePath = ({ move }) => {
  // destructure state from context
  const { settings } = useStateContext();
  // destructure node configuration from settings
  const { treeConfig, nodeConfig } = settings;
  // local state
  const [path, setPath] = useState("");
  const [parentPath, setParentPath] = useState("");

  const handlePath = () => {
    let { x1, y1, x2, y2, x3 } = move.translate;
    if (x3 === null) y2 = y2 + 22;
    if (treeConfig.renderType === "verticalTree") {
      switch (true) {
        // when node is moved to same position
        case x1 === x2 && y1 === y2:
          return `M${x1} ${y1} C ${x1} ${y1}, ${x2} ${y2}, ${x2} ${y2}`;

        // when node is moved to same x position
        case x1 === x2:
          return `M${x1} ${y1} ${x2} ${y2}`;

        // when node is moved to upper node
        case y2 <= y1:
          return `M${x1} ${y1} C ${x1} ${y2 + 30}, ${x2} ${
            y2 + 70
          }, ${x2} ${y2}`;

        // when node is moved to lower node
        default:
          return `M${x1} ${y1} C ${x1} ${y1 - 200}, ${x2} ${
            y2 + 200
          }, ${x2} ${y2}`;
      }
    } else {
      let tempX1 = x1,
        tempY1 = y1,
        tempX2 = x2,
        tempY2 = y2;

      x1 = tempY1;
      y1 = tempX1;
      x2 = tempY2;
      y2 = tempX2;
      switch (true) {
        // when node is moved to same position
        case x1 === x2 && y1 === y2:
          return `M${x1} ${y1} C ${x1} ${y1}, ${x2} ${y2}, ${x2} ${y2}`;

        // when node is moved to same x position
        case y1 === y2:
          return `M${x1} ${y1} ${x2} ${y2}`;

        // when node is moved to upper node
        case x2 <= x1:
          return `M${x1} ${y1} C ${x1 - 50} ${y2}, ${
            x2 + 50
          } ${y2}, ${x2} ${y2}`;

        // when node is moved to lower node
        default:
          return `M${x1} ${y1} C ${x1 - 200} ${y1}, ${
            x2 + 200
          } ${y2}, ${x2} ${y2}`;
      }
    }
  };

  // calculate parent path for live node when hover over reordering node
  const handleParentPath = () => {
    // if move.translate is not set then return
    if (move?.translate?.x3 === null) return "";
    // destructure move.translate
    let { x2, y2, x3, y3 } = move.translate;
    // local variables
    let x4, y4, x5, y5, x6, y6, x7, y7;
    let adjust1, adjust2, adjust3;
    // seting adjust2 to nodeConfig.nodeHeightMargin
    adjust2 = nodeConfig.nodeHeightMargin;
    if (treeConfig.renderType === "verticalTree") {
      adjust1 = (nodeConfig.nodeWidthMargin - nodeConfig.nodeWidth) / 2;
      adjust3 = nodeConfig.nodeWidthMargin * move.rootNodeFp;

      x4 = x3 + adjust3 - adjust1;
      y4 = y3 + nodeConfig.nodeHeight;
      x5 = x4;
      y5 = y4 + adjust2 - adjust1;
      x6 = x2;
      y6 = y4;
      x7 = x2;
      y7 = y2 - nodeConfig.nodeHeight;
    } else {
      adjust1 = (nodeConfig.nodeHeightMargin - nodeConfig.nodeHeight) / 2;
      adjust3 = nodeConfig.nodeHeightMargin * move.rootNodeFp;

      y4 = x3 + adjust3 - adjust1;
      x4 = y3 + nodeConfig.nodeWidth;
      y5 = y4;
      x5 = x4 + adjust2 - adjust1 * 4;
      y6 = x2;
      x6 = x4;
      y7 = x2;
      x7 = y2 - nodeConfig.nodeWidth;
    }

    return `M${x4} ${y4} C ${x5} ${y5}, ${x6} ${y6}, ${x7} ${y7}`;
  };

  useEffect(() => {
    // if move.translate is not set then return
    if (!move?.translate) return;

    // calculate path
    setPath(handlePath());
    // calulate parent path
    setParentPath(handleParentPath());
  }, [move.translate]);

  if (path === "") return <></>;

  return (
    <>
      {/* Main path */}
      <path
        id="curvee"
        d={path}
        style={{ stroke: move?.color }}
        className="neon-path-1 fade-in-path opacity-0 stroke-current transition-all duration-200"
        strokeWidth="4"
        strokeLinecap="round"
        fill="transparent"
      ></path>
      {/* Second path for neon effect */}
      <path
        id="curve"
        style={{ stroke: move?.color }}
        d={path}
        className="neon-path-2 fade-in-path opacity-0 stroke-current transition-all duration-200"
        strokeWidth="4"
        strokeLinecap="round"
        fill="transparent"
      ></path>
      {/* Parent path for reorder node */}
      {parentPath !== "" && (
        <path
          id="curve"
          d={parentPath}
          style={{ stroke: move?.color }}
          className="stroke-blue-600 fade-in-path opacity-0 transition-all duration-200"
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
        ></path>
      )}
    </>
  );
};

export default DisplayTree;
