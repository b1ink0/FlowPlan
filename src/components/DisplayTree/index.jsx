// @ts-check
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ResetIcon from "../../assets/Icons/ResetIcon";
import DisplayNode from "../DisplayNode";

const DisplayTree = ({ node }) => {
  // destructure state from context
  const { currentTreeNote, move, update, animation } = useStateContext();
  // local state
  const [scaleMultiplier, setScaleMultiplier] = useState(0.1);

  return (
    <div className="hide-scroll-bar relative h-full grow bg-gray-900 flex justify-center items-center overflow-hidden cursor-grab">
      {/* Transform component for zoom and drag */}
      <TransformWrapper
        minScale={0.1}
        limitToBounds={false}
        wheel={{ step: scaleMultiplier }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <TransformComponent>
              {/* Wrapper for svg and node */}
              <div className="active:cursor-grabbing min-w-[100vw] min-h-[100vh] relative bg-gray-900 flex justify-center items-start  transition-all duration-100 p-2">
                {/* Svg for paths */}
                <Svg
                  currentTreeNote={currentTreeNote}
                  update={update}
                  animation={animation}
                  move={move}
                />
                {/* Node for displaying tree */}
                <DisplayNode node={currentTreeNote?.root} />
              </div>
            </TransformComponent>
            {/* Zoom helper for zoom in, zoom out and reset transform */}
            <ZoomHelper
              scaleMultiplier={scaleMultiplier}
              setScaleMultiplier={setScaleMultiplier}
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

const ZoomHelper = ({
  scaleMultiplier,
  setScaleMultiplier,
  zoomIn,
  zoomOut,
  resetTransform,
}) => {
  return (
    <div className="absolute bottom-2 right-2 flex flex-col justify-center items-end gap-2">
      {/* Input for scaleMultiplier */}
      <input
        value={scaleMultiplier}
        onChange={(e) => setScaleMultiplier(e.target.value)}
        type="number"
        className="w-9 h-9 outline-none border-none flex justify-center text-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100"
      />
      {/* Buttons for zoom in */}
      <button
        onClick={() => zoomIn(scaleMultiplier)}
        className="w-9 h-9 flex justify-center items-center bottom-12 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-zoom-in"
      >
        <span className="absolute block w-1 rounded-md h-6 bg-gray-200"></span>
        <span className="absolute block w-6 rounded-md h-1 bg-gray-200"></span>
      </button>
      {/* Buttons for zoom out */}
      <button
        onClick={() => zoomOut(scaleMultiplier)}
        className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-zoom-out"
      >
        <span className="absolute block w-6 rounded-md h-1 bg-gray-200"></span>
      </button>
      {/* Buttons for reset transform */}
      <button
        onClick={() => resetTransform()}
        className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-progress"
      >
        <ResetIcon />
      </button>
    </div>
  );
};

const Svg = ({ currentTreeNote, update, move }) => {
  // local state
  // svgSize is used to set width and height of svg
  const [svgSize, setSvgSize] = useState(null);
  // showPaths is used to show paths after svgSize is set
  const [showPaths, setShowPaths] = useState(true);

  // set svgSize after tree is updated is set
  useEffect(() => {
    // if currentTreeNote is null then return
    if (!currentTreeNote?.root) return;
    setSvgSize({
      width: currentTreeNote?.root?.fp * 250 * 2 - 30,
      height: currentTreeNote?.root?.numberOfLevels * 200 - 100,
    });
  }, [update]);

  useEffect(() => {
    setShowPaths(false);
    setTimeout(() => {
      setShowPaths(true);
    }, 500);
  }, [svgSize]);

  if (!showPaths || !svgSize) return <></>;

  return (
    <svg
      style={{
        width: svgSize?.width + "px",
        height: svgSize?.height + "px",
        transition: "all 0.5s ease-in-out",
      }}
      className="absolute overflow-visible duration-500"
    >
      <Paths
        key={"path-" + currentTreeNote?.root?.id}
        node={currentTreeNote?.root}
        r={currentTreeNote?.root?.fp}
        delay={0}
      />
      {move?.node && <LivePath move={move} />}
    </svg>
  );
};

const Paths = ({ node, i = 0, d = 0, c = 1, animation, delay = 0 }) => {
  const { update } = useStateContext();
  const [path, setPath] = useState(
    `M${i - 15} ${d}
     C ${i - 15} ${d + 100 - 20}, ${node?.fp * 250 - 15} ${d},
     ${node?.fp * 250 - 15} ${d + 100 + 30}
    `
  );
  useEffect(() => {
    setTimeout(() => {
      setPath(
        `M${i - 15} ${d}
          C ${i - 15} ${d + 100 - 20}, ${node?.fp * 250 - 15} ${d},
          ${node?.fp * 250 - 15} ${d + 100 + 30}
        `
      );
    }, 500);
  }, [update]);

  return (
    <>
      {d !== 0 && (
        <path
          id="curve"
          d={path}
          style={{
            transition: "all 0.5s ease-in-out",
          }}
          className={`fade-in-path opacity-0 stroke-current text-gray-600 duration-500 delay-1000`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
        ></path>
      )}
      {node?.expanded &&
        node?.children?.map((child, i) => {
          return (
            <Paths
              key={"path-" + child.id}
              node={child}
              i={node?.fp * 250}
              d={200 * c - 100}
              c={c + 1}
              delay={delay + 500}
            />
          );
        })}
    </>
  );
};

const LivePath = ({ move }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    try {
      const { x1, y1, x2, y2 } = move.translate;
      console.log(x1, y1, x2, y2);
      if (x1 === x2 && y1 === y2) {
        setPath(`M${x1} ${y1} C ${x1} ${y1}, ${x2} ${y2}, ${x2} ${y2}`);
      } else if (x1 === x2) {
        setPath(`M${x1} ${y1} ${x2} ${y2}`);
      } else if (y2 <= y1) {
        setPath(
          `M${x1} ${y1} C ${x1} ${y2 + 30}, ${x2} ${y2 + 150}, ${x2} ${y2}`
        );
      } else {
        setPath(
          `M${x1} ${y1} C ${x1} ${y1 - 200}, ${x2} ${y2 + 200}, ${x2} ${y2}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [move.translate]);

  useEffect(() => {
    if (move?.node === null) {
      // setPath("");
    }
  }, [move.node]);

  return (
    <>
      {path !== "" && (
        <>
          <path
            id="curvee"
            d={path}
            style={{ stroke: move?.color }}
            className="neon-path-1 fade-in-path opacity-0 stroke-current transition-all duration-200"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
          ></path>
          <path
            id="curve"
            style={{ stroke: move?.color }}
            d={path}
            className="neon-path-2 fade-in-path opacity-0 stroke-current transition-all duration-200"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
          ></path>
        </>
      )}
    </>
  );
};

export default DisplayTree;
