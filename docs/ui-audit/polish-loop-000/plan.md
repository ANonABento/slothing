# polish-loop-000 — Plan

This is a **third** UI audit loop on the repo. Prior runs:
- `loop-001`–`loop-008` — the original audit loop (worktree, broad pass).
- `redesign-loop-001`–`redesign-loop-008` — editorial-typography sweep on `feat/ui-redesign` (now merged via #271).
- `polish-loop-NNN` — **this** run. Branch is `main`, commits push directly.

## 1. Reading-list summary

### Editorial system (from the redesign loops + `.design-ref/README.md`)
- Surfaces: `bg-paper` (warm off-white card), `bg-background` (page), `bg-muted`,
  `bg-card`. **Never** `bg-white`/`bg-black`/`bg-gray-*` — `forbidden-color-lint`
  is a CI fail.
- Text: `text-ink-2` neutral body, `text-foreground` strong, `text-muted-foreground`
  captions, `text-brand` rust accent for emphasis only.
- Borders: `border-rule`, `border-border`, `border-input`.
- Shadows: `shadow-paper-card`, `shadow-elevated`.
- Display font on H1/H2/CardTitle: `font-display tracking-tight`. Mono captions:
  `font-mono tracking-[0.16em]` (sidebar groups, eyebrows).

### What the redesign loops already settled
- `PageHeader`, `InsetPageHeader`, `PagePanelHeader`, `PageSection`,
  `StandardEmptyState` headings — display-font headings (loop-001).
- `CardTitle` shadcn primitive — display-font (loop-006).
- Studio shell (header/file panel/version history/AI assistant) — display-font
  (loop-002).
- `StandardEmptyState` — solid border + `bg-paper` (loop-003).
- Stat values across analytics/salary/emails/interview — display-font numerals
  (loops 004/005/008).
- Review-queue h1 + Answer-Bank stats (loop-007).

Treat all of the above as **done**. Don't re-touch typography on those primitives
unless visual evidence shows regression.

### What the redesign loop explicitly deferred (still fair game)
- Onboarding step h2s (6 instances).
- ATS scanner inline result panel stat spans.
- Dark-mode parity — first real pass should happen once theme toggle is wired.
- Richer hover/affordance polish across the app (this loop's bread + butter).

### Tokens to use (recap)
`bg-paper`, `bg-card`, `bg-background`, `bg-muted`, `bg-popover`, `text-foreground`,
`text-muted-foreground`, `text-ink-2`, `text-brand`, `text-primary`, `border-rule`,
`border-border`, `border-input`, `shadow-paper-card`, `shadow-elevated`,
`shadow-button`.

## 2. Starting-evidence triage

5 screenshots staged at `polish-loop-001/screenshots/_starting-evidence/`.

### `landing-en-light.jpeg` — reference, not a target
Marketing landing at `/en`. The bar for what "polished" means in this loop:
editorial paper cards on tinted-paper page, restrained rust accents, balanced
gutters, no walls of text, every affordance has clear hierarchy. **Do not touch**
`src/components/landing/*` or `app/[locale]/page.tsx`.

### `dashboard.jpeg` — `/dashboard`
**Finding:** the `<Home>` icon tile next to the H1 "Dashboard" reads outsized
relative to a short title. The `PageIconTile` is `h-10 w-10` with `bg-primary/10`
tint; at this viewport with a 4-character title it overweighs the typography.
- **Severity:** Medium (consistency / restraint, not broken).
- **Fix vector:** Reduce `PageIconTile`'s default `md` size to `h-9 w-9` with
  `h-4 w-4` glyph — or just remove the icon from `PageHeader` for dashboard.
  Lean toward shrinking the default tile a notch so all PageHeaders benefit
  (consistency win across the app workspace).

### `opportunities.jpeg` — `/opportunities` (toasts)
**Finding 1 (High):** error toast background is `bg-destructive/10` (10% alpha)
which lets the page content show through. At a glance it looks like two toasts
are overlapping each other — they aren't (the `ToastContainer` is `flex flex-col
gap-2`), it's the tinted-paper card content bleeding through the translucent
toast surface.
- **Fix vector:** Bump toast surface to `bg-card` with a stronger tinted ring
  per severity (e.g., `border-destructive/30 bg-card text-destructive`), and
  keep the icon/title tinted. Solid surface kills the bleed-through. Match the
  rest of the editorial system (paper cards, restrained tint).

**Finding 2 (Medium):** dev-env 500s from `/api/opportunities` + `/api/settings/kanban`
in this run. Per goal doc — dogfood loop owns the actual API failures. But the
toast UX of *surfacing* them is in-scope and addressed above.

### `opportunities-fixed.jpeg` — `/opportunities` (JD wall of text)
**Finding (High):** `OpportunityRow` (`page.tsx:1124`) renders
`opportunity.summary` without `line-clamp`. A long JD blows the card open
vertically and pushes the list into infinite scroll fatigue.
- **Fix vector:** Add `line-clamp-3` to the summary paragraph. Detail-page hand-off
  is already in place (the title links to `/opportunities/[id]`), so no need for a
  "Read more" toggle — the click target already exists. Consistent with `JobCard`
  (kanban view) which already clamps.

### `studio.jpeg` — `/studio`
**Finding 1 (High):** "Saved Just now" pill (`studio-header.tsx:468-486`) wraps
to two lines at ~900–1024px because the inline-flex has no `whitespace-nowrap`
and the relative-time copy is long.
- **Fix vector:** Add `whitespace-nowrap` to the pill; shorten label for
  long-relative-time states; possibly drop the word "Just" → "Saved · now"
  (handled in `getStudioSaveStatusLabel`).

**Finding 2 (Medium):** "Document Studio" H1 in `studio-header.tsx:242-244`
wraps to two lines at ~900–1024px because the container is `flex-wrap` and
neither the h1 nor its wrapper has `whitespace-nowrap`.
- **Fix vector:** `whitespace-nowrap` on the h1; the surrounding `min-w-0`
  already allows truncation if it overflows.

**Finding 3 (Low):** AI Assistant "Rewrite section" row at
`ai-assistant-panel.tsx:798-836` — the icon button next to the select looks
visually misaligned because the Select is `h-10` (default trigger) and the
icon Button is `size="icon"` (h-10). They should align. Re-check after dev-server
capture; might be a screenshot-only artifact.

## 3. Loop plan (polish-loop-001 → polish-loop-004)

### polish-loop-001 (this iteration's targets)
- Toast surface fix (kills the "overlapping toasts" look across the app, not
  just /opportunities — global win).
- Opportunity row summary `line-clamp-3`.
- Studio save-status pill `whitespace-nowrap`.
- Studio H1 `whitespace-nowrap`.
- PageIconTile default size shrink (or dashboard-specific opt-out).
- Capture every authenticated route at 1280px to seed a fuller audit.

### polish-loop-002
- Cross-cutting affordance polish: hover states on PagePanel rows, focus rings,
  badge consistency on opportunities list vs. kanban.
- Empty-state alignment for /interview, /calendar, /emails, /analytics, /salary.
- Dark mode parity sweep (re-screenshot in dark; flag unreadable contrast).
- Spot-fix anything visible in the loop-001 capture that wasn't worth bundling
  with the starting-evidence fixes.

### polish-loop-003
- Information density: card padding (22/28), gutter consistency on
  /opportunities/[id], /studio file panel, /bank entries.
- Onboarding step h2 swap (6 files) — clear the redesign-loop carry-over.
- ATS scanner result-panel stat spans (`text-2xl font-semibold` → display-font).

### polish-loop-004
- Edge-case viewport pass at 1920px (loops 001–003 stay at 1280).
- Sweep auth surfaces (/sign-in) + extension connect.
- Loose ends from earlier loops.

After polish-loop-004 the loop runs until convergence — the plan is rough beyond
that and depends on what the audits surface.

## 4. Convergence signal

Stop the loop when **five consecutive loops** each report **0 high + 0 medium**
findings in their `audit.md`. Declare convergence in the latest `summary.md` and
do not schedule another wake. No hard loop cap.

Other stop signals (priority order, from the goal doc):
1. Five consecutive 0-H-0-M loops. → terminate cleanly.
2. CI on `main` red with the same signature for two loops despite fix-forward. →
   stop and escalate.
3. Pre-commit hook fails three times in one iteration. → stop, document, escalate.
4. User explicitly says stop.

Cadence between loops: 1800s default. Drop to 270s twice when a specific CI run
is in flight.
