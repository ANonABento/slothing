import { nowEpoch, toEpoch } from "@/lib/format/time";
import type { EmailTemplateType } from "@/types";

export interface DuplicateCandidateSend {
  id: string;
  type: EmailTemplateType;
  recipient: string;
  sentAt: string;
}

export interface FindDuplicateOptions {
  type: EmailTemplateType;
  recipient: string;
  windowDays: number;
  now?: number;
}

export function extractEmailAddress(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const angleMatch = trimmed.match(/<([^>]+)>/);
  const candidate = angleMatch ? angleMatch[1] : trimmed;

  return candidate.trim().toLowerCase();
}

export function findRecentDuplicateSend(
  sends: DuplicateCandidateSend[],
  { type, recipient, windowDays, now }: FindDuplicateOptions,
): DuplicateCandidateSend | null {
  const normalizedRecipient = extractEmailAddress(recipient);
  if (!normalizedRecipient) return null;

  const cutoff = (now ?? nowEpoch()) - windowDays * 24 * 60 * 60 * 1000;

  for (const send of sends) {
    if (send.type !== type) continue;
    if (extractEmailAddress(send.recipient) !== normalizedRecipient) continue;

    let sentEpoch: number;
    try {
      sentEpoch = toEpoch(send.sentAt);
    } catch {
      continue;
    }

    if (sentEpoch >= cutoff) return send;
  }

  return null;
}
