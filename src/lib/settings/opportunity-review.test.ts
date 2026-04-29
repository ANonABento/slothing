import { describe, expect, it } from "vitest";
import {
  DEFAULT_OPPORTUNITY_REVIEW_ENABLED,
  parseOpportunityReviewEnabled,
} from "./opportunity-review";

describe("parseOpportunityReviewEnabled", () => {
  it("uses the default when no setting has been stored", () => {
    expect(parseOpportunityReviewEnabled(null)).toBe(
      DEFAULT_OPPORTUNITY_REVIEW_ENABLED
    );
  });

  it("returns true only for the persisted true value", () => {
    expect(parseOpportunityReviewEnabled("true")).toBe(true);
    expect(parseOpportunityReviewEnabled("false")).toBe(false);
    expect(parseOpportunityReviewEnabled("unexpected")).toBe(false);
  });
});
