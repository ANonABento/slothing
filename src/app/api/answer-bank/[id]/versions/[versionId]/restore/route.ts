import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { getAnswerVersion } from "@/lib/db/learned-answer-versions";
import { updateLearnedAnswer } from "@/lib/db/learned-answers";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id, versionId } = await params;
    const version = await getAnswerVersion(authResult.userId, versionId);
    if (!version || version.answerId !== id) {
      return NextResponse.json(
        { error: "Answer version not found" },
        { status: 404 },
      );
    }

    const restored = await updateLearnedAnswer(
      id,
      {
        question: version.question,
        answer: version.answer,
        sourceUrl: version.sourceUrl,
        sourceCompany: version.sourceCompany,
      },
      authResult.userId,
    );

    if (!restored) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json(restored);
  } catch (error) {
    console.error("Answer bank version restore error:", error);
    return NextResponse.json(
      { error: "Failed to restore answer version" },
      { status: 500 },
    );
  }
}
