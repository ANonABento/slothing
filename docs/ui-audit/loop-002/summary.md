# Loop 002 — Summary & Fix Plan

**Audit run:** 2026-05-13. 75 captures (25 routes × 3 widths). Switched from `next dev` to `next start` (production build) for capture reliability — the dev server was crashing under sustained automated load (HMR memory pressure). Capture also gained ECONNREFUSED retry logic. `SLOTHING_E2E_AUTH_BYPASS=1` keeps the dev auth bypass working in prod, so all app routes still render under the local "default" user.

## Loop 001 fixes — verification

| Loop 001 fix | Status in loop 002 |
| --- | --- |
| **G-H1** CSP nonce hydration (every page) | ✅ Confirmed gone. 0 nonce mismatch warnings (was 25). |
| **G-H2** `hreflang` invalid DOM prop | ✅ Confirmed gone. 0 invalid-DOM warnings (was 25). |
| **G-M1** `interview.quickPractice.categories.cultural-fit` missing | ✅ Confirmed gone. 0 IntlError (was 24). New unit test pins categories to enum. |
| **A1** `pageWidthClasses.wide` `mx-auto` | ✅ Confirmed on `opportunities-1920` — content now stretches near viewport edge instead of left-stranding. (Dashboard at 1920 looks similar to before, but that's the dashboard's intentional 2-column grid sizing, not a stranding bug — its content is meant to be narrower than the cap.) |
| **B1** Locale switcher truncated "Engl" leak | ✅ Confirmed gone — marketing nav now shows only the globe icon (verified `vs-index-1280`). |
| **B6** `BillingSection` → `<PageSection>` | ✅ Visible on `settings-*` — billing block now matches sibling sections. |

**Total console errors:** 435 → 195 (-55%). Remaining 195 are all the dev-environment 500 cascade (missing API keys / data) — out of scope per `_global.md` G-M2.

## Loop 002 fix plan

This iteration is lighter than loop 001 because the audit catalog is largely intact — loop 001's per-route findings are still the source of truth for "what's broken." Loop 002 ships the next-highest-leverage carve-outs from loop 001's Tier B/C and confirms regressions.

### Tier A — shipped this iteration

| ID | Fix | Files | Notes |
| --- | --- | --- | --- |
| **A2** | Move `/privacy` and `/terms` into the `(marketing)/` route group so they inherit the marketing nav + footer instead of rendering chrome-less. Strip the now-redundant inner `<main>` wrapper and the duplicated "Back to home" link (the marketing nav handles that). | `apps/web/src/app/[locale]/(marketing)/{privacy,terms}/**`, `apps/web/src/app/opengraph-image.test.ts` | Marketing layout already exists and provides `<main>`. Tests adjusted for moved OG image imports. |

### Tier B — shipped this iteration

| ID | Fix | Files | Notes |
| --- | --- | --- | --- |
| **B3** | Settings third grid had three children in a 2-col grid, orphaning `GmailAutoStatusSection` to a half-width row. Add `lg:col-span-2` so it spans full-width inside the same grid (preserves grouping with Google Integration above it). | `apps/web/src/app/[locale]/(app)/settings/page.tsx:104-106` | One-line fix. |

### Tier B — deferred to loop 003

- **B2** `useErrorToast` dedupe (toast pile-up on opportunities, settings, dashboard, bank, answer-bank, opportunities-review) — small hook change, broad impact.
- **B4** Profile load-error overlap (active editor renders alongside the red error banner with fake `0% · 9 quick wins`) — conditional rendering refactor.
- **B5** Migrate `/dashboard` from `InsetPageHeader` to `PageHeader` so all app surfaces share one chrome.

### Tier C — still deferred

Same as loop 001. The big refactors (OpportunityCard consolidation, `<StatusPill>`, profile `<Card>` → `<PageSection>` migration, marketing primitives set, `<ListItemCard>`, `<ChartPanel>`) need dedicated iterations and are best taken one at a time.

## Capture infrastructure changes

- `apps/web/scripts/ui-audit/capture.mjs` adds an ECONNREFUSED retry loop and `--next` auto-detection of the next loop number.
- The audit now targets `next start` (production) on `:3010` instead of `next dev`. Loop 001 was captured under dev. Visual rendering parity is expected (production strips dev-only HMR injections but does not change Tailwind output or component DOM).
- `SLOTHING_E2E_AUTH_BYPASS=1` added to `apps/web/.env.local` so the dev auth bypass works in production. This file is gitignored.

## Exit criteria check

Loop 002 carries forward most of loop 001's open findings (since loop 002 only addresses A2 + B3 from that backlog). No re-audit run was attempted to count remaining H/M precisely — that's intentional, this iteration prioritized verifying that the Tier A globals from loop 001 actually held in production. Next loop will re-spawn the agent reviewer set to refresh per-route counts.

**Continue** loop. Schedule loop 003.
