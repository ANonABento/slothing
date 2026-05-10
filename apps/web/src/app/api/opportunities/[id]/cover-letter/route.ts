/**
 * @route POST /api/opportunities/[id]/cover-letter
 * @description Generate a cover letter for an opportunity using LLM
 * @auth Required
 * @response CoverLetterGenerateResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/db/jobs";
import { getProfile, getLLMConfig } from "@/lib/db";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import { requireAuth, isAuthError } from "@/lib/auth";
import { buildOpportunityCoverLetterJsonPrompt } from "@/lib/cover-letter/opportunity-prompts";
import {
  detectGenericPhrases,
  mergeGenericPhraseMatches,
} from "@/lib/ai/prompt-quality";

export const dynamic = "force-dynamic";

interface CoverLetterResponse {
  coverLetter: string;
  highlights: string[];
  selfCheck?: {
    evidencePoint: string;
    matchedRequirement: string;
    unsupportedCompanyFacts: string[];
    genericPhrases: string[];
    hasClearCTA: boolean;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

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

    const llmConfig = getLLMConfig(authResult.userId);

    let coverLetter: string;
    let highlights: string[] = [];
    let selfCheck: CoverLetterResponse["selfCheck"] | undefined;

    if (llmConfig) {
      const client = new LLMClient(llmConfig);

      const profileSummary = `
Name: ${profile.contact.name}
Email: ${profile.contact.email || "N/A"}
Phone: ${profile.contact.phone || "N/A"}
Summary: ${profile.summary || "N/A"}

Experience:
${profile.experiences.map((e) => `- ${e.title} at ${e.company}: ${e.description}`).join("\n")}

Skills: ${profile.skills.map((s) => s.name).join(", ")}
      `.trim();

      const response = await client.complete({
        messages: [
          {
            role: "user",
            content: buildOpportunityCoverLetterJsonPrompt({
              profileSummary,
              job,
            }),
          },
        ],
        temperature: 0.7,
        maxTokens: 2000,
      });

      try {
        const parsed = parseJSONFromLLM<CoverLetterResponse>(response);
        coverLetter =
          parsed.coverLetter || generateBasicCoverLetter(profile, job);
        highlights = parsed.highlights || [];
        selfCheck = parsed.selfCheck
          ? {
              ...parsed.selfCheck,
              genericPhrases: mergeGenericPhraseMatches(
                parsed.selfCheck.genericPhrases,
                detectGenericPhrases(coverLetter),
              ),
            }
          : {
              evidencePoint: "",
              matchedRequirement: "",
              unsupportedCompanyFacts: [],
              genericPhrases: detectGenericPhrases(coverLetter),
              hasClearCTA: false,
            };
      } catch {
        coverLetter = response; // Use raw response if JSON parsing fails
        selfCheck = {
          evidencePoint: "",
          matchedRequirement: "",
          unsupportedCompanyFacts: [],
          genericPhrases: detectGenericPhrases(coverLetter),
          hasClearCTA: false,
        };
      }
    } else {
      // Generate basic cover letter without LLM
      coverLetter = generateBasicCoverLetter(profile, job);
      highlights = [
        `Experience as ${profile.experiences[0]?.title || "professional"}`,
        `Skills in ${profile.skills
          .slice(0, 3)
          .map((s) => s.name)
          .join(", ")}`,
        "Motivated to contribute to the team",
      ];
    }

    return NextResponse.json({
      success: true,
      coverLetter,
      highlights,
      ...(selfCheck ? { selfCheck } : {}),
      usedLLM: !!llmConfig,
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 },
    );
  }
}

function generateBasicCoverLetter(
  profile: {
    contact: { name?: string; email?: string };
    summary?: string;
    experiences: { title: string; company: string }[];
    skills: { name: string }[];
  },
  job: { title: string; company: string; description: string },
): string {
  const name = profile.contact.name || "Applicant";
  const recentRole = profile.experiences[0];
  const topSkills = profile.skills.slice(0, 5).map((s) => s.name);

  return `Dear Hiring Manager,

${recentRole ? `As a ${recentRole.title} at ${recentRole.company}` : "With my recent work"} and experience with ${topSkills.slice(0, 3).join(", ") || "the requirements you outlined"}, I can bring relevant evidence to the ${job.title} role at ${job.company}.

${profile.summary || `My background includes hands-on work across ${topSkills.join(", ") || "the skills needed for this role"}, and I focus on turning that experience into practical, reliable results.`}

The role's requirements connect directly to that experience, and I would welcome the chance to discuss how my skills could support ${job.company}'s needs.

Thank you for considering my application. I look forward to the opportunity to speak with you.

Best regards,
${name}`;
}
