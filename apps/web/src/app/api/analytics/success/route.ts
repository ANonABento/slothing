/**
 * @route GET /api/analytics/success
 * @description Calculate success metrics
 * @auth Required
 * @response AnalyticsSuccessResponse from @/types/api
 */
import { NextResponse } from "next/server";
import {
  getAnalyticsJobDescriptions,
  getGeneratedResumeAnalyticsView,
} from "@/lib/db/analytics-queries";
import { calculateSuccessMetrics } from "@/lib/analytics/success-metrics";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const jobs = getAnalyticsJobDescriptions(authResult.userId);
    const resumes = getGeneratedResumeAnalyticsView(authResult.userId);

    const metrics = calculateSuccessMetrics(jobs, resumes);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Success metrics error:", error);
    return NextResponse.json(
      { error: "Failed to calculate success metrics" },
      { status: 500 },
    );
  }
}
