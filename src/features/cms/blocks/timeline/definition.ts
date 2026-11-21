import { listField, selectField, textField, textareaField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const timelineDefinition = {
  type: "timeline" as const,
  name: "Timeline or steps",
  plan: "10",
  description: "Milestones or numbered steps.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "Items", "Item", [
      textField("title", "Title", { required: true }),
      textareaField("description", "Description"),
      textField("date", "Date (optional)"),
    ]),
  ],
  options: [
    selectField("mode", "Style", [["steps", "Numbered steps"], ["milestones", "Milestones"]]),
    toggleField("reveal", "Reveal motion"),
  ],
  defaults: () => ({ content: { heading: "How it works", items: [] }, options: { mode: "steps", reveal: false } }),
} satisfies BlockDefinition;
