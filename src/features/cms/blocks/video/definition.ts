import { parseVideo } from "../../safe";
import { imageField, linkField, selectField, textField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const videoDefinition = {
  type: "video" as const,
  name: "Video embed",
  plan: "10",
  description: "YouTube or Vimeo with click-to-play.",
  fields: [
    textField("title", "Title", { required: true }),
    linkField("url", "YouTube or Vimeo URL", { required: true }),
    imageField("poster", "Poster image"),
    textField("alt", "Poster alt text"),
    linkField("transcript", "Captions or transcript link"),
  ],
  options: [
    selectField("aspect", "Aspect", [["16/9", "16:9"], ["4/3", "4:3"], ["1/1", "Square"]]),
    toggleField("clickToPlay", "Click to play"),
  ],
  defaults: () => ({
    content: { title: "Video", url: "", poster: "", alt: "", transcript: "" },
    options: { aspect: "16/9", clickToPlay: true },
  }),
  rules: [
    (c) => (c.url && !parseVideo(c.url) ? [{ path: "content.url", message: "Only https YouTube or Vimeo links are approved." }] : [])
  ],
} satisfies BlockDefinition;
