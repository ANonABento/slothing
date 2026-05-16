/**
 * @route POST /api/opportunities/[id]/analyze
 * @description Analyze candidate fit against an opportunity using LLM-powered matching
 * @auth Required
 * @response JobAnalysisResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/db/jobs";
import { getProfile } from "@/lib/db";
import {
  gateOptionalAiFeature,
  isAiGateResponse,
  type OptionalAiGatePass,
} from "@/lib/billing/ai-gate";
import {
  isProviderUnavailableError,
  providerNotConfiguredFallback,
  providerUnavailableFallback,
  type ProviderFallbackInfo,
} from "@/lib/llm/provider-fallback";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import type { JobDescription, JobMatch, Profile } from "@/types";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: OptionalAiGatePass | null = null;

  try {
    const job = getJob(params.id, authResult.userId);
    if (!job) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      );
    }

    const profile = getProfile(authResult.userId);
    if (!profile) {
      return NextResponse.json(
        { error: "No profile data. Upload a resume first." },
        { status: 400 },
      );
    }

    const gate = gateOptionalAiFeature(
      authResult.userId,
      "tailor",
      `analyze:${params.id}`,
    );
    if (isAiGateResponse(gate)) return gate;
    aiGate = gate;

    let fallback: ProviderFallbackInfo | null = null;
    let analysis: JobMatch;

    if (gate.llmConfig) {
      try {
        // Use LLM for analysis
        const client = new LLMClient(gate.llmConfig);

        const profileSummary = `
Name: ${profile.contact.name}
Summary: ${profile.summary || "N/A"}

Experience:
${profile.experiences.map((e) => `- ${e.title} at ${e.company} (${e.startDate} - ${e.endDate || "Present"}): ${e.description}`).join("\n")}

Skills: ${profile.skills.map((s) => s.name).join(", ")}

Education:
${profile.education.map((e) => `- ${e.degree} in ${e.field} from ${e.institution}`).join("\n")}
      `.trim();

        const response = await client.complete({
          messages: [
            {
              role: "user",
              content: `Analyze how well this candidate matches the job. Return ONLY a JSON object with this structure:
{
  "overallScore": <number 0-100>,
  "skillMatches": [{"skill": "skill name", "matched": true/false, "relevance": <0-1>}],
  "gaps": ["missing skill or requirement 1", "missing skill 2"],
  "suggestions": ["suggestion to improve candidacy 1", "suggestion 2"]
}

CANDIDATE PROFILE:
${profileSummary}

JOB DESCRIPTION:
Title: ${job.title} at ${job.company}
${job.description}

Required keywords/skills: ${job.keywords.join(", ")}

Return ONLY the JSON object, no explanation.`,
            },
          ],
          temperature: 0.3,
          maxTokens: 1000,
        });

        // Parse response using utility function
        const parsed = parseJSONFromLLM<{
          overallScore?: number;
          skillMatches?: {
            skill: string;
            matched: boolean;
            relevance: number;
          }[];
          gaps?: string[];
          suggestions?: string[];
        }>(response);
        analysis = {
          jobId: job.id,
          profileId: profile.id,
          overallScore: parsed.overallScore || 50,
          skillMatches: parsed.skillMatches || [],
          experienceMatches: [],
          gaps: parsed.gaps || [],
          suggestions: parsed.suggestions || [],
        };
      } catch (error) {
        if (!isProviderUnavailableError(error)) throw error;
        aiGate?.refund();
        aiGate = null;
        fallback = providerUnavailableFallback(gate.llmConfig);
        analysis = buildBasicAnalysis(profile, job);
      }
    } else {
      fallback = providerNotConfiguredFallback();
      analysis = buildBasicAnalysis(profile, job);
    }

    return NextResponse.json({
      analysis,
      ...(fallback
        ? { fallbackUsed: true, providerError: fallback }
        : { fallbackUsed: false }),
    });
  } catch (error) {
    aiGate?.refund();
    console.error(
      "Analyze error:",
      error instanceof Error ? error.stack : error,
    );
    return NextResponse.json(
      { error: "Failed to analyze opportunity match" },
      { status: 500 },
    );
  }
}

function buildBasicAnalysis(profile: Profile, job: JobDescription): JobMatch {
  // Basic keyword matching
  const profileSkills = (profile.skills as Array<string | { name?: string }>)
    .flatMap((skill) => {
      const name = typeof skill === "string" ? skill : skill.name;
      return name ? [name] : [];
    })
    .map((skill) => skill.toLowerCase());
  const jobKeywords = (job.keywords ?? [])
    .filter(Boolean)
    .map((keyword) => keyword.toLowerCase());

  const matched = jobKeywords.filter((kw) =>
    profileSkills.some((ps) => ps.includes(kw) || kw.includes(ps)),
  );
  const missing = jobKeywords.filter(
    (kw) => !profileSkills.some((ps) => ps.includes(kw) || kw.includes(ps)),
  );

  const score =
    jobKeywords.length > 0
      ? Math.round((matched.length / jobKeywords.length) * 100)
      : 50;

  return {
    jobId: job.id,
    profileId: profile.id,
    overallScore: score,
    skillMatches: jobKeywords.map((kw) => ({
      skill: kw,
      matched: matched.includes(kw),
      relevance: matched.includes(kw) ? 1 : 0,
    })),
    experienceMatches: [],
    gaps: missing,
    suggestions:
      missing.length > 0
        ? [
            `Consider highlighting experience with: ${missing.slice(0, 3).join(", ")}`,
          ]
        : [],
  };
}
