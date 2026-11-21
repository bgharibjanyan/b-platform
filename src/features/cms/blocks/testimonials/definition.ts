import { imageField, linkField, listField, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const testimonialsDefinition = {
  type: "testimonials" as const,
  name: "Testimonials",
  plan: "4",
  description: "Approved company-provided quotes.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "Quotes", "Quote", [
      textareaField("quote", "Quote", { required: true }),
      textField("name", "Name", { required: true }),
      textField("role", "Role"),
      imageField("portrait", "Portrait"),
      linkField("source", "Source link"),
    ], { titleKey: "name" }),
  ],
  options: [
    selectField("columns", "Desktop columns", [["1", "1"], ["2", "2"], ["3", "3"]]),
    selectField("style", "Presentation", [["plain", "Plain"], ["bordered", "Bordered"]]),
  ],
  defaults: () => ({ content: { heading: "What clients say", items: [] }, options: { columns: "2", style: "plain" } }),
} satisfies BlockDefinition;
