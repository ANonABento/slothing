import { describe, expect, it } from "vitest";
import {
  applyGenericPhrasePenaltyToCritique,
  buildCoverLetterCritiqueMessages,
  parseCoverLetterCritiqueResponse,
} from "./critique-prompts";

describe("cover letter critique prompts", () => {
  it("builds system and user prompts with the rubric and draft context", () => {
    const messages = buildCoverLetterCritiqueMessages({
      letter: "Dear Acme, I built reliable systems.",
      jd: "Acme needs a product engineer for developer tooling.",
      company: "Acme",
      role: "Product Engineer",
    });

    expect(messages[0]).toMatchObject({ role: "system" });
    expect(messages[0].content).toContain("Company fit");
    expect(messages[0].content).toContain("range_in_letter");
    expect(messages[0].content).toContain("exact draft excerpt");
    expect(messages[0].content).toContain("lower specificity and hook scores");
    expect(messages[0].content).toContain("Do not invent candidate achievements");
    expect(messages[1]).toEqual({
      role: "user",
      content: expect.stringContaining("Company: Acme"),
    });
    expect(messages[1].content).toContain("Role: Product Engineer");
    expect(messages[1].content).toContain("Dear Acme");
  });

  it("parses validated critique JSON from fenced LLM output", () => {
    const critique = parseCoverLetterCritiqueResponse(`\`\`\`json
{
  "scores": { "fit": 8, "specificity": 7, "hook": 6, "ask": 9 },
  "overall": 7.5,
  "rationale_per_axis": {
    "fit": "Names Acme and the tooling problem.",
    "specificity": "Includes some concrete systems.",
    "hook": "Opening is clear but not sharp.",
    "ask": "Close asks for a conversation."
  },
  "suggested_rewrites": [
    {
      "range_in_letter": "I built reliable systems.",
      "suggestion": "I improved reliability for developer workflows used daily.",
      "why": "Adds a clearer scope."
    },
    {
      "range_in_letter": "Dear Acme",
      "suggestion": "Dear Acme hiring team",
      "why": "Sounds more direct."
    }
  ]
}
\`\`\``);

    expect(critique.overall).toBe(7.5);
    expect(critique.scores.fit).toBe(8);
    expect(critique.suggested_rewrites).toHaveLength(2);
  });

  it("rejects responses with too few rewrite suggestions", () => {
    expect(() =>
      parseCoverLetterCritiqueResponse(
        JSON.stringify({
          scores: { fit: 8, specificity: 7, hook: 6, ask: 9 },
          overall: 7.5,
          rationale_per_axis: {
            fit: "Fit",
            specificity: "Specific",
            hook: "Hook",
            ask: "Ask",
          },
          suggested_rewrites: [
            {
              range_in_letter: "Generic sentence.",
              suggestion: "Better sentence.",
              why: "More specific.",
            },
          ],
        }),
      ),
    ).toThrow();
  });

  it("applies a bounded generic phrase penalty to specificity and hook", () => {
    const adjusted = applyGenericPhrasePenaltyToCritique(
      {
        scores: { fit: 8, specificity: 7, hook: 6, ask: 9 },
        overall: 7.5,
        rationale_per_axis: {
          fit: "Fit",
          specificity: "Specific",
          hook: "Hook",
          ask: "Ask",
        },
        suggested_rewrites: [
          {
            range_in_letter: "passionate about",
            suggestion: "Built API tests",
            why: "Uses evidence.",
          },
          {
            range_in_letter: "dynamic team",
            suggestion: "frontend platform team",
            why: "Names context.",
          },
        ],
      },
      "I am passionate about this role and excited about this opportunity. My strong background makes me a perfect fit for your dynamic team.",
    );

    expect(adjusted.scores.specificity).toBeLessThan(7);
    expect(adjusted.scores.hook).toBeLessThan(6);
    expect(adjusted.rationale_per_axis.specificity).toContain(
      '"passionate about"',
    );
  });
});
