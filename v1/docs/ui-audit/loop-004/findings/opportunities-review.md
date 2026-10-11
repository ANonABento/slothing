# `opportunities-review` — `/en/opportunities/review`

**Source:** `apps/web/src/app/[locale]/(app)/opportunities/review/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/opportunities-review-1280.png`
- 1440: `../screenshots/opportunities-review-1440.png`
- 1920: `../screenshots/opportunities-review-1920.png`

## Status vs loop-001

- **[H1 — STILL]** No `PageHeader`. Loaded-success path still wraps the queue in bare `<div className="relative min-h-screen">` with the floating back-arrow at `top-4 left-4` (`review/page.tsx:127-135`). Loop-004 screenshots happen to be the empty-queue state, which now does use `StandardEmptyState` inside a centered `max-w-xl` wrapper (`components/opportunities/review-queue.tsx:142-173`). Empty state has an `<h1 className="sr-only">Review Queue` only — visually still no title above-the-fold. All widths.
- **[H2 — STILL]** Empty-state card is still `max-w-xl` and centered in the main column (`review-queue.tsx:143`). At 1920 the right ~40% of the viewport is empty white. The route still does not opt into `AppPage width="wide"` for the swipe-card surface; the empty state uses a bare div, not `AppPage`. `mx-auto` is on the inner wrapper but the page doesn't expand to fill. Width: 1920.
- **[H3 — FIXED]** Toast pile-up resolved by dedupe (loop-003 B2). loop-001 saw repeated "Could not load review queue · Failed to get settings" stacks; loop-004 shows exactly one toast at all three widths. `hooks/use-error-toast.ts:55`.
- **[M1 — STILL]** Swipe card in `review-queue.tsx:249` still reimplements the title/company/location/tags layout. Three opportunity-card implementations across the cluster.
- **[M2 — STILL]** Swipe card surfaces no status pill — only an inline `Badge variant="info">Remote</Badge>` if applicable (`review-queue.tsx:262`) and a `Badge variant="secondary">Pending review</Badge>` in the page header (`review-queue.tsx:203`). The same opportunity gets a status badge on `/opportunities`. Inconsistent. **A shared `<StatusPill />` would fix this in one line per card.**
- **[M3 — STILL]** No Add Opportunity wizard CTA. The empty state CTAs are extension-install + "Open opportunities" + "Review settings" — the wizard is unreachable from this route.
- **[M4 — STILL]** Empty-state CTA ordering still busy: 4 CTAs (gradient install + Chrome detected button + Open opportunities + Review settings). No clear primary. `review-queue.tsx:151-170`. Visible at all widths.
- **[M5 — STILL]** Floating back arrow at `top-4 left-4` unchanged in the loaded-success path (`review/page.tsx:129-135`). Mobile-pattern-on-desktop still present.
- **[L1/L2 — STILL]** Count-out-weights-title and the `h-16 rounded-xl` action buttons unchanged in the populated state (not visible in loop-004's empty-state screenshots).

## New observations (loop-004)

- **[NEW M6]** Empty state title hierarchy is wrong — the `StandardEmptyState` `title="Queue cleared"` is rendered as the page's only visible heading, while the actual page title "Review Queue" is hidden behind `<h1 className="sr-only">` (`review-queue.tsx:144`). For SEO + a11y this is technically OK, but for visual orientation it leaves the user without a Page Header in either state. All widths.
- **[NEW L3]** "Install the browser extension to auto-capture jobs" CTA copy is a sentence, not a label — sits awkwardly inside the default `<Button>` styling and pushes the button width past the empty-state `max-w-xl` constraint visually. `review-queue.tsx:152-156`. All widths.

## Cross-cutting observations

- **Page-chrome divergence is the root cause of H1/H2/H5.** This route should use `AppPage` + `PageHeader` like every other authenticated page; the swipe interaction can stay inside `PageContent`.
- **`<StatusPill />` would let this card finally show the opportunity's status** (currently it doesn't even communicate that the card is `pending`; that's only inferable from the page header pill).
- **Add Opportunity CTA** should appear in the would-be `PageHeader` actions slot once that's added.

## Console / runtime

- 1 toast visible (was multiple stacked in loop-001). Dedupe shipped successfully.
