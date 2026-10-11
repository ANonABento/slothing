import type { OpportunityStatus } from "@/types";
import { formatEvidenceSnippet } from "@/lib/status-automation/confidence";

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
  reason: string;
  evidence: string[];
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
  reason: string;
  pattern: RegExp;
}> = [
  {
    status: "offer",
    confidence: 0.9,
    name: "offer",
    reason: "offer language",
    pattern:
      /\b(?:extend(?:ing)? (?:you )?an offer|offer letter|pleased to offer you)\b/i,
  },
  {
    status: "rejected",
    confidence: 0.85,
    name: "rejected",
    reason: "rejection language",
    pattern:
      /\b(?:decided to move forward with (?:another|other) candidate|not (?:be )?moving forward|other candidates|unable to proceed|will not be proceeding)\b/i,
  },
  {
    status: "rejected",
    confidence: 0.85,
    name: "unfortunately_rejected",
    reason: "rejection language",
    pattern:
      /\bunfortunately\b.{0,160}\b(?:decided to move forward|not (?:be )?moving forward|other candidates|unable to proceed|will not be proceeding|selected another candidate)\b/i,
  },
  {
    status: "interviewing",
    confidence: 0.85,
    name: "interviewing",
    reason: "interview scheduling language",
    pattern: /\b(?:schedule (?:a )?call|interview|next round)\b/i,
  },
  {
    status: "applied",
    confidence: 0.8,
    name: "applied",
    reason: "application confirmation",
    pattern: /\bthank you for applying\b/i,
  },
];

const FALSE_POSITIVE_GUARDS = [
  /\bunfortunately\b.{0,120}\b(?:reschedule|delay|postpone|cancel our call|move our call|need to cancel)\b/i,
  /\b(?:reschedule|delay|postpone|cancel our call|move our call|need to cancel)\b.{0,120}\bunfortunately\b/i,
  /\bwe offer\b.{0,80}\b(?:benefits|salary|perks|health|remote)\b/i,
  /\b(?:benefits|perks|health benefits|employee benefits)\b.{0,80}\boffer(?:s|ed|ing)?\b/i,
  /\boffer(?:s|ed|ing)?\b.{0,80}\b(?:benefits|resources|services|perks|health benefits|employee benefits)\b/i,
  /\bour offer includes\b.{0,80}\b(?:benefits|perks|health|salary|pto)\b/i,
];

function evidenceForPattern(text: string, pattern: RegExp): string[] {
  const match = text.match(pattern);
  if (!match || match.index === undefined) return [];

  const start = Math.max(0, match.index - 60);
  const end = Math.min(text.length, match.index + match[0].length + 100);
  return [formatEvidenceSnippet(text.slice(start, end))];
}

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
    reason: match.reason,
    evidence: evidenceForPattern(text, match.pattern),
  };
}

export function shouldAdvanceStatus(
  current: OpportunityStatus,
  detected: DetectedStatus,
): boolean {
  if (current === "rejected" || current === "offer") return false;
  return STATUS_ADVANCEMENT_ORDER[detected] > STATUS_ADVANCEMENT_ORDER[current];
}
