# Loop 001 — Fixes

## What changed

Two files, six single-class edits. All minimum-diff.

### `apps/web/src/components/ui/page-layout.tsx`

1. **`PageHeader` h1** — added `font-display` and swapped `tracking-normal` →
   `tracking-tight`. This is the title surface for 12+ app routes (dashboard,
   opportunities, bank, profile, calendar, salary, settings, analytics, emails,
   answer-bank, interview, opportunities/[id]/research).
2. **`InsetPageHeader` h1** — added `font-display`.
3. **`PagePanelHeader` h2** — added `font-display tracking-tight`. Used for
   inline panels like "Set up your workspace" and "What unlocks next" on
   dashboard, plus drawer panel titles on Studio ("Files", "Version History",
   "Sections", "AI Assistant").
4. **`PageSection` h2** — added `font-display tracking-tight`. Used for
   section-card wrappers across opportunities, profile, settings.
5. **`StandardEmptyState` h2** — added `font-display tracking-tight`. Used in
   empty-state cards (opportunities filter empty, bank empty, etc.).

### `apps/web/src/components/layout/sidebar.tsx`

6. **Sidebar group label** (line 443) — swapped
   `font-semibold uppercase tracking-normal` → `font-mono uppercase tracking-[0.16em]`.
   Drops the body-sans semibold (looks busy at mono caption size) and adopts the
   editorial mono-eyebrow convention from the landing page.

## Why these specific edits

Six classes is the *whole* set of touch points for moving every authenticated
app route's heading typography from generic-shadcn to editorial-system. The
editorial signal is mostly Outfit (display) on H1/H2 and JetBrains (mono) on
captions. Every other surface — colors, borders, surfaces, shadows — already
inherits the right values through the slothing theme preset's HSL aliasing.

So the highest-leverage editorial fix for the in-app pages is "make headings
look editorial." That's what these six edits do.

## Before / after

Captured at `docs/ui-audit/redesign-loop-001/screenshots/`:

- `dashboard-1280-light-{before,after}.png`
- `opportunities-1280-light-{before,after}.png`
- `studio-1280-light-{before,after}.png`

Visible changes:
- H1 titles (`Dashboard`, `Opportunities`) — character has the Outfit cut now
  (look at the `a` glyph; the previous render was Geist's straight foot).
- Section headings inside cards (`Set up your workspace`, `What unlocks next`,
  Studio's `Files` / `Version History` / `Sections` / `AI Assistant`) — same
  display-font swap.
- Sidebar group labels — visibly mono'd with editorial 0.16em tracking. Before
  they read like a tight body-sans caption, now they sit as proper mono
  eyebrows.

## Drift gates

| Gate | Status |
| ---- | ------ |
| `pnpm --filter @slothing/web type-check` | pass (exit 0) |
| `pnpm --filter @slothing/web lint` | pass (only pre-existing react-hooks warnings, no errors) |
| `pnpm --filter @slothing/web test:run` | pass — 487 files, 3584 tests passed, 1 skipped |

Tests asserted class *presence* (e.g. `text-3xl`, `font-semibold`) not class
exclusivity, so adding `font-display` and `tracking-tight` didn't break the
existing page-layout.test.tsx assertions.
