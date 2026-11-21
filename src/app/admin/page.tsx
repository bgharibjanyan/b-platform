import { Suspense } from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canManageCms } from "@/features/cms/admin/access";
import { CompanyDirectory } from "@/features/cms/admin/company-directory/company-directory";
import { listCompanies } from "@/features/cms/database/repository";

export const metadata = { title: "B Platform admin", robots: { index: false, follow: false } };

async function Companies() {
  if (!canManageCms(await headers())) notFound();
  return <CompanyDirectory companies={await listCompanies()} />;
}

export default function AdminPage() {
  return <Suspense fallback={<main className="cms-shell">Loading companies.</main>}><Companies /></Suspense>;
}
