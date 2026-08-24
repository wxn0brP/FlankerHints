export const IGNORE_SELECTOR = "[data-fk-i]";

let container: HTMLDivElement = null;

export function getHintsContainer(): HTMLDivElement {
	if (!container || !container.isConnected) {
		container = document.createElement("div");
		container.id = "FH-hints";
		container.style.display = "none";
		document.body.appendChild(container);
	}
	return container;
}
