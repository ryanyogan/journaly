import type { Config } from "drizzle-kit";

export default {
  driver: "better-sqlite",
  out: "./app/drizzle/migrations",
  schema: "./app/db/schema.ts",
  dbCredentials: {
    url: "sqlite.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;
