/**
 * @route POST /api/documents/upload/review
 * @description Persist a resume and return parser-v2 review draft data without bank side effects
 * @auth Required
 */
import { NextRequest, NextResponse } from "next/server";
import { parseSearchParams } from "@/lib/api-utils";
import { requireAuth, isAuthError } from "@/lib/auth";
import { DocumentUploadError } from "@/lib/ingest/document-upload";
import { createParserV2UploadReview } from "@/lib/ingest/parser-v2-upload-review";
import { uploadQuerySchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

function nextUrls(documentId: string, parseRunId?: string) {
  return {
    sourceMapUrl: parseRunId
      ? `/api/documents/${encodeURIComponent(documentId)}/source-map?parseRunId=${encodeURIComponent(parseRunId)}`
      : `/api/documents/${encodeURIComponent(documentId)}/source-map`,
    commitUrl: parseRunId
      ? `/api/bank/imports/${encodeURIComponent(parseRunId)}/commit`
      : undefined,
  };
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const query = parseSearchParams(
    request.nextUrl.searchParams,
    uploadQuerySchema,
  );
  if (!query.ok) return query.response;

  try {
    const formData = await request.formData();
    const result = await createParserV2UploadReview({
      file: formData.get("file") as File,
      userId: authResult.userId,
      documentType: formData.get("type") ?? formData.get("documentType"),
      replaceExisting: query.data.force,
    });

    if (result.upload.duplicate) {
      return NextResponse.json(
        {
          error: "Duplicate file upload",
          existing: {
            id: result.document.id,
            filename: result.document.filename,
            uploaded_at: result.document.uploadedAt,
            uploadedAt: result.document.uploadedAt,
            type: result.document.type,
            size: result.document.size,
          },
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        document: result.document,
        artifact: result.artifact,
        parseRun: result.parseRun,
        entries: result.entries,
        sourceText: result.sourceText,
        sourceRefs: result.sourceRefs,
        diagnostic: result.diagnostic,
        replacedDocumentId: result.upload.replacedDocumentId,
        next: nextUrls(result.document.id, result.parseRun?.id),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof DocumentUploadError) {
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status },
      );
    }
    console.error("Parser-v2 upload review error:", error);
    return NextResponse.json(
      { error: "Failed to create parser-v2 upload review" },
      { status: 500 },
    );
  }
}
