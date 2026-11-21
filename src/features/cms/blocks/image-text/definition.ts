import { alignmentField, imageField, linkField, pairRule, ratioField, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const imageTextDefinition = {
  type: "imageText" as const,
  name: "Image and text",
  plan: "4",
  description: "Image beside text, stacks on mobile.",
  fields: [
    textField("heading", "Heading", { required: true }),
    textareaField("text", "Text"),
    imageField("image", "Image"),
    textField("alt", "Image alt text"),
    textField("buttonLabel", "Button label"),
    linkField("buttonHref", "Button destination"),
  ],
  options: [
    selectField("imageSide", "Image side", [["left", "Left"], ["right", "Right"]]),
    ratioField(),
    alignmentField(),
  ],
  defaults: () => ({
    content: { heading: "Heading", text: "", image: "", alt: "", buttonLabel: "", buttonHref: "" },
    options: { imageSide: "left", ratio: "4/3", align: "left" },
  }),
  rules: [
    pairRule("buttonLabel", "buttonHref"),
    (c) => (c.image && !c.alt ? [{ path: "content.alt", message: "Add alt text for the image." }] : []),
  ],
} satisfies BlockDefinition;
