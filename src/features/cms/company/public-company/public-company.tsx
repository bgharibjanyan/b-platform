"use client";

import { useState } from "react";
import { CompanyPage } from "../company-page/company-page";
import type { PublicCompanyRecord } from "../../database/models";
import type { Locale } from "../../types";

export function PublicCompany({ seed, initialLocale }: { seed: PublicCompanyRecord; initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? "hy");
  return <CompanyPage companyId={seed.id} snapshot={seed.published} plan={seed.plan} locale={locale} changeLocale={setLocale} />;
}
