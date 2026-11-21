import type { FieldDef, FieldValues, Issue, Plan } from "../types";

export type BlockRule = (content: FieldValues, options: FieldValues) => Issue[];

export interface BlockDefinition {
  type: string;
  name: string;
  plan: Plan;
  description: string;
  fields: FieldDef[];
  options: FieldDef[];
  defaults: () => { content: FieldValues; options: FieldValues };
  rules?: BlockRule[];
}
