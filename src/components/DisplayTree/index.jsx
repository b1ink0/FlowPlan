import React, { useEffect, useRef, useState } from "react";

const DisplayTree = ({ node }) => {
  const containerRef = useRef(null);
  const treeRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const tree = treeRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY);
      const translateX = e.clientX - container.offsetLeft;
      const translateY = e.clientY - container.offsetTop;
      if (!tree) return;
      console.log(delta);
      const scale = tree.style.transform
        ? parseFloat(tree.style.transform.split("(")[1])
        : 1;
      if (scale < 0.5 && delta < 0) {
        tree.style.transform = `scale(${scale + delta * 0.01})`;
        return;
      }
      // if (scaleF > 100.5 && delta > 0) return;
      // tree.style.transformOrigin = `${translateX}px ${translateY}px`;
      tree.style.transform = `scale(${scale + delta * 0.1}) `;
    };
    container.addEventListener("wheel", handleWheel);
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);
  return (
    <div
      ref={containerRef}
      className="hide-scroll-bar h-full grow bg-gray-900 flex justify-center items-center overflow-hidden"
    >
      <div
        ref={treeRef}
        className="w-[500px] h-[500px] bg-red-400 transition-all duration-300 break-before-page whitespace-nowrap"
      ></div>
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
