import "./App.css";
import DisplayTree from "./components/DisplayTree";
import { StateProvider } from "./context/StateContext";
import { TreeNode, addChild, traverseTree } from "./hooks/useTree";

function App() {
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

  // Traverse the tree and print each node's properties
  return (
    <StateProvider>
      <DisplayTree node={root} />
    </StateProvider>
  );
}

export default App;
