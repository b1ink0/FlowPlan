---
sidebar_position: 7
---

# Document Panel

The Document Panel allows you to add rich, detailed content to each node in your plan using various field types. You can think of it as a simple WYSIWYG editor for node content.

## Opening the Document Panel

To open the Document Panel:
- Double-click on a node's title
- The panel will appear on the right side of the screen

## Panel Controls

### Basic Controls
- **Close**: Click the X button in the top left corner to close the panel
- **Fullscreen**: Click the expand button in the top right to toggle fullscreen mode
- **Resize**: Hover over the left border, then click and drag to adjust width
- **Settings**: Click the settings button to access Document Panel settings

### Node Navigation

Toggle node navigation by clicking the navigation button at the top of the Document Panel.

When enabled, four navigation buttons appear:
- **Parent**: Navigate to the parent node's Document Panel
- **First Child**: Navigate to the first child node's Document Panel
- **Previous Sibling**: Navigate to the previous sibling's Document Panel
- **Next Sibling**: Navigate to the next sibling's Document Panel

### Document Settings

Access document settings by clicking the settings button. Options include:
- **Field Gap**: Adjust spacing between fields
- Other customization options specific to the Document Panel

## Working with Fields

Fields are the building blocks of content in the Document Panel. Each field type serves a specific purpose.

### Adding a Field

To add a field:
1. Click the "Click To Add More Fields!" button at the bottom of the panel
2. Select the desired field type from the menu

### Available Field Types

#### Heading Field
Use for section titles and subtitles.

Options:
- Font size
- Strike through
- Italic
- Bold
- Text color
- Text font
- Text alignment

#### Paragraph Field
Use for detailed text content.

Options:
- Strike through
- Italic
- Bold
- Text color
- Text font
- Text alignment

#### Unordered List Field
Create bulleted lists.

Options:
- Bullet style: filled circle, empty circle, filled square, filled diamond, filled star, filled arrow
- Indentation: Make the list a sub-list of another list (note: this is just visual and does not connect the lists; you can't indent items in the same list—you'll need to create a new list below)
- Strike through
- Italic
- Bold
- Text color
- Text font

To move list items:
1. Double-click to enter editing mode
2. Hover over an item to see the `::` icon
3. Click and drag to reorder

#### Ordered List Field
Create numbered lists.

Options:
- Order style: Number, Roman Number, Alphabets
- Indentation
- Strike through
- Italic
- Bold
- Text color
- Text font

#### Task List Field
Create interactive checklists.

#### Link Field
Add hyperlinks with rich previews. This is the only way to add clickable links in the Document view.

Options:
- Preview Details: Toggle to show/hide link preview
- Preview Config: Choose what to display (title, description, favicon, site name, images)
- Strike through, italic, bold, link color, link font

#### Image Field
Add images to your document.

Notes:
- Images must be 1MB or smaller when stored locally
- Images are encoded as base64 in exported plans, increasing file size significantly
- Cloud sync stores images on Firebase storage instead of locally

#### File Field
Add file attachments to your document.

#### Table Field
Create structured data tables.

#### Separator Field
Add visual dividers between content sections.

#### Progress Field
Show progress indicators for tasks or projects.

#### Time Stamp Field
Add date/time information to your document.

#### Duration Field
Track time periods for tasks or events.

#### Duration Timeline Field
Visualize time periods in a timeline format.

#### Code Block Field
Add formatted code snippets with syntax highlighting.

## Field Operations

Most fields support common operations:
- Edit content
- Format text
- Adjust positioning
- Delete field
- Move field up or down

To delete a field:
- Click on the trash icon in the field's toolbar

To reorder fields:
- Use the up and down arrows in the field's toolbar
