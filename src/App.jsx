import "./App.css";
import Dexie from "dexie";
import Home from "./components/Home";
import { useStateContext } from "./context/StateContext";
import { useEffect } from "react";
import { useWebSocket } from "./hooks/useWebSocket";
import OpenAI from "openai";

// Initialize Database
const initializeDb = new Dexie("FlowPlan");
// Create Database Schema
initializeDb.version(1).stores({
  flowPlans: "++id, refId, title, root, createdAt, updatedAt",
});

const App = () => {
  const { setDb, setWs, setOpenai } = useStateContext();
  const { handleCreateWebSocket } = useWebSocket();
  // Initialize Database on App Load
  useEffect(() => {
    const init = async () => {
      // Open Database
      const initDb = await initializeDb.open();
      // Set Database to Context
      setDb(initDb);
      // Create WebSocket
      // const ws = handleCreateWebSocket();
      // Set WebSocket to Context
      // setWs(ws);
      // Create OpenAI Instance
      const openai = new OpenAI({
        apiKey: "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",
        dangerouslyAllowBrowser: true,
      });
      // Set OpenAI to Context
      setOpenai(openai);
    };
    init();
  }, []);
  return <Home />;
};

export default App;
