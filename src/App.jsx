import "./App.css";
import Dexie from "dexie";
import Home from "./components/Home";
import { useStateContext } from "./context/StateContext";
import { useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSocket";

// Initialize Database
const initializeDb = new Dexie("FlowPlan");
// Create Database Schema
initializeDb.version(1).stores({
  flowPlans: "++id, refId, title, root, createdAt, updatedAt",
});

const App = () => {
  const { setDb, setWs } = useStateContext();
  const { handleCreateWebSocket } = useWebSocket();
  // Initialize Database on App Load
  useEffect(() => {
    const init = async () => {
      // Open Database
      const initDb = await initializeDb.open();
      // Set Database to Context
      setDb(initDb);
      // Create WebSocket
      const ws = handleCreateWebSocket();
      // Set WebSocket to Context
      setWs(ws);
    };
    init();
  }, []);
  return <Home />;
};

export default App;
