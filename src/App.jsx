import "./App.css";
import Dexie from "dexie";
import Home from "./components/Home";
import { useStateContext } from "./context/StateContext";
import { useEffect, useState } from "react";
import { useDatabase } from "./hooks/useDatabase";

// Initialize Database
const initializeDb = new Dexie("FlowPlan");
// Create Database Schema
initializeDb.version(1).stores({
  flowPlans: "++id, refId, title, root, createdAt, updatedAt",
});

const App = () => {
  const { setDb, shared, setShared } = useStateContext();

  const handleGetShare = async () => {
    const href = window.location.href;
    if (!href.includes("?")) return;
    const wUrl = new URL(href);
    const title = wUrl.searchParams.get("title");
    const text = wUrl.searchParams.get("text");
    const url = wUrl.searchParams.get("url");
    const current = window.location.href;
    setShared((prev) => ({ ...prev, title, text, url, current }));
  };

  // Initialize Database on App Load
  useEffect(() => {
    const init = async () => {
      // Open Database
      const initDb = await initializeDb.open();
      // Set Database to Context
      setDb(initDb);
    };
    init();
    handleGetShare();
  }, []);

  return <Home />;
};

export default App;
