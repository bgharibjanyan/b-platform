import { createPool, type Pool, type PoolConnection, type RowDataPacket } from "mysql2/promise";

export type Database = Pool | PoolConnection;
export type SqlValue = string | number | boolean | null | Buffer;

let pool: Pool | undefined;

export function databaseUrl() {
  const configured = process.env.DATABASE_URL;
  if (!configured) throw new Error("Set DATABASE_URL to your MySQL connection URL.");
  const url = new URL(configured);
  if (url.protocol !== "mysql:" || !/^\/[a-zA-Z0-9_]{1,64}$/.test(url.pathname)) {
    throw new Error("DATABASE_URL must use mysql:// and name a MySQL database.");
  }
  return url;
}

export function getDatabase() {
  if (!pool) {
    pool = createPool({ uri: databaseUrl().href, charset: "utf8mb4", jsonStrings: true, connectionLimit: 10 });
  }
  return pool;
}

export async function rows<T>(db: Database, sql: string, values: SqlValue[] = []) {
  const [result] = await db.execute<(T & RowDataPacket)[]>(sql, values);
  return result as T[];
}

export async function writeTransaction<T>(connection: PoolConnection, operation: () => Promise<T>) {
  await connection.beginTransaction();
  try {
    const result = await operation();
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}
