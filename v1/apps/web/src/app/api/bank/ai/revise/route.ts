import { NextRequest, NextResponse } from "next/server";

import { requireAuth, isAuthError } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import { gateOptionalAiFeature, isAiGateResponse } from "@/lib/billing/ai-gate";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limit";
import { nowEpoch } from "@/lib/format/time";
import { reviseBankSchema } from "@/lib/schemas/bank";
import {
  reviseBullet,
  REVISE_PRESETS,
  type JobContext,
} from "@/lib/bank/ai-authoring";

export const dynamic = "force-dynamic";

/**
 * @route POST /api/bank/ai/revise
 * @description Iterate on a single résumé bullet (the scratchpad's per-bullet "Revise"). The
 *   revision is grounded ⊆ the supplied evidence — a fabricating revision is rejected server-side
 *   and the original bullet is returned with `applied:false`. Preview only; nothing is persisted.
 * @auth Required
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const limit = rateLimiters.standard(
    getClientIdentifier(request, auth.userId),
  );
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again shortly.",
        code: "rate_limited",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (limit.resetAt - nowEpoch()) / 1000,
          ).toString(),
        },
      },
    );
  }

  const parsed = await parseJsonBody(request, reviseBankSchema);
  if (!parsed.ok) return parsed.response;
  const { bullet, evidence, preset, instruction, jobContext } = parsed.data;

  const resolvedInstruction =
    instruction?.trim() ||
    (preset ? REVISE_PRESETS[preset] : REVISE_PRESETS.rephrase);

  const gate = await gateOptionalAiFeature(
    auth.userId,
    "document_assistant",
    "revise",
  );
  if (isAiGateResponse(gate)) return gate;
  if (!gate.llmConfig) {
    return NextResponse.json(
      {
        error: "AI is required for this. Add a provider key or upgrade.",
        code: "ai_required",
      },
      { status: 402 },
    );
  }

  try {
    const result = await reviseBullet(
      bullet,
      evidence,
      resolvedInstruction,
      gate.llmConfig,
      jobContext as JobContext | undefined,
    );
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    gate.refund();
    console.error("AI revise error:", error);
    return NextResponse.json(
      { error: "Failed to revise the bullet.", code: "llm_failed" },
      { status: 502 },
    );
  }
}
