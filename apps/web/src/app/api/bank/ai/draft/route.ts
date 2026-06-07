import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, isAuthError } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import { gateOptionalAiFeature, isAiGateResponse } from "@/lib/billing/ai-gate";
import { getBankEntryById, insertBankEntry } from "@/lib/db/profile-bank";
import { BANK_CATEGORIES, isVerifiedBankEntry } from "@/types";
import {
  articulateToBullets,
  articulatedDraftInput,
  strengthenEntryHighlights,
  strengthenedDraftInput,
  type JobContext,
} from "@/lib/bank/ai-authoring";

export const dynamic = "force-dynamic";

const jobContextSchema = z
  .object({
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    jobDescription: z.string().optional(),
  })
  .optional();

const bodySchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("strengthen"),
    entryId: z.string().min(1),
    jobContext: jobContextSchema,
  }),
  z.object({
    mode: z.literal("articulate"),
    rawText: z.string().min(10),
    category: z.enum(BANK_CATEGORIES).optional(),
    jobContext: jobContextSchema,
  }),
]);

/**
 * @route POST /api/bank/ai/draft
 * @description AI bank authoring (spec §4). Both modes produce a `draft` the user must
 *   confirm before tailoring treats it as fact, and never originate facts:
 *   - `strengthen`: rewrite a VERIFIED entry's bullets, grounded ⊆ the original.
 *   - `articulate`: turn the user's own raw notes into bullets, grounded ⊆ the notes.
 *   AI-gated like /api/tailor (402 for free users).
 * @auth Required
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const parsed = await parseJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;
  const data = parsed.data;

  // Strengthen needs an existing verified entry — check before spending the AI gate.
  const entry =
    data.mode === "strengthen"
      ? getBankEntryById(data.entryId, auth.userId)
      : null;
  if (data.mode === "strengthen") {
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    if (!isVerifiedBankEntry(entry)) {
      return NextResponse.json(
        { error: "Only verified entries can be strengthened." },
        { status: 400 },
      );
    }
  }

  const gate = await gateOptionalAiFeature(
    auth.userId,
    "document_assistant",
    `${data.mode}:${data.mode === "strengthen" ? data.entryId : "articulate"}`,
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
    const jobContext = data.jobContext as JobContext | undefined;

    if (data.mode === "strengthen") {
      const highlights = await strengthenEntryHighlights(
        entry!,
        gate.llmConfig,
        jobContext,
      );
      const id = insertBankEntry(
        strengthenedDraftInput(entry!, highlights),
        auth.userId,
      );
      return NextResponse.json(
        { success: true, ids: [id], status: "draft", highlights },
        { status: 201 },
      );
    }

    // articulate
    const bullets = await articulateToBullets(
      data.rawText,
      gate.llmConfig,
      jobContext,
    );
    if (bullets.length === 0) {
      gate.refund();
      return NextResponse.json(
        {
          error:
            "Couldn't form a bullet grounded in your notes. Add more detail and try again.",
          code: "no_grounded_output",
        },
        { status: 422 },
      );
    }
    const ids = bullets.map((bullet) =>
      insertBankEntry(
        articulatedDraftInput(data.rawText, bullet, data.category),
        auth.userId,
      ),
    );
    return NextResponse.json(
      { success: true, ids, status: "draft", bullets },
      { status: 201 },
    );
  } catch (error) {
    gate.refund();
    console.error("AI draft error:", error);
    return NextResponse.json(
      { error: "Failed to create AI draft" },
      { status: 500 },
    );
  }
}
