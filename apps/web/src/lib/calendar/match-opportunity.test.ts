import { describe, expect, it } from "vitest";
import { matchOpportunityForCalendarEvent } from "./match-opportunity";
import type { Opportunity } from "@/types";

function opportunity(id: string, company: string): Opportunity {
  return {
    id,
    type: "job",
    title: "Engineer",
    company,
    source: "manual",
    status: "saved",
    summary: "",
    tags: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("matchOpportunityForCalendarEvent", () => {
  const opportunities = [
    opportunity("anthropic", "Anthropic"),
    opportunity("openai", "OpenAI"),
  ];

  it("matches Anthropic interview by company name in the title", () => {
    const match = matchOpportunityForCalendarEvent(
      { id: "event-1", title: "Anthropic interview" },
      opportunities,
    );

    expect(match?.opportunity.id).toBe("anthropic");
  });

  it("matches attendee domains", () => {
    const match = matchOpportunityForCalendarEvent(
      {
        id: "event-2",
        title: "Technical screen",
        attendees: [{ email: "recruiting@anthropic.com" }],
      },
      opportunities,
    );

    expect(match?.opportunity.id).toBe("anthropic");
  });

  it("does not match when interview intent exists but company evidence does not", () => {
    expect(
      matchOpportunityForCalendarEvent(
        { id: "event-3", title: "Technical interview" },
        opportunities,
      ),
    ).toBeNull();
  });

  it("does not match when company exists without interview intent", () => {
    expect(
      matchOpportunityForCalendarEvent(
        { id: "event-4", title: "Anthropic coffee chat" },
        opportunities,
      ),
    ).toBeNull();
  });

  it("chooses the strongest title match when multiple companies appear", () => {
    const match = matchOpportunityForCalendarEvent(
      {
        id: "event-5",
        title: "OpenAI final round",
        description: "Previous notes mention Anthropic.",
      },
      opportunities,
    );

    expect(match?.opportunity.id).toBe("openai");
  });
});
