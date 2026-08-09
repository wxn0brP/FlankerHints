import "@wxn0brp/flanker-ui/html";
import { activate, deactivate } from "./hints.js";
window.FH = {
    init,
    activate,
    deactivate,
};
export let config;
export function init(cfg = {}) {
    config = {
        autoGenerate: true,
        hintPosition: "top-left",
        ...cfg,
        keys: {
            links: "f",
            inputs: "i",
            buttons: "b",
            ...cfg?.keys,
        },
    };
    document.addEventListener("keydown", event => {
        if (event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement) {
            return;
        }
        const key = event.key.toLowerCase();
        const { keys } = config;
        if (key === keys.links || key === keys.inputs || key === keys.buttons) {
            event.preventDefault();
            activate(key);
            return;
        }
        const customKeys = Array.from(document.querySelectorAll("[data-fk]")).map(el => el.getAttribute("data-fk"));
        if (customKeys.includes(key)) {
            event.preventDefault();
            activate(key);
        }
    });
}
export * from "./actions.js";
export * from "./hints.js";
export * from "./types.js";
export * from "./vars.js";
