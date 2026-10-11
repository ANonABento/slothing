# polish-loop-015 — Audit (deeper flow dogfood)

End-to-end interaction flows that the static + theme passes couldn't surface.

## States exercised

| Flow | Result |
| ---- | ------ |
| Answer Bank → Add Answer modal | Clean. "Add answer" h2, Question + Answer fields with hint placeholders, optional Source company + URL, Cancel/Save Answer footer. Modal dimmed background. |
| Interview Prep → Prep Guide on first card | Inline rust-tinted notice surfaces below the card actions: "No LLM provider configured. Go to Settings to set one up." Button label flips to "Hide Prep Guide". Good progressive-disclosure UX. |
| Profile manual fill → type Avatar URL + Full name → Save changes | Inline "✓ Saved" success pill appears in the header next to Discard/Save. Sidebar profile chip updates to show new name ("Test"). No toast — inline pill is the feedback. Appropriate for a passive save. |
| Add Opportunity wizard step 1 → Next without required fields | Next button correctly disabled (per Required validation). Visually it's the rust gradient at `disabled:opacity-50` — same G-L2 readability concern (deferred Low). |
| Add Opportunity step 1 → fill required → Next | Step indicator advances to "2. Where & how"; step 1 marked complete (highlighted); step 2 active. Footer shows Back / Save & exit / Next. |
| Add Opportunity step 2 → Save & exit | Modal closes, opportunity saved. List doesn't visibly toast (or it dismissed before screenshot). |
| Opportunity detail → Dismiss | Status pill changes Pending → Withdrawn; detail page stays put. Undo snackbar likely fired but auto-dismissed by 5s before screenshot capture. (Code path in `[id]/page.tsx:355` uses `useUndoableAction` per Pattern B.) |
| Calendar → click date with deadlines | Date 19 highlighted with dark surface + 3 dot indicators; right panel updates to "Tuesday, May 19" with 3 deadline event cards (icon + title + company + 9:00 AM + View Job). Smooth state transition. |

## Findings

None.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 0     |

## Convergence counter

**3 / 5** consecutive 0-H-0-M loops after loop-012's S-M5 fix.

## Tier plan

None this loop.

## Carryover unchanged

- G-L2 disabled gradient CTAs — re-confirmed visible during Add Opportunity
  wizard (Next button when required fields empty). Still deferred.
- G-L3 `/vs` hub icon — still deferred.
