/**
 * lib/db.ts
 * SQLite connection using better-sqlite3.
 * DB path is resolved relative to the project root so it works
 * regardless of where `next dev` is launched from.
 */

import path from "node:path";
import Database from "better-sqlite3";

// ── Ruta configurable ─────────────────────────────────────────────────────────
// Por defecto apunta a  <repo-root>/database/roseamor.db
// Cambia DB_PATH a cualquier ruta absoluta si prefieres otra ubicación.
const DB_PATH =
  process.env.SQLITE_DB_PATH ??
  path.resolve(process.cwd(), "..", "database", "roseamor.db");

// ── Singleton connection (Next.js hot-reload safe) ────────────────────────────
const globalForDb = globalThis as typeof globalThis & { _db?: Database.Database };

function getDb(): Database.Database {
  if (globalForDb._db) return globalForDb._db;

  const db = new Database(DB_PATH, {
    // verbose: console.log,  // uncomment to log all SQL
  });

  // Performance pragmas
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");

  // ── Create table if it doesn't exist ─────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS fact_sales (
      order_id    TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      sku         TEXT NOT NULL,
      quantity    INTEGER NOT NULL CHECK (quantity > 0),
      unit_price  REAL    NOT NULL CHECK (unit_price > 0),
      order_date  TEXT    NOT NULL,
      channel     TEXT    NOT NULL
        CHECK (channel IN ('ecommerce','retail','wholesale','export')),
      created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
    );

    CREATE INDEX IF NOT EXISTS idx_fact_sales_date    ON fact_sales (order_date);
    CREATE INDEX IF NOT EXISTS idx_fact_sales_channel ON fact_sales (channel);
  `);

  globalForDb._db = db;
  return db;
}

export default getDb;
export { DB_PATH };