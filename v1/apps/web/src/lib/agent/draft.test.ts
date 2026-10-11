import { describe, expect, it } from "vitest";
import {
  DRAFT_STATUSES,
  OPEN_DRAFT_STATUSES,
  draftAnswerSchema,
  draftReviewSchema,
  draftUpsertSchema,
  isDraftStatus,
  isGrounded,
  ungroundedAnswers,
} from "./draft";

describe("draft statuses", () => {
  it("validates membership", () => {
    expect(isDraftStatus("pending_review")).toBe(true);
    expect(isDraftStatus("submitted")).toBe(true);
    expect(isDraftStatus("nope")).toBe(false);
    expect(DRAFT_STATUSES).toContain("failed");
  });

  it("treats pending_review + approved as open", () => {
    expect(OPEN_DRAFT_STATUSES).toEqual(["pending_review", "approved"]);
  });
});

describe("grounding", () => {
  const grounded = draftAnswerSchema.parse({
    questionId: "q1",
    value: "6 years",
    groundedIn: "bank:exp-1",
    confidence: 0.9,
  });
  const ungrounded = draftAnswerSchema.parse({
    questionId: "q2",
    value: "I guess so",
  });

  it("flags answers without an evidence pointer", () => {
    expect(isGrounded(grounded)).toBe(true);
    expect(isGrounded(ungrounded)).toBe(false);
    expect(ungroundedAnswers([grounded, ungrounded])).toEqual([ungrounded]);
  });

  it("defaults groundedIn/confidence/source when omitted", () => {
    expect(ungrounded.groundedIn).toBe("");
    expect(ungrounded.confidence).toBe(0);
    expect(ungrounded.source).toBe("");
  });
});

describe("schemas", () => {
  it("accepts a valid upsert body", () => {
    const parsed = draftUpsertSchema.safeParse({
      jobId: "job-1",
      questions: [{ id: "q1", label: "Why us?" }],
      answers: [{ questionId: "q1", value: "Because…" }],
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects an upsert without a jobId", () => {
    expect(
      draftUpsertSchema.safeParse({ questions: [], answers: [] }).success,
    ).toBe(false);
  });

  it("requires at least one of answers/status on review", () => {
    expect(draftReviewSchema.safeParse({}).success).toBe(false);
    expect(draftReviewSchema.safeParse({ status: "approved" }).success).toBe(
      true,
    );
    expect(draftReviewSchema.safeParse({ status: "submitted" }).success).toBe(
      false,
    ); // not a review-settable status
  });
});
