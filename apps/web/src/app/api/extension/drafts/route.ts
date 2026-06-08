/**
 * @route GET  /api/extension/drafts        List drafted applications (status filter optional)
 * @route POST /api/extension/drafts        Create/update a drafted application from an agent
 * @description The agent-facing surface for autonomy level L2 (draft). One open
 *   draft per (user, job) — re-posting a job updates its open draft in place.
 * @auth Extension token via X-Extension-Token
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { listDrafts, upsertDraft } from "@/lib/db/application-drafts";
import { draftUpsertSchema, isDraftStatus } from "@/lib/agent/draft";

export async function GET(request: NextRequest) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) return authResult.response;

  const statusParam = request.nextUrl.searchParams.get("status");
  const limitParam = request.nextUrl.searchParams.get("limit");

  try {
    const drafts = await listDrafts(authResult.userId, {
      status: isDraftStatus(statusParam) ? statusParam : undefined,
      limit: limitParam ? Number(limitParam) : undefined,
    });
    return NextResponse.json({ drafts, total: drafts.length });
  } catch (error) {
    console.error("List drafts error:", error);
    return NextResponse.json(
      { error: "Failed to list drafts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) return authResult.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsed = draftUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const draft = await upsertDraft(authResult.userId, parsed.data);
    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    console.error("Upsert draft error:", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 },
    );
  }
}
