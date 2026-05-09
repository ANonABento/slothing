import { randomUUID } from "crypto";
import { nowIso } from "@/lib/format/time";
import {
  AnswerBankEntry,
  normalizeQuestion,
} from "@/lib/answers/learned-answers";
import { toNullableIsoDateString } from "@/lib/utils";
import { and, desc, eq, sql as sqlOp } from "drizzle-orm";
import db from "./index";
import { learnedAnswers } from "./schema";
import {
  createAnswerVersion,
  deleteAnswerVersions,
} from "./learned-answer-versions";

function mapLearnedAnswer(
  row: typeof learnedAnswers.$inferSelect,
): AnswerBankEntry {
  return {
    id: row.id,
    question: row.question,
    questionNormalized: row.questionNormalized,
    answer: row.answer,
    sourceUrl: row.sourceUrl,
    sourceCompany: row.sourceCompany,
    timesUsed: row.timesUsed ?? 1,
    lastUsedAt: toNullableIsoDateString(row.lastUsedAt),
    createdAt: toNullableIsoDateString(row.createdAt),
    updatedAt: toNullableIsoDateString(row.updatedAt),
  };
}

export async function listLearnedAnswers(
  userId: string,
): Promise<AnswerBankEntry[]> {
  const rows = await db
    .select()
    .from(learnedAnswers)
    .where(eq(learnedAnswers.userId, userId))
    .orderBy(desc(learnedAnswers.timesUsed), desc(learnedAnswers.updatedAt));

  return rows.map(mapLearnedAnswer);
}

export async function upsertLearnedAnswer(
  input: {
    question: string;
    answer: string;
    sourceUrl?: string | null;
    sourceCompany?: string | null;
  },
  userId: string,
): Promise<AnswerBankEntry & { updated: boolean }> {
  const question = input.question.trim();
  const answer = input.answer.trim();
  const questionNormalized = normalizeQuestion(question);

  const existingRows = await db
    .select()
    .from(learnedAnswers)
    .where(
      and(
        eq(learnedAnswers.userId, userId),
        eq(learnedAnswers.questionNormalized, questionNormalized),
      ),
    )
    .limit(1);
  const existing = existingRows[0];
  const now = nowIso();

  if (existing) {
    await db
      .update(learnedAnswers)
      .set({
        answer,
        sourceUrl: input.sourceUrl || existing.sourceUrl,
        sourceCompany: input.sourceCompany || existing.sourceCompany,
        timesUsed: sqlOp`coalesce(${learnedAnswers.timesUsed}, 0) + 1`,
        updatedAt: now,
        lastUsedAt: now,
      })
      .where(
        and(
          eq(learnedAnswers.id, existing.id),
          eq(learnedAnswers.userId, userId),
        ),
      );

    return {
      ...mapLearnedAnswer({
        ...existing,
        answer,
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
  await db.insert(learnedAnswers).values({
    id,
    userId,
    question,
    questionNormalized,
    answer,
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
    sourceUrl: input.sourceUrl || null,
    sourceCompany: input.sourceCompany || null,
    timesUsed: 1,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
    updated: false,
  };
}

export async function updateLearnedAnswer(
  id: string,
  input: {
    question?: string;
    answer?: string;
    sourceUrl?: string | null;
    sourceCompany?: string | null;
  },
  userId: string,
): Promise<AnswerBankEntry | null> {
  const existingRows = await db
    .select()
    .from(learnedAnswers)
    .where(and(eq(learnedAnswers.id, id), eq(learnedAnswers.userId, userId)))
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
    .update(learnedAnswers)
    .set(next)
    .where(and(eq(learnedAnswers.id, id), eq(learnedAnswers.userId, userId)));

  return mapLearnedAnswer({ ...existing, ...next });
}

export async function deleteLearnedAnswer(
  id: string,
  userId: string,
): Promise<boolean> {
  const deleted = await db
    .delete(learnedAnswers)
    .where(and(eq(learnedAnswers.id, id), eq(learnedAnswers.userId, userId)))
    .returning({ id: learnedAnswers.id });

  if (deleted.length === 0) return false;

  await deleteAnswerVersions(userId, id);
  return true;
}

export async function getLearnedAnswer(
  id: string,
  userId: string,
): Promise<AnswerBankEntry | null> {
  const rows = await db
    .select()
    .from(learnedAnswers)
    .where(and(eq(learnedAnswers.id, id), eq(learnedAnswers.userId, userId)))
    .limit(1);

  return rows[0] ? mapLearnedAnswer(rows[0]) : null;
}

export async function duplicateLearnedAnswer(
  id: string,
  userId: string,
): Promise<AnswerBankEntry | null> {
  const existingRows = await db
    .select()
    .from(learnedAnswers)
    .where(and(eq(learnedAnswers.id, id), eq(learnedAnswers.userId, userId)))
    .limit(1);
  const existing = existingRows[0];

  if (!existing) return null;

  const now = new Date().toISOString();
  const copyQuestion = `${existing.question} (copy)`;
  const copy = {
    id: randomUUID(),
    userId,
    question: copyQuestion,
    questionNormalized: normalizeQuestion(copyQuestion),
    answer: existing.answer,
    sourceUrl: existing.sourceUrl,
    sourceCompany: existing.sourceCompany,
    timesUsed: 1,
    lastUsedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(learnedAnswers).values(copy);
  return mapLearnedAnswer(copy);
}

export async function incrementLearnedAnswerUsage(
  id: string,
  userId: string,
): Promise<AnswerBankEntry | null> {
  const existing = await getLearnedAnswer(id, userId);
  if (!existing) return null;

  const now = new Date().toISOString();
  await db
    .update(learnedAnswers)
    .set({
      timesUsed: sqlOp`coalesce(${learnedAnswers.timesUsed}, 0) + 1`,
      lastUsedAt: now,
      updatedAt: now,
    })
    .where(and(eq(learnedAnswers.id, id), eq(learnedAnswers.userId, userId)));

  return {
    ...existing,
    timesUsed: existing.timesUsed + 1,
    lastUsedAt: now,
    updatedAt: now,
  };
}
