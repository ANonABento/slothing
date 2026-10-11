import { describe, expect, it } from "vitest";
import { renderDailyDigest } from "./render";
import type { DigestMatch } from "./match";

const pick: DigestMatch = {
  score: 87,
  reasons: ["Matched TypeScript"],
  job: {
    id: "job-1",
    title: "Senior <Engineer>",
    company: 'Acme "Labs"',
    location: "Remote",
    description: "Build things",
    requirements: [],
    responsibilities: [],
    keywords: ["typescript"],
    status: "saved",
    createdAt: "2026-05-10T08:00:00.000Z",
  },
};

describe("renderDailyDigest", () => {
  it("renders subject, escaped HTML, text fallback, and unsubscribe URL", () => {
    const result = renderDailyDigest({
      user: { userId: "user-1", email: "ada@example.com", name: "Ada" },
      picks: [pick],
      unsubscribeUrl: "https://example.com/unsubscribe?token=abc",
      baseUrl: "https://example.com",
    });

    expect(result.subject).toBe("Your top 1 opportunities today");
    expect(result.html).toContain("Senior &lt;Engineer&gt;");
    expect(result.html).toContain("Acme &quot;Labs&quot;");
    expect(result.html).toContain("https://example.com/unsubscribe?token=abc");
    expect(result.text).toContain('Senior <Engineer> at Acme "Labs"');
    expect(result.text).toContain("Unsubscribe: https://example.com");
  });
});
