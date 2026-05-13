# `analytics` — `/en/analytics`

**Source:** `apps/web/src/app/[locale]/(app)/analytics/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/analytics-1280.png`
- 1440: `../screenshots/analytics-1440.png`
- 1920: `../screenshots/analytics-1920.png`

## Findings

### High

- **[H1]** Error fallback drops the page header — when the analytics fetch fails the page renders only `<CenteredPagePanel>` with a small "Failed to fetch analytics" card and Retry button (`apps/web/src/app/[locale]/(app)/analytics/page.tsx:241-253`). The `<PageHeader>` is not rendered in the error branch, so the user loses navigational context (no title, no breadcrumb-equivalent, no exports button). Compare with calendar / emails which show the header and a panel-level error. Restructure the error branch to render `<AppPage><PageHeader …/><PageContent><CenteredPagePanel>…` instead. Width: 1280, 1440, 1920 (all three captures land in this state under the dev 500).

### Medium

- **[M1]** Header actions duplicate calendar pattern verbatim — the export-range Select + (CSV / JSON / Sheets / Print) button group at `apps/web/src/app/[locale]/(app)/analytics/page.tsx:279-335` reuses the same `flex flex-col items-start gap-3 sm:flex-row sm:items-center` shape as calendar's actions. Lift to a `<PageHeaderActions group>` primitive (see calendar M and cross-cutting). Width: all.

- **[M2]** Charts (`TrendCharts`, `SuccessDashboard`, `SkillLearningPaths`) are not wrapped by a shared `<ChartCard>` — each is rendered inside a top-level `<div>` with its own `<h3>` heading sibling (`apps/web/src/app/[locale]/(app)/analytics/page.tsx:657-693`) rather than inside a `<PagePanel>` like the rest of the page. The Skills + Pipeline panels above use `PagePanel` + `PagePanelHeader`. The chart sections lose the card chrome and end up visually inconsistent with the panel-heavy section above. The salary page also has charts (compare offers grid, salary range gradient bar) but does wrap them in PagePanels, so the chart styling diverges across the two analytics-style routes. Width: all.

- **[M3]** Print button is hidden below `sm` breakpoint (`hidden sm:inline-flex`, `:328`) but the export range Select and CSV/JSON buttons are still visible — partial responsive hide of one action in a 4-action row reads like a bug rather than an intentional touch-target compromise. Width: would only manifest below 1280.

- **[M4]** Recent Activity uses opportunity card pattern that differs from `/opportunities` — the row at `apps/web/src/app/[locale]/(app)/analytics/page.tsx:580-612` is bespoke (icon tile + title/company + status pill + TimeAgo). The `/opportunities` list has its own row component. Consider sharing. Width: all (only visible in non-error state, not captured here).

### Low

- **[L1]** "Failed to fetch analytics" copy is technical-flavored (compare with calendar's "Could not load calendar"). Standardize on "Could not load analytics" to match the rest of the app's `useErrorToast` titles. Width: all (error state).

## Cross-cutting observations

- **PageHeader missing in error fallback** is the highest-leverage cross-cutting fix — analytics is the only route where the error state hides the header. Other routes show errors via toasts or inline panel banners while keeping the header.
- **Chart wrapper duplication** — analytics renders charts as bare children of section divs; salary uses `PagePanel` for its salary-range visualization. There's no shared `<ChartPanel title icon …>` so visual treatment of charts is route-specific.
- **`pageGridClasses.fourStats`** (`apps/web/src/components/ui/page-layout.tsx:344`) is good — used for the overview cards. But the detailed sections fall back to `lg:grid-cols-2` ad-hoc again.

## Console / runtime

- Dev `/api/analytics` 500 → drives the error state captured in all three screenshots. Skipped per audit rules; the layout consequence (H1) is in scope.
