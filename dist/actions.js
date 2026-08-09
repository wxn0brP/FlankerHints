export function executeAction(element, action) {
    switch (action) {
        case "click":
            element.click();
            break;
        case "focus":
            element.focus();
            break;
        case "hover":
            element.dispatchEvent(new MouseEvent("mouseover", {
                bubbles: true,
            }));
            break;
        case "scroll":
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            break;
    }
}
export function getDefaultAction(element) {
    const tag = element.tagName.toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea")
        return "focus";
    if (tag === "a" && element.hasAttribute("href"))
        return "click";
    return "click";
}
