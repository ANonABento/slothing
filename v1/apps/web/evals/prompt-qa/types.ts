import type { CoverLetterInput } from "@/lib/cover-letter/generate";
import type { EmailContext } from "@/lib/email/templates";
import type { TailoredResume } from "@/lib/resume/generator";
import type {
  GroupedBankEntries,
  JobDescription,
  Profile,
  ContactInfo,
} from "@/types";

export const PROMPT_QA_WORKFLOWS = [
  "resume_generation",
  "tailor_autofix",
  "cover_letter",
  "email",
  "interview",
] as const;

export type PromptQaWorkflow = (typeof PROMPT_QA_WORKFLOWS)[number];

export const PROMPT_QA_RUBRICS = [
  "factuality",
  "evidenceUse",
  "jobFit",
  "actionability",
  "concision",
  "studentUsefulness",
] as const;

export type PromptQaRubricKey = (typeof PROMPT_QA_RUBRICS)[number];

export type PromptQaMockOutput = Record<PromptQaWorkflow, string>;

export interface PromptQaFixture {
  id: string;
  label: string;
  scenario: string;
  contact: ContactInfo;
  profile: Profile;
  bankEntries: GroupedBankEntries;
  job: JobDescription;
  resume: TailoredResume;
  coverLetterInput: CoverLetterInput;
  emailContext: Omit<EmailContext, "profile" | "job">;
  interviewAnswer: string;
  expectedEvidence: string[];
  supportedJobTerms: string[];
  forbiddenClaims: string[];
  mockOutputs: PromptQaMockOutput;
}

export interface PromptQaCase {
  fixture: PromptQaFixture;
  workflow: PromptQaWorkflow;
  prompt: string;
  output: string;
}

export interface PromptQaRubricScore {
  key: PromptQaRubricKey;
  score: number;
  details: string;
}

export interface PromptQaResult extends PromptQaCase {
  scores: Record<PromptQaRubricKey, PromptQaRubricScore>;
  overallScore: number;
  passed: boolean;
}

export interface PromptQaSummary {
  total: number;
  passed: number;
  failed: number;
  averageScore: number;
  byWorkflow: Record<PromptQaWorkflow, { total: number; failed: number }>;
}
