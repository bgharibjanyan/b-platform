import { listField, numberField, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const faqDefinition = {
  type: "faq" as const,
  name: "FAQ accordion",
  plan: "10",
  description: "Questions and answers.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "Questions", "Question", [
      textField("question", "Question", { required: true }),
      textareaField("answer", "Answer", { required: true }),
    ]),
  ],
  options: [
    selectField("mode", "Open panels", [["single", "Single"], ["multiple", "Multiple"]]),
    numberField("initialOpen", "Initially open panel (0 = none)", 0, 50),
  ],
  defaults: () => ({ content: { heading: "Questions", items: [] }, options: { mode: "single", initialOpen: 0 } }),
} satisfies BlockDefinition;
