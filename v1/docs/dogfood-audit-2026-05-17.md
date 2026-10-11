# Dogfood audit — 2026-05-17

Live walkthrough of the app after the recent studio + tailor-settings
commits. Captured at 1440×900 in **dark mode** (slothing preset).
Browser came up logged-in as the default local user with an empty
profile but seeded opportunities (8 entries — likely seed data).

Screenshots were saved under `dogfood-*.png` at the repo root and
inspected one at a time.

---

## Confirmed working (regression-free)

- **Sub-bar contrast fix landed** — Resume / Cover Letter tabs +
  title + Saved indicator + undo/redo/history + Classic template
  pill + Tailor split + Export PDF are all visibly anchored as a
  distinct band beneath the AppBar. Audit #1 resolved.
- **Centered search** sits at viewport center.
- **Editorial palette holding** across Studio, Components, Dashboard,
  Opportunities. No drift to shadcn neutrals.
- **Knowledge-as-default tab** lands the user on the section list,
  not the file list. Files tab still accessible.
- **Tailor menu** opens cleanly. AI tailor / Manual tailor /
  Settings… items render with shortcut chips and descriptions.
- **Tailor settings dialog** opens, shows all six knobs (bullets per
  role, bullets per project, max roles, max projects, ATS rules,
  Drop bullets shorter than) with reasonable defaults.

---

## New issues found

### A. Phantom button slot on Components page header

**Evidence:** Between `+ Add Entry` and `Upload` there's a roughly
150px-wide empty rectangle with a subtle hover outline. Looks like
a button that didn't render — or a flex slot whose content is
conditionally absent.

**Likely cause:** Probably a `<Button>` gated on auth state or a
toolbar slot for an item that hasn't shipped. Inspect the
`PageHeader actions` in `components-tab.tsx` near the Components
page header.

**Fix:** Remove the phantom slot or render `null` cleanly so flex
collapses. **XS** effort.

---

### B. Components page shows loading skeletons forever in the empty state

**Evidence:** All category chips show `[0]`. No entries. But 6
skeleton cards (`SkeletonChunkCard`) render in the grid instead of
a `StandardEmptyState` ("No entries yet — upload a resume or add
manually").

**Likely cause:** The `loading` state stays true past the initial
fetch when the response is empty, or the empty-state branch isn't
reached because the loading branch fires first and never resets on
an empty `data.entries=[]` response.

**Fix:** Audit the loading-vs-empty branch. After
`setEntries(data.entries || [])`, check we set `loading = false`
unconditionally. Add a vitest case that asserts the empty state
renders when the API returns `{ entries: [] }`. **S** effort
(30-60min).

---

### C. Dashboard stuck in skeleton state for empty user

**Evidence:** Header says "Today / Saturday, May 16" + "Plan my day"
button. Everything below is skeleton cards — no resolved content,
no empty state.

**Likely cause:** Same family as B — dashboard widgets fetch but
the empty branch isn't being reached. Could also be a real fetch
failure (console errors were reported on `/en/opportunities` —
3 errors logged in `.playwright-mcp/console-*.log`).

**Fix:** Check console errors, audit the dashboard's data
loading + empty-state branch. **S** effort.

---

### D. Tailor settings dialog: Min field looks "highlighted/error"

**Evidence:** First input (`Bullets per role · Min`) shows the value
`2` in **bright orange** — the brand color. Looks like a validation
error or a focus-state artifact. The `Max 4` field next to it is
the normal cream color.

**Likely cause:** Likely the Input component's default focus ring
combined with a number input that the dialog auto-focuses on open.
The orange is `var(--brand)` — used for the focused outline ring.

**Fix:** Either don't auto-focus the Min field on open, or restyle
the focused-input state so it looks like a focus ring rather than
an error. The default behavior of `<Input type="number" autoFocus>`
is what's wrong here. **XS** effort.

---

### E. Tailor settings dialog footer button treatment is inconsistent

**Evidence:** `Reset to defaults` (ghost, no border) · `Cancel`
(outline) · `Save` (solid). Reset reads as a link, Cancel reads as
a chip, Save reads as a CTA. Three different visual weights for
three actions of similar destructiveness.

**Recommendation:** Same pattern as the review-modal footer fix:
- Reset to defaults → ghost-destructive (pinned left)
- Cancel → outline (pushed right with Save)
- Save → solid primary (pushed right)
Standardize all to `size="sm"`. **XS** effort.

---

### F. ATS rules setting describes behavior we don't implement

**Evidence:** Dialog says: "Controls how aggressively unsupported
claims and decorative formatting are stripped before export." But
`generate.ts` doesn't read `atsStrictness` anywhere — the value
persists to localStorage but has no consumer.

**Recommendation:** Either implement (strict/balanced/loose mode
in the LLM prompt or unsupported-claims filter), or remove the
field with a comment about future work. **Misleading copy is worse
than no copy.** **S** effort to implement / XS to remove.

---

### G. Tailor flow: hint text under Tailor-to-JD overlaps the menu

**Evidence:** With the Tailor split-button menu open, the menu sits
on top of the AI panel's `Tailor to JD` button and the new hint
("Or use Tailor in the sub-bar above…"). The hint is **also**
visible directly above the AI panel's button — so the menu briefly
sits on top of the hint that points to itself. Circular UX.

**Fix:** Hide the AI panel's hint text when the sub-bar's Tailor
menu is open, or fade-dim the AI panel slightly while the menu's
open. **XS** effort, depends on event plumbing between sub-bar
and panel.

---

### H. Empty Studio canvas competes with empty Knowledge tab

**Evidence:** Knowledge tab on the left says "Sections" then
"+ Add from bank" — empty. The canvas in the middle says
"RESUME / Select entries from your bank / Pick the bank entries
to include / Review the generated preview / Edit and export your
resume" with another "+ Select entries from your bank" button.
Same call to action surfaced twice in adjacent regions.

**Recommendation:** When the bank is empty, the canvas's empty
state should point to **`/components`** (where you build the
bank), not "select from your bank" (which is empty). Different
copy + different button: "Build your knowledge bank →" linking to
`/components`.

When bank has entries but none selected, then the current copy
makes sense. So this is a state-detection improvement. **S** effort.

---

### I. Extension promo card overlaps profile chip in sidebar

**Evidence:** "Capture jobs from any site →" card sits **above**
the "Your profile" row in the sidebar. The close ✕ is hard to see
in dark mode. The card looks loose / detached from the rest of the
sidebar — it's a paper-cream chip on a midnight-indigo background.

**Recommendation:** Either:
- Style the card with the same dark-mode treatment (dark surface,
  brand accent only on the icon)
- Or move it into a "Tips" group within the sidebar, lower
  prominence
- Or only show it on first run / once-per-session

The current treatment is intrusive every page load. **S** effort.

---

### J. Opportunities page: "Paste a job description" card dominates

**Evidence:** Top of `/opportunities` shows a big card with a
clipboard icon, "Paste a job description" header, description, a
textarea, and an "Analyze match" button. Takes ~200px of vertical
space. The actual opportunity list (8 items) gets pushed below the
fold.

**Recommendation:** Collapse the paste card by default; expand on
click. Or relocate to a `+` button next to "Add Opportunity" that
opens this as a dialog. Keep the list as the primary content.
**S** effort.

---

### K. Studio Tailor menu — close cluster against right edge

**Evidence:** The Tailor menu opens to the right of the Tailor
split-button. The keyboard-shortcut chips (⌘⇧T, ⌘T) sit against
the very right edge of the menu, with no breathing room. Looks
cramped.

**Fix:** Bump menu `padding-right` or reduce the menu width by
20px. **XS** effort.

---

### L. Empty page descriptions on AppBar pages

**Evidence:** Components page header is just "Components (i)" —
the (i) tooltip should explain the page. Probably already does
on hover but I didn't verify. Same on Opportunities, Dashboard.

**Fix:** Verify tooltip content is filled in for each page. The
PageHeader compact variant supports a `description` prop that
feeds the (i) tooltip — confirm those are populated for every
top-level page. **S** effort to audit + fill in any missing ones.

---

## Suggested fix order

Quick wins first — most are <30min:

1. **D** — Drop autoFocus on Min field in Tailor settings (1 line)
2. **K** — Bump Tailor menu padding (1 line)
3. **A** — Remove phantom button slot on Components header
4. **E** — Standardize Tailor settings footer buttons (~10 min)
5. **F** — Decide: remove ATS rules row OR add a "Coming soon"
   note (~5 min for the removal path)

Bigger items — schedule individually:

6. **B + C** — Empty-vs-loading state audit across the bank +
   dashboard. Probably one root cause; fix both together. **S**
7. **H** — Studio canvas empty state pointing to `/components`
   when bank is empty. **S**
8. **I** — Extension promo card dark-mode + dismissibility. **S**
9. **J** — Opportunities "paste JD" card collapsibility. **S**
10. **G** — Tailor menu / AI panel hint coordination. **XS**
    (lower priority, mostly cosmetic)
11. **L** — Audit tooltip descriptions across all top-level pages

---

## What I did NOT verify (out of scope this pass)

- LaTeX export end-to-end (no doc content yet to test against)
- Share link flow end-to-end (same)
- Manual tailor end-to-end (need bank entries)
- AI tailor with real LLM (BYOK not configured in this env)
- Critique + Suggestions tab population

Each of those should be its own focused dogfood pass once we have
a seeded bank + LLM key. Worth doing soon to surface bugs the
empty-state walkthrough can't.
