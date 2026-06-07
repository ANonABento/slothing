import { describe, expect, it } from "vitest";
import { BANK_CATEGORIES } from "@/types";
import { profileToBankEntries, profileToContactInfo } from "../adapters.js";
import type { EvalCase } from "../types.js";
import type { Resume } from "../data/schema.js";

const TEST_CASE: EvalCase = {
  id: "tc-adapter",
  label: "Adapter test",
  candidateProfile: "Built React dashboards and improved load time by 30%.",
  jobDescription: "Frontend role needing React and performance work.",
};

const STRUCTURED_RESUME = {
  id: "r-x",
  label: "FE",
  field: "software",
  subfield: "frontend",
  seniorityLevel: "junior",
  seniorityYears: 2,
  candidateName: "Alex Rivera",
  location: "Austin, TX",
  summary: "Frontend engineer.",
  skills: ["React", "TypeScript"],
  experience: [
    {
      title: "Frontend Engineer",
      company: "BlueOwl",
      startYear: 2024,
      endYear: null,
      bullets: ["Built React dashboards", "Improved load time by 30%"],
    },
  ],
  education: [{ degree: "BS CS", school: "State University", year: 2023 }],
  projects: [{ name: "Portfolio", description: "React demos" }],
} as unknown as Resume;

describe("profileToBankEntries", () => {
  it("creates every bank category", () => {
    const bankEntries = profileToBankEntries(TEST_CASE);
    for (const category of BANK_CATEGORIES) {
      expect(Array.isArray(bankEntries[category])).toBe(true);
    }
  });

  it("preserves the profile in a deterministic bullet entry (no structured résumé)", () => {
    const bankEntries = profileToBankEntries(TEST_CASE);
    expect(bankEntries.bullet).toHaveLength(1);
    expect(bankEntries.bullet[0].id).toBe("eval-bullet-0-tc-adapter");
    expect(JSON.stringify(bankEntries.bullet[0].content)).toContain(
      TEST_CASE.candidateProfile,
    );
  });

  it("builds structured experience/skill/education entries from a structured résumé", () => {
    const bankEntries = profileToBankEntries({
      ...TEST_CASE,
      structuredResume: STRUCTURED_RESUME,
    });
    expect(bankEntries.bullet).toHaveLength(0);
    expect(bankEntries.experience).toHaveLength(1);
    expect(bankEntries.experience[0].content).toMatchObject({
      company: "BlueOwl",
      title: "Frontend Engineer",
    });
    expect(bankEntries.experience[0].content.highlights).toEqual([
      "Built React dashboards",
      "Improved load time by 30%",
    ]);
    expect(bankEntries.skill.map((s) => s.content.name)).toEqual([
      "React",
      "TypeScript",
    ]);
    expect(bankEntries.education[0].content).toMatchObject({
      institution: "State University",
      degree: "BS CS",
    });
  });
});

describe("profileToContactInfo", () => {
  it("creates stable synthetic contact info", () => {
    expect(profileToContactInfo(TEST_CASE).name).toContain(TEST_CASE.id);
  });
});
