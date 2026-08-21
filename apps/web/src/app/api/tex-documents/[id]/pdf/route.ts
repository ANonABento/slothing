/**
 * @route GET /api/tex-documents/[id]/pdf
 * @description Serve a document's compiled PDF.
 * @auth Required
 *
 * Bytes are served ONLY through this authed, user-scoped route. The cache lives outside
 * `public/`, so a cache path is never itself an access grant — the failure mode of the
 * route this rebuild deleted.
 */
import { NextResponse, type NextRequest } from "next/server";

import { isAuthError, requireAuth } from "@/lib/auth";
import { getTexDocument } from "@/lib/db/tex-documents";
import { cacheKey, readCachedPdf, writeCachedPdf } from "@/lib/latex/cache";
import {
  CompileError,
  EngineUnavailableError,
  compile,
  type CompileMode,
} from "@/lib/latex/compile";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const document = await getTexDocument(params.id, auth.userId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const requested = request.nextUrl.searchParams.get("mode");
  const mode: CompileMode = requested === "preview" ? "preview" : "export";
  const download = request.nextUrl.searchParams.get("download") === "true";
  const key = cacheKey(document.source, mode);

  let pdf = await readCachedPdf(key);
  if (!pdf) {
    try {
      const result = await compile({ source: document.source, mode });
      pdf = result.pdf;
      await writeCachedPdf(key, pdf);
    } catch (error) {
      if (error instanceof EngineUnavailableError) {
        return NextResponse.json(
          { error: error.message, code: "engine_unavailable" },
          { status: 503 },
        );
      }
      if (error instanceof CompileError) {
        return NextResponse.json(
          { error: error.message, code: "compile_failed", log: error.log },
          { status: 422 },
        );
      }
      throw error;
    }
  }

  const safeTitle =
    document.title.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "document";

  return new NextResponse(pdf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.byteLength),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${safeTitle}.pdf"`,
      // Content-addressed: the same key can only ever mean the same bytes.
      ETag: `"${key}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
