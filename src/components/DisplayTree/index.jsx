import React, { Fragment, useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { v4 } from "uuid";
import DisplayNode from "../DisplayNode";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ResetIcon from "../../assets/Icons/ResetIcon";
import TestDisplayNode from "../TestDisplayNode";

const DisplayTree = ({ node }) => {
  const {
    db,
    currentTreeNote,
    setCurrentTreeNode,
    update,
    setUpdate,
    currentExpanded,
    move,
  } = useStateContext();
  const containerRef = useRef(null);
  const treeRef = useRef(null);
  const parentRef = useRef(null);

  const [paths, setPaths] = useState([]);
  const [scaleMultiplier, setScaleMultiplier] = useState(0.1);

  useEffect(() => {
    const handleExpanded = async () => {
      try {
        if (!currentTreeNote?.refId) return;
        const result = await db.treeNotesExpanded
          .where("refId")
          .equals(currentTreeNote.refId)
          .first();
        if (result === undefined) {
          await db.treeNotesExpanded.add({
            refId: currentTreeNote.refId,
            expanded: {
              [location.length > 0 ? location.join("-") : "root"]: false,
            },
          });
        } else {
          console.log(result);
          // const { expanded } = result;
          // if (expanded[location.length > 0 ? location.join("-") : "root"]) {
          //   setExpanded(true);
          // } else {
          //   setExpanded(false);
          // }
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleExpanded();
  }, [currentTreeNote]);

  return (
    <div
      ref={containerRef}
      className="hide-scroll-bar relative h-full grow bg-gray-900 flex justify-center items-center overflow-hidden cursor-grab"
    >
      <TransformWrapper
        minScale={0.1}
        limitToBounds={false}
        wheel={{ step: scaleMultiplier }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <Fragment>
            <TransformComponent>
              <div
                ref={treeRef}
                className="active:cursor-grabbing min-w-[100vw] min-h-[100vh] relative bg-gray-900 flex justify-center items-start  transition-all duration-100 p-2"
              >
                <svg
                  style={{
                    width: currentTreeNote?.root?.fp * 250 * 2 - 30 + "px",
                    height: currentTreeNote?.root?.numberOfLevels * 200 - 100 + "px",
                  }}
                  className="absolute overflow-visible"
                >
                  <Paths
                    paths={paths}
                    node={currentTreeNote?.root}
                    r={currentTreeNote?.root?.fp}
                  />
                  {move?.node && <LivePath move={move} rootRef={treeRef} />}
                </svg>
                <TestDisplayNode node={currentTreeNote?.root} />
                {/* <div ref={parentRef} className="w-fit h-fit flex relative">
                  {currentTreeNote &&
                    currentExpanded[currentTreeNote.refId] !== undefined && (
                      <DisplayNode
                        update={update}
                        setUpdate={setUpdate}
                        location={[]}
                        containerRef={parentRef}
                        paths={paths}
                        setPaths={setPaths}
                        currentIsExpanded={
                          currentExpanded[currentTreeNote.refId]
                        }
                      />
                    )}
                </div> */}
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

const Paths = ({ node, i = 0, d = 0, c = 1 }) => {
  return (
    <>
      {d !== 0 && (
        <path
          key={"path-" + node.id}
          id="curve"
          d={`M${i - 15} ${d} 
              C ${i - 15} ${d + 100 - 20}, ${node?.fp * 250 - 15} ${d}, 
              ${node?.fp * 250 - 15} ${d + 100 + 30}
            `}
          className={`fade-in-path opacity-0 stroke-current text-gray-600`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="transparent"
        ></path>
      )}
      {node?.children?.map((child, i) => {
        return (
          <Paths node={child} i={node?.fp * 250} d={200 * c - 100} c={c + 1} />
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
