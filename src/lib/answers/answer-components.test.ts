import { describe, expect, it } from "vitest";
import { classifyAnswerComponent } from "./answer-components";

describe("classifyAnswerComponent", () => {
  it("classifies work authorization answers", () => {
    expect(
      classifyAnswerComponent({
        question: "Will you require visa sponsorship?",
        answer: "No, I am authorized to work in Canada.",
        sourceUrl: null,
      }),
    ).toBe("work_authorization");
  });

  it("classifies logistics answers", () => {
    expect(
      classifyAnswerComponent({
        question: "When are you available to start?",
        answer: "I can start in September and am open to hybrid work.",
        sourceUrl: null,
      }),
    ).toBe("logistics");
  });

  it("classifies portfolio and profile links", () => {
    expect(
      classifyAnswerComponent({
        question: "Portfolio URL",
        answer: "https://example.com",
        sourceUrl: "https://github.com/example",
      }),
    ).toBe("links");
  });

  it("falls back to repeated question", () => {
    expect(
      classifyAnswerComponent({
        question: "Why are you interested in this role?",
        answer: "I like building useful tools.",
        sourceUrl: null,
      }),
    ).toBe("repeated_question");
  });
});
