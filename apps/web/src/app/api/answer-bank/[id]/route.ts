import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import {
  deleteAnswerBankEntry,
  updateAnswerBankEntry,
} from "@/lib/db/answer-bank";
import { updateAnswerSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;
    const parsed = await parseJsonBody(request, updateAnswerSchema);
    if (!parsed.ok) return parsed.response;

    const updated = await updateAnswerBankEntry(
      id,
      parsed.data,
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
    const deleted = await deleteAnswerBankEntry(id, authResult.userId);

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
