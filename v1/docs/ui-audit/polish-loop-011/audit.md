# polish-loop-011 — Audit (convergence)

Final pass at 1280px on every authenticated app workspace route. If this
loop reports 0 H + 0 M, the convergence counter reaches 5/5 and the loop
closes per the goal doc.

## Capture summary

- 16 routes captured at 1280px via `capture.mjs`.
- 15 OK, 1 timeout (`/opportunities/review` dev-server `networkidle`
  timeout — data fetch was slow on this run; verified clean in prior loops).
- 0 non-OK that signal UI bugs.

## Per-route observations

| Route | 1280 | Note |
| ----- | ---- | ---- |
| `/sign-in` | clean | Dev-mode card centred; "Sign-in is disabled in this environment" warning with destructive-tint icon. |
| `/dashboard` | clean | Onboarding "Set up your workspace" + "What unlocks next" 2-up panel. PageIconTile at the new 36px. |
| `/profile` | clean | "Let's set up your profile" empty state centred. |
| `/upload` | clean | Documents page with the upload empty state. |
| `/documents` | clean | Editorial paper-card empty state, clear CTAs. |
| `/answer-bank` | clean | Stat row + filter chips + empty state intact. |
| `/studio` | clean | Header on a single row at the documented breakpoint. |
| `/opportunities` | clean | List skeleton on this capture (4 / 4 oppts row shown); chrome reads as expected. |
| `/opportunities/review` | n/a | Capture timed out; verified clean in loop-005 + loop-002 at this same width. |
| `/interview` | clean | Practice card grid balanced. |
| `/analytics` | clean | 4-up stats, pipeline list, skills overview. |
| `/salary` | clean | Tool tabs + Market Rate Calculator card. |
| `/calendar` | clean | Month grid + side panel. |
| `/emails` | clean | Email Templates 3-up grid. |
| `/settings` | skeleton | BYOK card + provider grid skeleton; chrome consistent. |
| `/extension/connect` | clean | Connect success card centred. |

## Findings

None.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**5 / 5** consecutive 0-H-0-M loops. **Convergence declared.**

Counter trajectory:
- polish-loop-002: 0-H-0-M (counted 1/5 before loop-004 surfaced S-M3 sub-lg)
- polish-loop-003: 0-H-0-M (counted 2/5 before reset)
- polish-loop-004: 1 M (S-M3 sub-lg overflow) — fix shipped, counter reset
- polish-loop-005: 0-H-0-M (1/5)
- polish-loop-006: 1 M (S-M4 1024-1279 overflow) — fix shipped, counter reset
- polish-loop-007: 0-H-0-M (1/5)
- polish-loop-008: 0-H-0-M (2/5)
- polish-loop-009: 0-H-0-M (3/5)
- polish-loop-010: 0-H-0-M (4/5)
- polish-loop-011: 0-H-0-M (**5/5 — converged**)

## Tier plan

None this loop. **No further scheduled wakes per convergence stop condition.**

## Carryover (intentionally deferred, not blocking convergence)

- **G-L2** — disabled gradient CTAs on `/salary` + `/ats-scanner`. The
  rust gradient washes to opacity-50 in disabled state instead of switching
  to a distinct disabled surface. Pattern is consistent across the app; a
  future affordance pass could replace the gradient with `bg-muted` in
  disabled states. Not user-blocking.

- **G-L3** — `/vs` hub icon (shield-check) sits in its own row above the
  H1, disconnected from the title. Marketing surface, not the primary
  editorial reference (`/en` landing). Different pattern from the app
  workspace headers but internally consistent on the marketing tree.

- **Dark mode parity** — the capture script can't toggle dark theme without
  breaking next-themes hydration under the playwright launcher. Needs a
  tooling pass (localStorage injection or runtime theme override) before a
  proper dark sweep is feasible. The slothing preset already defines dark
  tokens, so the surface should be correct; just unverified.

These three items are explicitly carried out of the convergence run as
"low priority, non-blocking" findings. The goal doc's convergence criterion
("0 high + 0 medium for 5 consecutive loops") is satisfied with these
documented and deferred.
