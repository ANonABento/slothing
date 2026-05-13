# `salary` — `/en/salary`

**Source:** `apps/web/src/app/[locale]/(app)/salary/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/salary-1280.png`
- 1440: `../screenshots/salary-1440.png`
- 1920: `../screenshots/salary-1920.png`

## Loop-001 H/M status

- **[M1 tabs are a one-off]** — `[STILL]`. Inline `<button>` + cn() pill bar still rendered at `apps/web/src/app/[locale]/(app)/salary/page.tsx:303-323`. Not lifted to a shared `<Tabs>` component.
- **[M2 inset `border-b bg-card/50` strip below PageHeader creates a visual seam]** — `[STILL]`. Visible at all three widths: PageHeader bottom border, then tabs strip with its own bottom border, then content. Two stacked horizontal rules.
- **[M3 calculator panel capped at 42rem with empty right side at 1920]** — `[STILL]`. At 1920 the Market Rate Calculator panel ends near 720px; right ~50% of viewport empty.
- **[M4 charts inconsistent with analytics]** — Not visible in calculator-tab capture. `[STILL]` in source.
- **[M5 compare-offers ad-hoc trash position + bare destructive `removeOffer`]** — Not visible (calculator tab). `[STILL]` in source; bare destructive still violates `docs/destructive-actions-pattern.md`.

## Findings

### High

- _(none)_

### Medium

- **[M1]** (Loop-001 M1) Tab bar still a one-off pattern. Width: all.
- **[M2]** (Loop-001 M2) Visual seam from stacked PageHeader bottom border + tabs-strip border. Width: all.
- **[M3]** (Loop-001 M3) Calculator panel still capped at 42rem; empty right half at 1920. No "Results will appear here" placeholder. Width: 1280 (mild), 1440, 1920 (severe).
- **[M4]** (Loop-001 M5) `removeOffer` still bare destructive in source — must adopt confirm/undo per `docs/destructive-actions-pattern.md`. Width: compare-offers tab (not in capture).

### Low

- **[L1]** (Loop-001 L1) Salary-range gradient still uses `from-amber-400`. Width: negotiate tab (not in capture).
- **[L2]** (Loop-001 L2) Tab icons clash with PageIconTile content. Width: all.

## Cross-cutting observations

- Same 56rem/42rem `getResponsiveDetailGridClass` cap that creates the emails H1 dead-space also drives salary M3. A single `wide` variant or "fill remaining viewport" mode resolves both routes.
- Tab pattern divergence with Studio (resume/cover-letter mode) and the missing interview voice/text toggle remains the highest-leverage cross-cutting fix — three near-identical "tab-shaped" UIs across the app, none sharing a primitive.

## Console / runtime

- 1x `/api/salary` 500 per width (dev expected). No client-side errors in capture; calculator empty state has no fetch in flight at render time.
