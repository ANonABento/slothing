import type { EvalCase } from "../types.js";
import { loadBenchmarkDataset } from "./loader.js";
import type { BenchmarkDataset, JobDescription, Resume } from "./schema.js";

function formatExperience({
  title,
  company,
  startYear,
  endYear,
  bullets,
}: Resume["experience"][number]): string {
  const years = endYear ? `${startYear}-${endYear}` : `${startYear}-present`;
  return `${title}, ${company} (${years}): ${bullets.join(" ")}`;
}

function formatEducation({
  degree,
  school,
  year,
}: Resume["education"][number]): string {
  return `${degree}, ${school} ${year}`;
}

function formatProject({
  name,
  description,
}: Resume["projects"][number]): string {
  return `${name}: ${description}`;
}

export function serializeResumeAsProfile(resume: Resume): string {
  return [
    `${resume.candidateName} - ${resume.label}`,
    `${resume.summary}`,
    `Location: ${resume.location}`,
    `Field: ${resume.field} / ${resume.subfield}`,
    `Seniority: ${resume.seniorityLevel}, ${resume.seniorityYears} years`,
    `Skills: ${resume.skills.join(", ")}`,
    `Experience: ${resume.experience.map(formatExperience).join("\n")}`,
    `Education: ${resume.education.map(formatEducation).join("; ")}`,
    resume.projects.length > 0
      ? `Projects: ${resume.projects.map(formatProject).join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function serializeJobAsDescription(job: JobDescription): string {
  return [
    `${job.title} at ${job.company}`,
    `Scenario: ${job.scenario}`,
    `Industry: ${job.industry}`,
    job.description,
    `Must-haves: ${job.mustHaves.join(", ")}`,
    `Nice-to-haves: ${job.niceToHaves.join(", ")}`,
  ].join("\n");
}

function deriveKeywords(job: JobDescription): string[] {
  return Array.from(
    new Set(job.mustHaves.map((keyword) => keyword.toLowerCase())),
  );
}

export function toEvalCases(dataset: BenchmarkDataset): EvalCase[] {
  const resumesById = new Map(
    dataset.resumes.map((resume) => [resume.id, resume]),
  );
  const jobsById = new Map(dataset.jobs.map((job) => [job.id, job]));

  return dataset.cases.map((benchmarkCase) => {
    const resume = resumesById.get(benchmarkCase.resumeId);
    const job = jobsById.get(benchmarkCase.jdId);

    if (!resume) {
      throw new Error(
        `Case ${benchmarkCase.id} references missing resume ${benchmarkCase.resumeId}`,
      );
    }
    if (!job) {
      throw new Error(
        `Case ${benchmarkCase.id} references missing job ${benchmarkCase.jdId}`,
      );
    }

    return {
      id: benchmarkCase.id,
      label: `${resume.label} -> ${job.title} (${benchmarkCase.scenario})`,
      candidateProfile: serializeResumeAsProfile(resume),
      jobDescription: serializeJobAsDescription(job),
      expectedKeywords: deriveKeywords(job),
    };
  });
}

export function loadEvalCasesFromBenchmark(rootDir?: string): EvalCase[] {
  return toEvalCases(loadBenchmarkDataset(rootDir));
}
