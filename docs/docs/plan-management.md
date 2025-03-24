---
sidebar_position: 4
---

# Plan Management

This guide covers all operations related to creating and managing plans in FlowPlan.

## Creating a Plan

To create a new plan:

1. Open the Plan Panel
2. Enter a name for your plan in the input field at the top
3. Click the add button (+ icon) or press Enter on your keyboard

When you create a new plan, a root node with the same name is automatically created in the Map Panel.

## Loading a Plan

To load an existing plan:
1. Open the Plan Panel
2. Click on the plan name from the list
3. The plan will load in the Map Panel

## Renaming a Plan

To rename an existing plan:

1. Open the Plan Panel
2. Hover over the plan name (or hold on mobile)
3. Click on the three dots (...)
4. Click on the edit button (pencil icon)
5. The current name will appear in the input field at the top
6. Edit the name and click the add button (+ icon) to save

Note: Renaming a plan does not automatically rename its root node. These are separate operations. If you change the plan name, it does not directly change the root node's title. Similarly, if you change the title of the root node, it does not change the name of the plan.

## Deleting a Plan

To delete a plan:

1. Open the Plan Panel
2. Hover over the plan name (or hold on mobile)
3. Click on the three dots (...)
4. Click on the delete button (trash bin icon)
5. Confirm deletion when prompted

Warning: Deleting a plan is permanent and cannot be undone unless you have exported the plan previously.

## Exporting Plans

To export your plans:

1. Open the Plan Panel
2. Click on the export button at the bottom
3. Select the plans you want to export, or use "Select All"
4. Click on the Export button at the top of the plan list
5. Wait for processing to complete
6. A JSON file will be downloaded to your device

Exported plans include all nodes, their relationships, and document content.

## Importing Plans

To import plans:

1. Open the Plan Panel
2. Click on the import button at the bottom
3. Select the previously exported JSON file
4. The plans will be automatically imported

Note: Importing plans will not overwrite existing plans with the same name. Instead, duplicate plans will be created.
