/**
 * @route POST /api/extension/drafts/[id]/submit-result
 * @description An executor (extension/worker) reports the outcome of submitting
 *   an approved drafted application. Enforces the approval gate: only `approved`
 *   drafts may move to `submitted`/`failed`.
 * @auth Extension token via X-Extension-Token
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { recordSubmission } from "@/lib/db/application-drafts";
import { submitResultSchema } from "@/lib/agent/draft";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

  const parsed = submitResultSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { draft, gated } = await recordSubmission(
      params.id,
      authResult.userId,
      parsed.data,
    );
    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }
    if (gated) {
      return NextResponse.json(
        {
          error:
            "Draft is not approved — only approved drafts may be submitted.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Record submission error:", error);
    return NextResponse.json(
      { error: "Failed to record submission" },
      { status: 500 },
    );
  }
}
