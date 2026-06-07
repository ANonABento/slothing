import { describe, it, expect } from "vitest";

import {
  groundClaims,
  isClaimGrounded,
  metricNumbers,
  normalizeNumber,
  isMetricNumber,
  splitClaims,
  contentWords,
} from "./index";

describe("grounding engine (AI Bank Authoring spec §3)", () => {
  describe("number normalization + metric detection", () => {
    it("normalizes money, commas, spaces, and percent words", () => {
      expect(normalizeNumber("$2M")).toBe("2m");
      expect(normalizeNumber("12,000")).toBe("12000");
      expect(normalizeNumber("40 percent")).toBe("40%");
      expect(normalizeNumber("99.97%")).toBe("99.97%");
      expect(normalizeNumber("8 PB")).toBe("8pb");
    });

    it("treats units, decimals, and large numbers as metrics; small ints as not", () => {
      expect(isMetricNumber("40%")).toBe(true);
      expect(isMetricNumber("2m")).toBe(true);
      expect(isMetricNumber("3x")).toBe(true);
      expect(isMetricNumber("99.97%")).toBe(true);
      expect(isMetricNumber("12000")).toBe(true);
      expect(isMetricNumber("5")).toBe(false);
      expect(isMetricNumber("12")).toBe(false);
    });

    it("extracts only metric numbers from text", () => {
      expect(metricNumbers("Cut p95 latency 38% and saved $2M")).toEqual([
        "38%",
        "2m",
      ]);
      // "5 engineers" / "team of 4" are plain small ints — not metrics.
      expect(metricNumbers("Mentored 5 engineers on 4 teams")).toEqual([]);
    });

    it("does not mistake the first letter of the next word for a unit", () => {
      // "6 minutes" must read as "6" (not the metric "6m") — a unit needs a word boundary.
      expect(metricNumbers("cut build time to 6 minutes")).toEqual([]);
      expect(metricNumbers("processed 8 PB and saved $2M")).toEqual([
        "8pb",
        "2m",
      ]);
    });
  });

  describe("splitClaims + contentWords", () => {
    it("splits bullets and sentences, stripping bullet leads", () => {
      expect(splitClaims("- Built the API.\n• Shipped it.")).toEqual([
        "Built the API.",
        "Shipped it.",
      ]);
    });

    it("drops stopwords, short tokens, and bare integers", () => {
      const w = contentWords("Led the migration of 5 services to AWS");
      expect(w.has("migration")).toBe(true);
      expect(w.has("services")).toBe(true);
      expect(w.has("aws")).toBe(true);
      expect(w.has("the")).toBe(false);
      expect(w.has("5")).toBe(false);
    });
  });

  describe("groundClaims", () => {
    const evidence =
      "Senior Software Engineer at Northwind Labs. Led migration of the monolith to event-driven services, cutting p95 latency 38%. Mentored five engineers.";

    it("marks a paraphrase of the evidence as supported", () => {
      const { supported, unsupported } = groundClaims(
        "Led the migration of the monolith to event-driven services",
        evidence,
      );
      expect(supported).toHaveLength(1);
      expect(unsupported).toHaveLength(0);
    });

    it("marks an unrelated claim as unsupported", () => {
      const { supported, unsupported } = groundClaims(
        "Designed the company logo and ran the marketing budget",
        evidence,
      );
      expect(supported).toHaveLength(0);
      expect(unsupported).toHaveLength(1);
    });

    it("flags a fabricated metric and forces the claim unsupported (the core guarantee)", () => {
      const { unsupported, ungroundedNumbers } = groundClaims(
        "Led the migration of services and increased revenue 40%",
        evidence,
      );
      expect(ungroundedNumbers).toContain("40%");
      expect(unsupported).toHaveLength(1);
    });

    it("keeps a metric that IS present in the evidence", () => {
      const { supported, ungroundedNumbers } = groundClaims(
        "Cut p95 latency 38% via the migration",
        evidence,
      );
      expect(ungroundedNumbers).toHaveLength(0);
      expect(supported).toHaveLength(1);
    });

    it("does not flag spelled-out vs digit small numbers as ungrounded", () => {
      // Evidence says "five engineers"; output says "5 engineers" — not a metric, no flag.
      const { ungroundedNumbers } = groundClaims(
        "Mentored 5 engineers on the team",
        evidence,
      );
      expect(ungroundedNumbers).toHaveLength(0);
    });

    it("splits multi-claim output and grades each claim", () => {
      const { supported, unsupported } = groundClaims(
        "Led migration of services to event-driven architecture.\nWon a Nobel Prize in physics.",
        evidence,
      );
      expect(supported).toHaveLength(1);
      expect(unsupported).toHaveLength(1);
    });

    it("isClaimGrounded is true only for supported claims", () => {
      expect(
        isClaimGrounded("Led the migration of the monolith", evidence),
      ).toBe(true);
      expect(isClaimGrounded("Flew to the moon on a rocket", evidence)).toBe(
        false,
      );
    });
  });
});
