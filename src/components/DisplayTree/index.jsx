import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { v4 } from "uuid";
import DisplayNode from "../DisplayNode";

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

  const handleGetTransform = () => {
    const tree = treeRef.current;
    let scale = 1;
    try {
      scale = parseFloat(tree.style.transform.match(/scale\(([0-9.]+)\)/)[1]);
    } catch (error) {
      scale = 1;
    }
    let translateX = 0;
    try {
      translateX = parseFloat(
        tree.style.transform.match(/translate\((-?[0-9.]+)px/)[1]
      );
    } catch (error) {
      translateX = 0;
    }
    let translateY = 0;
    try {
      translateY = parseFloat(
        tree.style.transform.match(
          /translate\((-?[0-9.]+)px, (-?[0-9.]+)px\)/
        )[2]
      );
    } catch (error) {
      translateY = 0;
    }
    return { scale, translateX, translateY };
  };

  const hanldeZoom = (direction = 1) => {
    const tree = treeRef.current;
    const { scale, translateX, translateY } = handleGetTransform();
    let newScale =
      scale + direction * (scaleMultiplier ? scaleMultiplier : 0.1);
    tree.style.transform = `scale(${newScale}) translate(${translateX}px, ${translateY}px)`;
  };

  useEffect(() => {
    const container = containerRef.current;
    const tree = treeRef.current;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    if (!container) return;
    const handleMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };
    const handleMouseUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
    };
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      const { scale } = handleGetTransform();
      tree.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY);
      if (!tree) return;
      console.log(delta);
      const { scale, translateX, translateY } = handleGetTransform();
      let newScale = scale + delta * (scaleMultiplier ? scaleMultiplier : 0.1);
      console.log(newScale);
      const translateOriginX = e.clientX;
      const translateOriginY = e.clientY;
      console.log(translateX, translateY);
      if (newScale < 0.1) return;

      tree.style.transform = `scale(${newScale}) translate(${translateX}px, ${translateY}px)`;
      tree.style.transformOrigin = `${translateOriginX}px ${translateOriginY}px`;
    };
    container.addEventListener("wheel", handleWheel);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // for mobile
    const container = containerRef.current;
    const tree = treeRef.current;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    if (!container) return;
    const handleTouchStart = (e) => {
      isDragging = true;
      startX = e.touches[0].clientX - currentX;
      startY = e.touches[0].clientY - currentY;
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };
    const handleTouchEnd = () => {
      isDragging = false;
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
    };
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      currentX = e.touches[0].clientX - startX;
      currentY = e.touches[0].clientY - startY;
      const { scale } = handleGetTransform();
      tree.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    // for zooming on mobile without pinch with delta -1 or 1
    const container = containerRef.current;
    const tree = treeRef.current;
    let isZooming = false;
    let startDistance = 0;
    let currentDistance = 0;
    let lastUpdateTime = 0; // add this variable
    if (!container) return;
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        isZooming = true;
        startDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };
    const handleTouchEnd = () => {
      isZooming = false;
    };
    const handleTouchMove = (e) => {
      if (!isZooming) return;
      e.preventDefault();
      currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = Math.sign(currentDistance - startDistance);
      // delta should be positive or negative

      const { scale, translateX, translateY } = handleGetTransform();
      let newScale = scale + delta * 0.02;
      if (newScale < 0.02) return;
      tree.style.transform = `scale(${newScale}) translate(${translateX}px, ${translateY}px)`;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

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
      <div
        ref={treeRef}
        className="min-w-[100vw] min-h-[100vh] relative bg-gray-900 flex justify-center items-start  transition-all duration-100 p-2"
      >
        <div ref={parentRef} className="w-fit h-fit flex relative">
          {currentTreeNote &&
            currentExpanded[currentTreeNote.refId] !== undefined && (
              <DisplayNode
                update={update}
                setUpdate={setUpdate}
                location={[]}
                containerRef={parentRef}
                paths={paths}
                setPaths={setPaths}
                currentIsExpanded={currentExpanded[currentTreeNote.refId]}
              />
            )}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            <Paths paths={paths} />
            {move?.node && <LivePath move={move} rootRef={treeRef} />}
          </svg>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 flex flex-col justify-center items-end gap-2">
        <input
          value={scaleMultiplier}
          onChange={(e) => setScaleMultiplier(e.target.value)}
          type="number"
          className="w-9 h-9 outline-none border-none flex justify-center text-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100"
        />
        <button
          onClick={() => hanldeZoom(1)}
          className="w-9 h-9 flex justify-center items-center bottom-12 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-zoom-in"
        >
          <span className="absolute block w-1 rounded-md h-6 bg-gray-200"></span>
          <span className="absolute block w-6 rounded-md h-1 bg-gray-200"></span>
        </button>
        <button
          onClick={() => hanldeZoom(-1)}
          className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100 cursor-zoom-out"
        >
          <span className="absolute block w-6 rounded-md h-1 bg-gray-200"></span>
        </button>
      </div>
    </div>
    // <div className="border-l border-gray-500 pl-4">
    //   <h3>{node?.title}</h3>
    //   <p>{node?.description}</p>
    //   <div dangerouslySetInnerHTML={{ __html: node?.html }} />
    //   {node?.children.map(child => <DisplayTree node={child} key={child?.title} />)}
    // </div>
  );
};

export default DisplayTree;

const Paths = ({ paths }) => {
  if (paths.length === 0) return null;
  return paths.map((path, i) => (
    <path
      key={path.id}
      id="curve"
      d={path?.path}
      className={`${
        path?.show ? "hidden" : ""
      } fade-in-path opacity-0 stroke-current text-gray-600`}
      strokeWidth="4"
      strokeLinecap="round"
      fill="transparent"
    ></path>
  ));
};

const LivePath = ({ move, rootRef }) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    try {
      const { p1x, p1y, p2x, p2y } = move.position;
      console.log(p1x, p1y, p2x, p2y);
      if (p1x === p2x) {
        setPath(`M${p1x} ${p1y} ${p2x} ${p2y}`);
      } else if (p1x === p2x && p1y === p2y) {
        setPath(`M${p1x} ${p1y} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${p2x} ${p2y}`);
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
      setPath("");
    }
  }, [move.node]);

  return (
    <>
      {path !== "" && (
        <>
          <path
            id="curve"
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
