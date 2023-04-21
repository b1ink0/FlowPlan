// Define the tree node structure
class TreeNode {
  constructor(id, title, description = "", markdown = "", html = "") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.markdown = markdown;
    this.html = html;
    this.parent = null;
    this.children = [];
  }
}

// Define functions for adding and removing child nodes from a parent node
function addChild(parent, child) {
  child.parent = parent;
  parent.children.push(child);
}

function removeChild(parent, child) {
  child.parent = null;
  parent.children = parent.children.filter((c) => c !== child);
}

// Define a function for updating a node's properties
function updateNode(node, title, description, markdown, html) {
  node.title = title;
  node.description = description;
  node.markdown = markdown;
  node.html = html;
}

function deleteNode(node, location) {
  // Transfer child nodes to parent in reverse order
  let parent = node.parent;
  for (let i = 0; node.children.length > i ; i++) {
    let child = node.children[i];
    // Insert child node at the current node's position in parent's children array
    parent.children.splice(location + 1 + i, 0, child);
    // Update child node's parent and indexInParent properties
    child.parent = parent;
  }
  // Remove node from parent's children array
  removeChild(parent, node);
}


function destroyNode(node) {
  // Remove node from parent's children array
  removeChild(node.parent, node);
  // Remove node from tree
  node = null;
}

function moveNode(node, newParent) {
  // Remove node from current parent's children array
  removeChild(node.parent, node);
  // Add node to new parent's children array
  addChild(newParent, node);
}

// Define a function for traversing the tree and printing each node's properties
function traverseTree(node, level = 0) {
  console.log(" ".repeat(level * 2) + node.id);
  console.log(" ".repeat(level * 2) + node.title);
  console.log(" ".repeat(level * 2) + node.description);
  console.log(" ".repeat(level * 2) + node.markdown);
  console.log(" ".repeat(level * 2) + node.html);
  for (let child of node.children) {
    traverseTree(child, level + 1);
  }
}

export {
  TreeNode,
  addChild,
  removeChild,
  updateNode,
  deleteNode,
  destroyNode,
  moveNode,
  traverseTree,
};
