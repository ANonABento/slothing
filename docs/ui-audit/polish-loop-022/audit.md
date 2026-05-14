# polish-loop-022 — Audit

Import Job dialog + mobile dark mode parity.

## States exercised

| Flow | Result |
| ---- | ------ |
| `/opportunities` → Import dialog Paste tab | Clean. Tab row (Paste / URL / CSV); Job URL + Job Content textarea with multi-line placeholder; Cancel + Parse Job buttons. |
| Import dialog → CSV tab | Upload zone (cloud icon + "Click to upload CSV" + "or drag and drop"); "Expected columns:" helper card listing required vs optional. |
| `/dashboard` @ 375px in dark | Mobile header bar with hamburger + Slothing chip + page name. Dashboard H1 + onboarding step list readable on dark navy. |
| `/opportunities` @ 375px in dark | View toggle + Filters + Import + Add Opportunity (cream gradient pops). Filters panel below readable. |

## Findings

None.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**2 / 5** consecutive 0-H-0-M after loop-020's S-M7 fix.

## Tier plan

None this loop.

## Carryover unchanged

- G-L2 disabled gradient CTAs (re-saw the Parse Job button in disabled
  state with faded gradient).
- G-L3 `/vs` hub icon.
