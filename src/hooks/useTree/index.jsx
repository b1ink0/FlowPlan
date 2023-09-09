function createNode(id, title, data = []) {
  return {
    id,
    title,
    data,
    expanded: true,
    children: [],
  }
}
// Define functions for adding and removing child nodes from a parent node
function addChild(parent, child) {
  parent.children.push(child);
}

function removeChild(parent, child) {
  parent.children = parent.children.filter((c) => c !== child);
}

// Define a function for updating a node's properties
function updateNode(node, title, data, expanded) {
  node.title = title || node.title;
  node.data = data || node.data;
  node.expanded = expanded || node.expanded;
}

function deleteNode(parent, node, location) {
  // Transfer child nodes to parent in reverse order
  for (let i = 0; node.children.length > i; i++) {
    let child = node.children[i];
    // Insert child node at the current node's position in parent's children array
    parent.children.splice(location + 1 + i, 0, child);
    // Update child node's parent and indexInParent properties
  }
  // Remove node from parent's children array
  removeChild(parent, node);
}

function destroyNode(parent,node, ) {
  // Remove node from parent's children array
  removeChild(parent, node);
  // Remove node from tree
  node = null;
}

function moveNode(parent,node, newParent) {
  // Remove node from current parent's children array
  removeChild(parent, node);
  // Add node to new parent's children array
  addChild(newParent, node);
}

// Define a function for traversing the tree and printing each node's properties
function traverseTree(node, level = 0) {
  console.log(" ".repeat(level * 2) + node.id);
  for (let child of node.children) {
    traverseTree(child, level + 1);
  }
}

export {
  createNode,
  addChild,
  removeChild,
  updateNode,
  deleteNode,
  destroyNode,
  moveNode,
  traverseTree,
};
