/**
 * Filtering and sorting the document list — pure, so the rules are testable without a DOM.
 *
 * Client-side rather than a query parameter: the whole list is already in memory (the API
 * omits `source`, so a summary is tiny), and filtering locally means typing in the search
 * box never waits on a round trip.
 */
import type { StudioSort } from "@/lib/studio/preferences";
import type { TexDocumentKind } from "@/lib/db/tex-documents";

import { KIND_LABEL, type TexDocumentSummary } from "./types";

export interface DocumentFilter {
  query: string;
  /** null means every kind. */
  kind: TexDocumentKind | null;
  sort: StudioSort;
}

export const EMPTY_FILTER: DocumentFilter = {
  query: "",
  kind: null,
  sort: "recent",
};

function matchesQuery(document: TexDocumentSummary, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  // The kind label is searchable too, so typing "cover" finds cover letters whatever
  // they happen to be titled.
  return (
    document.title.toLowerCase().includes(needle) ||
    KIND_LABEL[document.kind].toLowerCase().includes(needle)
  );
}

const KIND_ORDER: Record<TexDocumentKind, number> = {
  resume: 0,
  cv: 1,
  cover_letter: 2,
};

export function filterAndSortDocuments(
  documents: readonly TexDocumentSummary[],
  filter: DocumentFilter,
): TexDocumentSummary[] {
  const visible = documents.filter(
    (document) =>
      (filter.kind === null || document.kind === filter.kind) &&
      matchesQuery(document, filter.query),
  );

  const compare = (a: TexDocumentSummary, b: TexDocumentSummary): number => {
    if (filter.sort === "title") {
      // localeCompare with numeric so "Resume 2" sorts before "Resume 10".
      return a.title.localeCompare(b.title, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }
    if (filter.sort === "kind") {
      const byKind = KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
      // Within a kind, most-recent-first — otherwise grouping by type would scramble
      // the order people actually navigate by.
      if (byKind !== 0) return byKind;
    }
    return b.updatedAt.localeCompare(a.updatedAt);
  };

  // Sorting a copy: the caller's array is React state and must not be mutated in place.
  return [...visible].sort(compare);
}

/** How many documents each kind accounts for, for the filter chips' counts. */
export function countByKind(
  documents: readonly TexDocumentSummary[],
): Record<TexDocumentKind, number> {
  const counts: Record<TexDocumentKind, number> = {
    resume: 0,
    cv: 0,
    cover_letter: 0,
  };
  for (const document of documents) counts[document.kind] += 1;
  return counts;
}
