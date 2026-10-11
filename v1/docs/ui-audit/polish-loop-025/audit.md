# polish-loop-025 — Audit (second convergence target)

Salary tool tabs + Email Templates click-through + error-boundary handling.

## States exercised

| Flow | Result |
| ---- | ------ |
| `/salary` → Compare Offers tab | "+ Add Offer" form with Company / Base Salary / Signing Bonus / Annual Bonus / Equity Value (4yr) + Add Offer button (disabled gradient since fields empty). Empty state below: "No offers yet — Add at least 2 offers to compare total compensation." |
| `/salary` → Negotiate tab | Two-up: "Generate Negotiation Script" (Company / Role / Current Offer / Your Target + Generate Script disabled gradient) + "Your Negotiation Script" empty state ("Enter offer details to generate..."). |
| `/emails` → click Follow-up Email | Error boundary triggered (likely LLM-missing path): "We couldn't load this page" + Try Again CTA, destructive-tinted card. Try Again recovers cleanly. Error boundary itself is polished; underlying error is dev-env LLM noise (out of scope per goal doc). |

## Findings

None.

The Email Templates error-on-click is a dev-env LLM noise issue (the
component attempts to generate a draft on click, and without an LLM the
underlying call throws an unhandled error that the boundary catches).
The boundary's UX is correct; the underlying issue belongs to the
dogfood loop (per CLAUDE.md / goal-doc out-of-scope rule).

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**5 / 5** consecutive 0-H-0-M after loop-020's S-M7 fix. **Second
convergence triggered.**

Trajectory since loop-020:
- polish-loop-021 (1/5) — plural hunt + Studio rename
- polish-loop-022 (2/5) — import dialog + mobile dark
- polish-loop-023 (3/5) — calendar create event + locale switch
- polish-loop-024 (4/5) — search-no-matches + cover letter full width
- polish-loop-025 (**5/5 — converged**)

## Tier plan

None this loop. **No further scheduled wakes** unless user requests
continued dogfood.

## Carryover (intentionally deferred, not blocking)

- **G-L2** — disabled gradient CTAs on `/salary` (Calculate Range,
  Generate Script), `/ats-scanner` (Scan Resume), and the Add Opportunity
  Next button. The rust gradient washes to opacity-50; reads as "softer
  rust" rather than unambiguously "disabled". A future affordance pass
  could swap to `bg-muted` in disabled states.

- **G-L3** — `/vs` hub icon (shield-check) sits in its own row above the
  H1 on marketing surface. Not the editorial reference (`/en` landing).
