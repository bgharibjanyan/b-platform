import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { canManageCms } from "@/features/cms/admin/access";
import { listHomepageCompanies } from "@/features/cms/database/repository";
import { HomepageAdmin } from "@/features/platform-home/admin/admin";
import { readHomepageCopy, readHomepageSettings } from "@/features/platform-home/repository";

export const metadata = { title: "Homepage & translations | B Platform", robots: { index: false, follow: false } };

async function HomepageEditor() {
  if (!canManageCms(await headers())) notFound();
  const data = await Promise.all([
    readHomepageCopy("hy"), readHomepageCopy("en"), readHomepageCopy("ru"),
    readHomepageSettings(), listHomepageCompanies("en"),
  ]).catch(error => {
    console.error("B Platform homepage editor unavailable", error);
    return null;
  });

  if (!data) {
    return <main className="cms-shell">
      <h1>Homepage editor unavailable</h1>
      <p>Check the database connection and run <code>npm run db:init</code> to apply the homepage migration.</p>
      <Link href="/admin/">Back to platform admin</Link>
    </main>;
  }
  const [hy, en, ru, shared, companies] = data;
  return <HomepageAdmin translations={{ hy, en, ru }} shared={shared} companies={companies} />;
}

export default function Page() {
  return <Suspense fallback={<main className="cms-shell">Loading homepage editor.</main>}><HomepageEditor /></Suspense>;
}
