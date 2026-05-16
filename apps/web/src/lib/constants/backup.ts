import { z } from "zod";

// Backup profile schema (flexible for import compatibility)
const backupContactSchema = z
  .object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  })
  .passthrough();

const backupExperienceSchema = z
  .object({
    id: z.string(),
    company: z.string(),
    title: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean(),
    description: z.string(),
    highlights: z.array(z.string()),
    skills: z.array(z.string()),
  })
  .passthrough();

const backupEducationSchema = z
  .object({
    id: z.string(),
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
    highlights: z.array(z.string()),
  })
  .passthrough();

const backupSkillSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    proficiency: z.string().optional(),
  })
  .passthrough();

const backupProjectSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
    technologies: z.array(z.string()),
    highlights: z.array(z.string()),
  })
  .passthrough();

const backupCertificationSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    issuer: z.string(),
    date: z.string().optional(),
    url: z.string().optional(),
  })
  .passthrough();

const backupProfileSchema = z
  .object({
    id: z.string().optional(),
    contact: backupContactSchema.optional(),
    summary: z.string().optional(),
    experiences: z.array(backupExperienceSchema).optional(),
    education: z.array(backupEducationSchema).optional(),
    skills: z.array(backupSkillSchema).optional(),
    projects: z.array(backupProjectSchema).optional(),
    certifications: z.array(backupCertificationSchema).optional(),
    rawText: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough();

// Backup job schema
const backupJobSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    type: z.string().optional(),
    remote: z.boolean().optional(),
    salary: z.string().optional(),
    description: z.string(),
    requirements: z.array(z.string()).optional(),
    responsibilities: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    url: z.string().optional(),
    status: z.string().optional(),
    appliedAt: z.string().optional(),
    deadline: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

// Backup document schema
const backupDocumentSchema = z
  .object({
    id: z.string(),
    filename: z.string(),
    type: z.string(),
    mimeType: z.string().optional(),
    size: z.number().optional(),
    path: z.string().optional(),
    extractedText: z.string().optional(),
    uploadedAt: z.string().optional(),
  })
  .passthrough();

// Backup interview session schema
const backupInterviewSessionSchema = z
  .object({
    id: z.string(),
    jobId: z.string(),
    questions: z.array(
      z
        .object({
          question: z.string(),
          category: z.string().optional(),
          suggestedAnswer: z.string().optional(),
          userAnswer: z.string().optional(),
          feedback: z.string().optional(),
        })
        .passthrough(),
    ),
    mode: z.string().optional(),
    status: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

// Backup generated resume schema
const backupGeneratedResumeSchema = z
  .object({
    id: z.string(),
    jobId: z.string(),
    template: z.string().optional(),
    content: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .passthrough();

// Backup data schema
export const backupDataSchema = z.object({
  version: z.string().min(1, "Version is required"),
  exportedAt: z.string().optional(),
  data: z.object({
    profile: backupProfileSchema.optional(),
    jobs: z.array(backupJobSchema).optional(),
    documents: z.array(backupDocumentSchema).optional(),
    interviewSessions: z.array(backupInterviewSessionSchema).optional(),
    generatedResumes: z.array(backupGeneratedResumeSchema).optional(),
  }),
  stats: z
    .object({
      totalJobs: z.number().optional(),
      totalDocuments: z.number().optional(),
      totalInterviews: z.number().optional(),
      totalResumes: z.number().optional(),
    })
    .optional(),
});

export type BackupDataInput = z.infer<typeof backupDataSchema>;

// Full export data schema (comprehensive export including cover letters and bank entries)
const exportCoverLetterSchema = z
  .object({
    id: z.string(),
    jobId: z.string(),
    content: z.string(),
    highlights: z.array(z.string()),
    version: z.number(),
    createdAt: z.string().optional(),
  })
  .passthrough();

const exportBankEntrySchema = z
  .object({
    id: z.string(),
    category: z.string(),
    content: z.record(z.string(), z.unknown()),
    sourceDocumentId: z.string().optional(),
    confidenceScore: z.number(),
    createdAt: z.string().optional(),
  })
  .passthrough();

export const fullExportDataSchema = z.object({
  version: z.string().min(1, "Version is required"),
  exportedAt: z.string().optional(),
  data: z.object({
    profile: backupProfileSchema.optional(),
    jobs: z.array(backupJobSchema).optional(),
    documents: z.array(backupDocumentSchema).optional(),
    interviewSessions: z.array(backupInterviewSessionSchema).optional(),
    generatedResumes: z.array(backupGeneratedResumeSchema).optional(),
    coverLetters: z.array(exportCoverLetterSchema).optional(),
    bankEntries: z.array(exportBankEntrySchema).optional(),
  }),
  stats: z
    .object({
      totalJobs: z.number().optional(),
      totalDocuments: z.number().optional(),
      totalInterviews: z.number().optional(),
      totalResumes: z.number().optional(),
      totalCoverLetters: z.number().optional(),
      totalBankEntries: z.number().optional(),
    })
    .optional(),
});

export type FullExportDataInput = z.infer<typeof fullExportDataSchema>;
