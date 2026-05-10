import { describe, expect, it } from "vitest";
import type { KeywordAnalysis } from "@/lib/ats/analyzer";
import type { TailoredResume } from "@/lib/resume/generator";
import {
  evaluateResultQuality,
  type ResultQualityInput,
} from "./rubric";

function strongFrontendResume(
  overrides: Partial<TailoredResume> = {},
): TailoredResume {
  return {
    contact: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "555-0100",
      location: "Remote",
    },
    summary:
      "Frontend engineer who builds accessible React and TypeScript product experiences for customer workflows.",
    experiences: [
      {
        company: "Acme",
        title: "Frontend Engineer",
        dates: "2022 - Present",
        highlights: [
          "Built React dashboards used by 5,000 customers.",
          "Improved TypeScript component reliability by 30%.",
        ],
      },
    ],
    skills: ["React", "TypeScript", "Accessibility", "CSS"],
    education: [],
    ...overrides,
  };
}

function evaluate(input: Partial<ResultQualityInput>) {
  return evaluateResultQuality({
    hasJobDescription: true,
    ...input,
  });
}

describe("evaluateResultQuality", () => {
  it("marks a strong frontend resume ready when evidence and match are solid", () => {
    const result = evaluate({
      jdMatchScore: 88,
      resume: strongFrontendResume(),
      missingKeywords: [],
    });

    expect(result.status).toBe("ready_to_apply");
    expect(result.nextActions).toHaveLength(3);
  });

  it("marks strong frontend evidence with a missing critical skill as light tailoring", () => {
    const result = evaluate({
      jdMatchScore: 78,
      resume: strongFrontendResume(),
      missingKeywords: ["graphql"],
    });

    expect(result.status).toBe("light_tailoring");
    expect(result.nextActions.join(" ")).toMatch(/graphql/i);
  });

  it("marks a weak resume as needing evidence", () => {
    const result = evaluate({
      jdMatchScore: 62,
      resume: strongFrontendResume({
        summary: "Student frontend developer.",
        experiences: [],
        skills: ["React"],
      }),
    });

    expect(result.status).toBe("needs_evidence");
    expect(result.reasons).toContain("weak_evidence");
  });

  it("does not certify keyword stuffing as ready to apply", () => {
    const keywords: KeywordAnalysis[] = [
      {
        keyword: "react",
        found: true,
        frequency: 12,
        locations: ["skills"],
      },
    ];

    const result = evaluate({
      jdMatchScore: 96,
      resume: strongFrontendResume(),
      keywords,
    });

    expect(result.status).toBe("needs_evidence");
    expect(result.rationale).toMatch(/Keywords are present/i);
  });

  it("marks an unrelated role as not a fit when match and evidence are low", () => {
    const result = evaluate({
      jdMatchScore: 18,
      resume: strongFrontendResume({
        summary: "React student.",
        experiences: [],
        skills: ["React"],
      }),
      missingKeywords: [
        "python",
        "sql",
        "machine learning",
        "tableau",
        "aws",
      ],
    });

    expect(result.status).toBe("not_a_fit");
  });

  it("missing contact details prevents ready and prompts a contact action", () => {
    const result = evaluate({
      jdMatchScore: 88,
      resume: strongFrontendResume({
        contact: {
          name: "Ada Lovelace",
          email: "",
          phone: "",
          location: "Remote",
        },
      }),
    });

    expect(result.status).toBe("light_tailoring");
    expect(result.nextActions.join(" ")).toMatch(/email and phone/i);
  });

  it("avoids role-fit claims when no job description is supplied", () => {
    const result = evaluateResultQuality({
      resume: strongFrontendResume(),
      hasJobDescription: false,
    });

    expect(result.status).toBe("light_tailoring");
    expect(result.nextActions[0]).toMatch(/job description/i);
  });
});
