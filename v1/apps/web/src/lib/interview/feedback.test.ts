import { describe, expect, it } from "vitest";
import { analyzeInterviewAnswer, summarizeInterviewFeedback } from "./feedback";
import { countFillerWords } from "./filler-words";
import { detectStarCoverage } from "./star-detector";
import type { InterviewQuestion } from "@/types/interview";

const strongAnswer = [
  "When our onboarding project was missing its launch date, the situation was that three teams were using different intake forms and customer setup took too long.",
  "My task was to own the workflow redesign and make the first week easier for new customers.",
  "I led interviews with support, built a shared checklist, implemented automated reminders, and created a dashboard for blocked accounts.",
  "The result was an 18% reduction in setup time, 25 fewer support tickets per month, and a launch that finished 6 weeks later with the new process adopted by every team.",
  "I also documented the tradeoffs, reviewed the rollout with managers, and made sure the handoff stayed clear for future launches.",
  "After launch I shared the dashboard in our weekly review, trained support leads on the checklist, and asked account managers to flag unclear steps. That follow-through kept the process stable during the next rollout, gave leadership a reliable view of risk, and helped the team repeat the same operating rhythm without extra meetings.",
].join(" ");

const mediumAnswer = [
  "Um, when my team had a project with a tight deadline, I built a simple plan and, like, helped the team decide what to do first.",
  "I created a checklist, moved the riskiest item to the top, and basically kept people updated each morning.",
  "We finished 1 milestone early, but I would add more detail about the final result next time.",
  "The answer has a useful shape, though it still needs clearer ownership, stronger context, and a more specific explanation of how the work changed the customer or business outcome.",
].join(" ");

const weakAnswer =
  "Um, like, you know, I guess I kind of just helped with stuff and basically it was actually fine.";

const naturalStarAnswer = [
  "During onboarding, our dashboard route was slow enough that users abandoned the first setup step and support kept getting confused tickets.",
  "I profiled the page, split the route so the heavy editor loaded later, added keyboard focus states for the setup form, and paired with support to verify the confusing path.",
  "That reduced time to interactive by 30%, cut first-week setup tickets by 12, and gave the team a cleaner route to reuse for the next launch.",
].join(" ");

const questions: InterviewQuestion[] = [
  { question: "Tell me about a challenge.", category: "behavioral" },
  { question: "Tell me about a project.", category: "behavioral" },
  { question: "Tell me about another project.", category: "technical" },
];

describe("interview feedback heuristics", () => {
  it("counts fillers with word boundaries", () => {
    const fillers = countFillerWords(
      "Um, I liked the work. You know, like it mattered.",
    );

    expect(fillers.total).toBe(3);
    expect(fillers.matches.map((match) => match.phrase)).toEqual([
      "you know",
      "um",
      "like",
    ]);
  });

  it("detects STAR coverage with keyword signals", () => {
    const coverage = detectStarCoverage(strongAnswer);

    expect(coverage.covered).toEqual(["situation", "task", "action", "result"]);
    expect(coverage.score).toBe(4);
  });

  it("detects natural STAR signals without canonical labels", () => {
    const coverage = detectStarCoverage(naturalStarAnswer);

    expect(coverage.covered).toEqual(
      expect.arrayContaining(["situation", "action", "result"]),
    );
    expect(coverage.score).toBeGreaterThanOrEqual(3);
  });

  it("rates a strong sample answer green across all metrics", () => {
    const scorecard = analyzeInterviewAnswer({
      answer: strongAnswer,
      category: "behavioral",
      durationSeconds: 72,
    });

    expect(scorecard.filler.rating).toBe("green");
    expect(scorecard.star.rating).toBe("green");
    expect(scorecard.quantification.rating).toBe("green");
    expect(scorecard.length.rating).toBe("green");
    expect(scorecard.pace.rating).toBe("green");
    expect(scorecard.topSuggestion).toMatch(/Strong structure/i);
  });

  it("rates a medium sample answer with partial coaching signals", () => {
    const scorecard = analyzeInterviewAnswer({
      answer: mediumAnswer,
      category: "behavioral",
      durationSeconds: 45,
    });

    expect(scorecard.filler.rating).toBe("yellow");
    expect(scorecard.star.rating).toBe("yellow");
    expect(scorecard.quantification.rating).toBe("yellow");
    expect(scorecard.length.rating).toBe("yellow");
    expect(scorecard.pace.rating).toBe("yellow");
    expect(scorecard.topSuggestion).toMatch(/setup|role/i);
  });

  it("does not suggest adding actions when natural actions are present", () => {
    const scorecard = analyzeInterviewAnswer({
      answer: naturalStarAnswer,
      category: "behavioral",
      durationSeconds: 70,
    });

    expect(scorecard.star.covered).toEqual(expect.arrayContaining(["action"]));
    expect(scorecard.topSuggestion).not.toMatch(/add.*actions/i);
    expect(scorecard.overallRating).not.toBe("red");
  });

  it("rates a weak sample answer red across all metrics", () => {
    const scorecard = analyzeInterviewAnswer({
      answer: weakAnswer,
      category: "behavioral",
      durationSeconds: 20,
    });

    expect(scorecard.filler.rating).toBe("red");
    expect(scorecard.star.rating).toBe("red");
    expect(scorecard.quantification.rating).toBe("red");
    expect(scorecard.length.rating).toBe("red");
    expect(scorecard.pace.rating).toBe("red");
    expect(scorecard.topSuggestion).toMatch(/specific example/i);
  });

  it("gates vague short behavioral answers", () => {
    const scorecard = analyzeInterviewAnswer({
      answer: "I helped with a hard project and it went pretty well.",
      category: "behavioral",
      durationSeconds: 15,
    });

    expect(scorecard.overallRating).toBe("red");
    expect(scorecard.star.rating).toBe("red");
    expect(scorecard.quantification.rating).toBe("red");
    expect(scorecard.topSuggestion).toMatch(/specific example|story|context/i);
  });

  it("flags tool list answers as not answering the behavioral question", () => {
    const scorecard = analyzeInterviewAnswer({
      answer:
        "React, TypeScript, Tailwind, Prisma, PostgreSQL, Docker, AWS, GitHub Actions.",
      category: "behavioral",
      durationSeconds: 60,
    });

    expect(scorecard.overallRating).toBe("red");
    expect(scorecard.star.score).toBeLessThanOrEqual(1);
    expect(scorecard.topSuggestion).toMatch(
      /behavioral question|specific story/i,
    );
  });

  it("excludes blank and skipped answers from aggregate summaries", () => {
    const summary = summarizeInterviewFeedback({
      questions,
      answers: [strongAnswer, "   ", "[skipped]"],
      skipped: [false, false, true],
    });

    expect(summary.answeredCount).toBe(1);
    expect(summary.scorecards).toHaveLength(1);
    expect(summary.totalQuantificationCount).toBeGreaterThanOrEqual(2);
  });
});
