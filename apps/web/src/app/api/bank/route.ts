/**
 * @route GET /api/bank
 * @description Fetch bank entries with optional search/category filter
 * @auth Required
 * @response BankEntriesResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api-utils";
import { requireAuth, isAuthError } from "@/lib/auth";
import { insertBankEntry, listBankEntriesPaginated } from "@/lib/db/profile-bank";
import type { BankCategory } from "@/types";
import { BANK_CATEGORIES } from "@/types";
import { createBankEntrySchema } from "@/lib/schemas";
import {
  buildPaginationResult,
  decodeCursor,
  InvalidCursorError,
  PaginationParamsSchema,
} from "@/lib/pagination";

export const dynamic = "force-dynamic";

const bankCursorSchema = z.object({
  lastId: z.string(),
  lastCreatedAt: z.string(),
});

const bankQuerySchema = PaginationParamsSchema.extend({
  q: z.string().optional(),
  sourceDocumentId: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = bankQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { q: query, sourceDocumentId, type, category: categoryParam, limit } =
      parsed.data;
    const cursor = decodeCursor(parsed.data.cursor, bankCursorSchema);
    const category = (categoryParam ||
      (type === "hackathon" ? "hackathon" : null)) as BankCategory | null;
    const validCategory =
      category && BANK_CATEGORIES.includes(category) ? category : null;

    const rows = listBankEntriesPaginated({
      userId: authResult.userId,
      query,
      category: validCategory,
      sourceDocumentId,
      cursor,
      limit,
    });
    const page = buildPaginationResult(rows, limit, (entry) => ({
      lastId: entry.id,
      lastCreatedAt: entry.createdAt,
    }));

    return NextResponse.json({
      entries: page.items,
      items: page.items,
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    });
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }
    console.error("Get bank entries error:", error);
    return NextResponse.json(
      { error: "Failed to get bank entries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = await parseJsonBody(request, createBankEntrySchema);
    if (!parsed.ok) return parsed.response;

    const { category, content, sourceDocumentId, confidenceScore } =
      parsed.data;

    const id = insertBankEntry(
      {
        category,
        content,
        ...(sourceDocumentId ? { sourceDocumentId } : {}),
        confidenceScore,
      },
      authResult.userId,
    );

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("Create bank entry error:", error);
    return NextResponse.json(
      { error: "Failed to create bank entry" },
      { status: 500 },
    );
  }
}
