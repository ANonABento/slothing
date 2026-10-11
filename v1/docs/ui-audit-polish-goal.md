# UI Polish Audit Loop — Goal

You're picking up where I left off. PR #271 (editorial design system + marketing landing rebuild) shipped to `main`, followed by `redesign-loop-001` through `redesign-loop-008` polish passes. Now there's a fresh batch of UI issues visible in the app workspace and the user wants a long-running iterative audit loop to grind them down until convergence.

## North-star goal

Every page in the authenticated Slothing app workspace looks as polished as the marketing landing at `/en`: same editorial calm, paper-and-ink restraint, typographic care, no broken interactions, no overlapping affordances, no walls of un-truncated text. Loop until five consecutive loops report nothing meaningful to fix.

## Mode

- **Branch:** `main`. Commit and push directly. There is no PR gate this round — CI on push to main is the only gate, and it must stay green.
- **Scope:** whole app, broad sweep. Cover every in-scope route across loops; don't focus only on the screenshotted starting evidence.
- **Termination:** until convergence — five consecutive loops where the audit pass shows **0 high + 0 medium** findings. No hard loop cap; let it run as long as it's productive.

## Starting evidence (Loop-001 input)

The user captured the following screenshots at the repo root before this loop kicked off. Move them into `docs/ui-audit/polish-loop-001/screenshots/_starting-evidence/` as the seed for loop-001's audit:

- `dashboard.jpeg` — `/dashboard` after onboarding setup card.
- `opportunities.jpeg` — `/opportunities` with two **overlapping, stacked error toasts** ("Could not load kanban lane settings" and "Could not load opportunities"). Toast stacking + dev-env error surfacing are both wrong here.
- `opportunities-fixed.jpeg` — `/opportunities` with real data, showing a job card whose body renders the **entire JD as an un-truncated wall of text**. Card readability is broken.
- `studio.jpeg` — `/studio` with the **"Saved Just now" pill wrapping to two lines**, the Document Studio title also wrapping awkwardly at 1280px, and a tiny right-rail edit button misaligned next to the section dropdown.
- `landing-en-light.jpeg` — `/en` marketing landing. **This is the visual reference, not a target.**

Confirmed real issues from those screenshots that loop-001 should at minimum address:

1. **Toast stacking on `/opportunities`** — two destructive toasts overlap each other instead of stacking vertically. Whatever is rendering them is broken.
2. **JD truncation on opportunity cards** — un-truncated descriptions blow card height. Need a line-clamp + "Read more" or detail-page hand-off.
3. **Studio save-status pill** — wraps to two lines at the 1280px viewport. Needs a single-line pill (smaller copy, narrower padding, or move it).
4. **Studio header crowding** — "Document Studio" title wraps; Resume/Cover Letter tab + Template picker + Export + Save status all compete for the same row.
5. **Dashboard title oversized home icon** — the `<Home>` glyph next to the H1 reads as outsized; check alignment and weight.

Loop-001 must include before/after screenshots for the four pages above plus whatever additional routes get audited in the same loop.

## Where the convention lives

This is the **third** UI audit loop on this repo. Don't re-invent — read these first, in order:

1. `docs/ui-audit/LOOP-RUNBOOK.md` — single source of truth runbook. Top-to-bottom step-by-step.
2. `docs/ui-audit/routes.md` — full route inventory with slugs and notes.
3. `apps/web/scripts/ui-audit/capture.mjs` — automated 75-frame screenshot capture. `--next` auto-detects the next loop number; `--loop NNN` overwrites a specific loop.
4. `docs/ui-redesign-audit-goal.md` — the prior `redesign-loop-NNN` goal. Same general shape; this one adjusts mode + termination.
5. `docs/ui-audit/redesign-loop-008/summary.md` — what the previous loop concluded was clean; treat as a baseline of what was already good.
6. `CLAUDE.md` — project conventions you must follow (semantic tokens only, destructive-actions pattern, pluralize, TimeAgo, no `bg-white`/`bg-black`/`text-gray-*`).
7. `.design-ref/README.md` + `apps/web/src/app/globals.css` — the editorial design system tokens.

## Loop cadence

This loop's per-iteration directory is `docs/ui-audit/polish-loop-NNN/` — new prefix so it doesn't collide with `loop-NNN` (the first audit loop) or `redesign-loop-NNN` (the second). Structure mirrors the runbook:

```
docs/ui-audit/polish-loop-NNN/
├── audit.md          ← what you captured, findings ranked H/M/L
├── fixes.md          ← what changed, why, before/after notes
├── screenshots/      ← before + after pairs
└── summary.md        ← close-out + what's next + H+M count
```

### Per-loop phases (follow `LOOP-RUNBOOK.md`)

**1. Capture** — `node apps/web/scripts/ui-audit/capture.mjs --next`. 75 frames, two viewports, console errors. If `/opportunities` is currently erroring out in dev (per the starting evidence), triage in `audit.md` whether it's a real bug or dev-env data noise. The runbook explicitly says dev-env 500s are out of scope — but **toast-stacking is a UI bug regardless of root cause**.

**2. Audit** — Aggregate findings into `audit.md`, ranked High / Medium / Low. Use the rubric in the prior `ui-redesign-audit-goal.md`:

- Typography rhythm (display font on H1/H2, body line-height, mono captions)
- Surface hierarchy (paper cards on page bg, not page bg on page bg)
- Accent restraint (rust = emphasis, not body)
- Spacing (consistent gutters, 22/28px card padding)
- Affordance polish (hover, focus rings, icon alignment, badge/pill consistency, toast stacking)
- Dark-mode parity (toggle to dark, re-screenshot, look for unreadable contrast)
- Information density (line-clamp on long bodies, no walls of text inside cards)
- Interaction integrity (no overlapping affordances, no broken empty states)

