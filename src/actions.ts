import type { FH_Action } from "./types";

export function executeAction(element: HTMLElement, action: FH_Action) {
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

export function getDefaultAction(element: HTMLElement): FH_Action {
	const tag = element.tagName.toLowerCase();

	if (tag === "input" || tag === "select" || tag === "textarea") return "focus";
	if (tag === "a" && element.hasAttribute("href")) return "click";

	return "click";
}
