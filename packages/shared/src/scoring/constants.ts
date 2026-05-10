import type { SubScoreKey } from "./types";

export const SUB_SCORE_MAX_POINTS: Record<SubScoreKey, number> = {
  sectionCompleteness: 10,
  actionVerbs: 15,
  quantifiedAchievements: 20,
  keywordMatch: 25,
  length: 10,
  spellingGrammar: 10,
  atsFriendliness: 10,
};

export const ACTION_VERBS = [
  "achieved",
  "analyzed",
  "architected",
  "built",
  "collaborated",
  "created",
  "delivered",
  "designed",
  "developed",
  "drove",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "mentored",
  "optimized",
  "reduced",
  "resolved",
  "shipped",
  "streamlined",
  "supported",
  "transformed",
] as const;

export const QUANTIFIED_REGEX =
  /\d+%|\$[\d,]+(?:\.\d+)?[kKmMbB]?|\b\d+x\b|\bteam of \d+\b|\b\d+\s+(users|customers|clients|projects|people|engineers|reports|hours|members|countries|languages|states|cities|stores|partners|deals|leads)\b/gi;
