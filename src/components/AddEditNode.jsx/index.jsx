import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import { TreeNode, addChild } from "../../hooks/useTree";
import { v4 } from "uuid";

const AddEditNode = () => {
  const {
    db,
    currentTreeNote,
    setCurrentTreeNote,
    currentTreeNode,
    addEditNode,
    setAddEditNode,
    setUpdate,
    markdownEditor,
    setMarkdownEditor,
  } = useStateContext();
  const [node, setNode] = useState({
    title: "",
    description: "",
    markdown: "",
    html: "",
  });
  const inputRef = useRef(null);

  const handleUpdateDb = async (node, refId) => {
    await db.treeNotes.where("refId").equals(refId).modify({ root: node });
  };

  const handleAddEditNode = async (e) => {
    e.preventDefault();
    if (addEditNode.type === "add") {
      if (addEditNode.location.length === 0) {
        const parentNode = currentTreeNote.root;
        const id = v4();
        const newChildNode = new TreeNode(
          id,
          node.title,
          node.description,
          node.markdown,
          node.html
        );
        console.log("parentNode", parentNode);
        addChild(parentNode, newChildNode);
        console.log("parentNode", parentNode);
        setCurrentTreeNote((prev) => ({ ...prev, root: parentNode }));
        await handleUpdateDb(parentNode, currentTreeNote.refId);
        const expanded = await db.treeNotesExpanded
          .where("refId")
          .equals(currentTreeNote.refId)
          .first();
        console.log("expanded", expanded);
        await db.treeNotesExpanded
          .where("refId")
          .equals(currentTreeNote.refId)
          .modify({ expanded: { ...expanded.expanded, [id]: false } });

        setNode({
          title: "",
          description: "",
          markdown: "",
          html: "",
        });
        setAddEditNode((prev) => ({ ...prev, location: null, show: false }));
      } else {
        let root = currentTreeNote.root;
        let parentNode = currentTreeNote.root;
        addEditNode.location.forEach((index) => {
          parentNode = parentNode.children[index];
        });
        const newChildNode = new TreeNode(
          v4(),
          node.title,
          node.description,
          node.markdown,
          node.html
        );
        addChild(parentNode, newChildNode);
        console.log("parentNode", parentNode);
        setCurrentTreeNote((prev) => ({ ...prev, root: root }));
        await handleUpdateDb(root, currentTreeNote.refId);
        setNode({
          title: "",
          description: "",
          markdown: "",
          html: "",
        });
        setAddEditNode((prev) => ({ ...prev, location: null, show: false }));
      }
    }
  };

  useEffect(() => {
    if (!addEditNode.show) return;
    if (!inputRef.current) return;
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  }, [addEditNode.show, addEditNode.location]);

  return (
    <div
      className={`${
        !addEditNode.show ? "translate-x-full" : ""
      } z-10 transition-all duration-200 w-[280px] grow-0 h-full absolute right-0 top-0 bg-gray-900/90 text-gray-200 flex flex-col justify-center items-center gap-1 border-l-2 border-slate-700`}
    >
      <button
        className={`${
          addEditNode.show ? "" : "-translate-x-[24px] rotate-180"
        } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute left-0 z-10 bg-slate-700 flex justify-center items-center p-1 cursor-pointer`}
        onClick={() =>
          setAddEditNode((prev) => ({ ...prev, show: !prev.show }))
        }
      >
        <BackIcon />
      </button>
      {addEditNode.location === null ? (
        <h1>Select A Node!</h1>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center p-3 px-2 gap-1 border-b-2 border-slate-700">
          <h3 className="text-lg font-medium tracking-wider ">
            {addEditNode.type === "add" ? "Add" : "Edit"} Node
          </h3>
          <form
            className="w-full flex-1 flex flex-col mt-1 gap-2"
            onSubmit={handleAddEditNode}
          >
            <div className="flex-1 flex flex-col justify-center items-center gap-2">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <label htmlFor="title" className="text-sm font-medium">
                  Title:
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={node.title}
                  onChange={(e) => setNode({ ...node, title: e.target.value })}
                  placeholder="Enter note title..."
                  required
                  className="w-full px-2 py-1 rounded-md bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                />
              </div>
              <div className="w-full flex-1 flex flex-col justify-center items-start gap-1">
                <label htmlFor="description" className="text-sm font-medium">
                  Description:
                </label>
                <textarea
                  type="text"
                  value={node.description}
                  onChange={(e) =>
                    setNode({ ...node, description: e.target.value })
                  }
                  placeholder="Enter note description..."
                  className="w-full resize-none flex-1 px-2 py-1 rounded-md bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="h-fit bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddEditNode;
