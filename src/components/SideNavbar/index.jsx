import React, { useEffect, useRef, useState } from "react";
import EditIcon from "../../assets/Icons/EditIcon";
import { useLiveQuery } from "dexie-react-hooks";
import { useStateContext } from "../../context/StateContext";

function SideNavbar() {
  const { db, setDb, treeNotes, setTreeNotes } = useStateContext();
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const addNoteRef = useRef(null);

  useLiveQuery(async () => {
    if (db === null) return;
    const allTreeNote = await db?.treeNotesIndex.toArray();
    setTreeNotes(allTreeNote);
  }, [db]);

  return (
    <div className="w-[280px] grow-0 h-full bg-gray-900 text-gray-200 flex flex-col justify-center items-center gap-1 border-r-2 border-slate-700">
      <div className="w-full flex flex-col justify-center items-center p-3 px-2 gap-1 border-b-2 border-slate-700">
        <h3 className="text-lg font-medium tracking-wider ">TreeNote</h3>
        <form className="w-full flex flex-col mt-1 gap-2">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Enter note title..."
            required
            className=" w-full px-2 py-1 rounded-md bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          />
          <button className="flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300">
            Add
          </button>
        </form>
      </div>
      <div className="grow w-full overflow-x-auto flex flex-col justify-start items-center gap-2 py-2 px-2">
        {treeNotes?.map((treeNote) => (
          <div className="w-full p-3 group hover:bg-slate-700 transition-colors duration-200 cursor-pointer rounded-md bg-slate-800 flex justify-between items-center shrink-0 gap-2">
            <h4 title="Note 1" className="truncate">
              Note{" "}
            </h4>
            <button className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
              <EditIcon />
            </button>
          </div>
        ))}
        <div className="w-full p-3 group hover:bg-slate-700 transition-colors duration-200 cursor-pointer rounded-md bg-slate-800 flex justify-between items-center shrink-0 gap-2">
          <h4 title="Note 1" className="truncate">
            Note{" "}
          </h4>
          <button className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            <EditIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideNavbar;
