# polish-loop-001 — Fixes

All Tier A items landed; Tier B + C deferred.

## S-H1 — Opportunity list JD wall-of-text

**File:** `apps/web/src/app/[locale]/(app)/opportunities/page.tsx`

**Diff:**
```diff
- <p className="max-w-prose text-sm leading-6 text-muted-foreground">
+ <p className="line-clamp-3 max-w-prose text-sm leading-6 text-muted-foreground">
    {opportunity.summary}
  </p>
```

**Why:** Long summaries blew the card vertically. Detail page handles the full
JD — the card title already links there (`/opportunities/[id]`).

**Verification:** Captured `opportunities-1280.png` post-fix. The list state was
empty during capture (no seeded opportunities), so the line-clamp is verified by
inspection rather than visual evidence here; will appear in subsequent loops
once the user has seeded data. Code path matches `JobCard` (kanban view) which
already clamps.

## S-H2 — Toast surface bleed-through

**File:** `apps/web/src/components/ui/toast.tsx` (+ test fixture)

**Diff:**
```diff
- success: "border-success/50 bg-success/10 text-success",
- error: "border-destructive/50 bg-destructive/10 text-destructive",
- warning: "border-warning/50 bg-warning/10 text-warning",
- info: "border-info/50 bg-info/10 text-info",
+ success: "border-success/40 bg-card text-success",
+ error: "border-destructive/40 bg-card text-destructive",
+ warning: "border-warning/40 bg-card text-warning",
+ info: "border-info/40 bg-card text-info",
```

(Test file `toast.test.tsx` was updated to assert the new classes.)

**Why:** 10% alpha tinted surfaces let page content show through, producing the
"overlapping toasts" appearance even when the container correctly stacks
(`flex flex-col gap-2`). Solid `bg-card` with a softer tint ring keeps the
severity signal via icon + text colour while restoring readability and the
editorial paper-card surface.

**Verification:** `pnpm exec vitest run src/components/ui/toast.test.tsx` → all
12 tests pass after fixture update.

## S-H3 — Studio save-status pill nowrap

**File:** `apps/web/src/components/studio/studio-header.tsx`

**Diff:**
```diff
- "inline-flex min-h-8 items-center gap-1.5 rounded-[var(--radius)] border-[length:var(--border-width)] px-2 py-1 text-xs font-medium text-muted-foreground",
+ "inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius)] border-[length:var(--border-width)] px-2 py-1 text-xs font-medium text-muted-foreground",
```

**Why:** At narrow viewports the pill was wrapping ("Saved Just" / "now").
`whitespace-nowrap` keeps it on one line; the surrounding header is already
flex-wrap-friendly so the pill is allowed to bump to a fresh row instead.

## S-M1 — Studio H1 nowrap

**File:** `apps/web/src/components/studio/studio-header.tsx`

**Diff:**
```diff
- <FileText className="h-5 w-5 text-primary" />
- <div className="min-w-0">
-   <h1 className="font-display text-lg font-semibold leading-tight tracking-tight">
+ <FileText className="h-5 w-5 shrink-0 text-primary" />
+ <div className="min-w-0">
+   <h1 className="whitespace-nowrap font-display text-lg font-semibold leading-tight tracking-tight">
    Document Studio
  </h1>
```

**Why:** Same root cause as S-H3. `shrink-0` on the icon prevents it from
squeezing when the title becomes the flex's largest element; `whitespace-nowrap`
keeps "Document Studio" intact.

## S-M2 — PageIconTile size shrink

**File:** `apps/web/src/components/ui/page-layout.tsx`

**Diff:**
```diff
- size === "sm" ? "h-9 w-9" : "h-10 w-10",
+ size === "sm" ? "h-8 w-8" : "h-9 w-9",
```

**Why:** The default tile sat at 40×40 with a 20×20 glyph next to display-font
H1s — visually outweighing short titles like "Dashboard" or "Bank". The new
36×36 tile keeps the glyph at 20×20, increasing internal padding and reading as
quieter. Same primitive runs across every `PageHeader` so the win compounds.

**Verification:** Captured `dashboard-1280.png` and `opportunities-1280.png`
post-fix; the icon now reads as secondary to the H1 instead of competing.

## Tests + lint + type-check status

- `pnpm --filter @slothing/web type-check` — clean.
- `pnpm --filter @slothing/web lint` — clean (only pre-existing
  react-hooks/exhaustive-deps warnings unrelated to this loop).
- `pnpm --filter @slothing/web test:run` — 3584 passed, 1 skipped (unchanged
  from baseline).

## Other touched files

- `apps/web/scripts/ui-audit/capture.mjs` — added `--prefix` flag so the script
  can write to `polish-loop-NNN` instead of `loop-NNN`. `--next` now detects
  next iteration by prefix. Console log updated to reflect the directory name.
