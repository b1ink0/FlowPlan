// @ts-check
import React, { useEffect, useState } from "react";
import EditIcon from "../../assets/Icons/EditIcon";
import { useLiveQuery } from "dexie-react-hooks";
import { useStateContext } from "../../context/StateContext";
import BackIcon from "../../assets/Icons/BackIcon";
import { createNode } from "../../hooks/useTree";
import { v4 } from "uuid";
import { useFunctions } from "../../hooks/useFunctions";
import DeleteIcon from "../../assets/Icons/DeleteIcon";
import ShareIcon from "../../assets/Icons/ShareIcon";
import EditBtnIcon from "../../assets/Icons/EditBtnIcon";
import CloseBtnIcon from "../../assets/Icons/CloseBtnIcon";

function SideNavbar() {
  // destructure state from context
  const {
    db,
    setMove,
    treeNotes,
    setTreeNotes,
    currentTreeNote,
    setCurrentTreeNote,
  } = useStateContext();
  // destructure functions from custom hook
  const {
    handleExportTreeNote,
    handleImportTreeNote,
    handleShareTreeNote,
    handleDeleteTreeNote,
    handlePositionCalculation,
  } = useFunctions();
  // local state
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

  // function to create new note
  const handleAddNewNote = async (e) => {
    e.preventDefault();
    if (db === null) return;
    const newRefId = v4();
    const newRootTreeNode = createNode(newRefId, noteTitle);
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

  // function to edit note
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

  // function to set current note
  const handleSetCurrentTreeNote = async (refId) => {
    try {
      // get current note from db using refId
      const result = await db.treeNotes.where("refId").equals(refId).first();
      // position calculation for tree
      handlePositionCalculation(result.root);
      // set current note in context
      setCurrentTreeNote(result);
      // set move to false and null for safety
      setMove((prev) => ({
        enable: false,
        node: null,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // functions to handle export select
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

  // for updating treeNotes state when new note is added
  useLiveQuery(async () => {
    // if db is null return
    if (db === null) return;
    // get all treeNotes from db
    const allTreeNote = await db?.treeNotes?.toArray();
    // if no treeNotes return
    if (allTreeNote.length === 0) return;
    // updating treeNotes state
    setTreeNotes((prev) => {
      // if prev and allTreeNote length is same return prev means no change
      if (prev.length === allTreeNote.length) return prev;
      // else create tempTreeNotes array
      let tempTreeNotes = [];
      // loop through allTreeNote and push required data to tempTreeNotes
      allTreeNote.forEach((treeNote) => {
        let tempTreeNote = {
          refId: treeNote.refId,
          title: treeNote.title,
          createdAt: treeNote.createdAt,
          updatedAt: treeNote.updatedAt,
        };
        tempTreeNotes.push(tempTreeNote);
      });
      // sort tempTreeNotes by updatedAt field
      tempTreeNotes
        .sort(function (a, b) {
          var c = new Date(a.updatedAt);
          var d = new Date(b.updatedAt);
          return c - d;
        })
        .reverse();
      // finally return tempTreeNotes
      return tempTreeNotes;
    });
  }, [db]);

  // for setting current note when App loads and when new note is added
  useEffect(() => {
    if (treeNotes?.length === 0) return;
    handleSetCurrentTreeNote(treeNotes[0]?.refId);
  }, [treeNotes]);

  return (
    // SideNavbar container
    <div
      className={`${
        // when showSideNavbar is false translate sideNavbar to left
        !showSideNavbar ? "-translate-x-full" : ""
      } z-10 transition-all duration-200 w-[280px] grow-0 h-full absolute left-0 top-0 bg-gray-900/90 text-gray-200 flex flex-col justify-center items-center gap-1 border-r-2 border-slate-700`}
    >
      {/* SideNavbar open close button */}
      <ToggleSideNavbarButton
        showSideNavbar={showSideNavbar}
        setShowSideNavbar={setShowSideNavbar}
      />

      {/* SideNavbar header */}
      <div className="w-full flex flex-col justify-center items-center p-3 px-2 gap-1 border-b-2 border-slate-700">
        <h3 className="text-lg font-medium tracking-wider ">FlowPlan</h3>
        <Form
          handles={{ handleAddNewNote, handleEditNote }}
          editNote={editNote}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
        />
      </div>

      {/* SideNavbar body */}
      <div className="grow w-full overflow-x-auto flex flex-col justify-start items-center gap-2 py-2 px-2">
        {/* Export Buttons show when exporting */}
        {exportSelect && (
          <ExportButtons
            handles={{
              handleSelectAll,
              handleSelectCancel,
              handleExportTreeNote,
            }}
            setSelected={setSelected}
            selected={selected}
            treeNotes={treeNotes}
          />
        )}

        {/* Listing all notes */}
        {treeNotes?.map((treeNote) => (
          <div
            key={treeNote?.refId}
            onClick={() =>
              // if exportSelect is true then handleChecked else handleSetCurrentTreeNote
              exportSelect
                ? handleChecked(treeNote?.refId)
                : handleSetCurrentTreeNote(treeNote?.refId)
            }
            className={`${
              // set current note background color to light
              currentTreeNote?.refId === treeNote?.refId
                ? "bg-slate-700"
                : "bg-slate-800"
            } w-full p-3 relative group hover:bg-slate-700 transition-colors duration-200 cursor-pointer rounded-md flex items-center shrink-0 gap-2`}
          >
            {/* SubMenu */}
            {subMenu.show && subMenu.refId === treeNote?.refId && (
              <SubMenu
                handles={{
                  handleShareTreeNote,
                  handleDeleteTreeNote,
                }}
                setEditNote={setEditNote}
                setNoteTitle={setNoteTitle}
                treeNote={treeNote}
                setSubMenu={setSubMenu}
                copied={copied}
                setCopied={setCopied}
              />
            )}

            {/* Export checkbox indicator */}
            {exportSelect && (
              <Checkbox selected={selected} treeNote={treeNote} />
            )}

            {/* Note title */}
            <h4 title={treeNote?.title} className="truncate">
              {treeNote?.title}
            </h4>

            {/* Open sub menu button */}
            <OpenSubMenuButton setSubMenu={setSubMenu} treeNote={treeNote} />

            {/* Note created at and updated at */}
            <TimeAndDate timeDate={treeNote?.updatedAt} />
          </div>
        ))}
      </div>

      {/* Import and Export buttons footer for sidenavbar*/}
      <ImportExport
        handleImportTreeNote={handleImportTreeNote}
        setExportSelect={setExportSelect}
      />
    </div>
  );
}

// Button Components

const ToggleSideNavbarButton = ({ showSideNavbar, setShowSideNavbar }) => {
  return (
    <button
      className={`${
        // when showSideNavbar is false rotate close button to 180deg
        showSideNavbar ? "rotate-180" : "translate-x-[24px]"
      } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute right-0 z-10 bg-slate-700 flex justify-center items-center p-1 cursor-pointer`}
      onClick={() => setShowSideNavbar((prev) => !prev)}
    >
      <BackIcon />
    </button>
  );
};

const ExportButtons = ({ handles, setSelected, selected, treeNotes }) => {
  const { handleSelectAll, handleSelectCancel, handleExportTreeNote } = handles;
  return (
    <div className="w-full flex gap-2">
      <button
        onClick={() =>
          selected.length === treeNotes.length
            ? setSelected([])
            : handleSelectAll()
        }
        className="w-full flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
      >
        {selected.length === treeNotes.length ? "Deselect All" : "Select All"}
      </button>
      {selected.length > 0 && (
        <button
          onClick={() => handleExportTreeNote(selected)}
          className="w-3 h-8 flex-1 bg-slate-800 py-1 rounded-md hover:bg-slate-700 transition-colors duration-300"
        >
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
  );
};

const OpenSubMenuButton = ({ setSubMenu, treeNote }) => {
  return (
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
  );
};

// Helper Components
const Form = ({ handles, editNote, noteTitle, setNoteTitle }) => {
  const { handleEditNote, handleAddNewNote } = handles;
  return (
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
  );
};

const ImportExport = ({ handleImportTreeNote, setExportSelect }) => {
  return (
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
  );
};

const SubMenu = ({
  handles,
  setEditNote,
  setNoteTitle,
  treeNote,
  setSubMenu,
  copied,
  setCopied,
}) => {
  const { handleShareTreeNote, handleDeleteTreeNote } = handles;
  return (
    <span
      onClick={(e) => e.stopPropagation()}
      className="flex justify-between items-center w-full h-full bg-slate-800 absolute right-0 shrink-0 gap-2 cursor-default z-10 spread"
    >
      <span className="flex justify-center items-center">
        {/* Share Note Button */}
        <button
          title="Share"
          onClick={() => handleShareTreeNote(treeNote?.refId, setCopied)}
          className="w-10 h-10 flex justify-center items-center hover:bg-slate-700 transition-colors duration-300 rounded-sm"
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <ShareIcon />
          </span>
        </button>
        {/* Edit Note Button */}
        <button
          onClick={() => {
            setEditNote(true);
            setNoteTitle(treeNote?.title);
          }}
          className="w-10 h-10 flex justify-center items-center hover:bg-slate-700 transition-colors duration-300 rounded-sm"
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <EditBtnIcon />
          </span>
        </button>
        {/* Delete Note Button */}
        <button
          className="w-10 h-10 flex justify-center items-center hover:bg-slate-700 transition-colors duration-300 rounded-sm"
          onClick={() => handleDeleteTreeNote(treeNote?.refId)}
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <DeleteIcon />
          </span>
        </button>
      </span>
      {copied && <span className="text-sm text-gray-400 spread">Copied!</span>}
      {/* Close SubMenu Button */}
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
  );
};

const TimeAndDate = ({ timeDate }) => {
  return (
    <span className="absolute text-[10px] group-hover:opacity-0 transition-opacity text-gray-400 right-2 bottom-[1px]">
      {timeDate?.toTimeString().split(" ")[0].split(":").slice(0, 2).join(":")}{" "}
      {timeDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
};

const Checkbox = ({ selected, treeNote }) => {
  return (
    <div className="w-5 h-5 flex justify-center items-center">
      <span
        className={`${
          selected?.includes(treeNote?.refId) ? "bg-gray-400" : "bg-gray-900"
        } w-3 h-3 rounded-full transition-all duration-200`}
      ></span>
    </div>
  );
};

export default SideNavbar;
