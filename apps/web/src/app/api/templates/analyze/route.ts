/**
 * @route POST /api/templates/analyze
 * @description Analyze a resume template's styling and structure using LLM
 * @auth Required
 * @request { templateContent: string }
 * @response TemplateAnalyzeResponse from @/types/api
 */
import { NextRequest } from "next/server";
import {
  gateAiFeature,
  isAiGateResponse,
  type AiGatePass,
} from "@/lib/billing/ai-gate";
import { analyzeTemplateWithLLM } from "@/lib/resume/template-analyzer";
import { requireAuth, isAuthError } from "@/lib/auth";
import { ApiErrors, successResponse, errorResponse } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: AiGatePass | null = null;

  try {
    const body = await request.json();

    if (!body.text || typeof body.text !== "string") {
      return ApiErrors.badRequest("Resume text is required");
    }

    if (body.text.trim().length < 50) {
      return ApiErrors.badRequest("Resume text is too short to analyze");
    }

    const gate = await gateAiFeature(
      authResult.userId,
      "document_assistant",
      "template-analyze",
    );
    if (isAiGateResponse(gate)) return gate;
    aiGate = gate;

    const analyzed = await analyzeTemplateWithLLM(body.text, authResult.userId);

    return successResponse({
      analyzed,
      usedLLM: true,
    });
  } catch (error) {
    aiGate?.refund();
    console.error("Template analysis error:", error);
    return errorResponse("internal_error", "Failed to analyze template");
  }
}
