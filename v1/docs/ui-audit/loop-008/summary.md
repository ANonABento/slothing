# Loop 008 — Final iteration (audit loop terminated)

**Audit run:** 2026-05-13. 75 captures (one transient screenshot error on `home-1280` re-captured cleanly). Console steady at 195 (all dev-env 500s; out of scope).

**Status:** This is loop-008. Per the LOOP-RUNBOOK hard cap, the audit loop terminates here regardless of remaining findings count. The loop ran 8 iterations over a single working session.

## Loop-007 visual verification

Extension marketing page at 1280 and 1920 — the `<MarketingSection>` adoption produced clean, visually-consistent output:

- Features section: `padding="compact"` + `background="subtle-card"` + `borderTop` → renders with the soft card-tinted band the design called for.
- How it works: bare compact section — three-column step grid lands flush below the seam.
- Privacy & trust: `borderY` + `subtle-card` + `lg:grid-cols-[0.8fr_1.2fr]` two-column layout intact.
- FAQ: `width="prose"` (max-w-3xl) keeps the disclosure list readable.
- Final CTA: `width="narrow"` + `flex flex-col items-center text-center` produces the centered install hero exactly as before.

Hero section retained its custom split-screen grid — too specialized to fold into the primitive without polluting the API.

## Final tally

Carry-over status across the loop (loop-001 → loop-008):

| | Loop-001 baseline | Loop-008 estimate | Δ |
| --- | ---: | ---: | ---: |
| **High** | 29 | ~13 | **–16** (–55%) |
| **Medium** | 100 | ~74 | **–26** (–26%) |
| **Low** | 46 | not re-counted | — |
| Console errors | 435 | 195 | **–240** (–55%) |

The medium number is an estimate (no fresh full re-audit this loop — loop-004 was the last 5-agent re-tally). Loop-005's three targeted M fixes (vs-index, ats-scanner, pricing) plus the marketing primitives that loops 006 and 007 enable should push the actual count lower, but those closures haven't been agent-verified.

## Cumulative fixes shipped (loops 001 → 008)

**Globals (every page)**
- G-H1 CSP nonce hydration warning eliminated.
- G-H2 `hreflang` invalid-DOM warning eliminated.
- G-M1 Interview Quick Practice `cultural-fit` translation reconciled across 8 locales (with a unit test that pins category keys to `SESSION_QUESTION_CATEGORIES`).
- N1 `<PageHeader>` icon prop now renders via `<PageIconTile>` — was previously destructured as `_Icon` and dropped on the floor on every consumer.

**Tier A**
- A1 `pageWidthClasses.wide` gained `mx-auto` — centers every app page that uses `PageShell` at 1920.
- A2 `/privacy` and `/terms` moved under `(marketing)/` so they inherit nav + footer chrome.
- A3 `PageHeader` actions cap (folded into A1).

**Tier B**
- B1 Marketing locale switcher: globe + 2-char chip (EN/ES/FR/PT/HI/KO/中/日) instead of leaking truncated "Engl".
- B2 `useErrorToast` dedupe: parallel callers firing the same error collapse to one toast.
- B3 Settings third grid orphan fixed (`GmailAutoStatusSection` spans 2 columns).
- B4 Profile load-error overlap: failed initial load renders only the centered `ErrorState` with retry — no fake editor underneath.
- B5 Dashboard adopts shared `PageHeader` like every other app surface.
- B6 BillingSection migrated to `<PageSection>` primitive.

**Tier C**
- C1 `<StatusPill />` extracted at `apps/web/src/components/opportunities/status-pill.tsx`. Adopted on list / kanban / review-queue (which previously had no status badge at all).
- C2 OpportunityCard consolidation **re-evaluated and deferred** — the three surfaces serve visually-distinct UX contexts; sub-piece extraction (e.g. `<OpportunityCardChips>`) is the right next step instead of a single variant-driven card.
- C3 Marketing primitives shipped (`<MarketingSection>` + `<MarketingSectionHeader>`) at `apps/web/src/components/marketing/section.tsx`. Adopted on home page (features / how-it-works / testimonials / cta-section) and on 5 of 6 sections in `/extension/page.tsx`.

**User-flagged polish**
- Modal animation no longer slides from bottom-right corner (zoom presets dropped; clean overlay+content fade).
- Locale switcher shows the current language chip.

**Branding**
- Columbus sub-brand removed and folded into Slothing across 70 source files.

## Carry-over for the next maintainer

Items that remain open and would be worth a follow-up loop:

**High (estimated ~13 remaining)**
- `vs-index` H1 (sparse landing content density).
- `profile` H1 (verified `[STILL]` in loop-004 visual capture, addressed in loop-004 B4; but the spec entry stays open until a future capture explicitly shows the editor doesn't ever render alongside an error).
- Various app-route fetch-error states that could surface broken-editor patterns similar to the profile case.

**Medium (estimated ~74 remaining)**
- `pricing/page.tsx` 524-line route still inlines all section chrome — biggest pending C3 adoption target.
- `vs/page.tsx` and `vs/[competitor]/page.tsx` similarly bespoke.
- `ats-scanner` uses `<div className="py-16 px-4">`, doesn't fit the current MarketingSection padding variants; could add a `padding="loose-compact"` (py-16 px-4) if worth it.
- Profile section migration: `<Card>` × ~10 → `<PageSection>` (loop-001 profile M1) — bounded, high-leverage when picked up.
- Studio drawer `<CollapsibleRail>` extraction (audit's #1 DRY recommendation per docs/studio agent in loop-001 and loop-004).
- `<ListItemCard>` shared across bank / answer-bank / studio file panel.
- `<ChartPanel>` wrapper aligning analytics + salary chart presentation.

## Files

- `apps/web/scripts/ui-audit/capture.mjs` — reusable Playwright capture script (supports `--next`, `--loop N`, `--only`, `--widths`, ECONNREFUSED retry).
- `apps/web/src/components/marketing/section.tsx` — `<MarketingSection>` + `<MarketingSectionHeader>` primitives.
- `apps/web/src/components/opportunities/status-pill.tsx` — `<StatusPill />` primitive.
- `docs/ui-audit/LOOP-RUNBOOK.md` — protocol if you want to re-open the loop.
- `docs/ui-audit/README.md` — status table updated for all 8 iterations.
- `docs/ui-audit/loop-001/` through `loop-008/` — captures + findings + summaries for every iteration.

**Loop terminated.** No further wakeups scheduled.
