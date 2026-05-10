import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  listLearnedAnswersPaginated,
  upsertLearnedAnswer,
} from "@/lib/db/learned-answers";
import { createAnswerSchema } from "@/lib/schemas";
import {
  buildPaginationResult,
  decodeCursor,
  InvalidCursorError,
  PaginationParamsSchema,
} from "@/lib/pagination";

export const dynamic = "force-dynamic";

const answerCursorSchema = z.object({
  lastId: z.string(),
  lastTimesUsed: z.number(),
  lastUpdatedAt: z.string(),
});

const answerBankQuerySchema = PaginationParamsSchema;

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = answerBankQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    // Extension APIs use the same answer-bank cursor shape:
    // { lastId, lastTimesUsed, lastUpdatedAt }.
    const cursor = decodeCursor(parsed.data.cursor, answerCursorSchema);
    const rows = await listLearnedAnswersPaginated({
      userId: authResult.userId,
      cursor,
      limit: parsed.data.limit,
    });
    const page = buildPaginationResult(rows, parsed.data.limit, (answer) => ({
      lastId: answer.id,
      lastTimesUsed: answer.timesUsed,
      lastUpdatedAt: answer.updatedAt ?? answer.createdAt ?? "",
    }));
    return NextResponse.json({
      answers: page.items,
      items: page.items,
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    });
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }
    console.error("Answer bank fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch answer bank" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = await parseJsonBody(request, createAnswerSchema);
    if (!parsed.ok) return parsed.response;

    const saved = await upsertLearnedAnswer(parsed.data, authResult.userId);

    return NextResponse.json(saved, { status: saved.updated ? 200 : 201 });
  } catch (error) {
    console.error("Answer bank save error:", error);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 },
    );
  }
}
