import type { Block, FieldDef, FieldValues, Issue, LayoutSettings, Plan } from "./types";
import { isFieldRecord } from "./field-values";
import { isEntitled } from "./plans";
import { getDef } from "./registry";
import { isSafeImage, isSafeUrl } from "./safe";

const anchorRe = /^[a-z0-9][a-z0-9-]{0,39}$/;

function checkFields(fields: FieldDef[], values: FieldValues, base: string, out: Issue[]) {
  for (const f of fields) {
    const v = values?.[f.key];
    const path = `${base}.${f.key}`;
    const empty = v === undefined || v === null || v === "";
    if (f.required && empty) {
      out.push({ path, message: `${f.label} is required.` });
      continue;
    }
    if (empty) continue;
    switch (f.type) {
      case "url":
        if (!isSafeUrl(v)) out.push({ path, message: "Use an https://, mailto:, tel:, /path or #anchor link." });
        break;
      case "image":
        if (!isSafeImage(v)) out.push({ path, message: "Use an https:// image URL or upload an image." });
        break;
      case "number": {
        const n = Number(v);
        if (!Number.isFinite(n)) out.push({ path, message: "Enter a number." });
        else if ((f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max))
          out.push({ path, message: `Enter a value between ${f.min} and ${f.max}.` });
        break;
      }
      case "select":
        if (f.options && !f.options.some((o) => o.value === String(v))) out.push({ path, message: "Choose one of the options." });
        break;
      case "time":
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(v))) out.push({ path, message: "Use HH:MM." });
        break;
      case "date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v))) out.push({ path, message: "Use YYYY-MM-DD." });
        break;
      case "list":
        if (!Array.isArray(v)) out.push({ path, message: "Expected a list." });
        else {
          if (f.max !== undefined && v.length > f.max) out.push({ path, message: `At most ${f.max} items.` });
          v.forEach((item, i) => {
            const itemPath = `${path}.${i}`;
            if (isFieldRecord(item)) checkFields(f.fields ?? [], item, itemPath, out);
            else out.push({ path: itemPath, message: "Expected a group of fields." });
          });
        }
        break;
      default:
        if (typeof v === "string" && v.length > 4000) out.push({ path, message: "Text is too long." });
    }
  }
}

export function validateBlock(block: Block, plan?: Plan): Issue[] {
  const out: Issue[] = [];
  if (!block.label.trim() || block.label.length > 80) out.push({ path: "label", message: "Give this section a label of up to 80 characters." });
  if (block.anchor && !anchorRe.test(block.anchor)) out.push({ path: "anchor", message: "Use lowercase letters, numbers and dashes." });
  const def = getDef(block.type);
  if (!def) return [...out, { path: "type", message: "Unknown block type." }];
  if (plan && !isEntitled(plan, def.plan)) out.push({ path: "type", message: `${def.name} requires the $${def.plan} plan.` });
  checkFields(def.fields, block.content, "content", out);
  checkFields(def.options, block.options, "options", out);
  def.rules?.forEach((r) => out.push(...r(block.content, block.options)));
  return out;
}

export function validatePage(blocks: Block[], plan: Plan): Record<string, Issue[]> {
  const res: Record<string, Issue[]> = {};
  const anchors = new Map<string, number>();
  const firstHero = blocks.find(block => !block.hidden && block.type === "hero");
  blocks.forEach((b) => b.anchor && anchors.set(b.anchor, (anchors.get(b.anchor) ?? 0) + 1));
  for (const b of blocks) {
    const issues = validateBlock(b, plan);
    if (b.type === "hero" && !b.hidden && b !== firstHero) issues.push({ path: "content.heading", message: "Keep one visible hero with the page’s primary heading." });
    if (b.anchor && (anchors.get(b.anchor) ?? 0) > 1) issues.push({ path: "anchor", message: "Anchor is used by another section." });
    if (issues.length) res[b.id] = issues;
  }
  return res;
}

const hex = /^#[0-9a-f]{6}$/i;

export function validateLayout(l: LayoutSettings, plan: Plan): Issue[] {
  const out: Issue[] = [];
  if (!hex.test(l.accent)) out.push({ path: "accent", message: "Use a 6-digit hex color like #1f3a2e." });
  if (!hex.test(l.background)) out.push({ path: "background", message: "Use a 6-digit hex color like #f6f1e7." });
  if (l.logoUrl && !isSafeImage(l.logoUrl)) out.push({ path: "logoUrl", message: "Use an https:// image URL or upload an image." });
  if (l.logoUrl && !l.logoAlt.trim()) out.push({ path: "logoAlt", message: "Logo needs alt text." });
  if (l.theme !== "editorial" && !isEntitled(plan, "10")) out.push({ path: "theme", message: "Preset themes require the $10 plan." });
  if (l.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.contactEmail)) out.push({ path: "contactEmail", message: "Enter a valid email." });
  for (const [loc, tx] of Object.entries(l.text)) {
    if (!tx.displayName.trim()) out.push({ path: `text.${loc}.displayName`, message: `Display name (${loc}) is required.` });
    tx.footerLinks.forEach((f, i) => {
      if (!f.label.trim()) out.push({ path: `text.${loc}.footerLinks.${i}.label`, message: "Footer link needs a label." });
      if (!isSafeUrl(f.url)) out.push({ path: `text.${loc}.footerLinks.${i}.url`, message: "Footer link needs a safe URL." });
    });
    tx.nav.forEach((n, i) => {
      if (!n.label.trim() || !anchorRe.test(n.anchor)) out.push({ path: `text.${loc}.nav.${i}`, message: "Nav item needs a label and a section anchor." });
    });
    if (tx.ctaHref && !isSafeUrl(tx.ctaHref)) out.push({ path: `text.${loc}.ctaHref`, message: "Contact action needs a safe link." });
  }
  return out;
}
