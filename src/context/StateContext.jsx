// @ts-check
import React, { useContext, useState } from "react";
import bg_1 from "../assets/backgrounds/bg-1.png";
import bg_2 from "../assets/backgrounds/bg-2.png";
import bg_3 from "../assets/backgrounds/bg-3.jpg";

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
      useSavedTransformState: localStorage.getItem("useSavedTransformState") ?? "false",
    },
  });

  // db state contains the database object to interact with the indexedDB database
  const [db, setDb] = useState(null);

  // flowPlans state contains all the notes in the tree
  const [flowPlans, setFlowPlans] = useState([]);

  // currentFlowPlan state contains the current selected note
  const [currentFlowPlan, setCurrentFlowPlan] = useState(null);
  const [currentFlowPlanNode, setCurrentFlowPlanNode] = useState(null);

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
      color: "var(--text-primary)",
      fontFamily: "var(--font-primary)",
    },
    nodeConfig: {
      backgroundColor: "var(--bg-quaternary)",
      borderColor: "var(--border-primary)",
      buttonColor: "var(--btn-secondary)",
      pathColor: "var(--btn-secondary)",
      opacity: 100,
    },
  };

  const [copyPasteNodeConfig, setCopyPasteNodeConfig] = useState({});
  const [globalBackgrounds, setGlobalBackgrounds] = useState([
    {
      backgroundImage: "url(" + bg_1 + ")",
      backgroundRepeat: "repeat",
      backgroundSize: "300px",
      backgroundPosition: "center",
      opacity: "0.2",
    },
    {
      backgroundImage: "url(" + bg_2 + ")",
      backgroundRepeat: "repeat",
      backgroundSize: "150px",
      backgroundPosition: "center",
      opacity: "0.2",
    },
    {
      backgroundImage: "url(" + bg_3 + ")",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: "0.2",
    },
  ]);
  const [currentGlobalBackground, setCurrentGlobalBackground] = useState(() => {
    const currentGlobalBackground = localStorage.getItem(
      "currentGlobalBackground"
    );
    if (currentGlobalBackground) {
      return JSON.parse(currentGlobalBackground);
    } else {
      return {
        backgroundImage: "url(" + bg_1 + ")",
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
        backgroundPosition: "center",
        opacity: "0.2",
      };
    }
  });

  const [currentTransformState, setCurrentTransformState] = useState(() => {
    const currentTransformState = localStorage.getItem("currentTransformState");
    if (currentTransformState) {
      return JSON.parse(currentTransformState);
    } else {
      return {
        previousScale: 1,
        scale: 1,
        positionX: settings.treeConfig.renderType === "verticalTree" ? 0 : 300,
        positionY: 0,
      };
    }
  });

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
    currentFlowPlanNode,
    setCurrentFlowPlanNode,
    addEditNode,
    setAddEditNode,
    update,
    setUpdate,
    move,
    setMove,
    animation,
    setAnimation,
    defaultNodeConfig,
    copyPasteNodeConfig,
    setCopyPasteNodeConfig,
    globalBackgrounds,
    setGlobalBackgrounds,
    currentGlobalBackground,
    setCurrentGlobalBackground,
    currentTransformState,
    setCurrentTransformState,
  };
  return (
    // Providing all the states and functions to update the states
    <StateContext.Provider value={values}>{children}</StateContext.Provider>
  );
}
