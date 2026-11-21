import { selectField, textField, toggleField } from "./fields";

export const sectionFields = [
  textField("label", "Internal section name", { required: true }),
  textField("anchor", "Section anchor", { help: "Optional. Use a short ID such as services." }),
  selectField("spacing", "Spacing", [["compact", "Compact"], ["normal", "Normal"], ["relaxed", "Relaxed"]]),
  selectField("width", "Width", [["narrow", "Narrow"], ["standard", "Standard"], ["wide", "Wide"]]),
  selectField("tone", "Section tone", [["default", "Default"], ["muted", "Muted"], ["accent", "Accent"], ["ink", "Ink"]]),
  toggleField("hidden", "Hide section"),
];
