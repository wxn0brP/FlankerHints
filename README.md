# FlankerHints

Vimium-style navigation hints for Flanker UI. Add keyboard shortcuts to navigate any page with visual hints.

## Features

- **Visual Hints**: Overlay labels with letters (like Vimium) appear on interactive elements
- **Multi-character Keys**: Above 26 elements, uniform two/three-letter keys are used (`AA`, `AB`...)
- **Progressive Filtering**: While hints are active, type letters to filter; full match executes
- **Off-screen Navigation**: Elements outside the viewport scroll into view before the action runs
- **data-fk Support**: Define custom shortcuts with `data-fk` attribute - containers show child hints, interactive elements execute immediately
- **Auto-generated Hints**: Automatically adds hints to links, inputs, and buttons
- **Configurable Keys & Selectors**: Customize activation keys and target selectors
- **Multiple Actions**: Click, focus, hover, or scroll to elements
- **Global Access**: Available via `window.FH` object

## Installation

```bash
npm install @wxn0brp/flanker-hints
```

## Usage

### Basic Setup

Include the required CSS and JavaScript:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@wxn0brp/flanker-hints@latest/dist/style.css">
<script src="https://cdn.jsdelivr.net/npm/@wxn0brp/flanker-hints@latest/dist/index.js" type="module"></script>
<script type="module">
    window.FH.init();
</script>
```

### Configuration

```typescript
import { init } from "@wxn0brp/flanker-hints";

init({
    keys: {
        links: "f",      // Press "f" to see link hints
        inputs: "i",     // Press "i" to see input hints
        buttons: "b",    // Press "b" to see button hints
    },
    selectors: {
        links: "a[href]",
        inputs: "input, select, textarea, [contenteditable]",
        buttons: "button, [role=button]",
    },
    autoGenerate: true,  // Auto-generate hints for common elements
    hintPosition: "top-left",
});
```

### Navigating hints

Once hints are visible:

- Type letters to filter hints progressively (non-matching labels hide)
- A complete key match executes the element's action
- `Backspace` removes the last typed character
- `Escape` hides all hints

### Using data-fk

#### Container with custom key

```html
<nav data-fk="g">
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</nav>
```

Press "g" to see hints "a", "b", "c" for the links.

#### Direct element

```html
<button data-fk="x">Action</button>
```

Press "x" to activate the button.

### Ignoring elements

```html
<a href="/tracked">Tracked</a>
<a href="/skipped" data-fk-i>Skipped by FlankerHints</a>

<div data-fk-i>
    <!-- the whole subtree is skipped -->
    <button>No hints here</button>
</div>
```

### Simple Control

```typescript
import { activate, deactivate } from "@wxn0brp/flanker-hints";

activate("f");  // Show link hints
deactivate();   // Hide all hints
```

Globally enable/disable the module (also available as `FH.enable` / `FH.disable`):

```typescript
import { disable, enable } from "@wxn0brp/flanker-hints";

disable();  // Ignore all trigger keys
enable();
```

## Actions

The module automatically determines the best action for each element:

- **Links**: Click
- **Inputs/Selects/Textareas/Contenteditable**: Focus
- **Buttons**: Click
- **Other elements**: Click

## Styling

Customize hint appearance with CSS variables:

```scss
:root {
    --FH-accent: #5D3FD3; // or --accent
    --txt: #fff;
}
```

## License

MIT
