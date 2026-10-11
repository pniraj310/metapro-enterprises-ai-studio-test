import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const databaseUrl = process.env.DATABASE_URL;

    global._postgresPool = databaseUrl
      ? new Pool({
          connectionString: databaseUrl,
          max: 10,
          connectionTimeoutMillis: 2000,
        })
      : new Pool({
          host: process.env.SQL_HOST || 'localhost',
          port: process.env.SQL_PORT
            ? parseInt(process.env.SQL_PORT, 10)
            : 5432,
          user: process.env.SQL_USER || 'postgres',
          password: process.env.SQL_PASSWORD || '1234',
          database: process.env.SQL_DB_NAME || 'metapro_db',
          max: 10,
          connectionTimeoutMillis: 2000,
        });

    global._postgresPool.on('error', (err) => {
      // Don't crash process on pool client error
      console.warn('PostgreSQL pool connection error (mock fallback active):', err.message);
    });
  }

  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });