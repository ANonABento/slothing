import { describe, expect, it } from "vitest";
import type { Profile } from "@/types";
import { mergeParsedProfileForAutoPromote } from "./auto-promote";

const parsedFull: Partial<Profile> = {
  contact: {
    name: "Parsed Candidate",
    email: "parsed@example.com",
    phone: "555-0101",
    location: "Waterloo, ON",
    linkedin: "linkedin.com/in/parsed",
    github: "github.com/parsed",
    website: "https://parsed.dev",
  },
  summary: "Parsed summary",
  rawText: "Parsed raw text",
  experiences: [
    {
      id: "exp-1",
      company: "Acme",
      title: "Engineer",
      startDate: "2020",
      endDate: "2024",
      current: false,
      description: "Built things",
      highlights: ["Built things"],
      skills: ["TypeScript"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University",
      degree: "BASc",
      field: "Computer Engineering",
      highlights: [],
    },
  ],
  skills: [
    {
      id: "skill-1",
      name: "TypeScript",
      category: "technical",
    },
  ],
  projects: [
    {
      id: "project-1",
      name: "Portfolio",
      description: "A project",
      technologies: ["Next.js"],
      highlights: [],
    },
  ],
};

function fullExisting(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user-1",
    contact: {
      name: "Manual Candidate",
      email: "manual@example.com",
      phone: "555-9999",
      location: "Toronto, ON",
      linkedin: "linkedin.com/in/manual",
      github: "github.com/manual",
      website: "https://manual.dev",
    },
    summary: "Manual summary",
    rawText: "Manual raw text",
    experiences: parsedFull.experiences ?? [],
    education: parsedFull.education ?? [],
    skills: parsedFull.skills ?? [],
    projects: parsedFull.projects ?? [],
    certifications: [],
    ...overrides,
  };
}

describe("mergeParsedProfileForAutoPromote", () => {
  it("promotes parsed contact, summary, raw text, and arrays for an empty profile", () => {
    expect(mergeParsedProfileForAutoPromote(null, parsedFull)).toMatchObject({
      contact: parsedFull.contact,
      summary: parsedFull.summary,
      rawText: parsedFull.rawText,
      experiences: parsedFull.experiences,
      education: parsedFull.education,
      skills: parsedFull.skills,
      projects: parsedFull.projects,
    });
  });

  it("preserves existing contact values while filling empty contact fields", () => {
    const promoted = mergeParsedProfileForAutoPromote(
      fullExisting({
        contact: {
          name: "Manual Name",
        },
        experiences: [],
        education: [],
        skills: [],
        projects: [],
      }),
      parsedFull,
    );

    expect(promoted.contact).toMatchObject({
      name: "Manual Name",
      email: "parsed@example.com",
      phone: "555-0101",
      linkedin: "linkedin.com/in/parsed",
      github: "github.com/parsed",
      website: "https://parsed.dev",
      location: "Waterloo, ON",
    });
  });

  it("omits contact and summary when existing values are populated", () => {
    const promoted = mergeParsedProfileForAutoPromote(
      fullExisting({
        experiences: [],
        education: [],
        skills: [],
        projects: [],
      }),
      parsedFull,
    );

    expect(promoted).not.toHaveProperty("contact");
    expect(promoted).not.toHaveProperty("summary");
  });

  it("does not replace an existing non-empty experience list", () => {
    const promoted = mergeParsedProfileForAutoPromote(
      fullExisting({ education: [], skills: [], projects: [] }),
      parsedFull,
    );

    expect(promoted).not.toHaveProperty("experiences");
    expect(promoted).toHaveProperty("education", parsedFull.education);
  });

  it("omits parsed empty arrays to avoid wiping existing rows", () => {
    const promoted = mergeParsedProfileForAutoPromote(null, {
      experiences: [],
      education: [],
      skills: [],
      projects: [],
    });

    expect(promoted).toEqual({});
  });

  it("returns an empty diff when the existing profile is already populated", () => {
    expect(
      mergeParsedProfileForAutoPromote(fullExisting(), parsedFull),
    ).toEqual({});
  });

  it("treats whitespace-only profile fields as empty", () => {
    const promoted = mergeParsedProfileForAutoPromote(
      fullExisting({
        summary: "   ",
        rawText: "   ",
        experiences: [],
        education: [],
        skills: [],
        projects: [],
      }),
      parsedFull,
    );

    expect(promoted.summary).toBe("Parsed summary");
    expect(promoted.rawText).toBe("Parsed raw text");
  });

  it("does not overwrite existing raw text on re-parse", () => {
    const promoted = mergeParsedProfileForAutoPromote(fullExisting(), {
      rawText: "New raw text",
    });

    expect(promoted).not.toHaveProperty("rawText");
  });
});
