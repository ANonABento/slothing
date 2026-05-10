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
          "Improved API latency by 35% and reduced incident volume by 20%.",
          "Mentored team of 6 engineers and shipped Node.js services.",
        ],
        skills: ["React", "TypeScript", "Node.js", "AWS"],
      },
      {
        id: "exp-2",
        title: "Software Engineer",
        company: "Beta Co",
        startDate: "Jun 2017",
        endDate: "Dec 2020",
        current: false,
        description: "Developed web applications and optimized backend services.",
        highlights: ["Delivered 12 projects and increased test coverage to 85%."],
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
      "We need a Senior Engineer with React, TypeScript, Node.js, AWS, API performance, analytics dashboards, PostgreSQL, mentoring, and SaaS experience.",
    requirements: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
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
    expect(Object.values(result.axes).every((axis) => axis.score > 60)).toBe(true);
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

    expect(scanResume(profile, undefined, fixtureJob()).axes.keywordMatch.score).toBeGreaterThanOrEqual(70);
    expect(scanResume(profile).axes.keywordMatch.score).toBeGreaterThanOrEqual(80);
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
