import React, { Fragment, useEffect, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ResetIcon from "../../assets/Icons/ResetIcon";
import TestDisplayNode from "../TestDisplayNode";

const DisplayTree = ({ node }) => {
  const { db, currentTreeNote, move, update, animation } = useStateContext();
  const [scaleMultiplier, setScaleMultiplier] = useState(0.1);
  const [init, setInit] = useState(animation ? false : true);
  const [svgSize, setSvgSize] = useState({
    width: init ? 0 : currentTreeNote?.root?.fp * 250 * 2 - 30,
    height: init ? 0 : currentTreeNote?.root?.numberOfLevels * 200 - 100,
  });

  useEffect(() => {
    if (currentTreeNote?.root) {
      setTimeout(
        () => {
          setSvgSize({
            width: currentTreeNote?.root?.fp * 250 * 2 - 30,
            height: currentTreeNote?.root?.numberOfLevels * 200 - 100,
          });
        },
        !animation || init ? 0 : 1000
      );
    }
  }, [update]);

  useEffect(() => {
    if (!animation) return;
    setTimeout(() => {
      setInit(true);
    }, 1000);
  }, []);

  return (
    <div className="hide-scroll-bar relative h-full grow bg-gray-900 flex justify-center items-center overflow-hidden cursor-grab">
      <TransformWrapper
        minScale={0.1}
        limitToBounds={false}
        wheel={{ step: scaleMultiplier }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <Fragment>
            <TransformComponent>
              <div className="active:cursor-grabbing min-w-[100vw] min-h-[100vh] relative bg-gray-900 flex justify-center items-start  transition-all duration-100 p-2">
                <svg
                  style={{
                    width: svgSize.width + "px",
                    height: svgSize.height + "px",
                    transition: animation ? "all 1s ease-in-out" : "none",
                  }}
                  className="absolute overflow-visible duration-500"
                >
                  <Paths
                    key={"path-" + currentTreeNote?.root?.id}
                    node={currentTreeNote?.root}
                    r={currentTreeNote?.root?.fp}
                    init={init}
                    animation={animation}
                  />
                  {move?.node && <LivePath move={move} rootRef={treeRef} />}
                </svg>
                <TestDisplayNode node={currentTreeNote?.root} />
              </div>
            </TransformComponent>
            <div className="absolute bottom-2 right-2 flex flex-col justify-center items-end gap-2">
              <input
                value={scaleMultiplier}
                onChange={(e) => setScaleMultiplier(e.target.value)}
                type="number"
                className="w-9 h-9 outline-none border-none flex justify-center text-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100"
              />
              <button
                onClick={() => zoomIn(scaleMultiplier)}
                className="w-9 h-9 flex justify-center items-center bottom-12 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-zoom-in"
              >
                <span className="absolute block w-1 rounded-md h-6 bg-gray-200"></span>
                <span className="absolute block w-6 rounded-md h-1 bg-gray-200"></span>
              </button>
              <button
                onClick={() => zoomOut(scaleMultiplier)}
                className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-zoom-out"
              >
                <span className="absolute block w-6 rounded-md h-1 bg-gray-200"></span>
              </button>
              <button
                onClick={() => resetTransform()}
                className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-progress"
              >
                <ResetIcon />
              </button>
            </div>
          </Fragment>
        )}
      </TransformWrapper>
    </div>
  );
};

export default DisplayTree;

const Paths = ({ node, i = 0, d = 0, c = 1, init, animation }) => {
  const { update } = useStateContext();
  const [path, setPath] = useState(
    animation && init
      ? `M${i - 15} ${d} 
      C ${i - 15} ${d}, ${i - 15} ${d}, 
      ${i - 15} ${d}
     `
      : `M${i - 15} ${d}
         C ${i - 15} ${d + 100 - 20}, ${node?.fp * 250 - 15} ${d},
         ${node?.fp * 250 - 15} ${d + 100 + 30}
        `
  );
  useEffect(() => {
    if (!init) return;
    setPath(
      `M${i - 15} ${d}
          C ${i - 15} ${d + 100 - 20}, ${node?.fp * 250 - 15} ${d},
          ${node?.fp * 250 - 15} ${d + 100 + 30}
        `
    );
  }, [update]);
  return (
    <>
      {d !== 0 && (
        <path
          id="curve"
          d={path}
          style={{
            transition: animation ? "all 1s ease-in-out" : "none",
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
              init={init}
              animation={animation}
            />
          );
        })}
    </>
  );
};

const LivePath = ({ move, rootRef }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    try {
      const { p1x, p1y, p2x, p2y } = move.position;
      console.log(p1x, p1y, p2x, p2y);
      if (p1x === p2x && p1y === p2y) {
        setPath(`M${p1x} ${p1y} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${p2x} ${p2y}`);
      } else if (p1x === p2x) {
        setPath(`M${p1x} ${p1y} ${p2x} ${p2y}`);
      } else if (p2y <= p1y) {
        setPath(
          `M${p1x} ${p1y} C ${p1x} ${p2y + 30}, ${p2x} ${
            p2y + 150
          }, ${p2x} ${p2y}`
        );
      } else {
        setPath(
          `M${p1x} ${p1y} C ${p1x} ${p1y - 200}, ${p2x} ${
            p2y + 200
          }, ${p2x} ${p2y}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, [move.position]);

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
            style={{ stroke: move?.position?.color }}
            className="neon-path-1 fade-in-path opacity-0 stroke-current transition-all duration-200"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
          ></path>
          <path
            id="curve"
            style={{ stroke: move?.position?.color }}
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
