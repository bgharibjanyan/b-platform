import { randomInt } from "node:crypto";
import { LOCALES, type Block, type CompanyRecord, type LayoutText, type Locale, type Plan, type ReviewStatus, type Snapshot } from "../types";
import type { CompanyDirectoryEntry, PublicCompanyRecord, StoredCompany, StoredDraft } from "./models";
import type { PoolConnection } from "mysql2/promise";
import { getDatabase, rows, writeTransaction, type Database } from "./mysql";

interface CompanyRow {
  id: string;
  name: string;
  plan_code: Plan;
  is_sample: number;
  work_version: number;
  published_version: number;
  publication_status: ReviewStatus;
}

interface RevisionRow {
  status: ReviewStatus;
  saved_at: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  theme: Snapshot["layout"]["theme"];
  accent: string;
  background: string;
  logo_url: string;
  logo_alt: string;
  show_contact: number;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
}

interface PageRow {
  locale: Locale;
  display_name: string;
  cta_label: string;
  cta_href: string;
  copyright: string;
}

interface BlockRow {
  locale: Locale;
  block_id: string;
  type_code: string;
  label: string;
  hidden: number;
  anchor: string;
  spacing: Block["spacing"];
  width: Block["width"];
  tone: Block["tone"];
  content_json: string;
  options_json: string;
}

const companyDirectorySql = "SELECT companies.*, heads.work_version, heads.published_version, " +
  "published.status AS publication_status FROM companies " +
  "JOIN cms_company_heads heads ON heads.company_id = companies.id " +
  "JOIN cms_revisions published ON published.company_id = companies.id AND published.version = heads.published_version " +
  "LEFT JOIN cms_archived_companies archive ON archive.company_id = companies.id " +
  "WHERE archive.company_id IS NULL";

function companyDetails(row: CompanyRow): CompanyDirectoryEntry {
  return { id: row.id, name: row.name, plan: row.plan_code, sample: Boolean(row.is_sample), isPublished: row.publication_status === "approved" };
}

export async function listCompanies(db = getDatabase()) {
  const companies = await rows<CompanyRow>(db, companyDirectorySql + " ORDER BY companies.name, companies.id");
  return companies.map(companyDetails);
}

export type HomepageCompanyProfile = { id: string; name: string; alternateName: string };

export async function listHomepageCompanies(locale: Locale, db = getDatabase()) {
  return rows<HomepageCompanyProfile>(db, `
    SELECT live.id,
      COALESCE(NULLIF(localized.display_name, ''), NULLIF(primary_page.display_name, ''), live.name) AS name,
      live.name AS alternateName
    FROM (${companyDirectorySql} AND published.status = 'approved' AND companies.is_sample = 0) live
    LEFT JOIN cms_pages localized ON localized.company_id = live.id
      AND localized.version = live.published_version AND localized.locale = ?
    LEFT JOIN cms_pages primary_page ON primary_page.company_id = live.id
      AND primary_page.version = live.published_version AND primary_page.locale = 'hy'
    ORDER BY live.name, live.id
  `, [locale]);
}

async function findCompany(db: Database, companyId: string, lock = false) {
  if (lock) await rows(db, "SELECT id FROM companies WHERE id = ? FOR UPDATE", [companyId]);
  const [company] = await rows<CompanyRow>(db,
    companyDirectorySql + " AND companies.id = ?",
    [companyId],
  );
  return company;
}

