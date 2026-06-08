/**
 * @route GET /api/applications/drafts
 * @description List the signed-in user's drafted applications for the review UI.
 *   Defaults to pending_review unless a status filter is given.
 * @auth requireAuth (NextAuth + local-dev fallback)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { listDrafts } from "@/lib/db/application-drafts";
import { isDraftStatus } from "@/lib/agent/draft";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const statusParam = request.nextUrl.searchParams.get("status");
  // Default the review surface to drafts that still need a decision.
  const status = isDraftStatus(statusParam) ? statusParam : "pending_review";

  try {
    const drafts = await listDrafts(authResult.userId, { status });
    return NextResponse.json({ drafts, total: drafts.length });
  } catch (error) {
    console.error("List drafts (UI) error:", error);
    return NextResponse.json(
      { error: "Failed to list drafts" },
      { status: 500 },
    );
  }
}
