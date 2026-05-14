# polish-loop-018 — Audit

API key flow + Pattern A confirm dialog.

## States exercised

| Flow | Result |
| ---- | ------ |
| Settings → switch to OpenAI → fill fake API key → Test Connection | Clean error pill surfaces inline: "Connection failed. Check your API key and settings." with destructive ✕ icon. Save Settings button still active for retry. |
| Studio → Files panel → Delete Resume (Pattern A) | Confirm dialog opens: "Delete this studio file?" title + body explaining permanence, Cancel (outline) + Delete (destructive solid) buttons. Editorial card on dimmed background. Matches `docs/destructive-actions-pattern.md` Pattern A spec exactly. |

## Findings

None.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**2 / 5** consecutive 0-H-0-M after loop-016's S-M6 fix.

## Tier plan

None this loop.

## Carryover unchanged

- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon.
