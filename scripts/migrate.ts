import "dotenv/config";
import postgres from "postgres";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required. Set it in .env.local");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "supabase", "migrations");

const MIGRATION_FILES = [
  "0000_groovy_moonstone.sql",
  "0001_parallel_patriot.sql",
  "0002_rls_policies.sql",
];

async function migrate() {
  console.log("🗄️  Applying migrations to Supabase...\n");

  for (const file of MIGRATION_FILES) {
    const filePath = join(MIGRATIONS_DIR, file);
    let content: string;

    try {
      content = readFileSync(filePath, "utf-8");
    } catch {
      console.error(`  ❌ Migration file not found: ${file}`);
      process.exit(1);
    }

    // Split on Drizzle's statement breakpoint marker
    const statements = content
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    console.log(`  Applying ${file} (${statements.length} statements)...`);

    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
      } catch (err: any) {
        // Skip "already exists" errors for idempotency
        if (
          err.message?.includes("already exists") ||
          err.message?.includes("duplicate key")
        ) {
          console.log(`    ⏭️  Skipped (already exists): ${statement.slice(0, 60)}...`);
          continue;
        }
        console.error(`    ❌ Failed: ${statement.slice(0, 80)}...`);
        console.error(`       ${err.message}`);
        process.exit(1);
      }
    }

    console.log(`  ✅ ${file}`);
  }

  console.log("\n✅ All migrations applied successfully!");
  await sql.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
