import type { ScrapedJob } from "../../src/shared/types";

type ParseResult =
  | { success: true; data: ScrapedJob }
  | { success: false; error: string };

const jobTypes = new Set(["full-time", "part-time", "contract", "internship"]);

function optionalString(value: unknown, max = 500) {
  return (
    value === undefined || (typeof value === "string" && value.length <= max)
  );
}

function optionalStringArray(value: unknown) {
  return (
    value === undefined ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}

function optionalUrl(value: unknown) {
  if (value === undefined || value === "") return true;
  if (typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const extensionOpportunitySchema = {
  safeParse(value: unknown): ParseResult {
    if (!value || typeof value !== "object") {
      return { success: false, error: "Expected object" };
    }

    const job = value as Partial<ScrapedJob>;

    if (typeof job.title !== "string" || job.title.trim().length === 0) {
      return { success: false, error: "Title is required" };
    }

    if (typeof job.company !== "string" || job.company.trim().length === 0) {
      return { success: false, error: "Company is required" };
    }

    if (job.title.length > 200 || job.company.length > 200) {
      return { success: false, error: "Title or company is too long" };
    }

    if (!optionalString(job.location)) {
      return { success: false, error: "Invalid location" };
    }

    if (!optionalString(job.description, 50_000)) {
      return { success: false, error: "Invalid description" };
    }

    if (!optionalStringArray(job.requirements)) {
      return { success: false, error: "Invalid requirements" };
    }

    if (!optionalStringArray(job.responsibilities)) {
      return { success: false, error: "Invalid responsibilities" };
    }

    if (!optionalStringArray(job.keywords)) {
      return { success: false, error: "Invalid keywords" };
    }

    if (job.type !== undefined && !jobTypes.has(job.type)) {
      return { success: false, error: "Invalid job type" };
    }

    if (job.remote !== undefined && typeof job.remote !== "boolean") {
      return { success: false, error: "Invalid remote flag" };
    }

    if (!optionalString(job.salary)) {
      return { success: false, error: "Invalid salary" };
    }

    if (!optionalUrl(job.url)) {
      return { success: false, error: "Invalid URL" };
    }

    if (!optionalString(job.deadline)) {
      return { success: false, error: "Invalid deadline" };
    }

    if (!optionalString(job.source)) {
      return { success: false, error: "Invalid source" };
    }

    if (!optionalString(job.sourceJobId)) {
      return { success: false, error: "Invalid source job ID" };
    }

    if (!optionalString(job.postedAt)) {
      return { success: false, error: "Invalid postedAt" };
    }

    return { success: true, data: job as ScrapedJob };
  },
};
