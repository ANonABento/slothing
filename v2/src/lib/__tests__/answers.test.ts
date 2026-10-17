import { describe, expect, it } from "vitest";

import { MATCH_THRESHOLD, bestAnswer, matchOption, questionSimilarity, questionTerms } from "../answers";
import { answerWarning } from "../tailor";
import type { Answer } from "../types";
import { profile } from "./fixture";

const answer = (question: string, text: string, extra: Partial<Answer> = {}): Answer => ({
  id: `ans_${question.length}`,
  question,
  answer: text,
  sourceUrl: "",
  uses: 0,
  usedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...extra,
});

describe("questionTerms", () => {
  it("folds the US but keeps 'tell us' a stop word", () => {
    expect([...questionTerms("Are you authorized to work in the U.S.?")]).toEqual(expect.arrayContaining(["authorized", "united", "state"]));
    expect(questionTerms("Tell us about yourself").has("united")).toBe(false);
  });
  it("drops framing words and required markers", () => {
    expect([...questionTerms("Please describe your notice period *")]).toEqual(["start", "date"]);
  });
});

describe("questionSimilarity", () => {
  const same = [
    ["Are you legally authorized to work in the United States?", "Are you authorized to work in the US?"],
    ["Will you now or in the future require visa sponsorship?", "Do you require sponsorship?"],
    ["What are your salary expectations?", "Desired compensation range"],
    ["How did you hear about us?", "How did you learn about this job?"],
    ["What are your pronouns?", "Pronouns"],
    ["LinkedIn profile", "LinkedIn Profile URL"],
  ];
  it.each(same)("matches %s ~ %s", (a, b) => expect(questionSimilarity(a, b)).toBeGreaterThanOrEqual(0.6));

  const different = [
    ["Why do you want to work here?", "Why are you interested in this role?"],
    ["Are you authorized to work in the United States?", "Will you require sponsorship?"],
    ["What are your salary expectations?", "When can you start?"],
    ["Are you open to relocation?", "Are you open to working onsite?"],
  ];
  it.each(different)("does not match %s ~ %s", (a, b) => expect(questionSimilarity(a, b)).toBeLessThan(0.6));
});

describe("question synonyms", () => {
  it("salary and start-date questions match however they're worded", () => {
    expect(questionSimilarity("Expected salary", "What are your salary expectations?")).toBeGreaterThanOrEqual(MATCH_THRESHOLD);
    expect(questionSimilarity("Notice period / availability", "When can you start?")).toBeGreaterThanOrEqual(MATCH_THRESHOLD);
    expect(questionSimilarity("Desired start date", "When can you start?")).toBeGreaterThanOrEqual(MATCH_THRESHOLD);
    expect(questionSimilarity("Expected salary", "When can you start?")).toBeLessThan(MATCH_THRESHOLD);
  });
});

describe("bestAnswer", () => {
  it("prefers the closest question, and skips blank answers", () => {
    const bank = [
      answer("Do you require sponsorship?", "No"),
      answer("Are you authorized to work in the US?", "Yes"),
      answer("Are you legally authorized to work in the United States?", ""),
    ];
    expect(bestAnswer("Are you legally authorized to work in the United States? *", bank)?.answer.answer).toBe("Yes");
  });
  it("breaks ties by the most recently used", () => {
    const bank = [answer("When can you start?", "In two weeks"), answer("When can you start", "Immediately", { usedAt: "2026-06-01T00:00:00.000Z" })];
    expect(bestAnswer("When could you start?", bank)?.answer.answer).toBe("Immediately");
  });
  it("returns null when nothing is close", () => {
    expect(bestAnswer("Describe a time you failed", [answer("What are your pronouns?", "she/her")])).toBeNull();
  });
});

describe("matchOption", () => {
  it("picks the same text, then an option starting with the answer", () => {
    expect(matchOption("Yes", ["No", "Yes"])).toBe(1);
    expect(matchOption("yes", ["Select…", "Yes, I am authorized", "No, I am not"])).toBe(1);
  });
  it("picks an option the answer starts with, longest first", () => {
    expect(matchOption("No, I don't need it", ["Yes", "No"])).toBe(1);
    expect(matchOption("I am not a protected veteran", ["I am a protected veteran", "I am not a protected veteran", "I don't wish to answer"])).toBe(1);
  });
  it("returns -1 when no option fits", () => {
    expect(matchOption("Maybe", ["Yes", "No"])).toBe(-1);
    expect(matchOption("", ["Yes"])).toBe(-1);
  });
});

describe("answerWarning", () => {
  const job = {
    title: "ICU Registered Nurse",
    company: "Mercy",
    description:
      "You will provide hemodynamic monitoring for critical patients. Hemodynamic monitoring experience required. Strong hemodynamic monitoring skills and TypeScript.",
  };
  it("flags a posting term the profile never uses", () => {
    expect(answerWarning(profile, "I have done hemodynamic monitoring on every shift.", job)).toMatch(/hemodynamic/i);
  });
  it("allows terms the profile has, and the job title's own words", () => {
    expect(answerWarning(profile, "I write TypeScript and want to be a nurse.", job)).toBeUndefined();
  });
  it("flags numbers the profile doesn't state", () => {
    expect(answerWarning(profile, "I cut CI time by 70%.")).toMatch(/70%/);
    expect(answerWarning(profile, "I cut CI time by 40%.")).toBeUndefined();
  });
});
