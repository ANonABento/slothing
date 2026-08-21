/**
 * @route GET /api/tex-documents
 * @description List the current user's LaTeX documents.
 * @route POST /api/tex-documents
 * @description Create one, either from structured content or from raw .tex source.
 * @auth Required
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { isAuthError, requireAuth } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import {
  createTexDocument,
  listTexDocuments,
  type TexDocumentKind,
} from "@/lib/db/tex-documents";
import {
  generateCoverLetterTex,
  generateResumeTex,
} from "@/lib/latex/generate";
import { settingsSchema } from "@/lib/latex/settings";

export const dynamic = "force-dynamic";

const entrySchema = z.object({
  organisation: z.string(),
  role: z.string(),
  dates: z.string(),
  bullets: z.array(z.string()).default([]),
});

const createSchema = z.object({
  kind: z.enum(["resume", "cv", "cover_letter"]).default("resume"),
  title: z.string().min(1).max(200),
  templateId: z.string().min(1).optional(),
  opportunityId: z.string().min(1).optional(),
  settings: settingsSchema.partial().optional(),
  /** Raw source wins when supplied — an imported .tex is used verbatim. */
  source: z.string().min(1).optional(),
  content: z
    .object({
      name: z.string(),
      contact: z.string(),
      sections: z
        .array(
          z.object({
            title: z.string(),
            text: z.string().optional(),
            entries: z.array(entrySchema).optional(),
          }),
        )
        .optional(),
      paragraphs: z.array(z.string()).optional(),
    })
    .optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const kindParam = request.nextUrl.searchParams.get("kind");
  const kind =
    kindParam === "resume" || kindParam === "cv" || kindParam === "cover_letter"
      ? (kindParam as TexDocumentKind)
      : undefined;

  const documents = await listTexDocuments(auth.userId, kind);
  // The source can be large; a list view never needs it.
  return NextResponse.json({
    documents: documents.map(({ source: _source, ...rest }) => rest),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const parsed = await parseJsonBody(request, createSchema);
  if (!parsed.ok) return parsed.response;

  const input = parsed.data;
  let source = input.source;

  if (!source) {
    if (!input.content) {
      return NextResponse.json(
        { error: "Provide either `source` or `content`." },
        { status: 400 },
      );
    }
    source =
      input.kind === "cover_letter"
        ? generateCoverLetterTex({
            name: input.content.name,
            contact: input.content.contact,
            paragraphs: input.content.paragraphs ?? [],
            settings: input.settings,
          })
        : generateResumeTex({
            name: input.content.name,
            contact: input.content.contact,
            sections: input.content.sections ?? [],
            settings: input.settings,
          });
  }

  const document = await createTexDocument({
    userId: auth.userId,
    kind: input.kind,
    title: input.title,
    source,
    templateId: input.templateId ?? null,
    opportunityId: input.opportunityId ?? null,
  });

  return NextResponse.json({ document }, { status: 201 });
}
