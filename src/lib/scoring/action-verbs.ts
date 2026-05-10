import { ACTION_VERBS, SUB_SCORE_MAX_POINTS } from "./constants";
import { getHighlights, normalizeText, wordBoundaryRegex } from "./text";
import type { ResumeScoreInput, SubScore } from "./types";

function pointsForDistinctVerbs(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 5;
  if (count <= 4) return 9;
  if (count <= 7) return 12;
  return 15;
}

export function scoreActionVerbs(input: ResumeScoreInput): SubScore {
  const distinctVerbs = new Set<string>();

  for (const highlight of getHighlights(input.profile)) {
    const firstWord = normalizeText(highlight).split(/\s+/)[0] ?? "";
    for (const verb of ACTION_VERBS) {
      if (wordBoundaryRegex(verb).test(firstWord)) {
        distinctVerbs.add(verb);
      }
    }
  }

  const verbs = Array.from(distinctVerbs).sort();
  const notes =
    verbs.length === 0
      ? ["Start achievement bullets with strong action verbs."]
      : [];
  const preview = verbs.slice(0, 5).join(", ");

  return {
    key: "actionVerbs",
    label: "Action verbs",
    earned: pointsForDistinctVerbs(verbs.length),
    maxPoints: SUB_SCORE_MAX_POINTS.actionVerbs,
    notes,
    evidence: [
      preview
        ? `${verbs.length} distinct action verbs (${preview})`
        : "0 distinct action verbs",
    ],
  };
}
