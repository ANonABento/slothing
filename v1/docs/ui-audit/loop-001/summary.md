# Loop 001 — Summary & Fix Plan

**Audit run:** 2026-05-13, 75 captures (25 routes × 3 widths) at 1280 / 1440 / 1920 against `http://localhost:3010`.

## Headline counts

**Total findings: 29 H / 100 M / 46 L** across 25 routes + 2 globals.

| Group | High | Med | Low | Notes |
| --- | --- | --- | --- | --- |
| `_global` | 2 | 2 | 0 | Framework-level (layout, middleware, intl) |
| Marketing + auth (8 routes) | 6 | 30 | 14 | `vs-index` worst; `privacy`/`terms` lack marketing chrome |
| Dashboard / profile / settings (3) | 1 | 14 | 6 | `profile` error overlaps editor |
| Upload / docs / bank / answer-bank / studio (5) | 8 | 18 | 8 | `studio` densest; legacy `/upload` `/documents` are redirects |
| Opportunities / applications (3) | 7 | 13 | 7 | `opportunities-review` worst; 3 separate `OpportunityCard` impls |
| Tools (6: interview/calendar/emails/analytics/salary/extension-connect) | 5 | 23 | 11 | `emails` 1280 load failure |

## The five highest-leverage findings

These are the patterns where one fix lights up the whole portfolio:

1. **`pageWidthClasses.wide` is missing `mx-auto`** (`apps/web/src/components/ui/page-layout.tsx:6-10`). Single line. Fixes 1920 stranding on every authenticated app page that uses `PageShell`/`PageContent`. Surfaced explicitly on `dashboard`, `profile`, `settings`, `opportunities`, `bank`, `analytics`, `calendar`, `salary`, `emails`, `interview`, `answer-bank`. Implicit on every other app route.

2. **Two competing `PageHeader` primitives.** `InsetPageHeader` (used only on `/dashboard`) vs `PageHeader` (used everywhere else). Both live in `apps/web/src/components/ui/page-layout.tsx`. Migrating dashboard to `PageHeader` collapses the inconsistency and gives every app surface one chrome. (Loop 1 will do the migration; the alternative — moving everyone to `InsetPageHeader` — is a much bigger churn.)

3. **CSP nonce hydration warning on every page load** (`G-H1` in `_global.md`). Drop the `nonce` attribute in dev mode where the CSP doesn't use it anyway. Removes 25 console errors per audit cycle (one per route) and unmasks real warnings.

4. **Three independent `OpportunityCard` implementations** across `opportunities` (list), kanban board, and review queue. Consolidating to one `OpportunityCard variant={list|kanban|review}` is the most expensive fix in this audit, but the highest visual + maintenance win across the highest-traffic app surface. **Deferred to loop 2** because the change touches three pages + a wizard surface and risks regression without dedicated test coverage.

5. **No shared marketing primitives.** Every marketing route reinvents its hero, section header, max-width container, and card. 5 different `max-w-*` caps across 8 marketing routes. Deserves a `<MarketingSection>` / `<MarketingHero>` / `<MarketingCard>` / `<LegalPage>` set. **Deferred to loop 2-3** because it's a marketing-wide style sweep.

## Loop 1 fix plan

### Tier A — Globals & one-touch (apply now)

| ID | Fix | Files | Effort |
| --- | --- | --- | --- |
| **G-H1** | Guard the `nonce` prop so it's only set when `NODE_ENV === "production"` (where the CSP actually consumes it). | `apps/web/src/app/[locale]/layout.tsx` | XS |
| **G-H2** | Replace `{...({ hreflang: language } as Record<string, string>)}` with `hrefLang={language}`. Delete the cast. | `apps/web/src/app/[locale]/layout.tsx:62` | XS |
| **G-M1** | Reconcile `interview.quickPractice.categories` with `SESSION_QUESTION_CATEGORIES` in all 8 locale files. Add `cultural-fit`, remove orphan `company` + `system-design`. Add a Vitest that pins the two together. | `apps/web/src/messages/*.json`, `apps/web/src/lib/constants/interview.ts` (test) | S |
| **A1** | Add `mx-auto` to `pageWidthClasses.wide` (and audit `narrow`/`prose`). | `apps/web/src/components/ui/page-layout.tsx:6-10` | XS |
| **A2** | Move `/privacy` and `/terms` directories under `(marketing)/` so they inherit nav + footer. | `apps/web/src/app/[locale]/privacy/**`, `apps/web/src/app/[locale]/terms/**` | S |
| **A3** | Cap `PageHeader` content width so the actions group doesn't float ~1100px right of the title at 1920. | `apps/web/src/components/ui/page-layout.tsx:49-81` | XS |

