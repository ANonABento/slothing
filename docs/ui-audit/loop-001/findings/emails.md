# `emails` — `/en/emails`

**Source:** `apps/web/src/app/[locale]/(app)/emails/page.tsx`
**Widths audited:** 1280 (load failed) / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/emails-1280-error.png` (page failed to load — see H1)
- 1440: `../screenshots/emails-1440.png`
- 1920: `../screenshots/emails-1920.png`

## Findings

### High

- **[H1]** Page failed to load at 1280 — `emails-1280-error.png` is present and shows a Calendar-page skeleton (the sidebar's "Calendar" item is highlighted), suggesting the navigation to `/en/emails` did not complete and the screenshot captured a transitional skeleton state on a different route. Either the emails route timed out at 1280 or the page renderer threw before mount. The 1440/1920 captures of the same route render fine, so this is not a layout breakpoint regression — it's a render or navigation reliability bug at 1280. Investigate the `useEffect` data-fetching trio (`fetchJobs`, `fetchDrafts`, `fetchSends` at `apps/web/src/app/[locale]/(app)/emails/page.tsx:248-252`) or the dynamic-imported `DraftsSheet` / `SentTimeline` (`:59-67`) for an SSR/CSR edge that locks at 1280. Width: 1280.

- **[H2]** Page never expands beyond the left column at 1440 / 1920 — `getResponsiveDetailGridClass(false, "comfortable")` is used when no template is selected (`apps/web/src/app/[locale]/(app)/emails/page.tsx:792-796`) and resolves to `lg:grid-cols-[minmax(0,56rem)]` (`apps/web/src/app/[locale]/(app)/shared-layout-utils.ts:6`). The result at 1920 is a single 56rem panel with ~40% of the viewport empty on the right. The Drafts/Sent buttons live inside the panel header, so there is no "full-width" use of the page. Either widen the no-detail layout or push template cards to a 4-column grid at xl. Width: 1440, 1920.

### Medium

- **[M1]** Error toasts duplicate (4 toasts, two each for jobs/drafts) — same toast-stacking issue as interview. The toasts cover the bottom-right corner including "Capture jobs from any site" extension promo card. `useErrorToast` is called from each fetch's `.catch`, with no de-duplication. Cite `apps/web/src/app/[locale]/(app)/emails/page.tsx:177-183, :196-202`. Width: 1440, 1920.

- **[M2]** Template cards are not the same component as documents/bank cards — `apps/web/src/app/[locale]/(app)/emails/page.tsx:842-873` builds bespoke template cards (start-aligned icon tile, title, description, `border-primary` selected state). The documents page (`apps/web/src/app/[locale]/(app)/documents/page.tsx`) uses a separate primitive. Two near-identical card components diverge on radius, padding, and selected-state color. Audit prompt explicitly asks: same component or different? **Different.** Lift to a shared `<SelectableCard />`. Width: all rendered widths.

- **[M3]** "Choose Template" header and the Drafts (0) / Sent (0) buttons share the same `PagePanelHeader` row; at narrower widths (visible at 1440) the buttons can wrap below "Choose Template" but here remain on the right. Counts of `(0)` are uninformative; consider a leading icon-only state or hide when zero. Width: 1440.

- **[M4]** No empty state for "no templates available" or "loading templates" — the template list is hardcoded (`TEMPLATE_ORDER`) so there is always a list, but if intl strings or `TEMPLATE_CONFIG` mis-resolve there's no fallback. Lower priority; mention only because this is a long-lived form. Width: all.

### Low

- **[L1]** "Email Templates" page header takes ~120px of vertical space with only a title + sub. Compare with the calendar header (similar height + 4 action buttons). The visual weight is asymmetric across the prep section. Width: all.

- **[L2]** The extension promo card in the sidebar visually competes with toast stack at 1440 / 1920 — they're stacked at the same horizontal position. Width: 1440, 1920.

## Cross-cutting observations

- **`getResponsiveDetailGridClass`** (`apps/web/src/app/[locale]/(app)/shared-layout-utils.ts`) caps single-panel pages at 42rem / 56rem. This is appropriate for prose-heavy detail panes but causes large empty space on emails at 1920. Consider an additional `wide` variant or letting the panel be full width and using internal grid for cards.
- **Toast stacking behavior** is the same anti-pattern observed on interview: multiple identical toasts persist over content. Suggest a `dedupeKey` on `useErrorToast`.
- **Template card primitive duplication** as noted in M2 — same shape as interview category cards (`apps/web/src/app/[locale]/(app)/interview/page.tsx`) and document cards. Three or more callsites.
- **Page header pattern is consistent** via `<PageHeader>` from `apps/web/src/components/ui/page-layout.tsx:49`. Good.

## Console / runtime

- 1280 load failure (see H1) — not a console error per se but a captured failure state.
- Toast spam from `/api/opportunities`, `/api/email/drafts`, `/api/email/sends` 500s in dev. Toast stacking behavior in scope (M1); the underlying 500s skipped per audit rules.
