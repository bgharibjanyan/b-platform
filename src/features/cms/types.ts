export type Plan = "4" | "10" | "25";
export type Locale = "hy" | "en" | "ru";
export const LOCALES: Locale[] = ["hy", "en", "ru"];
export const LOCALE_LABEL: Record<Locale, string> = { hy: "Հայ", en: "EN", ru: "RU" };

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "image"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "time"
  | "list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  /** list only */
  fields?: FieldDef[];
  itemLabel?: string;
  /** list only: key used to title each item in the editor */
  titleKey?: string | undefined;
}

export type FieldValues = Record<string, unknown>;

export type Spacing = "compact" | "normal" | "relaxed";
export type Width = "narrow" | "standard" | "wide";
export type Tone = "default" | "muted" | "accent" | "ink";

export interface Block {
  id: string;
  type: string;
  label: string;
  hidden: boolean;
  anchor: string;
  spacing: Spacing;
  width: Width;
  tone: Tone;
  content: FieldValues;
  options: FieldValues;
}

export type ThemeId = "editorial" | "slate";

export interface LayoutText {
  displayName: string;
  nav: { label: string; anchor: string }[];
  ctaLabel: string;
  ctaHref: string;
  footerLinks: { label: string; url: string }[];
  copyright: string;
}

export interface LayoutSettings {
  theme: ThemeId;
  accent: string;
  background: string;
  logoUrl: string;
  logoAlt: string;
  showContact: boolean;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  text: Record<Locale, LayoutText>;
}

export interface Snapshot {
  layout: LayoutSettings;
  pages: Record<Locale, Block[]>;
}

export type ReviewStatus = "draft" | "submitted" | "approved";

export interface CompanyRecord {
  id: string;
  name: string;
  plan: Plan;
  sample: boolean;
  draft: Snapshot;
  status: ReviewStatus;
  savedAt: string | null;
  submittedAt: string | null;
  published: Snapshot & { approvedAt: string | null };
}

export interface Issue {
  path: string;
  message: string;
}
