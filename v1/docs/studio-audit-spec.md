# Studio audit — RCA + implementation spec

Followup to the post-commit screenshot review of `/studio` (commits
`badb9fbf` + `bd054fc0`). Each item has: evidence, root cause, fix
approach, files, blast radius, effort.

Effort key: **XS** ≤15min · **S** ≤1h · **M** ≤3h · **L** half-day+.

---

## 1. Sub-bar appears invisible in the screenshot

**Evidence:** The screenshot shows the AppBar (search row) followed
directly by the editor area. There's no visible row containing
Resume/Cover Letter doc-type tabs, document title, save indicator,
undo/redo, template pill, Tailor split, or Export split.

**RCA — most likely:** stale dev-server build. The `StudioSubBar` is
mounted (`page.tsx:225`, verified). The component renders ~48px of
chrome (`h-9` controls + `py-2`) inside a `flex-wrap items-center
gap-3 border-b border-rule bg-page` outer div, so it can't collapse
to zero height under normal CSS. The Tailwind classes used
(`flex`/`items-center`/`px-4`/`py-2`) compile cleanly. No render
guard exists that would short-circuit it.

**RCA — backup hypothesis:** if the sub-bar IS reaching the DOM but
not visible, the next thing to check is whether `bg-page` /
`var(--bg)` is resolving to the *same* color as the AppBar's
background, making it appear as one continuous empty band. The border
between AppBar and sub-bar would be the only visual cue, and it could
get lost against the cream-paper background.

**Fix approach:**
1. Hard-refresh the browser, restart dev server, take a fresh
   screenshot. Likely resolves this.
2. If still missing, add a `data-testid="studio-sub-bar"` and inspect
   in DevTools — confirm the element exists and measure its
   computed height + colors.
3. If it's there but visually invisible, swap the sub-bar background
   token from `bg-page` to `bg-paper` so it has a subtle contrast
   against the AppBar (which is also `bg-page`). One-line change.

**Files:** `apps/web/src/components/studio/studio-sub-bar.tsx`
(possibly 1 line)

**Blast radius:** None. Pure visual.

**Effort:** XS (probably zero — just refresh)

---

## 2. Editor toolbar is overloaded

**Evidence:** The toolbar above the canvas has **30+ controls in two
rows**: Text type dropdown, B/I/U/S, sub/super, Font, Size, Color,
Highlight, eraser, Paragraph dropdown, 4 alignment buttons, Spacing,
ul/ol lists, indent left/right, HR, Insert (link/image/table/more),
History undo/redo, Page setup.

**RCA:** `EditorFormattingControls` in
`apps/web/src/components/studio/editor-toolbar.tsx:690-724` composes
four heavy sub-groups: `EditorTextControls`, `EditorParagraphControls`,
`EditorInsertControls`, `TableContextControls`, plus History. It's
been growing organically — every Tiptap extension we add gets a
button. The studio sub-bar already has its own undo/redo + history;
they're duplicated in the toolbar.

The toolbar lives **inside** `ResumePreview` (`resume-preview.tsx:174`)
as a sticky bar — that placement is sensible but the surface area is
out of proportion with the doc you're editing.

**Fix approach:** A pared-down "essentials" row + a chevron-overflow
"more formatting" popover. Specifically:

- **Always visible:** Text type, Bold, Italic, Link, Bullet list,
  Ordered list, History (since not duplicated then)
- **Contextual (show only when text is selected):** Color, Highlight,
  Strikethrough, sub/super
- **Behind "More" popover:** Font family, Font size, Alignment,
  Spacing, Indent, HR, Image, Table, Underline, eraser
- **Drop entirely:** Undo/redo (moved to sub-bar already) and Page
  setup (move to a settings cog at far right of the toolbar)

Rough output: 7 controls always visible, 4 contextual, ~10 hidden in
overflow. Toolbar becomes single-row.

Implementation: refactor `EditorFormattingControls` to split into
`EssentialControls`, `SelectionControls` (gated on
`editor?.state.selection.empty === false`), and `MoreControlsMenu`
(opens a popover w/ the rest).

**Files:**
- `apps/web/src/components/studio/editor-toolbar.tsx` — main refactor
- `apps/web/src/components/studio/resume-preview.tsx` — adjust the
  sticky bar's flex layout to accommodate the popover
- `apps/web/src/components/studio/editor-toolbar.test.tsx` — update
  the existing toolbar test to match new structure

**Blast radius:** Medium. This touches the editing surface every
user sees. The Tiptap commands themselves don't change; just where
the buttons live. Selection-gated controls need careful keyboard +
focus handling so they don't pop in/out jankily.

**Effort:** M (2-3h including tests)

