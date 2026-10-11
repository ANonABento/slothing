# UI Redesign Audit Loop — Goal

You're picking up where I left off. PR #271 just landed Slothing's new editorial design system foundation + the rebuilt marketing landing page. Your job is to run a long-running iterative visual-audit loop that polishes the rest of the app on top of that foundation. Use the frontend-design skill to inform your visual judgment.

## North-star goal

Make every page in the Slothing web app look as visually polished as the new marketing landing at `/en` — same editorial calm, same paper-and-ink restraint, same typographic care — across `/dashboard`, `/studio`, `/opportunities`, `/bank`, `/interview`, `/calendar`, `/emails`, `/analytics`, `/salary`, `/settings`, `/profile`, `/sign-in`, and any sub-routes you find. Iterate. Audit, fix, screenshot, repeat. Don't stop after one pass — each loop should leave the app noticeably better than the last.

## Where to start

1. **Branch:** `feat/ui-redesign` (PR #271). Work on this branch. Push commits as you go so the PR updates in place.
2. **Worktree:** if you're spinning up a new worktree, the setup gotchas are in `docs/ui-redesign-plan.md` (symlink `.env.local` and `.local.db` from main, otherwise auth + the SQLite DB will be broken).
3. **Dev server:** `pnpm --filter @slothing/web dev` (port 3000). Use `pnpm install` first if dependencies aren't installed.
4. **Read first, in this order:**
   - `docs/ui-redesign-plan.md` — the plan, decisions log, drift gates, and what's deliberately out of scope.
   - `.design-ref/README.md` — Kev's editorial design system handoff (cream paper / Midnight Indigo, accent system, radii, fonts, motion). This is the visual north star.
   - `.design-ref/index.html` + `.design-ref/styles-v2.css` — the high-fi prototype to compare against.
   - `CLAUDE.md` — the project conventions you must follow (semantic tokens only, destructive-actions pattern, pluralize/TimeAgo helpers, etc.).
   - `apps/web/src/app/globals.css` and `apps/web/tailwind.config.ts` — the token system you'll be styling against.
   - `apps/web/src/lib/theme/presets/slothing.ts` — the active theme preset whose HSL values back `bg-card`, `bg-primary`, etc.
   - Look at the four screenshots in `docs/ui-redesign/screenshots/` to see the polish bar.
   - Look at how the prior `worktree-ui-audit-loop` ran (PR #269, `docs/ui-audit/loop-NNN/` folders on main) — that's the proven cadence you're replicating.

## Loop cadence

Each iteration is one numbered loop. Spend roughly 30–60 minutes per loop and aim to ship a real diff each time. Create `docs/ui-audit/redesign-loop-NNN/` and follow this structure (mirrors the prior audit-loop convention):

```
docs/ui-audit/redesign-loop-001/
├── audit.md          ← what you looked at, what's broken/ugly, ranked
├── fixes.md          ← what you changed, why, before/after notes
├── screenshots/      ← page screenshots for the loop (before + after pairs)
└── summary.md        ← one-paragraph close-out + what's next
```

### Single loop = three phases

**1. Audit** — Pick 2–4 routes you haven't deeply audited yet (or known weak spots). Take screenshots via Playwright MCP at 1280px + 1920px viewport. Score each page on:

- Typography rhythm (display font on H1/H2, body line-height, mono captions where they belong)
- Surface hierarchy (paper cards on page bg, not page bg on page bg; subtle shadows where Kev called them out)
- Accent restraint (rust shouldn't be loud everywhere — it's emphasis, not body)
- Spacing (consistent gutters, 22/28px card padding, no cramped or floppy regions)
- Affordance polish (hover states, focus rings, icon-with-text alignment, badge/pill consistency)
- Dark-mode parity (toggle to dark, re-screenshot, look for things that read poorly on Midnight Indigo)

Capture findings as a ranked list in `audit.md`. Be specific: "/studio save-status pill is too small and sits in the wrong place at 1280px" beats "studio header needs work".

**2. Fix** — Implement the 3–6 highest-leverage findings from the audit. Constraint: **minimum-diff fixes**. Prefer:

- Editing a single CSS class or token reference
- Adding a small semantic Tailwind variant
- Tweaking a CVA variant on an existing shadcn primitive

Avoid:

- Rewriting whole components
- Touching `globals.css` tokens (they're settled — if you think a token needs to change, file it in `audit.md` and skip)
- Adding new dependencies
- Editing the marketing landing (that's the reference, not a target)

**Hard rules:** No `bg-white`, `bg-black`, `text-gray-*`, hex inline styles (forbidden-color lint will fail CI). Use `bg-page`/`bg-paper`/`text-ink`/`-2`/`-3`/`border-rule`/`text-brand` and friends. Destructive actions still need confirm-dialog or undo-snackbar per `docs/destructive-actions-pattern.md`. Pluralize via `pluralize()`, times via `<TimeAgo />`.

**3. Verify + close out** — Run drift gates after every fix bundle:

```bash
pnpm --filter @slothing/web type-check
pnpm --filter @slothing/web lint
pnpm --filter @slothing/web test:run
```

If any test snapshot breaks, decide: is the new visual correct? If yes, `pnpm exec vitest -u <file>` and explain in the commit message. If no, revert. Re-screenshot the same routes you audited and drop "after" shots next to the "before" shots. Write `summary.md` with: what landed, what didn't, what to look at next loop. Commit with a `fix(ui-audit): loop NNN <subject>` message. Push so the PR updates.

## When to use the frontend-design skill

Invoke `frontend-design` when you're designing something new — a missing empty state, a new card pattern, a richer card body, a polished form layout. Don't invoke it for routine fixes (a spacing tweak, an icon swap). The skill is for when you need a fresh visual idea inside the established editorial system. Always feed it the established token names (`bg-paper`, `text-ink-2`, `border-rule`, `text-brand`, `shadow-paper-card`, etc.) so it doesn't generate inline hex or generic shadcn defaults.

## Scope guardrails

- **In scope:** `/dashboard`, `/studio`, `/opportunities`, `/opportunities/review`, `/opportunities/[id]`, `/bank`, `/interview`, `/calendar`, `/emails`, `/analytics`, `/salary`, `/settings`, `/profile`, `/sign-in`, `/upload`, sidebar, top-nav inside the app, command palette, toast/dialog/confirm primitives, error states, empty states, onboarding banners.
- **Out of scope (don't touch):** the marketing landing at `/en` and its components under `src/components/landing/`. The theme preset HSL values in `slothing.ts`. The `globals.css` editorial tokens. The font loading in `[locale]/layout.tsx`. The Tailwind config token names (you can add new utilities; don't rename existing ones).
- **Don't merge** — keep pushing fixes to `feat/ui-redesign` so the PR stays open and reviewable. The user merges manually when they decide it's ready.

## Termination conditions

Stop the loop when any of these are true:

- Five consecutive loops report nothing meaningful to fix in `audit.md` (the app has reached editorial parity with the landing).
- The user explicitly says to stop.
- A loop's gates can't be made green and you've tried twice — pause, document the blocker in the latest `summary.md`, and ask the user.

Otherwise: kick off the next loop. Aim for at least 8 loops over the long-running session — that's roughly the volume the previous `worktree-ui-audit-loop` ran (loops 001–008).

## Loop-zero deliverable

Before the first audit loop, write `docs/ui-audit/redesign-loop-000/plan.md` with:

1. Your reading-list summary — what's in the editorial system, what tokens to use, what's already polished.
2. The routes you intend to cover in loops 001–004 (rough plan; subject to change).
3. Your screenshot capture protocol (viewport sizes, browser, themes).
4. Your stop signal ("I'll declare the loop done when X").

Then start loop-001. Don't ask for confirmation between loops — just keep going.

Good luck.
