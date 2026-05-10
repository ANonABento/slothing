import { describe, expect, it } from "vitest";
import { loadBenchmarkDataset } from "../data/loader.js";
import type { Scenario } from "../data/schema.js";

const dataset = loadBenchmarkDataset();
const scenarios: Scenario[] = ["direct_match", "stretch_up", "adjacent_role", "lateral_industry", "reach"];

describe("benchmark dataset", () => {
  it("loads the expected benchmark counts", () => {
    expect(dataset.resumes).toHaveLength(50);
    expect(dataset.jobs).toHaveLength(250);
    expect(dataset.cases).toHaveLength(250);
    expect(dataset.references).toHaveLength(25);
  });

  it("uses unique IDs", () => {
    expect(new Set(dataset.resumes.map((resume) => resume.id)).size).toBe(50);
    expect(new Set(dataset.jobs.map((job) => job.id)).size).toBe(250);
    expect(new Set(dataset.cases.map((benchmarkCase) => benchmarkCase.id)).size).toBe(250);
  });

  it("keeps jobs, cases, and references referentially intact", () => {
    const resumeIds = new Set(dataset.resumes.map((resume) => resume.id));
    const jobIds = new Set(dataset.jobs.map((job) => job.id));
    const caseIds = new Set(dataset.cases.map((benchmarkCase) => benchmarkCase.id));

    for (const job of dataset.jobs) {
      expect(resumeIds.has(job.resumeId)).toBe(true);
    }

    for (const benchmarkCase of dataset.cases) {
      expect(resumeIds.has(benchmarkCase.resumeId)).toBe(true);
      expect(jobIds.has(benchmarkCase.jdId)).toBe(true);
    }

    for (const reference of dataset.references) {
      expect(caseIds.has(reference.caseId)).toBe(true);
    }
  });

  it("gives every resume exactly one job per scenario", () => {
    for (const resume of dataset.resumes) {
      const resumeJobs = dataset.jobs.filter((job) => job.resumeId === resume.id);
      expect(resumeJobs).toHaveLength(5);
      expect(new Set(resumeJobs.map((job) => job.scenario))).toEqual(new Set(scenarios));
    }
  });

  it("keeps every case pair unique and scenario-aligned", () => {
    const pairs = new Set<string>();
    const jobsById = new Map(dataset.jobs.map((job) => [job.id, job]));

    for (const benchmarkCase of dataset.cases) {
      const pair = `${benchmarkCase.resumeId}:${benchmarkCase.jdId}`;
      expect(pairs.has(pair)).toBe(false);
      pairs.add(pair);
      expect(jobsById.get(benchmarkCase.jdId)?.scenario).toBe(benchmarkCase.scenario);
    }
  });

  it("covers the required field and seniority diversity", () => {
    expect(new Set(dataset.resumes.map((resume) => resume.field)).size).toBeGreaterThanOrEqual(6);
    expect(new Set(dataset.resumes.map((resume) => resume.seniorityLevel))).toEqual(
      new Set(["new_grad", "junior", "mid", "senior", "principal"])
    );
  });

  it("keeps reference cases stratified and high quality", () => {
    const caseById = new Map(dataset.cases.map((benchmarkCase) => [benchmarkCase.id, benchmarkCase]));
    const scenarioCounts = new Map<Scenario, number>();
    let highQualityCount = 0;

    for (const reference of dataset.references) {
      const scores = Object.values(reference.rubric);
      expect(scores.every((score) => score >= 1 && score <= 5)).toBe(true);
      if (scores.every((score) => score >= 4)) {
        highQualityCount += 1;
      }

      const scenario = caseById.get(reference.caseId)?.scenario;
      expect(scenario).toBeDefined();
      if (scenario) {
        scenarioCounts.set(scenario, (scenarioCounts.get(scenario) ?? 0) + 1);
      }
    }

    expect(highQualityCount).toBeGreaterThanOrEqual(20);
    for (const scenario of scenarios) {
      expect(scenarioCounts.get(scenario)).toBeGreaterThanOrEqual(3);
    }
  });

  it("does not include common real schools from the seed fixtures", () => {
    const banned = ["Carnegie Mellon", "Wharton", "RISD", "UCLA", "Georgia Tech", "Ohio State"];
    const blob = JSON.stringify(dataset.resumes);

    for (const name of banned) {
      expect(blob).not.toContain(name);
    }
  });
});
