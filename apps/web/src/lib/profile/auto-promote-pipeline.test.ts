import { describe, expect, it } from "vitest";
import type { Profile } from "@/types";
import { smartParseResume } from "@/lib/parser/smart-parser";
import { mergeParsedProfileForAutoPromote } from "./auto-promote";

const FIXTURE_RESUME = `Riley Chen
riley.chen@example.com | (555) 123-4567
San Francisco, CA
linkedin.com/in/rileychen | github.com/rileychen

SUMMARY
Product-minded software engineer who builds reliable workflow automation for recruiting teams.

EXPERIENCE
Senior Product Engineer | Acme Talent | Jan 2021 - Present
- Led migration of resume parsing services to TypeScript and reduced parsing latency by 40%.
- Mentored three engineers and partnered with product on profile completion workflows.

Software Engineer | BrightHire | Jun 2018 - Dec 2020
- Built React dashboards used by hiring teams to review candidate pipelines.
- Implemented event-driven integrations with ATS and CRM systems.

EDUCATION
B.S. in Computer Science
Stanford University
2014 - 2018
GPA: 3.8

SKILLS
Languages: TypeScript, Python, Go
Tools: Docker, GitHub Actions, PostgreSQL
Frameworks: React, Next.js, Node.js

PROJECTS
Resume Insight CLI | TypeScript | Node.js
- Built a command line tool that scores resumes against job descriptions.
- Technologies: TypeScript, Node.js, PostgreSQL
`;

const parsedExperience = {
  id: "manual-exp",
  company: "Manual Company",
  title: "Manual Engineer",
  startDate: "2020",
  endDate: "Present",
  current: true,
  description: "Manually entered role.",
  highlights: ["Manually entered role."],
  skills: ["Manual Skill"],
};

function existingProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "profile-1",
    contact: { name: "" },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    ...overrides,
  };
}

async function parsePromotedProfile(existing: Profile | null = null) {
  const result = await smartParseResume(FIXTURE_RESUME);
  const promoted = mergeParsedProfileForAutoPromote(existing, result.profile);

  return { result, promoted };
}

describe("resume parse to profile auto-promote pipeline", () => {
  it("populates contact, summary, experience, education, skills, and projects from a fixture resume", async () => {
    const { result, promoted } = await parsePromotedProfile();

    expect(result.llmUsed).toBe(false);
    expect(result.sectionsDetected).toEqual(
      expect.arrayContaining([
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
      ]),
    );

    expect(promoted.contact).toMatchObject({
      name: "Riley Chen",
      email: "riley.chen@example.com",
      phone: "(555) 123-4567",
    });
    expect(promoted.summary).toContain("workflow automation");
    expect(promoted.experiences?.[0]).toMatchObject({
      title: "Senior Product Engineer",
      company: "Acme Talent",
    });
    expect(promoted.education?.[0]).toMatchObject({
      institution: "Stanford University",
      field: "Computer Science",
    });
    expect(promoted.skills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "TypeScript", category: "language" }),
        expect.objectContaining({ name: "Docker", category: "tool" }),
      ]),
    );
    expect(promoted.projects?.[0]).toMatchObject({
      name: "Resume Insight CLI",
      technologies: ["TypeScript", "Node.js"],
    });
  });

  it("preserves a manually edited contact name while filling empty contact fields", async () => {
    const { promoted } = await parsePromotedProfile(
      existingProfile({
        contact: { name: "Manual Name" },
      }),
    );

    expect(promoted.contact).toMatchObject({
      name: "Manual Name",
      email: "riley.chen@example.com",
      phone: "(555) 123-4567",
    });
    expect(promoted.experiences).toHaveLength(2);
    expect(promoted.education).toHaveLength(1);
    expect(promoted.skills?.length).toBeGreaterThan(0);
    expect(promoted.projects).toHaveLength(1);
  });

  it("does not replace existing experiences while still promoting empty sections", async () => {
    const { promoted } = await parsePromotedProfile(
      existingProfile({
        experiences: [parsedExperience],
      }),
    );

    expect(promoted).not.toHaveProperty("experiences");
    expect(promoted.education).toHaveLength(1);
    expect(promoted.skills?.length).toBeGreaterThan(0);
    expect(promoted.projects).toHaveLength(1);
  });
});
