import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema/index.js';

dotenv.config({ path: './src/.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set');
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool, { schema });

export { schema };
