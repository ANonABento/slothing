# polish-loop-014 — Audit (dark-mode dogfood)

Long-deferred dark-mode parity sweep. The capture script can't easily toggle
the theme, but injecting `localStorage.setItem("theme-dark", "true")` via
Playwright MCP `browser_evaluate` triggers the preload script's dark branch
on the next navigation.

## Capture summary

- Set `theme-dark=true` in localStorage, reloaded, then captured 5 routes:
  `/dashboard`, `/opportunities`, `/studio` (Resume + Cover Letter), `/sign-in`,
  `/settings`, `/analytics`. All at 1440×900.
- localStorage reset at the end of the loop so the dev environment is back to
  light-default for the next session.

## Per-route observations (dark)

| Route | Dark | Note |
| ----- | ---- | ---- |
| `/dashboard` | clean | Onboarding card + "What unlocks next" panel render on dark navy surface; rust accents on "Upload your resume" Recommended pill retain visibility. |
| `/opportunities` | clean | Filters drawer, list rows, status pills, JD line-clamp all readable. Tech-stack chips (python, rust, api) use warning-tinted backgrounds that pop nicely against dark. |
| `/studio` (Resume) | clean | Resume preview correctly stays on `bg-paper` (always cream — paper is paper regardless of theme). AI panel, file list, sections, version history all readable. |
| `/studio` (Cover Letter) | clean | polish-loop-012 toolbar wrap fix verified in dark — Text group wraps to two rows inside the pill, Color + Highlight selects visible. |
| `/sign-in` | clean | "Continue to dashboard (dev mode)" button uses inverted cream background with dark text — pops against dark navy. Warning icon retains destructive tint. |
| `/settings` | clean | BYOK 3-up benefit row + AI Provider 2-up grid hold on dark. "Selected" pill on Ollama uses dark surface with success-tinted dot — readable. |
| `/analytics` | clean | 4 stat tiles use rust-tinted accent icons over dark surface; pipeline + skills overview readable. Skill gap chips (Go, Typescript, Python, Rust, Api) use warning tint, readable. |

## Findings

None. The slothing preset's dark token set (defined in
`src/lib/theme/presets/slothing.ts` and surfaced via `globals.css`) holds
across every surface I tested. Editorial paper cards correctly stay
light-cream for document previews (intentional — paper-is-paper).

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**2 / 5** consecutive 0-H-0-M loops after loop-012's S-M5 fix.

## Tier plan

None this loop.

## Carryover updated

- G-L2 disabled gradient CTAs — still deferred.
- G-L3 `/vs` hub icon — still deferred.
- ~~Dark-mode parity~~ — **VERIFIED CLEAN this loop.** Slothing dark preset
  is good across the workspace. No further parity work needed on the current
  surface set.
