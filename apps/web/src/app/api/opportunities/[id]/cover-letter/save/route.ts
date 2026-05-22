/**
 * @route POST /api/opportunities/[id]/cover-letter/save
 * @description Save a cover letter version for an opportunity
 * @auth Required
 * @request { content: string, tone?: string, version?: number }
 * @response CoverLetterSaveResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { saveCoverLetter } from "@/lib/db/cover-letters";
import { getJob } from "@/lib/db/jobs-async";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const job = await getJob(params.id, authResult.userId);
    if (!job) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 },
      );
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be an object" },
        { status: 400 },
      );
    }
    const { content, highlights = [] } = body as {
      content?: unknown;
      highlights?: string[];
    };

    if (typeof content !== "string" || !content) {
      return NextResponse.json(
        { error: "Cover letter content is required" },
        { status: 400 },
      );
    }

    const coverLetter = await saveCoverLetter(
      params.id,
      content,
      highlights,
      authResult.userId,
    );

    return NextResponse.json({
      success: true,
      coverLetter: {
        id: coverLetter.id,
        content: coverLetter.content,
        highlights: coverLetter.highlights,
        version: coverLetter.version,
        createdAt: coverLetter.createdAt,
      },
    });
  } catch (error) {
    console.error("Save cover letter error:", error);
    return NextResponse.json(
      { error: "Failed to save cover letter" },
      { status: 500 },
    );
  }
}
