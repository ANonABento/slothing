import { z } from "zod";

export const jobStatusSchema = z.enum([
  "pending",
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
]);

export const jobTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
]);

export const createJobSchema = z.object({
  title: z
    .string()
    .min(1, "Job title is required")
    .max(200, "Title is too long"),
  company: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name is too long"),
  location: z
    .string()
    .max(200, "Location is too long")
    .optional()
    .or(z.literal("")),
  type: jobTypeSchema.optional(),
  remote: z.boolean().default(false),
  salary: z
    .string()
    .max(100, "Salary is too long")
    .optional()
    .or(z.literal("")),
  description: z.string().min(1, "Job description is required"),
  requirements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  url: z.string().url("Invalid job URL").optional().or(z.literal("")),
  status: jobStatusSchema.default("saved"),
  appliedAt: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string().max(5000, "Notes are too long").optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const jobStatusUpdateSchema = z.object({
  status: jobStatusSchema,
  appliedAt: z.string().optional(),
});

export type JobStatusInput = z.infer<typeof jobStatusSchema>;
export type JobTypeInput = z.infer<typeof jobTypeSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobStatusUpdateInput = z.infer<typeof jobStatusUpdateSchema>;

export function validateCreateJob(
  data: unknown,
):
  | { success: true; data: CreateJobInput }
  | { success: false; errors: z.ZodError } {
  const result = createJobSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateUpdateJob(
  data: unknown,
):
  | { success: true; data: UpdateJobInput }
  | { success: false; errors: z.ZodError } {
  const result = updateJobSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateJobStatusUpdate(
  data: unknown,
):
  | { success: true; data: JobStatusUpdateInput }
  | { success: false; errors: z.ZodError } {
  const result = jobStatusUpdateSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export const OPPORTUNITY_TYPES = ["job", "hackathon"] as const;
export const OPPORTUNITY_SOURCES = [
  "waterlooworks",
  "linkedin",
  "indeed",
  "greenhouse",
  "lever",
  "devpost",
  "manual",
  "url",
] as const;
export const OPPORTUNITY_REMOTE_TYPES = ["remote", "hybrid", "onsite"] as const;
export const OPPORTUNITY_JOB_TYPES = [
  "co-op",
  "full-time",
  "part-time",
  "contract",
  "internship",
] as const;
export const OPPORTUNITY_LEVELS = [
  "junior",
  "intermediate",
  "senior",
  "lead",
  "principal",
  "other",
  "staff",
] as const;
export const OPPORTUNITY_STATUSES = [
  "pending",
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "expired",
  "dismissed",
] as const;

export const KANBAN_LANE_IDS = [
  "pending",
  "saved",
  "applied",
  "interviewing",
  "offer",
  "closed",
] as const;

export const CLOSED_SUB_STATUSES = [
  "rejected",
  "expired",
  "dismissed",
] as const;

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];
export type OpportunitySource = (typeof OPPORTUNITY_SOURCES)[number];
export type OpportunityRemoteType = (typeof OPPORTUNITY_REMOTE_TYPES)[number];
export type OpportunityJobType = (typeof OPPORTUNITY_JOB_TYPES)[number];
export type OpportunityLevel = (typeof OPPORTUNITY_LEVELS)[number];
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];
export type KanbanLaneId = (typeof KANBAN_LANE_IDS)[number];
export type ClosedSubStatus = (typeof CLOSED_SUB_STATUSES)[number];

export const KANBAN_LANE_GROUPS: Record<
  KanbanLaneId,
  readonly OpportunityStatus[]
> = {
  pending: ["pending"],
  saved: ["saved"],
  applied: ["applied"],
  interviewing: ["interviewing"],
  offer: ["offer"],
  closed: CLOSED_SUB_STATUSES,
};

export const DEFAULT_KANBAN_VISIBLE_LANES: readonly KanbanLaneId[] =
  KANBAN_LANE_IDS;

const STATUS_TO_KANBAN_LANE = Object.fromEntries(
  KANBAN_LANE_IDS.flatMap((lane) =>
    KANBAN_LANE_GROUPS[lane].map((status) => [status, lane] as const),
  ),
) as Record<OpportunityStatus, KanbanLaneId>;

export function inferLaneFromStatus(status: OpportunityStatus): KanbanLaneId {
  return STATUS_TO_KANBAN_LANE[status];
}

export function isClosedSubStatus(
  status: OpportunityStatus,
): status is ClosedSubStatus {
  return (CLOSED_SUB_STATUSES as readonly OpportunityStatus[]).includes(status);
}

export function normalizeKanbanVisibleLanes(input: unknown): KanbanLaneId[] {
  const parsedInput =
    typeof input === "string" ? parseJsonSafely(input) : input;
  if (!Array.isArray(parsedInput)) {
    return [...DEFAULT_KANBAN_VISIBLE_LANES];
  }

  const selected = KANBAN_LANE_IDS.filter((lane) => parsedInput.includes(lane));

  return selected.length > 0 ? selected : [...DEFAULT_KANBAN_VISIBLE_LANES];
}

function parseJsonSafely(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  company: string;
  division?: string;
  source: OpportunitySource;
  sourceUrl?: string;
  sourceId?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  region?: string;
  remoteType?: OpportunityRemoteType;
  additionalLocationInfo?: string;
  jobType?: OpportunityJobType;
  level?: OpportunityLevel;
  openings?: number;
  workTerm?: string;
  applicationMethod?: string;
  requiredDocuments?: string[];
  targetedDegrees?: string[];
  targetedClusters?: string[];
  prizes?: string[];
  teamSize?: { min: number; max: number };
  tracks?: string[];
  submissionUrl?: string;
  summary: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  techStack?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  benefits?: string[];
  deadline?: string;
  additionalInfo?: string;
  status: OpportunityStatus;
  scrapedAt?: string;
  savedAt?: string;
  appliedAt?: string;
  tags: string[];
  notes?: string;
  linkedResumeId?: string;
  linkedCoverLetterId?: string;
  createdAt: string;
  updatedAt: string;
}

const requiredText = (max: number, field: string) =>
  z.string().trim().min(1, `${field} is required`).max(max);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value === "" ? undefined : value));

const optionalStringList = z
  .array(z.string().trim().min(1).max(200))
  .optional();

const optionalUrl = z
  .union([z.string().trim().url(), z.literal("")])
  .optional()
  .transform((value) => (value === "" ? undefined : value));

export const opportunityTypeSchema = z.enum(OPPORTUNITY_TYPES);
export const opportunitySourceSchema = z.enum(OPPORTUNITY_SOURCES);
export const opportunityRemoteTypeSchema = z.enum(OPPORTUNITY_REMOTE_TYPES);
export const opportunityJobTypeSchema = z.enum(OPPORTUNITY_JOB_TYPES);
export const opportunityLevelSchema = z.enum(OPPORTUNITY_LEVELS);
export const opportunityStatusSchema = z.enum(OPPORTUNITY_STATUSES);
export const kanbanLaneIdSchema = z.enum(KANBAN_LANE_IDS);
export const kanbanVisibleLanesSchema = z
  .array(kanbanLaneIdSchema)
  .min(1, "At least one kanban lane must remain visible");

const opportunityTeamSizeSchema = z
  .object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  })
  .refine((value) => value.min <= value.max, {
    message:
      "Minimum team size must be less than or equal to maximum team size",
    path: ["min"],
  });

