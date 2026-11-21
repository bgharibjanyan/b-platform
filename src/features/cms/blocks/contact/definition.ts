import { linkField, linkItem, listField, selectField, textField, textareaField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const contactDefinition = {
  type: "contact" as const,
  name: "Contact and directions",
  plan: "4",
  description: "Addresses, phones, email and map link.",
  fields: [
    textField("heading", "Section heading"),
    textareaField("intro", "Intro"),
    listField("addresses", "Addresses", "Address", [textField("label", "Label"), textareaField("address", "Address", { required: true })], { titleKey: "address" }),
    listField("phones", "Phone numbers", "Phone", [textField("label", "Label"), textField("number", "Number", { required: true })], { titleKey: "number" }),
    textField("email", "Email"),
    linkField("mapUrl", "Map / directions URL"),
    listField("links", "Message links", "Link", linkItem, { titleKey: "label" }),
  ],
  options: [
    selectField("layout", "Layout", [["stacked", "Stacked"], ["split", "Side by side"]]),
    selectField("order", "Action order", [["email", "Email first"], ["phone", "Phone first"], ["map", "Directions first"]]),
    toggleField("showAddress", "Show addresses"),
    toggleField("showPhone", "Show phones"),
    toggleField("showEmail", "Show email"),
    toggleField("showMap", "Show directions"),
  ],
  defaults: () => ({
    content: { heading: "Contact", intro: "", addresses: [], phones: [], email: "", mapUrl: "", links: [] },
    options: {
      layout: "split",
      order: "email",
      showAddress: true,
      showPhone: true,
      showEmail: true,
      showMap: true,
    },
  }),
  rules: [
    (c) => (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(c.email)) ? [{ path: "content.email", message: "Enter a valid email address." }] : [])
  ],
} satisfies BlockDefinition;
