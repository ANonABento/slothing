import { describe, expect, it } from "vitest";
import { assignVariant, bucket, type ExperimentDefinition } from "./assign";

const evenSplit: ExperimentDefinition = {
  key: "exp_test",
  variants: ["control", "treatment"],
  enabled: true,
};

describe("bucket", () => {
  it("returns a stable value in [0, 1)", () => {
    const a = bucket("exp_test", "user-1");
    const b = bucket("exp_test", "user-1");
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(1);
  });

  it("decorrelates the same unit across different experiments", () => {
    // Same user should not land in the same relative position everywhere.
    const diffs = ["a", "b", "c", "d", "e"].map(
      (key) => bucket(`exp_${key}`, "user-1") - bucket(`exp_${key}`, "user-2"),
    );
    expect(new Set(diffs.map((d) => d.toFixed(6))).size).toBeGreaterThan(1);
  });
});

describe("assignVariant", () => {
  it("is deterministic for a given (experiment, unit)", () => {
    expect(assignVariant(evenSplit, "user-42")).toBe(
      assignVariant(evenSplit, "user-42"),
    );
  });

  it("returns the control variant when the experiment is disabled", () => {
    const disabled: ExperimentDefinition = { ...evenSplit, enabled: false };
    for (const u of ["a", "b", "c", "d", "e", "f"]) {
      expect(assignVariant(disabled, u)).toBe("control");
    }
  });

  it("only ever returns declared variants", () => {
    for (let i = 0; i < 200; i += 1) {
      expect(evenSplit.variants).toContain(assignVariant(evenSplit, `u${i}`));
    }
  });

  it("splits an even two-way experiment roughly in half", () => {
    let treatment = 0;
    const n = 4000;
    for (let i = 0; i < n; i += 1) {
      if (assignVariant(evenSplit, `user-${i}`) === "treatment") treatment += 1;
    }
    const ratio = treatment / n;
    expect(ratio).toBeGreaterThan(0.45);
    expect(ratio).toBeLessThan(0.55);
  });

  it("honours weights", () => {
    const weighted: ExperimentDefinition = {
      key: "exp_weighted",
      variants: ["control", "treatment"],
      weights: [9, 1],
      enabled: true,
    };
    let treatment = 0;
    const n = 4000;
    for (let i = 0; i < n; i += 1) {
      if (assignVariant(weighted, `user-${i}`) === "treatment") treatment += 1;
    }
    const ratio = treatment / n;
    expect(ratio).toBeGreaterThan(0.05);
    expect(ratio).toBeLessThan(0.15);
  });

  it("falls back to even split when weights length mismatches", () => {
    const mismatched: ExperimentDefinition = {
      key: "exp_mismatch",
      variants: ["control", "treatment"],
      weights: [1, 2, 3],
      enabled: true,
    };
    let treatment = 0;
    const n = 2000;
    for (let i = 0; i < n; i += 1) {
      if (assignVariant(mismatched, `user-${i}`) === "treatment")
        treatment += 1;
    }
    expect(treatment / n).toBeGreaterThan(0.4);
    expect(treatment / n).toBeLessThan(0.6);
  });

  it("throws when there are no variants", () => {
    const empty: ExperimentDefinition = {
      key: "exp_empty",
      variants: [],
      enabled: true,
    };
    expect(() => assignVariant(empty, "user-1")).toThrow();
  });
});
