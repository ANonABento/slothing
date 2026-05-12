import {
  getJob,
  getJobs,
  listJobsPaginated,
  updateJob,
  updateJobStatus,
  type CreatedAtCursor,
} from "@/lib/db/jobs";
import { buildPaginationResult } from "@/lib/pagination";
import type { JobDescription, Opportunity, OpportunityStatus } from "@/types";

export interface OpportunityLinkInput {
  resumeId?: string;
  coverLetterId?: string;
}

const OPPORTUNITY_STATUSES = new Set<OpportunityStatus>([
  "pending",
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "expired",
  "dismissed",
]);

const JOB_STATUS_TO_OPPORTUNITY_STATUS: Record<
  NonNullable<JobDescription["status"]>,
  OpportunityStatus
> = {
  pending: "pending",
  saved: "saved",
  applied: "applied",
  interviewing: "interviewing",
  offered: "offer",
  rejected: "rejected",
  withdrawn: "dismissed",
  dismissed: "dismissed",
};

const OPPORTUNITY_STATUS_TO_JOB_STATUS: Record<
  OpportunityStatus,
  NonNullable<JobDescription["status"]>
> = {
  pending: "pending",
  saved: "saved",
  applied: "applied",
  interviewing: "interviewing",
  offer: "offered",
  rejected: "rejected",
  expired: "withdrawn",
  dismissed: "dismissed",
};

function normalizeStatus(status: JobDescription["status"]): OpportunityStatus {
  return status ? JOB_STATUS_TO_OPPORTUNITY_STATUS[status] : "saved";
}

function normalizeStatusFilter(status: string): OpportunityStatus | null {
  const trimmedStatus = status.trim();
  const normalized =
    trimmedStatus === "offered"
      ? "offer"
      : trimmedStatus === "withdrawn"
        ? "dismissed"
        : trimmedStatus;
  return OPPORTUNITY_STATUSES.has(normalized as OpportunityStatus)
    ? (normalized as OpportunityStatus)
    : null;
}

export function jobToOpportunity(job: JobDescription): Opportunity {
  const [city, province, ...countryParts] = (job.location ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const salaryRange = parseSalaryRange(job.salary);

  return {
    id: job.id,
    type: "job",
    title: job.title,
    company: job.company,
    source: "manual",
    sourceUrl: job.url,
    city,
    province,
    country: countryParts.join(", ") || undefined,
    remoteType: job.remote ? "remote" : undefined,
    jobType: job.type === "internship" ? "internship" : job.type,
    summary: job.description.trim(),
    responsibilities: job.responsibilities,
    requiredSkills: job.requirements,
    salaryMin: salaryRange.salaryMin,
    salaryMax: salaryRange.salaryMax,
    status: normalizeStatus(job.status),
    appliedAt: job.appliedAt,
    deadline: job.deadline,
    tags: job.keywords,
    notes: job.notes,
    linkedResumeId: job.linkedResumeId,
    linkedCoverLetterId: job.linkedCoverLetterId,
    createdAt: job.createdAt,
    updatedAt: job.createdAt,
  };
}

function parseSalaryRange(salary?: string): {
  salaryMin?: number;
  salaryMax?: number;
} {
  if (!salary) return {};

  const values = salary
    .match(/\d[\d,]*(?:\.\d+)?/g)
    ?.map((value) => Number(value.replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));

  if (!values?.length) return {};

  return {
    salaryMin: values[0],
    salaryMax: values[1],
  };
}

export interface ListOpportunitiesParams {
  userId: string;
  statuses?: string[];
  cursor?: CreatedAtCursor | null;
  limit: number;
}

export function listOpportunities({
  userId,
  statuses,
  cursor,
  limit,
}: ListOpportunitiesParams) {
  const requestedStatuses = statuses?.filter(Boolean) ?? [];
  const allowedStatuses = requestedStatuses
    .map(normalizeStatusFilter)
    .filter((status): status is OpportunityStatus => status !== null)
    .map((status) => OPPORTUNITY_STATUS_TO_JOB_STATUS[status]);

  if (requestedStatuses.length > 0 && allowedStatuses.length === 0) {
    return { items: [], nextCursor: null, hasMore: false };
  }

  const jobs = listJobsPaginated({
    userId,
    statuses: requestedStatuses.length > 0 ? allowedStatuses : undefined,
    cursor,
    limit,
  });

  return buildPaginationResult(
    jobs.map(jobToOpportunity),
    limit,
    (opportunity) => ({
      lastId: opportunity.id,
      lastCreatedAt: opportunity.createdAt,
    }),
  );
}

export function listAllOpportunities(
  userId: string,
  statuses?: string[],
): Opportunity[] {
  const requestedStatuses = statuses?.filter(Boolean) ?? [];
  const allowedStatuses = new Set(
    requestedStatuses
      .map(normalizeStatusFilter)
      .filter((status) => status !== null),
  );
  const shouldFilter = requestedStatuses.length > 0;

  return getJobs(userId)
    .map(jobToOpportunity)
    .filter(
      (opportunity) => !shouldFilter || allowedStatuses.has(opportunity.status),
    );
}

export function getOpportunity(id: string, userId: string): Opportunity | null {
  const job = getJob(id, userId);
  return job ? jobToOpportunity(job) : null;
}

export function linkOpportunityDocument(
  id: string,
  input: OpportunityLinkInput,
  userId: string,
): Opportunity | null {
  const existing = getJob(id, userId);
  if (!existing) return null;

  const resumeId = input.resumeId?.trim();
  const coverLetterId = input.coverLetterId?.trim();

  updateJob(
    id,
    {
      linkedResumeId: resumeId || existing.linkedResumeId,
      linkedCoverLetterId: coverLetterId || existing.linkedCoverLetterId,
    },
    userId,
  );

  return getOpportunity(id, userId);
}

export function changeOpportunityStatus(
  id: string,
  status: string,
  userId: string,
): Opportunity | null {
  const existing = getJob(id, userId);
  if (!existing) return null;

  const opportunityStatus = normalizeStatusFilter(status);
  if (!opportunityStatus) return null;

  const jobStatus = OPPORTUNITY_STATUS_TO_JOB_STATUS[opportunityStatus];
  updateJobStatus(id, jobStatus, undefined, userId);
  return getOpportunity(id, userId);
}

export function getJobStatusForOpportunityStatus(
  status: OpportunityStatus,
): NonNullable<JobDescription["status"]> {
  return OPPORTUNITY_STATUS_TO_JOB_STATUS[status];
}
