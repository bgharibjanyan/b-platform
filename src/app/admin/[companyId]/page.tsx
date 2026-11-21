import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canManageCms } from "@/features/cms/admin/access";
import { CompanyAdmin } from "@/features/cms/admin/editor/editor";
import { getStoredCompany } from "@/features/cms/database/repository";

export const metadata = { title: "Company admin | B Platform", robots: { index: false, follow: false } };

type Props = { params: Promise<{ companyId: string }> };

async function AdminWorkspace({ params }: Props) {
  const { companyId } = await params;
  if (!canManageCms(await headers())) notFound();
  const company = await getStoredCompany(companyId);
  if (!company) notFound();
  return <CompanyAdmin seed={company} />;
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<main className="cms-shell">Loading company workspace…</main>}>
      <AdminWorkspace params={params} />
    </Suspense>
  );
}
