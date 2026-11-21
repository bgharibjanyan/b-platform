import type { PoolConnection } from "mysql2/promise";
import { rows } from "./database/mysql";
import { installCompanyPageSeeds } from "./database/repository";
import { seedArpharma } from "./fixtures/arpharma";
import { seedBfo } from "./fixtures/bfo";

const companyPageSeeds = [
  { create: seedBfo, names: ["BFO Consulting Group", "BFO Consulting", "BFO Consulting LLC"] },
  { create: seedArpharma, names: ["Arpharma", "Arpharma LLC", "Արֆարմա", "Արֆարմա ՍՊԸ", "Арфарма", "Арфарма ООО", "ООО Арфарма"] },
] as const;

export async function applyCompanyPageMigration(connection: PoolConnection) {
  const migration = "company-pages-bfo-arpharma-v1";
  const [installed] = await rows(connection, "SELECT name FROM schema_migrations WHERE name = ?", [migration]);
  if (installed) return;
  await installCompanyPageSeeds(connection, companyPageSeeds);
  await connection.execute("INSERT INTO schema_migrations (name) VALUES (?)", [migration]);
}
