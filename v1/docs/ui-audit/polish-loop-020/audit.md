# polish-loop-020 — Audit

Bulk-action delete confirm dialog.

## Findings

### S-M7 [Medium] — Bulk delete confirm dialog ignores singular/plural
- **Where:** `apps/web/src/components/bank/bulk-action-bar.tsx:45-55`.
- **What:** When the user selects exactly one entry and clicks Delete in
  the bulk action bar, the confirm dialog reads "Delete 1 selected
  entries?" + "This permanently removes the selected profile bank
  entries. This cannot be undone." Both lines force the plural noun for
  every count.
- **Fix vector (Tier A, shipped):** Toggle the noun on `selectedCount === 1`
  in both the title and description. Test was already asserting the count=3
  plural form which is unaffected by the fix.
- **Verified:** `bulk-delete-confirm-after-1440.png` shows "Delete 1 selected
  entry?" + "removes the selected profile bank entry."

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 1 (S-M7) — fixed |
| Low      | 0     |

## Convergence counter

Was 3/5 going in. S-M7 fix resets to 0/5.

## Tier plan

**Tier A — shipped:** S-M7 bulk delete pluralization.

**Tier B/C:** none new.
