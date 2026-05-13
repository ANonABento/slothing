# `dashboard` — `/en/dashboard`

**Source:** `apps/web/src/app/[locale]/(app)/dashboard/page.tsx`
**Widths audited:** 1280 / 1440 / 1920 (viewport-only screenshots)
**Loop:** 004

## Screenshots

- 1280: `../screenshots/dashboard-1280.png`
- 1440: `../screenshots/dashboard-1440.png`
- 1920: `../screenshots/dashboard-1920.png`

## Findings

### High

- _None._

### Medium

- **[M1]** [FIXED] Header now uses shared `<PageHeader>` (bordered banner with `border-b bg-card/70`) at `apps/web/src/app/[locale]/(app)/dashboard/page.tsx:401`, matching profile/settings. The `InsetPageHeader` outlier is gone.
- **[M2]** [FIXED] Content no longer left-stranded at 1920 — `pageWidthClasses.wide` now includes `mx-auto` (`apps/web/src/components/ui/page-layout.tsx:9`). Dashboard body and aside center within the available area between sidebar and viewport edge.
- **[M3]** [FIXED] "What unlocks next" aside no longer hugs the right edge at 1920 — same root cause as M2 resolved.
- **[M4]** [STILL] Step row CTA chip is still a `<span>` with hand-rolled inline classes rather than `<Button asChild>` (`apps/web/src/app/[locale]/(app)/dashboard/page.tsx:574-585`). Visible at all widths on Install extension / Add opportunity / Open Studio rows.

### Low

- **[L1]** [STILL] Step number/checkmark column still reserves `sm:w-12` even when complete (`apps/web/src/app/[locale]/(app)/dashboard/page.tsx:552`).
- **[L2]** [STILL] Adjacent uppercase eyebrows ("START HERE" primary vs "01/02/03/04" muted) still use two colors.

### New

- **[N1]** `<PageHeader>` accepts an `icon` prop but the primitive destructures it as `_Icon` and never renders it (`apps/web/src/components/ui/page-layout.tsx:52`). Dashboard passes `icon={Home}` (line 402) but no Home icon appears next to the title in any of the three widths. All other `<PageHeader>` callers in the app have the same dead-prop. Either render the icon (matching `PagePanelHeader`/`PageSection` patterns) or drop the prop.

## Cross-cutting observations

- Bordered `<PageHeader>` style is now consistent across dashboard, profile, settings — global header consistency goal achieved.
- `mx-auto` fix on `pageWidthClasses.wide` benefits every `PageContent`/`PageHeader` consumer; no more right-gutter strand at 1920.
- The unused `icon` prop on `<PageHeader>` is a global defect — affects every page using the primitive, not just dashboard.

## Console / runtime

- Console errors per route still present (dev 500s for dashboard data fetches). Not actionable from a UI standpoint.
