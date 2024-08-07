// Define a function for creating a new node
function createNode(id, title, data = [], config = {}) {
  return {
    id,
    title,
    data,
    config,
    expanded: true,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
// Define functions for adding and removing child nodes from a parent node
function addChild(parent, child) {
  parent.children.push(child);
}

function removeChild(parent, child) {
  if (!parent) return;
  if (!child) return;
  parent.children = parent.children.filter((c) => c !== child);
}

// Define a function for updating a node's properties
function updateNode(node, title, data, expanded, config) {
  node.title = title || node.title;
  node.data = data || node.data;
  node.expanded = expanded || node.expanded;
  node.config = config || node.config;
  // update updatedAt property if tile, data is updated
  if (!expanded) node.updatedAt = new Date();
}

// Define a function for deleting a node
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

// Define a function for destroying a node
function destroyNode(parent, node) {
  // Remove node from parent's children array
  removeChild(parent, node);
  // Remove node from tree
  node = null;
}

// Define a function for moving a node
function moveNode(parent, node, newParent) {
  // Remove node from current parent's children array
  removeChild(parent, node);
  // Add node to new parent's children array
  addChild(newParent, node);
}

// Define a function for reordering a node
function reorderNode(oldParent, newParent, oldNode, newlocation, oldLocation) {
  // if nodes are on the same level
  if (oldParent.id === newParent.id) {
    // remove node from old location
    newParent.children.splice(oldLocation, 1);
    // update new location if old location is less than new location
    if (newlocation > oldLocation) {
      newlocation = newlocation - 1;
    }
  }
  // if nodes are on different levels
  else {
    // remove node from old location
    removeChild(oldParent, oldNode);
  }
  // insert node at new location
  newParent.children.splice(newlocation, 0, oldNode);
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
  reorderNode,
  traverseTree,
};
