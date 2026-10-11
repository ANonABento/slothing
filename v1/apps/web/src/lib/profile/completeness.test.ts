import { describe, expect, it } from "vitest";

import { scoreProfile, getCrossedCompletenessThresholds } from "./completeness";
import type { Profile } from "@/types";

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "profile-1",
    contact: { name: "" },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    ...overrides,
  };
}

const richExperience = {
  id: "exp-1",
  company: "Anthropic",
  title: "Product Engineer",
  startDate: "2023-01-01",
  current: true,
  description: "Built product surfaces.",
  highlights: [
    "Improved activation by 18%",
    "Supported 12 engineers across launch work",
    "Reduced review time for application flows",
  ],
  skills: ["TypeScript"],
};

describe("scoreProfile", () => {
  it("returns 0 for an empty profile and all gaps", () => {
    const result = scoreProfile(makeProfile());

    expect(result.score).toBe(0);
    expect(result.gaps.map((gap) => gap.id)).toEqual([
      "contact-info",
      "summary",
      "experience-bullets",
      "quantified-bullets",
      "education",
      "skills",
      "career-depth",
      "achievements",
      "social-url",
    ]);
  });

  it("returns 100 for a full profile", () => {
    const result = scoreProfile(
      makeProfile({
        contact: {
          name: "Ari Rivers",
          email: "ari@example.com",
          headline: "Product engineer",
          linkedin: "https://linkedin.com/in/ari",
        },
        summary: "Product engineer focused on reliable application tooling.",
        experiences: [richExperience],
        education: [
          {
            id: "edu-1",
            institution: "State University",
            degree: "BS",
            field: "Computer Science",
            highlights: [],
          },
        ],
        skills: ["TypeScript", "React", "Node.js", "SQL", "Testing"].map(
          (name) => ({ id: name, name, category: "technical" as const }),
        ),
        projects: [
          {
            id: "project-1",
            name: "Resume Builder",
            description: "Built a resume workflow.",
            technologies: ["React"],
            highlights: [],
          },
        ],
        certifications: [
          {
            id: "cert-1",
            name: "AWS Cloud Practitioner",
            issuer: "AWS",
          },
        ],
      }),
    );

    expect(result.score).toBe(100);
    expect(result.gaps).toEqual([]);
  });

  it("requires name, email, and headline for contact points", () => {
    expect(
      scoreProfile(
        makeProfile({
          contact: { name: "Ari", email: "ari@example.com" },
        }),
      ).score,
    ).toBe(0);

    expect(
      scoreProfile(
        makeProfile({
          contact: {
            name: "Ari",
            email: "ari@example.com",
            headline: "Engineer",
          },
        }),
      ).score,
    ).toBe(10);
  });

  it("requires one experience with at least 3 bullets", () => {
    const result = scoreProfile(
      makeProfile({
        experiences: [
          { ...richExperience, highlights: ["Built tools", "Shipped UI"] },
        ],
      }),
    );

    expect(result.score).toBe(0);
    expect(
      result.gaps.find((gap) => gap.id === "experience-bullets")?.label,
    ).toMatchInlineSnapshot(`"Add 1 more bullet to your Anthropic role"`);
  });

  it("requires at least two quantified experience bullets", () => {
    const oneQuantified = scoreProfile(
      makeProfile({
        experiences: [
          {
            ...richExperience,
            highlights: [
              "Improved activation by 18%",
              "Built tools",
              "Shipped UI",
            ],
          },
        ],
      }),
    );
    const twoQuantified = scoreProfile(
      makeProfile({
        experiences: [richExperience],
      }),
    );

    expect(oneQuantified.score).toBe(20);
    expect(
      oneQuantified.gaps.find((gap) => gap.id === "quantified-bullets"),
    ).toBeTruthy();
    expect(twoQuantified.score).toBe(30);
  });

  it("requires five skills", () => {
    const fourSkills = scoreProfile(
      makeProfile({
        skills: ["TypeScript", "React", "Node.js", "SQL"].map((name) => ({
          id: name,
          name,
          category: "technical" as const,
        })),
      }),
    );
    const fiveSkills = scoreProfile(
      makeProfile({
        skills: ["TypeScript", "React", "Node.js", "SQL", "Testing"].map(
          (name) => ({ id: name, name, category: "technical" as const }),
        ),
      }),
    );

    expect(fourSkills.score).toBe(0);
    expect(fiveSkills.score).toBe(10);
  });

  it("accepts either a project or a second experience for career-depth points", () => {
    expect(
      scoreProfile(
        makeProfile({
          projects: [
            {
              id: "project-1",
              name: "Portfolio",
              description: "",
              technologies: [],
              highlights: [],
            },
          ],
        }),
      ).score,
    ).toBe(10);

    expect(
      scoreProfile(
        makeProfile({
          experiences: [
            richExperience,
            { ...richExperience, id: "exp-2", company: "OpenAI" },
          ],
        }),
      ).score,
    ).toBe(40);
  });

  it("treats certifications as the persisted achievements and awards signal", () => {
    const result = scoreProfile(
      makeProfile({
        certifications: [{ id: "cert-1", name: "Award", issuer: "ACM" }],
      }),
    );

    expect(result.score).toBe(10);
  });

  it("accepts either LinkedIn or GitHub for social URL points", () => {
    expect(
      scoreProfile(
        makeProfile({
          contact: { name: "", github: "https://github.com/ari" },
        }),
      ).score,
    ).toBe(10);

    expect(
      scoreProfile(
        makeProfile({
          contact: { name: "", linkedin: "https://linkedin.com/in/ari" },
        }),
      ).score,
    ).toBe(10);
  });
});

describe("getCrossedCompletenessThresholds", () => {
  it("returns upward threshold crossings only", () => {
    expect(getCrossedCompletenessThresholds(40, 76)).toEqual([50, 75]);
    expect(getCrossedCompletenessThresholds(80, 75)).toEqual([]);
    expect(getCrossedCompletenessThresholds(100, 100)).toEqual([]);
  });
});
