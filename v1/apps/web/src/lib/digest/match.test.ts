import { describe, expect, it, vi } from "vitest";
import type { JobDescription, Profile } from "@/types";

vi.mock("@/lib/scoring", () => ({
  scoreResume: vi.fn(({ job }) => ({
    overall: Number(job.id.replace("job-", "")),
    subScores: {
      keywordMatch: {
        evidence: [`keyword-${job.id}`],
        notes: [],
      },
    },
  })),
}));

import { selectTopMatches } from "./match";

const profile: Profile = {
  id: "profile-1",
  contact: { name: "Ada" },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

function job(
  id: number,
  createdAt = `2026-05-10T00:00:0${id}.000Z`,
): JobDescription {
  return {
    id: `job-${id}`,
    title: `Job ${id}`,
    company: "Acme",
    description: "Build",
    requirements: [],
    responsibilities: [],
    keywords: [],
    createdAt,
  };
}

describe("selectTopMatches", () => {
  it("returns an empty list for empty input", () => {
    expect(selectTopMatches(profile, [])).toEqual([]);
  });

  it("sorts by score, caps by k, and filters below min score", () => {
    const matches = selectTopMatches(
      profile,
      [job(1), job(4), job(2), job(3)],
      2,
      2,
    );

    expect(matches.map((match) => match.job.id)).toEqual(["job-4", "job-3"]);
    expect(matches).toHaveLength(2);
  });
});
