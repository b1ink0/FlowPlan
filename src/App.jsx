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
  //  items: "++id,name,price,itemHasBeenPurchased"
  treeNotes: "++id, refId, title, root, createdAt, updatedAt",
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
  // console.log("db", db);
  const root = new TreeNode(
    "Root",
    "Description of root",
    "Markdown for root",
    "<strong>HTML</strong> for root"
  );
  // Root node
  const node1 = new TreeNode(
    "Node 1",
    "Description of node 1",
    "Markdown for node 1",
    "<strong>HTML</strong> for node 1"
  );
  const node2 = new TreeNode(
    "Node 2",
    "Description of node 2",
    "Markdown for node 2",
    "<strong>HTML</strong> for node 2"
  );
  const node3 = new TreeNode(
    "Node 3",
    "Description of node 3",
    "Markdown for node 3",
    "<strong>HTML</strong> for node 3"
  );
  const node4 = new TreeNode(
    "Node 4",
    "Description of node 4",
    "Markdown for node 4",
    "<strong>HTML</strong> for node 4"
  );
  const node5 = new TreeNode(
    "Node 5",
    "Description of node 5",
    "Markdown for node 5",
    "<strong>HTML</strong> for node 5"
  );

  // Add child nodes to the root node
  addChild(root, node1);
  addChild(root, node2);
  addChild(root, node3);

  // Add child nodes to node 2
  addChild(node2, node4);
  addChild(node2, node5);
  // console.log("root", root);
  // localStorage.setItem("note_1", JSON.stringify(root));
  // Traverse the tree and print each node's properties
  return <Home />;
};

export default App;
