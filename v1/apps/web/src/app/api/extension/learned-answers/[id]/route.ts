import { nowDate, toIso } from "@/lib/format/time";
/**
 * @route PATCH /api/extension/learned-answers/[id]
 * @route DELETE /api/extension/learned-answers/[id]
 * @description Update or delete a learned answer by ID
 * @auth Extension token
 * @request { answer?: string, question?: string } (PATCH)
 * @response Updated or deleted learned answer
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { db, answerBank, eq, and } from "@/lib/db";
import { ensureAnswerBankSchema } from "@/lib/db/answer-bank-schema";

// PATCH - Update a learned answer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    await ensureAnswerBankSchema(db);
    const { id } = await params;
    const body = await request.json();
    const { answer } = body as { answer: string };

    if (!answer) {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 },
      );
    }

    // Verify ownership
    const existingRows = await db
      .select()
      .from(answerBank)
      .where(
        and(eq(answerBank.id, id), eq(answerBank.userId, authResult.userId)),
      )
      .limit(1);
    const existing = existingRows[0];

    if (!existing) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // Update
    const now = nowDate();
    await db
      .update(answerBank)
      .set({ answer, updatedAt: toIso(now) })
      .where(
        and(eq(answerBank.id, id), eq(answerBank.userId, authResult.userId)),
      );

    return NextResponse.json({
      id,
      question: existing.question,
      questionNormalized: existing.questionNormalized,
      answer,
      source: existing.source,
      sourceUrl: existing.sourceUrl,
      sourceCompany: existing.sourceCompany,
      timesUsed: existing.timesUsed ?? 1,
      updatedAt: toIso(now),
    });
  } catch (error) {
    console.error("Update answer error:", error);
    return NextResponse.json(
      { error: "Failed to update answer" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a learned answer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    await ensureAnswerBankSchema(db);
    const { id } = await params;

    const deleted = await db
      .delete(answerBank)
      .where(
        and(eq(answerBank.id, id), eq(answerBank.userId, authResult.userId)),
      )
      .returning({ id: answerBank.id });

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete answer error:", error);
    return NextResponse.json(
      { error: "Failed to delete answer" },
      { status: 500 },
    );
  }
}
