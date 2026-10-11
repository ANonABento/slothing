# `opportunities-review` — `/en/opportunities/review`

**Source:** `apps/web/src/app/[locale]/(app)/opportunities/review/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/opportunities-review-1280.png`
- 1440: `../screenshots/opportunities-review-1440.png`
- 1920: `../screenshots/opportunities-review-1920.png`

## Cross-cutting observations (top of file)

This route should look like a sibling of `/opportunities`. In practice it is a separate visual world:

- It does **not** use `AppPage` / `PageHeader` / `PageContent` (`apps/web/src/components/ui/page-layout.tsx`); it builds its own shell with `<div className="relative min-h-screen">` and a fixed back-arrow at top-left (`review/page.tsx:128-135`).
- It introduces a new "swipeable card" pattern (`components/opportunities/review-queue.tsx:223-330`) with `motion.article`, drag handlers, and a 3-up Dismiss / Apply / Save action grid that exists nowhere else in the app.
- It has no `+ Add Opportunity` CTA, no Filters, no view toggle — even though the empty state pushes the user back toward `/opportunities`. The wizard is unreachable from this surface.

## Findings

### High

- **[H1]** Page header is missing — every other authenticated page in the app gets `PageHeader` with an icon, title, and description (`apps/web/src/components/ui/page-layout.tsx`). This route shows only a fixed circular back arrow at top-left and a tiny `Pending review` badge inside the queue card. There is no "Review Queue" title visible above-the-fold on the page itself — the only "Review Queue" string lives in the sidebar nav. Disorienting at all three widths. `apps/web/src/app/[locale]/(app)/opportunities/review/page.tsx:127-143`.
- **[H2]** Content stranded in the left half at 1920 — the empty state is a `max-w-xl` (~36rem) card centered in the main column. Because the page does not use `AppPage` (`width="wide"` → `max-w-screen-2xl`), the right ~40% of the viewport at 1920 is empty white; this is the worst case of the audit for "stranding." `components/opportunities/review-queue.tsx:143`. Width: 1920.
- **[H3]** Stacked error toasts in the bottom-right corner across all widths ("Could not load review queue · Failed to get settings"). Same toast-coalescing bug as `/opportunities` — the toast keeps duplicating because the `fetchPageData` retry path can re-fire without dedupe. `apps/web/src/app/[locale]/(app)/opportunities/review/page.tsx:51-58`. All widths.

### Medium

- **[M1]** No shared card / no `OpportunityCard` reuse — the swipe card in `review-queue.tsx:249` reimplements the title / company / location / tags layout from scratch; it shares zero CSS with the list-row card or the kanban card. Three opportunity card implementations across these two routes. Cross-cutting DRY win.
- **[M2]** Status pill missing — the active card surfaces *no* status badge (only a "Pending review" pill in the header outside the card). On `/opportunities` the same opportunity gets a status badge inline. Inconsistent. `components/opportunities/review-queue.tsx:198-330`.
- **[M3]** Add Opportunity wizard CTA is unreachable from this route — the user can navigate **away** to `/opportunities` and then open the wizard, but `+ Add Opportunity` is the primary CTA on the sister page and is missing here. `review/page.tsx` has no header actions slot. All widths.
- **[M4]** Empty-state CTA ordering is busy — three CTAs stacked vertically: "Install the browser extension to auto-capture jobs" (gradient/primary), `@Chrome` extension install button row, then `Open opportunities` + `Review settings` outline pair. No clear primary. `components/opportunities/review-queue.tsx:151-170`. All widths.
- **[M5]** Fixed back arrow at `top-4 left-4` floats above content with no visual relationship to the rest of the page; on a desktop viewport this looks like a mobile pattern grafted onto desktop. `review/page.tsx:129-135`. All widths.

### Low

- **[L1]** `text-3xl font-bold text-primary` for the "remaining" count vs `text-2xl font-semibold` for the "Opportunities" h1 — the count out-weights the page title visually. `components/opportunities/review-queue.tsx:204-211`. (Visible in the populated state, not in this audit's empty-state screenshots.)
- **[L2]** Action button row uses `h-16 rounded-xl border bg-card` — different border-radius and height from every other button in the app (`Button` defaults). Adds to the "feels like a different app" perception. `components/opportunities/review-queue.tsx:355-358`.

## Cross-cutting observations

- **DRY opportunity #1 — single `OpportunityCard`.** The list row, kanban card, and review swipe card should share a base; right now they share nothing but the underlying data shape.
- **DRY opportunity #2 — single page chrome.** This route should opt into `AppPage` + `PageHeader` like everything else; the fixed back arrow + bare `<div>` shell is unique and fights the layout system. The swipeable card body can stay; the chrome should not.
- **DRY opportunity #3 — `<StatusPill />`.** None of the three card implementations agrees on how (or whether) to surface status.
- **Add Opportunity CTA** — should be present on the review queue header too, since the wizard is the canonical entry point for opportunities and the review queue is half the funnel.

## Console / runtime

- Repeated `Could not load review queue · Failed to get settings` toasts in the bottom-right at all three widths. Per audit context this is the dev-env `/api/settings` 500; note as cross-cutting, not as a unique route bug. The lack of toast deduping is, however, a real bug.
