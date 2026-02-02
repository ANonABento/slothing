import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon client
const sql = neon(databaseUrl);

// Create Drizzle database instance with schema
export const db = drizzle(sql, { schema });

// Re-export schema for convenience
export * from './schema';

// Export useful operators from drizzle-orm
export { eq, and, or, desc, asc, sql as sqlOp, isNull, isNotNull } from 'drizzle-orm';
