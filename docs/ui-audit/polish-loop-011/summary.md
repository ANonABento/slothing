# polish-loop-011 — Summary (CONVERGENCE)

## Headline

**0 H + 0 M — CONVERGENCE DECLARED.**

This is the fifth consecutive loop reporting 0 High + 0 Medium findings.
Per the goal doc, the convergence stop condition is satisfied. No further
wakes are scheduled.

## Convergence counter

**5 / 5** consecutive 0-H-0-M loops. **Stop.**

## What landed across the whole polish-loop run

### Code changes shipped

| Loop | What | File |
| ---- | ---- | ---- |
| 001 | S-H1 line-clamp on opportunity JD summary | `apps/web/src/app/[locale]/(app)/opportunities/page.tsx` |
| 001 | S-H2 toast surface bg-card + softer ring (no bleed-through) | `apps/web/src/components/ui/toast.tsx` + test fixture |
| 001 | S-H3 studio save-status pill `whitespace-nowrap` | `apps/web/src/components/studio/studio-header.tsx` |
| 001 | S-M1 studio H1 + icon `shrink-0` | `apps/web/src/components/studio/studio-header.tsx` |
| 001 | S-M2 PageIconTile size shrink (40 → 36) | `apps/web/src/components/ui/page-layout.tsx` |
| 001 | Tooling: `capture.mjs` `--prefix` flag for `polish-loop-NNN` dirs | `apps/web/scripts/ui-audit/capture.mjs` |
| 004 | S-M3 studio header sub-`lg` overflow — switch H1 to `truncate`, allow header to wrap below 1024 | `apps/web/src/components/studio/studio-header.tsx` |
| 006 | S-M4 studio header 1024–1279 overflow — bump no-wrap to `xl` (1280) | `apps/web/src/components/studio/studio-header.tsx` |

### Audit-only loops (no code changes)

- polish-loop-002 (full sweep verification at 1280)
- polish-loop-003 (wide-viewport sweep, 1280 + 1920; visible proof of S-H1)
- polish-loop-005 (sub-`lg` sweep, 900px on heavy app surfaces)
- polish-loop-007 (1100px verification on additional routes)
- polish-loop-008 (marketing routes at 1100px)
- polish-loop-009 (`/vs/<competitor>`, `/extension` marketing, kanban at 1100px)
- polish-loop-010 (768 + 1440 edge viewports)
- polish-loop-011 (final 1280 full-route sweep — convergence)

### Tests + CI

- All 3584 vitest tests passing on every push (1 skipped, unchanged from
  baseline before this loop run).
- type-check + lint green on every push.
- CI on `main` green for every loop push.

## What's deferred (intentional — non-blocking)

- **G-L2** — Disabled gradient CTAs (`/salary` "Calculate Range",
  `/ats-scanner` "Scan Resume") wash to opacity-50; could swap to `bg-muted`
  in a future affordance pass.
- **G-L3** — `/vs` hub icon detached from H1 on marketing tree.
- **Dark-mode parity** — needs capture-tooling work to toggle the theme
  cleanly under Playwright before a proper sweep is feasible.

## Lessons logged (in case future-you picks up another loop)

1. **Sweep ALL viewport bands before counting toward convergence.** The
   `redesign-loop-008` summary said it "couldn't cleanly toggle dark mode"
   and similarly this loop discovered that loops 002/003 reported
   0-H-0-M only because they tested 1280+. Real coverage means sub-`lg`
   (~900), between `lg` and `xl` (~1100), `md` exactly (~768), and the
   documented `xl` width (1280) all need a pass before the counter starts.
2. **`whitespace-nowrap` alone is not enough for header items in a constrained
   container.** Pair with `truncate` on the H1, `shrink-0` on the fixed-width
   group, and gate the no-wrap breakpoint at the size where the *entire row
   actually fits.* Polish-loop-001's S-M1 fix moved fast and broke the layout
   below 1024; loop-004 partially addressed it; loop-006 finished the job by
   moving the breakpoint to `xl`.
3. **The capture script's hot-reload race is real but benign.** Re-running
   with `--only` for affected routes is the right escape hatch.

## Stop signal

No further `ScheduleWakeup` calls. Per goal doc convergence stop condition,
the loop terminates here.
