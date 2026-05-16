import { describe, expect, it } from "vitest";

import type { BankEntry } from "@/types";

import {
  deriveCategoryCounts,
  deriveSourceDocumentCounts,
  deriveVisibleEntryCount,
  isChildEntry,
  type CategoryCounts,
} from "./count-derivation";

function makeEntry(overrides: Partial<BankEntry> = {}): BankEntry {
  return {
    id: `entry-${Math.random()}`,
    userId: "default",
    category: "experience",
    content: {},
    confidenceScore: 0.9,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("isChildEntry", () => {
  it("returns true for a bullet with a parent", () => {
    const entry = makeEntry({
      category: "bullet",
      content: { parentId: "parent-1" },
    });
    expect(isChildEntry(entry)).toBe(true);
  });

  it("returns false for a bullet with no parent", () => {
    const entry = makeEntry({ category: "bullet", content: {} });
    expect(isChildEntry(entry)).toBe(false);
  });

  it("returns false for a top-level experience entry", () => {
    const entry = makeEntry({ category: "experience" });
    expect(isChildEntry(entry)).toBe(false);
  });
});

describe("deriveCategoryCounts", () => {
  it("returns 0 for every category when there are no entries", () => {
    const counts = deriveCategoryCounts([]);
    expect(counts.all).toBe(0);
    expect(counts.experience).toBe(0);
    expect(counts.bullet).toBe(0);
  });

  it("counts top-level entries per category and excludes child bullets from non-bullet totals", () => {
    const entries: BankEntry[] = [
      makeEntry({ category: "experience" }),
      makeEntry({ category: "experience" }),
      makeEntry({ category: "project" }),
      makeEntry({ category: "bullet", content: { parentId: "p1" } }),
      makeEntry({ category: "bullet", content: { parentId: "p2" } }),
      makeEntry({ category: "bullet", content: {} }),
    ];

    const counts = deriveCategoryCounts(entries);
    expect(counts.experience).toBe(2);
    expect(counts.project).toBe(1);
    expect(counts.bullet).toBe(3);
    expect(counts.all).toBe(4);
  });
});

describe("deriveSourceDocumentCounts", () => {
  it("groups counts by source document and aggregates entries with no source under `manual`", () => {
    const entries: BankEntry[] = [
      makeEntry({ category: "experience", sourceDocumentId: "doc-a" }),
      makeEntry({ category: "experience", sourceDocumentId: "doc-a" }),
      makeEntry({ category: "project", sourceDocumentId: "doc-b" }),
      makeEntry({ category: "skill" }),
      makeEntry({
        category: "bullet",
        sourceDocumentId: "doc-a",
        content: { parentId: "p1" },
      }),
    ];

    const counts = deriveSourceDocumentCounts(entries);
    expect(counts["doc-a"]).toBe(2);
    expect(counts["doc-b"]).toBe(1);
    expect(counts.manual).toBe(1);
  });
});

describe("deriveVisibleEntryCount", () => {
  const baseOpts = {
    reviewOnly: false,
    needsReviewCount: 7,
    activeDocumentId: null as string | null,
    sourceDocumentCounts: { manual: 0, "doc-a": 4 },
    categoryCounts: {
      all: 63,
      experience: 6,
      project: 8,
      education: 2,
      bullet: 47,
      skill: 0,
      achievement: 0,
      certification: 0,
      hackathon: 0,
    } as CategoryCounts,
    activeCategory: "all" as const,
  };

  it("returns the needs-review count when reviewOnly is on", () => {
    const count = deriveVisibleEntryCount({ ...baseOpts, reviewOnly: true });
    expect(count).toBe(7);
  });

  it("returns the source-document count when filtered by document", () => {
    const count = deriveVisibleEntryCount({
      ...baseOpts,
      activeDocumentId: "doc-a",
    });
    expect(count).toBe(4);
  });

  it("returns the active category count when filtered by category", () => {
    const count = deriveVisibleEntryCount({
      ...baseOpts,
      activeCategory: "experience",
    });
    expect(count).toBe(6);
  });

  it("returns the global total (categoryCounts.all) when no filter is active", () => {
    const count = deriveVisibleEntryCount(baseOpts);
    expect(count).toBe(63);
  });

  it("falls back to 0 when the category key is missing", () => {
    const count = deriveVisibleEntryCount({
      ...baseOpts,
      activeCategory: "unknown" as never,
    });
    expect(count).toBe(0);
  });
});

describe("count alignment across surfaces (the P0.1 bug)", () => {
  it("page-header total, tab pill, and section header all align on a shared dataset", () => {
    // Mirrors the audit's failing dataset shape: 6 experiences, 8 projects,
    // 2 educations, 47 bullets (orphan — no parent links, as in production
    // data). All three count surfaces must agree on these numbers.
    const entries: BankEntry[] = [
      ...Array.from({ length: 6 }, () => makeEntry({ category: "experience" })),
      ...Array.from({ length: 8 }, () => makeEntry({ category: "project" })),
      ...Array.from({ length: 2 }, () => makeEntry({ category: "education" })),
      ...Array.from({ length: 47 }, () =>
        makeEntry({ category: "bullet", content: {} }),
      ),
    ];

    const categoryCounts = deriveCategoryCounts(entries);
    const sourceDocumentCounts = deriveSourceDocumentCounts(entries);

    expect(categoryCounts.experience).toBe(6);
    expect(categoryCounts.project).toBe(8);
    expect(categoryCounts.education).toBe(2);
    expect(categoryCounts.bullet).toBe(47);
    expect(categoryCounts.all).toBe(63);

    const headerWithNoFilter = deriveVisibleEntryCount({
      reviewOnly: false,
      needsReviewCount: 0,
      activeDocumentId: null,
      sourceDocumentCounts,
      categoryCounts,
      activeCategory: "all",
    });
    expect(headerWithNoFilter).toBe(categoryCounts.all);

    const headerFilteredExperience = deriveVisibleEntryCount({
      reviewOnly: false,
      needsReviewCount: 0,
      activeDocumentId: null,
      sourceDocumentCounts,
      categoryCounts,
      activeCategory: "experience",
    });
    expect(headerFilteredExperience).toBe(categoryCounts.experience);
  });

  it("when bullets are properly parented, counts.all excludes them but counts.bullet still includes them", () => {
    const entries: BankEntry[] = [
      ...Array.from({ length: 6 }, () => makeEntry({ category: "experience" })),
      ...Array.from({ length: 47 }, () =>
        makeEntry({ category: "bullet", content: { parentId: "parent-1" } }),
      ),
    ];

    const categoryCounts = deriveCategoryCounts(entries);
    expect(categoryCounts.bullet).toBe(47);
    expect(categoryCounts.all).toBe(6);
  });
});
