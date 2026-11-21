import { listField, numberField, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const tabsDefinition = {
  type: "tabs" as const,
  name: "Tabbed content",
  plan: "10",
  description: "Tabs with structured panels.",
  fields: [
    textField("heading", "Section heading"),
    listField("tabs", "Tabs", "Tab", [
      textField("label", "Tab label", { required: true }),
      textField("title", "Panel title"),
      textareaField("text", "Panel text", { help: "Blank lines separate paragraphs; lines starting with '- ' become a list." }),
    ], { titleKey: "label" }),
  ],
  options: [
    numberField("initial", "Initial tab (1 = first)", 1, 20),
    selectField("mobile", "Mobile controls", [["horizontal", "Horizontal scroll"], ["stacked", "Stacked"]]),
  ],
  defaults: () => ({ content: { heading: "Overview", tabs: [] }, options: { initial: 1, mobile: "horizontal" } }),
} satisfies BlockDefinition;
