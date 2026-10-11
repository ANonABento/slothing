/**
 * @route POST /api/tex-documents/[id]/annotate
 * @description Propose Slothing structural macros for an imported .tex.
 * @auth Required
 *
 * Spec §9.2. An imported document renders perfectly but is not addressable. This asks a
 * model to wrap its existing structure in `\slothing*` macros WITHOUT changing a visible
 * character — a genuinely risky operation, so it is defended in three layers:
 *
 *   1. Structural checks (no compile) — ids valid and unique, macros parse, no word
 *      gained or lost.
 *   2. RENDER EQUIVALENCE — compile before and after and compare the text extracted from
 *      both PDFs. Annotation is supposed to be structurally invisible; if the rendered
 *      words changed at all, the model altered content and the proposal is discarded.
 *   3. Human review — this route proposes, it never applies.
 *
 * A failed annotation changes nothing. The document stays exactly as imported.
 */
import { NextResponse, type NextRequest } from "next/server";

import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import { gateOptionalAiFeature, isAiGateResponse } from "@/lib/billing/ai-gate";
import { getTexDocument } from "@/lib/db/tex-documents";
import { nowEpoch } from "@/lib/format/time";
import { LLMClient } from "@/lib/llm/client";
import { parseJSONFromLLM } from "@/lib/llm/json";
import {
  buildAnnotatePrompt,
  checkAnnotationShape,
  summarizeAnnotation,
} from "@/lib/latex/annotate";
import { compile } from "@/lib/latex/compile";
import { extractPdfText, compareRenderedText } from "@/lib/latex/pdf-text";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const bodySchema = z.object({ source: z.string().min(1).optional() });

/** Annotating a whole document is a large generation. */
const MAX_TOKENS = 8000;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

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
          "Retry-After": Math.max(
            1,
            Math.ceil((limit.resetAt - nowEpoch()) / 1000),
          ).toString(),
        },
      },
    );
  }

  const parsed = await parseJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;

  const document = await getTexDocument(params.id, auth.userId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  const original = parsed.data.source ?? document.source;

  const gate = await gateOptionalAiFeature(
    auth.userId,
    "document_assistant",
    "annotate",
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

  let annotated: string;
  try {
    const client = new LLMClient(gate.llmConfig);
    const response = await client.complete({
      messages: [{ role: "user", content: buildAnnotatePrompt(original) }],
      temperature: 0,
      maxTokens: MAX_TOKENS,
    });
    const result = parseJSONFromLLM<{ annotated?: unknown }>(response);
    if (
      typeof result.annotated !== "string" ||
      result.annotated.trim() === ""
    ) {
      throw new Error("no annotated source returned");
    }
    annotated = result.annotated;
  } catch (error) {
    gate.refund();
    console.error("Annotate error:", error);
    return NextResponse.json(
      { error: "Could not annotate this document.", code: "llm_failed" },
      { status: 502 },
    );
  }

  // Layer 1 — cheap structural checks, before spending two compiles.
  const shape = checkAnnotationShape(original, annotated);
  if (!shape.ok) {
    gate.refund();
    return NextResponse.json(
      {
        ok: false,
        code: "rejected",
        reason: "structure",
        issues: shape.issues,
      },
      { status: 200 },
    );
  }

  // Layer 2 — render equivalence. The expensive, decisive check.
  try {
    const [before, after] = await Promise.all([
      compile({ source: original, mode: "export", allowFetch: true }),
      compile({ source: annotated, mode: "export", allowFetch: true }),
    ]);

    const comparison = compareRenderedText(
      await extractPdfText(before.pdf),
      await extractPdfText(after.pdf),
    );

    if (!comparison.identical) {
      gate.refund();
      return NextResponse.json(
        {
          ok: false,
          code: "rejected",
          reason: "render_changed",
          issues: [
            {
              code: "render_changed",
              message:
                "The annotated document does not render identically to the original.",
            },
          ],
          divergenceAt: comparison.divergenceAt,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    gate.refund();
    console.error("Annotate verification error:", error);
    return NextResponse.json(
      {
        ok: false,
        code: "rejected",
        reason: "verification_failed",
        issues: [
          {
            code: "verification_failed",
            message: "The annotated document could not be verified.",
          },
        ],
      },
      { status: 200 },
    );
  }

  // Layer 3 — the user still decides.
  return NextResponse.json({
    ok: true,
    annotated,
    spanCount: shape.spanCount,
    byKind: shape.byKind,
    summary: summarizeAnnotation(shape.byKind),
  });
}
