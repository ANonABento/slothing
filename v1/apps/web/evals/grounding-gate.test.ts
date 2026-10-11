import { describe, it, expect } from "vitest";

import { loadEvalCasesFromBenchmark } from "./data/to-eval-cases.js";
import { createTailorGenerator } from "./generators/index.js";
import { runMetrics } from "./metrics/index.js";

/**
 * Capped OFFLINE eval gate (CI-safe — no live LLM). Runs the deterministic tailoring base
 * over a few golden cases and asserts two invariants the P0 work locked in:
 *   1. The adapter produces a NON-EMPTY résumé (regression guard for the offline-scores-0
 *      adapter bug — experience/skill entries now flow through).
 *   2. The base generator (which selects/copies the candidate's own bullets, never invents)
 *      scores ~perfect on the grounding metric — i.e. no fabrication when nothing is made up.
 * The full 250-case run stays a manual `pnpm eval`; this is the fast safety net.
 */
describe("offline eval gate — non-empty output + grounded base (P0)", () => {
  const cases = loadEvalCasesFromBenchmark().slice(0, 4);
  const generate = createTailorGenerator(null); // null config → deterministic base

  it("loads golden cases with a structured résumé attached", () => {
    expect(cases.length).toBeGreaterThan(0);
    expect(cases[0].structuredResume).toBeTruthy();
  });

  it("produces a non-empty résumé and a fully grounded base for each case", async () => {
    for (const testCase of cases) {
      const output = await generate(testCase);
      expect(output.error).toBeUndefined();
      expect(output.kind).toBe("resume");
      if (output.kind !== "resume") continue;

      // Adapter fix: real experience content flows through (was empty before).
      expect(output.resume?.experiences.length ?? 0).toBeGreaterThan(0);

      const metrics = runMetrics(testCase, output);
      const grounding = metrics.find((m) => m.name === "grounding");
      expect(grounding).toBeDefined();
      // The base copies the candidate's own bullets, so nothing is fabricated.
      expect(grounding!.score).toBeGreaterThanOrEqual(0.9);
      const details = grounding!.details as { ungroundedNumbers?: string[] };
      expect(details.ungroundedNumbers ?? []).toHaveLength(0);
    }
  });
});
