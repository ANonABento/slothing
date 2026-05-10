import { describe, expect, it } from "vitest";
import { SAMPLE_COMPARISON_REPORTS } from "./sample-data";
import { estimateRunCostUsd, estimateTokens } from "./cost";

describe("eval cost estimation", () => {
  it("estimates tokens from character count", () => {
    expect(estimateTokens(0)).toBe(0);
    expect(estimateTokens(1)).toBe(1);
    expect(estimateTokens(9)).toBe(3);
  });

  it("returns a per-model breakdown and non-zero total for known sample models", () => {
    const cost = estimateRunCostUsd(SAMPLE_COMPARISON_REPORTS[0]);
    expect(cost.totalUsd).toBeGreaterThan(0);
    expect(cost.byModel.gpt55Usd).toBeGreaterThan(0);
    expect(cost.byModel.claudeUsd).toBeGreaterThan(0);
    expect(cost.byModel.judgeUsd).toBeGreaterThan(0);
  });
});
