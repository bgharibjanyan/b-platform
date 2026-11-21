import type { CompanyRecord, LayoutSettings, Snapshot } from "../types";

export function createSnapshots(layout: LayoutSettings, pages: Snapshot["pages"]): Pick<CompanyRecord, "draft" | "published"> {
  const snapshot = { layout, pages };
  return {
    draft: structuredClone(snapshot),
    published: { ...structuredClone(snapshot), approvedAt: "seed" },
  };
}
