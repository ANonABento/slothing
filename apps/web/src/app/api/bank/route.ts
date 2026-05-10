/**
 * @route GET /api/bank
 * @description Fetch bank entries with optional search/category filter
 * @auth Required
 * @response BankEntriesResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api-utils";
import { requireAuth, isAuthError } from "@/lib/auth";
import {
  getBankEntries,
  getBankEntriesByCategory,
  insertBankEntry,
  searchBankEntries,
  searchBankEntriesByCategory,
} from "@/lib/db/profile-bank";
import type { BankCategory } from "@/types";
import { BANK_CATEGORIES } from "@/types";
import { createBankEntrySchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const sourceDocumentId = searchParams.get("sourceDocumentId");
    const type = searchParams.get("type");
    const category = (searchParams.get("category") ||
      (type === "hackathon" ? "hackathon" : null)) as BankCategory | null;
    const validCategory =
      category && BANK_CATEGORIES.includes(category) ? category : null;

    const entries = query
      ? validCategory
        ? searchBankEntriesByCategory(query, validCategory, authResult.userId)
        : searchBankEntries(query, authResult.userId)
      : validCategory
        ? getBankEntriesByCategory(validCategory, authResult.userId)
        : getBankEntries(authResult.userId);

    return NextResponse.json({
      entries: sourceDocumentId
        ? entries.filter((entry) => entry.sourceDocumentId === sourceDocumentId)
        : entries,
    });
  } catch (error) {
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
