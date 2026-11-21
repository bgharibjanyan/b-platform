import { columnsField, imageField, linkField, listField, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const servicesDefinition = {
  type: "services" as const,
  name: "Service and features grid",
  plan: "4",
  description: "Cards for services or features.",
  fields: [
    textField("heading", "Section heading"),
    textareaField("intro", "Intro"),
    listField("items", "Cards", "Card", [
      textField("title", "Title", { required: true }),
      textareaField("summary", "Summary"),
      selectField("icon", "Icon", [
        ["", "None"],
        ["ledger", "Ledger"],
        ["percent", "Tax"],
        ["chart", "Chart"],
        ["scale", "Legal"],
        ["compass", "Compass"],
        ["users", "People"],
        ["cpu", "Technology"],
        ["briefcase", "Briefcase"],
      ]),
      imageField("image", "Image (optional)"),
      textField("linkLabel", "Link label"),
      linkField("linkUrl", "Link URL"),
    ]),
  ],
  options: [
    columnsField("columns", 2, 3),
    selectField("cardStyle", "Card style", [["simple", "Simple"], ["outlined", "Outlined"]]),
  ],
  defaults: () => ({
    content: {
      heading: "Services",
      intro: "",
      items: [{ title: "Service", summary: "", icon: "", image: "", linkLabel: "", linkUrl: "" }],
    },
    options: { columns: "3", cardStyle: "simple" },
  }),
} satisfies BlockDefinition;