async function readRevision(db: Database, companyId: string, version: number) {
  const key = [companyId, version];
  const [revision] = await rows<RevisionRow>(db, "SELECT * FROM cms_revisions WHERE company_id = ? AND version = ?", key);
  if (!revision) throw new Error("The CMS revision is missing.");
  const [translations, navigation, footerLinks, blocks] = await Promise.all([
    rows<PageRow>(db, "SELECT * FROM cms_pages WHERE company_id = ? AND version = ?", key),
    rows<LayoutText["nav"][number] & { locale: Locale }>(db, "SELECT locale, label, anchor FROM cms_navigation_links WHERE company_id = ? AND version = ? ORDER BY position", key),
    rows<LayoutText["footerLinks"][number] & { locale: Locale }>(db, "SELECT locale, label, url FROM cms_footer_links WHERE company_id = ? AND version = ? ORDER BY position", key),
    rows<BlockRow>(db, "SELECT * FROM cms_blocks WHERE company_id = ? AND version = ? ORDER BY position", key),
  ]);

  const text: Partial<Record<Locale, LayoutText>> = {};
  const pages: Snapshot["pages"] = { hy: [], en: [], ru: [] };
  for (const row of translations) {
    text[row.locale] = {
      displayName: row.display_name,
      ctaLabel: row.cta_label,
      ctaHref: row.cta_href,
      copyright: row.copyright,
      nav: [],
      footerLinks: [],
    };
  }
  if (!text.hy || !text.en || !text.ru) throw new Error("A CMS revision is missing a translation.");
  for (const { locale, label, anchor } of navigation) text[locale]!.nav.push({ label, anchor });
  for (const { locale, label, url } of footerLinks) text[locale]!.footerLinks.push({ label, url });
  for (const block of blocks) {
    pages[block.locale].push({
      id: block.block_id,
      type: block.type_code,
      label: block.label,
      hidden: Boolean(block.hidden),
      anchor: block.anchor,
      spacing: block.spacing,
      width: block.width,
      tone: block.tone,
      content: JSON.parse(block.content_json),
      options: JSON.parse(block.options_json),
    });
  }

  const snapshot: Snapshot = {
    layout: {
      theme: revision.theme,
      accent: revision.accent,
      background: revision.background,
      logoUrl: revision.logo_url,
      logoAlt: revision.logo_alt,
      showContact: Boolean(revision.show_contact),
      contactEmail: revision.contact_email,
      contactPhone: revision.contact_phone,
      contactAddress: revision.contact_address,
      text: { hy: text.hy, en: text.en, ru: text.ru },
    },
    pages,
  };
  return { revision, snapshot };
}

async function readPublished(db: Database, row: CompanyRow): Promise<PublicCompanyRecord> {
  const { revision, snapshot } = await readRevision(db, row.id, row.published_version);
  if (revision.status !== "approved") throw new Error("The public CMS revision is not approved.");
  return { id: row.id, name: row.name, plan: row.plan_code, sample: Boolean(row.is_sample),
    published: { ...snapshot, approvedAt: revision.approved_at } };
}

export async function getCompanyPlan(companyId: string, db = getDatabase()): Promise<Plan | undefined> {
  return (await findCompany(db, companyId))?.plan_code;
}

export async function getPublishedCompany(companyId: string, db = getDatabase()): Promise<PublicCompanyRecord | undefined> {
  const row = await findCompany(db, companyId);
  return row?.publication_status === "approved" ? readPublished(db, row) : undefined;
}

export async function getStoredCompany(companyId: string, db = getDatabase()): Promise<StoredCompany | undefined> {
  const row = await findCompany(db, companyId);
  if (!row) return undefined;
  const work = await readRevision(db, row.id, row.work_version);
  return {
    ...companyDetails(row),
    version: row.work_version,
    draft: work.snapshot,
    status: work.revision.status,
    savedAt: work.revision.saved_at,
    submittedAt: work.revision.submitted_at,
  };
}

