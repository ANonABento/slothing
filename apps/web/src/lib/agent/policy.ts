/**
 * Agent autonomy policy — the user-settable "how far can the overnight agent go"
 * control, modelled after Claude Code's plan/auto modes. See
 * docs/agent-overnight-apply-spec.md ("The autonomy ladder").
 *
 * This module is pure (no DB, no IO) so it can be shared by the settings UI, the
 * persistence layer, the extension policy route, and tests.
 */
import { z } from "zod";

/** Ordered low → high. Index doubles as the privilege rank. */
export const AUTONOMY_LEVELS = [
  "off",
  "source",
  "draft",
  "submit_approval",
  "auto_submit",
] as const;

export type AutonomyLevel = (typeof AUTONOMY_LEVELS)[number];

export interface AgentPolicy {
  /** How far the agent may act unattended. */
  autonomy: AutonomyLevel;
  /** Minimum match score (0..1) before an opportunity is surfaced/pushed. */
  matchThreshold: number;
  /** Skip roles below this annual salary (in whole currency units). */
  salaryFloor: number | null;
  /** Companies the agent must never act on (lower-cased on save). */
  companyBlocklist: string[];
  /** Hard cap on unattended submissions per day. */
  dailySubmitCap: number;
  /** When true, the agent prepares but never actually submits. */
  dryRun: boolean;
  /** Informational cron the user runs their agent on; the host owns scheduling. */
  scheduleCron: string | null;
  /** ISO timestamp of the last save, or null when defaults are in effect. */
  updatedAt: string | null;
}

/**
 * Safe defaults: the agent sources + ranks (L1) but never submits. This is the
 * "never auto-submit" default the product requires — `dryRun` stays on and the
 * autonomy level sits below the submission rungs.
 */
export const DEFAULT_AGENT_POLICY: AgentPolicy = {
  autonomy: "source",
  matchThreshold: 0.15,
  salaryFloor: null,
  companyBlocklist: [],
  dailySubmitCap: 10,
  dryRun: true,
  scheduleCron: null,
  updatedAt: null,
};

/** Privilege rank of a level (higher = more autonomous). */
export function autonomyRank(level: AutonomyLevel): number {
  return AUTONOMY_LEVELS.indexOf(level);
}

/** Whether a level permits the agent to actually submit applications. */
export function allowsSubmission(level: AutonomyLevel): boolean {
  return autonomyRank(level) >= autonomyRank("submit_approval");
}

/** Whether a level permits *unattended* (no per-app approval) submission. */
export function allowsUnattendedSubmission(level: AutonomyLevel): boolean {
  return autonomyRank(level) >= autonomyRank("auto_submit");
}

export function isAutonomyLevel(value: unknown): value is AutonomyLevel {
  return (
    typeof value === "string" &&
    (AUTONOMY_LEVELS as readonly string[]).includes(value)
  );
}

export function clampThreshold(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_AGENT_POLICY.matchThreshold;
  return Math.min(1, Math.max(0, value));
}

export function normalizeBlocklist(values: readonly string[]): string[] {
  const seen = new Set<string>();
  for (const raw of values) {
    const normalized = raw.trim().toLowerCase();
    if (normalized) seen.add(normalized);
  }
  return [...seen];
}

/** Zod schema for a partial policy update from the settings UI. */
export const agentPolicyUpdateSchema = z
  .object({
    autonomy: z.enum(AUTONOMY_LEVELS),
    matchThreshold: z.number(),
    salaryFloor: z.number().int().nonnegative().nullable(),
    companyBlocklist: z.array(z.string().max(200)).max(500),
    dailySubmitCap: z.number().int().min(0).max(1000),
    dryRun: z.boolean(),
    scheduleCron: z.string().max(120).nullable(),
  })
  .partial();

export type AgentPolicyUpdate = z.infer<typeof agentPolicyUpdateSchema>;

/**
 * Merge a validated partial update onto a base policy, applying clamping +
 * normalization. Does not set `updatedAt` — the persistence layer stamps that.
 */
export function applyPolicyUpdate(
  base: AgentPolicy,
  patch: AgentPolicyUpdate,
): AgentPolicy {
  return {
    ...base,
    ...(patch.autonomy !== undefined ? { autonomy: patch.autonomy } : {}),
    ...(patch.matchThreshold !== undefined
      ? { matchThreshold: clampThreshold(patch.matchThreshold) }
      : {}),
    ...(patch.salaryFloor !== undefined
      ? { salaryFloor: patch.salaryFloor }
      : {}),
    ...(patch.companyBlocklist !== undefined
      ? { companyBlocklist: normalizeBlocklist(patch.companyBlocklist) }
      : {}),
    ...(patch.dailySubmitCap !== undefined
      ? { dailySubmitCap: patch.dailySubmitCap }
      : {}),
    ...(patch.dryRun !== undefined ? { dryRun: patch.dryRun } : {}),
    ...(patch.scheduleCron !== undefined
      ? { scheduleCron: patch.scheduleCron?.trim() || null }
      : {}),
  };
}
