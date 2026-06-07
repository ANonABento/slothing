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
  articulateToBullets,
  articulatedDraftInput,
  buildArticulatePrompt,
  classifyJobGaps,
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

describe("AI bank authoring — Articulate (spec §4.2)", () => {
  beforeEach(() => completeMock.mockReset());

  const notes =
    "i set up the kubernetes cluster and cut our build time from 20 minutes to 6";

  it("keeps bullets grounded in the user's notes", async () => {
    completeMock.mockResolvedValueOnce(
      JSON.stringify({
        bullets: [
          "Set up the Kubernetes cluster and cut build time to 6 minutes",
        ],
      }),
    );
    const out = await articulateToBullets(notes, llmConfig);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatch(/kubernetes/i);
  });

  it("drops a bullet that introduces a fact/metric absent from the notes", async () => {
    completeMock.mockResolvedValueOnce(
      JSON.stringify({
        bullets: [
          "Set up the Kubernetes cluster", // grounded
          "Saved the company $4M in cloud costs", // $4M not in notes
        ],
      }),
    );
    const out = await articulateToBullets(notes, llmConfig);
    expect(out.join(" ")).not.toMatch(/\$4M|4M/);
    expect(out.some((b) => /kubernetes/i.test(b))).toBe(true);
  });

  it("the articulate prompt forbids derived metrics and embellishment (live-tuning fix)", () => {
    const p = buildArticulatePrompt("set up k8s, cut build 22m to 7m");
    expect(p).toMatch(/derived metric|% improvement/i);
    expect(p).toMatch(/embellish|do not add context/i);
  });

  it("builds a draft bullet entry grounded in raw_input", () => {
    const draft = articulatedDraftInput("my raw notes", "Set up Kubernetes");
    expect(draft.category).toBe("bullet");
    expect(draft.status).toBe("draft");
    expect(draft.authoredBy).toBe("ai_articulated");
    expect(draft.groundedIn).toEqual({
      kind: "raw_input",
      rawText: "my raw notes",
    });
  });
});

describe("classifyJobGaps — tailoring↔bank loop (spec §6)", () => {
  const verifiedEntry: BankEntry = {
    id: "v1",
    userId: "u1",
    category: "experience",
    content: {
      company: "Acme",
      title: "Engineer",
      highlights: ["Built React dashboards and Postgres pipelines"],
    },
    confidenceScore: 0.9,
    status: "verified",
    createdAt: "2026-01-01",
  };
  const draftEntry: BankEntry = {
    ...verifiedEntry,
    id: "d1",
    status: "draft",
    content: { highlights: ["Used Kubernetes in a side project"] },
  };

  it("routes keywords WITH verified evidence to strengthenable (with entry ids)", () => {
    const r = classifyJobGaps(["React", "Postgres"], [verifiedEntry]);
    expect(r.gaps).toHaveLength(0);
    expect(r.strengthenable.map((s) => s.keyword).sort()).toEqual([
      "Postgres",
      "React",
    ]);
    expect(r.strengthenable[0].entryIds).toContain("v1");
  });

  it("routes keywords with NO verified evidence to true gaps", () => {
    const r = classifyJobGaps(["Rust", "Kafka"], [verifiedEntry]);
    expect(r.strengthenable).toHaveLength(0);
    expect(r.gaps.sort()).toEqual(["Kafka", "Rust"]);
  });

  it("ignores DRAFT entries as evidence (only verified counts as fact)", () => {
    // "Kubernetes" appears only in a draft entry → still a true gap, not strengthenable.
    const r = classifyJobGaps(["Kubernetes"], [verifiedEntry, draftEntry]);
    expect(r.strengthenable).toHaveLength(0);
    expect(r.gaps).toEqual(["Kubernetes"]);
  });

  it("dedupes keywords case-insensitively", () => {
    const r = classifyJobGaps(["react", "React", "REACT"], [verifiedEntry]);
    expect(r.strengthenable).toHaveLength(1);
  });
});
