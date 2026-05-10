import { describe, expect, it } from "vitest";
import type { JobDescription, Profile } from "@/types";
import { scanResume } from "./index";

function fixtureProfile(): Profile {
  return {
    id: "profile-1",
    contact: {
      name: "Jordan Lee",
      email: "jordan@example.com",
      phone: "555-123-4567",
      linkedin: "linkedin.com/in/jordanlee",
    },
    summary:
      "Senior software engineer with 7 years of experience building reliable React, TypeScript, and Node.js products for SaaS teams.",
    experiences: [
      {
        id: "exp-1",
        title: "Senior Software Engineer",
        company: "Acme",
        startDate: "Jan 2021",
        endDate: "Present",
        current: true,
        description:
          "Led platform modernization for customer-facing analytics applications.",
        highlights: [
          "Built React and TypeScript dashboards used by 25,000 users.",
          "Added Playwright regression tests that improved release confidence.",
          "Improved API latency by 35% and reduced incident volume by 20%.",
          "Mentored team of 6 engineers and shipped Node.js services.",
        ],
        skills: ["React", "TypeScript", "Playwright", "Node.js", "AWS"],
      },
      {
        id: "exp-2",
        title: "Software Engineer",
        company: "Beta Co",
        startDate: "Jun 2017",
        endDate: "Dec 2020",
        current: false,
        description:
          "Developed web applications and optimized backend services.",
        highlights: [
          "Delivered 12 projects and increased test coverage to 85%.",
        ],
        skills: ["JavaScript", "PostgreSQL"],
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "State University",
        degree: "BS",
        field: "Computer Science",
        highlights: ["Dean's List"],
      },
    ],
    skills: [
      { id: "skill-1", name: "React", category: "technical" },
      { id: "skill-2", name: "TypeScript", category: "technical" },
      { id: "skill-3", name: "Node.js", category: "technical" },
      { id: "skill-4", name: "AWS", category: "technical" },
      { id: "skill-5", name: "PostgreSQL", category: "technical" },
      { id: "skill-6", name: "Playwright", category: "technical" },
    ],
    projects: [],
    certifications: [],
    rawText: "",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };
}

function fixtureJob(): JobDescription {
  return {
    id: "job-1",
    title: "Senior Frontend Engineer",
    company: "Target",
    description:
      "We need a Senior Engineer with React, TypeScript, Playwright, Node.js, AWS, API performance, analytics dashboards, PostgreSQL, mentoring, and SaaS experience.",
    requirements: [
      "React",
      "TypeScript",
      "Playwright",
      "Node.js",
      "AWS",
      "PostgreSQL",
    ],
    responsibilities: [],
    keywords: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
    createdAt: "2024-01-01",
  };
}

