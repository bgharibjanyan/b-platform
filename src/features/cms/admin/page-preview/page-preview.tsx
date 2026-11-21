import { useRef } from "react";
import { CompanyPage } from "../../company/company-page/company-page";
import type { Locale, Plan, Snapshot } from "../../types";

interface PagePreviewProps {
  companyId: string;
  draft: Snapshot;
  plan: Plan;
  locale: Locale;
  mobile: boolean;
  changeLocale: (locale: Locale) => void;
  setMobile: (mobile: boolean) => void;
}

export function PagePreview({ companyId, draft, plan, locale, mobile, changeLocale, setMobile }: PagePreviewProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  return (
    <section className="cms-preview" aria-label="Company page preview">
      <div className="cms-preview-bar">
        <h2>Live preview</h2>
        <div className="cms-actions">
          <button aria-pressed={!mobile} type="button" onClick={() => setMobile(false)}>Desktop</button>
          <button aria-pressed={mobile} type="button" onClick={() => setMobile(true)}>Mobile</button>
        </div>
      </div>
      <div ref={scrollContainer} className={mobile ? "cms-preview-body cms-preview-mobile" : "cms-preview-body"}>
        <CompanyPage companyId={companyId} snapshot={draft} plan={plan} locale={locale} changeLocale={changeLocale} scrollContainer={scrollContainer} />
      </div>
    </section>
  );
}
