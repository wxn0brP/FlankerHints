import "@wxn0brp/flanker-ui/html";

import {
	activate,
	deactivate,
	isHintsActive,
	tryDirectActivate,
} from "./hints";
import type { FH_Config } from "./types";
import { IGNORE_SELECTOR } from "./vars";

export let config: FH_Config;

const defaultConfig: FH_Config = {
	autoGenerate: true,
	hintPosition: "top-left",
	enabled: true,
	keys: {
		links: "f",
		inputs: "i",
		buttons: "b",
	},
	selectors: {
		links: "a[href]",
		inputs: "input, select, textarea, [contenteditable]",
		buttons: "button, [role=button]",
	},
};

let customKeysCache: Set<string> | null = null;
let observer: MutationObserver | null = null;

function getCustomKeys(): Set<string> {
	if (!customKeysCache) {
		customKeysCache = new Set();
		for (const el of document.querySelectorAll<HTMLElement>("[data-fk]")) {
			if (el.closest(IGNORE_SELECTOR)) continue;
			customKeysCache.add((el.getAttribute("data-fk") || "").toLowerCase());
		}
	}
	return customKeysCache;
}

export function init(cfg: Partial<FH_Config> = {}) {
	config = {
		...defaultConfig,
		...cfg,
		keys: {
			...defaultConfig.keys,
			...cfg?.keys,
		},
		selectors: {
			...defaultConfig.selectors,
			...cfg?.selectors,
		},
	};

	customKeysCache = null;
	observer?.disconnect();
	observer = new MutationObserver(() => {
		customKeysCache = null;
	});
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
		attributeFilter: [
			"data-fk",
		],
	});

	document.addEventListener("keydown", handleKeydown);
}

function handleKeydown(event: KeyboardEvent) {
	if (!config.enabled) return;
	if (isHintsActive()) return;
	if (event.ctrlKey || event.metaKey || event.altKey) return;

	const target = event.target as HTMLElement | null;
	if (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target?.isContentEditable
	)
		return;

	const key = event.key.toLowerCase();
	const { keys } = config;

	if (key === keys.links || key === keys.inputs || key === keys.buttons) {
		event.preventDefault();
		activate(key);
		return;
	}

	if (getCustomKeys().has(key)) {
		event.preventDefault();
		if (!tryDirectActivate(key)) activate(key);
	}
}

export function enable() {
	config.enabled = true;
}

export function disable() {
	config.enabled = false;
	deactivate();
}

(window as any).FH = {
	init,
	activate,
	deactivate,
	enable,
	disable,
};

export * from "./actions";
export * from "./hints";
export * from "./keyGen";
export * from "./types";
export * from "./vars";
