import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Reuse the pg Pool across module reloads (important during local dev / HMR)
// so we don't create a new connection pool on every file change.
declare global {
  // eslint-disable-next-line no-var
  var __pgPool__: Pool | undefined;
}

const pool = (global as any).__pgPool__ ?? new Pool({
  connectionString: process.env.DATABASE_URL!,
});
if (!(global as any).__pgPool__) (global as any).__pgPool__ = pool;

export const db = drizzle(pool);
