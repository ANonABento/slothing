import { describe, expect, it } from "vitest";
import { loadBenchmarkDataset } from "../data/loader.js";
import type { BenchmarkDataset } from "../data/schema.js";
import {
  loadEvalCasesFromBenchmark,
  serializeJobAsDescription,
  serializeResumeAsProfile,
  toEvalCases,
} from "../data/to-eval-cases.js";

const dataset = loadBenchmarkDataset();

describe("benchmark eval wiring", () => {
  it("adapts the benchmark dataset into eval cases", () => {
    const evalCases = toEvalCases(dataset);
    const firstCase = evalCases[0];
    const firstBenchmarkCase = dataset.cases[0];

    expect(evalCases).toHaveLength(250);
    expect(firstCase.id).toBe("c-001");
    expect(firstCase.candidateProfile).toBeTruthy();
    expect(firstCase.jobDescription).toBeTruthy();
    expect(firstCase.label).toContain(firstBenchmarkCase.scenario);
  });

  it("includes resume skills and experience company in candidate profiles", () => {
    const resume = dataset.resumes[0];
    const profile = serializeResumeAsProfile(resume);

    expect(profile).toContain(resume.skills[0]);
    expect(profile).toContain(resume.experience[0].company);
    expect(profile).toContain(resume.candidateName);
  });

  it("includes job title, company, and must-haves in job descriptions", () => {
    const job = dataset.jobs[0];
    const description = serializeJobAsDescription(job);

    expect(description).toContain(job.title);
    expect(description).toContain(job.company);
    expect(description).toContain(job.mustHaves[0]);
  });

  it("populates expected keywords from job must-haves", () => {
    const evalCase = toEvalCases(dataset)[0];
    const job = dataset.jobs[0];

    expect(evalCase.expectedKeywords).toEqual(
      job.mustHaves.map((keyword) => keyword.toLowerCase()),
    );
  });

  it("loadEvalCasesFromBenchmark round-trips benchmark case order and IDs", () => {
    const evalCases = loadEvalCasesFromBenchmark();

    expect(evalCases).toHaveLength(dataset.cases.length);
    expect(evalCases.map((testCase) => testCase.id)).toEqual(
      dataset.cases.map((benchmarkCase) => benchmarkCase.id),
    );
  });

  it("joins resumes and jobs using benchmark case IDs", () => {
    const fixture: BenchmarkDataset = {
      resumes: [
        {
          id: "r-001",
          label: "Backend Engineer, 4 yrs",
          field: "software",
          subfield: "backend",
          seniorityLevel: "mid",
          seniorityYears: 4,
          candidateName: "Sam Patel",
          location: "Remote",
          summary: "Backend engineer focused on reliable services.",
          skills: ["Go", "PostgreSQL", "Observability"],
          experience: [
            {
              title: "Backend Engineer",
              company: "Northstar Systems",
              startYear: 2022,
              endYear: null,
              bullets: ["Built resilient APIs for billing workflows."],
            },
          ],
          education: [
            {
              degree: "BS Computer Science",
              school: "State University",
              year: 2020,
            },
          ],
          projects: [],
        },
      ],
      jobs: [
        {
          id: "j-001",
          resumeId: "r-001",
          scenario: "direct_match",
          title: "Platform Engineer",
          company: "Signal Forge",
          seniorityLevel: "mid",
          industry: "developer tools",
          description: "Build internal platform services.",
          mustHaves: ["Go", "PostgreSQL"],
          niceToHaves: ["Kubernetes"],
        },
      ],
      cases: [
        {
          id: "c-001",
          resumeId: "r-001",
          jdId: "j-001",
          scenario: "direct_match",
        },
      ],
      references: [],
    };

    expect(toEvalCases(fixture)).toEqual([
      expect.objectContaining({
        id: "c-001",
        label: "Backend Engineer, 4 yrs -> Platform Engineer (direct_match)",
        expectedKeywords: ["go", "postgresql"],
      }),
    ]);
  });
});
