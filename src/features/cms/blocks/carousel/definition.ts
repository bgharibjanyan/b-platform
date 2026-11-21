import { imageField, linkField, listField, numberField, textField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const carouselDefinition = {
  type: "carousel" as const,
  name: "Carousel or slider",
  plan: "10",
  description: "Slides with arrows, dots and optional autoplay.",
  fields: [
    textField("heading", "Section title"),
    listField("slides", "Slides", "Slide", [
      imageField("image", "Image", { required: true }),
      textField("alt", "Alt text", { required: true }),
      textField("caption", "Caption"),
      textField("actionLabel", "Action label"),
      linkField("actionHref", "Action destination"),
    ], { titleKey: "caption" }),
  ],
  options: [
    toggleField("arrows", "Arrows"),
    toggleField("dots", "Dots"),
    toggleField("loop", "Loop"),
    toggleField("autoplay", "Autoplay"),
    numberField("delay", "Autoplay delay (seconds)", 2, 20),
  ],
  defaults: () => ({
    content: { heading: "Highlights", slides: [] },
    options: { arrows: true, dots: true, loop: true, autoplay: false, delay: 5 },
  }),
} satisfies BlockDefinition;
