import { linkField, pairRule, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const ctaDefinition = {
  type: "cta" as const,
  name: "Call-to-action strip",
  plan: "4",
  description: "Prompt with primary and optional secondary action.",
  fields: [
    textField("heading", "Heading", { required: true }),
    textareaField("text", "Supporting text"),
    textField("primaryLabel", "Primary label", { required: true }),
    linkField("primaryHref", "Primary destination", { required: true }),
    textField("secondaryLabel", "Secondary label"),
    linkField("secondaryHref", "Secondary destination"),
  ],
  options: [
    selectField("ctaTone", "Tone", [["accent", "Accent"], ["neutral", "Neutral"]]),
    selectField("alignment", "Alignment", [["split", "Split"], ["center", "Centered"]]),
  ],
  defaults: () => ({
    content: {
      heading: "Ready to talk?",
      text: "",
      primaryLabel: "Contact us",
      primaryHref: "#contact",
      secondaryLabel: "",
      secondaryHref: "",
    },
    options: { ctaTone: "accent", alignment: "split" },
  }),
  rules: [pairRule("secondaryLabel", "secondaryHref")],
} satisfies BlockDefinition;
