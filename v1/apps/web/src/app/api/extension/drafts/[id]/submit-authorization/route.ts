/**
 * @route GET /api/extension/drafts/[id]/submit-authorization
 * @description Server-enforced L4 guardrail. An executor calls this before an
 *   UNATTENDED submission; the server checks the policy (autonomy, dry-run,
 *   blocklist, salary floor, match threshold, daily cap) against the draft + its
 *   opportunity and returns whether the submission is authorized. Never trust
 *   the agent to self-enforce these.
 * @auth Extension token via X-Extension-Token
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { getDraft, countSubmittedSince } from "@/lib/db/application-drafts";
import { getJob } from "@/lib/db/jobs-async";
import { getJobMatchScore } from "@/lib/db/job-match-score";
import { getAgentSettings } from "@/lib/db/agent-settings";
import { evaluateUnattendedSubmission, parseSalary } from "@/lib/agent/rules";
import { nowDate, toIso } from "@/lib/format/time";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireExtensionAuth(_request);
  if (!authResult.success) return authResult.response;

  const userId = authResult.userId;

  try {
    const draft = await getDraft(params.id, userId);
    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    const [job, matchScore, policy] = await Promise.all([
      getJob(draft.jobId, userId),
      getJobMatchScore(draft.jobId, userId),
      getAgentSettings(userId),
    ]);

    const startOfDay = nowDate();
    startOfDay.setHours(0, 0, 0, 0);
    const submittedToday = await countSubmittedSince(userId, toIso(startOfDay));

    const evaluation = evaluateUnattendedSubmission({
      policy,
      draftStatus: draft.status,
      company: job?.company ?? null,
      salary: parseSalary(job?.salary),
      matchScore,
      submittedToday,
    });

    return NextResponse.json({
      authorized: evaluation.authorized,
      reasons: evaluation.reasons,
      submittedToday,
      dailyCap: policy.dailySubmitCap,
    });
  } catch (error) {
    console.error("Submit authorization error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate submission authorization" },
      { status: 500 },
    );
  }
}
