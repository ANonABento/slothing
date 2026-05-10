import { describe, expect, it } from "vitest";
import { scratchProfileFromAnswers } from "./scratch-profile";

describe("scratchProfileFromAnswers", () => {
  it("builds a minimal profile fragment", () => {
    expect(
      scratchProfileFromAnswers({
        name: " Ada Lovelace ",
        email: " ada@example.com ",
        headline: " Frontend intern ",
      }),
    ).toMatchObject({
      contact: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        headline: "Frontend intern",
        targetRoles: ["Frontend intern"],
      },
    });
  });

  it("drops empty optional fields", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      summary: " ",
      educationInstitution: " ",
      skillsCsv: " , ",
    });

    expect(profile.summary).toBeUndefined();
    expect(profile.education).toBeUndefined();
    expect(profile.skills).toBeUndefined();
  });

  it("splits comma-separated skills into other-category skills", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      skillsCsv: "TypeScript, Python, ,Go",
    });

    expect(profile.skills).toHaveLength(3);
    expect(profile.skills?.map((skill) => skill.name)).toEqual([
      "TypeScript",
      "Python",
      "Go",
    ]);
    expect(profile.skills?.every((skill) => skill.category === "other")).toBe(
      true,
    );
    expect(new Set(profile.skills?.map((skill) => skill.id)).size).toBe(3);
  });

  it("generates one education entry when a school is present", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Data analyst",
      educationInstitution: "State University",
      educationDegree: "",
      educationField: "Statistics",
    });

    expect(profile.education).toHaveLength(1);
    expect(profile.education?.[0]).toMatchObject({
      institution: "State University",
      degree: "Not specified",
      field: "Statistics",
      highlights: [],
    });
    expect(profile.education?.[0]?.id).toEqual(expect.any(String));
  });

  it("emits one experience entry when company and title are present", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      experienceCompany: "Campus Cafe",
      experienceTitle: "Barista",
      experienceHighlights: "Pulled espresso shots\nTrained 3 new baristas",
    });

    expect(profile.experiences).toHaveLength(1);
    expect(profile.experiences?.[0]).toMatchObject({
      id: expect.any(String),
      company: "Campus Cafe",
      title: "Barista",
      startDate: "",
      current: false,
      description: "Pulled espresso shots\nTrained 3 new baristas",
      highlights: ["Pulled espresso shots", "Trained 3 new baristas"],
      skills: [],
    });
  });

  it("splits experience highlights across newlines and commas, capped at 3", () => {
    const newlineProfile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      experienceCompany: "Campus Cafe",
      experienceTitle: "Barista",
      experienceHighlights: "One\nTwo\nThree\nFour",
    });
    const commaProfile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      experienceCompany: "Campus Cafe",
      experienceTitle: "Barista",
      experienceHighlights: "One, Two, Three, Four, Five",
    });

    expect(newlineProfile.experiences?.[0]?.highlights).toEqual([
      "One",
      "Two",
      "Three",
    ]);
    expect(commaProfile.experiences?.[0]?.highlights).toEqual([
      "One",
      "Two",
      "Three",
    ]);
  });

  it("omits experiences when only company is provided", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      experienceCompany: "Campus Cafe",
    });

    expect(profile.experiences).toBeUndefined();
  });

  it("emits one project entry from project name, summary, and highlights", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      projectName: "Community pantry dashboard",
      projectSummary: "Tracked donations and volunteer shifts.",
      projectHighlights: "Built a filterable tracker\nPresented findings",
    });

    expect(profile.projects).toHaveLength(1);
    expect(profile.projects?.[0]).toMatchObject({
      id: expect.any(String),
      name: "Community pantry dashboard",
      description: "Tracked donations and volunteer shifts.",
      technologies: [],
      highlights: ["Built a filterable tracker", "Presented findings"],
    });
  });

  it("omits projects when projectName is blank", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      projectName: " ",
      projectSummary: "Tracked donations and volunteer shifts.",
    });

    expect(profile.projects).toBeUndefined();
  });

  it("appends achievements to education highlights when education is present", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      educationInstitution: "State University",
      achievements: "Dean's list, Residence council secretary",
    });

    expect(profile.education?.[0]?.highlights).toEqual([
      "Dean's list",
      "Residence council secretary",
    ]);
  });

  it("appends achievements to experience highlights when education is absent", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      experienceCompany: "Campus Cafe",
      experienceTitle: "Barista",
      achievements: "Trainer of the month, Shift lead",
    });

    expect(profile.experiences?.[0]?.highlights).toEqual([
      "Trainer of the month",
      "Shift lead",
    ]);
  });

  it("drops achievements when neither education nor experience is present", () => {
    const profile = scratchProfileFromAnswers({
      name: "Ada Lovelace",
      email: "ada@example.com",
      headline: "Frontend intern",
      achievements: "Dean's list, Residence council secretary",
    });

    expect(profile.education).toBeUndefined();
    expect(profile.experiences).toBeUndefined();
    expect(profile).not.toHaveProperty("achievements");
  });
});
