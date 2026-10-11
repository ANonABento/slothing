# `opportunities` — `/en/opportunities`

**Source:** `apps/web/src/app/[locale]/(app)/opportunities/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/opportunities-1280.png`
- 1440: `../screenshots/opportunities-1440.png`
- 1920: `../screenshots/opportunities-1920.png`

## Cross-cutting observations (top of file)

This route is the canonical "pipeline" surface and several patterns repeat across it, the review queue, and the (redirect-only) applications page. Watch for repeats elsewhere:

- **Status pill** — the row uses `<Badge variant="outline" className="capitalize">{opportunity.status}</Badge>` (`opportunities/page.tsx:1103`). The kanban card uses a different scheme (an `info`/`warning` badge for type plus a separate optional `CLOSED_SUB_STATUS_BADGE_VARIANTS` badge for closed sub-state). The review queue card surfaces no status pill at all, only a `Pending review` chip in the header. There is no shared `<StatusPill />` primitive.
- **Card primitive** — list view uses `<PagePanel as="article" className="p-5">` (`opportunities/page.tsx:1093`); kanban uses `<article className="cursor-grab rounded-lg border bg-background p-3 ...">` (`_components/kanban-board.tsx:364`); review queue uses yet another `motion.article ... rounded-lg border bg-card shadow-xl` (`components/opportunities/review-queue.tsx:249`). Three independently styled "opportunity card" implementations.
- **Action cluster in header** — `[List|Kanban] · Filters · Import · + Add Opportunity` is hand-rolled here; review queue has a different action cluster and no Add button.

## Findings

### High

- **[H1]** Per-row status `Select` overlaps "Open source" button — at 1280 the right-hand meta column (`xl:w-80 xl:grid-cols-1` is gated behind `xl`, so on 1280 it falls back to `sm:grid-cols-2`) packs the status `Select` into the same row as the "Open source" outline button; in the 1280 screenshot the right column wraps onto multiple lines and the `Open source` button is partially obscured by stacked error toasts. This is partially toast-overlap and partially a column-density bug. `apps/web/src/app/[locale]/(app)/opportunities/page.tsx:1144-1191`. Width: 1280. (Severity: H if you treat the toast stack as user-blocking; M if you treat it purely as an env artifact — see Console section.)
- **[H2]** "Could not load kanban lane settings" + "Could not load opportunities" toasts are stacking and burying the right edge of every card across all three widths. They originate from `/api/settings` and `/api/opportunities` 500s in dev, but the **toast stack has no max-count or auto-dismiss visible**, so identical errors pile up. `apps/web/src/app/[locale]/(app)/opportunities/page.tsx:174,206,251` (each `showErrorToast` call); the toast presentation lives in `@/components/ui/toast`. Widths: 1280 / 1440 / 1920. Worth noting even if 500s are env-only — duplicate toast suppression is a real fix.

### Medium

- **[M1]** Status badge inconsistency between list and kanban — the list row renders status as `<Badge variant="outline" className="capitalize">pending</Badge>` (line 1103), an outlined chip indistinguishable in color from the source/tags chips below. The kanban card omits the status entirely except for closed sub-statuses, where it gets a colored variant. There is no semantic color for status (e.g. interviewing should not look identical to a tag). `apps/web/src/app/[locale]/(app)/opportunities/page.tsx:1103` and `apps/web/src/app/[locale]/(app)/opportunities/_components/kanban-board.tsx:397-414`. All widths.
- **[M2]** Two parallel "type" tab UIs on the same page — the page header has a `SegmentedToggle` for `List/Kanban`, and immediately below the page renders another inline tab strip for `Roles / Hackathons / All` (`page.tsx:680-696`) that is reimplemented as raw `<button>`s instead of reusing `SegmentedToggle`. Same visual pattern, divergent implementation. All widths.
- **[M3]** Filters panel + active-chips + summary line + tab strip stack vertically with inconsistent spacing — the `mb-4` summary text, `mb-6` filter row, and the active-chips strip create an awkward four-row band between the page header and the first card. Hard to scan. `page.tsx:664-751`. Most pronounced at 1280 / 1440.
- **[M4]** At 1920, content is correctly capped via `width="wide"` (`max-w-screen-2xl`) so cards do not stretch full-bleed, but the sample card only has one row of meta on the right while the left column shows lots of dead horizontal space inside `max-w-prose` summary. Card "feels" half-empty at 1920. `page.tsx:1125`. Width: 1920.
- **[M5]** Add Opportunity CTA uses `variant="gradient"` (`page.tsx:466`) — this is a one-off variant only used here; review queue uses default `Button asChild` for its CTAs. Visual identity for the primary "add" action is not consistent across the opportunities surface.

### Low

- **[L1]** "Source" string ("linkedin", "greenhouse" in screenshots) is rendered as plain `<span className="text-sm text-muted-foreground">` next to two badges, so it reads as a third pill but is not styled like one. `page.tsx:1106-1108`. All widths.
- **[L2]** "Showing 4 of 4 opportunities · 2 jobs · 2 hackathons · 1 pending" uses inline `·` separators with `mx-2 text-muted-foreground/50`. Fine, but the same pattern is hand-rolled (no `<Separator inline />` helper). `page.tsx:740-751`.
- **[L3]** Tab strip uses `min-h-11` for click target on the inline `<button>`s but the `SegmentedToggle` next to it is shorter — visual height mismatch at all widths. `page.tsx:687`.

## Cross-cutting observations

- **Three opportunity-card implementations.** Strong DRY opportunity: extract `<OpportunityCard variant="row" | "kanban" | "review">` so the list, kanban, and review-queue card share spacing, badge layout, and link/title treatment.
- **No shared `<StatusPill status={...} />`.** Three call sites pick badge variants ad-hoc; an enum-keyed semantic pill (info=interviewing, success=offer, destructive=rejected, muted=dismissed, warning=pending) would unify list + kanban + the future review-queue surface.
- **Tab strips are duplicated** (`SegmentedToggle` exists; the inline Roles/Hackathons/All strip ignores it). Consolidate to one primitive.
- **Toast duplication**. Three independent fetches each fire `showErrorToast` on failure and they all land in the toast stack simultaneously. Either dedupe by error key or coalesce dependent fetches.
- The `applications` route is a 308-style redirect into this page (`apps/web/src/app/[locale]/(app)/applications/page.tsx:12`), so anything broken here is broken on `/applications` too.

## Console / runtime

- Multiple `Could not load opportunities` and `Could not load kanban lane settings` error toasts visible at all three widths. These are dev-env 500s on `/api/opportunities` and `/api/settings` per the audit context (skip), but the toast-stacking behavior is a real UX bug worth filing.
- No nonce or intl-related warnings visible in the screenshots.
