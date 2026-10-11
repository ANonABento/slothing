# `applications` — `/en/applications`

**Source:** `apps/web/src/app/[locale]/(app)/applications/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/applications-1280.png`
- 1440: `../screenshots/applications-1440.png`
- 1920: `../screenshots/applications-1920.png`

## Status vs loop-001

`/applications` is still a server `redirect()` to `/opportunities?status=applied,interviewing,offered` (`apps/web/src/app/[locale]/(app)/applications/page.tsx:12`). All structural findings from `findings/opportunities.md` apply verbatim. Loop-001 H1 and M1–M3 remain.

- **[H1 — STILL]** Page title still reads "Opportunities" on a route the user navigated to as `/applications`. Same `t("title")` (`opportunities/page.tsx:429`). All widths.
- **[H2 — FIXED]** Toast pile-up resolved by dedupe (loop-003 B2). Loop-001 saw 4 stacked toasts at 1280; loop-004 shows exactly 2 at all widths. The status-`Select`/Open-source button collision (M-grade in loop-001 unless toasts overlap) is *not* visible at 1280 in loop-004's screenshots because the visible card now has the right meta column unobscured — toasts no longer reach into the card area. Re-classify as **resolved-as-side-effect of B2**. Underlying density bug from `opportunities.md [H1]` is unchanged.
- **[M1 — STILL]** No active-filters chip strip for URL-driven `?status=applied,interviewing,offered`. Loop-001's `urlStatusFilters`-vs-`filters`-state divergence is unchanged. The visible card at 1280/1920 shows status `Interviewing` but no chip on the page indicates "you are filtered to 3 statuses." `opportunities/page.tsx:124-127, 271-274`. All widths.
- **[M2 — STILL]** Default view is `list`, not `kanban`. The applications mental model maps to the pipeline, but the user sees a list. `opportunities/page.tsx:135, 230-233`. All widths.
- **[M3 — STILL]** "+ Add Opportunity" CTA copy unchanged on this URL.
- **[L1 — STILL]** No "Applications" sidebar entry; user lands on the "Opportunities" sidebar item.
- **[L2 — STILL]** "linkedin" still rendered as plain text source (`page.tsx:1106-1108`).

## New observations (loop-004)

- **[NEW M4]** `Showing 1 of 4 opportunities` is misleading on `/applications` — the user is on a "view applied/interviewing/offered" route, but the summary says "of 4" referring to all opportunities including saved/pending. Should say `Showing 1 of 1 applications` (or similar) when entered through `/applications`. `opportunities/page.tsx:740-751`. All widths.
- **[NEW L3]** Status badge for the only visible card is `Interviewing` rendered with the same `Badge variant="outline"` as the source-tag chips ("linkedin"). `<StatusPill status="interviewing" />` would distinguish it. `opportunities/page.tsx:1103`. All widths.

## Cross-cutting observations

- Whole-route DRY decision still pending (loop-001 cross-cutting). Either prune `/applications` or differentiate it.
- The `<StatusPill />` extraction will visibly help on this route in particular: a page filtered to applied/interviewing/offered should make those three statuses visually distinct (interviewing=info-blue, offer=success-green, applied=neutral-strong) instead of all-outlined.

## Console / runtime

- 2 toasts visible (down from 4). Dedupe shipped.
