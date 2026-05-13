# `answer-bank` — `/en/answer-bank`

**Source:** `apps/web/src/app/[locale]/(app)/answer-bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/answer-bank-1280.png`
- 1440: `../screenshots/answer-bank-1440.png`
- 1920: `../screenshots/answer-bank-1920.png`

## Findings

### High

- **[H1] [STILL]** (loop-001 H1) Dual-error-surface problem persists — when the API fails, the page still renders all surrounding chrome (stat tiles "Saved answers 0 / Known sources 0 / Autofill uses 0", cross-link banner, search bar, every filter pill row) above the "Failed to load answers" error card. Either gate the chrome on success or render an inline error inside the grid container. All widths.

### Medium

- **[M1] [STILL]** (loop-001 M1) Filter pills row renders fully greyed-out with zero counts on every pill when the API errors — visually noisy and gives no explanation. Skip rendering filter pills (or show skeletons) in error/empty states. All widths.
- **[M2] [STILL]** (loop-001 M2) Search bar + "0 shown" label + "Most used" sort dropdown all render with nothing to operate on. Same gating logic as M1. All widths.
- **[M3] [STILL]** (loop-001 M3) Duplicate `Add Answer` CTAs — header action + `StandardEmptyState` action — still both labeled `Add Answer`. Drop one. (Not visible in the loop-004 error path because the empty-state never renders, but the duplication is still in the source.)
- **[M4] [STILL]** (loop-001 M4) Header `Add Answer` button still sits stranded at 1920 — same `PageHeader` issue as bank/documents/upload. 1920 only.
- **[M5] [PARTIAL]** (loop-001 M5) Cross-link banner ("Personal facts live in your Profile…") is still present with ad-hoc `bg-card/70` + `rounded-[var(--radius)]` styling, but the **migration banner** that previously rendered right below it is gone in loop-004. So banner-component duplication on this route is reduced; the cross-link banner is still ad-hoc and not unified with bank's "Needs review" banner. Status: dup reduced, primitive still missing. All widths.

### Low

- **[L1] [STILL]** (loop-001 L1) Stat tiles still use `THEME_INTERACTIVE_SURFACE_CLASSES` despite being non-interactive — misleading hover/focus affordance. All widths.
- **[L2] [STILL]** (loop-001 L2) "Most used" sort uses native `<select>` styled with `THEME_CONTROL_CLASSES`. Slightly off-brand vs the rest of the design system. All widths.

## Cross-cutting observations

- **Toast dedupe (B2) verified.** No duplicate toasts observed on this route.
- **`ListItemCard` still un-extracted.** `AnswerCard` (inline) and bank's `chunk-card.tsx` remain divergent.
- **`PageHeader` 1920 stranded actions** — same multi-route fix opportunity.
- **`NotificationBanner` primitive** still missing. With the migration banner removed this route only ships one ad-hoc banner today, but bank's "Needs review N" inline button and any future inline notices want the same primitive.
- **`FilterPill` / `CountedToggle` extraction** still pending — `AnswerTypeButton` here vs `DisplayModeButton` in bank are the canonical pair.
- **`EntryGridSkeleton` extraction** still pending.

## Console / runtime

- Dev-env 500 on `/api/answer-bank` (skip per brief).
