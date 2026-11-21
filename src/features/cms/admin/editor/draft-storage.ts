import { useMemo, useSyncExternalStore } from "react";
import { isFieldRecord } from "../../field-values";
import { isSnapshot } from "../../snapshot-shape";

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

export function useLegacyDraft(companyId: string) {
  const raw = useSyncExternalStore(subscribe, () => {
    try {
      return localStorage.getItem("b-platform:company-preview:" + companyId);
    } catch {
      return null;
    }
  }, () => null);

  return useMemo(() => {
    if (!raw) return null;
    try {
      const entry: unknown = JSON.parse(raw);
      return isFieldRecord(entry) && entry.id === companyId && isSnapshot(entry.draft) ? entry.draft : null;
    } catch {
      return null;
    }
  }, [companyId, raw]);
}
