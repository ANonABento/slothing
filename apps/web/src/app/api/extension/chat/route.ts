/**
 * @route POST /api/extension/chat
 * @description Stream a one-shot AI chat response for the Columbus inline
 * assistant (P4 #40). Accepts `{prompt, jobContext}` from the extension's
 * job-page sidebar and streams tokens via SSE. There is no conversational
 * history in v1 — each call is fresh.
 *
 * @auth X-Extension-Token (mirrors /api/extension/auth/verify + the
 * answer-bank match route).
 * @rateLimit 5 calls per day per user, sliding window. On hit we return 429
 * with the same `{error}` shape used elsewhere so the extension's
 * `messageForError` (#28) can map it cleanly.
 *
 * @response Server-Sent Events:
 *   - `data: {"token": "..."}` per token chunk
 *   - `data: {"done": true}` at end of stream
 *   - `data: {"error": "..."}` on mid-stream failure (still ends the stream)
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthError, requireUserAuth } from "@/lib/auth";
import { getProfile, getLLMConfig } from "@/lib/db";
import { LLMClient } from "@/lib/llm/client";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MAX_CALLS_PER_DAY = 5;

const jobContextSchema = z
  .object({
    title: z.string().trim().optional(),
    company: z.string().trim().optional(),
    location: z.string().trim().optional(),
    description: z.string().trim().optional(),
    requirements: z.array(z.string()).optional(),
    url: z.string().url().optional(),
    sourceJobId: z.string().trim().optional(),
  })
  .partial();

const chatRequestSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required.").max(4000),
  jobContext: jobContextSchema.optional(),
});

export async function POST(request: NextRequest) {
  const authResult = await requireUserAuth(request);
  if (isAuthError(authResult)) return authResult;

  // 5 calls/day/user, sliding window, keyed under a dedicated bucket so this
  // doesn't share the standard LLM bucket with Studio/cover-letter generation.
  const rateLimit = checkRateLimit(`user:${authResult.userId}:extension-chat`, {
    windowMs: ONE_DAY_MS,
    maxRequests: MAX_CALLS_PER_DAY,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "Daily AI assistant limit reached. Try again tomorrow.",
        resetAt: rateLimit.resetAt,
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid chat request.",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  const { prompt, jobContext } = parsed.data;

  const profile = getProfile(authResult.userId);
  const llmConfig = getLLMConfig(authResult.userId);

  if (!llmConfig) {
    return NextResponse.json(
      {
        error:
          "No LLM provider configured. Go to Settings to set one up.",
      },
      { status: 400 },
    );
  }

  const profileSummary = buildProfileSummary(profile);
  const systemPrompt = buildSystemPrompt(profileSummary, jobContext);
  const client = new LLMClient(llmConfig);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const generator = client.stream({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.6,
          maxTokens: 600,
        });

        for await (const chunk of generator) {
          if (!chunk) continue;
          const data = JSON.stringify({ token: chunk });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }

        controller.enqueue(encoder.encode(`data: {"done":true}\n\n`));
        controller.close();
      } catch (error) {
        // Log internally — never echo error.message; LLM SDKs sometimes
        // include API keys or request IDs in error strings.
        console.error("[extension/chat] generation error:", error);
        const payload = JSON.stringify({
          error: "Failed to generate response",
        });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        controller.enqueue(encoder.encode(`data: {"done":true}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

interface ProfileLike {
  contact?: { name?: string; email?: string };
  summary?: string;
  experiences?: Array<{
    title: string;
    company: string;
    description?: string;
  }>;
  skills?: Array<{ name: string }>;
}

export function buildProfileSummary(profile: ProfileLike | null): string {
  if (!profile) {
    return "Profile: not connected. Be honest about not having profile data and ask the user to upload a resume.";
  }
  const name = profile.contact?.name ?? "Candidate";
  const summary = profile.summary?.trim() || "(no summary)";
  const experiences = (profile.experiences ?? [])
    .slice(0, 4)
    .map((e) => {
      const desc = e.description?.trim().slice(0, 240) || "";
      return `- ${e.title} at ${e.company}${desc ? `: ${desc}` : ""}`;
    })
    .join("\n");
  const skills =
    (profile.skills ?? [])
      .slice(0, 25)
      .map((s) => s.name)
      .join(", ") || "(no skills listed)";

  return [
    `Name: ${name}`,
    `Summary: ${summary}`,
    `Recent experience:\n${experiences || "(none)"}`,
    `Skills: ${skills}`,
  ].join("\n\n");
}

interface JobContextLike {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  requirements?: string[];
}

export function buildSystemPrompt(
  profileSummary: string,
  jobContext: JobContextLike | undefined,
): string {
  const job = jobContext ?? {};
  const jobLines = [
    job.title ? `Title: ${job.title}` : null,
    job.company ? `Company: ${job.company}` : null,
    job.location ? `Location: ${job.location}` : null,
    job.description
      ? `Description (truncated):\n${job.description.slice(0, 2400)}`
      : null,
    job.requirements?.length
      ? `Requirements: ${job.requirements.slice(0, 10).join("; ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are Slothing's inline job-application assistant. The user is currently viewing a job page in their browser. Use ONLY the profile and job context below — do not invent experience, employers, or credentials.

PROFILE:
${profileSummary}

JOB CONTEXT:
${jobLines || "(no job context provided)"}

Style: warm, specific, and concrete. Keep responses tight (4 sentences for a pitch, one paragraph for a cover-letter opener). Do not use markdown headers or bullet lists unless explicitly asked.`;
}
