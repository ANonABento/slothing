import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getCoverLetter } from "@/lib/db/cover-letters";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const coverLetter = getCoverLetter(params.id, authResult.userId);
  if (!coverLetter) {
    return NextResponse.json(
      { error: "Cover letter not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    coverLetter: {
      id: coverLetter.id,
      content: coverLetter.content,
      highlights: coverLetter.highlights,
      version: coverLetter.version,
      jobId: coverLetter.jobId,
      createdAt: coverLetter.createdAt,
    },
  });
}
