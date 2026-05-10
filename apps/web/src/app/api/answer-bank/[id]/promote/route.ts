import { NextResponse } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { promoteAnswerBankEntry } from "@/lib/db/answer-bank";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const promoted = await promoteAnswerBankEntry(id, authResult.userId);

    if (!promoted) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json(promoted);
  } catch (error) {
    console.error("Answer bank promote error:", error);
    return NextResponse.json(
      { error: "Failed to promote answer" },
      { status: 500 },
    );
  }
}
