import { randomUUID } from "crypto";
import { and, desc, eq, lt } from "drizzle-orm";
import { toNullableIsoDateString } from "@/lib/utils";
import db from "./index";
import { learnedAnswerVersions, type LearnedAnswer } from "./schema";

const MAX_VERSIONS = 20;

export interface LearnedAnswerVersionEntry {
  id: string;
  answerId: string;
  version: number;
  question: string;
  answer: string;
  sourceUrl: string | null;
  sourceCompany: string | null;
  createdAt: string | null;
}

function mapAnswerVersion(
  row: typeof learnedAnswerVersions.$inferSelect,
): LearnedAnswerVersionEntry {
  return {
    id: row.id,
    answerId: row.answerId,
    version: row.version,
    question: row.question,
    answer: row.answer,
    sourceUrl: row.sourceUrl,
    sourceCompany: row.sourceCompany,
    createdAt: toNullableIsoDateString(row.createdAt),
  };
}

export async function createAnswerVersion(
  userId: string,
  answerId: string,
  snapshot: Pick<
    LearnedAnswer,
    "question" | "answer" | "sourceUrl" | "sourceCompany"
  >,
): Promise<LearnedAnswerVersionEntry> {
  const latest = await db
    .select({ version: learnedAnswerVersions.version })
    .from(learnedAnswerVersions)
    .where(
      and(
        eq(learnedAnswerVersions.userId, userId),
        eq(learnedAnswerVersions.answerId, answerId),
      ),
    )
    .orderBy(desc(learnedAnswerVersions.version))
    .limit(1);

  const now = new Date().toISOString();
  const row = {
    id: randomUUID(),
    userId,
    answerId,
    version: (latest[0]?.version ?? 0) + 1,
    question: snapshot.question,
    answer: snapshot.answer,
    sourceUrl: snapshot.sourceUrl ?? null,
    sourceCompany: snapshot.sourceCompany ?? null,
    createdAt: now,
  };

  await db.insert(learnedAnswerVersions).values(row);
  await pruneAnswerVersions(userId, answerId);
  return mapAnswerVersion(row);
}

export async function listAnswerVersions(
  userId: string,
  answerId: string,
): Promise<LearnedAnswerVersionEntry[]> {
  const rows = await db
    .select()
    .from(learnedAnswerVersions)
    .where(
      and(
        eq(learnedAnswerVersions.userId, userId),
        eq(learnedAnswerVersions.answerId, answerId),
      ),
    )
    .orderBy(desc(learnedAnswerVersions.version));

  return rows.map(mapAnswerVersion);
}

export async function getAnswerVersion(
  userId: string,
  versionId: string,
): Promise<LearnedAnswerVersionEntry | null> {
  const rows = await db
    .select()
    .from(learnedAnswerVersions)
    .where(
      and(
        eq(learnedAnswerVersions.userId, userId),
        eq(learnedAnswerVersions.id, versionId),
      ),
    )
    .limit(1);

  return rows[0] ? mapAnswerVersion(rows[0]) : null;
}

export async function deleteAnswerVersions(
  userId: string,
  answerId: string,
): Promise<void> {
  await db
    .delete(learnedAnswerVersions)
    .where(
      and(
        eq(learnedAnswerVersions.userId, userId),
        eq(learnedAnswerVersions.answerId, answerId),
      ),
    );
}

export async function pruneAnswerVersions(
  userId: string,
  answerId: string,
): Promise<void> {
  const keep = await db
    .select({ version: learnedAnswerVersions.version })
    .from(learnedAnswerVersions)
    .where(
      and(
        eq(learnedAnswerVersions.userId, userId),
        eq(learnedAnswerVersions.answerId, answerId),
      ),
    )
    .orderBy(desc(learnedAnswerVersions.version))
    .limit(MAX_VERSIONS);

  const oldestKept = keep.at(-1)?.version;
  if (keep.length < MAX_VERSIONS || oldestKept === undefined) return;

  await db
    .delete(learnedAnswerVersions)
    .where(
      and(
        eq(learnedAnswerVersions.userId, userId),
        eq(learnedAnswerVersions.answerId, answerId),
        lt(learnedAnswerVersions.version, oldestKept),
      ),
    );
}
