# Loop 003 — Summary & Fix Plan

**Audit run:** 2026-05-13, 75 captures (25 routes × 3 widths) against production server (`next start`) with `SLOTHING_E2E_AUTH_BYPASS=1`. One transient screenshot protocol error on `home-1280` re-captured cleanly. All 75 captures land.

## Loop 001 / 002 fix verification

| Fix | Status |
| --- | --- |
| **G-H1** Nonce hydration | ✅ Still gone — 0 nonce errors in loop-003 console set |
| **G-H2** `hreflang` invalid DOM prop | ✅ Still gone — 0 invalid-DOM warnings |
| **G-M1** Interview `cultural-fit` translation | ✅ Still gone — 0 IntlError |
| **A1** `mx-auto` on `pageWidthClasses.wide` | ✅ Confirmed on `opportunities-1920` + `dashboard-1280` |
| **A2** `/privacy` `/terms` under (marketing)/ | ✅ Both routes now render with the marketing nav + footer |
| **B1** Locale switcher | ↻ Updated this iteration — see below |
| **B3** Settings grid orphan | ✅ `GmailAutoStatusSection` now spans full row |
| **B6** Billing → `<PageSection>` | ✅ Visible |

**Total console errors:** 195 (unchanged from loop-002, all dev-env 500s).

## User-flagged issues addressed this loop

1. **Dialog open animation slid from bottom-right corner.** The shadcn `DialogContent` had `zoom-in-95` + `zoom-out-95` presets, but composed with the `translate(-50%, -50%)` centering transform they read as a corner-spawn slide instead of a centered zoom. Removed both presets; the dialog now fades in cleanly. `dialog.test.tsx` updated to enforce the new contract.

2. **Compact locale switcher only showed a globe.** Loop-001 hid the SelectValue to fix a truncated "Engl" leak, but globe-only confused users about the current language. Trigger now shows the globe icon + a 2-character chip (EN/ES/FR/PT/HI/KO/中/日) with the full SelectValue still announced to screen readers via `sr-only`.

## Tier B shipped this loop

| ID | Fix | Files |
| --- | --- | --- |
| **B2** | `useErrorToast` dedupe — adds optional `dedupeKey` to `addToast`; when a toast with the same key is already live, the second call short-circuits and returns the existing id without scheduling a new auto-dismiss. `useErrorToast` derives a `dedupeKey` from `title + description` so identical fetch failures collapse to a single toast across parallel callers (opportunities + settings + kanban). | `apps/web/src/components/ui/toast.tsx`, `apps/web/src/hooks/use-error-toast.ts` |
| **B5** | Dashboard adopts shared `PageHeader`. The route previously rendered an `InsetPageHeader` inside `PageShell`, making the dashboard the lone outlier. Top-level now uses `<AppPage><PageHeader icon={Home} …/><PageContent>…</PageContent></AppPage>` matching every other app surface. `DashboardHeader` helper deleted; description/actions hoisted to the page-level. | `apps/web/src/app/[locale]/(app)/dashboard/page.tsx` |

## Carry-overs into loop 004

- **B4** Profile load-error overlap. Bigger conditional-rendering refactor; deferred until the next iteration to keep this commit reviewable.
- **Tier C** still untouched: OpportunityCard consolidation, `<StatusPill>`, profile `<Card>` → `<PageSection>`, marketing primitives set, `<ListItemCard>`, `<ChartPanel>`. Pick one per iteration.

## Exit criteria check

Loop-003 surfaced no NEW high/medium findings vs loop-001 (only the user-flagged dialog + locale-switcher polish, both fixed). Carry-overs from loop-001's H/M list still pending. **Continue** to loop-004.
