/**
 * @route DELETE /api/bank/documents/[id]
 * @description Delete source document and cascade delete bank chunks
 * @auth Required
 * @response BankDocumentDeleteResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { db, documents, profileBank, eq, and } from "@/lib/db/drizzle";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const deletedChunks = await db
      .delete(profileBank)
      .where(and(
        eq(profileBank.sourceDocumentId, params.id),
        eq(profileBank.userId, authResult.userId)
      ))
      .returning({ id: profileBank.id });

    await db
      .delete(documents)
      .where(and(eq(documents.id, params.id), eq(documents.userId, authResult.userId)));

    const chunksDeleted = deletedChunks.length;
    return NextResponse.json({ success: true, chunksDeleted });
  } catch (error) {
    console.error("Delete source document error:", error);
    return NextResponse.json(
      { error: "Failed to delete source document" },
      { status: 500 }
    );
  }
}
