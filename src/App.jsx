import "./App.css";
import Dexie from "dexie";
import Home from "./components/Home";
import { useStateContext } from "./context/StateContext";
import { useEffect } from "react";

const initializeDb = new Dexie("TreeNotes");
initializeDb.version(1).stores({
  treeNotes: "++id, refId, title, root, createdAt, updatedAt",
});

const App = () => {
  const { setDb } = useStateContext();
  useEffect(() => {
    const init = async () => {
      const initDb = await initializeDb.open();
      setDb(initDb);
    };
    init();
  }, []);
  return <Home />;
};

export default App;
