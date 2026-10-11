/**
 * @route GET /api/profile/bank
 * @description Get grouped bank entries by category
 * @auth Required
 * @bodyShape none - GET-only endpoint, no JSON body accepted.
 * @querySchema none - no query parameters; use /api/profile/bank/search for filtered queries.
 * @response BankEntriesResponse from @/types/api
 *
 * audit:bug-15 no-input - see search/route.ts for the validated query variant.
 */
import { NextResponse } from "next/server";
import { getGroupedBankEntries } from "@/lib/db/profile-bank";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const entries = getGroupedBankEntries(authResult.userId);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Get bank entries error:", error);
    return NextResponse.json(
      { error: "Failed to get bank entries" },
      { status: 500 },
    );
  }
}
