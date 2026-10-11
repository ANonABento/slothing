/**
 * @route GET /api/profile/bank/search
 * @description Search bank entries by query string
 * @auth Required
 * @response BankEntriesResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { searchBankEntries } from "@/lib/db/profile-bank";
import { requireAuth, isAuthError } from "@/lib/auth";
import { parseSearchParams } from "@/lib/api-utils";
import { bankSearchQuerySchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = parseSearchParams(
      request.nextUrl.searchParams,
      bankSearchQuerySchema,
    );
    if (!parsed.ok) return parsed.response;

    const entries = searchBankEntries(parsed.data.q, authResult.userId);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Search bank entries error:", error);
    return NextResponse.json(
      { error: "Failed to search bank entries" },
      { status: 500 },
    );
  }
}
