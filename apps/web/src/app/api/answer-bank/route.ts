import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  listLearnedAnswers,
  upsertLearnedAnswer,
} from "@/lib/db/learned-answers";
import { createAnswerSchema } from "@/lib/schemas";

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
    const parsed = await parseJsonBody(request, createAnswerSchema);
    if (!parsed.ok) return parsed.response;

    const saved = await upsertLearnedAnswer(parsed.data, authResult.userId);

    return NextResponse.json(saved, { status: saved.updated ? 200 : 201 });
  } catch (error) {
    console.error("Answer bank save error:", error);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 },
    );
  }
}
