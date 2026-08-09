import { config } from ".";
import { executeAction, getDefaultAction } from "./actions";
import type { FH_Action, FH_Hint } from "./types";
import { hintsContainer } from "./vars";

let activeHints: FH_Hint[] = [];
let isActive = false;

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export function activate(key?: string) {
	if (isActive) return;
	isActive = true;

	const targetKey = key || config.keys.links;

	const hints: FH_Hint[] = [];

	const fkContainers = document.querySelectorAll<HTMLElement>(`[data-fk]`);
	fkContainers.forEach(container => {
		const containerKey = container.getAttribute("data-fk");
		if (containerKey !== targetKey) return;

		const children = Array.from(
			container.querySelectorAll<HTMLElement>(
				"a[href], button, input, select, textarea, [tabindex], [role]",
			),
		).filter(el => isVisible(el));

		children.forEach((child, index) => {
			if (index < alphabet.length) {
				const hint = createHint(
					child,
					alphabet[index],
					getDefaultAction(child),
				);
				hints.push(hint);
			}
		});
	});

	const fkElements = document.querySelectorAll<HTMLElement>(`[data-fk]`);
	fkElements.forEach(element => {
		const elementKey = element.getAttribute("data-fk");
		if (elementKey === targetKey && !element.querySelector("[data-fk]")) {
			const hint = createHint(element, elementKey, getDefaultAction(element));
			hints.push(hint);
		}
	});

	if (config.autoGenerate && targetKey === config.keys.links) {
		const links = Array.from(
			document.querySelectorAll<HTMLElement>("a[href]"),
		).filter(el => isVisible(el) && !el.hasAttribute("data-fk"));
		links.forEach((link, index) => {
			if (index < alphabet.length) {
				const hint = createHint(link, alphabet[index], "click");
				hints.push(hint);
			}
		});
	}

	if (config.autoGenerate && targetKey === config.keys.inputs) {
		const inputs = Array.from(
			document.querySelectorAll<HTMLElement>("input, select, textarea"),
		).filter(el => isVisible(el) && !el.hasAttribute("data-fk"));
		inputs.forEach((input, index) => {
			if (index < alphabet.length) {
				const hint = createHint(input, alphabet[index], "focus");
				hints.push(hint);
			}
		});
	}

	if (config.autoGenerate && targetKey === config.keys.buttons) {
		const buttons = Array.from(
			document.querySelectorAll<HTMLElement>("button, [role=button]"),
		).filter(el => isVisible(el) && !el.hasAttribute("data-fk"));
		buttons.forEach((button, index) => {
			if (index < alphabet.length) {
				const hint = createHint(button, alphabet[index], "click");
				hints.push(hint);
			}
		});
	}

	activeHints = hints;
	hintsContainer.style.display = "block";
	document.addEventListener("keydown", handleKeydown);
}

export function deactivate() {
	if (!isActive) return;
	isActive = false;

	activeHints.forEach(hint => {
		hint.label.remove();
	});
	activeHints = [];
	hintsContainer.style.display = "none";
	document.removeEventListener("keydown", handleKeydown);
}

function createHint(
	element: HTMLElement,
	key: string,
	action: FH_Action,
): FH_Hint {
	const label = document.createElement("div");
	label.className = "FH-hint";
	label.textContent = key.toUpperCase();

	const rect = element.getBoundingClientRect();
	label.style.position = "fixed";
	label.style.left = `${rect.left}px`;
	label.style.top = `${rect.top}px`;
	label.style.zIndex = "9999";

	hintsContainer.appendChild(label);

	return {
		element,
		key,
		label,
		action,
	};
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === "Escape") {
		deactivate();
		return;
	}

	const key = event.key.toLowerCase();
	const hint = activeHints.find(h => h.key === key);

	if (hint) {
		executeAction(hint.element, hint.action);
		deactivate();
	}
}

function isVisible(element: HTMLElement) {
	const rect = element.getBoundingClientRect();
	return rect.width > 0 && rect.height > 0;
}
