import type { ReactNode } from "react";
import type { Locale } from "@/features/cms/types";
import "@/app/globals.css";
import "./home.css";

export function HomepageDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <html lang={locale}><body>{children}</body></html>;
}