**3. Fix** — Implement Tier A (High) + Tier B (Medium) findings. Minimum-diff fixes:

- Edit a single CSS class or token reference.
- Tweak a CVA variant on an existing primitive.
- Add a small semantic Tailwind utility (don't rename existing ones).

Avoid:

- Rewriting whole components.
- Touching `globals.css` tokens (settled).
- Adding new dependencies.
- Editing the marketing landing — that's the reference.

Hard rules:

- No `bg-white`, `bg-black`, `text-gray-*`, hex inline styles. `scripts/forbidden-color-lint.cjs` is a CI fail.
- Destructive actions get confirm-dialog or undo-snackbar (`docs/destructive-actions-pattern.md`).
- `pluralize()` for counts; `<TimeAgo />` for relative times.
- Pre-commit hook runs lint-staged + type-check. **Never `--no-verify`** — per `feedback_precommit_hook_can_wipe_working_tree.md`, that hook has wiped working trees before. Fix the underlying error.

**4. Verify** — After fixes:

```bash
pnpm --filter @slothing/web type-check
pnpm --filter @slothing/web lint
pnpm --filter @slothing/web test:run
```

If a Vitest snapshot breaks and the new visual is correct, `pnpm exec vitest -u <file>` and explain in the commit message. If it's wrong, revert. Re-capture the changed routes and drop after-shots next to the before-shots.

**5. Commit + push** — Two commits per loop:

```bash
git add docs/ui-audit/polish-loop-NNN/
git commit -m "docs(ui-audit): polish-loop-NNN audit pass"

git add -u
git commit -m "fix(ui-audit): polish-loop-NNN cross-cutting fixes"

git push origin main
```

Push goes to `main` directly. CI will run on push; if it fails, fix forward in the next loop or revert the bad commit before scheduling another loop.

**6. Close out** — Write `summary.md` with: H+M count, what landed, what's deferred, what to look at next. Then schedule the next loop.

## When to use the `frontend-design` skill

Invoke `frontend-design` when designing something **new** — a missing empty state, a richer card body, a polished form layout. Don't invoke it for routine fixes (spacing tweak, icon swap). Feed it the editorial tokens (`bg-paper`, `text-ink-2`, `border-rule`, `text-brand`, `shadow-paper-card`) so it doesn't generate inline hex.

## Scope guardrails

**In scope:**

- All app-workspace routes: `/dashboard`, `/studio`, `/opportunities`, `/opportunities/review`, `/opportunities/[id]`, `/bank`, `/answer-bank`, `/interview`, `/calendar`, `/emails`, `/analytics`, `/salary`, `/settings`, `/profile`, `/upload`, `/documents`.
- Auth surfaces: `/sign-in`.
- Cross-cutting primitives: sidebar, top-nav, command palette, toast/dialog/confirm primitives, error states, empty states, onboarding banners.
- Both light and dark themes at 1280px **and** 1920px viewport.

**Out of scope (do not touch):**

- Marketing landing at `/en` and `src/components/landing/*` — that's the visual reference.
- Theme preset HSL values in `apps/web/src/lib/theme/presets/slothing.ts`.
- Editorial tokens in `apps/web/src/app/globals.css`.
- Font loading in `[locale]/layout.tsx`.
- Tailwind config token **names** (you can add new utilities; don't rename existing ones).
- Translation drift in `apps/web/src/messages/*.json` (different workstream).
- Dev-environment 500s from missing API keys (dogfood loop owns those — see `docs/audits/dogfood-2026-05-13/`).

## Convergence criteria

Stop the loop when **any** of these are true, in priority order:

1. **Five consecutive loops** each report **0 high + 0 medium** findings in `audit.md`. Declare convergence in the latest `summary.md`.
2. CI on `main` red and the same red signature persists for two loops despite fix-forward attempts. Stop and escalate.
3. Pre-commit hook fails three times in a row in one iteration. Stop, document the blocker, escalate.
4. User explicitly says to stop.

There is **no hard loop cap** this round. The prior `redesign-loop` capped at 8; this one runs until quiet.

## Scheduling between loops

After committing + pushing a loop, schedule the next wake via the `loop` skill or `ScheduleWakeup`:

- Default delay: **1800s** (30 min) — you just finished work, no need to thrash the cache.
- If CI is in flight when you'd otherwise sleep, set the delay to **270s** twice (stays inside the prompt-cache TTL) to monitor that one specific run.
- Pass the same loop prompt verbatim each turn.

Reason string should be specific: "convergence audit — polish-loop-007 pending CI check before next capture" beats "next loop".

## Loop-zero deliverable

Before the first audit pass, write `docs/ui-audit/polish-loop-000/plan.md` with:

1. **Reading-list summary** — what's in the editorial system, what tokens to use, what's already polished from the two prior audit loops. Cross-reference `redesign-loop-008/summary.md` so you don't re-fix what's already been fixed.
2. **Starting-evidence triage** — for each of the 5 screenshots above, restate the issue, classify H/M/L, and note your intended fix vector.
3. **Loop plan** — routes you intend to cover in `polish-loop-001` through `polish-loop-004` (rough; subject to change based on capture findings).
4. **Convergence signal** — restate "I'll declare convergence after 5 consecutive 0-H-0-M loops" so future-you in a fresh session knows the bar.

Then start `polish-loop-001`. Don't ask for confirmation between loops — just keep going until convergence.

Good luck.
