import React, { useContext, useState } from "react";

// Creating Context
const StateContext = React.createContext();

// Using Created Context
export function useStateContext() {
  return useContext(StateContext);
}

// Creating Provider
export function StateProvider({ children }) {
  const [db, setDb] = useState(null);
  const [treeNotes, setTreeNotes] = useState([]);
  const [currentTreeNote, setCurrentTreeNote] = useState(null);
  const [addEditNode, setAddEditNode] = useState({
    show: false,
    location: null,
    type: "add",
  });
  const [update, setUpdate] = useState(0)
  const values = {
    db,
    setDb,
    treeNotes,
    setTreeNotes,
    currentTreeNote,
    setCurrentTreeNote,
    addEditNode,
    setAddEditNode,
    update,
    setUpdate
  };
  return (
    <StateContext.Provider value={values}>{children}</StateContext.Provider>
  );
}
