import { describe, expect, it } from "vitest";
import { analyzeWeakLanguage } from "./weak-language";

describe("analyzeWeakLanguage", () => {
  it("flags weak phrases like 'responsible for'", () => {
    const report = analyzeWeakLanguage([
      { text: "Responsible for managing the team.", location: "exp-1" },
      { text: "Shipped new payments service.", location: "exp-1" },
    ]);

    expect(report.weakBulletCount).toBe(1);
    expect(report.hits[0].phrase).toBe("responsible for");
  });

  it("flags multiple weak phrases in one bullet without double-counting bullets", () => {
    const report = analyzeWeakLanguage([
      {
        text: "Helped with the migration and assisted with QA.",
        location: "exp-1",
      },
    ]);

    expect(report.hits.length).toBeGreaterThanOrEqual(2);
    expect(report.weakBulletCount).toBe(1);
  });

  it("flags passive voice constructions", () => {
    const report = analyzeWeakLanguage([
      { text: "The project was delivered on time.", location: "exp-1" },
    ]);

    expect(report.weakBulletCount).toBe(1);
  });

  it("does not flag strong action-led bullets", () => {
    const report = analyzeWeakLanguage([
      {
        text: "Led platform migration reducing latency by 40%.",
        location: "exp-1",
      },
      { text: "Shipped Node.js services serving 25k DAU.", location: "exp-1" },
    ]);

    expect(report.weakBulletCount).toBe(0);
    expect(report.hits).toEqual([]);
  });

  it("returns zero ratio for empty input", () => {
    expect(analyzeWeakLanguage([])).toEqual({
      hits: [],
      bulletCount: 0,
      weakBulletCount: 0,
      weakRatio: 0,
    });
  });

  it("computes the weakRatio across the full bullet set", () => {
    const report = analyzeWeakLanguage([
      { text: "Responsible for the website.", location: "exp-1" },
      { text: "Helped with onboarding.", location: "exp-1" },
      {
        text: "Architected billing service used by 10k customers.",
        location: "exp-1",
      },
      { text: "Cut infra cost by 22%.", location: "exp-1" },
    ]);

    expect(report.weakBulletCount).toBe(2);
    expect(report.weakRatio).toBeCloseTo(0.5, 2);
  });
});
