const fs = require("node:fs");
const path = require("node:path");
const { registerHooks } = require("node:module");
const { fileURLToPath } = require("node:url");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const cms = path.join(root, "src", "features", "cms");
const { createConnection, escapeId } = require("mysql2/promise");

// Reuse the same registry and sample data as the application.
const typescript = registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (!specifier.startsWith(".") || !context.parentURL?.endsWith(".ts")) throw error;
      return next(specifier + ".ts", context);
    }
  },
  load(url, context, next) {
    if (!url.endsWith(".ts")) return next(url, context);
    const filename = fileURLToPath(url);
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    });
    return { format: "commonjs", source: outputText, shortCircuit: true };
  },
});

const { applyCompanyPageMigration } = require(path.join(cms, "seed.ts"));
const { REGISTRY } = require(path.join(cms, "registry.ts"));
const { PLANS, PLAN_INFO } = require(path.join(cms, "plans.ts"));
const { databaseUrl, getDatabase, rows, writeTransaction } = require(path.join(cms, "database", "mysql.ts"));
typescript.deregister();

for (const file of [".env.local", ".env"]) {
  if (fs.existsSync(path.join(root, file))) process.loadEnvFile(path.join(root, file));
}

const tables = [
  "subscription_plans", "companies", "cms_block_types", "cms_revisions", "cms_company_heads",
  "cms_pages", "cms_navigation_links", "cms_footer_links", "cms_blocks",
];

async function importSqlite(connection, filename) {
  const { DatabaseSync } = require("node:sqlite");
  const source = new DatabaseSync(filename, { readOnly: true });
  try {
    source.exec("BEGIN");
    if (source.prepare("PRAGMA foreign_key_check").all().length) {
      throw new Error("The source SQLite database has broken references.");
    }
    for (const table of tables) {
      for (const row of source.prepare("SELECT * FROM " + table).iterate()) {
        const columns = Object.keys(row).map(column => escapeId(column)).join(", ");
        const values = Object.values(row);
        await connection.execute(
          "INSERT INTO " + escapeId(table) + " (" + columns + ") VALUES (" + values.map(() => "?").join(", ") + ")",
          values,
        );
      }
    }
  } finally {
    source.close();
  }
}

async function connect(pool) {
  try {
    return await pool.getConnection();
  } catch (error) {
    if (error.code !== "ER_BAD_DB_ERROR") throw error;
    const url = databaseUrl();
    const name = url.pathname.slice(1);
    url.pathname = "/";
    const server = await createConnection(url.href);
    try {
      await server.query("CREATE DATABASE IF NOT EXISTS " + escapeId(name) + " CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_bin");
    } finally {
      await server.end();
    }
    return pool.getConnection();
  }
}

async function initialize() {
  const pool = getDatabase();
  let connection;
  try {
    connection = await connect(pool);
    const lock = "SHA2(CONCAT(DATABASE(), ':b-platform:init'), 256)";
    const [result] = await rows(connection, "SELECT GET_LOCK(" + lock + ", 30) AS acquired");
    if (result.acquired !== 1) throw new Error("Could not acquire the CMS migration lock.");
    try {
      await connection.query("CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(255) PRIMARY KEY) ENGINE=InnoDB");
      const migrationDir = path.join(root, "db", "migrations");
      for (const name of fs.readdirSync(migrationDir).filter(file => file.endsWith(".sql")).sort()) {
        if ((await rows(connection, "SELECT 1 FROM schema_migrations WHERE name = ?", [name])).length) continue;
        // The schema statements are idempotent because MySQL DDL commits independently.
        const statements = fs.readFileSync(path.join(migrationDir, name), "utf8").split(";").map(sql => sql.trim()).filter(Boolean);
        for (const sql of statements) await connection.query(sql);
        await connection.execute("INSERT INTO schema_migrations (name) VALUES (?)", [name]);
      }

      await writeTransaction(connection, async () => {
        const explicit = process.argv.includes("--from-sqlite");
        const filename = path.resolve(root, process.env.B_PLATFORM_LEGACY_SQLITE_PATH || ".data/b-platform.sqlite");
        const [company] = await rows(connection, "SELECT 1 FROM companies LIMIT 1");
        if (explicit && company) throw new Error("SQLite import requires an empty MySQL database. Existing MySQL data was preserved.");
        if (explicit && !fs.existsSync(filename)) throw new Error("The configured SQLite database file could not be found.");
        if (!company && fs.existsSync(filename)) {
          await importSqlite(connection, filename);
          console.log("Imported existing SQLite CMS data into MySQL.");
        }

        for (const code of PLANS) {
          await connection.execute(
            "INSERT INTO subscription_plans (code, name, monthly_price_cents) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code = code",
            [code, PLAN_INFO[code].name, Number(code) * 100],
          );
        }
        for (const definition of REGISTRY) {
          await connection.execute(
            "INSERT INTO cms_block_types (code, name, minimum_plan_code) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code = code",
            [definition.type, definition.name, definition.plan],
          );
        }
        await applyCompanyPageMigration(connection);
      });

      const [count] = await rows(connection, "SELECT COUNT(*) AS total FROM companies");
      console.log("MySQL CMS database ready with " + count.total + " companies.");
    } finally {
      await connection.query("SELECT RELEASE_LOCK(" + lock + ")");
    }
  } finally {
    connection?.release();
    await pool.end();
  }
}

initialize().catch(error => {
  console.error("MySQL database initialization failed:", error.code || error.message);
  process.exitCode = 1;
});
