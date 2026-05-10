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
import type { TailoredResume } from "@/lib/resume/generator";
import { buildTailorAutofixPrompt } from "@/lib/tailor/prompt-builders";

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

    const llmJson = extractJSON(response);
    const improved: TailoredResume = {
      contact: resume.contact,
      summary:
        typeof llmJson.summary === "string" ? llmJson.summary : resume.summary,
      experiences: Array.isArray(llmJson.experiences)
        ? (llmJson.experiences as TailoredResume["experiences"])
        : resume.experiences,
      skills: Array.isArray(llmJson.skills)
        ? (llmJson.skills as string[])
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
