# `answer-bank` — `/en/answer-bank`

**Source:** `apps/web/src/app/[locale]/(app)/answer-bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/answer-bank-1280.png`
- 1440: `../screenshots/answer-bank-1440.png`
- 1920: `../screenshots/answer-bank-1920.png`

## Findings

### High

- **[H1]** Same dual-error-surface problem — full-width red error card ("Failed to load answers / Failed to fetch answer bank / Try Again") AND the same content above continues to render the empty stat tiles, search bar, all filter pills, and the cross-link banner. The error card is rendered in the same flow position as a normal results grid (`answer-bank/page.tsx:602-609`), but the surrounding chrome is rendered as if everything is fine. Either gate the chrome on success, or render a smaller inline error inside the grid container. All widths.

### Medium

- **[M1]** Filter pills row ("All sources / Manual / From extension / Curated" then "All / Repeated Questions / Work Auth / Logistics / Compensation / Links") shows zero counts in faint pills with `cursor-not-allowed opacity-60` styling (`answer-bank/page.tsx:798`). When the API failed, every count is 0, so the entire filter row is rendered greyed-out and visually noisy without telling the user *why*. Skip rendering filter pills (or render skeletons) while in error/empty states. All widths.
- **[M2]** Search bar + "0 shown" label + sort dropdown all render with no items to operate on. Wrapping these controls in the same gating logic as the filter pills would clean up the empty/error UI. All widths.
- **[M3]** "Add Answer" button in the header is the only un-greyed-out interactive control on the page when the fetch errors, but the empty CTA inside `StandardEmptyState` would normally also be "Add Answer" (`answer-bank/page.tsx:619`). Two CTAs with the same label across the page — noise on success, redundant on failure. The `StandardEmptyState` can drop its action when the header already provides the same one.
- **[M4]** Page header action group sits stranded at 1920 (same `PageHeader` issue cited in bank/upload/documents). 1920 only.
- **[M5]** "Personal facts (...) live in your Profile. Use this bank for Q&A like sponsorship, references, why this company, etc." cross-link banner (`answer-bank/page.tsx:721`) renders right above the search bar — but uses `bg-card/70` and a non-semantic `rounded-[var(--radius)]` border, while the migration banner sibling (`answer-bank/page.tsx:742`) uses `border-primary/20 bg-primary/5`. Two near-identical horizontal banners with different styling within a few lines. Pick one banner primitive. All widths.

### Low

- **[L1]** Stat tiles ("Saved answers 0 / Known sources 0 / Autofill uses 0") use `THEME_INTERACTIVE_SURFACE_CLASSES` (`answer-bank/page.tsx:770`) but they aren't actually interactive — no link, no click. Misleading hover/focus affordance. All widths.
- **[L2]** "Most used" sort dropdown uses native `<select>` with `THEME_CONTROL_CLASSES`. Looks slightly off-brand vs the rest of the design system's button/dropdown components. All widths.

## Cross-cutting observations

- **Empty-state component IS shared** with bank — both use `StandardEmptyState` (`apps/web/src/components/ui/page-layout.tsx:381`). No DRY action item here.
- **List-item rendering is NOT shared** with bank. `AnswerCard` is defined inline at `answer-bank/page.tsx:676+`; bank's `chunk-card.tsx` is its own thing. Same opportunity flagged in `bank.md`.
- **Banner components are duplicated** — `CrossLinkBanner` and `MigrationBanner` (`answer-bank/page.tsx:721, 742`) are almost identical structurally (flex row, message, button) but ad-hoc. A `<NotificationBanner variant="info" | "success" | "warning">` primitive would unify both, and bank's "Needs review N" inline button also wants the same treatment.
- **Filter pill patterns** — `AnswerTypeButton` (`answer-bank/page.tsx:777`) is local to this file; bank's `displayMode` toggles use a different mini-component (`DisplayModeButton` in `bank/page.tsx`). Both render "active vs inactive pill with count". Extract a shared `FilterPill` or `CountedToggle`.
- **Loading states** — bank uses `BankEntriesSkeleton`/`BankFiltersSkeleton`, answer-bank uses raw `SkeletonCard` arrays inside `<Suspense>` fallbacks. Worth a shared `EntryGridSkeleton`.

## Console / runtime

- Dev-env 500 on `/api/answer-bank` (skip per brief).
- intl/hydration warnings (skip per brief).
