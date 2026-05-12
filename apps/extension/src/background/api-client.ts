// Columbus API client for extension

import type {
  AnswerBankMatch,
  ExtensionProfile,
  ExtensionResumeSummary,
  ScrapedJob,
  LearnedAnswer,
  SimilarAnswer,
  TrackedApplicationPayload,
  SaveCorrectionPayload,
} from "@/shared/types";
import { createOpportunitySchema } from "@slothing/shared/schemas";
import {
  clearSessionAuthCache,
  getStorage,
  markAuthSeen,
  setStorage,
} from "./storage";

export class ColumbusAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async getAuthToken(): Promise<string | null> {
    const storage = await getStorage();
    if (!storage.authToken) return null;

    // Check expiry
    if (storage.tokenExpiry) {
      const expiry = new Date(storage.tokenExpiry);
      if (expiry < new Date()) {
        // Token expired, clear it
        await setStorage({ authToken: undefined, tokenExpiry: undefined });
        return null;
      }
    }

    return storage.authToken;
  }

  private async authenticatedFetch<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = await this.getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Extension-Token": token,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid token AND the fast-path session cache (#30) so the
        // next popup open re-verifies instead of trusting a stale verdict.
        await setStorage({ authToken: undefined, tokenExpiry: undefined });
        await clearSessionAuthCache();
        throw new Error("Authentication expired");
      }
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    if (!token) return false;

    try {
      await this.authenticatedFetch("/api/extension/auth/verify");
      // Record the working-auth breadcrumb so the popup can distinguish a
      // true logout from a service-worker state-loss after this point.
      // See #27.
      await markAuthSeen();
      return true;
    } catch {
      return false;
    }
  }

  async getProfile(): Promise<ExtensionProfile> {
    return this.authenticatedFetch<ExtensionProfile>("/api/extension/profile");
  }

  async importJob(job: ScrapedJob): Promise<{
    imported: number;
    opportunityIds: string[];
    pendingCount: number;
  }> {
    const opportunity = {
      type: "job" as const,
      title: job.title,
      company: job.company,
      source: normalizeOpportunitySource(job.source),
      sourceUrl: job.url,
      sourceId: job.sourceJobId,
      summary: job.description,
      responsibilities: job.responsibilities || [],
      requiredSkills: job.requirements || [],
      techStack: job.keywords || [],
      jobType: job.type,
      remoteType: job.remote ? ("remote" as const) : undefined,
      deadline: job.deadline,
    };

    createOpportunitySchema.parse(opportunity);

    return this.authenticatedFetch("/api/opportunities/from-extension", {
      method: "POST",
      body: JSON.stringify({
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities || [],
        keywords: job.keywords || [],
        type: job.type,
        remote: job.remote,
        salary: job.salary,
        url: job.url,
        source: job.source,
        sourceJobId: job.sourceJobId,
        postedAt: job.postedAt,
        deadline: job.deadline,
      }),
    });
  }

  async importJobsBatch(jobs: ScrapedJob[]): Promise<{
    imported: number;
    opportunityIds: string[];
    pendingCount: number;
  }> {
    return this.authenticatedFetch("/api/opportunities/from-extension", {
      method: "POST",
      body: JSON.stringify({ jobs }),
    });
  }

  async trackApplied(payload: TrackedApplicationPayload): Promise<{
    opportunityId: string;
    deduped: boolean;
  }> {
    const scrapedJob = payload.scrapedJob || undefined;
    const title = scrapedJob?.title || payload.headline || payload.title;
    const company = scrapedJob?.company || payload.host.replace(/^www\./, "");
    const notes = [
      payload.headline ? `Headline: ${payload.headline}` : undefined,
      payload.thumbnailDataUrl
        ? "Screenshot captured by extension."
        : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    const response = await this.authenticatedFetch<{
      opportunityIds: string[];
      dedupedIds?: string[];
    }>("/api/opportunities/from-extension", {
      method: "POST",
      body: JSON.stringify({
        title,
        company,
        location: scrapedJob?.location,
        description:
          scrapedJob?.description ||
          payload.headline ||
          "Application submitted via extension.",
        requirements: scrapedJob?.requirements || [],
        responsibilities: scrapedJob?.responsibilities || [],
        keywords: scrapedJob?.keywords || [],
        type: scrapedJob?.type,
        remote: scrapedJob?.remote,
        salary: scrapedJob?.salary,
        url: scrapedJob?.url || payload.url,
        source: scrapedJob?.source || payload.host,
        sourceJobId: scrapedJob?.sourceJobId,
        postedAt: scrapedJob?.postedAt,
        deadline: scrapedJob?.deadline,
        status: "applied",
        appliedAt: payload.submittedAt,
        notes,
      }),
    });

    const opportunityId = response.opportunityIds[0];
    if (!opportunityId) {
      throw new Error("Application was not tracked");
    }

    return {
      opportunityId,
      deduped: Boolean(response.dedupedIds?.includes(opportunityId)),
    };
  }

  async tailorFromJob(
    job: ScrapedJob,
    baseResumeId?: string,
  ): Promise<{
    opportunityId: string;
    savedResume: { id: string };
    jobId: string;
  }> {
    const jobDescription = getReadableJobDescription(job);
    const imported = await this.importJob(job);
    const opportunityId = getImportedOpportunityId(imported.opportunityIds);

    const requestBody: {
      action: "generate";
      jobDescription: string;
      jobTitle: string;
      company: string;
      opportunityId: string;
      baseResumeId?: string;
    } = {
      action: "generate",
      jobDescription,
      jobTitle: job.title,
      company: job.company,
      opportunityId,
    };
    // Only thread the id through when the popup picked a non-default resume —
    // omitting the field keeps the request body byte-identical to the legacy
    // shape, so existing tests + telemetry don't churn for the master case.
    if (baseResumeId) {
      requestBody.baseResumeId = baseResumeId;
    }

    const response = await this.authenticatedFetch<{
      savedResume?: { id?: string };
      jobId?: string;
    }>("/api/tailor", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!response.savedResume?.id || !response.jobId) {
      throw new Error("Tailored resume was generated without a saved resume.");
    }

    return {
      opportunityId,
      savedResume: { id: response.savedResume.id },
      jobId: response.jobId,
    };
  }

  async listResumes(): Promise<ExtensionResumeSummary[]> {
    const response = await this.authenticatedFetch<{
      resumes: ExtensionResumeSummary[];
    }>("/api/extension/resumes");
    return response.resumes ?? [];
  }

  async generateCoverLetterFromJob(job: ScrapedJob): Promise<{
    opportunityId: string;
    savedCoverLetter: { id: string };
  }> {
    const jobDescription = getReadableJobDescription(job);
    const imported = await this.importJob(job);
    const opportunityId = getImportedOpportunityId(imported.opportunityIds);

    const response = await this.authenticatedFetch<{
      savedCoverLetter?: { id?: string };
    }>("/api/cover-letter/generate", {
      method: "POST",
      body: JSON.stringify({
        action: "generate",
        jobDescription,
        jobTitle: job.title,
        company: job.company,
        opportunityId,
      }),
    });

    if (!response.savedCoverLetter?.id) {
      throw new Error("Cover letter was generated without a saved document.");
    }

    return {
      opportunityId,
      savedCoverLetter: { id: response.savedCoverLetter.id },
    };
  }

  async saveLearnedAnswer(data: {
    question: string;
    answer: string;
    sourceUrl?: string;
    sourceCompany?: string;
  }): Promise<LearnedAnswer> {
    return this.authenticatedFetch("/api/extension/learned-answers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async searchSimilarAnswers(question: string): Promise<SimilarAnswer[]> {
    const response = await this.authenticatedFetch<{
      results: SimilarAnswer[];
    }>("/api/extension/learned-answers/search", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    return response.results;
  }

  // P2/#35 — inline answer-bank search on long textareas.
  // Calls /api/answer-bank/match with `q` and optional `limit` (defaults to 5
  // server-side, capped). Used by the floating bulb popover decorator.
  async matchAnswerBank(q: string, limit?: number): Promise<AnswerBankMatch[]> {
    const params = new URLSearchParams({ q });
    if (typeof limit === "number" && Number.isFinite(limit)) {
      params.set("limit", String(limit));
    }
    const response = await this.authenticatedFetch<{
      results: AnswerBankMatch[];
    }>(`/api/answer-bank/match?${params.toString()}`);
    return response.results;
  }

  async getLearnedAnswers(): Promise<LearnedAnswer[]> {
    const response = await this.authenticatedFetch<{
      answers: LearnedAnswer[];
    }>("/api/extension/learned-answers");
    return response.answers;
  }

  async deleteLearnedAnswer(id: string): Promise<void> {
    await this.authenticatedFetch(`/api/extension/learned-answers/${id}`, {
      method: "DELETE",
    });
  }

  async updateLearnedAnswer(
    id: string,
    answer: string,
  ): Promise<LearnedAnswer> {
    return this.authenticatedFetch(`/api/extension/learned-answers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ answer }),
    });
  }

  /**
   * Persist a user correction so the per-domain field mapping grows stronger
   * over time. See task #33 in docs/extension-roadmap-2026-05.md. The server
   * upserts into `field_mappings`, bumping `hit_count` on existing rows and
   * inserting fresh rows otherwise.
   */
  async saveCorrection(payload: SaveCorrectionPayload): Promise<{
    saved: boolean;
    hitCount: number;
  }> {
    return this.authenticatedFetch("/api/extension/field-mappings/correct", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

function getReadableJobDescription(job: ScrapedJob): string {
  const description = job.description?.trim() ?? "";
  if (description.length < 20) {
    throw new Error("Couldn't read the full job description from this page.");
  }
  return description;
}

function getImportedOpportunityId(opportunityIds: string[]): string {
  const opportunityId = opportunityIds[0];
  if (!opportunityId) {
    throw new Error("Job import did not return an opportunity id.");
  }
  return opportunityId;
}

function normalizeOpportunitySource(source: string) {
  const normalized = source.toLowerCase();
  if (normalized.includes("linkedin")) return "linkedin";
  if (normalized.includes("indeed")) return "indeed";
  if (normalized.includes("greenhouse")) return "greenhouse";
  if (normalized.includes("lever")) return "lever";
  if (normalized.includes("waterloo")) return "waterlooworks";
  if (normalized.includes("devpost")) return "devpost";
  return "url";
}

// Singleton instance
let client: ColumbusAPIClient | null = null;

export async function getAPIClient(): Promise<ColumbusAPIClient> {
  if (!client) {
    const storage = await getStorage();
    client = new ColumbusAPIClient(storage.apiBaseUrl);
  }
  return client;
}

export function resetAPIClient(): void {
  client = null;
}
