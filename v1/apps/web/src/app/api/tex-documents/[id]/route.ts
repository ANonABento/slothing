/**
 * @route GET /api/tex-documents/[id]
 * @description Fetch one document including its .tex source.
 * @route PATCH /api/tex-documents/[id]
 * @description Update the source (snapshotting the previous one) or rename.
 * @route DELETE /api/tex-documents/[id]
 * @description Delete a document and its version history.
 * @auth Required
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { isAuthError, requireAuth } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import {
  deleteTexDocument,
  getTexDocument,
  listTexDocumentVersions,
  renameTexDocument,
  updateTexDocumentSource,
} from "@/lib/db/tex-documents";

export const dynamic = "force-dynamic";

const patchSchema = z
  .object({
    source: z.string().min(1).optional(),
    title: z.string().min(1).max(200).optional(),
    label: z.string().max(120).optional(),
  })
  .refine((v) => v.source !== undefined || v.title !== undefined, {
    message: "Provide `source` or `title`.",
  });

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

  const includeVersions =
    request.nextUrl.searchParams.get("versions") === "true";
  const versions = includeVersions
    ? await listTexDocumentVersions(params.id, auth.userId)
    : undefined;

  return NextResponse.json(versions ? { document, versions } : { document });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const parsed = await parseJsonBody(request, patchSchema);
  if (!parsed.ok) return parsed.response;

  let document = await getTexDocument(params.id, auth.userId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (parsed.data.title) {
    document =
      (await renameTexDocument(params.id, auth.userId, parsed.data.title)) ??
      document;
  }
  if (parsed.data.source) {
    document =
      (await updateTexDocumentSource(
        params.id,
        auth.userId,
        parsed.data.source,
        parsed.data.label,
      )) ?? document;
  }

  return NextResponse.json({ document });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const deleted = await deleteTexDocument(params.id, auth.userId);
  if (!deleted) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
