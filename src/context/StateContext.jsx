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
  const values = {
    db,
    setDb,
    treeNotes,
    setTreeNotes
  };
  return (
    <StateContext.Provider value={values}>{children}</StateContext.Provider>
  );
}
