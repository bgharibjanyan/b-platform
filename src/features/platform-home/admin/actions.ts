"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { canManageCms } from "@/features/cms/admin/access";
import { listHomepageCompanies } from "@/features/cms/database/repository";
import { HOME_LANGUAGES, HOME_LOCALES, HOME_SECTIONS, HOME_SECTION_LABELS, MAX_FEATURED, homeFields, isHomeLocale, validHomeEmail, type HomeCopy } from "../content";
import { homepageCompanyId, saveHomepageContent } from "../repository";

export type HomeSaveResult =
  | { ok: true; version: number; message: string }
  | { ok: false; message: string };

const failed = (message: string): HomeSaveResult => ({ ok: false, message });

export async function publishHomepageCopy(locale: unknown, version: number, form: FormData): Promise<HomeSaveResult> {
  if (!canManageCms(await headers())) return failed("Platform administrator access is required.");
  if (!isHomeLocale(locale) || !Number.isInteger(version) || version < 0) return failed("Invalid homepage translation.");

  const groups: Record<string, Record<string, string>> = {};
  for (const section of HOME_SECTIONS) {
    const fields: Record<string, string> = {};
    for (const { field, label, maxLength } of homeFields(section)) {
      const value = form.get(section + "." + field);
      if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
        return failed(HOME_SECTION_LABELS[section] + " · " + label + " must be between 1 and " + maxLength + " characters.");
      }
      fields[field] = value.trim();
    }
    groups[section] = fields;
  }

  try {
    if (!await saveHomepageContent(locale, version, groups as HomeCopy)) {
      return failed("Someone published a newer translation. Copy any unsaved edits and reload before trying again.");
    }
  } catch (error) {
    console.error("B Platform could not publish the homepage translation", error);
    return failed("The translation could not be saved. Try again.");
  }
  revalidatePath(HOME_LANGUAGES[locale].path);
  return { ok: true, version: version + 1, message: HOME_LANGUAGES[locale].name + " homepage published." };
}

export async function publishHomepageSettings(version: number, form: FormData): Promise<HomeSaveResult> {
  if (!canManageCms(await headers())) return failed("Platform administrator access is required.");
  if (!Number.isInteger(version) || version < 0) return failed("Invalid homepage settings.");

  const email = form.get("contactEmail");
  const ids = form.getAll("featuredId");
  const contactEmail = typeof email === "string" ? email.trim() : "";
  if (!validHomeEmail(contactEmail)) return failed("Enter a valid subscription email address.");
  if (!ids.every(homepageCompanyId) || ids.length > MAX_FEATURED || new Set(ids).size !== ids.length) {
    return failed("Choose up to " + MAX_FEATURED + " different published companies.");
  }

  try {
    const published = new Set((await listHomepageCompanies("en")).map(company => company.id));
    if (ids.some(id => !published.has(id))) return failed("Remove companies that are no longer published before saving.");
    if (!await saveHomepageContent("settings", version, { contactEmail, featuredIds: ids })) {
      return failed("Someone saved newer settings. Copy any unsaved changes and reload before trying again.");
    }
  } catch (error) {
    console.error("B Platform could not save the homepage settings", error);
    return failed("The homepage settings could not be saved. Try again.");
  }

  for (const locale of HOME_LOCALES) revalidatePath(HOME_LANGUAGES[locale].path);
  return { ok: true, version: version + 1, message: "Homepage settings published in all languages." };
}
