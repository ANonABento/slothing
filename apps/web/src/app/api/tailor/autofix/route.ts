/**
 * @route POST /api/tailor/autofix
 * @description Uses LLM to rewrite resume sections incorporating missing keywords
 * @auth Required
 * @request { resume: TailoredResume, keywordsMissing: string[], jobDescription: string }
 * @response { resume: TailoredResume }
 */
import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api-utils";
import {
  gateAiFeature,
  isAiGateResponse,
  type AiGatePass,
} from "@/lib/billing/ai-gate";
import { LLMClient } from "@/lib/llm/client";
import { nowEpoch } from "@/lib/format/time";
import { extractJSON } from "@/lib/utils";
import { requireAuth, isAuthError } from "@/lib/auth";
import { tailorAutofixSchema } from "@/lib/schemas";
import { tailoredResumeSchema } from "@/lib/schemas/tailor";
import {
  filterUnsupportedClaims,
  getUnsupportedKeywords,
  stripUnsupportedClaims,
} from "@/lib/resume/generator";
import type { TailoredResume } from "@/lib/resume/generator";
import { buildTailorAutofixPrompt } from "@/lib/tailor/prompt-builders";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: AiGatePass | null = null;

  try {
    const parsed = await parseJsonBody(request, tailorAutofixSchema);
    if (!parsed.ok) return parsed.response;

    const {
      resume: validatedResume,
      keywordsMissing,
      jobDescription,
    } = parsed.data;
    const resume = validatedResume as TailoredResume;

    const gate = gateAiFeature(
      authResult.userId,
      "tailor",
      `autofix:${nowEpoch()}`,
    );
    if (isAiGateResponse(gate)) return gate;
    aiGate = gate;

    const client = new LLMClient(gate.llmConfig);

    const prompt = buildTailorAutofixPrompt({
      resume,
      keywordsMissing,
      jobDescription,
    });

    const response = await client.complete({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      maxTokens: 4096,
    });

    const llmJson = tailoredResumeSchema.partial().parse(extractJSON(response));
    const unsupportedKeywords = getUnsupportedKeywords(
      keywordsMissing,
      JSON.stringify(resume).toLowerCase(),
    );
    const improved: TailoredResume = {
      contact: resume.contact,
      summary: stripUnsupportedClaims(
        typeof llmJson.summary === "string" ? llmJson.summary : resume.summary,
        unsupportedKeywords,
      ),
      experiences: Array.isArray(llmJson.experiences)
        ? sanitizeAutofixExperiences(
            resume.experiences,
            llmJson.experiences as TailoredResume["experiences"],
            unsupportedKeywords,
          )
        : resume.experiences,
      skills: Array.isArray(llmJson.skills)
        ? filterUnsupportedClaims(
            llmJson.skills as string[],
            unsupportedKeywords,
          )
        : resume.skills,
      education: resume.education,
    };

    return NextResponse.json({ resume: improved });
  } catch (error) {
    aiGate?.refund();
    console.error("Auto-fix error:", error);
    return NextResponse.json(
      { error: "Failed to auto-fix resume" },
      { status: 500 },
    );
  }
}

function sanitizeAutofixExperiences(
  sourceExperiences: TailoredResume["experiences"],
  nextExperiences: TailoredResume["experiences"],
  unsupportedKeywords: string[],
): TailoredResume["experiences"] {
  return nextExperiences.map((experience, index) => {
    const source = sourceExperiences[index];
    return {
      company: source?.company || experience.company,
      title: source?.title || experience.title,
      dates: source?.dates || experience.dates,
      highlights: filterUnsupportedClaims(
        experience.highlights,
        unsupportedKeywords,
      ),
    };
  });
}
