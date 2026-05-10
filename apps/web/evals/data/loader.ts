import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ZodError, type ZodSchema } from "zod";
import {
  BenchmarkCasesSchema,
  JobDescriptionsSchema,
  ReferenceCasesSchema,
  ResumesSchema,
  type BenchmarkDataset,
  type Scenario,
} from "./schema.js";

const EXPECTED_COUNTS = {
  resumes: 50,
  jobs: 250,
  cases: 250,
  references: 25,
} as const;

const SCENARIOS: Scenario[] = [
  "direct_match",
  "stretch_up",
  "adjacent_role",
  "lateral_industry",
  "reach",
];

function defaultRootDir(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function readJsonFile<T>(
  rootDir: string,
  fileName: string,
  schema: ZodSchema<T>,
): T {
  const filePath = join(rootDir, fileName);

  try {
    return schema.parse(JSON.parse(readFileSync(filePath, "utf8")));
  } catch (error) {
    if (error instanceof ZodError) {
      const details = error.issues
        .map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid ${filePath}: ${details}`);
    }

    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }

    throw error;
  }
}

function assertCount(name: keyof typeof EXPECTED_COUNTS, actual: number): void {
  const expected = EXPECTED_COUNTS[name];
  if (actual !== expected) {
    throw new Error(`Expected ${expected} ${name}, found ${actual}`);
  }
}

function assertUnique(ids: string[], label: string): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`Duplicate ${label} id: ${id}`);
    }
    seen.add(id);
  }
}

function assertScenarioSet(resumeId: string, scenarios: Scenario[]): void {
  const missing = SCENARIOS.filter((scenario) => !scenarios.includes(scenario));
  if (scenarios.length !== SCENARIOS.length || missing.length > 0) {
    throw new Error(
      `Resume ${resumeId} must have exactly one JD per scenario; missing ${missing.join(", ") || "none"}`,
    );
  }
}

function validateDataset(dataset: BenchmarkDataset): void {
  assertCount("resumes", dataset.resumes.length);
  assertCount("jobs", dataset.jobs.length);
  assertCount("cases", dataset.cases.length);
  assertCount("references", dataset.references.length);

  assertUnique(
    dataset.resumes.map((resume) => resume.id),
    "resume",
  );
  assertUnique(
    dataset.jobs.map((job) => job.id),
    "job",
  );
  assertUnique(
    dataset.cases.map((benchmarkCase) => benchmarkCase.id),
    "case",
  );

  const resumeIds = new Set(dataset.resumes.map((resume) => resume.id));
  const jobIds = new Set(dataset.jobs.map((job) => job.id));
  const caseIds = new Set(
    dataset.cases.map((benchmarkCase) => benchmarkCase.id),
  );
  const casePairs = new Set<string>();
  const jobsByResume = new Map<string, Scenario[]>();

  for (const job of dataset.jobs) {
    if (!resumeIds.has(job.resumeId)) {
      throw new Error(
        `Job ${job.id} references missing resume ${job.resumeId}`,
      );
    }
    jobsByResume.set(job.resumeId, [
      ...(jobsByResume.get(job.resumeId) ?? []),
      job.scenario,
    ]);
  }

  for (const resume of dataset.resumes) {
    assertScenarioSet(resume.id, jobsByResume.get(resume.id) ?? []);
  }

  for (const benchmarkCase of dataset.cases) {
    if (!resumeIds.has(benchmarkCase.resumeId)) {
      throw new Error(
        `Case ${benchmarkCase.id} references missing resume ${benchmarkCase.resumeId}`,
      );
    }
    const job = dataset.jobs.find(
      (candidate) => candidate.id === benchmarkCase.jdId,
    );
    if (!jobIds.has(benchmarkCase.jdId) || !job) {
      throw new Error(
        `Case ${benchmarkCase.id} references missing job ${benchmarkCase.jdId}`,
      );
    }
    if (job.resumeId !== benchmarkCase.resumeId) {
      throw new Error(
        `Case ${benchmarkCase.id} pairs resume ${benchmarkCase.resumeId} with job ${job.id} owned by ${job.resumeId}`,
      );
    }
    if (job.scenario !== benchmarkCase.scenario) {
      throw new Error(
        `Case ${benchmarkCase.id} scenario ${benchmarkCase.scenario} does not match job ${job.id} scenario ${job.scenario}`,
      );
    }

    const pair = `${benchmarkCase.resumeId}:${benchmarkCase.jdId}`;
    if (casePairs.has(pair)) {
      throw new Error(`Duplicate case pair: ${pair}`);
    }
    casePairs.add(pair);
  }

  for (const reference of dataset.references) {
    if (!caseIds.has(reference.caseId)) {
      throw new Error(
        `Reference for ${reference.caseId} points to a missing case`,
      );
    }
  }
}

export function loadBenchmarkDataset(
  rootDir = defaultRootDir(),
): BenchmarkDataset {
  const dataset: BenchmarkDataset = {
    resumes: readJsonFile(rootDir, "resumes.json", ResumesSchema),
    jobs: readJsonFile(rootDir, "jobs.json", JobDescriptionsSchema),
    cases: readJsonFile(rootDir, "cases.json", BenchmarkCasesSchema),
    references: readJsonFile(rootDir, "references.json", ReferenceCasesSchema),
  };

  validateDataset(dataset);

  return dataset;
}
