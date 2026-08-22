/**
 * @route GET /api/templates
 * @description List available document templates.
 * @auth Required
 *
 * The grammar-template system this used to list was retired by the LaTeX rebuild, and the
 * curated .tex gallery that replaces it is still to come (spec §10). Returning an empty
 * list keeps existing callers — the command palette among them — working without
 * advertising templates that no longer exist.
 */
import { NextResponse } from "next/server";

import { isAuthError, requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  return NextResponse.json({ templates: [] });
}
