# Loop 002 — Fixes

## What changed

Eight single-class edits across six files. Each one is the per-component
follow-up that loop-001's cross-cutting PageHeader/PagePanelHeader sweep
couldn't reach — these components opt out of the shared primitives.

### Studio shell
- `apps/web/src/components/studio/studio-header.tsx:242` — h1 `Document Studio`
  + `font-display tracking-tight`.
- `apps/web/src/components/studio/studio-file-panel.tsx:129` — h2 `Files`
  + `font-display tracking-tight`.
- `apps/web/src/components/studio/version-history-section.tsx:32` — h2
  `Version History` + `font-display tracking-tight`.
- `apps/web/src/components/studio/ai-assistant-panel.tsx:667` — h2
  `AI Assistant` + `font-display tracking-tight`.
- `apps/web/src/components/studio/ai-assistant-panel.tsx:908` — eyebrow
  `Suggested rewrites` swapped `font-semibold` → `font-mono tracking-[0.16em]`.
- `apps/web/src/components/builder/section-list.tsx:221` — h3 `Sections`
  + `font-display tracking-tight`.

### Dashboard
- `apps/web/src/app/[locale]/(app)/dashboard/page.tsx:459` — `Start here`
  eyebrow swapped `font-semibold` → `font-mono tracking-[0.16em]`.
- Same file, line 462 — h2 `Set up your workspace` + `font-display tracking-tight`.

## Why these specific edits

Loop-001 swept the *shared* heading primitives (PageHeader, PagePanelHeader,
PageSection, StandardEmptyState, InsetPageHeader). This loop is the per-route
clean-up: components whose headings render via their own inline `<h2>` /
`<h3>` instead of going through the shared primitives.

The pattern is the same in every case: small uppercase caption above an h2 →
mono caption + display h2.

## Before / after

- `docs/ui-audit/redesign-loop-002/screenshots/dashboard-1280-light-after.png`
  — `START HERE` eyebrow now reads as mono with wider tracking. `Set up your
  workspace` carries the Outfit display character.
- `docs/ui-audit/redesign-loop-002/screenshots/studio-1280-light-after.png` —
  `Document Studio` h1 and the drawer titles (`Files`, `Version History`,
  `Sections`, `AI Assistant`) all editorially aligned.
- Before-shots reused from loop-001 since this loop strictly extends the
  loop-001 sweep and no copy changed.

## Drift gates

| Gate | Status |
| ---- | ------ |
| `pnpm --filter @slothing/web type-check` | pass |
| `pnpm --filter @slothing/web lint` | pass (only pre-existing react-hooks warnings) |
| `pnpm --filter @slothing/web test:run` | pass — 3584 tests passed, 1 skipped |