---

## 3. Tailor flow exists in two places

**Evidence:** AI Assistant panel (right column) has its own UI:
- "Select from Opportunity Bank" button
- JD textarea
- Big "Tailor to JD" button (primary CTA)
- "Generate from Bank" button
- Rewrite-section dropdown + pen icon

Meanwhile the sub-bar's "Tailor" split-button has AI tailor / Manual
tailor / Settings menu items.

**RCA:** The AI panel predates the v3 sub-bar work. When we added the
sub-bar's Tailor split, we lifted the *trigger* but left the panel's
*surface* (JD input, opportunity picker, action buttons) intact. The
AI tailor action lives in the panel because that's where the JD lives
— pressing the sub-bar's "AI tailor" today just opens the AI panel
and focuses the JD textarea (`handleTailorAi` in
`studio/page.tsx:80`).

So the duplication isn't truly redundant — it's a *handoff*. But it
looks confusing because both surfaces have prominent "Tailor"
controls without making the relationship clear.

**Fix approach (recommended):** Make the sub-bar's Tailor split the
**primary surface** for tailor triggers. Slim the AI panel's role to
just **conversation + suggestions**. Specifically:

- **Sub-bar Tailor split** stays as-is (AI tailor / Manual tailor /
  Settings)
- **AI panel Chat tab** keeps the conversation UI, but the
  prominent JD textarea + "Tailor to JD" button are **moved into a
  collapsible "Tailor context" disclosure** at the top of the chat
  pane (default open when no critique exists, default collapsed
  after a critique runs)
- **"Generate from Bank" button moves** to the sub-bar as a second
  item in the Tailor split menu (alongside Manual tailor)
