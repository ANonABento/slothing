import { describe, expect, it } from "vitest";
import { opportunityDetailUrl, opportunityReviewUrl } from "./deep-links";

describe("opportunityDetailUrl", () => {
  it("builds the canonical /opportunities/[id] href", () => {
    expect(opportunityDetailUrl("http://localhost:3000", "abc123")).toBe(
      "http://localhost:3000/opportunities/abc123",
    );
  });

  it("strips a trailing slash from the base URL so we don't produce a double slash", () => {
    expect(opportunityDetailUrl("http://localhost:3000/", "abc")).toBe(
      "http://localhost:3000/opportunities/abc",
    );
    expect(opportunityDetailUrl("https://slothing.work//", "abc")).toBe(
      "https://slothing.work/opportunities/abc",
    );
  });

  it("URI-encodes the opportunity id (defensive — server ids are safe today)", () => {
    expect(opportunityDetailUrl("https://x.test", "a b/c?d")).toBe(
      "https://x.test/opportunities/a%20b%2Fc%3Fd",
    );
  });

  it("works for production-style URLs (no port, https)", () => {
    expect(opportunityDetailUrl("https://slothing.work", "opp_42")).toBe(
      "https://slothing.work/opportunities/opp_42",
    );
  });
});

describe("opportunityReviewUrl", () => {
  it("builds the bulk-import review queue href", () => {
    expect(opportunityReviewUrl("http://localhost:3000")).toBe(
      "http://localhost:3000/opportunities/review",
    );
  });

  it("strips a trailing slash on the base URL", () => {
    expect(opportunityReviewUrl("https://slothing.work/")).toBe(
      "https://slothing.work/opportunities/review",
    );
  });
});
