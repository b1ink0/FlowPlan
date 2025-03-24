---
sidebar_position: 6
---

# Node Management

Nodes are the fundamental building blocks in FlowPlan. This guide covers all operations related to nodes.

## Understanding Nodes

A node is a visual element that represents a component of your project or plan. Nodes can:
- Contain detailed information
- Have hierarchical relationships with other nodes
- Be customized in appearance
- Be manipulated in various ways

The root node is created by default when you create a new plan. This node cannot be deleted or moved.

Root node's title is the same as the name of the plan. However, renaming a plan does not automatically rename its root node, and vice versa.

## Node Relationships

Nodes in FlowPlan are organized in a hierarchical tree structure:
- Each node (except the root) has exactly one parent
- A node can have multiple children (there is no limit to the number of children a node can have)
- The root node is created automatically when you create a new plan

## Node Navigation

### Map Navigation

To move around the Map Panel:
- **Desktop**: Press and hold left mouse button to grab and move the canvas
- **Mobile**: Hold and drag with your finger

### Zooming

- **Desktop**: Use the mouse scroll wheel
- **Mobile**: Pinch to zoom
- **Both**: Use the + and - buttons in the bottom right corner of the Map Panel

### Reset View

If you can't find your nodes or need to reset the view:
- Click the reset button in the bottom right corner of the Map Panel

## Node Operations

### Moving Nodes

To move a node:
1. Click on the move node button
2. Click where you want to move the node
3. Choose one of two options:
   - Click on another node to make your node its child
   - Click on a green box between nodes to insert at that position

Notes:
- You cannot move a node to one of its descendants as it would cause it to become orphaned (FlowPlan will display a red effect to indicate this)
- The root node cannot be moved
- Moving a node also moves all of its children
- When in node move mode, FlowPlan highlights how the node will be connected

### Adding Nodes

To add a new node:
1. Navigate to the node that will be the parent
2. Click the + icon
3. Enter a name for the node in the Node Panel
4. Click the Add button

Note: If you are in the process of adding a node and then click on another node's add button, your unsaved changes will be lost.

### Editing Nodes

To edit a node:
1. Identify the node you want to rename and move it into your view
2. Click on the edit button (pencil icon) on the node
3. Use the Node Panel to modify:
   - Node title and text formatting
   - Node appearance
   - Node settings
4. Click the Save button to save your changes

#### Title Formatting Options
- Text size
- Strike-through
- Italic
- Bold
- Text color
- Font selection
- Text alignment

### Deleting Nodes

To delete a node:
1. Click on the three dots (...) on the node
2. Click the delete button
3. Choose one of two options:
   - Delete Only Current Node: Moves the node's children to its parent
   - Delete Node And Its Children: Removes the entire subtree

Note: The root node cannot be deleted, and deletion cannot be undone.

### Copying Nodes

To copy a node:
1. Click on the copy button on the node
2. Choose:
   - Copy Only Current Node: Copies just the selected node
   - Copy Node and Its Children: Copies the entire subtree

Note: 
- You can copy a node from one plan to another plan
- Copied nodes are stored in memory and will be cleared if you refresh the page

### Pasting Nodes

To paste a copied node:
1. Navigate to the target location
2. Click on the three dots (...) of a node
3. Click the paste button
4. Choose:
   - Paste as Sibling: Places the copied node at the same level
   - Paste as Child: Places the copied node as a child

### Duplicating Nodes

To create an immediate copy of a node:
1. Click on the three dots (...) on the node
2. Click the duplicate button

Note: The root node cannot be duplicated.

### Hiding/Showing Children

If a node has children, you can toggle their visibility:
- Click the hide/show button on the node to collapse or expand its children

## Node Customization

You can customize nodes through the Node Panel:

### Node Preview

Toggle "Show Node Preview" option to see a live preview of the node you're editing.

### Title Formatting
- Text size
- Strike-through
- Italic
- Bold
- Text color
- Font selection

### Node Settings
- Random Colors: Apply random colors to your node styles (border, background, buttons, connections)
- Show Customize Colors: Opens a list of node style elements you can individually color
  - Border color
  - Background color
  - Button color
  - Connection color
  - You can assign random color to them individually or choose a color manually
- Opacity: Control the opacity of the node
- Copy Node Settings: Copy current node's settings (does not include title styles or copy to clipboard)
- Paste Node Settings: Apply copied settings to the current node
- Inherit Parent Node Settings: Copy the parent node's settings to the current node
- Inherit Parent Title Settings: Copy the parent node's title settings to the current node
- Reset to Current: Reset the node to its state before you started editing
- Reset to Default: Reset the node to original default settings
