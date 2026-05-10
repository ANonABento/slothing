import { NextRequest, NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  deleteLearnedAnswer,
  updateLearnedAnswer,
} from "@/lib/db/learned-answers";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const body = await request.json();
    const question =
      typeof body.question === "string" ? body.question.trim() : undefined;
    const answer =
      typeof body.answer === "string" ? body.answer.trim() : undefined;
    const sourceUrl =
      typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : undefined;
    const sourceCompany =
      typeof body.sourceCompany === "string"
        ? body.sourceCompany.trim()
        : undefined;

    if (
      !question &&
      !answer &&
      sourceUrl === undefined &&
      sourceCompany === undefined
    ) {
      return NextResponse.json(
        { error: "No answer fields provided" },
        { status: 400 },
      );
    }

    const updated = await updateLearnedAnswer(
      id,
      { question, answer, sourceUrl, sourceCompany },
      authResult.userId,
    );

    if (!updated) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Answer bank update error:", error);
    return NextResponse.json(
      { error: "Failed to update answer" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const deleted = await deleteLearnedAnswer(id, authResult.userId);

    if (!deleted) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Answer bank delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete answer" },
      { status: 500 },
    );
  }
}
