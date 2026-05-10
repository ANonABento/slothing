import { z } from "zod";

export const SeniorityLevelSchema = z.enum([
  "new_grad",
  "junior",
  "mid",
  "senior",
  "principal",
]);
export const ScenarioSchema = z.enum([
  "direct_match",
  "stretch_up",
  "adjacent_role",
  "lateral_industry",
  "reach",
]);

export const ExperienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  startYear: z.number().int().min(1980).max(2026),
  endYear: z.number().int().min(1980).max(2026).nullable(),
  bullets: z.array(z.string().min(1)).min(1),
});

export const EducationSchema = z.object({
  degree: z.string().min(1),
  school: z.string().min(1),
  year: z.number().int().min(1980).max(2026),
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

export const ResumeSchema = z.object({
  id: z.string().regex(/^r-\d{3}$/),
  label: z.string().min(1),
  field: z.string().min(1),
  subfield: z.string().min(1),
  seniorityLevel: SeniorityLevelSchema,
  seniorityYears: z.number().int().min(0).max(35),
  candidateName: z.string().min(1),
  location: z.string().min(1),
  summary: z.string().min(1),
  skills: z.array(z.string().min(1)).min(3),
  experience: z.array(ExperienceSchema).min(1),
  education: z.array(EducationSchema).min(1),
  projects: z.array(ProjectSchema).default([]),
});

export const JobDescriptionSchema = z.object({
  id: z.string().regex(/^j-\d{3}$/),
  resumeId: z.string().regex(/^r-\d{3}$/),
  scenario: ScenarioSchema,
  title: z.string().min(1),
  company: z.string().min(1),
  seniorityLevel: SeniorityLevelSchema,
  industry: z.string().min(1),
  description: z.string().min(1),
  mustHaves: z.array(z.string().min(1)).min(2),
  niceToHaves: z.array(z.string().min(1)).min(1),
});

export const BenchmarkCaseSchema = z.object({
  id: z.string().regex(/^c-\d{3}$/),
  resumeId: z.string().regex(/^r-\d{3}$/),
  jdId: z.string().regex(/^j-\d{3}$/),
  scenario: ScenarioSchema,
});

export const RubricSchema = z.object({
  keywordAlignment: z.number().int().min(1).max(5),
  relevanceEmphasis: z.number().int().min(1).max(5),
  specificity: z.number().int().min(1).max(5),
  clarity: z.number().int().min(1).max(5),
  atsOptimization: z.number().int().min(1).max(5),
});

export const ReferenceCaseSchema = z.object({
  caseId: z.string().regex(/^c-\d{3}$/),
  idealOutput: z.string().min(1),
  rubric: RubricSchema,
  notes: z.string().min(1),
  ratedBy: z.string().min(1),
  ratedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const ResumesSchema = z.array(ResumeSchema);
export const JobDescriptionsSchema = z.array(JobDescriptionSchema);
export const BenchmarkCasesSchema = z.array(BenchmarkCaseSchema);
export const ReferenceCasesSchema = z.array(ReferenceCaseSchema);

export type SeniorityLevel = z.infer<typeof SeniorityLevelSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type JobDescription = z.infer<typeof JobDescriptionSchema>;
export type BenchmarkCase = z.infer<typeof BenchmarkCaseSchema>;
export type ReferenceCase = z.infer<typeof ReferenceCaseSchema>;

export interface BenchmarkDataset {
  resumes: Resume[];
  jobs: JobDescription[];
  cases: BenchmarkCase[];
  references: ReferenceCase[];
}
