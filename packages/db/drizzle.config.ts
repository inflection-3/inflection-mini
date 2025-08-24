import type { Config } from "drizzle-kit";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL || Bun.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export default {
  schema: "./schema.ts",
  dialect: "postgresql",
  out: "./migrations",
  dbCredentials: {
    url: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  verbose: true,
  strict: true,
} satisfies Config;