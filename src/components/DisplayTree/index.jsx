import React from "react";

function DisplayTree({ node }) {
  return (
    <div className="border-l border-gray-500 pl-4">
      <h3>{node.title}</h3>
      <p>{node.description}</p>
      <div dangerouslySetInnerHTML={{ __html: node.html }} />
      {node.children.map(child => <DisplayTree node={child} key={child.title} />)}
    </div>
  );
}

export default DisplayTree;
