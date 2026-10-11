import { randomUUID } from "crypto";
import { and, desc, eq, lt } from "drizzle-orm";
import { nowIso } from "@/lib/format/time";
import { toNullableIsoDateString } from "@/lib/utils";
import db from "./index";
import { answerBankVersions, type AnswerBankRow } from "./schema";

const MAX_VERSIONS = 20;

export interface AnswerBankVersionEntry {
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
  row: typeof answerBankVersions.$inferSelect,
): AnswerBankVersionEntry {
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
    AnswerBankRow,
    "question" | "answer" | "sourceUrl" | "sourceCompany"
  >,
): Promise<AnswerBankVersionEntry> {
  const latest = await db
    .select({ version: answerBankVersions.version })
    .from(answerBankVersions)
    .where(
      and(
        eq(answerBankVersions.userId, userId),
        eq(answerBankVersions.answerId, answerId),
      ),
    )
    .orderBy(desc(answerBankVersions.version))
    .limit(1);

  const now = nowIso();
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

  await db.insert(answerBankVersions).values(row);
  await pruneAnswerVersions(userId, answerId);
  return mapAnswerVersion(row);
}

export async function listAnswerVersions(
  userId: string,
  answerId: string,
): Promise<AnswerBankVersionEntry[]> {
  const rows = await db
    .select()
    .from(answerBankVersions)
    .where(
      and(
        eq(answerBankVersions.userId, userId),
        eq(answerBankVersions.answerId, answerId),
      ),
    )
    .orderBy(desc(answerBankVersions.version));

  return rows.map(mapAnswerVersion);
}

export async function getAnswerVersion(
  userId: string,
  versionId: string,
): Promise<AnswerBankVersionEntry | null> {
  const rows = await db
    .select()
    .from(answerBankVersions)
    .where(
      and(
        eq(answerBankVersions.userId, userId),
        eq(answerBankVersions.id, versionId),
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
    .delete(answerBankVersions)
    .where(
      and(
        eq(answerBankVersions.userId, userId),
        eq(answerBankVersions.answerId, answerId),
      ),
    );
}

export async function pruneAnswerVersions(
  userId: string,
  answerId: string,
): Promise<void> {
  const keep = await db
    .select({ version: answerBankVersions.version })
    .from(answerBankVersions)
    .where(
      and(
        eq(answerBankVersions.userId, userId),
        eq(answerBankVersions.answerId, answerId),
      ),
    )
    .orderBy(desc(answerBankVersions.version))
    .limit(MAX_VERSIONS);

  const oldestKept = keep.at(-1)?.version;
  if (keep.length < MAX_VERSIONS || oldestKept === undefined) return;

  await db
    .delete(answerBankVersions)
    .where(
      and(
        eq(answerBankVersions.userId, userId),
        eq(answerBankVersions.answerId, answerId),
        lt(answerBankVersions.version, oldestKept),
      ),
    );
}
