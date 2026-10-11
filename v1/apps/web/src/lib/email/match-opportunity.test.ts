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
    const match = matchOpportunityByCompany(opportunities, {
      subject: "Hello from Acme",
    });

    expect(match?.opportunity.id).toBe("opp-1");
    expect(match?.confidence).toBeGreaterThanOrEqual(0.88);
    expect(match?.reason).toBe("company_in_subject");
  });

  it("matches by sender domain with lower confidence", () => {
    const match = matchOpportunityByCompany(opportunities, {
      from: "Recruiting <jobs@globex.com>",
    });

    expect(match?.opportunity.id).toBe("opp-2");
    expect(match?.confidence).toBeLessThan(0.82);
    expect(match?.reason).toBe("sender_domain");
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
