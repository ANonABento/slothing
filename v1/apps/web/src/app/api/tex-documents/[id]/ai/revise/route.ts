/**
 * @route POST /api/tex-documents/[id]/ai/revise
 * @description Propose a grounded revision of ONE field of ONE span.
 * @auth Required
 *
 * This route PROPOSES; it never writes. The client shows the change as a diff and the user
 * accepts it, at which point it goes through the ordinary field-write path. Two reasons:
 * `patchSpanField` stays the single write path into a document body (spec §7.3), and an AI
 * edit is always reviewable rather than an opaque overwrite (spec §8).
 *
 * Grounding is the existing anti-fabrication machinery from PRs #304/#306: `reviseBullet`
 * rejects any revision introducing facts the evidence does not support and returns the
 * original with `applied: false`.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import { gateOptionalAiFeature, isAiGateResponse } from "@/lib/billing/ai-gate";
import {
  reviseBullet,
  REVISE_PRESETS,
  type JobContext,
} from "@/lib/bank/ai-authoring";
import { getJob } from "@/lib/db/jobs-async";
import { getTexDocument } from "@/lib/db/tex-documents";
import { nowEpoch } from "@/lib/format/time";
import { buildSpanEvidence, isSpanAiActionId } from "@/lib/latex/ai-revise";
import { buildDocumentModel, fieldsFor } from "@/lib/latex/document-model";
import { validateInlineSubset, plainTextToLatex } from "@/lib/latex/inline";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  spanId: z.string().min(1),
  fieldIndex: z.number().int().min(0),
  action: z.string().refine(isSpanAiActionId, "Unknown action"),
  /** Unsaved editor content, so the AI revises what the user can see. */
  source: z.string().min(1).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  // LLM calls get the stricter limiter, not the standard one.
  const limit = rateLimiters.llm(getClientIdentifier(request, auth.userId));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Too many AI requests. Please try again shortly.",
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

  const parsed = await parseJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;
  const { spanId, fieldIndex, action } = parsed.data;

  const document = await getTexDocument(params.id, auth.userId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const model = buildDocumentModel(parsed.data.source ?? document.source);
  const field = fieldsFor(model, spanId).find((f) => f.index === fieldIndex);
  if (!field) {
    return NextResponse.json(
      {
        error: "That field is not part of this document.",
        code: "unknown_field",
      },
      { status: 404 },
    );
  }

  // A rich field's plain projection is lossy, so revising it would silently drop the
  // formatting on accept. Refused rather than quietly flattened.
  if (field.mode === "rich") {
    return NextResponse.json(
      {
        error:
          "This field contains formatting. Remove the formatting first, or edit it as LaTeX.",
        code: "rich_field",
      },
      { status: 422 },
    );
  }

  const evidence = buildSpanEvidence(model, spanId, fieldIndex);
  if (!evidence) {
    return NextResponse.json(
      { error: "Could not read that field.", code: "unknown_field" },
      { status: 404 },
    );
  }

  // "Tailor to this posting" only has meaning when the document is linked to one.
  let jobContext: JobContext | undefined;
  if (document.opportunityId) {
    try {
      const job = await getJob(document.opportunityId, auth.userId);
      if (job) {
        jobContext = {
          jobTitle: job.title,
          company: job.company,
          jobDescription: job.description,
        };
      }
    } catch {
      // Context is a bonus, never a blocker.
    }
  }

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
      evidence.target,
      evidence.evidence,
      REVISE_PRESETS[action],
      gate.llmConfig,
      jobContext,
    );

    // Defence in depth: the proposal is written back as escaped plain text, so it should
    // always satisfy the inline subset. Verify rather than assume.
    const violations = validateInlineSubset(plainTextToLatex(result.bullet));
    if (violations.length > 0) {
      gate.refund();
      return NextResponse.json(
        {
          error: "The AI returned something we could not use.",
          code: "invalid_output",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      original: evidence.target,
      proposal: result.bullet,
      /** False when the revision was rejected for inventing facts. */
      applied: result.applied,
      ungroundedNumbers: result.ungroundedNumbers,
      sources: evidence.sources,
      usedJobContext: Boolean(jobContext),
    });
  } catch (error) {
    gate.refund();
    console.error("Tex AI revise error:", error);
    return NextResponse.json(
      { error: "Could not revise that line.", code: "llm_failed" },
      { status: 502 },
    );
  }
}
