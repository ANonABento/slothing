import { NextRequest } from "next/server";
import { isAuthError, requireAuth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-utils";
import {
  deleteShare,
  getShareByToken,
  incrementViewCount,
} from "@/lib/db/shared-resumes";

export const dynamic = "force-dynamic";

interface Params {
  params: { token: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const share = getShareByToken(params.token);
  if (!share) {
    return errorResponse(
      "not_found",
      "This share link has expired or never existed.",
    );
  }

  // Best-effort view counter — never block the response on the write.
  try {
    incrementViewCount(params.token);
  } catch (error) {
    console.warn("[share] view count update failed", error);
  }

  return successResponse({
    share: {
      token: share.id,
      html: share.documentHtml,
      title: share.documentTitle,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
      viewCount: share.viewCount + 1,
    },
  });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (isAuthError(auth)) return auth;

  const removed = deleteShare(params.token, auth.userId);
  if (!removed) {
    return errorResponse("not_found", "Share not found.");
  }

  return successResponse({ ok: true });
}
