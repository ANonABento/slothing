# Loop 007 — Fixes

## What changed

Five single-class edits across two files.

### `apps/web/src/components/opportunities/review-queue.tsx`
1. Line 205 — h1 "Opportunities" → `font-display tracking-tight`.
2. Line 210 — remaining counter (e.g. "7") → `font-display tracking-tight`.
3. Line 258 — opportunity title h2 → `font-display tracking-tight`.

### `apps/web/src/app/[locale]/(app)/answer-bank/page.tsx`
4. Line 772 — `AnswerStat` value (the three stat numbers) →
   `font-display tracking-tight`.
5. Line 857 — per-entry question h2 → `font-display tracking-tight`.

## Drift gates

| Gate | Status |
| ---- | ------ |
| `pnpm --filter @slothing/web type-check` | pass |
| `pnpm --filter @slothing/web lint` | pass |
| `pnpm --filter @slothing/web test:run` | pass — 3584 tests, 1 skipped |
