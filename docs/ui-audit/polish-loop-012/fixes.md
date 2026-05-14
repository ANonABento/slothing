# polish-loop-012 — Fixes

## S-M5 — Cover Letter editor ToolbarGroup overflow

**File:** `apps/web/src/components/studio/editor-toolbar.tsx`

**Diff:**
```diff
- <div className="flex items-center gap-1 rounded-md border bg-card p-1">
+ <div className="flex flex-wrap items-center gap-1 rounded-md border bg-card p-1">
```

**Why:** The outer toolbar uses `flex flex-wrap` so groups (`Text`,
`Paragraph`, `Insert`, `History`) wrap at the group boundary. But within
a group, items had no wrap — so the long Text group (label + 6 buttons +
4 selects) overflowed past the visible right edge of the pill when the
editor pane was constrained between Files + AI panels at 1440px.

`flex-wrap` on the group pill itself lets items inside the same group
flow to a second internal row, keeping every control visible without
adding overflow scrollbars or hiding controls in a "more" menu.

## Verification

- `pnpm exec vitest run src/components/studio/` — 74 tests pass.
- `pnpm --filter @slothing/web type-check` — clean.
- `pnpm --filter @slothing/web lint` — clean (pre-existing warnings only).
- Visual:
  - `studio-cover-letter-1440.png` — before (Color/Highlight clipped).
  - `studio-cover-letter-1440-after.png` — after (Text group wraps to two
    rows inside the pill; Color + Highlight visible).
