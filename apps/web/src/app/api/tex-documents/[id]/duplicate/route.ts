/**
 * @route POST /api/tex-documents/[id]/duplicate
 * @description Copy a document, source and all, as a new independent document.
 * @auth Required
 *
 * A dedicated route rather than a client-side read-then-create: the source can be 512KB,
 * and round-tripping it through the browser to hand it straight back is both wasteful and
 * a window in which a concurrent edit could be copied half-applied.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { parseJsonBody } from "@/lib/api-utils";
import { isAuthError, requireAuth } from "@/lib/auth";
import { duplicateTexDocument, getTexDocument } from "@/lib/db/tex-documents";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

/** "Resume" → "Resume (copy)", but "Resume (copy)" → "Resume (copy 2)". */
export function copyTitle(title: string): string {
  const numbered = /^(.*)\s\(copy(?:\s(\d+))?\)$/.exec(title);
  if (numbered) {
    const next = numbered[2] ? Number(numbered[2]) + 1 : 2;
    return `${numbered[1]} (copy ${next})`;
  }
  // 200 is the column's limit, and " (copy)" has to fit inside it.
  return `${title.slice(0, 193)} (copy)`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const parsed = await parseJsonBody(request, bodySchema);
  if (!parsed.ok) return parsed.response;

  const existing = await getTexDocument(params.id, auth.userId);
  if (!existing) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const document = await duplicateTexDocument(
    params.id,
    auth.userId,
    parsed.data.title?.trim() || copyTitle(existing.title),
  );
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ document }, { status: 201 });
}
