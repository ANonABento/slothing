/**
 * @route GET /api/bank/documents/[id]/pdf
 * @description Stream a cached PDF blob for the review-modal preview tab.
 *   The bytes are held in an in-memory TTL cache populated at upload time
 *   (see `src/lib/parse/pdf-cache.ts`). Scope: per-user.
 * @auth Required
 */
import { NextRequest, NextResponse } from "next/server";

import { requireAuth, isAuthError } from "@/lib/auth";
import { getCachedPdfBytes } from "@/lib/parse/pdf-cache";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const documentId = params.id;
  if (!documentId) {
    return NextResponse.json({ error: "Missing document id" }, { status: 400 });
  }

  const cached = getCachedPdfBytes(documentId, authResult.userId);
  if (!cached) {
    return NextResponse.json(
      { error: "Preview not available" },
      { status: 404 },
    );
  }

  return new NextResponse(new Uint8Array(cached.bytes), {
    headers: {
      "Content-Type": cached.contentType,
      "Content-Length": String(cached.bytes.byteLength),
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