- **Rewrite-section dropdown** stays in AI panel (it's selection-
  contextual, doesn't fit the sub-bar)

After this, the sub-bar becomes the "I want to make my resume" entry
point; the AI panel becomes the "I want to talk to the AI about my
resume" surface. Clear mental model.

**Alternative (lower effort):** Visually de-emphasize the AI panel's
Tailor button — make it `variant="outline"` instead of solid, smaller,
and add a tooltip "Or use the Tailor button in the toolbar above" to
make the relationship explicit. Doesn't restructure, just acknowledges.

**Files:**
- `apps/web/src/components/studio/ai-assistant-panel.tsx` — major
  restructure of Chat tab
- `apps/web/src/components/studio/studio-sub-bar.tsx` — add
  "Generate from Bank" menu item in Tailor split
- `apps/web/src/app/[locale]/(app)/studio/page.tsx` — wire the new
  handlers
- `apps/web/src/components/studio/ai-assistant-panel.test.tsx` —
  update for the collapsible-context shape

**Blast radius:** High. AI panel is the most-tested studio component
(17 tests). Restructuring it means rewiring most of those tests, plus
risking regressions in the tailor / critique / generate flows that
real users depend on.

**Effort:** M-L (3-4h including tests). Or **XS** (15min) for the
alternative.

**Suggestion:** Start with the alternative (de-emphasize + tooltip).
Ship to staging, see if users get confused. If they do, then commit
to the full restructure.

---

## 4. Editor toolbar styling drifts from editorial tokens

**Evidence:** Toolbar buttons use shadcn-default chrome
(`border-input`, neutral gray, rounded-md). Compared to the rest of
the app — warm paper backgrounds, hairline borders in
`var(--rule)`, accent rust details — the toolbar feels imported from
a different design system.

**RCA:** `editor-toolbar.tsx` was written before the v3 editorial
preset landed (PR #271). The `ToolbarButton`, `ToolbarGroup`,
`ToolbarSeparator` primitives at the top of that file use generic
tokens (`bg-background`, `text-muted-foreground`, `border-input`,
`shadow-sm`). The forbidden-color lint passes because they're
semantic tokens, but they don't pick up the warm-paper aesthetic.

**Fix approach:** Restyle the three primitives:

- `toolbarButtonClass()` (line 79-86): swap to editorial
  - `bg-paper` → `var(--paper)` surface
  - `border border-rule` → hairline
  - Hover: `bg-rule-strong-bg`
  - Active (toggled): `bg-brand-soft` + `text-brand-dark`
- `ToolbarSeparator` (line 134): use `bg-rule` instead of `bg-border`
- `ToolbarGroup` wrapper: drop any rounded-md container; let the
  buttons sit flat with separators between groups

After the swap, the toolbar will read as a continuation of the
editorial language rather than a foreign element.

**Files:**
- `apps/web/src/components/studio/editor-toolbar.tsx` (top 150 lines
  only — the primitives)

**Blast radius:** Low. Visual-only change. Existing toolbar tests
that check class names will need updating, but behavior is identical.

**Effort:** S (30-60min)

**Sequencing:** Best to do this AFTER #2 (slimming) so we don't
restyle controls that are about to move into a popover anyway.

---

## 5. "Click to add your experience…" placeholders persist even with
   selected entries

**Evidence:** Bottom of the canvas shows `1 of 31 entries selected`
in the left rail, but the canvas itself shows section placeholders
("Click to add your experience…", "Click to add your experience…"
for Summary and Skills). The user has selected a bank entry but the
preview hasn't built from that selection.

**RCA:** Two possible causes — needs verification before fixing.

- **Hypothesis A:** the preview-generation pipeline (`/api/builder`
  POST that turns selected entries into rendered HTML) only fires on
  certain triggers (entry toggled, manual generate clicked). If the
  user toggled a child entry but a parent isn't selected, the section
  stays empty.
- **Hypothesis B:** the placeholders are intentional for *unfilled*
  sections (Summary doesn't come from bank entries — it's hand-
  written), so they correctly stay as placeholders even when other
  sections fill. In which case this is not a bug, just unclear.

**Fix approach:** Investigate first.
1. Read `use-studio-page-state.ts` around the preview-generation
   side-effect (`builder-preview` or similar). Confirm what toggles
   what.
2. Confirm whether the user's "1 of 31 selected" is a project bullet
   that would populate the Projects section (and Projects is
   correctly empty) or an experience bullet that should populate
   Experience (and Experience IS correctly populated — see "Software
   Engineer at Hamming AI" in the screenshot).

Looking at the screenshot more closely: the Experience section DOES
have content (Software Engineer at Hamming AI with bullets). Summary
and Skills are placeholders. So hypothesis B is probably right — the
user's selected entry is an experience bullet, Experience filled
correctly, the other sections need separate content.

**Recommendation:** Not a bug. But the empty-section affordance could
be improved:
- Replace "Click to add your experience..." (which is grammatically
  weird for Skills/Summary) with section-specific copy:
  - Summary → "Add a summary or generate one from your bank"
  - Skills → "Add your skills or pull them from your bank"
  - etc.
- Add an inline `+ Add from bank` button on each empty section that
  opens the bank picker filtered to that category.

**Files:**
- `apps/web/src/lib/resume/...` (need to find the empty-section
  template literals)
- Or `apps/web/src/components/studio/resume-preview.tsx`

**Blast radius:** Low. Copy + small button changes.

**Effort:** S (45min)

---

## 6. Smaller polish items

| Item | Fix | File | Effort |
|---|---|---|---|
| Knowledge tab badge `31` duplicates "1 of 31 entries selected" status | Drop the status line; rely on tab badge | `studio-left-rail.tsx` | XS |
| "Drag to reorder" label adds noise | Move to a tooltip on the drag handles | `section-list.tsx` | XS |
| `Page setup` button visually larger than other toolbar buttons | Standardize sizing — apply same `h-8` as other toolbar buttons | `editor-page-settings.tsx` | XS |
| AppBar right cluster (theme/locale/bell/chevron) feels cluttered | Group theme + locale into a "preferences" dropdown; keep bell + chevron separate | `app-bar.tsx` | S |
| Spell-check underlines in the preview (Hamming, YC, S24, Uil18nProvider) | Add `spellCheck="false"` on the Tiptap editor container, OR build a domain dictionary | `resume-editor.tsx` | XS / L |

---

## Suggested implementation order

1. **#1 confirm or fix** (5 min) — refresh, restart dev, retake
   screenshot. If sub-bar still missing, do the `bg-paper` swap.
2. **#5 verify** (15 min) — read the preview-generation code, confirm
   it's not a bug.
3. **#4 toolbar restyle** (1h) — small, safe, immediate visual win.
4. **#2 toolbar slimming** (3h) — biggest UX improvement.
5. **#6 polish items** (1h total) — pick from the table as time allows.
6. **#3 tailor de-duplication** — start with the **alternative**
   (de-emphasize + tooltip, XS), defer the full restructure until
   real user feedback confirms it's a problem.

Total realistic: ~6 hours of focused work for #1–#5 + half the
polish. Each item ships as its own commit so the diff per review is
small.

---

## What I'm *not* changing yet

- Sidebar layout / nav — works fine, no audit items
- Left rail tabs (Files/Knowledge/Jobs) — already fixed in
  `badb9fbf`, no further changes
- Canvas Visual/LaTeX toggle — works, low priority
- Bottom status footer — works, low priority
- AI panel suggestions tab — works, no issues raised

These are stable; let them be unless a regression surfaces.
