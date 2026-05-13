/**
 * @route POST /api/opportunities/[id]/cover-letter/stream
 * @description Stream cover letter generation via Server-Sent Events (SSE)
 * @auth Required
 * @response Server-Sent Events stream
 */
import { NextRequest } from "next/server";
import { getJob } from "@/lib/db/jobs";
import { getProfile } from "@/lib/db";
import {
  gateAiFeature,
  isAiGateResponse,
  type AiGatePass,
} from "@/lib/billing/ai-gate";
import { LLMClient } from "@/lib/llm/client";
import { requireAuth, isAuthError } from "@/lib/auth";
import { buildOpportunityCoverLetterStreamPrompt } from "@/lib/cover-letter/opportunity-prompts";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: AiGatePass | null = null;

  try {
    const job = getJob(params.id, authResult.userId);
    if (!job) {
      return new Response(JSON.stringify({ error: "Opportunity not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const profile = getProfile(authResult.userId);
    if (!profile) {
      return new Response(
        JSON.stringify({ error: "No profile data. Upload a resume first." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const gate = gateAiFeature(authResult.userId, "cover_letter", params.id);
    if (isAiGateResponse(gate)) return gate;
    aiGate = gate;

    const client = new LLMClient(gate.llmConfig);

    const profileSummary = `
Name: ${profile.contact.name}
Email: ${profile.contact.email || "N/A"}
Phone: ${profile.contact.phone || "N/A"}
Summary: ${profile.summary || "N/A"}

Experience:
${profile.experiences.map((e) => `- ${e.title} at ${e.company}: ${e.description}`).join("\n")}

Skills: ${profile.skills.map((s) => s.name).join(", ")}
    `.trim();

    const prompt = buildOpportunityCoverLetterStreamPrompt({
      profileSummary,
      job,
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = client.stream({
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            maxTokens: 2000,
          });

          for await (const chunk of generator) {
            const data = JSON.stringify({ content: chunk, done: false });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          controller.enqueue(encoder.encode(`data: {"done": true}\n\n`));
          controller.close();
        } catch (error) {
          aiGate?.refund();
          // Log internally but never echo error.message to the client — LLM
          // SDKs occasionally include API keys / request IDs in error strings.
          console.error("[cover-letter/stream] generation error:", error);
          const payload = JSON.stringify({
            error: "Failed to generate cover letter",
            done: true,
          });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    aiGate?.refund();
    console.error("Cover letter stream error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate cover letter" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

function generateBasicCoverLetter(
  profile: {
    contact: { name?: string };
    summary?: string;
    experiences: { title: string; company: string }[];
    skills: { name: string }[];
  },
  job: { title: string; company: string },
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
