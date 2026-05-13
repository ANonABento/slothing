# UI Audit Loop

Iterative desktop UI audit + fix loop for the Slothing web app and Slothing extension.

## Goal

Drive the desktop UI to a polished, consistent baseline at standard laptop and monitor widths. Each loop is one iteration of:

1. **Audit** — Playwright navigates every route at 1280 / 1440 / 1920 widths, captures screenshots, and inspects the rendered DOM. Findings are written to `loop-NNN/findings/<route>.md`.
2. **Plan** — `loop-NNN/summary.md` aggregates findings by severity and theme. Identifies cross-route patterns (DRY violations, non-shared components, inconsistent spacing tokens).
3. **Fix** — Implement high + medium fixes. Commit audit and fixes separately.
4. **Re-audit** — next loop confirms fixes and surfaces what's left.

Mobile is explicitly out of scope for this loop. A separate mobile audit lives in `docs/mobile-audit-2026-05-04/`.

## Scope

- **Iteration phase 1:** web app (`apps/web`) — marketing routes, auth, full app workspace
- **Iteration phase 2:** Slothing extension (`apps/extension`) — popup, options, content-script overlays

## Widths

| Width | Persona |
| ----- | ------- |
| 1280 | Standard 13–14" laptop. Most likely to surface cramped/overflow bugs. |
| 1440 | Modern laptop default (MacBook Pro 14"). Design-intent baseline. |
| 1920 | Full HD desktop / external monitor. Surfaces over-stretched layouts and missing max-widths. |

## Severity classification

- **High** — broken layout (overflow that hides content, overlapping interactive elements, unreadable text, broken CTA targets, console errors blocking render)
- **Medium** — inconsistent spacing/typography across pages, non-shared components doing the same thing differently, repeated DRY violations, awkward but functional layouts
- **Low** — micro-polish (1–2px alignment, color token nits, hover-state inconsistencies)

## Exit criteria

Loop terminates when one full audit pass surfaces **zero high** and **zero medium** findings. Hard cap of 8 iterations to bound cost.

## Conventions

- Audit MD files use **relative file paths from repo root** (e.g., `apps/web/src/app/[locale]/(app)/dashboard/page.tsx`) so they're greppable.
- Findings link to screenshot evidence: `![](../screenshots/<route-slug>-<width>.png)`.
- Cross-route patterns get their own `summary.md` section under "DRY / shared-component opportunities" — these are the highest-leverage fixes.
- Per-route findings use the template in `templates/findings-template.md`.

## Status

| Loop | Status | Findings (H/M/L) | Fixes shipped | Notes |
| ---- | ------ | ---------------- | ------------- | ----- |
| 001  | done | 29 / 100 / 46 | G-H1, G-H2, G-M1, A1, B1, B6 | First baseline pass — see `loop-001/summary.md` |

## Files

- `LOOP-RUNBOOK.md` — protocol every iteration follows (read this if you're picking up the loop)
- `routes.md` — route inventory with auth requirements + sample data needs
- `templates/findings-template.md` — per-route audit template
- `loop-NNN/screenshots/` — PNG screenshots per `<route-slug>-<width>.png`
- `loop-NNN/findings/<route-slug>.md` — per-route findings
- `loop-NNN/findings/_global.md` — cross-cutting framework / shared-component issues
- `loop-NNN/summary.md` — aggregated, prioritized fix list (Tier A / B / C)

## Reproducing locally

```bash
# In worktree root
cd .claude/worktrees/ui-audit-loop

# Dev server (auth bypass for unauthed access)
echo "SLOTHING_ALLOW_UNAUTHED_DEV=1" > apps/web/.env.local
PORT=3010 pnpm --filter @slothing/web dev
```
