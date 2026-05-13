import { describe, expect, it } from "vitest";
import {
  analyzeActionVerbStrength,
  classifyVerb,
} from "./action-verb-strength";

describe("classifyVerb", () => {
  it("classifies strong verbs", () => {
    expect(classifyVerb("spearheaded")).toBe("strong");
    expect(classifyVerb("architected")).toBe("strong");
  });

  it("classifies weak verbs", () => {
    expect(classifyVerb("helped")).toBe("weak");
    expect(classifyVerb("assisted")).toBe("weak");
  });

  it("prefers weak over strong when overlapping (worked)", () => {
    expect(classifyVerb("worked")).toBe("weak");
  });

  it("returns null for non-verbs", () => {
    expect(classifyVerb("the")).toBeNull();
    expect(classifyVerb("")).toBeNull();
  });
});

describe("analyzeActionVerbStrength", () => {
  it("counts strong, standard, and weak verbs by bullet", () => {
    const report = analyzeActionVerbStrength([
      { text: "Spearheaded platform migration.", location: "exp-1" },
      { text: "Architected billing service.", location: "exp-1" },
      { text: "Helped with onboarding.", location: "exp-1" },
      { text: "Assisted senior engineers.", location: "exp-1" },
      { text: "Maintained CI pipeline.", location: "exp-1" },
    ]);

    expect(report.strongCount).toBe(2);
    expect(report.weakCount).toBe(2);
    expect(report.standardCount).toBe(1);
  });

  it("handles bulleted lines with leading dashes", () => {
    const report = analyzeActionVerbStrength([
      { text: "- Led platform migration", location: "exp-1" },
      { text: "• Shipped Node.js services", location: "exp-1" },
    ]);

    expect(report.strongCount).toBe(2);
  });

  it("counts bullets that start with no verb separately", () => {
    const report = analyzeActionVerbStrength([
      { text: "Senior engineer for the platform team.", location: "exp-1" },
    ]);

    expect(report.noVerbCount).toBe(1);
    expect(report.strongCount).toBe(0);
  });

  it("returns distinct strong verbs in sorted order", () => {
    const report = analyzeActionVerbStrength([
      { text: "Led project A.", location: "a" },
      { text: "Led project B.", location: "b" },
      { text: "Architected service.", location: "c" },
    ]);

    expect(report.distinctStrongVerbs).toEqual(["architected", "led"]);
  });
});
