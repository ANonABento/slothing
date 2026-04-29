import { describe, expect, it } from "vitest";
import type { JobDescription } from "@/types";
import {
  getDescriptionPreview,
  getOpportunityTags,
  getPendingOpportunities,
} from "./review-queue";

const baseJob: JobDescription = {
  id: "job-1",
  title: "Frontend Engineer",
  company: "Acme",
  description: "Build product experiences",
  requirements: [],
  responsibilities: [],
  keywords: [],
  createdAt: "2026-04-20T00:00:00.000Z",
};

describe("getPendingOpportunities", () => {
  it("returns only pending jobs ordered by nearest deadline then newest", () => {
    const jobs: JobDescription[] = [
      { ...baseJob, id: "saved", status: "saved" },
      { ...baseJob, id: "later", status: "pending", deadline: "2026-05-10", createdAt: "2026-04-25T00:00:00.000Z" },
      { ...baseJob, id: "sooner", status: "pending", deadline: "2026-05-01", createdAt: "2026-04-21T00:00:00.000Z" },
      { ...baseJob, id: "no-deadline", status: "pending", createdAt: "2026-04-26T00:00:00.000Z" },
    ];

    expect(getPendingOpportunities(jobs).map((job) => job.id)).toEqual([
      "sooner",
      "later",
      "no-deadline",
    ]);
  });
});

describe("getOpportunityTags", () => {
  it("deduplicates and limits keywords plus requirements", () => {
    expect(
      getOpportunityTags(
        {
          ...baseJob,
          keywords: ["React", "TypeScript", "React"],
          requirements: ["Node", " ", "SQL"],
        },
        3
      )
    ).toEqual(["React", "TypeScript", "Node"]);
  });
});

describe("getDescriptionPreview", () => {
  it("truncates long descriptions", () => {
    const preview = getDescriptionPreview("a".repeat(300));

    expect(preview).toHaveLength(263);
    expect(preview.endsWith("...")).toBe(true);
  });
});
