import { NextRequest, NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  listLearnedAnswers,
  upsertLearnedAnswer,
} from "@/lib/db/learned-answers";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const answers = await listLearnedAnswers(authResult.userId);
    return NextResponse.json({ answers });
  } catch (error) {
    console.error("Answer bank fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch answer bank" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const question =
      typeof body.question === "string" ? body.question.trim() : "";
    const answer = typeof body.answer === "string" ? body.answer.trim() : "";
    const sourceUrl =
      typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : undefined;
    const sourceCompany =
      typeof body.sourceCompany === "string"
        ? body.sourceCompany.trim()
        : undefined;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 },
      );
    }

    const saved = await upsertLearnedAnswer(
      { question, answer, sourceUrl, sourceCompany },
      authResult.userId,
    );

    return NextResponse.json(saved, { status: saved.updated ? 200 : 201 });
  } catch (error) {
    console.error("Answer bank save error:", error);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 },
    );
  }
}
