import { z } from "zod";

// Resume comparison schema
export const compareResumesSchema = z.object({
  beforeId: z.string().min(1, "Before resume ID is required"),
  afterId: z.string().min(1, "After resume ID is required"),
});

export type CompareResumesInput = z.infer<typeof compareResumesSchema>;

// Resume A/B tracking schemas
export const trackResumeSentSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  jobId: z.string().min(1, "Job ID is required"),
  notes: z.string().max(500).optional(),
});

export type TrackResumeSentInput = z.infer<typeof trackResumeSentSchema>;

export const updateTrackingOutcomeSchema = z.object({
  id: z.string().min(1, "Tracking entry ID is required"),
  outcome: z.enum(["applied", "screening", "interviewing", "offered", "rejected", "withdrawn"]),
});

export type UpdateTrackingOutcomeInput = z.infer<typeof updateTrackingOutcomeSchema>;
