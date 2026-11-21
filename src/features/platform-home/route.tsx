import { cache, Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import type { Locale } from "@/features/cms/types";
import { HOME_LANGUAGES } from "./content";
import { readPublicHomepage } from "./repository";
import { Homepage } from "./homepage";

const readHomepage = cache(async (locale: Locale) => {
  await connection();
  return readPublicHomepage(locale);
});

export async function homepageMetadata(locale: Locale): Promise<Metadata> {
  const { copy } = await readHomepage(locale);
  const canonical = HOME_LANGUAGES[locale].path;
  const configuredOrigin = process.env.B_PLATFORM_SITE_URL;
  const siteUrl = configuredOrigin && URL.canParse(configuredOrigin) ? new URL(configuredOrigin) : null;
  const metadataBase = siteUrl && ["https:", "http:"].includes(siteUrl.protocol) ? new URL(siteUrl.origin) : undefined;
  return {
    metadataBase,
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: metadataBase ? {
      canonical,
      languages: { en: "/", hy: "/hy/", ru: "/ru/", "x-default": "/" },
    } : undefined,
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.description,
      siteName: "B Platform",
      type: "website",
      url: metadataBase ? canonical : undefined,
      locale: { en: "en_US", hy: "hy_AM", ru: "ru_RU" }[locale],
    },
  };
}

async function Content({ locale }: { locale: Locale }) {
  const data = await readHomepage(locale);
  return <Homepage locale={locale} {...data} />;
}

export function HomepageRoute({ locale }: { locale: Locale }) {
  return <Suspense fallback={<div className="bp-loading" aria-busy="true" />}><Content locale={locale} /></Suspense>;
}
