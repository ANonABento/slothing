/**
 * @route GET /api/cron/agent-run
 * @description Slothing-hosted overnight runner (premium). For each user whose
 *   agent is switched on AND who has provisioned a service token (the opt-in
 *   signal for hosted runs), summarize what their agent would act on this run —
 *   approved drafts awaiting submission and whether their policy permits
 *   unattended action. Records a cron run. The heavy per-user LLM sourcing /
 *   drafting is performed by the agent against the MCP surface; this endpoint is
 *   the hosted scheduling + entitlement entry point.
 * @auth CRON_SECRET (Bearer)
 */
import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import {
  listUsersWithActiveAgent,
  getAgentSettings,
} from "@/lib/db/agent-settings";
import { listDrafts } from "@/lib/db/application-drafts";
import { listServiceTokens } from "@/lib/db/service-tokens";
import { recordCronRun } from "@/lib/db/cron-runs";
import { allowsUnattendedSubmission } from "@/lib/agent/policy";
import { nowEpoch, nowIso } from "@/lib/format/time";

const CRON = "0 2 * * *";

export async function GET(request: NextRequest) {
  const unauthorized = await requireCronAuth(request);
  if (unauthorized) return unauthorized;

  const startEpoch = nowEpoch();
  const startedAt = nowIso();

  try {
    const activeUsers = await listUsersWithActiveAgent();
    const processed: Array<{
      userId: string;
      autonomy: string;
      approvedDrafts: number;
      wouldSubmitUnattended: boolean;
    }> = [];
    let skippedNoToken = 0;

    for (const { userId } of activeUsers) {
      // Premium / opt-in gate: only users who provisioned a service token are
      // run by the hosted scheduler.
      const tokens = await listServiceTokens(userId);
      if (tokens.length === 0) {
        skippedNoToken += 1;
        continue;
      }

      const policy = await getAgentSettings(userId);
      const approved = await listDrafts(userId, { status: "approved" });
      processed.push({
        userId,
        autonomy: policy.autonomy,
        approvedDrafts: approved.length,
        wouldSubmitUnattended:
          allowsUnattendedSubmission(policy.autonomy) && !policy.dryRun,
      });
    }

    const summary = {
      activeUsers: activeUsers.length,
      processed: processed.length,
      skippedNoToken,
      totalApprovedDrafts: processed.reduce(
        (sum, p) => sum + p.approvedDrafts,
        0,
      ),
    };

    const finishEpoch = nowEpoch();
    await recordCronRun({
      cron: CRON,
      status: "success",
      startedAt,
      finishedAt: nowIso(),
      durationMs: finishEpoch - startEpoch,
      summary,
    });

    return NextResponse.json({ ...summary, users: processed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    await recordCronRun({
      cron: CRON,
      status: "failure",
      startedAt,
      finishedAt: nowIso(),
      error: message,
    }).catch(() => {});
    console.error("Agent-run cron error:", error);
    return NextResponse.json({ error: "Agent run failed" }, { status: 500 });
  }
}
