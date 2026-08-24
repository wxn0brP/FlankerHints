import { config } from "./index.js";
import { executeAction, getDefaultAction } from "./actions.js";
import { generateKeys } from "./keyGen.js";
import { getHintsContainer, IGNORE_SELECTOR } from "./vars.js";
const DEFAULT_SELECTORS = {
    links: "a[href]",
    inputs: "input, select, textarea, [contenteditable]",
    buttons: "button, [role=button]",
};
let activeHints = [];
let isActive = false;
let typedSequence = "";
function isIgnored(element) {
    return !!element.closest(IGNORE_SELECTOR);
}
function getSelectors() {
    return {
        ...DEFAULT_SELECTORS,
        ...config.selectors,
    };
}
export function isHintsActive() {
    return isActive;
}
function isInteractive(element) {
    const tag = element.tagName.toLowerCase();
    if ([
        "a",
        "button",
        "input",
        "select",
        "textarea",
    ].includes(tag))
        return true;
    if (element.isContentEditable)
        return true;
    if (element.hasAttribute("tabindex"))
        return true;
    const role = element.getAttribute("role");
    return [
        "button",
        "link",
        "checkbox",
        "radio",
        "tab",
        "menuitem",
    ].includes(role);
}
function isVisible(element) {
    if (typeof element.checkVisibility === "function") {
        if (!element.checkVisibility({
            opacityProperty: true,
        }))
            return false;
    }
    else {
        let node = element;
        while (node && node !== document.documentElement) {
            const style = window.getComputedStyle(node);
            if (style.display === "none" ||
                style.visibility === "hidden" ||
                style.opacity === "0")
                return false;
            node = node.parentElement;
        }
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
}
function collectTargets(targetKey) {
    const targets = [];
    const seen = new Set();
    const push = (element, action) => {
        if (seen.has(element))
            return;
        if (!isVisible(element))
            return;
        if (isIgnored(element))
            return;
        seen.add(element);
        targets.push({
            element,
            action: action ?? getDefaultAction(element),
        });
    };
    const selectors = getSelectors();
    const allSelector = `${selectors.links}, ${selectors.inputs}, ${selectors.buttons}, [tabindex]`;
    for (const el of document.querySelectorAll("[data-fk]")) {
        if ((el.getAttribute("data-fk") || "").toLowerCase() !== targetKey)
            continue;
        if (isInteractive(el)) {
            push(el);
            continue;
        }
        for (const child of el.querySelectorAll(allSelector)) {
            if (child.hasAttribute("data-fk"))
                continue;
            push(child);
        }
    }
    if (config.autoGenerate) {
        let selector = null;
        let action = "click";
        if (targetKey === config.keys.links) {
            selector = selectors.links;
            action = "click";
        }
        else if (targetKey === config.keys.inputs) {
            selector = selectors.inputs;
            action = "focus";
        }
        else if (targetKey === config.keys.buttons) {
            selector = selectors.buttons;
            action = "click";
        }
        if (selector) {
            for (const el of document.querySelectorAll(selector)) {
                if (el.hasAttribute("data-fk"))
                    continue;
                push(el, action);
            }
        }
    }
    targets.sort((a, b) => {
        const ra = a.element.getBoundingClientRect();
        const rb = b.element.getBoundingClientRect();
        return ra.top - rb.top || ra.left - rb.left;
    });
    return targets;
}
export function activate(key) {
    if (isActive)
        return;
    const targetKey = (key || config.keys.links).toLowerCase();
    const targets = collectTargets(targetKey);
    if (targets.length === 0)
        return;
    isActive = true;
    typedSequence = "";
    const keys = generateKeys(targets.length);
    const containerEl = getHintsContainer();
    activeHints = targets.map((target, index) => ({
        element: target.element,
        key: keys[index],
        action: target.action,
        label: createLabel(keys[index]),
    }));
    for (const hint of activeHints)
        containerEl.appendChild(hint.label);
    for (const hint of activeHints)
        positionHint(hint);
    containerEl.style.display = "block";
    window.addEventListener("scroll", updatePositions, {
        passive: true,
    });
    window.addEventListener("resize", updatePositions, {
        passive: true,
    });
    document.addEventListener("keydown", handleKeydown, true);
}
export function deactivate() {
    if (!isActive)
        return;
    isActive = false;
    typedSequence = "";
    for (const hint of activeHints)
        hint.label.remove();
    activeHints = [];
    getHintsContainer().style.display = "none";
    window.removeEventListener("scroll", updatePositions);
    window.removeEventListener("resize", updatePositions);
    document.removeEventListener("keydown", handleKeydown, true);
}
export function tryDirectActivate(key) {
    const elements = Array.from(document.querySelectorAll("[data-fk]"));
    const matching = elements.filter(el => !isIgnored(el) &&
        (el.getAttribute("data-fk") || "").toLowerCase() === key.toLowerCase());
    const hasGroup = matching.some(el => !isInteractive(el));
    if (hasGroup || matching.length === 0)
        return false;
    executeAction(matching[0], getDefaultAction(matching[0]));
    return true;
}
function createLabel(key) {
    const label = document.createElement("div");
    label.className = "FH-hint";
    label.textContent = key.toUpperCase();
    return label;
}
function positionHint(hint) {
    const rect = hint.element.getBoundingClientRect();
    const width = hint.label.offsetWidth;
    const height = hint.label.offsetHeight;
    const pos = config.hintPosition;
    let left = pos.endsWith("-left") ? rect.left : rect.right - width;
    let top = pos.startsWith("top") ? rect.top : rect.bottom - height;
    left = Math.max(0, Math.min(left, window.innerWidth - width));
    top = Math.max(0, Math.min(top, window.innerHeight - height));
    hint.label.style.left = `${left}px`;
    hint.label.style.top = `${top}px`;
}
function updatePositions() {
    if (!isActive)
        return;
    for (const hint of activeHints) {
        if (hint.label.style.display === "none")
            continue;
        positionHint(hint);
    }
}
function applyFilter() {
    for (const hint of activeHints) {
        const matches = hint.key.startsWith(typedSequence);
        hint.label.style.display = matches ? "" : "none";
    }
}
function handleKeydown(event) {
    if (event.key === "Escape") {
        deactivate();
        return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey)
        return;
    if (event.key === "Backspace") {
        event.preventDefault();
        typedSequence = typedSequence.slice(0, -1);
        applyFilter();
        return;
    }
    const key = event.key.toLowerCase();
    if (!/^[a-z]$/.test(key))
        return;
    event.preventDefault();
    const next = typedSequence + key;
    const matches = activeHints.filter(hint => hint.key.startsWith(next));
    if (matches.length === 0) {
        deactivate();
        return;
    }
    typedSequence = next;
    if (matches.length === 1 && matches[0].key === next) {
        executeHint(matches[0]);
        return;
    }
    applyFilter();
}
function executeHint(hint) {
    executeAction(hint.element, hint.action);
    deactivate();
}
