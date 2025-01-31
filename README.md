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

		Nodes can be moved, edited, deleted, copied, duplicated and other nodes or new nodes can be added as its children.

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
