export const HIGH_CONFIDENCE_THRESHOLD = 0.82;
export const REVIEW_CONFIDENCE_THRESHOLD = 0.55;

export function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function combinedConfidence(...values: number[]): number {
  const valid = values.map(clampConfidence).filter((value) => value > 0);
  if (valid.length === 0) return 0;
  return clampConfidence(
    valid.reduce((total, value) => total + value, 0) / valid.length,
  );
}

export function shouldAutoApplyStatusUpdate(confidence: number): boolean {
  return clampConfidence(confidence) >= HIGH_CONFIDENCE_THRESHOLD;
}

export function shouldSuggestStatusUpdate(confidence: number): boolean {
  return clampConfidence(confidence) >= REVIEW_CONFIDENCE_THRESHOLD;
}

export function formatConfidence(value: number): string {
  return `${Math.round(clampConfidence(value) * 100)}% confidence`;
}

export function formatEvidenceSnippet(value: string, maxLength = 160): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

export function buildStatusAutomationNotificationMessage(input: {
  company: string;
  title?: string;
  previousStatus?: string;
  nextStatus: string;
  reason: string;
  confidence: number;
  evidence?: string[];
  action: "updated" | "suggested";
}): string {
  const subject = input.title
    ? `${input.company} ${input.title}`
    : input.company;
  const statusCopy =
    input.action === "updated" && input.previousStatus
      ? `${subject} moved from ${input.previousStatus} to ${input.nextStatus}.`
      : `${subject} may be ready to move to ${input.nextStatus}.`;
  const evidence = input.evidence?.filter(Boolean).slice(0, 2) ?? [];
  const evidenceCopy =
    evidence.length > 0 ? ` Evidence: "${evidence.join('" "')}"` : "";

  return `${statusCopy} Reason: ${input.reason}. ${formatConfidence(
    input.confidence,
  )}.${evidenceCopy}`;
}
