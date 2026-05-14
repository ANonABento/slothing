# polish-loop-006 — Fixes

## S-M4 — Studio header still crowded at 1100px after loop-004 fix

**File:** `apps/web/src/components/studio/studio-header.tsx`

**Diff:**
```diff
- <div className="flex flex-wrap items-center gap-3 border-b-[length:var(--border-width)] bg-background/95 px-4 py-3 [backdrop-filter:var(--backdrop-blur)] md:px-6 lg:flex-nowrap">
+ <div className="flex flex-wrap items-center gap-3 border-b-[length:var(--border-width)] bg-background/95 px-4 py-3 [backdrop-filter:var(--backdrop-blur)] md:px-6 xl:flex-nowrap">
```

**Why:** Loop-004 picked `lg` (1024px) as the no-wrap breakpoint, but the
right rail (Template + Export + helper text + Save pill + panel-right) takes
~500px of horizontal real estate. At 1100px the row was still too cramped and
"Cover Letter" got clipped behind Template. `xl` (1280px) is the right
threshold — matches the size where the layout was originally designed to
single-row and has consistent breathing room across the rest of the studio
chrome.

## Verification

- `pnpm exec vitest run src/components/studio/studio-header.test.tsx` — 15
  tests pass.
- Visual:
  - `studio-1100.png` — before fix (clipping evidence).
  - `studio-1100-after.png` — after fix, header on two rows, both tabs intact.
  - `studio-1280-after.png` — confirms 1280 still single-row.
