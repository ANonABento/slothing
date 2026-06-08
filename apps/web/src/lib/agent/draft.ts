/**
 * Drafted-application types + validation (docs/agent-overnight-apply-spec.md, P2).
 *
 * A DraftApplication is the missing object between "a sourced opportunity" and
 * "an application": the screening questions an agent detected, plus the answers
 * it proposes — each grounded in the user's profile bank, with a confidence and
 * a human-readable source, awaiting the user's review.
 *
 * Pure module — no DB, no IO — so it is shared by the persistence layer, both
 * routes, and tests.
 */
import { z } from "zod";

export const DRAFT_STATUSES = [
  "pending_review",
  "approved",
  "rejected",
  "submitted",
  "failed",
] as const;

export type DraftStatus = (typeof DRAFT_STATUSES)[number];

/** Statuses that still count as an "open" draft for dedupe purposes. */
export const OPEN_DRAFT_STATUSES: readonly DraftStatus[] = [
  "pending_review",
  "approved",
];

export const draftQuestionSchema = z.object({
  id: z.string().min(1).max(200),
  label: z.string().min(1).max(2000),
  type: z
    .enum(["text", "textarea", "select", "boolean", "number", "file"])
    .default("text"),
  required: z.boolean().default(false),
});

export type DraftQuestion = z.infer<typeof draftQuestionSchema>;

export const draftAnswerSchema = z.object({
  questionId: z.string().min(1).max(200),
  value: z.string().max(10000),
  /**
   * Evidence pointer(s) the answer is grounded in — e.g. a profile_bank entry
   * id or a short quote. Empty string / absent means UNGROUNDED (flagged).
   */
  groundedIn: z.string().max(2000).optional().default(""),
  /** Agent confidence in [0,1]. */
  confidence: z.number().min(0).max(1).default(0),
  /** Human-readable source label, e.g. "bank: backend-experience". */
  source: z.string().max(500).optional().default(""),
});

export type DraftAnswer = z.infer<typeof draftAnswerSchema>;

export interface ApplicationDraft {
  id: string;
  jobId: string;
  questions: DraftQuestion[];
  answers: DraftAnswer[];
  status: DraftStatus;
  authoredBy: string;
  createdAt: string;
  reviewedAt: string | null;
  submittedAt: string | null;
  submitResult: unknown | null;
}

/** Whether an answer is grounded (has a non-empty evidence pointer). */
export function isGrounded(answer: DraftAnswer): boolean {
  return (
    typeof answer.groundedIn === "string" && answer.groundedIn.trim().length > 0
  );
}

/** Answers that are NOT grounded — surfaced in the UI and never auto-trusted. */
export function ungroundedAnswers(answers: DraftAnswer[]): DraftAnswer[] {
  return answers.filter((a) => !isGrounded(a));
}

export function isDraftStatus(value: unknown): value is DraftStatus {
  return (
    typeof value === "string" &&
    (DRAFT_STATUSES as readonly string[]).includes(value)
  );
}

/** Body schema for creating/updating a draft from an agent. */
export const draftUpsertSchema = z.object({
  jobId: z.string().min(1).max(200),
  questions: z.array(draftQuestionSchema).max(200),
  answers: z.array(draftAnswerSchema).max(200),
  authoredBy: z.string().max(200).optional(),
});

export type DraftUpsertInput = z.infer<typeof draftUpsertSchema>;

/** Body schema for the review UI editing answers / moving status. */
export const draftReviewSchema = z
  .object({
    answers: z.array(draftAnswerSchema).max(200),
    status: z.enum(["approved", "rejected", "pending_review"]),
  })
  .partial()
  .refine((v) => v.answers !== undefined || v.status !== undefined, {
    message: "Provide answers, status, or both.",
  });

export type DraftReviewInput = z.infer<typeof draftReviewSchema>;
