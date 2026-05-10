import type { DataPoint, TimeRange } from "@/lib/analytics/time-series";

export type ModelKey = "gpt55" | "claude";
export type WinnerKey = ModelKey | "tie";

export interface EvalSetOption {
  key: string;
  label: string;
  size: number;
}

export interface EvalCaseRow {
  id: string;
  runId: string;
  evalSetKey: string;
  testCaseId: string;
  testCaseLabel: string;
  winner: WinnerKey;
  gpt55: {
    model: string;
    score: number | null;
    output: string;
    latencyMs: number;
    error?: string;
    reasoning: string;
    strengths: string[];
    weaknesses: string[];
  };
  claude: {
    model: string;
    score: number | null;
    output: string;
    latencyMs: number;
    error?: string;
    reasoning: string;
    strengths: string[];
    weaknesses: string[];
  };
}

export interface EvalRunSummary {
  id: string;
  runAt: string;
  evalSetKey: string;
  evalSetLabel: string;
  totalCases: number;
  successfulCases: number;
  generatorModels: { gpt55: string; claude: string };
  judgeModel: string;
  avgScoreGpt55: number | null;
  avgScoreClaude: number | null;
  gpt55Wins: number;
  claudeWins: number;
  ties: number;
  errorCount: number;
  estimatedCostUsd: number;
  caseIds: string[];
}

export interface EvalTrends {
  avgScoreGpt55: DataPoint[];
  avgScoreClaude: DataPoint[];
  cost: DataPoint[];
  runs: DataPoint[];
}

export interface EvalDashboardPayload {
  source: "sample" | "reports";
  generatedAt: string;
  range: TimeRange;
  runs: EvalRunSummary[];
  cases: EvalCaseRow[];
  trends: EvalTrends;
  evalSets: EvalSetOption[];
}
