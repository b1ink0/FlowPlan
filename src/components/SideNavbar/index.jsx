import React, { useEffect, useRef, useState } from "react";
import EditIcon from "../../assets/Icons/EditIcon";
import { useLiveQuery } from "dexie-react-hooks";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import { TreeNode, addChild } from "../../hooks/useTree";
import { v4 } from "uuid";
import { useFunctions } from "../../hooks/useFunctions";
import ExportIcon from "../../assets/Icons/ExportIcon";

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
  const { handleExportTreeNote, handleImportTreeNote } = useFunctions();
  const [showSideNavbar, setShowSideNavbar] = useState(true);
  const [noteTitle, setNoteTitle] = useState("");
  const [exportSelect, setExportSelect] = useState(false);
  const [selected, setSelected] = useState([]);

  const handleAddNewNote = async (e) => {
    e.preventDefault();
    if (db === null) return;
    const newRefId = v4();
    const newRootTreeNode = new TreeNode(newRefId, noteTitle, "", "", "");
    const newNoteIndex = {
      refId: newRefId,
      title: noteTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newNote = {
      refId: newRefId,
      title: noteTitle,
      root: newRootTreeNode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db?.treeNotes.add(newNote);
    await db?.treeNotesIndex.add(newNoteIndex);
    await db?.treeNotesExpanded.add({
      refId: newRefId,
      expanded: { [newRefId]: false },
    });

    setNoteTitle("");
  };

  const handleSetCurrentTreeNote = async (refId) => {
    try {
      const result = await db.treeNotes.where("refId").equals(refId).first();
      setCurrentTreeNote(result);
      const expanded = await db.treeNotesExpanded
        .where("refId")
        .equals(refId)
        .first();
      console.log("expanded", expanded);
      setCurrentExpanded(expanded.expanded);
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
    const allTreeNote = await db?.treeNotesIndex?.toArray();
    setTreeNotes(allTreeNote);
    if (allTreeNote.length === 0) return;

    // handleSetCurrentTreeNote(allTreeNote[0].refId);
  }, [db]);

  useLiveQuery(async () => {
    if (db === null) return;
    if (currentTreeNote === null) return;
    const expanded = await db.treeNotesExpanded
      .where("refId")
      .equals(currentTreeNote.refId)
      .first();
    console.log("expanded", expanded);
    setCurrentExpanded(expanded.expanded);
  }, [currentTreeNote]);

  useEffect(() => {
    if (treeNotes.length === 0) return;
    handleSetCurrentTreeNote(treeNotes[0].refId);
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
          onSubmit={handleAddNewNote}
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
            Add
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
            <button className="absolute right-5 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
              <EditIcon />
            </button>
            <span className="absolute text-[10px] group-hover:opacity-0 transition-opacity text-gray-400 right-2 bottom-[1px]">
              {treeNote?.createdAt
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
