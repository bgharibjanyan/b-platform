import type { FieldValues, Locale } from "../types";

export interface BlockProps {
  content: FieldValues;
  options: FieldValues;
  locale: Locale;
  example?: boolean;
}
