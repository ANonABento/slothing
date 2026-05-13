import { NextRequest, NextResponse } from "next/server";
import { isAuthError, requireUserAuth } from "@/lib/auth";
import { matchAnswers } from "@/lib/answer-bank/match";

export const dynamic = "force-dynamic";

// Accepts either a NextAuth session (web app) or the X-Extension-Token header
// (Slothing extension, e.g. the P2/#35 inline answer-bank popover on long
// textareas). The underlying matcher is user-scoped, so the same logic works
// for both transports.
export async function GET(request: NextRequest) {
  const authResult = await requireUserAuth(request);
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
