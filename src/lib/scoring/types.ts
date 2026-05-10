import type { JobDescription, Profile } from "@/types";

export type SubScoreKey =
  | "sectionCompleteness"
  | "actionVerbs"
  | "quantifiedAchievements"
  | "keywordMatch"
  | "length"
  | "spellingGrammar"
  | "atsFriendliness";

export interface SubScore {
  key: SubScoreKey;
  label: string;
  earned: number;
  maxPoints: number;
  notes: string[];
  evidence: string[];
}

export interface ResumeScoreInput {
  profile: Profile;
  rawText?: string;
  job?: JobDescription;
}

export interface ResumeScore {
  overall: number;
  subScores: Record<SubScoreKey, SubScore>;
  generatedAt: string;
}
