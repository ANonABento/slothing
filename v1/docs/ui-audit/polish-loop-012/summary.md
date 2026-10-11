# polish-loop-012 — Summary (post-convergence dogfood)

## Headline

**1 Medium found + fixed (S-M5).** Post-convergence dogfood pass
covering interactive states the static screenshot loops couldn't reach:
template picker open, Resume → Cover Letter switch, Add Opportunity
wizard, Profile manual-fill form, sidebar collapse, mobile viewport.

Cover Letter mode revealed a rich-text toolbar overflow inside `ToolbarGroup`
at 1440px (editor pane constrained between Files + AI panels). Adding
`flex-wrap` to the group lets items inside a pill flow to a second row
instead of clipping past the visible edge.

## Convergence counter

Was 5/5 at loop-011 (formal convergence). This loop is a discretionary
post-convergence pass at the user's request. Counter is now informally at
0/5 again because S-M5 landed; would need 5 more clean loops to re-declare
formal convergence.

## What landed

- `docs/ui-audit/polish-loop-012/audit.md`, `fixes.md`, `summary.md`
- `docs/ui-audit/polish-loop-012/screenshots/` — 10 PNGs
- `apps/web/src/components/studio/editor-toolbar.tsx` — single-class edit

## What's clean (already verified this loop)

- Studio template picker open state (2-up template grid with Apply CTAs)
- Studio H1 truncate at mobile (375px) — polish-loop-001 fix holds
- Studio sub-`xl` two-row header — polish-loop-006 fix holds
- Add Opportunity wizard (4-step modal)
- Profile manual-fill quick-wins flow
- Sidebar collapsed icon-only column
- Mobile `/dashboard`, `/opportunities`, `/studio`

## Carryover still deferred

- G-L2 disabled gradient CTAs.
- G-L3 `/vs` hub icon.
- Dark-mode parity (capture tooling).

## CI gate

Studio tests + type-check + lint green locally; push will trigger CI.

## What to look at next

If continuing past loop-012:

1. Hover/focus state pass on `PagePanel` row cards — easy to capture by
   programmatically firing `:hover` via Playwright.
2. Dropdown / select open states across the app (the Studio status select,
   the opportunity status select, the analytics time-range select).
3. Form validation states — submit Add Opportunity with empty Title; submit
   sign-in form with empty fields.
4. The Cover Letter editor with actual content — the page setup, the
   bulleted/numbered lists, code blocks.
5. Toast surfaces from real interactions (try Save changes on Profile
   with no changes; try Dismiss an opportunity to see the undo snackbar
   surface in its real environment).
