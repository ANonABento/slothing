# polish-loop-021 — Audit (pluralization hunt + Studio rename)

After polish-loop-020 found S-M7, swept the codebase for similar patterns
and verified the Studio file rename flow.

## Hunt: ${count} ${plural-only-noun} patterns

Searched:
- `grep -rEn '\$\{[a-zA-Z._]+\} (entries|items|files|documents|chunks|sessions|...)'`
- All `useConfirmDialog` usages inspected for count interpolation
- Toast titles with `selectedIds.size`

Findings:
- All other confirm dialogs use plain singular nouns ("Delete this answer?",
  "Delete this notification?", etc.) — no plural-only fallback at count=1.
- One toast already handles plural correctly: `Deleted ${selectedIds.size}
  selected component${selectedIds.size === 1 ? "" : "s"}` in
  `bank/page.tsx:877`.
- Messages catalog uses ICU plural syntax (`{count, plural, one {...} other
  {...}}`) for all count-dependent strings.
- Only the bulk-action-bar had the issue → fixed in loop-020.

## States exercised

| Flow | Result |
| ---- | ------ |
| Studio Files panel → double-click "Resume" filename | Rename input appears with focus ring; trash icon visible alongside input. Clean Pattern. |

## Findings

None.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**1 / 5** consecutive 0-H-0-M after loop-020's S-M7 fix.

## Tier plan

None this loop.

## Carryover unchanged

- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon.
