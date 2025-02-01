# FlowPlan
 FlowPlan web-based project management application designed to streamline project planning, note-taking, and documentation. 

## Usage Guide
1. Main Interface

![Main Interface](/docs/assets/main-interface.png)

- Plan Panel
- Map Panel
- Node Panel
- Document Panel

1. Plan Management
	- How to create a plan?

		To create a plan open the Plan Panel then enter name for your plan in the input field at the top of the Plan Panel and click on add button ( + Icon ) or press enter on keyboard.
	
	- How to rename plan?

		To rename plan open the Plan Panel and hover over ( hold on mobile ) the plan name and click on the three dots `...` then click on the edit button ( pencil icon ) then the current name will be visible at the top of the Plan Panel input field then you can rename and click on ( + Icon ) to save the name.
	
	- How to delete a plan?

		To delete a plan open the Plan Panel and hover over ( hold on mobile ) the plan name and click on the three dots `...` then click on the delete button ( dustbin icon ).
	
	- How do export a plans?

		To export plan open the Plan Panel and click on the export button at the bottom of the Plan Panel then click on plans which you want to export or click on select all option to select all plan for export then click on the Export button located on top of plan list wait for some time then a json file will be downloaded.
	
	- How to import a plans?

		To import plans open the Plan Panel and click on the import button at the bottom of the Plan Panel then choose the exported Plans json file then it will automatically imported.
	
2. Node Management
	- Where will my plan be visible?

		When you create a plan from Plan Panel or import a Plan click on the Plan to load that plan into the Map Panel.
	
	- How to navigate Map Panel?

		- How to move in Map Panel?

			On desktop you can press and hold left click to grab the canvas and move it around.

			On mobile just hold on the Node Panel with finger and drag the finger to move around.
		
		- How to zoom in and out?

			On desktop you can use mouse scroll wheel to zoom in and out.

			On mobile you can pinch to zoom in and out.

		    Also there are buttons to control zoom on the bottom right of the Map Panel. Use + button to zoom and - to zoom out. You can also change the multiplier default `0.1` to change the amount it zooms in  and out.
		
		- How to reset zoom and position?
		- I can't nodes on my Nod Panel.

			Click on the reset button located at the bottom right of the Map panel.

	- What is a root node?

		Root node is the node which create by default when you create a new plan. This node cannot be deleted or moved.

		Root nodes title is same as the name of the plan. But if you change the plan name it does not directly change the root nodes title also if you change title of the root node it does not change the name of plan.

	- What is a Node?

		Node is the most basic component of the FlowPlans architecture.

	- How now are connected?

		Multiple nodes are connected in the hierarchial manner to crete a tree which establishes parent child relationship between nodes this relationship is one to many.

	- What are different node operation that can be performed?

		Nodes can be moved, edited, deleted, copied, pasted, duplicated and other nodes or new nodes can be added as its children and it can hide and show its children.

		- How to move node?

			Node moving can be activated by clicking on the move node button.
			Then you can click on where you want the node to be moved to.
			Now you have two choices:
			First you can move your node to other node by clicking on the node where you want it to moved to it will make your moved node as the child of the node you moved to.
			Second you can move your node in between the nodes you will see a green box where you can click to move node at that position.
			Note:
			You can't move a node to its children nodes as it will cause it to become orphan ( FlowPlan will give you a red effect that you can't move it there ).
			You can't move the root node as its a root node
			If You move a node then its all children will also get moved.
			When you are in node move mode it will highlight how the node will be connected.
		
		- How to delete node?

			First you will have to click on the `...` button on the node which will bring up more buttons.
			Then you can click on the delete button choice how you want to delete a node.
			First Delete Only Current Node this option will only delete the node you are interacting with and move deleted nodes  children to the parent of the deleted node.
			Second Delete Node And Its Children this option will deleted the node your are interacting with and its all children
			Note:
			You can't delete the root node.
			You con't undo a delete.

		- How to copy a node?

			Click on the copy button on the node which will give you choices>
			First Copy Only Current Node this copy only the node selected and not its children.
			Second Copy Node and Its Children this will copy the node selected and its all children.
			Note: 
			You can copy a node from one plan to other plan.
			If you refresh the page your copied node will be cleared from the memory.

		- How to paste a plan?

			Navigate to the node where you want to paste and click on the `...` button then click on the paste button which will bring a choices.
			First Paste as Sibling this option will paste the copied node as a sibling.
			Second Paste as Child this option will paste the copied node as a child.
		
		- How to duplicate node?

			Click on the `...` button of the node and then click on the duplicate button.
			Note: 
			You can't duplicate the root node.

		- How to add a child node / new node?

			Navigate to the node where you want to create a new node or add a new as its child and click on the plus icon which will bring up the Node panel where you can name the node and then click on the Add button to add it.
			Note: 
			If you are adding node and then you decide to click on other nodes add node button it wipe your unsaved button.

		- How to hide show the child nodes?

			If your node has children then there will be a hide show button chick on that to toggle children nodes visibility.

	- How many children and parent can one Node have?

		Nodes can have multiple children nodes there is not limit but only one parent node can be there for the node.
	
	- How to edit a Node?

		First identify the node you want to rename and move it in to your view then click on the edit button ( pencil icon ) it will open up the Node Panel on the right side of the screen ( Close the Document Panel if Node Panel is not visible ). Node Panel can be used performed multiple operation the node.
	
	- What are different edit operation which can be performed on the node?

		- What are different edit options for the node title?

			When you open up a node for editing in the Node Panel you will see the input field with your node's title which you can edit.

			You can modify title's text size, make it strike through, make it italic, make it bold, change the color of the title, change font of the title and reset it to default.
		
		- What are Node Settings?

			Node settings are used to customize style of the node.
		
		- What are different Node Settings?

			- Show Node Preview

				Toggling this option will bring a live preview of the node you want to edit.

			- Random Colors

				This option will randomly color your node styles like its border color, background color, button color, connection color.
			
			- Show Customize Colors

				This option will open up list all the node styles you can change color.

				This includes border color, background color, button color, connection color.

				You can assign random color to them individually or choose a color manually.

			- Opacity

				This option controls opacity of the node you can choose the opacity from the list.
			
			- Copy Node Settings

				This option allows you to copy current nodes settings ( This does not include the title styles ) ( Also this copy option will not copy styles to your clipboard so if you refresh copied settings will be gone ).
			
			- Paste Node Settings

				This option allows you to paste copied setting from different node on to current node.

			- Inherit Parent Node Settings

				If you click on the inherit icon then it will copy the current node's parent setting to current node.

			- Inherit Parent Title Settings

				If you click on the inherit icon then it will copy the current node's parent title setting to current node.
			
			- Reset to Current 

				If you click on the reset icon then it will reset the node's title settings and node settings to the last saved state. Note this just means that it reset it to the state before you stared editing the node.

			- Reset to Default

				If you click on the reset icon then it will reset the node's title settings and the node settings to original.
			
			- Click To Add More Fields!

				If you click on this option it will open up the Document Panel for the current node.

			- Save 

				If you click on the save button it will save the node title setting and node settings and close the node panel.

