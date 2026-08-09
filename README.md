# FlankerHints

Vimium-style navigation hints for Flanker UI. Add keyboard shortcuts to navigate any page with visual hints.

## Features

- **Visual Hints**: Overlay labels with letters (like Vimium) appear on interactive elements
- **data-fk Support**: Define custom shortcuts with `data-fk` attribute
- **Auto-generated Hints**: Automatically adds hints to links, inputs, and buttons
- **Configurable Keys**: Customize activation keys (default: f=links, i=inputs, b=buttons)
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
    autoGenerate: true,  // Auto-generate hints for common elements
    hintPosition: "top-left",
});
```

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

### Programmatic Control

```typescript
import { activate, deactivate } from "@wxn0brp/flanker-hints";

activate("f");  // Show link hints
deactivate();   // Hide all hints
```

## Actions

The module automatically determines the best action for each element:

- **Links**: Click
- **Inputs/Selects/Textareas**: Focus
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
