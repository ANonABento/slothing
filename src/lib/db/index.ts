import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

type LegacyStatement = {
  all: (...args: unknown[]) => Promise<Record<string, unknown>[]>;
  get: (...args: unknown[]) => Promise<Record<string, unknown> | undefined>;
  run: (...args: unknown[]) => Promise<{ changes: number; lastInsertRowid?: number }>;
};

type LegacySqlSurface = {
  exec: (sql: string) => Promise<void>;
  prepare: (sql: string) => LegacyStatement;
};

let clientInstance: Client | undefined;
let dbInstance: (LibSQLDatabase<typeof schema> & LegacySqlSurface) | undefined;

export function getLibsqlConfig(env: Record<string, string | undefined> = process.env) {
  const url = env.TURSO_DATABASE_URL?.trim() || "file:./.local.db";
  const authToken = env.TURSO_AUTH_TOKEN?.trim();
  return authToken ? { url, authToken } : { url };
}

export function getClient(): Client {
  clientInstance ??= createClient(getLibsqlConfig());
  return clientInstance;
}

function createLegacySurface(client: Client): LegacySqlSurface {
  return {
    async exec(sql: string) {
      await client.executeMultiple(sql);
    },
    prepare(sql: string) {
      return {
        async all(...args: unknown[]) {
          const result = await client.execute({ sql, args: args as any[] });
          return result.rows as Record<string, unknown>[];
        },
        async get(...args: unknown[]) {
          const result = await client.execute({ sql, args: args as any[] });
          return result.rows[0] as Record<string, unknown> | undefined;
        },
        async run(...args: unknown[]) {
          const result = await client.execute({ sql, args: args as any[] });
          return {
            changes: result.rowsAffected,
            lastInsertRowid:
              typeof result.lastInsertRowid === "bigint"
                ? Number(result.lastInsertRowid)
                : result.lastInsertRowid,
          };
        },
      };
    },
  };
}

export function getDb(): LibSQLDatabase<typeof schema> & LegacySqlSurface {
  if (!dbInstance) {
    const client = getClient();
    dbInstance = Object.assign(drizzle(client, { schema }), createLegacySurface(client));
  }
  return dbInstance;
}

export const db = new Proxy({} as LibSQLDatabase<typeof schema> & LegacySqlSurface, {
  get(_target, property) {
    const realDb = getDb();
    const value = Reflect.get(realDb as object, property, realDb);
    return typeof value === "function" ? value.bind(realDb) : value;
  },
});

export default db;

export {
  DEFAULT_USER_ID,
  DEFAULT_PROFILE_ID,
  settings,
  documents,
  profile,
  experiences,
  education,
  skills,
  projects,
  certifications,
  jobs,
  generatedResumes,
  interviewSessions,
  interviewAnswers,
  reminders,
  notifications,
  companyResearch,
  coverLetters,
  llmSettings,
  emailDrafts,
  analyticsSnapshots,
  jobStatusHistory,
  salaryOffers,
  atsScanHistory,
  customTemplates,
  profileBank,
  profileVersions,
  chunks,
  knowledgeChunks,
  extensionSessions,
  learnedAnswers,
  fieldMappings,
  resumeAbTracking,
  promptVariants,
  promptVariantResults,
} from "./schema";
export * from "./queries";
export * from "./jobs";
export * from "./interviews";
export * from "./resumes";
export * from "./reminders";
export * from "./notifications";
export * from "./custom-templates";
export * from "./profile-bank";
export * from "./profile-versions";
export * from "./knowledge-bank";

export {
  eq,
  and,
  or,
  desc,
  asc,
  like,
  sql as sqlOp,
  isNull,
  isNotNull,
} from "drizzle-orm";
