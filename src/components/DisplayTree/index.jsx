import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";

const DisplayTree = ({ node }) => {
  const { currentTreeNote, setCurrentTreeNode } = useStateContext();
  const containerRef = useRef(null);
  const treeRef = useRef(null);
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
        className="min-w-[100vw] min-h-[100vh] relative bg-gray-900 border-2 flex justify-center items-start  transition-all duration-100 p-2"
      >
        {currentTreeNote && (
          <DisplayNode location={[]} containerRef={treeRef} />
        )}
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

const DisplayNode = ({ location, left, right, parentRef, containerRef }) => {
  const { currentTreeNote, setAddEditNode } = useStateContext();
  const [node, setNode] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [widthAndAngle, setWidthAndAngle] = useState({
    width: 0,
    angle: 0,
    left: 0,
    top: 0,
  });
  const nodeRef = useRef(null);

  const handleAddNode = () => {
    setAddEditNode({
      show: true,
      location: location,
      type: "add",
    });
  };

  const getDistanceBetweenDivs = (parentRef, nodeRef, containerRef) => {
    if (!parentRef || !nodeRef) return 0;
    const rect1 = parentRef.current?.getBoundingClientRect();
    const rect2 = nodeRef.current?.getBoundingClientRect();
    const container = containerRef.current;
    console.log(rect1, rect2);

    if (!rect1 || !rect2) return 0;

    const x1 = rect1.left;
    const y1 = rect1.top;
    const x2 = rect2.left;
    const y2 = rect2.top;

    const dx = x2 - x1;
    const dy = y2 - y1;
    console.log(dx, dy);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radians = Math.atan2(dy, dx);
    let degrees = (radians * 180) / Math.PI;

    // Ensure that the angle is always positive
    if (degrees < 0) {
      degrees += 360;
    }
    setWidthAndAngle({ width: distance, angle: degrees, left: dx, top: dy });
    console.log(distance, degrees);
  };

  useEffect(() => {
    console.log("location", location);
    let currentNode = currentTreeNote.root;
    console.log(location);
    if (location.length === 0) {
      setNode(currentNode);
      return;
    }
    location.forEach((loc, i) => {
      if (i === location.length - 1) {
        setNode(currentNode?.children[loc]);
      } else {
        currentNode = currentNode?.children[loc];
      }
    });
    setTimeout(() => {
      getDistanceBetweenDivs(parentRef, nodeRef, containerRef);
    }, 500);
    console.log(parentRef, nodeRef);
  }, []);

  useEffect(() => {
    console.log(currentTreeNote)
  }, [currentTreeNote])


  return (
    <div className=" border-gray-300 p-2 flex flex-col justify-start items-center mt-16">
      <div
        className={`${
          isExpanded ? "cursor-default" : "cursor-pointer"
        } w-fit flex flex-col justify-center items-center border-2 border-gray-700 bg-gray-800 p-2 text-gray-200 rounded-md gap-1`}
      >
        {/* <span
          style={{
            width: `${widthAndAngle.width + 0}px`,
            rotate: `${widthAndAngle.angle}deg`,
            right: `${widthAndAngle.left}px`,
            bottom: `${widthAndAngle.top}px`,
          }}
          className={` z-20 absolute h-1 bg-gray-300`}
        ></span> */}
        <span ref={nodeRef} className="absolute w-0 h-0 bg-red-400"></span>
        <h3>{node?.title}</h3>
        <p>{node?.description}</p>
        <div dangerouslySetInnerHTML={{ __html: node?.html }} />
        <button
          className="text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-slate-800 transition-colors duration-300"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Collapse Child" : "Expand Child"}
        </button>
        <button
          className="text-xs bg-slate-700 py-1 px-2 rounded-md hover:bg-slate-800 transition-colors duration-300"
          onClick={handleAddNode}
        >
          Add Child Node
        </button>
      </div>
      <div className="flex">
        {isExpanded &&
          node?.children.map((child, i) => (
            <DisplayNode
              key={i}
              location={location.concat([i])}
              left={i === 0}
              right={node?.children.length - 1 === i}
              parentRef={nodeRef}
              containerRef={containerRef}
            />
          ))}
      </div>
    </div>
  );
};
