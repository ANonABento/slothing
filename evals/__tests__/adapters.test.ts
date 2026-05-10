import { describe, expect, it } from "vitest";
import { BANK_CATEGORIES } from "@/types";
import { profileToBankEntries, profileToContactInfo } from "../adapters.js";
import type { EvalCase } from "../types.js";

const TEST_CASE: EvalCase = {
  id: "tc-adapter",
  label: "Adapter test",
  candidateProfile: "Built React dashboards and improved load time by 30%.",
  jobDescription: "Frontend role needing React and performance work.",
};

describe("profileToBankEntries", () => {
  it("creates every bank category", () => {
    const bankEntries = profileToBankEntries(TEST_CASE);
    for (const category of BANK_CATEGORIES) {
      expect(Array.isArray(bankEntries[category])).toBe(true);
    }
  });

  it("preserves the profile in a deterministic bullet entry", () => {
    const bankEntries = profileToBankEntries(TEST_CASE);
    expect(bankEntries.bullet).toHaveLength(1);
    expect(bankEntries.bullet[0].id).toBe("eval-bullet-tc-adapter");
    expect(JSON.stringify(bankEntries.bullet[0].content)).toContain(
      TEST_CASE.candidateProfile,
    );
  });
});

describe("profileToContactInfo", () => {
  it("creates stable synthetic contact info", () => {
    expect(profileToContactInfo(TEST_CASE).name).toContain(TEST_CASE.id);
  });
});
