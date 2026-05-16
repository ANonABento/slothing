/**
 * @route POST /api/resume/generate
 * @description Generate a tailored resume from the knowledge bank
 * @auth Required
 * @request { jobId: string, options?: { tone?: string, length?: string } }
 * @response ResumeGenerateResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth";
import {
  gateAiFeature,
  isAiGateResponse,
  type AiGatePass,
} from "@/lib/billing/ai-gate";
import {
  saveGeneratedResume,
  STANDALONE_RESUME_JOB_ID,
} from "@/lib/db/resumes";
import { runRetrievalPipeline } from "@/lib/knowledge/retrieval";

export const dynamic = "force-dynamic";

const generateResumeSchema = z.object({
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  templateId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: AiGatePass | null = null;

  try {
    const body = await request.json();
    const parsed = generateResumeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          errors: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }

    const { jobDescription, templateId } = parsed.data;

    const gate = await gateAiFeature(
      authResult.userId,
      "tailor",
      `resume:${templateId ?? "retrieval"}`,
    );
    if (isAiGateResponse(gate)) return gate;
    aiGate = gate;

    // Run the retrieval pipeline
    const result = await runRetrievalPipeline(
      jobDescription,
      authResult.userId,
      gate.llmConfig,
    );

    // Save generated resume to database
    const savedResume = saveGeneratedResume(
      STANDALONE_RESUME_JOB_ID,
      templateId || "retrieval",
      result.resume,
      "", // No HTML path yet — can be generated separately
      undefined,
      authResult.userId,
    );

    return NextResponse.json({
      success: true,
      resume: result.resume,
      gaps: result.gaps,
      chunksUsed: result.chunks.length,
      queryCount: result.queryCount,
      savedResume: {
        id: savedResume.id,
        createdAt: savedResume.createdAt,
      },
    });
  } catch (error) {
    aiGate?.refund();
    console.error(
      "Resume generation error:",
      error instanceof Error ? error.stack : error,
    );
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 },
    );
  }
}
