import { nowIso } from "../formatters";
import { scoreActionVerbs } from "./action-verbs";
import { scoreAtsFriendliness } from "./ats-friendliness";
import { scoreKeywordMatch } from "./keyword-match";
import { scoreLength } from "./length";
import { scoreQuantifiedAchievements } from "./quantified-achievements";
import { scoreSectionCompleteness } from "./section-completeness";
import { scoreSpellingGrammar } from "./spelling-grammar";
import type { ResumeScore, ResumeScoreInput } from "./types";

export function scoreResume(input: ResumeScoreInput): ResumeScore {
  const subScores = {
    sectionCompleteness: scoreSectionCompleteness(input),
    actionVerbs: scoreActionVerbs(input),
    quantifiedAchievements: scoreQuantifiedAchievements(input),
    keywordMatch: scoreKeywordMatch(input),
    length: scoreLength(input),
    spellingGrammar: scoreSpellingGrammar(input),
    atsFriendliness: scoreAtsFriendliness(input),
  };
  const overall = Object.values(subScores).reduce(
    (sum, subScore) => sum + subScore.earned,
    0,
  );

  return {
    overall: Math.max(0, Math.min(100, Math.round(overall))),
    subScores,
    generatedAt: nowIso(),
  };
}

export { scoreActionVerbs } from "./action-verbs";
export { scoreAtsFriendliness } from "./ats-friendliness";
export { scoreKeywordMatch } from "./keyword-match";
export { scoreLength } from "./length";
export { scoreQuantifiedAchievements } from "./quantified-achievements";
export { scoreSectionCompleteness } from "./section-completeness";
export { scoreSpellingGrammar } from "./spelling-grammar";
export type {
  ResumeScore,
  ResumeScoreInput,
  SubScore,
  SubScoreKey,
} from "./types";
