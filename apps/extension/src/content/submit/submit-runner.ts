// P3 — Drive one approved draft through the submit orchestrator and report the
// outcome back to Slothing (which flips status to submitted/failed). Decoupled
// from the background api-client via a minimal reporter interface so it is
// unit-testable and so the content script can route the report over messaging.

import { SubmitOrchestrator } from "./submit-orchestrator";
import type { SubmitResult } from "./submit-adapter";
import type { ApprovedDraftPayload } from "../../shared/types";

export interface SubmitReporter {
  reportSubmitResult(
    draftId: string,
    result: { ok: boolean; atsRef?: string; error?: string },
  ): Promise<unknown>;
}

export interface AuthorizationDecision {
  authorized: boolean;
  reasons: string[];
}

export interface RunSubmissionOptions {
  dryRun?: boolean;
  doc?: Document;
  host?: string;
  /**
   * Server-side guardrail check, consulted before an unattended (non-dry-run)
   * submit. When it returns `authorized: false`, the runner skips entirely — no
   * fill, no submit, no report.
   */
  authorize?: () => Promise<AuthorizationDecision>;
}

/**
 * Fill + (unless dry-run) submit one approved draft, then report the result.
 * Dry runs fill the form but neither submit nor report — they exist so the user
 * can preview what the agent would do. `needsHuman` and `failed` outcomes are
 * still reported so the queue reflects reality.
 */
export async function runDraftSubmission(
  draft: ApprovedDraftPayload,
  reporter: SubmitReporter,
  options: RunSubmissionOptions = {},
): Promise<SubmitResult> {
  // L4 guardrail: consult the server before any unattended submit. A blocked
  // decision skips entirely — no fill, no submit, no report.
  if (!options.dryRun && options.authorize) {
    const decision = await options.authorize();
    if (!decision.authorized) {
      return {
        ok: false,
        skipped: true,
        filled: 0,
        error: `Blocked by guardrails: ${decision.reasons.join(", ")}`,
      };
    }
  }

  const orchestrator = new SubmitOrchestrator(options.doc, options.host);
  const result = await orchestrator.submit(draft, { dryRun: options.dryRun });

  if (!options.dryRun) {
    await reporter.reportSubmitResult(draft.id, {
      ok: result.ok,
      atsRef: result.atsRef,
      error: result.error,
    });
  }

  return result;
}
