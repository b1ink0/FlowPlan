// Load the WebAssembly module
const imports = {
  env: {
    free: function (ptr) {
      return null;
    },
    malloc: function (size) {
      const malloc = new Uint8Array(size);
      return malloc.buffer;
    },
    printf: function (ptr) {
      console.log(ptr);
    },
    realloc: function (ptr, size) {
      const realloc = new Uint8Array(size);
      return realloc.buffer;
    },
    strdup: function (ptr) {
      return ptr
    },
  },
};
const wasmModule = new WebAssembly.Module(
  await fetch("https://cdn.jsdelivr.net/gh/b1ink0/cdn/wasm/tree.wasm").then(
    (response) => response.arrayBuffer()
  )
);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);

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
  wasmInstance.exports.addChild(parent, child);
  child.parent = parent;
  parent.children.push(child);
}

function removeChild(parent, child) {
  wasmInstance.exports.removeChild(parent, child);
  child.parent = null;
  parent.children = parent.children.filter((c) => c !== child);
}

// Define a function for updating a node's properties
function updateNode(node, title, description, markdown, html) {
  wasmInstance.exports.updateNode(node, title, description, markdown, html);
  node.title = title;
  node.description = description;
  node.markdown = markdown;
  node.html = html;
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

export { TreeNode, addChild, removeChild, updateNode, traverseTree };