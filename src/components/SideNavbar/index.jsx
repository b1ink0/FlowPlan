import React, { useEffect, useRef, useState } from "react";
import EditIcon from "../../assets/Icons/EditIcon";
import { useLiveQuery } from "dexie-react-hooks";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import { TreeNode, addChild } from "../../hooks/useTree";
import { v4 } from "uuid";
import { useFunctions } from "../../hooks/useFunctions";
import ExportIcon from "../../assets/Icons/ExportIcon";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import ShareIcon from "../../assets/Icons/ShareIcon";
import EditBtnIcon from "../../assets/Icons/EditBtnIcon";
import CloseIcon from "../../assets/Icons/CloseIcon";
import CloseBtnIcon from "../../assets/Icons/CloseBtnIcon";

function SideNavbar() {
  const {
    db,
    setDb,
    treeNotes,
    setTreeNotes,
    currentTreeNote,
    setCurrentTreeNote,
    setCurrentExpanded,
  } = useStateContext();
  const {
    handleExportTreeNote,
    handleImportTreeNote,
    handleShareTreeNote,
    handleDeleteTreeNote,
    handlePositionCalculation,
  } = useFunctions();
  const [showSideNavbar, setShowSideNavbar] = useState(true);
  const [noteTitle, setNoteTitle] = useState("");
  const [exportSelect, setExportSelect] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [subMenu, setSubMenu] = useState({
    refId: "",
    show: false,
  });
  const [selected, setSelected] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleAddNewNote = async (e) => {
    e.preventDefault();
    if (db === null) return;
    const newRefId = v4();
    const newRootTreeNode = new TreeNode(newRefId, noteTitle);
    const newNote = {
      refId: newRefId,
      title: noteTitle,
      root: newRootTreeNode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db?.treeNotes.add(newNote);
    setNoteTitle("");
  };

  const handleEditNote = async (e) => {
    e.preventDefault();
    if (db === null) return;
    await db?.treeNotes.where("refId").equals(currentTreeNote.refId).modify({
      title: noteTitle,
      updatedAt: new Date(),
    });

    setEditNote(false);
    setNoteTitle("");
  };

  const handleSetCurrentTreeNote = async (refId) => {
    try {
      const result = await db.treeNotes.where("refId").equals(refId).first();
      handlePositionCalculation(result.root);
      setCurrentTreeNote(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChecked = (refId) => {
    if (selected.includes(refId)) {
      setSelected((prev) => prev.filter((item) => item !== refId));
    } else {
      setSelected((prev) => [...prev, refId]);
    }
  };

  const handleSelectAll = () => {
    setSelected(treeNotes.map((treeNote) => treeNote.refId));
  };

  const handleSelectCancel = () => {
    setSelected([]);
    setExportSelect(false);
  };

  useLiveQuery(async () => {
    console.log("db", db);
    if (db === null) return;
    const allTreeNote = await db?.treeNotes?.toArray();
    if (allTreeNote.length === 0) return;
    setTreeNotes((prev) => {
      if (prev.length === allTreeNote.length) return prev;
      let tempTreeNotes = [];
      allTreeNote.forEach((treeNote) => {
        let tempTreeNote = {
          refId: treeNote.refId,
          title: treeNote.title,
          createdAt: treeNote.createdAt,
          updatedAt: treeNote.updatedAt,
        };
        tempTreeNotes.push(tempTreeNote);
      });
      tempTreeNotes.sort(function (a, b) {
        var c = new Date(a.updatedAt);
        var d = new Date(b.updatedAt);
        return c - d;
      }).reverse()
      return tempTreeNotes;
    });
  }, [db]);

  useEffect(() => {
    if (treeNotes?.length === 0) return;
    console.log("treeNotes", treeNotes);
    handleSetCurrentTreeNote(treeNotes[0]?.refId);
  }, [treeNotes]);

  return (
    <div
      className={`${
        !showSideNavbar ? "-translate-x-full" : ""
      } z-10 transition-all duration-200 w-[280px] grow-0 h-full absolute left-0 top-0 bg-gray-900/90 text-gray-200 flex flex-col justify-center items-center gap-1 border-r-2 border-slate-700`}
    >
      <button
        className={`${
          showSideNavbar ? "rotate-180" : "translate-x-[24px]"
        } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute right-0 z-10 bg-slate-700 flex justify-center items-center p-1 cursor-pointer`}
        onClick={() => setShowSideNavbar((prev) => !prev)}
      >
        <BackIcon />
      </button>
      <div className="w-full flex flex-col justify-center items-center p-3 px-2 gap-1 border-b-2 border-slate-700">
        <h3 className="text-lg font-medium tracking-wider ">TreeNote</h3>
        <form
          className="w-full flex flex-col mt-1 gap-2"
          onSubmit={editNote ? handleEditNote : handleAddNewNote}
        >
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Enter note title..."
            required
            className=" w-full px-2 py-1 rounded-md bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
          >
            {editNote ? "Save" : "Add"}
          </button>
        </form>
      </div>
      <div className="grow w-full overflow-x-auto flex flex-col justify-start items-center gap-2 py-2 px-2">
        {exportSelect && (
          <div className="w-full flex gap-2">
            <button
              onClick={() =>
                selected.length === treeNotes.length
                  ? setSelected([])
                  : handleSelectAll()
              }
              className="w-full flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
            >
              {selected.length === treeNotes.length
                ? "Deselect All"
                : "Select All"}
            </button>
            {selected.length > 0 && (
              <button
                onClick={() => handleExportTreeNote(selected)}
                className="w-3 h-8 flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
              >
                {/* <ExportIcon/> */}
                Export
              </button>
            )}
            <button
              className="w-full flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
              onClick={handleSelectCancel}
            >
              Cancel
            </button>
          </div>
        )}
        {treeNotes?.map((treeNote) => (
          <div
            key={treeNote?.refId}
            onClick={() =>
              exportSelect
                ? handleChecked(treeNote?.refId)
                : handleSetCurrentTreeNote(treeNote?.refId)
            }
            className={`${
              currentTreeNote?.refId === treeNote?.refId
                ? "bg-slate-700"
                : "bg-slate-800"
            } w-full p-3 relative group hover:bg-slate-700 transition-colors duration-200 cursor-pointer rounded-md flex items-center shrink-0 gap-2`}
          >
            {subMenu.show && subMenu.refId === treeNote?.refId && (
              <span
                onClick={(e) => e.stopPropagation()}
                className="flex justify-between items-center w-full h-full bg-slate-800 absolute right-0 shrink-0 gap-2 cursor-default z-10 spread"
              >
                <span className="flex justify-center items-center">
                  <button
                    title="Share"
                    onClick={() =>
                      handleShareTreeNote(treeNote?.refId, setCopied)
                    }
                    className="w-10 h-10 flex justify-center items-center hover:bg-slate-700 transition-colors duration-300 rounded-sm"
                  >
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
                      {/* <span>Share</span> */}
                      <ShareIcon />
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setEditNote(true);
                      setNoteTitle(treeNote?.title);
                    }}
                    className="w-10 h-10 flex justify-center items-center hover:bg-slate-700 transition-colors duration-300 rounded-sm"
                  >
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
                      {/* <span>Edit</span> */}
                      <EditBtnIcon />
                    </span>
                  </button>
                  <button
                    className="w-10 h-10 flex justify-center items-center hover:bg-slate-700 transition-colors duration-300 rounded-sm"
                    onClick={() => handleDeleteTreeNote(treeNote?.refId)}
                  >
                    <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
                      {/* <span>Delete</span> */}
                      <DeleteIcon />
                    </span>
                  </button>
                </span>
                {copied && (
                  <span className="text-sm text-gray-400 spread">Copied!</span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSubMenu({
                      refId: treeNote?.refId,
                      show: false,
                    });
                  }}
                  className="w-8 h-8 flex justify-center items-center mr-4"
                >
                  <span className="absolute w-8 h-8 rounded-full flex justify-center items-center gap-2">
                    <CloseBtnIcon />
                  </span>
                </button>
              </span>
            )}
            {exportSelect && (
              <div className="w-5 h-5 flex justify-center items-center">
                <span
                  className={`${
                    selected.includes(treeNote?.refId)
                      ? "bg-gray-400"
                      : "bg-gray-900"
                  } w-3 h-3 rounded-full transition-all duration-200`}
                ></span>
              </div>
            )}
            <h4 title="Note 1" className="truncate">
              {treeNote?.title}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSubMenu({
                  refId: treeNote?.refId,
                  show: true,
                });
              }}
              className="absolute flex justify-center items-center right-0 h-full w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
            >
              <span className="absolute w-7 h-7 rounded-full flex justify-center items-center gap-2">
                <EditIcon />
              </span>
            </button>
            <span className="absolute text-[10px] group-hover:opacity-0 transition-opacity text-gray-400 right-2 bottom-[1px]">
              {treeNote?.updatedAt
                ?.toTimeString()
                .split(" ")[0]
                .split(":")
                .slice(0, 2)
                .join(":")}{" "}
              {treeNote?.updatedAt?.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full p-3 px-2 h-fit flex gap-2">
        <div className="relative w-full flex justify-center items-center cursor-pointer flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300">
          <span className="cursor-pointer">Import</span>
          <input
            type="file"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImportTreeNote}
          />
        </div>
        <button
          className="w-full flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
          onClick={() => setExportSelect((prev) => !prev)}
        >
          Export
        </button>
      </div>
    </div>
  );
}

export default SideNavbar;
