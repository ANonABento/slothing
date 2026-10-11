# polish-loop-017 — Audit

Settings provider switch, Studio collapsed panels at 1440, mobile interview prep.

## States exercised

| Flow | Result |
| ---- | ------ |
| Settings → click OpenAI provider card | Selection moves to OpenAI inline (border + Selected pill); Ollama card loses selected state. No toast — inline update. Scrolling down reveals OpenAI Configuration card with API Key + Model + Test Connection + Save Settings buttons + "What AI Powers" rail. All polished. |
| Studio → collapse Files + AI panels | Both rails shrink to icon-only columns. Editor pane expands to ~600px+. "Select entries from your bank" preview displays with full reading width. |
| Interview Prep `/interview` @ 375px (mobile) | Display H1 wraps "Interview / Preparation" gracefully. Quick Practice + Difficulty/Questions/Timer controls stack appropriately. First job card (Frontend Engineer / Cool Co — the seeded data from loop-015) shows Text/Voice practice buttons and Prep Guide / Company Research links. |

## Findings

None.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**1 / 5** consecutive 0-H-0-M after loop-016's S-M6 fix.

## Tier plan

None this loop.

## Carryover unchanged

- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon.
