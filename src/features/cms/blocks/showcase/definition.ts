import { columnsField, imageField, linkField, listField, ratioField, textField, textareaField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const showcaseDefinition = {
  type: "showcase" as const,
  name: "Product or menu showcase",
  plan: "4",
  description: "Products or menu items with optional prices.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "Items", "Item", [
      textField("name", "Name", { required: true }),
      imageField("image", "Photo"),
      textField("alt", "Alt text"),
      textareaField("description", "Description"),
      textField("category", "Category"),
      textField("price", "Price label"),
      linkField("url", "External link"),
    ]),
  ],
  options: [columnsField(), toggleField("showPrices", "Show prices"), ratioField("crop")],
  defaults: () => ({
    content: { heading: "Showcase", items: [] },
    options: { columns: "3", showPrices: true, crop: "4/3" },
  }),
} satisfies BlockDefinition;
