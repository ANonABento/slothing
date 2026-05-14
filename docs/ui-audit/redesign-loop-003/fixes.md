# Loop 003 — Fixes

## What changed

Six single-class edits across two files.

### `apps/web/src/components/ui/page-layout.tsx`
1. **`StandardEmptyState`** — replaced `border border-dashed bg-card/50` with
   `border bg-paper`. Empty states now sit on the editorial cream paper-card
   surface instead of reading as drop-zones.

### `apps/web/src/app/[locale]/(app)/bank/page.tsx`
2. **Source-grouped h2** (line 1677) — `font-display tracking-tight`.
3. **Category-grouped h2** (line 1708) — `font-display tracking-tight`.
4. **Review-component h3** (line 2348) — `font-display tracking-tight`.
5. **"Detected components" caption** (line 2262) — `font-display tracking-tight`.
6. **"Review component" eyebrow** (line 2345) — swapped
   `font-medium uppercase tracking-normal` → `font-mono uppercase tracking-[0.16em]`.

## Why these specific edits

`StandardEmptyState` propagates everywhere an empty state renders (bank,
opportunities filters, etc.). The dashed border had been carrying drop-zone
connotation; the editorial system uses paper cards instead.

The /bank fixes are the per-component continuation of the loop-001 + loop-002
sweep — the four inline `<h2>` / `<h3>` headings and the "Review component"
eyebrow opt out of the shared `PagePanelHeader` primitive, so they didn't get
picked up automatically.

## Before / after

- `bank-1280-light-{before,after}.png` — empty state now reads as a solid
  paper card with a proper border; previously it had the dashed-line
  drop-zone treatment.
- `opportunities-empty-1280-light-after.png` — same paper-card empty state
  surfaces here too (different hero component, `OpportunitiesEmptyHero`, but
  it inherits the calm cream system).

## Drift gates

| Gate | Status |
| ---- | ------ |
| `pnpm --filter @slothing/web type-check` | pass |
| `pnpm --filter @slothing/web lint` | pass (only pre-existing react-hooks warnings) |
| `pnpm --filter @slothing/web test:run` | pass — 3584 tests, 1 skipped |
