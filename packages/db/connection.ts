import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;



import * as schema from "./schema";
import { DATABASE_URL } from ".";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

type Db = typeof db;

export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];




export const db = drizzle(pool, { schema: { ...schema } });
export * from "drizzle-orm";