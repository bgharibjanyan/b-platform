import { columnsField, imageField, listField, ratioField, textField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const galleryDefinition = {
  type: "gallery" as const,
  name: "Photo gallery",
  plan: "4",
  description: "Grid of images with optional captions.",
  fields: [
    textField("heading", "Section heading"),
    listField("images", "Images", "Image", [
      imageField("src", "Image", { required: true }),
      textField("alt", "Alt text", { required: true }),
      textField("caption", "Caption"),
    ], { titleKey: "caption" }),
  ],
  options: [columnsField(), ratioField(), toggleField("captions", "Show captions")],
  defaults: () => ({
    content: { heading: "Gallery", images: [] },
    options: { columns: "3", ratio: "4/3", captions: true },
  }),
} satisfies BlockDefinition;
