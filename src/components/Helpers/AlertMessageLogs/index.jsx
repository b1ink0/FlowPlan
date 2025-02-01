import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../context/StateContext";
import AddIcon from "../../../assets/Icons/AddIcon";

function AlertMessageLogs() {
  const { updatingDatabase, setUpdatingDatabase, settings } = useStateContext();
  const [ currentStatus, setCurrentStatus ] = useState([])
  const [ display, setDisplay ] = useState(true);
  const { databaseConfig } = settings;
  useEffect(() => {
    if ( updatingDatabase?.message === "") return;
    setCurrentStatus((prev) => [...prev, updatingDatabase?.message]);
  }, [updatingDatabase])
  
  useEffect(() => {    
    setTimeout(() =>{
      setDisplay(updatingDatabase?.updating)
      if (!updatingDatabase?.updating) {
        setCurrentStatus((prev) => [])
      }
    }, 1000)
  }, [updatingDatabase])
  return ( databaseConfig?.showLog === "true" && display && currentStatus?.length > 0) ? (
    <div className="bg-[var(--bg-secondary)] flex-col text-[var(--text-primary)] border-[var(--border-primary)] border-2 font-bold z-50 p-2 rounded-md text-center w-[500px] max-md:w-11/12 absolute bottom-2 flex justify-center items-center">
      {currentStatus?.map((message, index) => (
        <p id={"alert_message_" + index}>{index + 1}: {message}</p>
      ))}
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
