# polish-loop-006 — Audit

Between-breakpoint sweep: 1024–1279 widths (the gap between sub-`lg` and `xl`).

## Capture summary

- 3 screenshots via Playwright MCP at 1100×900 + 1280×900.
- Focus: `/studio` header transition between `lg` and `xl` breakpoints.

## Findings

### S-M4 [Medium] — Studio header still crowded at 1100px after loop-004 fix
- **Where:** `apps/web/src/components/studio/studio-header.tsx:228`.
- **What:** At 1100px (between `lg`=1024 and `xl`=1280), the outer container
  was `lg:flex-nowrap` so the whole row stayed on a single line. There's not
  enough horizontal room for [H1] + [Resume | Cover Letter tabs] + [Template]
  + [Export] + [helper text] + [Saved pill] + [panel-right]. The "Cover
  Letter" tab text got clipped behind the Template trigger.
- **Cause:** Loop-004's fix moved the no-wrap breakpoint from `md` to `lg`,
  but `lg` is still too early — the right-rail widgets take real space at
  1024–1279px.
- **Fix vector (Tier A this loop):** Bump `lg:flex-nowrap` → `xl:flex-nowrap`
  so the header wraps to two rows below 1280, then collapses to one row at
  the documented `xl` width.
- **Verified:** `studio-1100-after.png` shows the header on two rows with all
  affordances intact at 1100px; `studio-1280-after.png` confirms single-row at
  1280px.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 1 (S-M4) — fixed |
| Low      | 0     |

## Convergence counter

Reset. **0 / 5** going into polish-loop-007.

Loops 003 + 005 swept narrow + wide but skipped the 1024–1279 band. With the
S-M4 fix landed, the counter restarts.

## Tier plan

**Tier A — shipped:** S-M4 Studio header 1024–1279 wrap breakpoint.

**Tier B:** none.

**Tier C — deferred (carryover):**
- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon layout.
- Dark-mode parity.
