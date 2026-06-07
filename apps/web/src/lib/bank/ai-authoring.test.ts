import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BankEntry } from "@/types";

const { completeMock } = vi.hoisted(() => ({ completeMock: vi.fn() }));

vi.mock("@/lib/llm/client", async (importActual) => {
  const actual = await importActual<typeof import("@/lib/llm/client")>();
  return {
    ...actual,
    LLMClient: class MockLLMClient {
      complete = completeMock;
    },
  };
});

import {
  strengthenEntryHighlights,
  strengthenedDraftInput,
  entryHighlights,
} from "./ai-authoring";

const entry: BankEntry = {
  id: "e1",
  userId: "u1",
  category: "experience",
  content: {
    company: "Northwind Labs",
    title: "Senior Software Engineer",
    highlights: [
      "Led migration of the monolith to event-driven services, cutting p95 latency 38%",
      "Mentored five engineers",
    ],
  },
  confidenceScore: 0.9,
  createdAt: "2026-01-01",
};

const llmConfig = { provider: "openai", apiKey: "k", model: "m" } as const;

describe("AI bank authoring — Strengthen (spec §4)", () => {
  beforeEach(() => completeMock.mockReset());

  it("keeps a faithful rephrase grounded in the original entry", async () => {
    completeMock.mockResolvedValueOnce(
      JSON.stringify({
        highlights: [
          "Drove the monolith migration to event-driven services, cutting p95 latency 38%",
        ],
      }),
    );
    const out = await strengthenEntryHighlights(entry, llmConfig);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatch(/event-driven services/);
  });

  it("drops a rewrite that fabricates a metric (claims must be ⊆ original)", async () => {
    completeMock.mockResolvedValueOnce(
      JSON.stringify({
        highlights: [
          "Led the migration of services and increased revenue 250%", // 250% not in entry
        ],
      }),
    );
    const out = await strengthenEntryHighlights(entry, llmConfig);
    // The fabricated-metric rewrite is rejected → falls back to the entry's true bullets.
    expect(out.join(" ")).not.toMatch(/250%|revenue/);
    expect(out).toEqual(entryHighlights(entry));
  });

  it("drops an unrelated invented bullet", async () => {
    completeMock.mockResolvedValueOnce(
      JSON.stringify({
        highlights: [
          "Mentored five engineers on the team", // grounded
          "Won an Olympic gold medal in fencing", // invented
        ],
      }),
    );
    const out = await strengthenEntryHighlights(entry, llmConfig);
    expect(out.some((h) => /mentored/i.test(h))).toBe(true);
    expect(out.join(" ")).not.toMatch(/Olympic|fencing/);
  });

  it("builds a draft entry (unverified, ai_strengthened, grounded in the source)", () => {
    const draft = strengthenedDraftInput(entry, ["Drove the migration"]);
    expect(draft.status).toBe("draft");
    expect(draft.authoredBy).toBe("ai_strengthened");
    expect(draft.groundedIn).toEqual({ kind: "entry", refId: "e1" });
    expect(draft.content.highlights).toEqual(["Drove the migration"]);
  });
});
