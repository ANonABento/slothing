# polish-loop-006 — Summary

## Headline

**1 Medium found + fixed.** The 1024–1279 band sweep exposed that
polish-loop-004's `lg:flex-nowrap` was still too aggressive — at 1100px the
right rail crowded the tab group enough to clip "Cover Letter". Bump no-wrap
from `lg` → `xl` (1280px) so the header naturally wraps to two rows below
that and collapses to one row at the documented breakpoint.

## Convergence counter

Reset to **0 / 5** going into polish-loop-007.

This is the second time a Studio-header fix has revealed a new edge case the
prior loop missed. The fixes since loop-001 have now exercised three
breakpoint bands (sub-`md`, `lg`, between `lg`-`xl`), and the current `xl`
threshold matches the rest of the layout's wide breakpoint.

## What landed

- `docs/ui-audit/polish-loop-006/audit.md`, `fixes.md`, `summary.md`.
- `docs/ui-audit/polish-loop-006/screenshots/` — 3 PNGs (1 before, 2 after).
- `apps/web/src/components/studio/studio-header.tsx` — single-line edit.

## What's deferred

Carryover only (G-L2, G-L3, dark-mode parity).

## CI gate

Studio-header tests + type-check + lint expected green locally; push will
trigger CI.

## What to look at next (polish-loop-007)

1. Capture `/studio` at 1280, 1440, 1920 in a clean pass to seed the
   convergence counter.
2. Spot-check the other heavy app surfaces (1100px wasn't touched on them).
3. Sweep additional routes — `/applications`, `/extension-connect` — at the
   sub-`xl` range.
