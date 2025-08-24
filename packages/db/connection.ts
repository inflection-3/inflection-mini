import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;



import * as schema from "./schema";
import { DATABASE_URL } from ".";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool, { schema: { ...schema } });
export default db;
export * from "drizzle-orm";