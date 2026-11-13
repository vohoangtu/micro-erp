import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as schema from './schema/index.js';

// Ensure .env is loaded before initializing database connection
dotenv.config();
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  dotenv.config({ path: resolve(__dirname, '../../../.env') });
  dotenv.config({ path: resolve(__dirname, '../../.env') });
} catch {
  // fallback if path resolution fails
}

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres_secure_2026@localhost:5432/erp_core?sslmode=disable';

// Use connection pooling
export const sql = postgres(connectionString, {
  max: 20,
  idle_timeout: 30,
  connect_timeout: 10
});

export const db = drizzle(sql, { schema });
export type Database = typeof db;
export { schema };
