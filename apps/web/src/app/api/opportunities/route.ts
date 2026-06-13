import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth";
import { jobToOpportunity } from "@/lib/opportunities";
import {
  countJobsGroupedByStatus,
  createJob,
  listJobsPaginated,
  makeJobCursor,
  type JobListSort,
} from "@/lib/db/jobs-async";
import { enrichCompany } from "@/lib/enrichment";
import {
  gateOptionalAiFeature,
  isAiGateResponse,
  type OptionalAiGatePass,
} from "@/lib/billing/ai-gate";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import { TECH_KEYWORDS } from "@/lib/constants";
import { createJobSchema } from "@/lib/validation/jobs";
import { OPPORTUNITY_STATUSES } from "@slothing/shared/schemas";
import { createOpportunitySchema } from "@/types/opportunity";
import { trackActivationEvent } from "@/lib/db/product-analytics";
import { safeTrackActivity } from "@/lib/streak/track";
import {
  buildPaginationResult,
  decodeCursor,
  InvalidCursorError,
  PaginationParamsSchema,
} from "@/lib/pagination";
import type { JobStatus, OpportunityStatus } from "@/types";

export const dynamic = "force-dynamic";

const createdAtCursorSchema = z.object({
  lastId: z.string(),
  lastCreatedAt: z.string(),
  lastSortValue: z.string().nullable().optional(),
  sortBy: z.enum(["createdAt", "deadline", "company", "salary"]).optional(),
});

const opportunitiesQuerySchema = PaginationParamsSchema.extend({
  status: z.string().optional(),
  q: z.string().trim().optional(),
  search: z.string().trim().optional(),
  sort: z
    .enum(["createdAt", "deadline", "scrapedAt", "company", "salary"])
    .optional(),
  remoteType: z.enum(["remote", "hybrid", "onsite", "all"]).optional(),
  type: z.string().trim().optional(),
  techStack: z.string().trim().optional(),
  tag: z.string().trim().optional(),
});

const opportunityStatuses = new Set<OpportunityStatus>(OPPORTUNITY_STATUSES);

// `JobStatus` aliases `OpportunityStatus` after F2.1, but we still translate
// the legacy URL params `offered` / `withdrawn` so cached clients keep working.
function statusParamToJobStatuses(
  value?: string,
): JobStatus[] | undefined | null {
  if (!value) return undefined;
  const statuses = value
    .split(",")
    .map((status) => status.trim())
    .filter(Boolean)
    .map((status) =>
      status === "offered"
        ? "offer"
        : status === "withdrawn"
          ? "dismissed"
          : status,
    )
    .filter((status): status is OpportunityStatus =>
      opportunityStatuses.has(status as OpportunityStatus),
    );
  return statuses.length ? statuses : null;
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = opportunitiesQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const cursor = decodeCursor(parsed.data.cursor, createdAtCursorSchema);
    const statuses = statusParamToJobStatuses(parsed.data.status);
    const sortBy = normalizeSortParam(parsed.data.sort);
    const query = parsed.data.q || parsed.data.search || undefined;
    const remote =
      parsed.data.remoteType === "remote"
        ? true
        : parsed.data.remoteType && parsed.data.remoteType !== "all"
          ? false
          : null;
    const keyword = firstNonAll(parsed.data.techStack, parsed.data.tag);
    const type = firstNonAll(parsed.data.type);
    if (statuses === null) {
      return NextResponse.json({
        jobs: [],
        opportunities: [],
        items: [],
        nextCursor: null,
        hasMore: false,
        statusCounts: emptyStatusCounts(),
        totalMatching: 0,
      });
    }
    // The page of jobs and the status-count rollup are independent — run them
    // concurrently so a remote DB pays one round-trip, not two sequentially.
    const [jobs, statusCountRows] = await Promise.all([
      listJobsPaginated({
        userId: authResult.userId,
        statuses,
        cursor,
        limit: parsed.data.limit,
        query,
        remote,
        type,
        keyword,
        sortBy,
      }),
      countJobsGroupedByStatus({
        userId: authResult.userId,
        query,
        remote,
        type,
        keyword,
      }),
    ]);
    const page = buildPaginationResult(jobs, parsed.data.limit, (job) =>
      makeJobCursor(job, sortBy),
    );
    const statusCounts = normalizeStatusCounts(statusCountRows);
    const opportunities = page.items.map(jobToOpportunity);
    return NextResponse.json({
      jobs: page.items,
      opportunities,
      items: opportunities,
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
      statusCounts,
      totalMatching: sumMatchingStatuses(statusCounts, statuses),
    });
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }
    console.error("List opportunities error:", error);
    return NextResponse.json(
      { error: "Failed to list opportunities" },
      { status: 500 },
    );
  }
}

function normalizeSortParam(value?: string): JobListSort {
  if (value === "deadline" || value === "company" || value === "salary") {
    return value;
  }
  return "createdAt";
}

function firstNonAll(...values: Array<string | undefined>): string | null {
  const value = values.find((item) => item && item !== "all")?.trim();
  return value || null;
}

function emptyStatusCounts(): Record<OpportunityStatus, number> {
  return Object.fromEntries(
    OPPORTUNITY_STATUSES.map((status) => [status, 0]),
  ) as Record<OpportunityStatus, number>;
}

