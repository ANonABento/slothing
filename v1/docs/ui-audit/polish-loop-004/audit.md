# polish-loop-004 — Audit

Targets this loop: `/opportunities/[id]` (detail), and a sub-1280 viewport
sweep of `/studio` (the user's original screenshot was ~900px wide).

## Capture summary

- 4 viewport screenshots via Playwright MCP (capture script doesn't accept
  arbitrary URLs / non-standard widths cleanly).
- Routes touched: `/opportunities/[id]` @ 1280, `/studio` @ 900 (before fix),
  `/studio` @ 900 (after fix), `/studio` @ 1280 (after fix).

## Findings

### S-M3 [Medium] — Studio header overflows at sub-`lg` viewports
- **Where:** `apps/web/src/components/studio/studio-header.tsx:228-263`.
- **What:** At 900px (the user's original screenshot width), `Document Studio`
  H1 overflowed its `min-w-0` container because polish-loop-001 fixed it with
  bare `whitespace-nowrap`. The H1 actually rendered *behind* the
  Resume/Cover Letter tabs. Additionally the "Cover Letter" tab wrapped to two
  lines because the tab buttons had no `whitespace-nowrap`.
- **Cause:** The outer header had `md:flex-nowrap` (md = 768px) — so the entire
  row was forced onto one line at 900px even though it doesn't fit.
- **Fix vector (Tier A this loop):**
  1. H1 wrapper now `min-w-0 flex-1 md:flex-none`; H1 uses `truncate` instead
     of bare `whitespace-nowrap` so any overflow is graceful.
  2. Tab group gets `shrink-0`; individual tab buttons get `whitespace-nowrap`.
  3. Outer header switches from `md:flex-nowrap` to `lg:flex-nowrap` so
     sub-1024 viewports allow the right-side controls to wrap to a second
     row rather than crowding the title row.
- **Verified:** `studio-900-after.png` shows the header on two rows with all
  affordances intact; `studio-1280-after.png` confirms no regression at the
  documented breakpoint.

### `/opportunities/[id]` — clean
- **Where:** `apps/web/src/app/[locale]/(app)/opportunities/[id]/page.tsx`.
- **What:** Detail page captured at 1280. Card-on-card sectioning (Core,
  Location, Details), right rail (Actions, Contacts, Dismiss, Linked
  Documents) and rust-tinted Dismiss button all balanced. Dismiss correctly
  uses `useUndoableAction` (Pattern B undo snackbar). No findings.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 1 (S-M3) — fixed |
| Low      | 0     |

## Convergence counter

This loop surfaced **1 Medium** that needed fixing. The polish-loop-002 / 003
runs reported 0-H-0-M but tested only at 1280+. The original loop-001 fix
held at 1280+ but regressed below `lg`. With the S-M3 fix landed, the next
loop will start the convergence counter again.

- polish-loop-002: 0-H-0-M (clean at 1280 only)
- polish-loop-003: 0-H-0-M (clean at 1280 + 1920)
- polish-loop-004: 1 M found at 900 viewport → counter resets

Counter: **0 / 5** going into polish-loop-005.

## Tier plan

**Tier A — shipped this loop:** S-M3 Studio header sub-`lg` overflow.

**Tier B:** none.

**Tier C — deferred (carryover):**
- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon layout.
- Dark-mode parity.
