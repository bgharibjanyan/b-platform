import { alignmentField, listField, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const richTextDefinition = {
  type: "richText" as const,
  name: "Rich text",
  plan: "4",
  description: "Structured paragraphs and lists with inline links.",
  fields: [
    textField("heading", "Heading"),
    listField("blocks", "Text blocks", "Text block", [
      selectField("kind", "Kind", [["paragraph", "Paragraph"], ["bullets", "Bulleted list"], ["numbered", "Numbered list"]]),
      textareaField("text", "Text", { required: true, help: "Lists: one item per line. Links: [label](https://…)" }),
    ], { titleKey: "text" }),
  ],
  options: [
    selectField("textWidth", "Text width", [["narrow", "Narrow"], ["standard", "Standard"]]),
    alignmentField(),
  ],
  defaults: () => ({
    content: { heading: "", blocks: [{ kind: "paragraph", text: "Write something here." }] },
    options: { textWidth: "narrow", align: "left" },
  }),
} satisfies BlockDefinition;
