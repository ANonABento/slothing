# Loop 004 — Summary & Fix Plan

**Audit run:** 2026-05-13, 75 captures against the rebrand build (loop-003 fixes shipped). 0 capture failures. Console errors steady at 195 (all dev-env 500s; out of scope).

## Carry-over status (loop-001 → loop-004)

| | Loop-001 baseline | Loop-004 [STILL] + [NEW] | Δ |
| --- | ---: | ---: | ---: |
| High | 29 | 13 | –16 |
| Medium | 100 | 80 | –20 |
| Low | 46 | n/a (not re-counted) | — |

No regressions reported by any of the 5 re-audit agents.

## Verification of prior fixes

All confirmed `[FIXED]` by per-route agents:

- **G-H1 / G-H2 / G-M1** still gone — 0 nonce, 0 hreflang, 0 cultural-fit IntlError.
- **A1** `mx-auto` cap centers wide app pages at 1920.
- **A2** privacy + terms now under marketing chrome.
- **A3** PageHeader actions don't strand at 1920.
- **B1** Locale switcher shows globe + 2-char chip (EN/ES/FR/PT/HI/KO/中/日).
- **B2** Toast pile-up collapses across opportunities/settings/bank/upload/answer-bank/interview/emails.
- **B3** Settings grid orphan resolved.
- **B5** Dashboard adopts shared bordered PageHeader.
- **B6** BillingSection uses shared PageSection.
- Dialog open animation is a clean fade (no zoom→corner artifact).
- Privacy / terms inherit nav + footer.

## NEW findings surfaced this loop

- **N1 [Cross-cutting]** `<PageHeader>` destructured `icon: _Icon` and never rendered it. Every consumer (dashboard, profile, settings, opportunities, bank, answer-bank, analytics, calendar, salary, emails, interview, applications, upload, documents, extension-connect) was passing an icon that silently dropped on the floor. **Fixed this loop** — now renders via `<PageIconTile>` for visual consistency with `<PageSection>`.
- **opportunities M6** Chip-row divergence on list vs kanban; addressed in part by the StatusPill extraction.
- **opp-review M6** Empty-state title hierarchy still under-weighted vs sibling pages; deferred.
- **applications M4** Status count shown is misleading; deferred.
- **studio L4** Canvas cramped at 1280; minor.

## Loop 004 fix plan

### Tier B — shipped this iteration

| ID | Fix | Files |
| --- | --- | --- |
| **B4** | Profile page short-circuits the editor when the initial `/api/profile` load fails. Previously it rendered the editor (with fake `0% · 9 quick wins`, active Save/Discard, blank inputs) alongside the red "Could not load profile" banner — so a click on Save would have overwritten real server data with the empty default profile. Now the failed-load path renders only a centered `ErrorState` card with a retry button (which bumps a `reloadKey` to re-fire the load effect). The non-error path is unchanged. | `apps/web/src/app/[locale]/(app)/profile/page.tsx` |
| **N1** | `<PageHeader>` now renders the `icon` prop as a `<PageIconTile>` (matching the existing `<PageSection>` look). The dead destructure is gone. | `apps/web/src/components/ui/page-layout.tsx` |

### Tier C — first refactor shipped this iteration

| ID | Fix | Files |
| --- | --- | --- |
| **C1 — `<StatusPill />` extraction** | New `apps/web/src/components/opportunities/status-pill.tsx` is the single source of truth for how each `OpportunityStatus` renders as a badge. Eight statuses covered (`pending` / `saved` / `applied` / `interviewing` / `offer` / `rejected` / `expired` / `dismissed`) with semantic-token variants and an `interviewing` emphasis style that fills solid. Adopted at all three call sites — opportunities list, kanban board, and review-queue swipe card (which previously showed no status at all). | `apps/web/src/components/opportunities/status-pill.tsx`, `apps/web/src/app/[locale]/(app)/opportunities/page.tsx`, `apps/web/src/app/[locale]/(app)/opportunities/_components/kanban-board.tsx`, `apps/web/src/components/opportunities/review-queue.tsx` |

### Tier C — deferred to loop 005 +

- Three independent `OpportunityCard` impls → single `<OpportunityCard variant={list|kanban|review}>`. StatusPill is the unblocker; the card consolidation is the next step.
- Profile section migration: `<Card>` × ~10 → `<PageSection>` (loop-001 profile M1).
- Marketing primitives set: `<MarketingHero>`, `<MarketingSection>`, `<MarketingSectionHeader>`, `<MarketingCard>`, `<Callout>`, `<LegalPage>`. Closes most home/pricing/extension/terms M-findings.
- `<CollapsibleRail>` for sidebar + studio drawers (docs/studio agent's top DRY recommendation).
- `<ListItemCard>` shared across bank / answer-bank / studio file panel.
- `<ChartPanel>` wrapper aligning analytics + salary.
- Redirect-only `/upload` `/documents` chrome cleanup.

## Exit criteria check

Loop-004 surfaced 13 H + 80 M [STILL] (down 16 H / 20 M from loop-001). One [NEW] global (N1) shipped same loop. **Continue** to loop-005, which should take the OpportunityCard consolidation (now unblocked by StatusPill) and start on the marketing primitives.
