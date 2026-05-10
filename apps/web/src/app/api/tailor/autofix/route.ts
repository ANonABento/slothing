/**
 * @route POST /api/tailor/autofix
 * @description Uses LLM to rewrite resume sections incorporating missing keywords
 * @auth Required
 * @request { resume: TailoredResume, keywordsMissing: string[], jobDescription: string }
 * @response { resume: TailoredResume }
 */
import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api-utils";
import { getLLMConfig } from "@/lib/db";
import { LLMClient } from "@/lib/llm/client";
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

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = await parseJsonBody(request, tailorAutofixSchema);
    if (!parsed.ok) return parsed.response;

    const {
      resume: validatedResume,
      keywordsMissing,
      jobDescription,
    } = parsed.data;
    const resume = validatedResume as TailoredResume;

    const llmConfig = getLLMConfig(authResult.userId);
    if (!llmConfig) {
      return NextResponse.json(
        { error: "No LLM provider configured. Visit Settings to set one up." },
        { status: 400 },
      );
    }

    const client = new LLMClient(llmConfig);

    const prompt = buildAutofixPrompt({
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
    console.error("Auto-fix error:", error);
    return NextResponse.json(
      { error: "Failed to auto-fix resume" },
      { status: 500 },
    );
  }
}

export function buildAutofixPrompt({
  resume,
  keywordsMissing,
  jobDescription,
}: {
  resume: TailoredResume;
  keywordsMissing: string[];
  jobDescription: string;
}): string {
  return `You are a resume optimization expert. Rewrite the following resume to naturally incorporate these missing keywords while maintaining authenticity and readability.

MISSING KEYWORDS TO INCORPORATE:
${keywordsMissing.slice(0, 15).join(", ")}

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

CURRENT RESUME:
${JSON.stringify(resume, null, 2)}

RULES:
- Only modify summary, experience highlights, and skills
- Every added keyword, skill, tool, metric, employer, degree, certification, responsibility, and achievement must be backed by the current resume evidence
- Add GraphQL only when the current resume already contains GraphQL or direct evidence of GraphQL work
- Refuse or omit AWS, Kubernetes, and any other missing keyword when absent from the current resume evidence
- Do not invent metrics, tools, employers, degrees, certifications, dates, titles, clients, or responsibilities
- Preserve contact info and education exactly
- Preserve companies, titles, and dates exactly
- Incorporate supported keywords naturally; don't just list them
- Maintain the same JSON structure
- Keep it concise (one-page resume)
- Return schema-valid JSON only, with no markdown, labels, comments, or surrounding prose

Return the improved resume as a JSON object with the same structure (contact, summary, experiences, skills, education).`;
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
