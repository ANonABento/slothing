import { NextRequest, NextResponse } from "next/server";

import { requireAuth, isAuthError } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import { gateOptionalAiFeature, isAiGateResponse } from "@/lib/billing/ai-gate";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limit";
import { nowEpoch } from "@/lib/format/time";
import { researchBankSchema } from "@/lib/schemas/bank";
import {
  fetchUrlSource,
  UrlSourceError,
  type UrlSourceErrorCode,
} from "@/lib/bank/url-source";
import { selectStyleExemplars } from "@/lib/bank/golden-set";
import {
  draftProjectFromSource,
  type JobContext,
} from "@/lib/bank/ai-authoring";

export const dynamic = "force-dynamic";

/** Map a {@link UrlSourceError} code to an HTTP status. */
const URL_ERROR_STATUS: Record<UrlSourceErrorCode, number> = {
  invalid_url: 400,
  blocked_url: 400,
  not_found: 404,
  private_or_forbidden: 403,
  rate_limited: 429,
  unsupported_content: 415,
  empty_content: 422,
  fetch_failed: 502,
};

/**
 * @route POST /api/bank/ai/research
 * @description Fetch a URL (GitHub repo or web page) and draft a GROUNDED project (name +
 *   technologies + bullets) from its text — a PREVIEW only, nothing is persisted. The fetch runs
 *   BEFORE the AI gate so fetch failures never spend a credit; AI failures refund. Bullets are
 *   filtered through the grounding check, so they can only assert what the source supports.
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

  const parsed = await parseJsonBody(request, researchBankSchema);
  if (!parsed.ok) return parsed.response;
  const { url, jobContext } = parsed.data;

  // Fetch BEFORE the credit gate: a bad/unreachable URL must never cost a credit.
  let source;
  try {
    source = await fetchUrlSource(url);
  } catch (error) {
    if (error instanceof UrlSourceError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: URL_ERROR_STATUS[error.code] },
      );
    }
    console.error("URL research fetch error:", error);
    return NextResponse.json(
      { error: "Couldn't fetch that URL.", code: "fetch_failed" },
      { status: 502 },
    );
  }

  const gate = await gateOptionalAiFeature(
    auth.userId,
    "document_assistant",
    `research:${url}`,
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
    const exemplars = selectStyleExemplars(auth.userId);
    const draft = await draftProjectFromSource(
      source,
      gate.llmConfig,
      exemplars,
      jobContext as JobContext | undefined,
    );
    if (draft.bullets.length === 0) {
      gate.refund();
      return NextResponse.json(
        {
          error:
            "Couldn't ground any bullets in that source. Try a richer page or paste details manually.",
          code: "no_grounded_output",
        },
        { status: 422 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        source: {
          kind: source.kind,
          title: source.title,
          url: source.url,
          // The grounding evidence — returned so the scratchpad can ground per-bullet revisions
          // against the same source without re-fetching.
          text: source.text,
        },
        draft,
      },
      { status: 200 },
    );
  } catch (error) {
    gate.refund();
    console.error("AI research draft error:", error);
    return NextResponse.json(
      { error: "Failed to draft from that source.", code: "llm_failed" },
      { status: 502 },
    );
  }
}
