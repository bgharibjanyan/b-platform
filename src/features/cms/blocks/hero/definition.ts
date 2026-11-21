import { alignmentField, imageField, linkField, pairRule, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const heroDefinition = {
  type: "hero" as const,
  name: "Hero image",
  plan: "4",
  description: "Opening statement with image and an optional action.",
  fields: [
    textField("eyebrow", "Eyebrow"),
    textField("heading", "Heading", { required: true }),
    textareaField("intro", "Intro"),
    imageField("image", "Image"),
    textField("alt", "Image alt text", { help: "Describe the image for screen readers." }),
    textField("actionLabel", "Action label"),
    linkField("actionHref", "Action destination"),
  ],
  options: [
    selectField("layout", "Layout", [["split", "Split"], ["full", "Full-width image"]]),
    selectField("imageSide", "Image side", [["right", "Right"], ["left", "Left"]]),
    selectField("focal", "Focal position", [["center", "Center"], ["top", "Top"], ["bottom", "Bottom"], ["left", "Left"], ["right", "Right"]]),
    alignmentField(),
    selectField("height", "Height", [["compact", "Compact"], ["standard", "Standard"], ["tall", "Tall"]]),
  ],
  defaults: () => ({
    content: {
      eyebrow: "",
      heading: "Your headline",
      intro: "",
      image: "",
      alt: "",
      actionLabel: "",
      actionHref: "",
    },
    options: { layout: "split", imageSide: "right", focal: "center", align: "left", height: "standard" },
  }),
  rules: [
    pairRule("actionLabel", "actionHref"),
    (c) => (c.image && !c.alt ? [{ path: "content.alt", message: "Add alt text for the image." }] : []),
  ],
} satisfies BlockDefinition;