async function insertSnapshot(
  db: Database,
  companyId: string,
  version: number,
  snapshot: Snapshot,
  state: Omit<StoredDraft, "version">,
  approvedAt: string | null = null,
) {
  const layout = snapshot.layout;
  await db.execute(
    "INSERT INTO cms_revisions (company_id, version, status, saved_at, submitted_at, approved_at, " +
    "theme, accent, background, logo_url, logo_alt, show_contact, contact_email, contact_phone, contact_address) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [companyId, version, state.status, state.savedAt, state.submittedAt, approvedAt, layout.theme,
    layout.accent, layout.background, layout.logoUrl, layout.logoAlt, Number(layout.showContact),
    layout.contactEmail, layout.contactPhone, layout.contactAddress],
  );

  const insertPage =
    "INSERT INTO cms_pages (company_id, version, locale, display_name, cta_label, cta_href, copyright) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const insertNavigation =
    "INSERT INTO cms_navigation_links (company_id, version, locale, position, label, anchor) VALUES (?, ?, ?, ?, ?, ?)";
  const insertFooter =
    "INSERT INTO cms_footer_links (company_id, version, locale, position, label, url) VALUES (?, ?, ?, ?, ?, ?)";
  const insertBlock =
    "INSERT INTO cms_blocks (company_id, version, locale, block_id, type_code, position, label, hidden, anchor, spacing, width, tone, content_json, options_json) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  for (const locale of LOCALES) {
    const text = layout.text[locale];
    await db.execute(insertPage, [companyId, version, locale, text.displayName, text.ctaLabel, text.ctaHref, text.copyright]);
    for (const [position, { label, anchor }] of text.nav.entries()) {
      await db.execute(insertNavigation, [companyId, version, locale, position, label, anchor]);
    }
    for (const [position, { label, url }] of text.footerLinks.entries()) {
      await db.execute(insertFooter, [companyId, version, locale, position, label, url]);
    }
    for (const [position, block] of snapshot.pages[locale].entries()) {
      await db.execute(insertBlock, [
        companyId, version, locale, block.id, block.type, position, block.label, Number(block.hidden),
        block.anchor, block.spacing, block.width, block.tone, JSON.stringify(block.content), JSON.stringify(block.options),
      ]);
    }
  }
}

export async function seedCompany(db: PoolConnection, seed: CompanyRecord) {
  if ((await rows(db, "SELECT id FROM companies WHERE id = ?", [seed.id])).length) return;
  await db.execute("INSERT INTO companies (id, name, plan_code, is_sample) VALUES (?, ?, ?, ?)",
    [seed.id, seed.name, seed.plan, Number(seed.sample)]);
  const approvedAt = new Date().toISOString();
  await insertSnapshot(db, seed.id, 1, seed.published, { status: "approved", savedAt: null, submittedAt: null }, approvedAt);
  await insertSnapshot(db, seed.id, 2, seed.draft, seed, seed.status === "approved" ? approvedAt : null);
  await db.execute("INSERT INTO cms_company_heads (company_id, work_version, published_version) VALUES (?, ?, ?)", [seed.id, 2, 1]);
}

type SavedCompanyIdentity = { id: string; name: string; is_sample: number; archived_at: string | null };

