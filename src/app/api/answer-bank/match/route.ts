import { NextRequest, NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { matchAnswers } from "@/lib/answer-bank/match";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? 5);
  const limit = Number.isFinite(limitParam) ? limitParam : 5;

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter q is required" },
      { status: 400 },
    );
  }

  try {
    const results = await matchAnswers(authResult.userId, q, limit);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Answer bank match error:", error);
    return NextResponse.json(
      { error: "Failed to match answers" },
      { status: 500 },
    );
  }
}
