import type { OpportunityStatus } from "@/types";

export type DetectedStatus = Extract<
  OpportunityStatus,
  "applied" | "interviewing" | "rejected" | "offer"
>;

export interface StatusDetectionInput {
  subject?: string;
  snippet?: string;
  body?: string;
  from?: string;
}

export interface StatusDetectionResult {
  status: DetectedStatus;
  confidence: number;
  pattern: string;
}

export const STATUS_ADVANCEMENT_ORDER: Record<OpportunityStatus, number> = {
  pending: 0,
  saved: 1,
  applied: 2,
  interviewing: 3,
  rejected: 4,
  offer: 5,
  expired: 4,
  dismissed: 4,
};

const STATUS_PATTERNS: Array<{
  status: DetectedStatus;
  confidence: number;
  name: string;
  pattern: RegExp;
}> = [
  {
    status: "offer",
    confidence: 0.9,
    name: "offer",
    pattern: /\b(?:extend(?:ing)? (?:you )?an offer|offer letter)\b/i,
  },
  {
    status: "rejected",
    confidence: 0.85,
    name: "rejected",
    pattern:
      /\b(?:unfortunately|decided to move forward|not (?:be )?moving forward|other candidates)\b/i,
  },
  {
    status: "interviewing",
    confidence: 0.85,
    name: "interviewing",
    pattern: /\b(?:schedule (?:a )?call|interview|next round)\b/i,
  },
  {
    status: "applied",
    confidence: 0.8,
    name: "applied",
    pattern: /\bthank you for applying\b/i,
  },
];

const FALSE_POSITIVE_GUARDS = [
  /\bunfortunately\b.{0,80}\b(?:reschedule|delay|postpone|cancel our call)\b/i,
  /\bwe offer\b.{0,80}\b(?:benefits|salary|perks|health|remote)\b/i,
  /\boffer(?:s|ing)?\b.{0,80}\b(?:benefits|resources|services)\b/i,
];

export function detectStatusFromEmail(
  input: StatusDetectionInput,
): StatusDetectionResult | null {
  const text = [input.subject, input.snippet, input.body, input.from]
    .filter(Boolean)
    .join("\n");
  if (!text.trim()) return null;

  if (FALSE_POSITIVE_GUARDS.some((guard) => guard.test(text))) {
    return null;
  }

  const match = STATUS_PATTERNS.find(({ pattern }) => pattern.test(text));
  if (!match) return null;

  return {
    status: match.status,
    confidence: match.confidence,
    pattern: match.name,
  };
}

export function shouldAdvanceStatus(
  current: OpportunityStatus,
  detected: DetectedStatus,
): boolean {
  if (current === "rejected" || current === "offer") return false;
  return STATUS_ADVANCEMENT_ORDER[detected] > STATUS_ADVANCEMENT_ORDER[current];
}
