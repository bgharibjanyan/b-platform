"use server";

import { headers } from "next/headers";
import { canManageCms } from "../access";
import type { DraftSaveResult } from "../../database/models";
import { getCompanyPlan, writeDraft } from "../../database/repository";
import { isSnapshot } from "../../snapshot-shape";
import { LOCALES } from "../../types";
import { validateLayout, validatePage } from "../../validation";

export async function saveCompanyDraft(
  companyId: string,
  version: number,
  input: unknown,
  status: "draft" | "submitted",
): Promise<DraftSaveResult> {
  if (!canManageCms(await headers())) return { ok: false, message: "CMS administrator access is required." };
  if (typeof companyId !== "string" || !/^\d+$/.test(companyId) || !Number.isSafeInteger(version) || version < 1
    || (status !== "draft" && status !== "submitted")) {
    return { ok: false, message: "The draft request is invalid." };
  }

  try {
    // Persist the same JSON values that are validated, including nested block settings.
    const snapshot: unknown = JSON.parse(JSON.stringify(input));
    if (!isSnapshot(snapshot)) return { ok: false, message: "The draft contains invalid page or block data." };

    const plan = status === "submitted" ? await getCompanyPlan(companyId) : undefined;
    if (status === "submitted") {
      if (!plan) return { ok: false, message: "Company not found." };
      if (validateLayout(snapshot.layout, plan).length > 0
        || LOCALES.some(locale => Object.keys(validatePage(snapshot.pages[locale], plan)).length > 0)) {
        return { ok: false, message: "Resolve the highlighted settings before submitting for review." };
      }
    }

    const draft = await writeDraft(companyId, version, snapshot, status, plan);
    return draft ? { ok: true, draft } : {
      ok: false,
      message: "The draft or company plan changed while you were editing. Copy unsaved edits before reloading.",
    };
  } catch (error) {
    console.error("CMS draft save failed", error);
    return { ok: false, message: "The draft could not be saved to the database. Your edits are still open." };
  }
}
