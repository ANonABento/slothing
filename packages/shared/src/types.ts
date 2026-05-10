export interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  headline?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  workStyle?: string[];
  targetRoles?: string[];
  targetSalaryMin?: string;
  targetSalaryMax?: string;
  targetSalaryCurrency?: string;
  openToRecruiters?: boolean;
  shareContactInfo?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: "technical" | "soft" | "language" | "tool" | "other";
  proficiency?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export interface Profile {
  id: string;
  contact: ContactInfo;
  summary?: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  rawText?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type JobStatus =
  | "pending"
  | "saved"
  | "applied"
  | "interviewing"
  | "offered"
  | "rejected"
  | "withdrawn"
  | "dismissed";

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  location?: string;
  type?: "full-time" | "part-time" | "contract" | "internship";
  remote?: boolean;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  keywords: string[];
  url?: string;
  status?: JobStatus;
  appliedAt?: string;
  deadline?: string;
  notes?: string;
  createdAt: string;
  linkedResumeId?: string;
  linkedCoverLetterId?: string;
}

export interface JobMatch {
  jobId: string;
  profileId: string;
  overallScore: number;
  skillMatches: { skill: string; matched: boolean; relevance: number }[];
  experienceMatches: { experienceId: string; relevance: number }[];
  gaps: string[];
  suggestions: string[];
}

export interface LLMConfig {
  provider: "openai" | "anthropic" | "ollama" | "openrouter";
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export const BANK_CATEGORIES = [
  "experience",
  "skill",
  "project",
  "education",
  "bullet",
  "achievement",
  "certification",
  "hackathon",
] as const;

export type BankCategory = (typeof BANK_CATEGORIES)[number];

export interface BankEntry {
  id: string;
  userId: string;
  category: BankCategory;
  content: Record<string, unknown>;
  sourceDocumentId?: string;
  confidenceScore: number;
  createdAt: string;
}

export interface GroupedBankEntries {
  experience: BankEntry[];
  skill: BankEntry[];
  project: BankEntry[];
  education: BankEntry[];
  bullet: BankEntry[];
  achievement: BankEntry[];
  certification: BankEntry[];
  hackathon: BankEntry[];
}

export type {
  CreateOpportunityInput,
  Opportunity,
  OpportunityFilters,
  OpportunityJobType,
  OpportunityLevel,
  OpportunityRemoteType,
  OpportunitySource,
  OpportunityStatus,
  OpportunityStatusChangeInput,
  OpportunityType,
  UpdateOpportunityInput,
} from "./schemas";
