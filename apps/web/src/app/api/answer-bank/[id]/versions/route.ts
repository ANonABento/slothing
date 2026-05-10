import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { getLearnedAnswer } from "@/lib/db/learned-answers";
import { listAnswerVersions } from "@/lib/db/learned-answer-versions";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const answer = await getLearnedAnswer(id, authResult.userId);
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    const versions = await listAnswerVersions(authResult.userId, id);
    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Answer bank versions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch answer history" },
      { status: 500 },
    );
  }
}