function normalizeStatusCounts(
  counts: Record<string, number>,
): Record<OpportunityStatus, number> {
  const normalized = emptyStatusCounts();
  for (const status of OPPORTUNITY_STATUSES) {
    normalized[status] = counts[status] ?? 0;
  }
  return normalized;
}

function sumMatchingStatuses(
  counts: Record<OpportunityStatus, number>,
  statuses: JobStatus[] | undefined,
): number {
  const selectedStatuses = statuses?.length
    ? statuses
    : (OPPORTUNITY_STATUSES as readonly OpportunityStatus[]);
  return selectedStatuses.reduce(
    (sum, status) => sum + (counts[status as OpportunityStatus] ?? 0),
    0,
  );
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;
  let aiGate: OptionalAiGatePass | null = null;

  try {
    const body = await request.json();
    const legacyJobParseResult = createJobSchema.safeParse(body);
    if (legacyJobParseResult.success) {
      const data = legacyJobParseResult.data;
      let keywords: string[] = [];

      const gate = await gateOptionalAiFeature(
        authResult.userId,
        "document_assistant",
        `opportunity:${data.company}:${data.title}`,
      );
      if (isAiGateResponse(gate)) return gate;
      aiGate = gate;
      let usedLLM = false;
      let fallbackReason: "provider_not_configured" | "llm_error" | null =
        gate.llmConfig ? null : "provider_not_configured";
      if (gate.llmConfig) {
        try {
          const client = new LLMClient(gate.llmConfig);
          const response = await client.complete({
            messages: [
              {
                role: "user",
                content: `Extract the key skills, technologies, and requirements from this job description. Return ONLY a JSON array of strings, nothing else.

Job Description:
${data.description}

Return format: ["skill1", "skill2", "skill3", ...]`,
              },
            ],
            temperature: 0.1,
            maxTokens: 500,
          });
          keywords = parseJSONFromLLM<string[]>(response);
          usedLLM = true;
        } catch (llmError) {
          aiGate?.refund();
          fallbackReason = "llm_error";
          console.error("Failed to extract keywords:", llmError);
          keywords = extractKeywordsBasic(data.description);
        }
      } else {
        keywords = extractKeywordsBasic(data.description);
      }

      const job = await createJob(
        {
          ...data,
          requirements: data.requirements ?? [],
          responsibilities: data.responsibilities ?? [],
          keywords,
        },
        authResult.userId,
      );
      scheduleCompanyEnrichment(job.company, job.url, authResult.userId);
      const { unlocked } = await safeTrackActivity(
        authResult.userId,
        "opp_created",
      );
      try {
        await trackActivationEvent({
          event: "opportunity_created",
          userId: authResult.userId,
          source: "api/opportunities",
          metadata: { mode: "legacy_job_schema" },
        });
      } catch (analyticsError) {
        console.error("Opportunity analytics failed:", analyticsError);
      }

      return NextResponse.json(
        {
          job,
          opportunity: jobToOpportunity(job),
          unlocked,
          usedLLM,
          fallbackUsed: !usedLLM,
          fallbackReason,
        },
        { status: 201 },
      );
    }

    const parseResult = createOpportunitySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.flatten() },
        { status: 400 },
      );
    }
    const data = parseResult.data;
    const job = await createJob(
      {
        title: data.title,
        company: data.company,
        description: data.summary,
        location: [data.city, data.province, data.country]
          .filter(Boolean)
          .join(", "),
        url: data.sourceUrl,
        requirements: data.requiredSkills ?? [],
        responsibilities: data.responsibilities ?? [],
        keywords: [...(data.techStack ?? []), ...(data.tags ?? [])],
        type: data.jobType === "co-op" ? "internship" : data.jobType,
        remote: data.remoteType === "remote",
        salary:
          data.salaryMin != null || data.salaryMax != null
            ? [data.salaryMin, data.salaryMax]
                .filter((value) => value != null)
                .join(" - ")
            : undefined,
        status: data.status,
        notes: data.notes,
        deadline: data.deadline,
      },
      authResult.userId,
    );
    scheduleCompanyEnrichment(job.company, job.url, authResult.userId);
    const { unlocked } = await safeTrackActivity(
      authResult.userId,
      "opp_created",
    );
    try {
      await trackActivationEvent({
        event: "opportunity_created",
        userId: authResult.userId,
        source: "api/opportunities",
        metadata: { mode: "opportunity_schema" },
      });
    } catch (analyticsError) {
      console.error("Opportunity analytics failed:", analyticsError);
    }
    return NextResponse.json(
      { job, opportunity: jobToOpportunity(job), unlocked },
      { status: 201 },
    );
  } catch (error) {
    aiGate?.refund();
    console.error("Create opportunity error:", error);
    return NextResponse.json(
      { error: "Failed to create opportunity" },
      { status: 500 },
    );
  }
}

function scheduleCompanyEnrichment(
  companyName: string,
  companyUrl: string | undefined,
  userId: string,
): void {
  if (process.env.NODE_ENV === "test") return;
  void enrichCompany({
    companyName,
    companyUrl,
    userId,
  }).catch((error) => {
    console.error("[enrichment] background failed", error);
  });
}

function extractKeywordsBasic(text: string): string[] {
  const lowerText = text.toLowerCase();
  return TECH_KEYWORDS.filter((keyword) => lowerText.includes(keyword));
}