### Tier B — Targeted (apply now)

| ID | Fix | Files | Effort |
| --- | --- | --- | --- |
| **B1** | Locale switcher in marketing nav leaks truncated "Engl" text at all widths — `sr-only` `SelectValue` not winning vs Radix default. | `apps/web/src/components/i18n/locale-switcher.tsx:96` | XS |
| **B2** | `useErrorToast` re-fires on every retry with no dedupe — toast stacks pile up on opportunities, settings, dashboard, bank, etc. Add a `dedupeKey` and skip duplicates within a short window. | `apps/web/src/hooks/use-error-toast.ts` | S |
| **B3** | Settings third grid has 3 children in a 2-col grid — `GmailAutoStatusSection` orphans onto half-width row. | `apps/web/src/app/[locale]/(app)/settings/page.tsx:92` | XS |
| **B4** | Profile "Could not load profile" banner renders *alongside* the live editor on a 500 instead of replacing it — fake `0% · 9 quick wins` and active save/discard buttons are dangerously misleading. | `apps/web/src/app/[locale]/(app)/profile/page.tsx:448-452` | S |
| **B5** | Migrate `/dashboard` from `InsetPageHeader` to `PageHeader` so all app pages share one chrome. | `apps/web/src/app/[locale]/(app)/dashboard/page.tsx` | S |
| **B6** | `BillingSection` re-implements section header inline; migrate to `PageSection`. | `apps/web/src/components/settings/billing-section.tsx` | XS |

### Tier C — Defer to loop 2 / 3 (note in roadmap, don't ship now)

- Consolidate three `OpportunityCard` impls → single `OpportunityCard variant=…` (kanban / list / review).
- Extract `<StatusPill />` and adopt across list / kanban / review / applications.
- Migrate `profile` from `<Card>` × ~10 to `<PageSection>` (already adopted by settings).
- Marketing primitives set: `<MarketingHero>`, `<MarketingSection>`, `<MarketingSectionHeader>`, `<MarketingCard>`, `<Callout>`, `<AmbientGradient>`, `<LegalPage>`. Pick consistent `max-w-*` baseline.
- `<ListItemCard>` / `<EntryCard>` shared across bank / answer-bank / studio file panel.
- `<NotificationBanner variant="info|success|warning">` replacing `CrossLinkBanner` + `MigrationBanner` + ad-hoc info pills.
- Studio drawer `<CollapsibleRail>` primitive shared with main sidebar (drawer asymmetry).
- `<ChartPanel>` wrapper aligning analytics + salary chart presentation.
- Emails 1280 load failure root-cause: pin `DraftsSheet` / `SentTimeline` dynamic imports + parallel `useEffect` fan-out.
- Decide canonical icon-as-logo (`Sparkles` vs `Rocket` vs other).
- Dogfood loop should own the dev-env 500 cleanup (separate workstream).

## Per-route findings index

See `findings/<slug>.md` for full detail. `_global.md` for cross-cutting framework issues.

## Captures

`screenshots/<slug>-<width>.png` for every (route × width) combination. Run metadata in `run-summary.json`; console error log in `console-errors.json`.

## Exit criteria check

Loop 1 surfaced **29 H / 100 M** — well above the **0 H / 0 M** termination threshold. Loop 2 will re-audit after Tier A + B ship, confirm fixes, and surface what's left.
