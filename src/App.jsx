import "./App.css";
import Dexie from "dexie";
import Home from "./components/Home";
import { useStateContext } from "./context/StateContext";
import { useEffect } from "react";

// Initialize Database
const initializeDb = new Dexie("FlowPlan");
// Create Database Schema
initializeDb.version(1).stores({
  flowPlans: "++id, refId, title, root, createdAt, updatedAt",
});

const App = () => {
  const { setDb } = useStateContext();
  // Initialize Database on App Load
  useEffect(() => {
    const init = async () => {
      // Open Database
      const initDb = await initializeDb.open();
      // Set Database to Context
      setDb(initDb);
    };
    init();
  }, []);
  return <Home />;
};

export default App;
