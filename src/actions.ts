import type { FH_Action } from "./types";

function isInViewport(element: HTMLElement) {
	const rect = element.getBoundingClientRect();
	const viewportWidth =
		window.innerWidth || document.documentElement.clientWidth;
	const viewportHeight =
		window.innerHeight || document.documentElement.clientHeight;
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= viewportHeight &&
		rect.right <= viewportWidth
	);
}

function runAction(element: HTMLElement, action: FH_Action) {
	switch (action) {
		case "click":
			element.click();
			break;
		case "focus":
			element.focus();
			break;
		case "hover":
			element.dispatchEvent(
				new MouseEvent("mouseover", {
					bubbles: true,
				}),
			);
			break;
		case "scroll":
			element.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			break;
	}
}

export function executeAction(element: HTMLElement, action: FH_Action) {
	if (action !== "scroll" && !isInViewport(element)) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
		setTimeout(() => runAction(element, action), 300);
		return;
	}
	runAction(element, action);
}

export function getDefaultAction(element: HTMLElement): FH_Action {
	const tag = element.tagName.toLowerCase();

	if (
		tag === "input" ||
		tag === "select" ||
		tag === "textarea" ||
		element.isContentEditable
	)
		return "focus";
	if (tag === "a" && element.hasAttribute("href")) return "click";

	return "click";
}
