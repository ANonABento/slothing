# polish-loop-001 — Summary

## Headline

3 High + 2 Medium + 2 Low surfaced. All H + M landed; 1 L deferred to
polish-loop-002 (affordance polish bundle); 1 L is tooling, no action.

## What landed

| ID    | Severity | What | File |
| ----- | -------- | ---- | ---- |
| S-H1  | High     | `line-clamp-3` on opportunity row JD summary | `apps/web/src/app/[locale]/(app)/opportunities/page.tsx` |
| S-H2  | High     | Toast surface → solid `bg-card` + tinted ring | `apps/web/src/components/ui/toast.tsx` + test |
| S-H3  | High     | Studio save-status pill → `whitespace-nowrap` | `apps/web/src/components/studio/studio-header.tsx` |
| S-M1  | Medium   | Studio H1 → `whitespace-nowrap` + icon `shrink-0` | `apps/web/src/components/studio/studio-header.tsx` |
| S-M2  | Medium   | PageIconTile default size 40 → 36 | `apps/web/src/components/ui/page-layout.tsx` |

Plus tooling: `apps/web/scripts/ui-audit/capture.mjs` learned a `--prefix`
flag so the third audit loop can write to `polish-loop-NNN` without colliding
with the prior `loop-NNN` and `redesign-loop-NNN` directories.

## What's deferred

- **S-L1** — Studio AI panel "Rewrite section" select vs. icon button height.
  Pure affordance polish. Bundled with the polish-loop-002 sweep.
- **G-L1** — capture script races with dev hot-reload. Tooling, not user-facing.

## CI gate

- `pnpm --filter @slothing/web type-check` — green
- `pnpm --filter @slothing/web lint` — green (pre-existing warnings only)
- `pnpm --filter @slothing/web test:run` — 3584 passed / 1 skipped (unchanged)

Pushes go directly to `main`. CI on push is the only gate. If CI goes red on
the post-push run, fix-forward in polish-loop-002.

## Exit-criteria check

Convergence requires **5 consecutive loops with 0 H + 0 M**. This loop closed
with H=3, M=2 (now resolved) → **continue**. Convergence counter resets to 0.

## What to look at next

`polish-loop-002` target list (subject to capture findings):
1. Re-capture all routes — verify the 5 starting-evidence fixes look right at
   1280/1440/1920 and at data-populated state.
2. Cross-cutting affordance polish — hover states on PagePanel rows, focus
   rings on interactive cards, badge/pill consistency between list and kanban
   views.
3. Empty-state alignment for /interview, /calendar, /analytics, /salary
   (already polished from the redesign loops but worth a confirm pass).
4. Dark mode parity sweep — toggle into `.dark` and re-screenshot. The
   redesign loops deferred this because of next-themes hydration issues; pick
   it up here if the runtime allows.
5. S-L1 — AI panel Rewrite-section row alignment.
