import type { CompanyRecord, ReviewStatus } from "../types";

export type PublicCompanyRecord = Pick<CompanyRecord, "id" | "name" | "plan" | "sample" | "published">;

export interface StoredDraft {
  version: number;
  status: ReviewStatus;
  savedAt: string | null;
  submittedAt: string | null;
}

export interface StoredCompany extends Omit<CompanyRecord, "published"> {
  version: number;
  isPublished: boolean;
}

export type CompanyDirectoryEntry = Pick<CompanyRecord, "id" | "name" | "plan" | "sample"> & {
  isPublished: boolean;
};

export type DraftSaveResult =
  | { ok: true; draft: StoredDraft }
  | { ok: false; message: string };
