import { randomUUID } from "crypto";
import { nowIso } from "@/lib/format/time";
import {
  AnswerBankEntry,
  type AnswerBankSource,
  isAnswerBankSource,
  normalizeQuestion,
} from "@/lib/answers/answer-bank";
import { toNullableIsoDateString } from "@/lib/utils";
import { and, desc, eq, or, sql as sqlOp } from "drizzle-orm";
import db from "./index";
import { ensureAnswerBankSchema } from "./answer-bank-schema";
import { answerBank } from "./schema";
import {
  createAnswerVersion,
  deleteAnswerVersions,
} from "./answer-bank-versions";

function mapAnswerBankEntry(
  row: typeof answerBank.$inferSelect,
): AnswerBankEntry {
  return {
    id: row.id,
    question: row.question,
    questionNormalized: row.questionNormalized,
    answer: row.answer,
    source: isAnswerBankSource(row.source) ? row.source : "manual",
    sourceUrl: row.sourceUrl,
    sourceCompany: row.sourceCompany,
    timesUsed: row.timesUsed ?? 1,
    lastUsedAt: toNullableIsoDateString(row.lastUsedAt),
    createdAt: toNullableIsoDateString(row.createdAt),
    updatedAt: toNullableIsoDateString(row.updatedAt),
  };
}

async function ensureSchema(): Promise<void> {
  await ensureAnswerBankSchema(db);
}

export async function listAnswerBank(
  userId: string,
): Promise<AnswerBankEntry[]> {
  await ensureSchema();
  const rows = await db
    .select()
    .from(answerBank)
    .where(eq(answerBank.userId, userId))
    .orderBy(desc(answerBank.timesUsed), desc(answerBank.updatedAt));

  return rows.map(mapAnswerBankEntry);
}

export interface AnswerBankCursor {
  lastId: string;
  lastTimesUsed: number;
  lastUpdatedAt: string;
}

export async function listAnswerBankPaginated({
  userId,
  cursor,
  limit,
}: {
  userId: string;
  cursor?: AnswerBankCursor | null;
  limit: number;
}): Promise<AnswerBankEntry[]> {
  await ensureSchema();
  const cursorPredicate = cursor
    ? or(
        sqlOp`coalesce(${answerBank.timesUsed}, 1) < ${cursor.lastTimesUsed}`,
        and(
          sqlOp`coalesce(${answerBank.timesUsed}, 1) = ${cursor.lastTimesUsed}`,
          sqlOp`${answerBank.updatedAt} < ${cursor.lastUpdatedAt}`,
        ),
        and(
          sqlOp`coalesce(${answerBank.timesUsed}, 1) = ${cursor.lastTimesUsed}`,
          eq(answerBank.updatedAt, cursor.lastUpdatedAt),
          sqlOp`${answerBank.id} < ${cursor.lastId}`,
        ),
      )
    : undefined;

  const rows = await db
    .select()
    .from(answerBank)
    .where(
      cursorPredicate
        ? and(eq(answerBank.userId, userId), cursorPredicate)
        : eq(answerBank.userId, userId),
    )
    .orderBy(
      desc(answerBank.timesUsed),
      desc(answerBank.updatedAt),
      desc(answerBank.id),
    )
    .limit(limit + 1);

  return rows.map(mapAnswerBankEntry);
}

