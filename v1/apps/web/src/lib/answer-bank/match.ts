import { and, eq, like, or } from "drizzle-orm";
import {
  calculateQuestionSimilarity,
  normalizeQuestion,
} from "@/lib/answers/answer-bank";
import {
  classifyAnswerComponent,
  type AnswerComponentType,
} from "@/lib/answers/answer-components";
import db from "@/lib/db";
import { answerBank } from "@/lib/db/schema";

export interface AnswerBankMatch {
  id: string;
  question: string;
  answer: string;
  score: number;
  category: AnswerComponentType;
}

const MIN_SCORE = 0.2;

function queryTerms(query: string): string[] {
  return normalizeQuestion(query)
    .split(" ")
    .filter((term) => term.length > 2)
    .slice(0, 8);
}

export async function matchAnswers(
  userId: string,
  query: string,
  limit = 5,
): Promise<AnswerBankMatch[]> {
  const normalized = normalizeQuestion(query);
  if (!normalized) return [];

  const terms = queryTerms(query);
  const predicates = terms.map((term) =>
    like(answerBank.questionNormalized, `%${term}%`),
  );
  const safeLimit = Math.min(Math.max(limit, 1), 20);

  const rows = await db
    .select()
    .from(answerBank)
    .where(
      predicates.length > 0
        ? and(eq(answerBank.userId, userId), or(...predicates))
        : eq(answerBank.userId, userId),
    )
    .limit(100);

  return rows
    .map((row) => {
      const questionScore = calculateQuestionSimilarity(
        normalized,
        row.questionNormalized,
      );
      const answerScore = calculateQuestionSimilarity(
        normalized,
        normalizeQuestion(row.answer),
      );
      const score = Math.max(questionScore, answerScore * 0.7);
      return {
        id: row.id,
        question: row.question,
        answer: row.answer,
        score,
        category: classifyAnswerComponent(row),
      };
    })
    .filter((match) => match.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, safeLimit);
}
