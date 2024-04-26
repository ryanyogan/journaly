import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing environment variable: DATABASE_PATH");
}

const sqlite = new Database(process.env.DATABASE_URL);
const db = drizzle(sqlite, { schema });

void migrate(db, {
  migrationsFolder: "app/drizzle/migrations",
});

export { db };
