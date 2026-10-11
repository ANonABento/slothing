# polish-loop-004 — Fixes

## S-M3 — Studio header overflows below `lg` viewports

**File:** `apps/web/src/components/studio/studio-header.tsx`

**Diff (3 changes in one file):**

```diff
- <div className="flex flex-wrap items-center gap-3 border-b-[length:var(--border-width)] bg-background/95 px-4 py-3 [backdrop-filter:var(--backdrop-blur)] md:flex-nowrap md:px-6">
+ <div className="flex flex-wrap items-center gap-3 border-b-[length:var(--border-width)] bg-background/95 px-4 py-3 [backdrop-filter:var(--backdrop-blur)] md:px-6 lg:flex-nowrap">
```

```diff
- <FileText className="h-5 w-5 shrink-0 text-primary" />
- <div className="min-w-0">
-   <h1 className="whitespace-nowrap font-display text-lg font-semibold leading-tight tracking-tight">
+ <FileText className="h-5 w-5 shrink-0 text-primary" />
+ <div className="min-w-0 flex-1 md:flex-none">
+   <h1 className="truncate font-display text-lg font-semibold leading-tight tracking-tight">
    Document Studio
  </h1>
</div>
```

```diff
- <div className="flex rounded-[var(--radius)] border-[length:var(--border-width)] bg-card">
+ <div className="flex shrink-0 rounded-[var(--radius)] border-[length:var(--border-width)] bg-card">
    {DOCUMENT_MODE_OPTIONS.map(({ mode, label }) => (
      <button
        ...
        className={cn(
-         "min-h-11 px-3 py-2 text-sm font-medium transition-colors",
+         "min-h-11 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors",
          ...
```

**Why:** Polish-loop-001's S-M1 fix gave the H1 `whitespace-nowrap` but left
the surrounding container too rigid (`md:flex-nowrap` from 768px upward). At
900px the H1 overflowed its allocation and ended up *behind* the Resume tab,
and the "Cover Letter" label still wrapped to two lines. Switching the outer
container's "no wrap" breakpoint from `md` to `lg` lets the header bleed into
two rows below 1024px instead of crowding the title row; `truncate` on the H1
gracefully handles the ever-narrower case; tab buttons get `whitespace-nowrap`
to keep "Cover Letter" intact; the tab group gets `shrink-0` so it doesn't
get compressed when the H1 expands.

## Verification

- `pnpm exec vitest run src/components/studio/` — 74 tests pass.
- `pnpm --filter @slothing/web type-check` — clean.
- `pnpm --filter @slothing/web lint` — clean (pre-existing react-hooks
  warnings only).
- Visual:
  - `studio-900.png` — before fix (regression evidence).
  - `studio-900-after.png` — after fix at the same viewport. Header now
    flows to two rows; both tabs visible; H1 intact; save-status pill
    on one line.
  - `studio-1280-after.png` — confirms no regression at the documented
    breakpoint.
