# polish-loop-004 — Summary

## Headline

**1 Medium found + fixed.** Sub-`lg` viewport sweep (900px) of `/studio`
exposed a regression in the polish-loop-001 S-M1 fix: bare
`whitespace-nowrap` on the H1 caused it to overflow behind the Resume tab
and the "Cover Letter" button still wrapped. S-M3 fix: switch the header's
no-wrap breakpoint from `md` to `lg`, use `truncate` instead of bare
nowrap, add `whitespace-nowrap` to the tab buttons, and `shrink-0` to the
tab group.

## Convergence counter

Reset. **0 / 5** going into polish-loop-005.

The earlier 002 and 003 loops reported 0-H-0-M because they only swept
viewports ≥ 1280, where this regression doesn't surface. The 5-consecutive
window now needs to start over with the wider viewport coverage in place.

## What landed

- `docs/ui-audit/polish-loop-004/audit.md`, `fixes.md`, `summary.md`.
- `docs/ui-audit/polish-loop-004/screenshots/` — 4 PNGs (1 before + 3 after).
- `apps/web/src/components/studio/studio-header.tsx` — Tier A fix for S-M3.

## What's deferred (carryover)

- G-L2 disabled gradient CTAs (`/salary`, `/ats-scanner`).
- G-L3 `/vs` hub icon layout.
- Dark-mode parity.

## CI gate

- Type-check, lint, Studio tests all green locally.
- Push to `main` will trigger the workflow on `e719851` lineage. Last CI run
  (`25847182042`) was green; this push should be the same.

## What to look at next (polish-loop-005)

1. Re-screenshot `/studio` at 1024 (`lg` breakpoint exactly) to confirm
   transition is graceful.
2. Sub-1280 viewport sweep of the other heavy app surfaces — `/opportunities`
   row card, `/opportunities/review` panel, `/calendar`, `/dashboard`.
3. Spot-check `/applications` (legacy/redirect path) at 900px.
4. Begin convergence run: target 5 consecutive 0-H-0-M loops.
