import { NextRequest, NextResponse } from "next/server";

import { requireAuth, isAuthError } from "@/lib/auth";
import { getClientIdentifier, rateLimiters } from "@/lib/rate-limit";
import { nowEpoch } from "@/lib/format/time";
import { getTemplateSourceType } from "@/lib/templates/import";
import { pdfBufferToGeometry } from "@/lib/resume/pdf-geometry";
import {
  DEFAULT_TEMPLATES,
  extractRdmFromXmp,
  extractResume,
} from "@slothing/shared/resume-template";

/**
 * @route POST /api/templates/import
 * @description Clone a resume's STYLE into the collapsed (grammar+tokens) model and
 *   draft its content (spec §3 / Phase 4). Pipeline: XMP self-import (lossless RDM
 *   restore from our own exports) → else deterministic fingerprint + OpenResume content
 *   extraction. Scanned/image PDFs route to manual template pick. Returns a preview
 *   payload for the import dialog's preview+nudge+accept loop; nothing is committed here.
 * @auth Required
 */

export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function isUploadedFile(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    typeof (value as File).arrayBuffer === "function"
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const rateLimit = rateLimiters.standard(
    getClientIdentifier(request, auth.userId),
  );
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many template import requests.", code: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.max(
            1,
            Math.ceil((rateLimit.resetAt - nowEpoch()) / 1000),
          ).toString(),
        },
      },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!isUploadedFile(file)) {
      return NextResponse.json(
        { error: "A PDF file is required.", code: "missing_file" },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File is too large (max 10MB).", code: "file_too_large" },
        { status: 400 },
      );
    }

    const sourceType = getTemplateSourceType(file.name, file.type);
    if (sourceType !== "pdf") {
      // Non-PDF (docx/tex): no geometry pipeline — route to manual template pick.
      return NextResponse.json({
        route: "manual",
        scanned: false,
        rdm: null,
        fingerprint: null,
        classification: null,
        suggestedTemplate: DEFAULT_TEMPLATES[0],
        unknownHeaders: [],
        sourceFilename: file.name,
        sourceType,
      });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    // Fast path: our own export carries the RDM in XMP — restore it losslessly.
    const selfImport = extractRdmFromXmp(bytes);
    if (selfImport) {
      return NextResponse.json({
        route: "self-import",
        scanned: false,
        rdm: selfImport,
        fingerprint: null,
        classification: null,
        suggestedTemplate: DEFAULT_TEMPLATES[0],
        unknownHeaders: [],
        sourceFilename: file.name,
        sourceType,
      });
    }

    const geometry = await pdfBufferToGeometry(Buffer.from(bytes));
    const result = await extractResume(geometry);
    return NextResponse.json({
      ...result,
      sourceFilename: file.name,
      sourceType,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to import resume.",
        code: "import_failed",
      },
      { status: 500 },
    );
  }
}
