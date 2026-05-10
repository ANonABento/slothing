import { formatIsoDateOnly } from "@/lib/format/time";
/**
 * @route GET /api/analytics
 * @description Fetch overview analytics
 * @auth Required
 * @response AnalyticsOverviewResponse from @/types/api
 */
import { NextResponse } from "next/server";
import { saveAnalyticsSnapshot } from "@/lib/db/analytics";
import {
  getDocumentCount,
  getGeneratedResumeCount,
  getInterviewSessionStats,
  getJobsAnalyticsView,
  getProfileAnalyticsView,
} from "@/lib/db/analytics-queries";
import { requireAuth, isAuthError } from "@/lib/auth";

export const dynamic = "force-dynamic";

function debugQuery<T>(label: string, query: () => T): T {
  if (process.env.DEBUG_QUERIES !== "1") {
    return query();
  }

  console.time(label);
  try {
    return query();
  } finally {
    console.timeEnd(label);
  }
}

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const profile = debugQuery("analytics:profile", () =>
      getProfileAnalyticsView(authResult.userId),
    );
    const jobs = debugQuery("analytics:jobs", () =>
      getJobsAnalyticsView(authResult.userId),
    );
    const totalDocuments = debugQuery("analytics:documents", () =>
      getDocumentCount(authResult.userId),
    );
    const interviews = debugQuery("analytics:interviews", () =>
      getInterviewSessionStats(authResult.userId),
    );
    const totalResumesGenerated = debugQuery("analytics:resumes", () =>
      getGeneratedResumeCount(authResult.userId),
    );

    // Calculate profile completeness
    let profileScore = 0;
    if (profile) {
      if (profile.contact?.name) profileScore += 15;
      if (profile.contact?.email) profileScore += 10;
      if (profile.contact?.phone) profileScore += 5;
      if (profile.summary && profile.summary.length > 50) profileScore += 15;
      if (profile.experienceCount > 0) profileScore += 20;
      if (profile.educationCount > 0) profileScore += 10;
      if (profile.skills.length >= 3) profileScore += 15;
      if (profile.projectCount > 0) profileScore += 5;
      if (profile.certificationCount > 0) profileScore += 5;
    }

    // Job status breakdown
    const jobsByStatus = jobs.reduce(
      (acc, job) => {
        const status = job.status || "saved";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Skill gaps (from all jobs)
    const allKeywords = jobs.flatMap((j) => j.keywords || []);
    const profileSkills =
      profile?.skills.map((s) => s.name.toLowerCase()) || [];
    const skillGaps = Array.from(
      new Set(
        allKeywords
          .filter(
            (kw) =>
              !profileSkills.some(
                (s) =>
                  s.includes(kw.toLowerCase()) || kw.toLowerCase().includes(s),
              ),
          )
          .map((kw) => kw.toLowerCase()),
      ),
    ).slice(0, 10);

    // Recent activity
    const recentJobs = jobs.slice(0, 5).map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      status: j.status || "saved",
      createdAt: j.createdAt,
    }));

    const analytics = {
      overview: {
        profileCompleteness: Math.min(profileScore, 100),
        totalJobs: jobs.length,
        totalDocuments,
        totalInterviews: interviews.total,
        totalResumesGenerated,
      },
      jobs: {
        byStatus: jobsByStatus,
        total: jobs.length,
        applied: jobsByStatus["applied"] || 0,
        interviewing: jobsByStatus["interviewing"] || 0,
        offered: jobsByStatus["offered"] || 0,
        rejected: jobsByStatus["rejected"] || 0,
      },
      interviews: {
        total: interviews.total,
        completed: interviews.completed,
        inProgress: interviews.inProgress,
      },
      skills: {
        total: profile?.skills.length || 0,
        gaps: skillGaps,
        byCategory:
          profile?.skills.reduce(
            (acc, s) => {
              acc[s.category] = (acc[s.category] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          ) || {},
      },
      recent: {
        jobs: recentJobs,
      },
    };

    // Save today's snapshot for historical tracking without blocking the read.
    void Promise.resolve().then(() => {
      try {
        const today = formatIsoDateOnly();
        saveAnalyticsSnapshot(
          {
            userId: authResult.userId,
            snapshotDate: today,
            totalJobs: jobs.length,
            jobsSaved: jobsByStatus["saved"] || 0,
            jobsApplied: jobsByStatus["applied"] || 0,
            jobsInterviewing: jobsByStatus["interviewing"] || 0,
            jobsOffered: jobsByStatus["offered"] || 0,
            jobsRejected: jobsByStatus["rejected"] || 0,
            totalInterviews: interviews.total,
            interviewsCompleted: interviews.completed,
            totalDocuments,
            totalResumes: totalResumesGenerated,
            profileCompleteness: Math.min(profileScore, 100),
          },
          authResult.userId,
        );
      } catch (snapshotError) {
        console.error("Failed to save analytics snapshot:", snapshotError);
      }
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to get analytics" },
      { status: 500 },
    );
  }
}
