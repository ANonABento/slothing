/**
 * @route POST /api/opportunities/from-extension
 * @description Import scraped opportunities from the Slothing browser extension as pending jobs.
 * @auth Extension token via X-Extension-Token
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import {
  createJob,
  countJobsByStatus,
  getJobByUrl,
  updateJobStatus,
} from "@/lib/db/jobs-async";
import { createNotification } from "@/lib/db/notifications";
import { setJobMatchScore } from "@/lib/db/job-match-score";
import { getProfile } from "@/lib/db/queries/profile";
import { profileTerms, scoreOpportunityMatch } from "@/lib/agent/match-score";
import {
  buildJobFromExtension,
  parseExtensionOpportunityPayload,
} from "@/lib/extension-opportunities";
import type { JobDescription } from "@/types";

export async function POST(request: NextRequest) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    let rawData: unknown;
    try {
      rawData = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 },
      );
    }

    const parseResult = parseExtensionOpportunityPayload(rawData);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: parseResult.errors },
        { status: 400 },
      );
    }

    const importedJobs: JobDescription[] = [];
    const dedupedIds: string[] = [];

    // Rank-on-push: score each opportunity against the user's profile so the
    // review queue can be ranked. Best-effort + zero LLM cost; never blocks an
    // import (see docs/agent-overnight-apply-spec.md, P1).
    const profile = await getProfile(authResult.userId).catch(() => null);
    const terms = profileTerms(profile);
    const scores: Record<string, number> = {};

    for (const opportunity of parseResult.opportunities) {
      const score = scoreOpportunityMatch(opportunity, terms);

      if (opportunity.status === "applied" && opportunity.url) {
        const existingJob = await getJobByUrl(
          opportunity.url,
          authResult.userId,
        );
        if (existingJob) {
          const updatedJob = await updateJobStatus(
            existingJob.id,
            "applied",
            existingJob.appliedAt || opportunity.appliedAt,
            authResult.userId,
          );
          importedJobs.push(updatedJob || existingJob);
          dedupedIds.push(existingJob.id);
          await setJobMatchScore(existingJob.id, authResult.userId, score);
          scores[existingJob.id] = score;
          continue;
        }
      }

      const createdJob = await createJob(
        buildJobFromExtension(opportunity),
        authResult.userId,
      );
      importedJobs.push(createdJob);
      await setJobMatchScore(createdJob.id, authResult.userId, score);
      scores[createdJob.id] = score;
    }

    const pendingCount = await countJobsByStatus("pending", authResult.userId);

    if (importedJobs.length > 0) {
      const appliedCount = parseResult.opportunities.filter(
        (opportunity) => opportunity.status === "applied",
      ).length;

      await createNotification(
        {
          type: "info",
          title: notificationTitle(importedJobs.length, appliedCount),
          message: notificationMessage(
            importedJobs,
            pendingCount,
            appliedCount,
          ),
          link: appliedCount > 0 ? "/opportunities" : "/opportunities/review",
        },
        authResult.userId,
      );
    }

    return NextResponse.json(
      {
        imported: importedJobs.length,
        opportunityIds: importedJobs.map((job) => job.id),
        pendingCount,
        dedupedIds,
        scores,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Extension opportunity import error:", error);
    return NextResponse.json(
      { error: "Failed to import opportunities" },
      { status: 500 },
    );
  }
}

function notificationTitle(
  importedCount: number,
  appliedCount: number,
): string {
  if (appliedCount > 0) {
    return importedCount === 1
      ? "Tracked application"
      : `${appliedCount} applications tracked`;
  }

  return importedCount === 1
    ? "New opportunity waiting for review"
    : `${importedCount} new opportunities waiting for review`;
}

function notificationMessage(
  importedJobs: Array<{ title: string; company: string }>,
  pendingCount: number,
  appliedCount: number,
): string {
  if (appliedCount > 0) {
    const firstJob = importedJobs[0];
    return importedJobs.length === 1
      ? `Tracked application: ${firstJob.title} at ${firstJob.company}.`
      : `${appliedCount} submitted applications were added to Opportunities.`;
  }

  return importedJobs.length === 1
    ? `${importedJobs[0].title} at ${importedJobs[0].company} was added to Pending.`
    : `${pendingCount} pending opportunities are ready to review.`;
}
