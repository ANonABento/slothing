import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let dbInstance: NeonHttpDatabase<typeof schema> | undefined;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (dbInstance) {
    return dbInstance;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  dbInstance = drizzle(neon(databaseUrl), { schema });
  return dbInstance;
}

// Keep the existing `db.query(...)`/`db.select(...)` call sites while avoiding
// database initialization during Next.js route module imports at build time.
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, property) {
    const realDb = getDb();
    const value = Reflect.get(realDb as object, property, realDb);
    return typeof value === 'function' ? value.bind(realDb) : value;
  },
});

// Re-export schema for convenience
export * from './schema';

// Export useful operators from drizzle-orm
export { eq, and, or, desc, asc, like, sql as sqlOp, isNull, isNotNull } from 'drizzle-orm';
