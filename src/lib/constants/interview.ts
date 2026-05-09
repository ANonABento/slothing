import { z } from "zod";

// Interview question categories
export const INTERVIEW_CATEGORIES = [
  "behavioral",
  "technical",
  "situational",
  "general",
  "company",
] as const;

export type InterviewCategory = (typeof INTERVIEW_CATEGORIES)[number];

export const interviewCategorySchema = z.enum(INTERVIEW_CATEGORIES);

// Interview difficulty levels
export const INTERVIEW_DIFFICULTIES = [
  "entry",
  "mid",
  "senior",
  "executive",
] as const;

export type InterviewDifficulty = (typeof INTERVIEW_DIFFICULTIES)[number];

export const interviewDifficultySchema = z.enum(INTERVIEW_DIFFICULTIES);

export const DIFFICULTY_DESCRIPTIONS: Record<InterviewDifficulty, string> = {
  entry: "Entry-level questions focusing on basic skills, learning ability, and enthusiasm. Avoid complex technical deep-dives.",
  mid: "Mid-level questions testing practical experience, problem-solving, and technical competence. Include specific scenario-based questions.",
  senior: "Senior-level questions probing leadership, architecture decisions, mentoring, and cross-functional impact. Expect detailed examples.",
  executive: "Executive-level questions about strategy, vision, organizational transformation, and stakeholder management. Focus on business impact.",
};

export const startInterviewSchema = z.object({
  jobId: z.string().min(1, "Job ID is required").nullable(),
  mode: z.enum(["text", "voice", "generic-text"]).optional().default("text"),
  difficulty: interviewDifficultySchema.optional().default("mid"),
  category: z
    .enum(["behavioral", "technical", "situational", "general", "cultural-fit"])
    .optional(),
  questionCount: z.number().int().min(3).max(15).optional().default(5),
}).refine((data) => data.jobId !== null || !!data.category, {
  path: ["category"],
  message: "Category is required for quick practice",
});

// Interview answer schema
export const interviewAnswerSchema = z.object({
  jobId: z.string().min(1, "Job ID is required").nullable(),
  questionIndex: z.number().int().min(0),
  answer: z.string().min(1, "Answer is required").max(10000),
  category: z
    .enum(["behavioral", "technical", "situational", "general", "cultural-fit"])
    .optional(),
});

export type InterviewAnswerInput = z.infer<typeof interviewAnswerSchema>;

// Interview session schema
// Note: Database uses "text" | "voice" for session modes
export const SESSION_MODES = ["text", "voice", "generic-text"] as const;

export type SessionMode = (typeof SESSION_MODES)[number];

export const sessionModeSchema = z.enum(SESSION_MODES);

// Session question categories (narrower than INTERVIEW_CATEGORIES - excludes "company")
export const SESSION_QUESTION_CATEGORIES = [
  "behavioral",
  "technical",
  "situational",
  "general",
  "cultural-fit",
] as const;

export type SessionQuestionCategory = (typeof SESSION_QUESTION_CATEGORIES)[number];

export const sessionQuestionCategorySchema = z.enum(SESSION_QUESTION_CATEGORIES);

export const sessionQuestionSchema = z.object({
  question: z.string().min(1),
  category: sessionQuestionCategorySchema,
  suggestedAnswer: z.string().optional(),
  difficulty: interviewDifficultySchema.optional(),
});

export const createInterviewSessionSchema = z.object({
  jobId: z.string().min(1, "Job ID is required").nullable(),
  category: sessionQuestionCategorySchema.optional(),
  questions: z.array(sessionQuestionSchema).min(1, "At least one question is required"),
  mode: sessionModeSchema.optional(),
}).refine((data) => data.jobId !== null || !!data.category, {
  path: ["category"],
  message: "Category is required for quick practice",
});

export type CreateInterviewSessionInput = z.infer<typeof createInterviewSessionSchema>;

export const INTERVIEW_QUESTION_COUNTS = [5, 10, 15] as const;

export const INTERVIEW_TIMER_DEFAULTS_MS: Record<SessionQuestionCategory, number> = {
  behavioral: 90_000,
  technical: 120_000,
  situational: 150_000,
  general: 90_000,
  "cultural-fit": 90_000,
};

export const INTERVIEW_TIMER_EXTENSION_MS = 30_000;
