/**
 * @route POST /api/interview/sessions/[id]/answer
 * @description Add an answer to a question in the given interview session
 * @auth Required
 * @request { questionIndex: number, answer: string }
 * @response InterviewSessionAnswerResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getInterviewSession,
  addInterviewAnswer,
  completeInterviewSession,
} from "@/lib/db/interviews";
import {
  gateAiFeature,
  isAiGateResponse,
  type AiGatePass,
} from "@/lib/billing/ai-gate";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST - Add an answer to the session
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: AiGatePass | null = null;

  try {
    const { questionIndex, answer } = await request.json();

    if (questionIndex === undefined || !answer) {
      return NextResponse.json(
        { error: "questionIndex and answer are required" },
        { status: 400 },
      );
    }

    const session = getInterviewSession(params.id, authResult.userId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const question = session.questions[questionIndex];

    if (!question) {
      return NextResponse.json(
        { error: "Invalid question index" },
        { status: 400 },
      );
    }

    if (answer === "[skipped]") {
      const savedAnswer = addInterviewAnswer(
        params.id,
        questionIndex,
        answer,
        "",
        authResult.userId,
      );
      const isComplete = questionIndex >= session.questions.length - 1;
      if (isComplete) {
        completeInterviewSession(params.id, authResult.userId);
      }

      return NextResponse.json({
        answer: savedAnswer,
        feedback: "",
        isComplete,
      });
    }

    // Generate feedback using LLM if available
    let feedback = "";
    const gate = gateAiFeature(
      authResult.userId,
      "interview_turn",
      `${params.id}:${questionIndex}`,
    );
    if (isAiGateResponse(gate)) return gate;
    aiGate = gate;
    const promptIntro =
      session.jobId === null
        ? `Provide brief, constructive feedback for this ${session.category || question.category} interview answer. Do not reference a specific role or company.`
        : "Provide brief, constructive feedback for this interview answer.";

    try {
      const client = new LLMClient(gate.llmConfig);
      const response = await client.complete({
        messages: [
          {
            role: "user",
            content: `${promptIntro}

Question: ${question.question}
Category: ${question.category}

Candidate's Answer:
${answer}

Provide feedback in JSON format:
{
  "feedback": "Your constructive feedback here (2-3 sentences max)"
}

Be encouraging but also point out areas for improvement.`,
          },
        ],
        temperature: 0.5,
        maxTokens: 300,
      });

      const parsed = parseJSONFromLLM<{ feedback: string }>(response);
      feedback = parsed.feedback || "";
    } catch (llmError) {
      aiGate?.refund();
      console.error("LLM feedback error:", llmError);
      feedback =
        "Good effort! Consider using the STAR method (Situation, Task, Action, Result) to structure your answers for behavioral questions.";
    }

    // Save the answer
    const savedAnswer = addInterviewAnswer(
      params.id,
      questionIndex,
      answer,
      feedback,
      authResult.userId,
    );

    // Check if interview is complete
    const isComplete = questionIndex >= session.questions.length - 1;
    if (isComplete) {
      completeInterviewSession(params.id, authResult.userId);
    }

    return NextResponse.json({
      answer: savedAnswer,
      feedback,
      isComplete,
    });
  } catch (error) {
    aiGate?.refund();
    console.error("Add answer error:", error);
    return NextResponse.json(
      { error: "Failed to add answer" },
      { status: 500 },
    );
  }
}
