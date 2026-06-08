/**
 * @route GET   /api/applications/drafts/[id]   Fetch one draft
 * @route PATCH /api/applications/drafts/[id]   Edit answers and/or move status (approve/reject)
 * @description Review-UI surface. Status transitions are user-directed; reject
 *   is exposed via an undo snackbar (Pattern B) in the UI.
 * @auth requireAuth (NextAuth + local-dev fallback)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getDraft, reviewDraft } from "@/lib/db/application-drafts";
import { draftReviewSchema } from "@/lib/agent/draft";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const draft = await getDraft(params.id, authResult.userId);
    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }
    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Get draft error:", error);
    return NextResponse.json(
      { error: "Failed to fetch draft" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsed = draftReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const draft = await reviewDraft(params.id, authResult.userId, parsed.data);
    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }
    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Review draft error:", error);
    return NextResponse.json(
      { error: "Failed to update draft" },
      { status: 500 },
    );
  }
}
