# Loop 005 — Fixes

## What changed

Nine single-class edits across three files.

### `apps/web/src/app/[locale]/(app)/salary/page.tsx`
1. Line 410 — h2 "Market Salary Range" → `font-display tracking-tight`.
2. Line 563 — h2 "Your Offers" → `font-display tracking-tight`.
3. Line 739 — h2 "Your Negotiation Script" → `font-display tracking-tight`.
4. Line 429 — 25th percentile stat → `font-display tracking-tight`.
5. Line 437 — Median stat → `font-display tracking-tight`.
6. Line 445 — 75th percentile stat → `font-display tracking-tight`.
7. Line 627 — Total Annual Comp stat → `font-display tracking-tight`.

### `apps/web/src/app/[locale]/(app)/emails/page.tsx`
8. Line 911 — h2 "Preview" → `font-display tracking-tight`.

### `apps/web/src/components/settings/byok-explainer.tsx`
9. Line 50 — BenefitCard h3 → `font-display tracking-tight` (catches three
   benefit cards: "Free on hosted", "Any provider", "Encrypted at rest").

## Drift gates

| Gate | Status |
| ---- | ------ |
| `pnpm --filter @slothing/web type-check` | pass |
| `pnpm --filter @slothing/web lint` | pass |
| `pnpm --filter @slothing/web test:run` | pass — 3584 tests, 1 skipped |