function companyNameKey(name: string) {
  return name.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export async function installCompanyPageSeeds(
  db: PoolConnection,
  profiles: readonly { create: () => CompanyRecord; names: readonly string[] }[],
) {
  const companies = await rows<SavedCompanyIdentity>(db,
    "SELECT companies.id, companies.name, companies.is_sample, archive.archived_at FROM companies " +
    "LEFT JOIN cms_archived_companies archive ON archive.company_id = companies.id ORDER BY companies.id FOR UPDATE");
  const now = new Date().toISOString();
  const archive = async (id: string) => {
    await db.execute("INSERT IGNORE INTO cms_archived_companies (company_id, archived_at) VALUES (?, ?)", [id, now]);
  };

  for (const profile of profiles) {
    const seed = profile.create();
    const names = new Set(profile.names.map(companyNameKey));
    const matching = companies.filter(company => names.has(companyNameKey(company.name)));
    const live = matching.filter(company => !company.archived_at);
    const candidates = live.length ? live : matching;
    const existing = candidates.find(company => company.id === seed.id) ?? candidates[0];

    if (existing) {
      const [head] = await rows<{ work_version: number; published_version: number }>(db,
        "SELECT work_version, published_version FROM cms_company_heads WHERE company_id = ?", [existing.id]);
      if (!head) throw new Error("Missing revision pointers for company " + existing.id + ".");
      const version = Math.max(head.work_version, head.published_version) + 1;
      await insertSnapshot(db, existing.id, version, seed.published, { status: "approved", savedAt: now, submittedAt: null }, now);
      await db.execute("UPDATE cms_company_heads SET work_version = ?, published_version = ? WHERE company_id = ?",
        [version, version, existing.id]);
      await db.execute("UPDATE companies SET name = ?, is_sample = 0 WHERE id = ?", [seed.name, existing.id]);
      if (existing.archived_at) await db.execute("DELETE FROM cms_archived_companies WHERE company_id = ?", [existing.id]);
      for (const former of live) {
        if (former.id !== existing.id) await archive(former.id);
      }
    } else {
      if (companies.some(company => company.id === seed.id)) {
        throw new Error("Company ID " + seed.id + " is already assigned to a different company.");
      }
      await seedCompany(db, seed);
    }
  }

  const [sample] = await rows(db, "SELECT id FROM companies WHERE id = '2' AND is_sample = 1");
  if (sample) await archive("2");
}

export async function writeDraft(
  companyId: string,
  expectedVersion: number,
  snapshot: Snapshot,
  status: Extract<ReviewStatus, "draft" | "submitted">,
  validatedPlan?: Plan,
  db = getDatabase(),
): Promise<StoredDraft | null> {
  const connection = await db.getConnection();
  try {
    return await writeTransaction(connection, async () => {
      const company = await findCompany(connection, companyId, true);
      if (!company || company.work_version !== expectedVersion
        || (validatedPlan !== undefined && company.plan_code !== validatedPlan)) return null;

      const version = expectedVersion + 1;
      const savedAt = new Date().toISOString();
      const submittedAt = status === "submitted" ? savedAt : null;
      const draft = { version, status, savedAt, submittedAt };
      await insertSnapshot(connection, companyId, version, snapshot, draft);
      await connection.execute("UPDATE cms_company_heads SET work_version = ? WHERE company_id = ?", [version, companyId]);
      return draft;
    });
  } finally {
    connection.release();
  }
}

function emptySnapshot(name: string): Snapshot {
  const copy = (): LayoutText => ({
    displayName: name, nav: [], ctaLabel: "", ctaHref: "", footerLinks: [], copyright: "",
  });
  return {
    layout: {
      theme: "editorial", accent: "#284638", background: "#f8f6ee", logoUrl: "", logoAlt: "",
      showContact: false, contactEmail: "", contactPhone: "", contactAddress: "",
      text: { hy: copy(), en: copy(), ru: copy() },
    },
    pages: { hy: [], en: [], ru: [] },
  };
}

export async function createCompany(name: string, plan: Plan, db = getDatabase()) {
  const connection = await db.getConnection();
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const id = String(randomInt(100_000_000, 100_000_000_000_000));
      try {
        return await writeTransaction(connection, async () => {
          await connection.execute("INSERT INTO companies (id, name, plan_code, is_sample) VALUES (?, ?, ?, 0)", [id, name, plan]);
          const draft = { status: "draft", savedAt: null, submittedAt: null } as const;
          await insertSnapshot(connection, id, 1, emptySnapshot(name), draft);
          // New companies have no approved revision. Public reads require an approved status.
          await connection.execute("INSERT INTO cms_company_heads (company_id, work_version, published_version) VALUES (?, 1, 1)", [id]);
          return id;
        });
      } catch (error) {
        if ((error as { code?: string }).code !== "ER_DUP_ENTRY" || attempt === 2) throw error;
      }
    }
    throw new Error("Could not allocate a company ID.");
  } finally {
    connection.release();
  }
}

export async function updateCompany(id: string, name: string, plan: Plan, db = getDatabase()) {
  const connection = await db.getConnection();
  try {
    return await writeTransaction(connection, async () => {
      if (!await findCompany(connection, id, true)) return false;
      await connection.execute("UPDATE companies SET name = ?, plan_code = ? WHERE id = ?", [name, plan, id]);
      return true;
    });
  } finally {
    connection.release();
  }
}

export async function archiveCompany(id: string, db = getDatabase()) {
  const connection = await db.getConnection();
  try {
    return await writeTransaction(connection, async () => {
      if (!await findCompany(connection, id, true)) return false;
      await connection.execute("INSERT INTO cms_archived_companies (company_id, archived_at) VALUES (?, ?)", [id, new Date().toISOString()]);
      return true;
    });
  } finally {
    connection.release();
  }
}

