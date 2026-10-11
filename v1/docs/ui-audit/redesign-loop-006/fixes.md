# Loop 006 — Fixes

## What changed

Two single-class edits across two files; one snapshot bump on four snapshots.

### `apps/web/src/components/ui/card.tsx`
1. `CardTitle` (line 38) — added `font-display tracking-tight`. This shadcn
   primitive renders the h3 inside `<Card>` blocks. Eight call-sites in this
   repo light up at once:
   - `/profile` page (with `ProfileEmptyState`).
   - `/sign-in` (`SignInCard` + `AuthDisabledCard`).
   - Profile completeness card, profile-empty-state title.
   - Tailor gap-analysis + resume-preview titles.
   - Streak lifetime-stats card title.

### `apps/web/src/components/layout/sidebar-extension-card.tsx`
2. The "Capture jobs from any site →" title — added
   `font-display tracking-tight`.

### Snapshot bumps

Four snapshots updated (`pnpm vitest -u`) because the new editorial classes
are part of the rendered markup:
- `apps/web/src/app/[locale]/(app)/profile/__snapshots__/page.test.tsx.snap`
- `apps/web/src/app/[locale]/(auth)/sign-in/__snapshots__/sign-in-card.test.tsx.snap`

All four snapshots reflected the new visual; the diff was exactly the
`font-display tracking-tight` additions on the `CardTitle` h3 element. New
snapshots match the intended editorial appearance.

## Before / after

- `profile-1280-light-after.png`, `sign-in-1280-light-after.png`.

## Drift gates

| Gate | Status |
| ---- | ------ |
| `pnpm --filter @slothing/web type-check` | pass |
| `pnpm --filter @slothing/web lint` | pass |
| `pnpm --filter @slothing/web test:run` | pass — 3584 tests, 1 skipped (after snapshot update) |
