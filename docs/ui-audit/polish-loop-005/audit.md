# polish-loop-005 — Audit

Sub-`lg` viewport sweep. After polish-loop-004's S-M3 fix, this loop verifies
other heavy app surfaces hold at 900px (the user's original Studio screenshot
width).

## Capture summary

- 6 screenshots via Playwright MCP at 900×900 and 1024×900.
- Routes covered: `/opportunities`, `/dashboard`, `/calendar`, `/analytics`,
  `/settings`, `/opportunities/review`, `/studio` (1024 transition).

## Per-route observations

| Route | 900px | Note |
| ----- | ----- | ---- |
| `/opportunities` | clean | Header chrome (List/Kanban/Filters/Import/Add Opportunity) fits cleanly with a single wrap to the action row. Cards in skeleton state. |
| `/dashboard` | clean | "Dashboard" H1 + Home icon tile (now 36px) sit comfortably. Stat-card grid retains 4 columns. |
| `/calendar` | skeleton | Page captured before data hydrate. Skeleton chrome matches expected `bg-paper` rhythm. |
| `/analytics` | clean | 4-up stat cards + pipeline list span well. Filter pills (All Time / CSV / JSON / Sheets / Print) reflow cleanly. |
| `/settings` | clean | BYOK 3-up benefit grid intact; provider 2-up grid intact. |
| `/opportunities/review` | clean | Centered card holds the panel max-width; JD chunks readable; decision row (Dismiss / Apply / Save) 3-up at the foot. |
| `/studio` (1024) | clean transition | At the `lg` breakpoint exactly, the polish-loop-004 fix kicks in correctly — single-row header. |

## New findings

None. The polish-loop-004 S-M3 fix held; no new issues surfaced at 900–1024.

## Convergence counter

**1 / 5** consecutive 0-H-0-M loops. Continue.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Tier plan

None this loop.

## Carryover (still deferred)

- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon.
- Dark-mode parity (capture tooling).
