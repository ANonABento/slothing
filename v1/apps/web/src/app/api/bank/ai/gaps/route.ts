import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, isAuthError } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import { getBankEntries, getGroupedBankEntries } from "@/lib/db/profile-bank";
import { classifyJobGaps } from "@/lib/bank/ai-authoring";
import { analyzeJobFit, extractKeywords } from "@/lib/tailor/analyze";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(1, "A job description is required.")
    .max(50000),
});

/**
 * @route POST /api/bank/ai/gaps
 * @description Tailoring↔bank loop (spec §6). Classifies a JD's missing keywords
 *   against the user's bank into `strengthenable` (a VERIFIED entry already has
 *   evidence → route to grounded Strengthen) vs `gaps` (no evidence → route to
 *   Articulate / ask the user). Deterministic, no LLM — it never invents
 *   experience, only routes what to do next.
 * @auth Required
 * @response { strengthenable: Array<{keyword, entryIds}>, gaps: string[], matchScore }
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const parsed = await parseJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;

  const { jobDescription } = parsed.data;
  const grouped = getGroupedBankEntries(authResult.userId);
  const flat = getBankEntries(authResult.userId);
  const keywords = extractKeywords(jobDescription);
  const analysis = analyzeJobFit(jobDescription, grouped, keywords);
  const { strengthenable, gaps } = classifyJobGaps(
    analysis.keywordsMissing,
    flat,
  );

  return NextResponse.json({
    strengthenable,
    gaps,
    matchScore: analysis.matchScore,
  });
}
