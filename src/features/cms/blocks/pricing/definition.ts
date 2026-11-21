import { fieldRecords } from "../../field-values";
import { columnsField, linkField, listField, textField, textareaField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const pricingDefinition = {
  type: "pricing" as const,
  name: "Pricing or packages",
  plan: "10",
  description: "Packages with inclusions.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "Packages", "Package", [
      textField("name", "Name", { required: true }),
      textField("price", "Price label"),
      textareaField("description", "Description"),
      textareaField("inclusions", "Inclusions", { help: "One per line" }),
      toggleField("featured", "Featured"),
      textField("actionLabel", "Action label"),
      linkField("actionHref", "Action destination"),
    ]),
  ],
  options: [columnsField("columns", 2, 3)],
  defaults: () => ({ content: { heading: "Packages", items: [] }, options: { columns: "3" } }),
  rules: [
    (c) => (fieldRecords(c.items).filter((i) => i.featured).length > 1 ? [{ path: "content.items", message: "Highlight at most one package." }] : []),
    (c) => fieldRecords(c.items).flatMap((i, n: number) => (i.actionLabel && !i.actionHref ? [{ path: `content.items.${n}.actionHref`, message: "An action label needs a destination link." }] : [])),
  ],
} satisfies BlockDefinition;
