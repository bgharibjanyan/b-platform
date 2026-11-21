import { linkField, pairRule, selectField, textField, textareaField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const bannerDefinition = {
  type: "banner" as const,
  name: "Announcement banner",
  plan: "4",
  description: "Short notice with optional link.",
  fields: [
    textareaField("message", "Message"),
    textField("linkLabel", "Link label"),
    linkField("linkUrl", "Link URL"),
    toggleField("enabled", "Enabled"),
  ],
  options: [
    selectField("bannerTone", "Tone", [["info", "Information"], ["offer", "Offer"], ["urgent", "Urgent"]]),
    selectField("placement", "Placement", [["inline", "Inline"], ["top", "Top of content"]]),
  ],
  defaults: () => ({
    content: { message: "", linkLabel: "", linkUrl: "", enabled: true },
    options: { bannerTone: "info", placement: "inline" },
  }),
  rules: [pairRule("linkLabel", "linkUrl")],
} satisfies BlockDefinition;
