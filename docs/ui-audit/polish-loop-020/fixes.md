# polish-loop-020 — Fixes

## S-M7 — Bulk delete dialog "1 selected entries"

**File:** `apps/web/src/components/bank/bulk-action-bar.tsx`

**Diff:**
```diff
  async function handleDelete() {
+   const isOne = selectedCount === 1;
    const confirmed = await confirm({
-     title: `Delete ${selectedCount} selected entries?`,
-     description:
-       "This permanently removes the selected profile bank entries. This cannot be undone.",
+     title: `Delete ${selectedCount} selected ${isOne ? "entry" : "entries"}?`,
+     description: `This permanently removes the selected profile bank ${
+       isOne ? "entry" : "entries"
+     }. This cannot be undone.`,
      confirmLabel: "Delete",
    });
```

**Why:** When the user selects exactly one entry and clicks Delete, the
dialog said "Delete 1 selected entries?" — grammatically wrong. CLAUDE.md
mandates `pluralize()` for counts, but this is a string interpolation in a
dialog title where the noun changes (entry/entries), so a conditional is
the natural fit.

## Verification

- `pnpm exec vitest run src/components/bank/bulk-action-bar.test.tsx` — 10
  tests pass (existing test asserts the count=3 plural form, unaffected).
- `pnpm --filter @slothing/web type-check` — clean.
- `pnpm --filter @slothing/web lint` — clean.
- Visual:
  - `bulk-delete-confirm-1440.png` — before ("1 selected entries").
  - `bulk-delete-confirm-after-1440.png` — after ("1 selected entry").
