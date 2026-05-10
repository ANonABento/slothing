/**
 * @route GET /api/documents
 * @description List all uploaded documents
 * @auth Required
 * @response DocumentsListResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth";
import { listDocumentsPaginated } from "@/lib/db";
import { documentTypeSchema } from "@/lib/constants/documents";
import {
  buildPaginationResult,
  decodeCursor,
  InvalidCursorError,
  PaginationParamsSchema,
} from "@/lib/pagination";

export const dynamic = "force-dynamic";

const documentsCursorSchema = z.object({
  lastId: z.string(),
  lastCreatedAt: z.string(),
});

const documentsQuerySchema = PaginationParamsSchema.extend({
  type: documentTypeSchema.optional(),
});

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = documentsQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const cursor = decodeCursor(parsed.data.cursor, documentsCursorSchema);
    const rows = listDocumentsPaginated({
      userId: authResult.userId,
      type: parsed.data.type,
      cursor,
      limit: parsed.data.limit,
    });
    const page = buildPaginationResult(rows, parsed.data.limit, (document) => ({
      lastId: document.id,
      lastCreatedAt: document.uploadedAt,
    }));

    return NextResponse.json({
      documents: page.items,
      items: page.items,
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    });
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }
    console.error("Get documents error:", error);
    return NextResponse.json(
      { error: "Failed to get documents" },
      { status: 500 },
    );
  }
}
