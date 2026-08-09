export type FH_Action = "click" | "focus" | "hover" | "scroll";
export interface FH_Config {
    keys: {
        links: string;
        inputs: string;
        buttons: string;
    };
    autoGenerate: boolean;
    hintPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
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
