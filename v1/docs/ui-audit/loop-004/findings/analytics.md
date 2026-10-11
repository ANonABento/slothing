# `analytics` — `/en/analytics`

**Source:** `apps/web/src/app/[locale]/(app)/analytics/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/analytics-1280.png`
- 1440: `../screenshots/analytics-1440.png`
- 1920: `../screenshots/analytics-1920.png`

## Loop-001 H/M status

- **[H1 error fallback drops PageHeader]** — `[STILL]`. All three loop-004 captures land in the same `Failed to fetch analytics / Retry` error card. No `<PageHeader>` rendered above it; no nav context, no actions slot. Compare to calendar/emails which keep the header on error.
- **[M1 header actions duplicate calendar pattern]** — Not visible in this capture (error state replaces header). Source unchanged in repo, so still `[STILL]` once non-error path renders.
- **[M2 charts not wrapped in shared `<ChartCard>`]** — Not visible (error state). `[STILL]` in code.
- **[M3 `Print` button hidden below sm only]** — Cannot verify at audited widths (≥1280); still `[STILL]` in code.
- **[M4 Recent Activity row diverges from `/opportunities`]** — Not visible (error state); `[STILL]` in code.
- **[L1 "Failed to fetch analytics" copy mismatch with rest-of-app "Could not load …"]** — `[STILL]`. Same string visible in all three captures.

## Findings

### High

- **[H1]** (Loop-001 H1) Error fallback still renders only the `<CenteredPagePanel>` error card with no `<PageHeader>` above it. User loses nav context, range/export actions disappear from the page. Wrap error branch in `<AppPage><PageHeader …/><PageContent><CenteredPagePanel>…`. Cite `apps/web/src/app/[locale]/(app)/analytics/page.tsx:241-253`. Width: 1280, 1440, 1920.

### Medium

- **[M1]** (Loop-001 M1) Header-actions inline pattern still present in source (`apps/web/src/app/[locale]/(app)/analytics/page.tsx:279-335`). Not in this capture but unchanged. Lift to `<PageHeaderActions>`.
- **[M2]** (Loop-001 M2) Chart sections still bare `<div>` + `<h3>` rather than `<PagePanel>`-wrapped. Not visible in capture; unchanged in source.
- **[M3]** (Loop-001 M4) Recent Activity row component diverges from `/opportunities` row. Unchanged in source.

### Low

- **[L1]** (Loop-001 L1) "Failed to fetch analytics" copy still uses fetch-flavored phrasing. Standardize on "Could not load analytics". Width: all.

## Cross-cutting observations

- Analytics is still the only audited route that drops `<PageHeader>` on error. Calendar/emails/interview/salary all keep header chrome under failure. Single-line architectural fix: hoist `<AppPage><PageHeader>` out of the success branch in `analytics/page.tsx` and let `<CenteredPagePanel>` render under it.
- Because the error state collapses the page to a small centered card, there is no information about the in-source M1–M4 patterns until the dev `/api/analytics` 500 is fixed; loop status for those is carried forward from loop-001 by source inspection.

## Console / runtime

- 2x `/api/analytics` 500s per width (dev expected). Drives the captured error state.
