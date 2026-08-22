/**
 * @route POST /api/tex-documents/cover-letter
 * @description Generate a cover letter as a LaTeX document.
 * @auth Required
 *
 * Spec §11. Same contract, same compile service, same inspector as a resume — the only
 * difference is that its spans are paragraphs. That sameness is what lets TipTap be
 * deleted outright rather than kept alive for this one surface.
 *
 * The prompt work in `lib/cover-letter/generate.ts` is reused unchanged; it already
 * returns plain prose, so the new step is only prose → annotated .tex.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireUserAuth } from "@/lib/auth";
import { gateOptionalAiFeature, isAiGateResponse } from "@/lib/billing/ai-gate";
import {
  generateCoverLetter,
  type CoverLetterInput,
} from "@/lib/cover-letter/generate";
import { getProfile } from "@/lib/db";
import { getGroupedBankEntries } from "@/lib/db/profile-bank";
import { createTexDocument } from "@/lib/db/tex-documents";
import { nowEpoch } from "@/lib/format/time";
import { coverLetterTitle, coverLetterToTex } from "@/lib/latex/cover-letter";
import { getJob } from "@/lib/db/jobs-async";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  opportunityId: z.string().min(1).optional(),
  /** Used when there is no saved opportunity to draw from. */
  jobDescription: z.string().min(1).optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  title: z.string().min(1).max(200).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireUserAuth(request);
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
  const body = parsed.data;

  let jobDescription = body.jobDescription ?? "";
  let jobTitle = body.jobTitle;
  let company = body.company;

  if (body.opportunityId) {
    // getJob rather than getOpportunity: the Opportunity projection drops `description`,
    // which is the one field a cover letter cannot be written without.
    const job = await getJob(body.opportunityId, auth.userId);
    if (!job) {
      return NextResponse.json(
        { error: "Opportunity not found", code: "unknown_opportunity" },
        { status: 404 },
      );
    }
    jobDescription = job.description ?? jobDescription;
    jobTitle = jobTitle ?? job.title;
    company = company ?? job.company;
  }

  if (!jobDescription.trim()) {
    return NextResponse.json(
      {
        error: "A job description is needed to write a cover letter.",
        code: "missing_job",
      },
      { status: 400 },
    );
  }

  const bankEntries = await getGroupedBankEntries(auth.userId);
  const totalEntries = Object.values(bankEntries).reduce(
    (sum, group) => sum + (Array.isArray(group) ? group.length : 0),
    0,
  );
  if (totalEntries === 0) {
    return NextResponse.json(
      {
        error:
          "Your knowledge bank is empty. Upload a resume first so the letter has something true to draw on.",
        code: "empty_bank",
      },
      { status: 400 },
    );
  }

  const profile = getProfile(auth.userId);
  const name = profile?.contact?.name ?? "";
  const contact = [profile?.contact?.email, profile?.contact?.location]
    .filter(Boolean)
    .join(" · ");

  const gate = await gateOptionalAiFeature(
    auth.userId,
    "cover_letter",
    "generate",
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

  const input: CoverLetterInput = {
    jobDescription,
    jobTitle,
    company,
    bankEntries,
    userName: name || undefined,
  };

  let prose: string;
  try {
    prose = await generateCoverLetter(input, gate.llmConfig);
  } catch (error) {
    gate.refund();
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: "Could not write the cover letter.", code: "llm_failed" },
      { status: 502 },
    );
  }

  const { source, paragraphCount } = coverLetterToTex({
    name: name || "Your Name",
    contact,
    prose,
  });

  const document = await createTexDocument({
    userId: auth.userId,
    kind: "cover_letter",
    title: body.title?.trim() || coverLetterTitle(company),
    source,
    opportunityId: body.opportunityId ?? null,
  });

  return NextResponse.json({ document, paragraphCount }, { status: 201 });
}