describe("scanResume", () => {
  it("scores a strong fixture highly across all axes", () => {
    const profile = fixtureProfile();
    const result = scanResume(profile, undefined, fixtureJob());

    expect(result.overall).toBeGreaterThanOrEqual(80);
    expect(Object.values(result.axes).every((axis) => axis.score > 60)).toBe(
      true,
    );
  });

  it("penalizes missing email in parseability and section completeness", () => {
    const profile = fixtureProfile();
    profile.contact.email = "";
    const result = scanResume(profile);

    expect(result.axes.parseability.score).toBeLessThan(100);
    expect(result.axes.sectionCompleteness.score).toBeLessThan(100);
  });

  it("penalizes resumes without dates", () => {
    const profile = fixtureProfile();
    profile.experiences = profile.experiences.map((experience) => ({
      ...experience,
      startDate: "",
      endDate: "",
      current: false,
    }));

    const result = scanResume(profile);

    expect(result.axes.datesAndTenure.score).toBeLessThan(60);
  });

  it("computes keyword match with and without a job description", () => {
    const profile = fixtureProfile();

    expect(
      scanResume(profile, undefined, fixtureJob()).axes.keywordMatch.score,
    ).toBeGreaterThanOrEqual(70);
    expect(scanResume(profile).axes.keywordMatch.score).toBeGreaterThanOrEqual(
      80,
    );
  });

  it("buckets strong JD matches as evidence-backed", () => {
    const result = scanResume(fixtureProfile(), undefined, fixtureJob());

    expect(result.keywordEvidence?.matchedWithEvidence).toEqual(
      expect.arrayContaining(["react", "typescript", "playwright"]),
    );
    expect(result.axes.keywordMatch.evidence.join(" ")).toMatch(
      /React|TypeScript|Playwright/i,
    );
  });

  it("penalizes repeated keywords without evidence", () => {
    const profile = fixtureProfile();
    profile.summary =
      "React TypeScript Playwright React TypeScript Playwright React TypeScript Playwright.";
    profile.experiences = [];
    profile.projects = [];
    profile.skills = [
      { id: "skill-1", name: "React", category: "technical" },
      { id: "skill-2", name: "TypeScript", category: "technical" },
      { id: "skill-3", name: "Playwright", category: "technical" },
    ];

    const result = scanResume(
      profile,
      "React TypeScript Playwright React TypeScript Playwright React TypeScript Playwright React TypeScript Playwright",
      fixtureJob(),
    );

    expect(result.axes.keywordMatch.score).toBeLessThan(55);
    expect(result.keywordEvidence?.stuffed).toEqual(
      expect.arrayContaining(["react", "typescript", "playwright"]),
    );
    expect(result.issues.map((item) => item.title).join(" ")).toMatch(
      /stuffing|thin evidence/i,
    );
  });

  it("uses the supplied data JD keywords instead of frontend terms", () => {
    const dataJob: JobDescription = {
      id: "data-job",
      title: "Data Scientist",
      company: "Data Co",
      description:
        "Python, SQL, machine learning, dashboards, statistics, and experiment analysis are required.",
      requirements: ["Python", "SQL", "machine learning", "statistics"],
      responsibilities: [],
      keywords: ["Python", "SQL", "machine learning", "statistics"],
      createdAt: "2024-01-01",
    };

    const result = scanResume(fixtureProfile(), undefined, dataJob);

    expect(result.axes.keywordMatch.score).toBeLessThan(70);
    expect(result.keywordEvidence?.missing).toEqual(
      expect.arrayContaining(["python", "machine learning", "statistics"]),
    );
  });

  it("keeps skills-only matches out of the evidence bucket", () => {
    const profile = fixtureProfile();
    profile.experiences = [];
    profile.projects = [];
    profile.summary = "Frontend engineer.";

    const result = scanResume(profile, undefined, fixtureJob());

    expect(result.keywordEvidence?.mentionedOnly).toEqual(
      expect.arrayContaining(["react", "typescript", "playwright"]),
    );
    expect(result.keywordEvidence?.matchedWithEvidence).not.toEqual(
      expect.arrayContaining(["react", "typescript", "playwright"]),
    );
  });

  it("allows synonym matches to be evidence-backed", () => {
    const profile = fixtureProfile();
    profile.experiences[0].highlights = [
      "Built PostgreSQL reporting services that reduced analyst wait time by 30%.",
    ];
    const job = fixtureJob();
    job.keywords = ["postgres"];
    job.requirements = ["Postgres"];
    job.description = "We need Postgres experience.";

    const result = scanResume(profile, undefined, job);

    expect(result.keywordEvidence?.matchedWithEvidence).toContain("postgres");
    expect(
      result.keywords.find((keyword) => keyword.keyword === "postgres")
        ?.matchType,
    ).toBe("synonym");
  });

  it("returns all axis keys with weights that sum to one", () => {
    const result = scanResume(fixtureProfile());

    expect(Object.keys(result.axes).sort()).toEqual([
      "contentQuality",
      "datesAndTenure",
      "keywordMatch",
      "parseability",
      "sectionCompleteness",
    ]);
    expect(
      Object.values(result.axes).reduce((sum, axis) => sum + axis.weight, 0),
    ).toBeCloseTo(1, 3);
  });
});
