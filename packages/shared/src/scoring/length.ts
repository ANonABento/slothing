import { SUB_SCORE_MAX_POINTS } from "./constants";
import { getResumeText, wordCount } from "./text";
import type { ResumeScoreInput, SubScore } from "./types";

function pointsForWordCount(count: number): number {
  if (count >= 400 && count <= 700) return 10;
  if ((count >= 300 && count <= 399) || (count >= 701 && count <= 900)) return 7;
  if ((count >= 200 && count <= 299) || (count >= 901 && count <= 1100)) return 4;
  if ((count >= 150 && count <= 199) || (count >= 1101 && count <= 1400)) {
    return 2;
  }
  return 0;
}

export function scoreLength(input: ResumeScoreInput): SubScore {
  const count = wordCount(getResumeText(input.profile, input.rawText));
  const earned = pointsForWordCount(count);
  const notes =
    earned === SUB_SCORE_MAX_POINTS.length
      ? []
      : ["Resume length is outside the 400-700 word target band."];

  return {
    key: "length",
    label: "Length",
    earned,
    maxPoints: SUB_SCORE_MAX_POINTS.length,
    notes,
    evidence: [`${count} words`],
  };
}
