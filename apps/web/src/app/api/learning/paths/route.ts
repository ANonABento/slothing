/**
 * @route GET /api/learning/paths
 * @description Generate personalized learning paths based on profile and job targets
 * @auth Required
 * @response LearningPathsResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/db";
import { getJobs } from "@/lib/db/jobs";
import {
  gateAiFeature,
  isAiGateResponse,
  type AiGatePass,
} from "@/lib/billing/ai-gate";
import {
  generateLearningPaths,
  enhanceLearningPathsWithLLM,
} from "@/lib/learning/skill-paths";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: AiGatePass | null = null;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const enhance = searchParams.get("enhance") === "true";

    const profile = getProfile(authResult.userId);
    if (!profile) {
      return NextResponse.json(
        { error: "No profile found. Please upload your resume first." },
        { status: 404 },
      );
    }

    const jobs = getJobs(authResult.userId);
    if (jobs.length === 0) {
      return NextResponse.json({
        paths: [],
        totalEstimatedWeeks: 0,
        quickWins: [],
        strategicSkills: [],
        insights: ["Add some jobs to identify skill gaps and learning paths!"],
      });
    }

    let result = generateLearningPaths(profile, jobs, limit);

    // Optionally enhance with LLM for better resource suggestions
    if (enhance && result.paths.length > 0) {
      const gate = await gateAiFeature(
        authResult.userId,
        "document_assistant",
        `learning:${limit}`,
      );
      if (isAiGateResponse(gate)) return gate;
      aiGate = gate;
      result = {
        ...result,
        paths: await enhanceLearningPathsWithLLM(result.paths, gate.llmConfig),
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    aiGate?.refund();
    console.error("Learning paths error:", error);
    return NextResponse.json(
      { error: "Failed to generate learning paths" },
      { status: 500 },
    );
  }
}
