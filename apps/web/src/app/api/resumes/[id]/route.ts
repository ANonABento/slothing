import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getGeneratedResume } from "@/lib/db/resumes";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const resume = getGeneratedResume(params.id, authResult.userId);
  if (!resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  let content: unknown = null;
  try {
    content = JSON.parse(resume.contentJson);
  } catch {
    return NextResponse.json(
      { error: "Saved resume content is invalid." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    resume: {
      id: resume.id,
      content,
      contentJson: resume.contentJson,
      templateId: resume.templateId,
      jobId: resume.jobId,
      matchScore: resume.matchScore,
      createdAt: resume.createdAt,
    },
  });
}
