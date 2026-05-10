import { describe, expect, it } from "vitest";
import {
  companySimilarity,
  matchOpportunityByCompany,
  normalizeCompanyName,
} from "./match-opportunity";

const opportunities = [
  { id: "opp-1", company: "Acme Inc." },
  { id: "opp-2", company: "Globex LLC" },
  { id: "opp-3", company: "Gamma Labs" },
];

describe("normalizeCompanyName", () => {
  it("removes suffixes and punctuation", () => {
    expect(normalizeCompanyName("Acme, Inc.")).toBe("acme");
  });
});

describe("companySimilarity", () => {
  it("matches suffix-insensitive company names", () => {
    expect(companySimilarity("Acme", "Acme Inc.")).toBe(1);
  });
});

describe("matchOpportunityByCompany", () => {
  it("matches by exact normalized company name", () => {
    expect(
      matchOpportunityByCompany(opportunities, { body: "Hello from Acme" })
        ?.opportunity.id,
    ).toBe("opp-1");
  });

  it("matches by sender domain", () => {
    expect(
      matchOpportunityByCompany(opportunities, {
        from: "Recruiting <jobs@globex.com>",
      })?.opportunity.id,
    ).toBe("opp-2");
  });

  it("returns null when no company is strong enough", () => {
    expect(
      matchOpportunityByCompany(opportunities, { body: "A generic interview" }),
    ).toBeNull();
  });

  it("returns null for ambiguous matches", () => {
    expect(
      matchOpportunityByCompany(
        [
          { id: "a", company: "Acme Labs" },
          { id: "b", company: "Acme Systems" },
        ],
        { body: "Acme interview" },
      ),
    ).toBeNull();
  });
});
