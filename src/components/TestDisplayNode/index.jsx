import React from "react";

function TestDisplayNode({ node }) {
  return (
    <div className="w-full h-full bg-gray-400 relative flex justify-center items-start">
      <DisplayNode node={node} t={0} r={node.fp} />
    </div>
  );
}

function DisplayNode({ node, t, r }) {
  return (
    <>
      <div
        className="absolute"
        style={{ transform: `translate(${(node?.fp - r) * 100}px,  ${t}px)` }}
      >
        {node?.fp * 100}
      </div>
      {node?.children?.map((child) => {
        return <DisplayNode key={child.id} node={child} t={t + 100} r={r}/>;
      })}
    </>
  );
}

export default TestDisplayNode;
