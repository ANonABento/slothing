import { describe, expect, it } from "vitest";
import {
  AUTONOMY_LEVELS,
  DEFAULT_AGENT_POLICY,
  agentPolicyUpdateSchema,
  allowsSubmission,
  allowsUnattendedSubmission,
  applyPolicyUpdate,
  autonomyRank,
  clampThreshold,
  isAutonomyLevel,
  normalizeBlocklist,
} from "./policy";

describe("agent policy defaults", () => {
  it("defaults to source with dry-run on (never auto-submit)", () => {
    expect(DEFAULT_AGENT_POLICY.autonomy).toBe("source");
    expect(DEFAULT_AGENT_POLICY.dryRun).toBe(true);
    expect(allowsSubmission(DEFAULT_AGENT_POLICY.autonomy)).toBe(false);
  });
});

describe("autonomy ladder", () => {
  it("orders levels by privilege", () => {
    expect(autonomyRank("off")).toBeLessThan(autonomyRank("source"));
    expect(autonomyRank("source")).toBeLessThan(autonomyRank("draft"));
    expect(autonomyRank("draft")).toBeLessThan(autonomyRank("submit_approval"));
    expect(autonomyRank("submit_approval")).toBeLessThan(
      autonomyRank("auto_submit"),
    );
  });

  it("gates submission at submit_approval and unattended at auto_submit", () => {
    expect(allowsSubmission("draft")).toBe(false);
    expect(allowsSubmission("submit_approval")).toBe(true);
    expect(allowsUnattendedSubmission("submit_approval")).toBe(false);
    expect(allowsUnattendedSubmission("auto_submit")).toBe(true);
  });

  it("validates autonomy level membership", () => {
    expect(isAutonomyLevel("draft")).toBe(true);
    expect(isAutonomyLevel("nonsense")).toBe(false);
    expect(AUTONOMY_LEVELS).toContain("auto_submit");
  });
});

describe("clamp + normalize", () => {
  it("clamps threshold into [0,1] and falls back on NaN", () => {
    expect(clampThreshold(1.5)).toBe(1);
    expect(clampThreshold(-2)).toBe(0);
    expect(clampThreshold(Number.NaN)).toBe(
      DEFAULT_AGENT_POLICY.matchThreshold,
    );
    expect(clampThreshold(0.4)).toBe(0.4);
  });

  it("lower-cases, trims, and dedupes the blocklist", () => {
    expect(normalizeBlocklist([" Acme ", "acme", "Globex", ""])).toEqual([
      "acme",
      "globex",
    ]);
  });
});

describe("applyPolicyUpdate", () => {
  it("merges only provided keys and clamps/normalizes", () => {
    const next = applyPolicyUpdate(DEFAULT_AGENT_POLICY, {
      autonomy: "draft",
      matchThreshold: 9,
      companyBlocklist: ["Acme", "acme"],
    });
    expect(next.autonomy).toBe("draft");
    expect(next.matchThreshold).toBe(1);
    expect(next.companyBlocklist).toEqual(["acme"]);
    // untouched keys preserved
    expect(next.dailySubmitCap).toBe(DEFAULT_AGENT_POLICY.dailySubmitCap);
  });

  it("coerces blank cron to null", () => {
    const next = applyPolicyUpdate(DEFAULT_AGENT_POLICY, {
      scheduleCron: "  ",
    });
    expect(next.scheduleCron).toBeNull();
  });
});

describe("agentPolicyUpdateSchema", () => {
  it("accepts a partial body and rejects bad autonomy", () => {
    expect(agentPolicyUpdateSchema.safeParse({ dryRun: false }).success).toBe(
      true,
    );
    expect(
      agentPolicyUpdateSchema.safeParse({ autonomy: "ludicrous" }).success,
    ).toBe(false);
  });
});
