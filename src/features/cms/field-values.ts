import type { FieldValues } from "./types";

export function isFieldRecord(value: unknown): value is FieldValues {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function fieldRecords(value: unknown): FieldValues[] {
  return Array.isArray(value) ? value.filter(isFieldRecord) : [];
}

export function fieldText(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function fieldLines(value: unknown): string[] {
  return fieldText(value)?.split(/\r?\n/).filter(Boolean) ?? [];
}
