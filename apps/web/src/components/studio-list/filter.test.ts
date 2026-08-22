import { describe, expect, it } from "vitest";

import { EMPTY_FILTER, countByKind, filterAndSortDocuments } from "./filter";
import type { TexDocumentSummary } from "./types";

const doc = (
  over: Partial<TexDocumentSummary> & Pick<TexDocumentSummary, "id">,
): TexDocumentSummary => ({
  title: "Untitled",
  kind: "resume",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  ...over,
});

const DOCS: TexDocumentSummary[] = [
  doc({
    id: "a",
    title: "Backend resume",
    updatedAt: "2026-03-01T00:00:00.000Z",
  }),
  doc({
    id: "b",
    title: "Stripe letter",
    kind: "cover_letter",
    updatedAt: "2026-05-01T00:00:00.000Z",
  }),
  doc({
    id: "c",
    title: "Academic",
    kind: "cv",
    updatedAt: "2026-04-01T00:00:00.000Z",
  }),
];

describe("filterAndSortDocuments", () => {
  it("sorts most-recently-edited first by default", () => {
    expect(filterAndSortDocuments(DOCS, EMPTY_FILTER).map((d) => d.id)).toEqual(
      ["b", "c", "a"],
    );
  });

  it("never mutates the array it was given", () => {
    const input = [...DOCS];
    filterAndSortDocuments(input, { ...EMPTY_FILTER, sort: "title" });
    expect(input.map((d) => d.id)).toEqual(["a", "b", "c"]);
  });

  it("sorts titles naturally, so 2 comes before 10", () => {
    const numbered = [
      doc({ id: "x", title: "Resume 10" }),
      doc({ id: "y", title: "Resume 2" }),
    ];
    expect(
      filterAndSortDocuments(numbered, {
        ...EMPTY_FILTER,
        sort: "title",
      }).map((d) => d.title),
    ).toEqual(["Resume 2", "Resume 10"]);
  });

  it("groups by kind but keeps recency inside each group", () => {
    const many = [
      ...DOCS,
      doc({
        id: "d",
        title: "Newer resume",
        updatedAt: "2026-06-01T00:00:00.000Z",
      }),
    ];
    expect(
      filterAndSortDocuments(many, { ...EMPTY_FILTER, sort: "kind" }).map(
        (d) => d.id,
      ),
    ).toEqual(["d", "a", "c", "b"]);
  });

  it("filters by kind", () => {
    expect(
      filterAndSortDocuments(DOCS, { ...EMPTY_FILTER, kind: "cv" }).map(
        (d) => d.id,
      ),
    ).toEqual(["c"]);
  });

  it("searches titles case-insensitively", () => {
    expect(
      filterAndSortDocuments(DOCS, { ...EMPTY_FILTER, query: "STRIPE" }).map(
        (d) => d.id,
      ),
    ).toEqual(["b"]);
  });

  it("searches the kind label too, so 'cover' finds a letter titled otherwise", () => {
    expect(
      filterAndSortDocuments(DOCS, { ...EMPTY_FILTER, query: "cover" }).map(
        (d) => d.id,
      ),
    ).toEqual(["b"]);
  });

  it("treats a whitespace-only query as no query", () => {
    expect(
      filterAndSortDocuments(DOCS, { ...EMPTY_FILTER, query: "   " }),
    ).toHaveLength(3);
  });

  it("combines kind and query", () => {
    expect(
      filterAndSortDocuments(DOCS, {
        ...EMPTY_FILTER,
        kind: "resume",
        query: "letter",
      }),
    ).toEqual([]);
  });
});

describe("countByKind", () => {
  it("counts every kind, including the ones with none", () => {
    expect(countByKind(DOCS)).toEqual({ resume: 1, cv: 1, cover_letter: 1 });
    expect(countByKind([])).toEqual({ resume: 0, cv: 0, cover_letter: 0 });
  });
});
