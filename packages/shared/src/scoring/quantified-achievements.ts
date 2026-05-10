import { QUANTIFIED_REGEX, SUB_SCORE_MAX_POINTS } from "./constants";
import { getHighlights } from "./text";
import type { ResumeScoreInput, SubScore } from "./types";

function pointsForQuantifiedResults(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 6;
  if (count === 2) return 12;
  if (count <= 4) return 16;
  return 20;
}

export function scoreQuantifiedAchievements(input: ResumeScoreInput): SubScore {
  const text = getHighlights(input.profile).join("\n");
  const matches = Array.from(
    text.matchAll(QUANTIFIED_REGEX),
    (match) => match[0],
  );
  const notes =
    matches.length === 0
      ? ["Add metrics such as percentages, volume, team size, or revenue."]
      : [];

  return {
    key: "quantifiedAchievements",
    label: "Quantified achievements",
    earned: pointsForQuantifiedResults(matches.length),
    maxPoints: SUB_SCORE_MAX_POINTS.quantifiedAchievements,
    notes,
    evidence: [
      `${matches.length} quantified result(s)`,
      ...matches.slice(0, 3),
    ],
  };
}
