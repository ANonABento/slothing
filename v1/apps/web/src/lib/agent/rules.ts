/**
 * Guardrail rules engine for unattended agent action (autonomy level L4) —
 * docs/agent-overnight-apply-spec.md, P4.
 *
 * Pure module. Given a policy and the facts about a candidate (company, salary,
 * match score, today's submission count, the draft's status), it decides
 * whether the agent may act *unattended*. The same filter helpers are reused
 * for sourcing decisions. Enforced server-side at the submit-authorization
 * gate — never trusted to the agent alone.
 */
import { type AgentPolicy, allowsUnattendedSubmission } from "./policy";

export interface CandidateFacts {
  /** Company name (any case) — checked against the blocklist. */
  company: string | null;
  /** Parsed annual salary, if known — checked against the floor. */
  salary: number | null;
  /** [0,1] match score, if known — checked against the threshold. */
  matchScore: number | null;
}

export interface SubmissionRuleContext extends CandidateFacts {
  policy: AgentPolicy;
  /** The draft's current status — must be "approved" to submit. */
  draftStatus: string;
  /** How many applications were already submitted today. */
  submittedToday: number;
}

export interface RuleEvaluation {
  authorized: boolean;
  /** Machine-readable reasons the action was blocked (empty when authorized). */
  reasons: string[];
}

/**
 * Filter reasons shared by sourcing + submission: company blocklist, salary
 * floor, and match threshold. Returns the reasons that FAIL (empty = passes).
 */
export function filterReasons(
  policy: AgentPolicy,
  facts: CandidateFacts,
): string[] {
  const reasons: string[] = [];
  if (
    facts.company &&
    policy.companyBlocklist.includes(facts.company.toLowerCase().trim())
  ) {
    reasons.push("company_blocklisted");
  }
  if (
    policy.salaryFloor != null &&
    facts.salary != null &&
    facts.salary < policy.salaryFloor
  ) {
    reasons.push("below_salary_floor");
  }
  if (facts.matchScore != null && facts.matchScore < policy.matchThreshold) {
    reasons.push("below_match_threshold");
  }
  return reasons;
}

/** Whether a candidate passes the sourcing filters (blocklist/salary/match). */
export function passesSourcingFilters(
  policy: AgentPolicy,
  facts: CandidateFacts,
): boolean {
  return filterReasons(policy, facts).length === 0;
}

/**
 * Decide whether the agent may submit this draft UNATTENDED right now. Every
 * gate must pass: approved draft, autonomy at auto_submit, dry-run off, filters
 * pass, and the daily cap not yet reached.
 */
export function evaluateUnattendedSubmission(
  ctx: SubmissionRuleContext,
): RuleEvaluation {
  const reasons: string[] = [];

  if (ctx.draftStatus !== "approved") reasons.push("not_approved");
  if (!allowsUnattendedSubmission(ctx.policy.autonomy)) {
    reasons.push("autonomy_below_auto_submit");
  }
  // Dry-run is the hard stop: it must produce zero real submits.
  if (ctx.policy.dryRun) reasons.push("dry_run_enabled");
  reasons.push(...filterReasons(ctx.policy, ctx));
  if (ctx.submittedToday >= ctx.policy.dailySubmitCap) {
    reasons.push("daily_cap_reached");
  }

  return { authorized: reasons.length === 0, reasons };
}

/**
 * Parse an annual salary floor from free-text salary like "$120,000",
 * "120k - 150k", or "USD 95000". Returns the lowest number found (handling a
 * trailing "k"), or null when nothing parseable is present.
 */
export function parseSalary(text: string | null | undefined): number | null {
  if (!text) return null;
  const cleaned = text.replace(/,/g, "");
  const matches = cleaned.match(/(\d+(?:\.\d+)?)\s*([kK])?/g);
  if (!matches) return null;
  // If a "k" magnitude appears anywhere (e.g. a "120-150k" range), bare small
  // numbers in the same string are thousands too — otherwise "120-150k" would
  // parse to 120 instead of 120000 and wrongly trip the salary floor.
  const hasThousands = /\d\s*[kK]/.test(cleaned);
  const numbers = matches
    .map((m) => {
      const parsed = m.match(/(\d+(?:\.\d+)?)\s*([kK])?/);
      if (!parsed) return null;
      const base = parseFloat(parsed[1]);
      if (!Number.isFinite(base)) return null;
      if (parsed[2]) return base * 1000;
      return hasThousands && base < 1000 ? base * 1000 : base;
    })
    .filter((n): n is number => n != null && n > 0);
  if (numbers.length === 0) return null;
  return Math.min(...numbers);
}
