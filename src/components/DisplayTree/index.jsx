import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { v4 } from "uuid";
import DisplayNode from "../DisplayNode";

const DisplayTree = ({ node }) => {
  const { currentTreeNote, setCurrentTreeNode, update, setUpdate } =
    useStateContext();
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
          {currentTreeNote && (
            <DisplayNode
              update={update}
              setUpdate={setUpdate}
              location={[]}
              containerRef={parentRef}
              paths={paths}
              setPaths={setPaths}
            />
          )}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <Paths paths={paths} />
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
          className="w-9 h-9 flex justify-center items-center bottom-12 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100"
        >
          <span className="absolute block w-1 rounded-md h-6 bg-gray-200"></span>
          <span className="absolute block w-6 rounded-md h-1 bg-gray-200"></span>
        </button>
        <button
          onClick={() => hanldeZoom(-1)}
          className="w-9 h-9 flex justify-center items-center bottom-2 right-2 z-10 p-1 bg-slate-800 rounded-lg text-gray-100"
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
      key={i}
      id="curve"
      d={path?.path}
      className="fade-in-path stroke-current text-gray-600"
      strokeWidth="4"
      strokeLinecap="round"
      fill="transparent"
    ></path>
  ));
};
