import { PROBLEMATIC_CHARACTERS } from "@/lib/ats/analyzer";
import { SUB_SCORE_MAX_POINTS } from "./constants";
import { getResumeText } from "./text";
import type { ResumeScoreInput, SubScore } from "./types";

export function scoreAtsFriendliness(input: ResumeScoreInput): SubScore {
  const text = getResumeText(input.profile, input.rawText);
  const rawText = input.rawText ?? input.profile.rawText ?? "";
  const notes: string[] = [];
  const evidence: string[] = [];
  let deductions = 0;

  const foundProblematic = PROBLEMATIC_CHARACTERS.filter(({ char }) =>
    text.includes(char),
  );
  if (foundProblematic.length > 0) {
    const penalty = Math.min(3, foundProblematic.length);
    deductions += penalty;
    notes.push("Special formatting characters can reduce ATS parse quality.");
    evidence.push(`${foundProblematic.length} special characters`);
  }

  const badChars = (
    text.match(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []
  ).length;
  if (badChars > 0) {
    deductions += 2;
    notes.push("Control or replacement characters detected.");
    evidence.push(`${badChars} control or replacement character(s)`);
  }

  if (rawText.includes("\t")) {
    deductions += 2;
    notes.push("Tab characters may indicate table-style formatting.");
    evidence.push("Tab characters found");
  }

  const longLines = rawText.split(/\r?\n/).filter((line) => line.length > 200);
  if (longLines.length >= 4) {
    deductions += 2;
    notes.push("Very long lines may indicate multi-column or table formatting.");
    evidence.push(`${longLines.length} over-long lines`);
  }

  if (/<[a-zA-Z/][^>]*>/.test(rawText)) {
    deductions += 2;
    notes.push("HTML tags detected in resume text.");
    evidence.push("HTML tags found");
  }

  if (!/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(text)) {
    deductions += 2;
    notes.push("No email pattern detected in parseable resume text.");
    evidence.push("No email detected");
  }

  if (
    input.rawText !== undefined &&
    input.rawText.trim().length < 200 &&
    input.profile.experiences.length > 0
  ) {
    deductions += 3;
    notes.push("Extracted text is very short for a resume with experience.");
    evidence.push("Possible image-only PDF");
  }

  return {
    key: "atsFriendliness",
    label: "ATS friendliness",
    earned: Math.max(0, SUB_SCORE_MAX_POINTS.atsFriendliness - deductions),
    maxPoints: SUB_SCORE_MAX_POINTS.atsFriendliness,
    notes,
    evidence: evidence.length > 0 ? evidence : ["No ATS formatting issues detected."],
  };
}
