import type { TailoredResume } from "@/lib/resume/generator";
import type { LLMConfig } from "@/types";

export interface TestCase {
  id: string;
  label: string;
  candidateProfile: string;
  jobDescription: string;
  expectedKeywords?: string[];
}

export type EvalCase = TestCase;
export type EvalMode = "resume" | "cover-letter";

export interface ResumeGeneratorOutput {
  kind: "resume";
  generator: string;
  resume?: TailoredResume;
  rawText: string;
  latencyMs: number;
  error?: string;
}

export interface CoverLetterGeneratorOutput {
  kind: "coverLetter";
  generator: string;
  text: string;
  latencyMs: number;
  error?: string;
}

export type GeneratorOutput = ResumeGeneratorOutput | CoverLetterGeneratorOutput;
export type EvalGenerator = (testCase: EvalCase) => Promise<GeneratorOutput>;

export interface MetricScore {
  name: string;
  score: number;
  details?: Record<string, unknown>;
  error?: string;
}

export type EvalMetric = (
  testCase: EvalCase,
  output: GeneratorOutput,
) => MetricScore;

export interface CaseResult {
  caseId: string;
  caseLabel: string;
  mode: EvalMode;
  generator: string;
  output: GeneratorOutput;
  metrics: MetricScore[];
  overallScore: number;
  judgeScore?: JudgeScore;
  error?: string;
}

export interface EvalRunSummary {
  totalCases: number;
  errorCount: number;
  avgOverallScore: number;
  avgScoreByMetric: Record<string, number>;
}

export interface EvalRunReport {
  runAt: string;
  mode: EvalMode;
  generator: string;
  judgeEnabled: boolean;
  judge: "disabled" | "enabled";
  cases: CaseResult[];
  summary: EvalRunSummary;
}

export interface EvalConfig {
  mode: EvalMode;
  generator: string;
  llmConfig: LLMConfig | null;
  judgeEnabled?: boolean;
}

export interface GeneratorResult {
  model: string;
  provider: "openai" | "anthropic";
  output: string;
  latencyMs: number;
  error?: string;
}

export interface JudgeScore {
  model: string;
  score: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
}

export interface TestCaseResult {
  testCaseId: string;
  testCaseLabel: string;
  gpt55: GeneratorResult;
  claude: GeneratorResult;
  judgeScores: {
    gpt55: JudgeScore;
    claude: JudgeScore;
  };
  winner: "gpt55" | "claude" | "tie";
}

export interface RunSummary {
  gpt55Wins: number;
  claudeWins: number;
  ties: number;
  avgScoreGpt55: number;
  avgScoreClaude: number;
  errorCount: number;
}

export interface ComparisonReport {
  runAt: string;
  generatorModels: { gpt55: string; claude: string };
  judgeModel: string;
  totalCases: number;
  successfulCases: number;
  results: TestCaseResult[];
  summary: RunSummary;
}
