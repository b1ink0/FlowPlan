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
    flowPlans,
    setFlowPlans,
    currentFlowPlan,
    setCurrentFlowPlan,
    setAddEditNode,
  } = useStateContext();
  // destructure functions from custom hook
  const {
    handleExportFlowPlan,
    handleImportFlowPlan,
    handleShareFlowPlan,
    handleDeleteFlowPlan,
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
    await db?.flowPlans.add(newNote);
    setNoteTitle("");
  };

  // function to edit note
  const handleEditNote = async (e) => {
    e.preventDefault();
    if (db === null) return;
    await db?.flowPlans.where("refId").equals(currentFlowPlan.refId).modify({
      title: noteTitle,
      updatedAt: new Date(),
    });
    setEditNote(false);
    setNoteTitle("");
  };

  // function to set current note
  const handleSetCurrentFlowPlan = async (refId) => {
    try {
      // get current note from db using refId
      const result = await db.flowPlans.where("refId").equals(refId).first();
      // position calculation for tree
      handlePositionCalculation(result.root);
      // set current note in context
      setCurrentFlowPlan(result);
      // set move to false and null for safety
      setMove((prev) => ({
        enable: false,
        node: null,
      }));
      setAddEditNode({
        show: false,
        location: null,
        type: "add",
      });
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
    setSelected(flowPlans.map((flowPlan) => flowPlan.refId));
  };
  const handleSelectCancel = () => {
    setSelected([]);
    setExportSelect(false);
  };

  // for updating flowPlans state when new note is added
  useLiveQuery(async () => {
    // if db is null return
    if (db === null) return;
    // get all flowPlans from db
    const allFlowPlan = await db?.flowPlans?.toArray();
    // if no flowPlans return
    if (allFlowPlan.length === 0) return;
    // updating flowPlans state
    setFlowPlans((prev) => {
      // if prev and allFlowPlan length is same return prev means no change
      // if (prev.length === allFlowPlan.length) return prev;
      // else create tempFlowPlans array
      let tempFlowPlans = [];
      // loop through allFlowPlan and push required data to tempFlowPlans
      allFlowPlan.forEach((flowPlan) => {
        let tempFlowPlan = {
          refId: flowPlan.refId,
          title: flowPlan.title,
          createdAt: flowPlan.createdAt,
          updatedAt: flowPlan.updatedAt,
        };
        tempFlowPlans.push(tempFlowPlan);
      });
      // sort tempFlowPlans by updatedAt field
      tempFlowPlans
        .sort(function (a, b) {
          var c = new Date(a.updatedAt);
          var d = new Date(b.updatedAt);
          return c - d;
        })
        .reverse();
      // finally return tempFlowPlans
      return tempFlowPlans;
    });
  }, [db]);

  // for setting current note when App loads and when new note is added
  useEffect(() => {
    if (flowPlans?.length === 0) return;
    if (currentFlowPlan !== null) return;
    handleSetCurrentFlowPlan(flowPlans[0]?.refId);
  }, [flowPlans]);

  return (
    // SideNavbar container
    <div
      className={`${
        // when showSideNavbar is false translate sideNavbar to left
        !showSideNavbar ? "-translate-x-full" : ""
      } z-10 transition-all duration-200 w-[280px] grow-0 h-full absolute left-0 top-0 bg-[var(--bg-primary-translucent)] text-gray-200 flex flex-col justify-center items-center gap-1 border-r-2 border-[var(--border-primary)]`}
    >
      {/* SideNavbar open close button */}
      <ToggleSideNavbarButton
        showSideNavbar={showSideNavbar}
        setShowSideNavbar={setShowSideNavbar}
      />

      {/* SideNavbar header */}
      <div className="w-full flex flex-col justify-center items-center p-3 px-2 gap-1 border-b-2 border-[var(--border-primary)]">
        <h3 className="text-[var(--text-primary)] text-lg font-medium tracking-wider">
          FlowPlan
        </h3>
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
              handleExportFlowPlan,
            }}
            setSelected={setSelected}
            selected={selected}
            flowPlans={flowPlans}
          />
        )}

        {/* Listing all notes */}
        {flowPlans?.map((flowPlan) => (
          <div
            key={flowPlan?.refId}
            onClick={() =>
              // if exportSelect is true then handleChecked else handleSetCurrentFlowPlan
              exportSelect
                ? handleChecked(flowPlan?.refId)
                : handleSetCurrentFlowPlan(flowPlan?.refId)
            }
            className={`${
              // set current note background color to light
              currentFlowPlan?.refId === flowPlan?.refId
                ? "bg-[var(--bg-tertiary)]"
                : "bg-[var(--bg-secondary)]"
            } w-full p-3 relative group hover:bg-[var(--bg-tertiary)] transition-colors duration-200 cursor-pointer rounded-md flex items-center shrink-0 gap-2`}
          >
            {/* SubMenu */}
            {subMenu.show && subMenu.refId === flowPlan?.refId && (
              <SubMenu
                handles={{
                  handleShareFlowPlan,
                  handleDeleteFlowPlan,
                }}
                setEditNote={setEditNote}
                setNoteTitle={setNoteTitle}
                flowPlan={flowPlan}
                setSubMenu={setSubMenu}
                copied={copied}
                setCopied={setCopied}
              />
            )}

            {/* Export checkbox indicator */}
            {exportSelect && (
              <Checkbox selected={selected} flowPlan={flowPlan} />
            )}

            {/* Plan title */}
            <h4
              title={flowPlan?.title}
              className="text-[var(--text-primary)] truncate"
            >
              {flowPlan?.title}
            </h4>

            {/* Open sub menu button */}
            <OpenSubMenuButton setSubMenu={setSubMenu} flowPlan={flowPlan} />

            {/* Plan created at and updated at */}
            <TimeAndDate timeDate={flowPlan?.updatedAt} />
          </div>
        ))}
      </div>

      {/* Import and Export buttons footer for sidenavbar*/}
      <ImportExport
        handleImportFlowPlan={handleImportFlowPlan}
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
        showSideNavbar ? "translate-x-[24px]" : "translate-x-[24px]"
      } outline-none transition-all duration-200 w-6 h-12 rounded-r-full absolute right-0 z-10 bg-[var(--bg-tertiary)] flex justify-center items-center p-1 cursor-pointer border-r-2 border-t-2 border-b-2 border-[var(--border-primary)]`}
      onClick={() => setShowSideNavbar((prev) => !prev)}
    >
      <BackIcon />
    </button>
  );
};

const ExportButtons = ({ handles, setSelected, selected, flowPlans }) => {
  const { handleSelectAll, handleSelectCancel, handleExportFlowPlan } = handles;
  return (
    <div className="w-full flex gap-2">
      <button
        onClick={() =>
          selected.length === flowPlans.length
            ? setSelected([])
            : handleSelectAll()
        }
        className="text-[var(--text-primary)] w-full flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
      >
        {selected.length === flowPlans.length ? "Deselect All" : "Select All"}
      </button>
      {selected.length > 0 && (
        <button
          onClick={() => {
            handleExportFlowPlan(selected);
            handleSelectCancel();
          }}
          className="text-[var(--text-primary)] w-3 h-8 flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
        >
          Export
        </button>
      )}
      <button
        className="text-[var(--text-primary)] w-full flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
        onClick={handleSelectCancel}
      >
        Cancel
      </button>
    </div>
  );
};

const OpenSubMenuButton = ({ setSubMenu, flowPlan }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSubMenu({
          refId: flowPlan?.refId,
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
        className="text-[var(--text-primary)] w-full px-2 py-1 rounded-md bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-primary)] focus:border-transparent"
      />
      <button
        type="submit"
        className="text-[var(--text-primary)] flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
      >
        {editNote ? "Save" : "Add"}
      </button>
    </form>
  );
};

const ImportExport = ({ handleImportFlowPlan, setExportSelect }) => {
  return (
    <div className="w-full p-3 px-2 h-fit flex gap-2">
      <div className="relative w-full flex justify-center items-center cursor-pointer flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300">
        <span className="text-[var(--text-primary)] cursor-pointer">
          Import
        </span>
        <input
          type="file"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleImportFlowPlan}
        />
      </div>
      <button
        className="text-[var(--text-primary)] w-full flex-1 bg-[var(--bg-secondary)] py-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors duration-300"
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
  flowPlan,
  setSubMenu,
  copied,
  setCopied,
}) => {
  const { handleShareFlowPlan, handleDeleteFlowPlan } = handles;
  const handleCloseSubMenu = (e) => {
    e.stopPropagation();
    setSubMenu({
      refId: flowPlan?.refId,
      show: false,
    });
  };
  return (
    <span
      onClick={(e) => e.stopPropagation()}
      className="flex justify-between rounded-md items-center w-full h-full bg-[var(--bg-secondary)] absolute right-0 shrink-0 gap-2 cursor-default z-10 spread"
    >
      <span className="flex justify-center items-center">
        {/* Share Plan Button */}
        <button
          title="Share"
          onClick={() => handleShareFlowPlan(flowPlan?.refId, setCopied)}
          className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-tertiary)] transition-colors duration-300 rounded-sm"
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <ShareIcon />
          </span>
        </button>
        {/* Edit Plan Button */}
        <button
          onClick={(e) => {
            setEditNote(true);
            setNoteTitle(flowPlan?.title);
            handleCloseSubMenu(e);
          }}
          className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-tertiary)] transition-colors duration-300 rounded-sm"
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <EditBtnIcon />
          </span>
        </button>
        {/* Delete Plan Button */}
        <button
          className="w-10 h-10 flex justify-center items-center hover:bg-[var(--bg-tertiary)] transition-colors duration-300 rounded-sm"
          onClick={() => handleDeleteFlowPlan(flowPlan?.refId)}
        >
          <span className="absolute w-5 h-5 rounded-full flex justify-center items-center gap-2">
            <DeleteIcon />
          </span>
        </button>
      </span>
      {copied && <span className="text-sm text-gray-400 spread">Copied!</span>}
      {/* Close SubMenu Button */}
      <button
        onClick={handleCloseSubMenu}
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
    <span className="text-[var(--text-secondary)] absolute text-[10px] group-hover:opacity-0 transition-opacity right-2 bottom-[1px]">
      {timeDate?.toTimeString().split(" ")[0].split(":").slice(0, 2).join(":")}{" "}
      {timeDate?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </span>
  );
};

const Checkbox = ({ selected, flowPlan }) => {
  return (
    <div className="w-5 h-5 flex justify-center items-center">
      <span
        className={`${
          selected?.includes(flowPlan?.refId)
            ? "bg-[var(--text-secondary)]"
            : "bg-[var(--bg-primary)]"
        } w-3 h-3 rounded-full transition-all duration-200`}
      ></span>
    </div>
  );
};

export default SideNavbar;
