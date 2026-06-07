import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, isAuthError } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import { gateOptionalAiFeature, isAiGateResponse } from "@/lib/billing/ai-gate";
import { getBankEntryById, insertBankEntry } from "@/lib/db/profile-bank";
import { isVerifiedBankEntry } from "@/types";
import {
  strengthenEntryHighlights,
  strengthenedDraftInput,
  type JobContext,
} from "@/lib/bank/ai-authoring";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  mode: z.literal("strengthen"),
  entryId: z.string().min(1),
  jobContext: z
    .object({
      jobTitle: z.string().optional(),
      company: z.string().optional(),
      jobDescription: z.string().optional(),
    })
    .optional(),
});

/**
 * @route POST /api/bank/ai/draft
 * @description AI bank authoring (spec §4). `mode: "strengthen"` rewrites an existing
 *   VERIFIED bank entry's bullets for impact, grounded ⊆ the original (no invented
 *   facts/metrics), and saves the result as a `draft` the user must confirm before
 *   tailoring treats it as fact. AI-gated like /api/tailor.
 * @auth Required
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const parsed = await parseJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;
  const { entryId, jobContext } = parsed.data;

  const entry = getBankEntryById(entryId, auth.userId);
  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  if (!isVerifiedBankEntry(entry)) {
    return NextResponse.json(
      { error: "Only verified entries can be strengthened." },
      { status: 400 },
    );
  }

  const gate = await gateOptionalAiFeature(
    auth.userId,
    "document_assistant",
    `strengthen:${entryId}`,
  );
  if (isAiGateResponse(gate)) return gate;
  if (!gate.llmConfig) {
    return NextResponse.json(
      {
        error:
          "AI is required to strengthen an entry. Add a provider key or upgrade.",
        code: "ai_required",
      },
      { status: 402 },
    );
  }

  try {
    const highlights = await strengthenEntryHighlights(
      entry,
      gate.llmConfig,
      jobContext as JobContext | undefined,
    );
    const id = insertBankEntry(
      strengthenedDraftInput(entry, highlights),
      auth.userId,
    );
    return NextResponse.json(
      { success: true, id, status: "draft", highlights },
      { status: 201 },
    );
  } catch (error) {
    gate.refund();
    console.error("Strengthen draft error:", error);
    return NextResponse.json(
      { error: "Failed to strengthen entry" },
      { status: 500 },
    );
  }
}
