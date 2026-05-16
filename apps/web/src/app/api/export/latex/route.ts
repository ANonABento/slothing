/**
 * @route POST /api/export/latex
 * @description Convert a Tiptap-rendered HTML string into a downloadable LaTeX
 *   (.tex) source file. The output is a complete `\documentclass{article}`
 *   document that compiles standalone in Overleaf or with `pdflatex`.
 * @auth Required
 * @request { html: string, filename?: string, title?: string }
 * @response text/x-tex with Content-Disposition: attachment
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { isAuthError, requireAuth } from "@/lib/auth";
import { parseJsonBody } from "@/lib/api-utils";
import { htmlToLatex } from "@/lib/export/html-to-latex";

export const dynamic = "force-dynamic";

const latexExportSchema = z.object({
  html: z.string().min(1, "html is required"),
  filename: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
});

/**
 * Sanitize a user-supplied filename for use in a `Content-Disposition` header.
 * Strips path separators and quote characters; falls back to a default.
 */
function sanitizeFilename(input: string | undefined, fallback: string): string {
  if (!input) return fallback;
  const stripped = input
    .replace(/[\\/:*?"<>|\r\n]/g, "")
    .replace(/\.+$/, "")
    .trim();
  if (!stripped) return fallback;
  return stripped.toLowerCase().endsWith(".tex") ? stripped : `${stripped}.tex`;
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const parsed = await parseJsonBody(request, latexExportSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const { html, filename, title } = parsed.data;
    const tex = htmlToLatex(html, { title });
    const finalName = sanitizeFilename(filename, "resume.tex");

    return new NextResponse(tex, {
      status: 200,
      headers: {
        "Content-Type": "text/x-tex; charset=utf-8",
        "Content-Disposition": `attachment; filename="${finalName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("LaTeX export error:", error);
    return NextResponse.json(
      { error: "Failed to export LaTeX" },
      { status: 500 },
    );
  }
}
