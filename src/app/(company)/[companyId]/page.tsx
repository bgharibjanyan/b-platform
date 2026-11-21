import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PublicCompany } from "@/features/cms/company/public-company/public-company";
import { getPublishedCompany } from "@/features/cms/database/repository";
import { LOCALES } from "@/features/cms/types";

type Props = {
  params: Promise<{ companyId: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
};

const readCompany = cache(async (companyId: string) => {
  if (!/^[0-9]{1,64}$/.test(companyId)) return undefined;
  await connection();
  return getPublishedCompany(companyId);
});

export async function generateMetadata({ params }: Props) {
  const { companyId } = await params;
  const company = await readCompany(companyId);
  return { title: company?.name ?? "Company", robots: { index: false, follow: false } };
}

async function PublishedPage({ params, searchParams }: Props) {
  const { companyId } = await params;
  const company = await readCompany(companyId);
  if (!company) notFound();
  const { lang } = await searchParams;
  return <main><PublicCompany seed={company} initialLocale={LOCALES.find(locale => locale === lang)} /></main>;
}

export default function Page(props: Props) {
  return (
    <Suspense fallback={<main>Loading company page…</main>}>
      <PublishedPage {...props} />
    </Suspense>
  );
}
