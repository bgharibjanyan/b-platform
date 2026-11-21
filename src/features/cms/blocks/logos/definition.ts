import { imageField, linkField, listField, selectField, textField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const logosDefinition = {
  type: "logos" as const,
  name: "Logo strip",
  plan: "10",
  description: "Partner or client logos.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "Logos", "Logo", [
      imageField("logo", "Logo", { required: true }),
      textField("name", "Organization name", { required: true }),
      linkField("url", "Destination"),
    ], { titleKey: "name" }),
  ],
  options: [
    selectField("color", "Color", [["color", "Color"], ["grayscale", "Grayscale"]]),
    selectField("density", "Spacing", [["compact", "Compact"], ["relaxed", "Relaxed"]]),
    toggleField("wrap", "Wrap on mobile"),
  ],
  defaults: () => ({
    content: { heading: "Trusted by", items: [] },
    options: { color: "color", density: "compact", wrap: true },
  }),
} satisfies BlockDefinition;
