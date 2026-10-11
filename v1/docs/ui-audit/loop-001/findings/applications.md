# `applications` — `/en/applications`

**Source:** `apps/web/src/app/[locale]/(app)/applications/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/applications-1280.png`
- 1440: `../screenshots/applications-1440.png`
- 1920: `../screenshots/applications-1920.png`

## Cross-cutting observations (top of file)

`/applications` is **not** a real page. It is a server `redirect()` to `/opportunities?status=applied,interviewing,offered` (`apps/web/src/app/[locale]/(app)/applications/page.tsx:1-17`). Everything you see in the screenshots is the `/opportunities` page rendered with that status filter applied. Therefore:

- All structural findings from `findings/opportunities.md` apply here verbatim.
- The screenshots **prove the redirect lands**, but also prove there is **zero visual differentiation** between the "applications" mental model (a tracked-pipeline view of applied/interviewing/offered) and the "opportunities" mental model (every signal, including saved/pending). The page title still reads "Opportunities" — there is no breadcrumb, no `applied/interviewing/offered` chip header, no "Applications" h1.

If "applications" is supposed to be a distinct concept (per the audit prompt, "both track a pipeline" — implying intentional separation), the current implementation does not communicate that. It just deep-links into a filtered list.

## Findings

### High

- **[H1]** Title says "Opportunities" on a route called `/applications` — there is nothing on the page that says "Applications" or signals that the user is in a focused pipeline view. The redirect drops them into `/opportunities?status=...` and the page chrome does not adapt. `apps/web/src/app/[locale]/(app)/applications/page.tsx:12` (the redirect target) and `apps/web/src/app/[locale]/(app)/opportunities/page.tsx:429` (the title is `t("title")` with no awareness of the status filter). All widths.
- **[H2]** Same status `Select` + "Open source" button collision and toast pile-up as `/opportunities` — see `findings/opportunities.md` H1/H2. The screenshots here show four error toasts stacked in the bottom right at 1280, with two pairs of "Could not load opportunities" / "Could not load kanban lane settings" duplicated. All widths. (Severity High because at 1280 the lower toasts overlap the bottom edge of the visible card area.)

### Medium

- **[M1]** No active-filters chip strip is visible — the URL adds `?status=applied,interviewing,offered`, the filter is applied (the "All" tab is selected, and the visible card has status "Interviewing"), but the user gets no surfaced affordance saying "you are looking at 3 statuses" with a clearable chip. `/opportunities` does have an active-filters chip strip (`opportunities/page.tsx:906-1029`), but it does not consider the `urlStatusFilters` source of truth — only the `filters` state. So the URL-driven filter is invisible. `opportunities/page.tsx:124-127, 271-274`. All widths.
- **[M2]** The pipeline columns concept does not appear at all on `/applications` — the route opens in `list` mode by default (the user's last `viewMode` from local storage), so the user does not see the kanban pipeline columns even though "applications" semantically maps to the kanban view. If `/applications` is supposed to mean "the pipeline," it should default to `kanban`. `opportunities/page.tsx:135, 230-233`. All widths.
- **[M3]** `+ Add Opportunity` reads wrong on this route — the user expects "+ Add Application" or "+ Log Application." Same `t("addOpportunity")` string. `opportunities/page.tsx:466-469`. All widths.

### Low

- **[L1]** Sidebar shows `Opportunities` and `Review Queue` but no `Applications` entry visible in the screenshots — yet the URL `/applications` is reachable (presumably from elsewhere). The redirect therefore lands the user on a sidebar item ("Opportunities") that does not match the URL they typed/clicked. `apps/web/src/components/layout/sidebar.tsx`. All widths.
- **[L2]** The example card visible across all three widths shows the source as plain text "linkedin" — same Low finding as `findings/opportunities.md` L1.

## Cross-cutting observations

- **Whole-route DRY decision required.** Either `applications` is a thin redirect (current state — then prune the `/applications` URL or own the inconsistency) or it is a distinct view of the same data. If the latter, it should:
  - default to `kanban` view,
  - render an `<h1>Applications</h1>` and pipeline-focused description,
  - hide saved/pending toggles,
  - retitle the CTA to "Log application,"
  - surface the URL-driven status filter as a clearable chip.
- **Active-filters chip strip should respect `urlStatusFilters`.** Today the chip strip in `opportunities/page.tsx:906-1029` reads only the in-state filters and silently ignores the URL source — meaning any deep-link via `?status=` is invisible to the user. This bug is exposed by `/applications`.
- All other observations from `opportunities.md` apply.

## Console / runtime

- Same dev-env 500 toast pile-up as `/opportunities` and `/opportunities/review`. Per audit context, skip dev-env 500s; the toast-coalescing UX bug is real.
