import { columnsField, imageField, linkField, listField, selectField, textField, textareaField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const teamDefinition = {
  type: "team" as const,
  name: "Team grid",
  plan: "4",
  description: "People with roles and short bios.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "People", "Person", [
      textField("name", "Name", { required: true }),
      textField("role", "Role"),
      textareaField("bio", "Short bio"),
      imageField("portrait", "Portrait"),
      textField("alt", "Portrait alt text"),
      linkField("url", "Profile link"),
    ]),
  ],
  options: [
    columnsField(),
    selectField("crop", "Portrait crop", [["1/1", "Square"], ["3/4", "Portrait 3:4"]]),
    selectField("shape", "Shape", [["square", "Square corners"], ["rounded", "Rounded"], ["circle", "Circle"]]),
  ],
  defaults: () => ({ content: { heading: "Team", items: [] }, options: { columns: "3", crop: "1/1", shape: "square" } }),
} satisfies BlockDefinition;
