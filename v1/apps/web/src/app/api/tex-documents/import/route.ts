/**
 * @route POST /api/tex-documents/import
 * @description Import a .tex file as a Slothing document.
 * @auth Required
 *
 * The wedge (spec §9.1): paste your Overleaf résumé and it renders exactly as it does
 * today, because it is still your document. Nothing is reinterpreted or restyled.
 *
 * The import COMPILES the document before accepting it. A file that does not compile is
 * rejected with the reason rather than saved as a document that can never render — the
 * user finds out now, not when they next open it.
 */
import { NextResponse, type NextRequest } from "next/server";

import { isAuthError, requireAuth } from "@/lib/auth";
import {
  createTexDocument,
  type TexDocumentKind,
} from "@/lib/db/tex-documents";
import { nowEpoch } from "@/lib/format/time";
import {
  CompileError,
  EngineUnavailableError,
  compile,
} from "@/lib/latex/compile";
import { cacheKey, writeCachedPdf } from "@/lib/latex/cache";
import {
  assessImport,
  assessImportability,
  explainCompileFailure,
  titleFromFilename,
} from "@/lib/latex/import";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/** Compiling an unknown document is more expensive than compiling one of ours. */
const IMPORT_TIMEOUT_MS = 45_000;

function isUploadedFile(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    typeof (value as File).arrayBuffer === "function"
  );
}

function kindFrom(value: unknown): TexDocumentKind {
  return value === "cv" || value === "cover_letter" ? value : "resume";
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const limit = rateLimiters.standard(
    getClientIdentifier(request, auth.userId),
  );
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "Too many imports. Please try again shortly.",
        code: "rate_limited",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(
            1,
            Math.ceil((limit.resetAt - nowEpoch()) / 1000),
          ).toString(),
        },
      },
    );
  }

  let source: string;
  let filename: string | undefined;
  let title: string | undefined;
  let kind: TexDocumentKind = "resume";

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (!isUploadedFile(file)) {
      return NextResponse.json(
        { error: "A .tex file is required.", code: "missing_file" },
        { status: 400 },
      );
    }
    source = await file.text();
    filename = file.name;
    const providedTitle = form.get("title");
    title = typeof providedTitle === "string" ? providedTitle : undefined;
    kind = kindFrom(form.get("kind"));
  } else {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (typeof body.source !== "string") {
      return NextResponse.json(
        { error: "A .tex source is required.", code: "missing_source" },
        { status: 400 },
      );
    }
    source = body.source;
    filename = typeof body.filename === "string" ? body.filename : undefined;
    title = typeof body.title === "string" ? body.title : undefined;
    kind = kindFrom(body.kind);
  }

  const rejection = assessImportability(source, filename);
  if (rejection) {
    return NextResponse.json(
      { error: rejection.message, code: rejection.code },
      { status: 400 },
    );
  }

  const assessment = assessImport(source);

  // Prove it renders before we keep it. `allowFetch` is on because an imported document
  // may legitimately need a package our warm bundle has never seen; see CompileInput.
  try {
    const result = await compile({
      source,
      mode: "export",
      allowFetch: true,
      timeoutMs: IMPORT_TIMEOUT_MS,
    });
    await writeCachedPdf(cacheKey(source, "export"), result.pdf);
  } catch (error) {
    if (error instanceof EngineUnavailableError) {
      return NextResponse.json(
        {
          error:
            "This server has no LaTeX engine, so an import cannot be verified. Install Tectonic to enable imports.",
          code: "engine_unavailable",
        },
        { status: 503 },
      );
    }
    if (error instanceof CompileError) {
      const explanation = explainCompileFailure(error.log.raw);
      return NextResponse.json(
        {
          error:
            explanation ??
            "That document did not compile, so it was not imported.",
          code: "compile_failed",
          log: error.log,
          packages: assessment.packages,
        },
        { status: 422 },
      );
    }
    throw error;
  }

  const document = await createTexDocument({
    userId: auth.userId,
    kind,
    title: title?.trim() || titleFromFilename(filename),
    source,
  });

  return NextResponse.json(
    {
      document,
      /**
       * False for a third-party .tex. It compiles, previews, and downloads, but has no
       * addressable spans until it is annotated — the client says so rather than
       * presenting an empty inspector with no explanation.
       */
      annotated: assessment.annotated,
      spanCount: assessment.spanCount,
      packages: assessment.packages,
    },
    { status: 201 },
  );
}
