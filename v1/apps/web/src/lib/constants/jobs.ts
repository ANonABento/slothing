import { z } from "zod";
import {
  OPPORTUNITY_STATUSES,
  opportunityStatusSchema,
  type OpportunityStatus,
} from "@slothing/shared/schemas";

// F2.1 consolidation: the legacy 8-value `JOB_STATUSES` array (with `offered`,
// `withdrawn`, …) was removed. The canonical status set is
// `OPPORTUNITY_STATUSES` from `@slothing/shared/schemas` — re-exported here
// under the legacy names so existing imports keep compiling without having to
// touch every call-site at once.
export const JOB_STATUSES = OPPORTUNITY_STATUSES;

export type JobStatus = OpportunityStatus;

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending: "Pending",
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  expired: "Expired",
  dismissed: "Dismissed",
};

export const jobStatusSchema = opportunityStatusSchema;

// "Tracked" subset = the statuses surfaced by the legacy kanban/filter UI.
// Now expressed against the canonical names (`offer`, not `offered`).
export const TRACKED_JOB_STATUSES = [
  "pending",
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
] as const;

export type TrackedJobStatus = (typeof TRACKED_JOB_STATUSES)[number];

export const TRACKED_JOB_STATUS_LABELS: Record<TrackedJobStatus, string> = {
  pending: "Pending",
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
};

const TRACKED_JOB_STATUS_VALUES = new Set<string>(TRACKED_JOB_STATUSES);

export function isTrackedJobStatus(
  status: string | undefined | null,
): status is TrackedJobStatus {
  return Boolean(status && TRACKED_JOB_STATUS_VALUES.has(status));
}

export function getTrackedJobStatus(
  status: string | undefined | null,
): TrackedJobStatus {
  return isTrackedJobStatus(status) ? status : "saved";
}

// Job types
export const JOB_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

export const jobTypeSchema = z.enum(JOB_TYPES);

// F2.2 consolidation: `createJobSchema`, `updateJobSchema`, `importJobSchema`
// and `importJobsArraySchema` used to live here next to the status enums.
// They moved to `@/lib/validation/jobs` (still re-exported via
// `@/lib/constants` for back-compat) so the schema definitions sit on the
// validation boundary, not buried in a constants module.

// Tech keywords for job parsing
export const TECH_KEYWORDS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "go",
  "rust",
  "react",
  "vue",
  "angular",
  "node",
  "express",
  "django",
  "flask",
  "aws",
  "gcp",
  "azure",
  "docker",
  "kubernetes",
  "terraform",
  "sql",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "git",
  "ci/cd",
  "jenkins",
  "github actions",
  "agile",
  "scrum",
  "jira",
  "confluence",
  "rest",
  "graphql",
  "api",
  "microservices",
  "machine learning",
  "ai",
  "data science",
  "analytics",
] as const;
