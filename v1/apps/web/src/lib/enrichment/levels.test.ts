import { describe, expect, it } from "vitest";
import { parseLevelsHtml } from "./levels";

describe("parseLevelsHtml", () => {
  it("extracts median comp and role rows", () => {
    const result = parseLevelsHtml(
      `<main><div data-testid="median-total">$220K</div><table><tr><td>Software Engineer</td><td>$210K</td></tr></table></main>`,
      "https://www.levels.fyi/companies/acme/salaries",
    );

    expect(result.medianTotalComp).toBe("$220K");
    expect(result.roles).toEqual([
      { role: "Software Engineer", totalComp: "$210K" },
    ]);
  });

  it("returns empty fields when markup is unrecognized", () => {
    const result = parseLevelsHtml(
      "<main>No salary data</main>",
      "https://example.test",
    );

    expect(result.roles).toEqual([]);
    expect(result.medianTotalComp).toBeUndefined();
  });
});
