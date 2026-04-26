/**
 * @route GET /api/documents
 * @description List all uploaded documents
 * @auth Required
 * @response DocumentsListResponse from @/types/api
 */
import { NextResponse } from "next/server";
import { db, documents, desc, eq } from "@/lib/db/drizzle";
import { requireAuth, isAuthError } from "@/lib/auth";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const rows = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, authResult.userId))
      .orderBy(desc(documents.uploadedAt));

    return NextResponse.json({
      documents: rows.map((doc) => ({
        id: doc.id,
        filename: doc.filename,
        type: doc.type,
        mimeType: doc.mimeType,
        size: doc.size,
        path: doc.path,
        extractedText: doc.extractedText ?? undefined,
        parsedData: doc.parsedData ? JSON.parse(doc.parsedData) : undefined,
        uploadedAt: doc.uploadedAt?.toISOString() ?? new Date().toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get documents error:", error);
    return NextResponse.json(
      { error: "Failed to get documents" },
      { status: 500 }
    );
  }
}