3. Map Panel

	- What are available views?

		Currently there are two views on horizontal view and vertical view I am planing to add a tagged view in future.
	
	- What does view mean?

		View is the way the nodes are displayed on the Map Panel.

	- What is Horizontal view?

		Horizontal view means that the node are displayed on the horizontal axis.
		Root node is displayed at the left and children nodes are displayed on the right side.

	- What is Vertical view?

		Vertical view means that the node are displayed on the vertical axis.
		Root node is display at the top and children nodes are displayed on the bottom side.

	- How to change the views?

		On the Map Panel on the top right side you will find a navbar containing a dropdown which can be used to change between views.
		Note: Your choice will be saved and will be used you will reload the page.

	- How to change between theme?

		There are currently only dark theme and light theme (dark by default).
		On the Map Panel on the top right side you will find a navbar containing a theme toggle button which will the first button from the left.

	- How to search?

		Note: Search is not implemented yet I am still deciding how the search should function.
		On the Map Panel on the top right side you will find a navbar containing a search field where you can search for the contents.

	- Where can i find settings?

		On the Map Panel on the top right side you will find a navbar containing a settings button which will be third from the left side.

	- What are different settings available?

		Settings has options like changing the background, toggling the transforms saving, auto sync options.

		- How to change the background?

			Click on the setting button and then click on background option which will lets you choose the background.

			- How many background are there?

				There are only 2 background for now one is grid and other is dot. dot one is useful in the light theme.

			- How to add custom background?

				Currently there is no supported for the custom background but I am planing to add it in future.

			- What are different background settings?

				You can change opacity, size, position, repeat,  of the background.
		
		- How to save my last position on the Map Panel?

			Click on the setting button and then click on Save Transforms and then toggle switch labeled Save.
		
		- How to turn on auto sync?

			Click on the setting button and then click on DB Auto Sync and toggle switch labeled Auto Sync.

		- How to show auto sync logs?

			Click on the settings button and then click on DB Auto Sync and toggle switch labeled Show Log.

4. Document Panel

	- What is Document Panel?

		Document Panel allows you to add more data into each node using different fields. You can think of it as a really simple WYSIWYG editor. 

	- How to open Document Panel?

		To open Document Panel double click on the nodes title it will open the Document Panel.

	- What is relation between Document Panel and Node?

		Each Node can have its separate Document Panel. Document Panel allows you to add more information and data to the node.
	
	- What are different operation which can be performed on Document Panel?

		Close, fullscreen, resize, toggle node navigation, open document settings.

		- How to close the Document Panel?

			You can close panel using the close button on the top left of the Document Panel.
		
		- How to toggle fullscreen in Document Panel?

			You can toggle the Document Panel fullscreen using the fullscreen button on the top right of the Document Panel.

		- How to resize / How to change width of Document Panel?

			Hover over the left border of the Document Panel then click and hold the border and drag it to adjust the width as required.

		- How to change the gap between fields?

			Click on the Document Settings button located on the top part of Document Panel then change the field gap by changing the value of input labeled Field Gap.

		- How to toggle Node navigation?

			Click on the Node navigation button located on the top part of Document Panel to toggle Node navigation.

		- What is Node navigation?

			Node navigation is visible after toggling on the Node navigation which will four new buttons to the Document panel. Two buttons at the top and two at the bottom of Document Panel.

			Parent: This button lets you navigate to Document Panel of the nodes parent.
			First Child: This button lets you navigate to the Document Panel of the nodes first child.
			Previous Sibling: This button lets you navigate to the Document Panel of the nodes previous sibling.
			Next Sibling: This button lets you navigate to the Document Panel of the nodes next sibling.

	- What are fields?

		Fields are the building block of the Document Panel. Each field has its unique function and unique operation.

		- What are different fields available?

			Heading, Paragraph, Unordered List, Ordered List, Task List, Link, Image, File, Table, Separator, Progress, Time Stamp, Duration, Duration Timeline, Code Block.


