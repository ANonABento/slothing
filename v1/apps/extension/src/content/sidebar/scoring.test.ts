import { describe, expect, it } from "vitest";
import type { ExtensionProfile, ScrapedJob } from "@/shared/types";
import { computeJobMatchScore, scrapedJobToJobDescription } from "./scoring";

const scrapedJob: ScrapedJob = {
  title: "Frontend Engineer",
  company: "Acme",
  location: "Remote",
  description:
    "Build accessible React and TypeScript interfaces with strong product sense.",
  requirements: ["3+ years React", "TypeScript", "Accessibility"],
  responsibilities: ["Build product UI"],
  keywords: ["react", "typescript", "accessibility"],
  remote: true,
  type: "full-time",
  salary: "$120k - $150k",
  url: "https://www.linkedin.com/jobs/view/123",
  source: "linkedin",
  sourceJobId: "123",
};

const profile: ExtensionProfile = {
  id: "profile-1",
  contact: {
    name: "Ada Lovelace",
    email: "ada@example.com",
  },
  summary: "Frontend engineer focused on React, TypeScript, and accessibility.",
  experiences: [
    {
      id: "exp-1",
      company: "Widgets Inc",
      title: "Software Engineer",
      startDate: "2021-01",
      current: true,
      description: "Built React interfaces for a hiring product.",
      highlights: ["Improved accessibility scores by 35%"],
      skills: ["React", "TypeScript", "Accessibility"],
    },
  ],
  education: [],
  skills: [
    { id: "skill-1", name: "React", category: "technical" },
    { id: "skill-2", name: "TypeScript", category: "technical" },
  ],
  projects: [],
  certifications: [],
  rawText:
    "Ada Lovelace frontend engineer React TypeScript accessibility shipped measurable UI improvements.",
  computed: {},
};

describe("scrapedJobToJobDescription", () => {
  it("maps a scraped job into the shared scoring job shape", () => {
    const job = scrapedJobToJobDescription(scrapedJob, "2026-05-10T00:00:00Z");

    expect(job).toMatchObject({
      id: "123",
      title: "Frontend Engineer",
      company: "Acme",
      location: "Remote",
      requirements: scrapedJob.requirements,
      responsibilities: scrapedJob.responsibilities,
      keywords: scrapedJob.keywords,
      createdAt: "2026-05-10T00:00:00Z",
    });
  });

  it("falls back to the job URL when no source job id exists", () => {
    const job = scrapedJobToJobDescription({
      ...scrapedJob,
      sourceJobId: undefined,
    });

    expect(job.id).toBe(scrapedJob.url);
  });
});

describe("computeJobMatchScore", () => {
  it("returns null without a profile or job", () => {
    expect(computeJobMatchScore(null, scrapedJob)).toBeNull();
    expect(computeJobMatchScore(profile, null)).toBeNull();
  });

  it("returns a numeric score for a populated profile and job", () => {
    const score = computeJobMatchScore(profile, scrapedJob);

    expect(score?.overall).toEqual(expect.any(Number));
    expect(score!.overall).toBeGreaterThanOrEqual(0);
    expect(score!.overall).toBeLessThanOrEqual(100);
  });
});
