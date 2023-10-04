// @ts-check
import React, { useContext, useState } from "react";

// Creating Context
const StateContext = React.createContext();

// Using Created Context
export function useStateContext() {
  return useContext(StateContext);
}

// Creating Provider
export function StateProvider({ children }) {
  // settings state contains all the settings for the app
  const [settings, setSettings] = useState({
    nodeConfig: {
      nodeWidth: 220,
      nodeHeight: 100,
      nodeWidthMargin: 250,
      nodeHeightMargin: 130,
    },
    treeConfig: {
      scaleMultiplier: 0.1,
      renderType: localStorage.getItem("renderType") || "verticalTree",
    },
  });

  // db state contains the database object to interact with the indexedDB database
  const [db, setDb] = useState(null);

  // flowPlans state contains all the notes in the tree
  const [flowPlans, setFlowPlans] = useState([]);

  // currentFlowPlan state contains the current selected note
  const [currentFlowPlan, setCurrentFlowPlan] = useState(null);

  // addEditNode state contains the information to show the add/edit node modal
  const [addEditNode, setAddEditNode] = useState({
    show: false,
    location: null,
    type: "add",
  });

  // update state is used to update the flowPlans state
  const [update, setUpdate] = useState(0);

  // move state contains the information to move a node
  const [move, setMove] = useState({
    enable: false,
    node: null,
    location: null,
    positon: null,
    parentPosition: null,
  });

  // animation state contains the information to animate the tree
  const [animation, setAnimation] = useState(true);

  const defaultNodeConfig = {
    titleConfig: {
      fontSize: 24,
      strickthrough: false,
      italic: false,
      bold: false,
      color: "#e5e7eb",
    },
    nodeConfig: {
      backgroundColor: "",
      borderColor: "",
      buttonColor: "",
      pathColor: "",
      opacity: "",
    },
  };
  // values contains all the states and functions to update the states
  const values = {
    settings,
    setSettings,
    db,
    setDb,
    flowPlans,
    setFlowPlans,
    currentFlowPlan,
    setCurrentFlowPlan,
    addEditNode,
    setAddEditNode,
    update,
    setUpdate,
    move,
    setMove,
    animation,
    setAnimation,
    defaultNodeConfig,
  };
  return (
    // Providing all the states and functions to update the states
    <StateContext.Provider value={values}>{children}</StateContext.Provider>
  );
}
