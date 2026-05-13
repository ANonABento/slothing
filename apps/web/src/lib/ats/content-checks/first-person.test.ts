import { describe, expect, it } from "vitest";
import { analyzeFirstPerson } from "./first-person";

describe("analyzeFirstPerson", () => {
  it("flags 'I' at the start of a bullet", () => {
    const report = analyzeFirstPerson([
      { text: "I led a team of five engineers.", location: "exp-1" },
    ]);

    expect(report.hitCount).toBe(1);
    expect(report.hits[0].pronoun).toBe("i");
  });

  it("flags possessive 'my' inside a bullet", () => {
    const report = analyzeFirstPerson([
      {
        text: "Cut latency by 40% through my caching layer.",
        location: "exp-1",
      },
    ]);

    expect(report.hitCount).toBe(1);
    expect(report.hits[0].pronoun).toBe("my");
  });

  it("flags contractions like I've, I'll", () => {
    const report = analyzeFirstPerson([
      { text: "I've owned the billing service.", location: "exp-1" },
    ]);

    expect(report.hitCount).toBe(1);
  });

  it("does not flag the letter i inside other words", () => {
    const report = analyzeFirstPerson([
      { text: "Built distributed systems in Go.", location: "exp-1" },
      { text: "Migrated team to CI/CD pipeline.", location: "exp-1" },
    ]);

    expect(report.hitCount).toBe(0);
  });

  it("returns empty for clean bullets", () => {
    const report = analyzeFirstPerson([
      { text: "Led platform migration.", location: "exp-1" },
      { text: "Cut infrastructure cost by 22%.", location: "exp-1" },
    ]);

    expect(report.hits).toEqual([]);
  });
});