export async function upsertAnswerBankEntry(
  input: {
    question: string;
    answer: string;
    source?: AnswerBankSource;
    sourceUrl?: string | null;
    sourceCompany?: string | null;
  },
  userId: string,
): Promise<AnswerBankEntry & { updated: boolean }> {
  await ensureSchema();
  const question = input.question.trim();
  const answer = input.answer.trim();
  const source = input.source ?? "manual";
  const questionNormalized = normalizeQuestion(question);

  const existingRows = await db
    .select()
    .from(answerBank)
    .where(
      and(
        eq(answerBank.userId, userId),
        eq(answerBank.questionNormalized, questionNormalized),
      ),
    )
    .limit(1);
  const existing = existingRows[0];
  const now = nowIso();

  if (existing) {
    await db
      .update(answerBank)
      .set({
        answer,
        source,
        sourceUrl: input.sourceUrl || existing.sourceUrl,
        sourceCompany: input.sourceCompany || existing.sourceCompany,
        timesUsed: sqlOp`coalesce(${answerBank.timesUsed}, 0) + 1`,
        updatedAt: now,
        lastUsedAt: now,
      })
      .where(
        and(eq(answerBank.id, existing.id), eq(answerBank.userId, userId)),
      );

    return {
      ...mapAnswerBankEntry({
        ...existing,
        answer,
        source,
        sourceUrl: input.sourceUrl || existing.sourceUrl,
        sourceCompany: input.sourceCompany || existing.sourceCompany,
        timesUsed: (existing.timesUsed ?? 0) + 1,
        updatedAt: now,
        lastUsedAt: now,
      }),
      updated: true,
    };
  }

  const id = randomUUID();
  await db.insert(answerBank).values({
    id,
    userId,
    question,
    questionNormalized,
    answer,
    source,
    sourceUrl: input.sourceUrl || null,
    sourceCompany: input.sourceCompany || null,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    question,
    questionNormalized,
    answer,
    source,
    sourceUrl: input.sourceUrl || null,
    sourceCompany: input.sourceCompany || null,
    timesUsed: 1,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
    updated: false,
  };
}

export async function updateAnswerBankEntry(
  id: string,
  input: {
    question?: string;
    answer?: string;
    sourceUrl?: string | null;
    sourceCompany?: string | null;
  },
  userId: string,
): Promise<AnswerBankEntry | null> {
  await ensureSchema();
  const existingRows = await db
    .select()
    .from(answerBank)
    .where(and(eq(answerBank.id, id), eq(answerBank.userId, userId)))
    .limit(1);
  const existing = existingRows[0];

  if (!existing) return null;

  await createAnswerVersion(userId, id, existing);

  const question = input.question?.trim() || existing.question;
  const answer = input.answer?.trim() || existing.answer;
  const now = nowIso();
  const next = {
    question,
    questionNormalized: normalizeQuestion(question),
    answer,
    sourceUrl:
      input.sourceUrl === undefined
        ? existing.sourceUrl
        : input.sourceUrl || null,
    sourceCompany:
      input.sourceCompany === undefined
        ? existing.sourceCompany
        : input.sourceCompany || null,
    updatedAt: now,
  };

  await db
    .update(answerBank)
    .set(next)
    .where(and(eq(answerBank.id, id), eq(answerBank.userId, userId)));

  return mapAnswerBankEntry({ ...existing, ...next });
}

export async function deleteAnswerBankEntry(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensureSchema();
  const deleted = await db
    .delete(answerBank)
    .where(and(eq(answerBank.id, id), eq(answerBank.userId, userId)))
    .returning({ id: answerBank.id });

  if (deleted.length === 0) return false;

  await deleteAnswerVersions(userId, id);
  return true;
}

export async function getAnswerBankEntry(
  id: string,
  userId: string,
): Promise<AnswerBankEntry | null> {
  await ensureSchema();
  const rows = await db
    .select()
    .from(answerBank)
    .where(and(eq(answerBank.id, id), eq(answerBank.userId, userId)))
    .limit(1);

  return rows[0] ? mapAnswerBankEntry(rows[0]) : null;
}

export async function duplicateAnswerBankEntry(
  id: string,
  userId: string,
): Promise<AnswerBankEntry | null> {
  await ensureSchema();
  const existingRows = await db
    .select()
    .from(answerBank)
    .where(and(eq(answerBank.id, id), eq(answerBank.userId, userId)))
    .limit(1);
  const existing = existingRows[0];

  if (!existing) return null;

  const now = nowIso();
  const copyQuestion = `${existing.question} (copy)`;
  const copy = {
    id: randomUUID(),
    userId,
    question: copyQuestion,
    questionNormalized: normalizeQuestion(copyQuestion),
    answer: existing.answer,
    source: "manual" as const,
    sourceUrl: existing.sourceUrl,
    sourceCompany: existing.sourceCompany,
    timesUsed: 1,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(answerBank).values(copy);
  return mapAnswerBankEntry(copy);
}

export async function incrementAnswerBankUsage(
  id: string,
  userId: string,
): Promise<AnswerBankEntry | null> {
  await ensureSchema();
  const existing = await getAnswerBankEntry(id, userId);
  if (!existing) return null;

  const now = nowIso();
  await db
    .update(answerBank)
    .set({
      timesUsed: sqlOp`coalesce(${answerBank.timesUsed}, 0) + 1`,
      lastUsedAt: now,
      updatedAt: now,
    })
    .where(and(eq(answerBank.id, id), eq(answerBank.userId, userId)));

  return {
    ...existing,
    timesUsed: existing.timesUsed + 1,
    lastUsedAt: now,
    updatedAt: now,
  };
}

export async function promoteAnswerBankEntry(
  id: string,
  userId: string,
): Promise<AnswerBankEntry | null> {
  await ensureSchema();
  const existing = await getAnswerBankEntry(id, userId);
  if (!existing) return null;

  const now = nowIso();
  await db
    .update(answerBank)
    .set({ source: "curated", updatedAt: now })
    .where(and(eq(answerBank.id, id), eq(answerBank.userId, userId)));

  return { ...existing, source: "curated", updatedAt: now };
}

export const listLearnedAnswers = listAnswerBank;
export const listLearnedAnswersPaginated = listAnswerBankPaginated;
export const upsertLearnedAnswer = upsertAnswerBankEntry;
export const updateLearnedAnswer = updateAnswerBankEntry;
export const deleteLearnedAnswer = deleteAnswerBankEntry;
export const getLearnedAnswer = getAnswerBankEntry;
export const duplicateLearnedAnswer = duplicateAnswerBankEntry;
export const incrementLearnedAnswerUsage = incrementAnswerBankUsage;
