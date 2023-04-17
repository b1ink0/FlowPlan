import "./App.css";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import DisplayTree from "./components/DisplayTree";
import Home from "./components/Home";
import { StateProvider, useStateContext } from "./context/StateContext";
import { TreeNode, addChild, traverseTree } from "./hooks/useTree";
import { useEffect } from "react";

const initializeDb = new Dexie("TreeNotes");
initializeDb.version(1).stores({
  treeNotesIndex: "++id, refId, title, createdAt, updatedAt",
  treeNotes: "++id, refId, title, root, createdAt, updatedAt",
  treeNotesExpanded: "++id, refId, expanded",
});

const App = () => {
  const { db, setDb } = useStateContext();
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
