import type { FieldDef } from "../types";
import type { BlockRule } from "./types";

export function textField(key: string, label: string, settings: Partial<FieldDef> = {}): FieldDef {
  return { key, label, type: "text", ...settings };
}
export function textareaField(key: string, label: string, settings: Partial<FieldDef> = {}): FieldDef {
  return { key, label, type: "textarea", ...settings };
}
export function linkField(key: string, label: string, settings: Partial<FieldDef> = {}): FieldDef {
  return { key, label, type: "url", ...settings };
}
export function imageField(key: string, label: string, settings: Partial<FieldDef> = {}): FieldDef {
  return { key, label, type: "image", ...settings };
}
export function toggleField(key: string, label: string): FieldDef {
  return { key, label, type: "boolean" };
}
export function numberField(key: string, label: string, min: number, max: number): FieldDef {
  return { key, label, type: "number", min, max };
}
export function selectField(key: string, label: string, choices: [
  string,
  string
][]): FieldDef {
  return {
    key,
    label,
    type: "select",
    options: choices.map(([value, optionLabel]) => ({ value, label: optionLabel })),
  };
}
export function listField(key: string, label: string, itemLabel: string, fields: FieldDef[], settings: Partial<FieldDef> = {}): FieldDef {
  return { key, label, type: "list", itemLabel, fields, titleKey: fields[0]?.key, ...settings };
}
export function columnsField(key = "columns", min = 2, max = 4): FieldDef {
  const choices = Array.from({ length: max - min + 1 }, (_, index): [
    string,
    string
  ] => {
    const count = min + index;
    return [String(count), `${count} columns`];
  });
  return selectField(key, "Desktop columns", choices);
}
export function ratioField(key = "ratio"): FieldDef {
  return selectField(key, "Image ratio", [["3/2", "3:2"], ["4/3", "4:3"], ["1/1", "1:1"]]);
}
export function alignmentField(key = "align"): FieldDef {
  return selectField(key, "Text alignment", [["left", "Left"], ["center", "Center"]]);
}
export const linkItem = [textField("label", "Link label"), linkField("url", "Link URL")];
export function pairRule(label: string, destination: string, base = "content"): BlockRule {
  return content => content[label] && !content[destination]
    ? [{ path: `${base}.${destination}`, message: "An action label needs a destination link." }]
    : [];
}
