import { NextRequest } from "next/server";
import { z } from "zod";
import { isAuthError, requireAuth } from "@/lib/auth";
import { errorResponse, parseJsonBody, successResponse } from "@/lib/api-utils";
import {
  createShare,
  listSharesForUser,
  MAX_SHARE_HTML_BYTES,
  MAX_SHARE_TITLE_LENGTH,
} from "@/lib/db/shared-resumes";

export const dynamic = "force-dynamic";

const createShareSchema = z.object({
  html: z
    .string()
    .min(1, "Document HTML is required")
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= MAX_SHARE_HTML_BYTES,
      "Snapshot exceeds maximum share size",
    ),
  title: z.string().max(MAX_SHARE_TITLE_LENGTH).optional(),
});

function buildShareUrl(request: NextRequest, token: string): string {
  // Prefer the public origin (when behind a reverse proxy / Vercel preview the
  // `host` + `x-forwarded-proto` headers carry the canonical origin). Fall
  // back to NEXT_PUBLIC_APP_URL, then to the request's own origin.
  const headerHost = request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");
  const envBase = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (envBase) return `${envBase}/share/${token}`;
  if (headerHost) return `${proto}://${headerHost}/share/${token}`;
  return new URL(`/share/${token}`, request.nextUrl).toString();
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const parsed = await parseJsonBody(request, createShareSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const share = createShare({
      userId: auth.userId,
      html: parsed.data.html,
      title: parsed.data.title ?? "",
    });

    return successResponse(
      {
        token: share.id,
        url: buildShareUrl(request, share.id),
        expiresAt: share.expiresAt,
        createdAt: share.createdAt,
      },
      201,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create share";
    return errorResponse("bad_request", message);
  }
}

export async function GET() {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const shares = listSharesForUser(auth.userId);
  return successResponse({ shares });
}
