/**
 * On Vercel (or when DATABASE_URL is postgres), use the Neon schema.
 * Local stays on SQLite schema.prisma so PC-blocked Neon:5432 does not break dev.
 */
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const url = process.env.DATABASE_URL || "";
const onVercel = Boolean(process.env.VERCEL);
const wantsPostgres =
  onVercel ||
  url.startsWith("postgresql://") ||
  url.startsWith("postgres://") ||
  process.env.USE_POSTGRES_SCHEMA === "1";

if (!wantsPostgres) {
  console.log("prepare-prod-schema: keeping local SQLite schema.prisma");
  process.exit(0);
}

const src = resolve(root, "prisma/schema.postgres.prisma");
const dest = resolve(root, "prisma/schema.prisma");
if (!existsSync(src)) {
  console.error("Missing prisma/schema.postgres.prisma");
  process.exit(1);
}
copyFileSync(src, dest);
console.log("prepare-prod-schema: applied PostgreSQL schema for build");
