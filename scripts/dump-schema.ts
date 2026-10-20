/**
 * Print the CREATE statements for a set of tables, ready to paste into
 * src/lib/lms/liveSchema.ts.
 *
 * The portal ships that DDL because a production build cannot create its own
 * schema, and the statements must match what Payload actually generates. The
 * safe way to get them is to let `npm run dev` build the tables in a
 * development database and then read them back out — which is what this does.
 *
 * Add a field to one of those collections and the shipped DDL is immediately
 * out of date: the table gets created on a live server without the new column
 * and every write to it fails. So after any change to Workshops,
 * WorkshopRegistrations, LiveSessions or LiveAttendance:
 *
 *   1. npm run dev          (let it update data/hunarsaaz.db)
 *   2. npm run schema:dump -- workshop live_
 *   3. paste the output over the matching array in liveSchema.ts
 *
 * Run with:  npm run schema:dump -- <prefix> [prefix...]
 */
import "dotenv/config";
import path from "node:path";
// @ts-expect-error — node:sqlite is real on Node 22 but absent from the
// @types/node in use here.
import { DatabaseSync } from "node:sqlite";

const prefixes = process.argv.slice(2);
if (prefixes.length === 0) {
  console.error("Usage: npm run schema:dump -- <table-prefix> [more-prefixes]");
  process.exit(1);
}

const uri = process.env.DATABASE_URI?.trim() ?? "";
const file = uri.startsWith("file:")
  ? uri.slice("file:".length)
  : uri || "data/hunarsaaz.db";
const dbPath = path.resolve(process.cwd(), file);

const db = new DatabaseSync(dbPath, { readOnly: true });

const where = prefixes.map(() => "name LIKE ?").join(" OR ");
const rows = db
  .prepare(
    `SELECT type, name, sql FROM sqlite_master
     WHERE (${where}) AND sql IS NOT NULL
     ORDER BY CASE type WHEN 'table' THEN 0 ELSE 1 END, name`,
  )
  .all(...prefixes.map((prefix) => `${prefix}%`)) as Array<{
  type: string;
  name: string;
  sql: string;
}>;

if (rows.length === 0) {
  console.error(`No tables matching ${prefixes.join(", ")} in ${dbPath}.`);
  console.error("Run `npm run dev` first so Payload creates them.");
  process.exit(1);
}

function idempotent(sql: string): string {
  return sql
    .replace("CREATE TABLE `", "CREATE TABLE IF NOT EXISTS `")
    .replace("CREATE INDEX `", "CREATE INDEX IF NOT EXISTS `")
    .replace("CREATE UNIQUE INDEX `", "CREATE UNIQUE INDEX IF NOT EXISTS `");
}

for (const row of rows) {
  const escaped = idempotent(row.sql)
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  console.log("  `" + escaped + "`,");
}

db.close();
