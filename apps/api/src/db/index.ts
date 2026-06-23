import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type { ExtractTablesWithRelations } from 'drizzle-orm';

import * as schema from './schema';
import * as authSchema from './auth-schema';
import * as relations from './relations';
import { env } from '../utils/env';

config();

const connectionString = env.DATABASE_URL;

// Combine schema and relations
const fullSchema = { ...schema, ...authSchema, ...relations };

// Create postgres connection
const sql = postgres(connectionString, {
    max: 1,
    ssl: env.SSL_DISABLED === 'true' ? 'prefer' : 'require', // Supabase requires SSL
});

// Create drizzle instance with schema and relations for relational queries
export const db = drizzle(sql, { schema: fullSchema });

// then later, get the tx type like this:
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Export the sql client for migrations
export { sql };

// Export database types for use in services
export type DbType = typeof db;
export type Transaction = PgTransaction<
    PostgresJsQueryResultHKT,
    typeof fullSchema,
    ExtractTablesWithRelations<typeof fullSchema>
>;
