import { ACTION_VERBS, SUB_SCORE_MAX_POINTS } from "./constants";
import { getHighlights, normalizeText } from "./text";
import type { ResumeScoreInput, SubScore } from "./types";

const REPEATED_WORD_EXCEPTIONS = new Set(["had had", "that that"]);
const ACRONYMS = new Set(["API", "AWS", "CSS", "GCP", "HTML", "SQL"]);

function hasVerbLikeToken(text: string): boolean {
  const words = normalizeText(text).split(/\s+/).filter(Boolean);
  return words.some(
    (word) =>
      ACTION_VERBS.includes(word as (typeof ACTION_VERBS)[number]) ||
      /(?:ed|ing|s)$/.test(word),
  );
}

export function scoreSpellingGrammar(input: ResumeScoreInput): SubScore {
  const highlights = getHighlights(input.profile);
  const text = highlights.join("\n");
  const notes: string[] = [];
  const evidence: string[] = [];
  let deductions = 0;

  const repeated = Array.from(
    text.matchAll(/\b(\w+)\s+\1\b/gi),
    (match) => match[0],
  ).filter((match) => !REPEATED_WORD_EXCEPTIONS.has(match.toLowerCase()));
  if (repeated.length > 0) {
    const penalty = Math.min(2, repeated.length);
    deductions += penalty;
    notes.push("Repeated adjacent words detected.");
    evidence.push(`Repeated word: ${repeated[0]}`);
  }

  if (/  +/.test(text)) {
    deductions += 1;
    notes.push("Multiple spaces between words detected.");
    evidence.push("Multiple spaces found.");
  }

  const lowercaseStarts = highlights.filter((highlight) =>
    /^[a-z]/.test(highlight.trim()),
  );
  if (lowercaseStarts.length > 0) {
    const penalty = Math.min(3, lowercaseStarts.length);
    deductions += penalty;
    notes.push("Some highlights start with lowercase letters.");
    evidence.push(`Lowercase start: ${lowercaseStarts[0]}`);
  }

  const fragments = highlights.filter(
    (highlight) => highlight.length > 40 && !hasVerbLikeToken(highlight),
  );
  if (fragments.length > 0) {
    const penalty = Math.min(2, fragments.length);
    deductions += penalty;
    notes.push("Some long highlights may read like sentence fragments.");
    evidence.push(`Possible fragment: ${fragments[0]}`);
  }

  const punctuationEndings = highlights.filter((highlight) =>
    /\.$/.test(highlight.trim()),
  ).length;
  if (highlights.length > 1) {
    const rate = punctuationEndings / highlights.length;
    if (rate > 0.3 && rate < 0.7) {
      deductions += 1;
      notes.push("Trailing punctuation is inconsistent across highlights.");
      evidence.push(`${punctuationEndings}/${highlights.length} highlights end with periods.`);
    }
  }

  const allCaps = Array.from(text.matchAll(/\b[A-Z]{4,}\b/g), (match) => match[0])
    .filter((word) => !ACRONYMS.has(word));
  if (allCaps.length > 5) {
    deductions += 1;
    notes.push("Excessive all-caps words detected.");
    evidence.push(`All-caps words: ${allCaps.slice(0, 3).join(", ")}`);
  }

  return {
    key: "spellingGrammar",
    label: "Spelling and grammar",
    earned: Math.max(0, SUB_SCORE_MAX_POINTS.spellingGrammar - deductions),
    maxPoints: SUB_SCORE_MAX_POINTS.spellingGrammar,
    notes,
    evidence: evidence.length > 0 ? evidence : ["No heuristic issues detected."],
  };
}
