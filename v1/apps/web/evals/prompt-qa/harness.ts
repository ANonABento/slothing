import { buildCoverLetterGenerationMessages } from "@/lib/cover-letter/generate";
import { EMAIL_TEMPLATE_INFO } from "@/lib/email/templates";
import { buildEmailGenerationPrompt } from "@/lib/email/prompt-builders";
import {
  buildInterviewAnswerFeedbackPrompt,
  buildJobInterviewQuestionsPrompt,
} from "@/lib/interview/prompt-builders";
import {
  buildTailorAutofixPrompt,
  buildTailoredResumePrompt,
} from "@/lib/tailor/prompt-builders";
import { PROMPT_QA_FIXTURES } from "./fixtures";
import { scorePromptQaCase } from "./rubrics";
import {
  PROMPT_QA_WORKFLOWS,
  type PromptQaCase,
  type PromptQaFixture,
  type PromptQaResult,
  type PromptQaSummary,
  type PromptQaWorkflow,
} from "./types";

const PASS_THRESHOLD = 0.68;
const DEFAULT_PROMPT_CONTENT = `1. Write a professional summary (2-3 sentences) tailored to this job
2. Select the 2-3 most relevant experiences from the bank and rewrite bullet points
3. Each experience should have 2-4 bullet points maximum
4. Prioritize skills matching the job description
5. Include relevant achievements in experience bullet points
6. Keep everything concise - one page`;

export function buildPromptQaCases(
  fixtures: PromptQaFixture[] = PROMPT_QA_FIXTURES,
): PromptQaCase[] {
  return fixtures.flatMap((fixture) =>
    PROMPT_QA_WORKFLOWS.map((workflow) => ({
      fixture,
      workflow,
      prompt: buildWorkflowPrompt(fixture, workflow),
      output: fixture.mockOutputs[workflow],
    })),
  );
}

export function runPromptQaFixtures({
  fixtures = PROMPT_QA_FIXTURES,
  threshold = PASS_THRESHOLD,
}: {
  fixtures?: PromptQaFixture[];
  threshold?: number;
} = {}): PromptQaResult[] {
  return buildPromptQaCases(fixtures).map((testCase) => {
    const scores = scorePromptQaCase(testCase);
    const overallScore =
      Object.values(scores).reduce((sum, score) => sum + score.score, 0) /
      Object.values(scores).length;

    return {
      ...testCase,
      scores,
      overallScore: Number(overallScore.toFixed(2)),
      passed: overallScore >= threshold,
    };
  });
}

export function summarizePromptQaResults(
  results: PromptQaResult[],
): PromptQaSummary {
  const byWorkflow = Object.fromEntries(
    PROMPT_QA_WORKFLOWS.map((workflow) => [
      workflow,
      {
        total: results.filter((result) => result.workflow === workflow).length,
        failed: results.filter(
          (result) => result.workflow === workflow && !result.passed,
        ).length,
      },
    ]),
  ) as PromptQaSummary["byWorkflow"];

  return {
    total: results.length,
    passed: results.filter((result) => result.passed).length,
    failed: results.filter((result) => !result.passed).length,
    averageScore: Number(
      (
        results.reduce((sum, result) => sum + result.overallScore, 0) /
        Math.max(1, results.length)
      ).toFixed(2),
    ),
    byWorkflow,
  };
}

function buildWorkflowPrompt(
  fixture: PromptQaFixture,
  workflow: PromptQaWorkflow,
): string {
  switch (workflow) {
    case "resume_generation":
      return buildTailoredResumePrompt(
        {
          bankEntries: fixture.bankEntries,
          contact: fixture.contact,
          summary: fixture.profile.summary,
          jobTitle: fixture.job.title,
          company: fixture.job.company,
          jobDescription: fixture.job.description,
        },
        DEFAULT_PROMPT_CONTENT,
      );
    case "tailor_autofix":
      return buildTailorAutofixPrompt({
        resume: fixture.resume,
        keywordsMissing: fixture.job.keywords,
        jobTitle: fixture.job.title,
        company: fixture.job.company,
        jobDescription: fixture.job.description,
      });
    case "cover_letter":
      return buildCoverLetterGenerationMessages(fixture.coverLetterInput)
        .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
        .join("\n\n");
    case "email":
      return buildEmailGenerationPrompt({
        templateInfo: EMAIL_TEMPLATE_INFO.cold_outreach,
        profile: fixture.profile,
        job: fixture.job,
        contextParams: fixture.emailContext,
        type: "cold_outreach",
      });
    case "interview":
      return [
        buildJobInterviewQuestionsPrompt({
          job: fixture.job,
          profile: fixture.profile,
          difficulty: "entry",
          questionCount: 5,
        }),
        buildInterviewAnswerFeedbackPrompt({
          job: fixture.job,
          answer: fixture.interviewAnswer,
          category: "behavioral",
        }),
      ].join("\n\n--- FEEDBACK PROMPT ---\n\n");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = runPromptQaFixtures();
  const summary = summarizePromptQaResults(results);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.failed > 0 ? 1 : 0);
}
