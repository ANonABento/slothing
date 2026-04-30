/**
 * @route GET /api/resume/view
 * @description Render a saved resume and record a view event.
 * @auth Required
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getGeneratedResume, recordResumeEvent } from "@/lib/db";
import type { TailoredResume } from "@/lib/resume/generator";
import { getTemplateWithCustom } from "@/lib/resume/templates";

async function renderResumeHtml(
  resume: TailoredResume,
  userId: string,
): Promise<string> {
  const { generateResumeHTML } = await import("@/lib/resume/pdf");
  const template = getTemplateWithCustom("classic", userId);
  return generateResumeHTML(resume, "classic", template);
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const resumeId = request.nextUrl.searchParams.get("resumeId");
  if (!resumeId) {
    return NextResponse.json(
      { error: "resumeId is required" },
      { status: 400 },
    );
  }

  try {
    const saved = getGeneratedResume(resumeId, authResult.userId);
    if (!saved) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const resume = JSON.parse(saved.contentJson) as TailoredResume;
    const html = await renderResumeHtml(resume, authResult.userId);
    recordResumeEvent(resumeId, "view", authResult.userId, {
      source: "resume-view-route",
    });

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Resume view error:", error);
    return NextResponse.json(
      { error: "Failed to render resume" },
      { status: 500 },
    );
  }
}
