import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { duplicateLearnedAnswer } from "@/lib/db/learned-answers";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const duplicated = await duplicateLearnedAnswer(id, authResult.userId);

    if (!duplicated) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json(duplicated, { status: 201 });
  } catch (error) {
    console.error("Answer bank duplicate error:", error);
    return NextResponse.json(
      { error: "Failed to duplicate answer" },
      { status: 500 },
    );
  }
}
