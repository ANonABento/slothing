import { formatIsoDateOnly, nowDate, parseToDate } from "@/lib/format/time";
/**
 * @route GET /api/analytics/trends
 * @description Time-series trends data
 * @auth Required
 * @response AnalyticsTrendsResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsJobDescriptions } from "@/lib/db/analytics-queries";
import {
  generateTimeSeriesData,
  calculateTrendMetrics,
  generateActivityTimeline,
  type TimeRange,
} from "@/lib/analytics/time-series";
import {
  getAnalyticsSnapshots,
  getWeekOverWeekChange,
  getAverageTimeInStatus,
} from "@/lib/db/analytics";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") as TimeRange) || "30d";

    const jobs = getAnalyticsJobDescriptions(authResult.userId);

    const timeSeries = generateTimeSeriesData(jobs, range);
    const trends = calculateTrendMetrics(jobs, range);
    const timeline = generateActivityTimeline(jobs, 20);

    // Get historical snapshots
    const today = nowDate();
    const rangeMap: Record<string, number> = {
      "7d": 7,
      "14d": 14,
      "30d": 30,
      "90d": 90,
    };
    const daysBack = rangeMap[range] || 30;
    const startDate = parseToDate(today)!;
    startDate.setDate(startDate.getDate() - daysBack);

    const snapshots = getAnalyticsSnapshots(
      formatIsoDateOnly(startDate),
      formatIsoDateOnly(today),
      authResult.userId,
    );

    // Get week-over-week changes
    const weekOverWeek = getWeekOverWeekChange(authResult.userId);

    // Get average time in status
    const avgTimeInStatus = getAverageTimeInStatus(authResult.userId);

    return NextResponse.json({
      range,
      timeSeries,
      trends,
      timeline,
      snapshots,
      weekOverWeek,
      avgTimeInStatus,
    });
  } catch (error) {
    console.error("Trends analytics error:", error);
    return NextResponse.json(
      { error: "Failed to get trend analytics" },
      { status: 500 },
    );
  }
}
