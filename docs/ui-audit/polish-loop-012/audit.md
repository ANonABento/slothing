# polish-loop-012 — Audit (post-convergence dogfood)

The polish-loop run formally converged at loop-011. This loop is the
post-convergence dogfood pass the user requested — explore interactive
states, mobile viewport, modal flows, and toolbar overflow that static
screenshots wouldn't surface.

## Capture summary

- 10 screenshots via Playwright MCP across 375 / 1440 viewports and a
  variety of interaction states.
- States exercised:
  - Studio template-picker open
  - Studio Resume → Cover Letter mode switch (rich-text toolbar appears)
  - Add Opportunity wizard open (step 1 of 4)
  - Profile "Or fill manually" form revealed (Profile readiness card)
  - Sidebar collapsed
  - Mobile (375) on `/dashboard`, `/opportunities`, `/studio`

## Findings

### S-M5 [Medium] — Cover Letter editor toolbar Text group overflows
- **Where:** `apps/web/src/components/studio/editor-toolbar.tsx:117-132`
  (`ToolbarGroup`).
- **What:** In Cover Letter mode the TipTap editor renders a rich-text
  toolbar. The Text group (Bold/Italic/Underline/Strike/Sub/Super + Font
  + Size + Color + Highlight selects) is wider than the editor pane at
  1440px (the editor sits between Files panel and AI Assistant, ~750px
  available). The group's flex container had no wrap so Color/Highlight
  items overflowed past the visible right edge of the pill — "Col"
  visibly truncated, Highlight invisible.
- **Fix vector (Tier A, shipped):** Add `flex-wrap` to `ToolbarGroup`'s
  outer div so items inside a group wrap to a second row inside the
  paper-card pill. Outer toolbar container already has `flex-wrap`; per-
  group wrap completes the chain.
- **Verified:** `studio-cover-letter-1440-after.png` shows the Text group
  on two lines (B/I/U/S/Sub/Super + Font + Size, then Color/Highlight on
  row 2 inside the same pill). No clipped content. Paragraph + Insert +
  History groups unaffected.

### `/studio` mobile (375px) — clean
- The polish-loop-001 truncate fix on the H1 holds at this width — "Document
  Studio" reads as "Docu..." with ellipsis instead of overflowing. Header
  chrome stacks gracefully; Edit / Preview / AI tabs collapse the
  three-pane layout into mobile tabs.

### Add Opportunity wizard — clean
- 4-step indicator (Essentials / Where & how / Compensation / Details)
  with first step "Required", remaining "Optional".
- Title field auto-focuses with rust focus ring; Company + URL with
  neutral borders.
- Modal centred, page dimmed behind.

### Profile manual form — clean
- "Profile readiness" eyebrow + "Profile is 0% complete · 9 quick wins
  available" with quick-win cards listing point-valued actions
  ("+10 points" / "+20 points"). Good progressive-disclosure UX.

### Sidebar collapsed — clean
- Icons-only column with active state highlighted; profile P avatar at
  the bottom.

### Mobile (`/dashboard`, `/opportunities`) — clean
- Sticky mobile header with hamburger + Slothing + page name.
- Single-column content; action buttons wrap to multi-row stacks.

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 1 (S-M5) — fixed |
| Low      | 0     |

## Convergence counter

Loop-011 was the formal convergence (5/5 0-H-0-M). This loop is a
post-convergence dogfood pass that surfaced one new M (S-M5) — fixed in
the same loop. Counter restarts at 0/5 if the user wants another formal
convergence run.

## Tier plan

**Tier A — shipped:** S-M5 toolbar group flex-wrap.

**Tier B / C:** none new this loop.
