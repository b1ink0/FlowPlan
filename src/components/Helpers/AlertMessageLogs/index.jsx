import React from "react";
import { useStateContext } from "../../../context/StateContext";
import AddIcon from "../../../assets/Icons/AddIcon";

function AlertMessageLogs() {
  const { updatingDatabase, setUpdatingDatabase } = useStateContext();
  return updatingDatabase.updating ? (
    <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold z-50 p-2 rounded-md text-center w-[500px] max-md:w-11/12 absolute bottom-2 flex justify-center items-center">
      {updatingDatabase.message}
      <button
        onClick={() =>
          setUpdatingDatabase((prev) => ({ ...prev, updating: false }))
        }
        className="absolute top-1 right-1 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md px-2 py-1 hover:bg-[var(--bg-primary-hover)] hover:text-[var(--text-primary-hover)] focus:outline-none"
      >
        <span className="flex items-center justify-center gap-1 w-5 h-5 rotate-45">
          <AddIcon />
        </span>
      </button>
    </div>
  ) : (
    ""
  );
}

export default AlertMessageLogs;
