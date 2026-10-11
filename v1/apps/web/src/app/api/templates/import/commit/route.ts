import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAuth, isAuthError } from "@/lib/auth";
import { saveResumeTemplate } from "@/lib/db/resume-templates";
import {
  resumeDocumentModelSchema,
  resumeTemplateSchema,
} from "@slothing/shared/resume-template";

/**
 * @route POST /api/templates/import/commit
 * @description Commit the ACCEPTED (preview+nudged) template into the single collapsed
 *   store (spec §3 Decision 4 / Phase 4). Body carries the final (grammar+tokens)
 *   template and optional RDM content draft. This is the accept gate of the trust loop.
 * @auth Required
 */

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  template: resumeTemplateSchema,
  rdm: resumeDocumentModelSchema.optional(),
  name: z.string().min(1).optional(),
  sourceFilename: z.string().optional(),
  sourceType: z.enum(["pdf", "docx", "tex"]).optional(),
  /** Preferred PDF export engine chosen in the import dialog (Phase C follow-up). */
  engine: z.enum(["html", "typst"]).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "bad_request" },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid template payload.",
        code: "validation_error",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const saved = saveResumeTemplate(auth.userId, {
    template: parsed.data.template,
    rdm: parsed.data.rdm ?? null,
    name: parsed.data.name,
    sourceFilename: parsed.data.sourceFilename ?? null,
    sourceType: parsed.data.sourceType ?? null,
    exportEngine: parsed.data.engine ?? null,
  });

  return NextResponse.json({
    id: saved.id,
    name: saved.name,
    template: saved.template,
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
  });
}