const salaryRangeRefinement = {
  message: "Minimum salary must be less than or equal to maximum salary",
  path: ["salaryMin"],
};

const hasValidSalaryRange = (value: {
  salaryMin?: number;
  salaryMax?: number;
}) =>
  value.salaryMin === undefined ||
  value.salaryMax === undefined ||
  value.salaryMin <= value.salaryMax;

const opportunityInputFields = {
  type: opportunityTypeSchema,
  title: requiredText(200, "Title"),
  company: requiredText(200, "Company"),
  division: optionalText(200),
  source: opportunitySourceSchema,
  sourceUrl: optionalUrl,
  sourceId: optionalText(200),
  city: optionalText(120),
  province: optionalText(120),
  country: optionalText(120),
  postalCode: optionalText(40),
  region: optionalText(120),
  remoteType: opportunityRemoteTypeSchema.optional(),
  additionalLocationInfo: optionalText(500),
  jobType: opportunityJobTypeSchema.optional(),
  level: opportunityLevelSchema.optional(),
  openings: z.number().int().positive().optional(),
  workTerm: optionalText(120),
  applicationMethod: optionalText(120),
  requiredDocuments: optionalStringList,
  targetedDegrees: optionalStringList,
  targetedClusters: optionalStringList,
  prizes: optionalStringList,
  teamSize: opportunityTeamSizeSchema.optional(),
  tracks: optionalStringList,
  submissionUrl: optionalUrl,
  summary: requiredText(50000, "Summary"),
  responsibilities: optionalStringList,
  requiredSkills: optionalStringList,
  preferredSkills: optionalStringList,
  techStack: optionalStringList,
  salaryMin: z.number().nonnegative().optional(),
  salaryMax: z.number().nonnegative().optional(),
  salaryCurrency: optionalText(12),
  benefits: optionalStringList,
  deadline: optionalText(80),
  additionalInfo: optionalText(5000),
  scrapedAt: optionalText(80),
  savedAt: optionalText(80),
  appliedAt: optionalText(80),
  notes: optionalText(5000),
  linkedResumeId: optionalText(200),
  linkedCoverLetterId: optionalText(200),
} as const;

const updateOpportunityInputFields = Object.fromEntries(
  Object.entries(opportunityInputFields).map(([key, schema]) => [
    key,
    schema.optional(),
  ]),
) as {
  [Key in keyof typeof opportunityInputFields]: z.ZodOptional<
    (typeof opportunityInputFields)[Key]
  >;
};

export const createOpportunitySchema = z
  .object({
    ...opportunityInputFields,
    status: opportunityStatusSchema.default("pending"),
    tags: z.array(z.string().trim().min(1).max(80)).default([]),
  })
  .refine(hasValidSalaryRange, salaryRangeRefinement);

export const updateOpportunitySchema = z
  .object({
    ...updateOpportunityInputFields,
    status: opportunityStatusSchema.optional(),
    tags: z.array(z.string().trim().min(1).max(80)).optional(),
  })
  .refine(hasValidSalaryRange, salaryRangeRefinement);

export const opportunitySchema = z
  .object({
    ...opportunityInputFields,
    id: requiredText(200, "ID"),
    status: opportunityStatusSchema,
    tags: z.array(z.string().trim().min(1).max(80)),
    createdAt: requiredText(80, "Created at"),
    updatedAt: requiredText(80, "Updated at"),
  })
  .refine(hasValidSalaryRange, salaryRangeRefinement);

export const opportunityStatusChangeSchema = z.object({
  status: opportunityStatusSchema,
});

export const opportunityFiltersSchema = z.object({
  type: opportunityTypeSchema.optional(),
  status: opportunityStatusSchema.optional(),
  source: opportunitySourceSchema.optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  search: z.string().trim().optional(),
});

export type CreateOpportunityInput = z.input<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.input<typeof updateOpportunitySchema>;
export type OpportunityFilters = z.infer<typeof opportunityFiltersSchema>;
export type OpportunityStatusChangeInput = z.input<
  typeof opportunityStatusChangeSchema
>;
