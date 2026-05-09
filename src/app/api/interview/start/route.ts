import { nowEpoch } from "@/lib/format/time";
/**
 * @route POST /api/interview/start
 * @description Generate interview questions for a job (rate-limited)
 * @auth Required
 * @request { jobId: string, difficulty: InterviewDifficulty, questionCount?: number }
 * @response InterviewStartResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/db/jobs";
import { getProfile, getLLMConfig } from "@/lib/db";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import {
  startInterviewSchema,
  DIFFICULTY_DESCRIPTIONS,
  type InterviewDifficulty,
  type SessionQuestionCategory,
} from "@/lib/constants";
import { requireAuth, isAuthError, getCurrentUserId } from "@/lib/auth";
import { rateLimiters, getClientIdentifier } from "@/lib/rate-limit";
import { validationErrorResponse, ApiErrors } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

interface InterviewQuestion {
  question: string;
  category: SessionQuestionCategory;
  suggestedAnswer?: string;
  difficulty?: InterviewDifficulty;
}

const SESSION_CATEGORY_VALUES: SessionQuestionCategory[] = [
  "behavioral",
  "technical",
  "situational",
  "cultural-fit",
  "general",
];

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  // Rate limit LLM operations - 10 per minute per user
  const userId = await getCurrentUserId();
  const identifier = getClientIdentifier(request, userId || undefined);
  const rateLimitResult = rateLimiters.llm(identifier);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error:
          "Rate limit exceeded. Please wait before generating more questions.",
        retryAfter: Math.ceil((rateLimitResult.resetAt - nowEpoch()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimitResult.resetAt - nowEpoch()) / 1000),
          ),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  try {
    const rawData = await request.json();

    // Validate input with Zod
    const parseResult = startInterviewSchema.safeParse(rawData);
    if (!parseResult.success) {
      return validationErrorResponse(parseResult.error);
    }

    const { jobId, difficulty, category, questionCount } = parseResult.data;

    const profile = getProfile(authResult.userId);
    const llmConfig = getLLMConfig(authResult.userId);

    let questions: InterviewQuestion[];

    if (!jobId) {
      questions = await getGenericQuestions({
        category: category as SessionQuestionCategory,
        difficulty,
        questionCount,
        llmConfig,
      });
      return NextResponse.json({ questions, difficulty });
    }

    const job = getJob(jobId, authResult.userId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (llmConfig) {
      const client = new LLMClient(llmConfig);

      const profileContext = profile
        ? `
Candidate Background:
- Name: ${profile.contact?.name}
- Experience: ${profile.experiences.map((e) => `${e.title} at ${e.company}`).join(", ")}
- Skills: ${profile.skills.map((s) => s.name).join(", ")}
`
        : "";

      const difficultyContext =
        DIFFICULTY_DESCRIPTIONS[difficulty as InterviewDifficulty] ||
        DIFFICULTY_DESCRIPTIONS.mid;

      const response = await client.complete({
        messages: [
          {
            role: "user",
            content: `Generate ${questionCount} interview questions for this job. Mix behavioral, technical, situational, and cultural-fit questions.

Job: ${job.title} at ${job.company}
Description: ${job.description}
Key Skills: ${job.keywords.join(", ")}
${profileContext}

DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
${difficultyContext}

Return ONLY a JSON array (no markdown):
[
  {
    "question": "Tell me about a time when...",
    "category": "behavioral",
    "suggestedAnswer": "Structure using STAR method...",
    "difficulty": "${difficulty}"
  }
]

Categories: ${SESSION_CATEGORY_VALUES.join(", ")}
Every question must have the best primary category. Avoid "general" for the first question unless no other category fits.
Include suggestedAnswer with tips appropriate for the ${difficulty} level.
Make sure questions match the ${difficulty} difficulty level.`,
          },
        ],
        temperature: 0.7,
        maxTokens: 2000,
      });

      try {
        questions = normalizeQuestions(
          parseJSONFromLLM<InterviewQuestion[]>(response),
          questionCount,
          difficulty,
        );
      } catch (parseError) {
        console.error("Failed to parse LLM response:", parseError);
        // Fall back to default questions if parsing fails
        questions = getDefaultQuestions(job, difficulty, questionCount);
      }
    } else {
      questions = getDefaultQuestions(job, difficulty, questionCount);
    }

    return NextResponse.json({ questions, difficulty });
  } catch (error) {
    console.error("Start interview error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview questions" },
      { status: 500 },
    );
  }
}

async function getGenericQuestions({
  category,
  difficulty,
  questionCount,
  llmConfig,
}: {
  category: SessionQuestionCategory;
  difficulty: InterviewDifficulty;
  questionCount: number;
  llmConfig: ReturnType<typeof getLLMConfig>;
}): Promise<InterviewQuestion[]> {
  if (!llmConfig) {
    return getGenericDefaultQuestions(category, difficulty, questionCount);
  }

  const client = new LLMClient(llmConfig);
  const difficultyContext =
    DIFFICULTY_DESCRIPTIONS[difficulty] || DIFFICULTY_DESCRIPTIONS.mid;

  try {
    const response = await client.complete({
      messages: [
        {
          role: "user",
          content: `You are an interviewer for a ${category} interview at ${difficulty} level.

Generate ${questionCount} questions covering common ${category} interview topics. Do not reference any specific role or company.

DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
${difficultyContext}

Return ONLY a JSON array (no markdown):
[
  {
    "question": "Tell me about a time when...",
    "category": "${category}",
    "suggestedAnswer": "Structure using STAR method...",
    "difficulty": "${difficulty}"
  }
]

Categories: ${SESSION_CATEGORY_VALUES.join(", ")}
Every question must have the best primary category and include suggestedAnswer.`,
        },
      ],
      temperature: 0.7,
      maxTokens: 2000,
    });

    return normalizeQuestions(
      parseJSONFromLLM<InterviewQuestion[]>(response),
      questionCount,
      difficulty,
      category,
    );
  } catch (error) {
    console.error("Failed to generate generic interview questions:", error);
    return getGenericDefaultQuestions(category, difficulty, questionCount);
  }
}

function normalizeQuestions(
  questions: InterviewQuestion[],
  questionCount: number,
  difficulty: InterviewDifficulty,
  fallbackCategory: SessionQuestionCategory = "behavioral",
): InterviewQuestion[] {
  const normalized = questions.map((question) => ({
    ...question,
    category: SESSION_CATEGORY_VALUES.includes(question.category)
      ? question.category
      : fallbackCategory,
    difficulty: question.difficulty || difficulty,
  }));

  return repeatToCount(
    normalized.length
      ? normalized
      : [
          {
            question: "Tell me about a recent challenge and how you handled it.",
            category: fallbackCategory,
            difficulty,
            suggestedAnswer:
              "Use a specific example, explain your actions, and close with the result.",
          },
        ],
    questionCount,
  );
}

function getDefaultQuestions(
  job: { title: string; company: string; keywords: string[] },
  difficulty: InterviewDifficulty = "mid",
  questionCount = 5,
): InterviewQuestion[] {
  const baseQuestions: Record<InterviewDifficulty, InterviewQuestion[]> = {
    entry: [
      {
        question: `Why are you interested in starting your career as a ${job.title} at ${job.company}?`,
        category: "general",
        suggestedAnswer:
          "Show enthusiasm, research the company, and express eagerness to learn.",
        difficulty: "entry",
      },
      {
        question:
          "Tell me about a project you worked on during school or in your personal time.",
        category: "behavioral",
        suggestedAnswer:
          "Describe what you built, what you learned, and any challenges you overcame.",
        difficulty: "entry",
      },
      {
        question: "How do you approach learning a new skill or technology?",
        category: "situational",
        suggestedAnswer:
          "Show your learning process and give a concrete example.",
        difficulty: "entry",
      },
      {
        question: `What do you know about ${job.keywords.slice(0, 3).join(", ")}?`,
        category: "technical",
        suggestedAnswer:
          "Demonstrate basic understanding and eagerness to learn more.",
        difficulty: "entry",
      },
      {
        question:
          "Describe a time when you worked effectively as part of a team.",
        category: "behavioral",
        suggestedAnswer:
          "Use STAR method, focus on collaboration and communication.",
        difficulty: "entry",
      },
    ],
    mid: [
      {
        question: `Why are you interested in the ${job.title} position at ${job.company}?`,
        category: "general",
        suggestedAnswer:
          "Research the company, connect your experience to the role.",
        difficulty: "mid",
      },
      {
        question:
          "Describe a challenging project you led and how you handled obstacles.",
        category: "behavioral",
        suggestedAnswer:
          "Use STAR method, emphasize problem-solving and outcomes.",
        difficulty: "mid",
      },
      {
        question:
          "How do you prioritize tasks when you have multiple deadlines?",
        category: "situational",
        suggestedAnswer:
          "Describe your prioritization framework with specific examples.",
        difficulty: "mid",
      },
      {
        question: `Explain your experience with ${job.keywords.slice(0, 3).join(", ")}.`,
        category: "technical",
        suggestedAnswer:
          "Give specific examples of projects and measurable outcomes.",
        difficulty: "mid",
      },
      {
        question:
          "Tell me about a time you disagreed with a teammate and how you resolved it.",
        category: "behavioral",
        suggestedAnswer:
          "Focus on communication, compromise, and professional outcome.",
        difficulty: "mid",
      },
    ],
    senior: [
      {
        question:
          "How would you approach building the technical strategy for a team working on our product?",
        category: "technical",
        suggestedAnswer:
          "Discuss architecture decisions, trade-offs, and team alignment.",
        difficulty: "senior",
      },
      {
        question:
          "Describe a time when you had to influence a decision without having direct authority.",
        category: "behavioral",
        suggestedAnswer:
          "Show leadership, stakeholder management, and persuasion skills.",
        difficulty: "senior",
      },
      {
        question:
          "How do you mentor junior team members while maintaining your own productivity?",
        category: "situational",
        suggestedAnswer:
          "Balance teaching with delegation, discuss specific mentoring approaches.",
        difficulty: "senior",
      },
      {
        question:
          "Tell me about a system you designed that had to scale significantly. What would you do differently?",
        category: "technical",
        suggestedAnswer:
          "Discuss architectural decisions, trade-offs, and lessons learned.",
        difficulty: "senior",
      },
      {
        question:
          "How do you handle technical debt while delivering new features?",
        category: "situational",
        suggestedAnswer:
          "Discuss prioritization, ROI of refactoring, and stakeholder communication.",
        difficulty: "senior",
      },
    ],
    executive: [
      {
        question:
          "How would you transform the engineering culture at ${job.company} to drive innovation?",
        category: "situational",
        suggestedAnswer:
          "Discuss vision, change management, and measuring cultural impact.",
        difficulty: "executive",
      },
      {
        question:
          "Describe a time when you had to make a significant strategic pivot. How did you gain buy-in?",
        category: "behavioral",
        suggestedAnswer:
          "Focus on data-driven decision making and stakeholder alignment.",
        difficulty: "executive",
      },
      {
        question:
          "How do you balance short-term business goals with long-term technical investments?",
        category: "situational",
        suggestedAnswer:
          "Discuss frameworks for prioritization and communicating with the board.",
        difficulty: "executive",
      },
      {
        question:
          "How would you build and scale the engineering organization for 3x growth?",
        category: "technical",
        suggestedAnswer:
          "Discuss hiring, team structure, processes, and maintaining culture.",
        difficulty: "executive",
      },
      {
        question:
          "Tell me about a failure in your leadership and what you learned from it.",
        category: "behavioral",
        suggestedAnswer:
          "Show vulnerability, accountability, and concrete lessons applied.",
        difficulty: "executive",
      },
    ],
  };

  return repeatToCount(baseQuestions[difficulty] || baseQuestions.mid, questionCount);
}

function getGenericDefaultQuestions(
  category: SessionQuestionCategory,
  difficulty: InterviewDifficulty = "mid",
  questionCount = 5,
): InterviewQuestion[] {
  const label = category.replace("-", " ");
  const templates: Record<SessionQuestionCategory, string[]> = {
    behavioral: [
      "Tell me about a time you handled a difficult challenge.",
      "Describe a moment when you had to learn something quickly.",
      "Tell me about a time you received tough feedback.",
      "Describe a project where you had to collaborate across different working styles.",
      "Tell me about a time you improved a process.",
    ],
    technical: [
      "Walk me through a technical decision you made and the trade-offs involved.",
      "How do you debug a production issue with limited information?",
      "Describe a system or feature you built that you are proud of.",
      "How do you evaluate whether a technical solution is maintainable?",
      "Explain a complex technical topic to a non-technical stakeholder.",
    ],
    situational: [
      "What would you do if priorities changed halfway through a project?",
      "How would you handle being blocked by another team?",
      "What would you do if you disagreed with the direction of a project?",
      "How would you recover if you realized you misunderstood a requirement?",
      "What would you do if you had too much work and too little time?",
    ],
    general: [
      "What strengths would you bring to your next role?",
      "What kind of work environment helps you do your best work?",
      "How do you decide what to focus on during a busy week?",
      "What are you hoping to grow in next?",
      "Tell me about the kind of impact you want to have.",
    ],
    "cultural-fit": [
      "What team norms help you collaborate well?",
      "Tell me about a time you contributed to a healthier team culture.",
      "How do you build trust with new teammates?",
      "Describe how you prefer to give and receive feedback.",
      "What values matter most to you in a workplace?",
    ],
  };

  return repeatToCount(
    templates[category].map((question) => ({
      question,
      category,
      difficulty,
      suggestedAnswer: `Use a concrete example, explain your choices, and connect the answer to common ${label} interview signals.`,
    })),
    questionCount,
  );
}

function repeatToCount(
  questions: InterviewQuestion[],
  questionCount: number,
): InterviewQuestion[] {
  const result: InterviewQuestion[] = [];
  while (result.length < questionCount) {
    result.push(...questions);
  }
  return result.slice(0, questionCount);
}
