import { isFieldRecord } from "./field-values";
import { getDef } from "./registry";
import { LOCALES, type Snapshot } from "./types";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isSnapshot(value: unknown): value is Snapshot {
  if (!isFieldRecord(value) || !isFieldRecord(value.layout) || !isFieldRecord(value.pages)) return false;
  const { pages, layout } = value;
  const { text, theme, accent, background, logoUrl, logoAlt, showContact, contactEmail, contactPhone, contactAddress } = layout;
  if (!isFieldRecord(text) || (theme !== "editorial" && theme !== "slate")) return false;
  if (typeof showContact !== "boolean") return false;
  if (![accent, background, logoUrl, logoAlt, contactEmail, contactPhone, contactAddress].every(isString)) return false;

  return LOCALES.every(locale => {
    const copy = text[locale];
    const blocks = pages[locale];
    if (!isFieldRecord(copy) || !Array.isArray(blocks)) return false;
    if (![copy.displayName, copy.ctaLabel, copy.ctaHref, copy.copyright].every(isString)) return false;
    if (!Array.isArray(copy.nav) || !copy.nav.every(item => isFieldRecord(item) && isString(item.label) && isString(item.anchor))) return false;
    if (!Array.isArray(copy.footerLinks) || !copy.footerLinks.every(item => isFieldRecord(item) && isString(item.label) && isString(item.url))) return false;

    const ids = new Set<string>();
    return blocks.every(block => {
      if (!isFieldRecord(block) || !isString(block.id) || !/^[a-z0-9][a-z0-9_-]{0,127}$/i.test(block.id)) return false;
      if (ids.has(block.id)) return false;
      ids.add(block.id);
      return isString(block.type) && getDef(block.type) !== undefined
        && isString(block.label) && isString(block.anchor) && typeof block.hidden === "boolean"
        && (block.spacing === "compact" || block.spacing === "normal" || block.spacing === "relaxed")
        && (block.width === "narrow" || block.width === "standard" || block.width === "wide")
        && (block.tone === "default" || block.tone === "muted" || block.tone === "accent" || block.tone === "ink")
        && isFieldRecord(block.content) && isFieldRecord(block.options);
    });
  });
}
