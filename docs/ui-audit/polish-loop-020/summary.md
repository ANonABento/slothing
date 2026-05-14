# polish-loop-020 — Summary

## Headline

**1 Medium found + fixed (S-M7).** Bulk delete confirm dialog said
"Delete 1 selected entries?" for any count, including 1. Toggled the
noun on `selectedCount === 1` so it reads "entry" / "entries" correctly.

## Convergence counter

Reset to **0 / 5** after S-M7 fix.

## What landed

- `docs/ui-audit/polish-loop-020/audit.md`, `fixes.md`, `summary.md`
- `docs/ui-audit/polish-loop-020/screenshots/` — 2 PNGs
- `apps/web/src/components/bank/bulk-action-bar.tsx` — singular/plural fix

## Carryover unchanged

- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon.

## What to look at next

If continuing:
1. Other confirm dialogs likely have similar pluralization gaps. Grep for
   `selectedCount} selected` and similar patterns.
2. Dark-mode rerun of the confirm dialog fix.
3. Studio file rename (double-click) flow.
