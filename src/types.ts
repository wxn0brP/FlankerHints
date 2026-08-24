export type FH_Action = "click" | "focus" | "hover" | "scroll";

export type FH_HintPosition =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

export interface FH_Keys {
	links: string;
	inputs: string;
	buttons: string;
}

export interface FH_Selectors {
	links: string;
	inputs: string;
	buttons: string;
}

export interface FH_Config {
	keys: FH_Keys;
	selectors: FH_Selectors;
	autoGenerate: boolean;
	hintPosition: FH_HintPosition;
	enabled: boolean;
}

export interface FH_Hint {
	element: HTMLElement;
	key: string;
	label: HTMLElement;
	action: FH_Action;
}

export interface FH_Group {
	container: HTMLElement;
	key: string;
	children: HTMLElement[];
}
