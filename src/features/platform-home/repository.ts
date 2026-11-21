import type { ResultSetHeader } from "mysql2/promise";
import { getDatabase, rows } from "@/features/cms/database/mysql";
import { listHomepageCompanies } from "@/features/cms/database/repository";
import type { Locale } from "@/features/cms/types";
import { DEFAULT_HOME_SETTINGS, HOME_SECTIONS, MAX_FEATURED, homeFields, validHomeEmail, type HomeCopy, type HomeSettings } from "./content";
import { en } from "./copy/en";
import { hy } from "./copy/hy";
import { ru } from "./copy/ru";

const defaults = { en, hy, ru };
type ContentKey = Locale | "settings";
type SavedContent = { version: number; content_json: string };

export function homepageCompanyId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9]{1,64}$/.test(value);
}

async function readContent(key: ContentKey) {
  const [entry] = await rows<SavedContent>(getDatabase(),
    "SELECT version, content_json FROM platform_homepage WHERE content_key = ?", [key]);
  if (!entry) throw new Error("The homepage migration is incomplete.");
  return { version: entry.version, values: JSON.parse(entry.content_json) as Record<string, unknown> };
}

export async function readHomepageCopy(locale: Locale) {
  const { version, values } = await readContent(locale);
  const copy = structuredClone(defaults[locale]);
  for (const section of HOME_SECTIONS) {
    const saved = values[section];
    if (!saved || typeof saved !== "object") continue;
    const fields: Record<string, string> = copy[section];
    for (const { field, maxLength } of homeFields(section)) {
      const value = (saved as Record<string, unknown>)[field];
      if (typeof value === "string" && value.trim() && value.length <= maxLength) fields[field] = value;
    }
  }
  return { version, copy };
}

export async function readHomepageSettings() {
  const { version, values } = await readContent("settings");
  const contactEmail = typeof values.contactEmail === "string" && validHomeEmail(values.contactEmail)
    ? values.contactEmail : DEFAULT_HOME_SETTINGS.contactEmail;
  const featuredIds = Array.isArray(values.featuredIds)
    ? [...new Set(values.featuredIds.filter(homepageCompanyId))].slice(0, MAX_FEATURED) : DEFAULT_HOME_SETTINGS.featuredIds;
  return { version, settings: { contactEmail, featuredIds } };
}

export async function readPublicHomepage(locale: Locale) {
  if (!process.env.DATABASE_URL) {
    return { copy: defaults[locale], settings: DEFAULT_HOME_SETTINGS, profiles: [] };
  }
  const [copy, settings, profiles] = await Promise.allSettled([
    readHomepageCopy(locale), readHomepageSettings(), listHomepageCompanies(locale),
  ]);
  for (const result of [copy, settings, profiles]) {
    if (result.status === "rejected") console.warn("B Platform homepage data unavailable", result.reason);
  }
  return {
    copy: copy.status === "fulfilled" ? copy.value.copy : defaults[locale],
    settings: settings.status === "fulfilled" ? settings.value.settings : DEFAULT_HOME_SETTINGS,
    profiles: profiles.status === "fulfilled" ? profiles.value : [],
  };
}

export async function saveHomepageContent(key: ContentKey, version: number, value: HomeCopy | HomeSettings) {
  const [result] = await getDatabase().execute<ResultSetHeader>(
    "UPDATE platform_homepage SET content_json = ?, version = version + 1 WHERE content_key = ? AND version = ?",
    [JSON.stringify(value), key, version],
  );
  return result.affectedRows === 1;
}
