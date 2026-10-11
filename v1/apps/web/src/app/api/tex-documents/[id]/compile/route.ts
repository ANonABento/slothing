/**
 * @route POST /api/tex-documents/[id]/compile
 * @description Compile a document and return its parsed log plus the span hit map.
 * @auth Required
 *
 * The PDF bytes are not returned here — they are written to the content-addressed cache
 * and fetched from GET /api/tex-documents/[id]/pdf, so the editor can re-render without
 * shipping the PDF through JSON.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { isAuthError, requireAuth } from "@/lib/auth";
import { parseOptionalJsonBody } from "@/lib/api-utils";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";
import { getTexDocument } from "@/lib/db/tex-documents";
import {
  CompileError,
  EngineUnavailableError,
  compile,
} from "@/lib/latex/compile";
import { cacheKey, writeCachedJson, writeCachedPdf } from "@/lib/latex/cache";
import type { HitMap } from "@/lib/latex/hitmap";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  mode: z.enum(["preview", "export"]).default("preview"),
  /** Compile unsaved editor content without persisting it first. */
  source: z.string().min(1).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  // Compiling spawns a process; it gets the same treatment as an LLM route.
  const limit = rateLimiters.standard(
    getClientIdentifier(request, auth.userId),
  );
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Too many compiles. Please try again shortly.",
        code: "rate_limited",
      },
      { status: 429 },
    );
  }

  const parsed = await parseOptionalJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;

  const document = await getTexDocument(params.id, auth.userId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const source = parsed.data.source ?? document.source;
  const mode = parsed.data.mode;
  const key = cacheKey(source, mode);

  try {
    const result = await compile({ source, mode });
    await writeCachedPdf(key, result.pdf);
    if (result.hitMap) await writeCachedJson(key, result.hitMap);

    return NextResponse.json({
      ok: true,
      key,
      log: result.log,
      hitMap: (result.hitMap ?? null) as HitMap | null,
    });
  } catch (error) {
    if (error instanceof EngineUnavailableError) {
      // Not a failure of the document — the deployment has no engine. The client offers
      // the Overleaf bundle instead of pretending the compile broke.
      return NextResponse.json(
        { ok: false, code: "engine_unavailable", error: error.message },
        { status: 503 },
      );
    }
    if (error instanceof CompileError) {
      return NextResponse.json(
        {
          ok: false,
          code: "compile_failed",
          error: error.message,
          log: error.log,
        },
        { status: 422 },
      );
    }
    throw error;
  }
}
