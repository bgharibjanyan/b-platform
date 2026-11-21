import { columnsField, listField, numberField, textField, toggleField } from "../../definitions/fields";
import type { BlockDefinition } from "../../definitions/types";

export const metricsDefinition = {
  type: "metrics" as const,
  name: "Animated metrics",
  plan: "10",
  description: "Key numbers with optional count-up.",
  fields: [
    textField("heading", "Section heading"),
    listField("items", "Metrics", "Metric", [
      { key: "value", label: "Value", type: "number", required: true },
      textField("prefix", "Prefix"),
      textField("suffix", "Suffix"),
      textField("label", "Accessible label", { required: true }),
    ], { titleKey: "label" }),
  ],
  options: [
    columnsField(),
    toggleField("countUp", "Count up"),
    numberField("duration", "Duration (seconds)", 0.5, 6),
  ],
  defaults: () => ({
    content: { heading: "In numbers", items: [] },
    options: { columns: "3", countUp: false, duration: 1.5 },
  }),
} satisfies BlockDefinition;
