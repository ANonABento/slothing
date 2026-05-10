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
});
