import "@wxn0brp/flanker-ui/html";

import { activate, deactivate } from "./hints";
import type { FH_Config } from "./types";

(window as any).FH = {
	init,
	activate,
	deactivate,
};

export let config: FH_Config;

export function init(cfg: Partial<FH_Config> = {}) {
	config = {
		autoGenerate: true,
		hintPosition: "top-left",
		enabled: true,
		...cfg,
		keys: {
			links: "f",
			inputs: "i",
			buttons: "b",
			...cfg?.keys,
		},
	};

	document.addEventListener("keydown", event => {
		if (!config.enabled) return;
		if (
			event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLTextAreaElement
		) {
			return;
		}

		const key = event.key.toLowerCase();
		const { keys } = config;

		if (key === keys.links || key === keys.inputs || key === keys.buttons) {
			event.preventDefault();
			activate(key);
			return;
		}

		const customKeys = Array.from(document.querySelectorAll("[data-fk]")).map(
			el => el.getAttribute("data-fk"),
		);

		if (customKeys.includes(key)) {
			event.preventDefault();
			activate(key);
		}
	});
}

export function enable() {
	config.enabled = true;
}

export function disable() {
	config.enabled = false;
	deactivate();
}

export * from "./actions";
export * from "./hints";
export * from "./types";
export * from "./vars";
