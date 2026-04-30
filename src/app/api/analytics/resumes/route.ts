/**
 * @route GET /api/analytics/resumes
 * @description Fetch resume engagement analytics.
 * @auth Required
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getResumeEventSummary } from "@/lib/db/resume-events";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const daysParam = request.nextUrl.searchParams.get("days");
    const days = daysParam ? Number(daysParam) : 30;
    return NextResponse.json(getResumeEventSummary(authResult.userId, days));
  } catch (error) {
    console.error("Resume analytics error:", error);
    return NextResponse.json(
      { error: "Failed to get resume analytics" },
      { status: 500 },
    );
  }
}
