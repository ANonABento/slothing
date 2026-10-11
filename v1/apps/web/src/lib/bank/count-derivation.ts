import { BANK_CATEGORIES, type BankCategory, type BankEntry } from "@/types";

import { getBankEntryParentId } from "./bullet-review";

export function isChildEntry(entry: BankEntry): boolean {
  return (
    (entry.category === "bullet" || entry.category === "achievement") &&
    getBankEntryParentId(entry) !== null
  );
}

export type CategoryCounts = Record<BankCategory | "all", number>;

export function deriveCategoryCounts(allEntries: BankEntry[]): CategoryCounts {
  const counts = {
    all: allEntries.filter((e) => !isChildEntry(e)).length,
  } as CategoryCounts;
  for (const cat of BANK_CATEGORIES) {
    counts[cat] = allEntries.filter(
      (e) => e.category === cat && (cat === "bullet" || !isChildEntry(e)),
    ).length;
  }
  return counts;
}

export function deriveSourceDocumentCounts(
  allEntries: BankEntry[],
): Record<string, number> {
  const counts: Record<string, number> = { manual: 0 };
  for (const entry of allEntries) {
    if (isChildEntry(entry)) continue;
    const key = entry.sourceDocumentId ?? "manual";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function deriveVisibleEntryCount(opts: {
  reviewOnly: boolean;
  needsReviewCount: number;
  activeDocumentId: string | null;
  sourceDocumentCounts: Record<string, number>;
  categoryCounts: CategoryCounts;
  activeCategory: BankCategory | "all";
}): number {
  if (opts.reviewOnly) return opts.needsReviewCount;
  if (opts.activeDocumentId) {
    return opts.sourceDocumentCounts[opts.activeDocumentId] ?? 0;
  }
  return opts.categoryCounts[opts.activeCategory] ?? 0;
}
