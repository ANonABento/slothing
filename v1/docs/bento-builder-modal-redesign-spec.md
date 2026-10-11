# Opportunity layout-builder modal — from-scratch redesign

Status: **All phases shipped** (2026-05-20). P0–P4 land on
`audit/overnight-01` as commits `7434475a` (P0 spec), `c2b39e60` (P1
mode toggle + frame collapse), `b58ebd1b` (P2 Customize cell polish),
`12ae4a33` (P3 Preview-mode visuals), `<this commit>` (P4 hidden
chunks tray redesign).
Parent: `docs/bento-builder-redesign-spec.md` (the underlying RGL +
dnd-kit system this redesign sits on top of — that spec is shipped).
Related: `docs/opportunity-card-bento-spec.md` (the data model + chunk
catalog).
Triggered by: user feedback 2026-05-20 — "looks pretty bad, can we
redesign this whole modal around the new system from scratch?"

The cells, drag system, palette popover, body chunks, and keyboard
a11y from the prior spec all stay. What this spec changes is the
**modal's overall presentation** — the editor/preview split, cell
affordance density, hidden-chunks tray, and the lack of a clear "what
will this look like when I'm done?" view.

---

## 1. What's wrong today

Visible in the current modal (`apps/web/src/components/opportunities/layout-builder-modal.tsx`
+ `bento-layout-builder.tsx`):

1. **Two visual systems compete.** Left pane is the editor (cells with
   labels, grip, palette, X, chunk chips); right pane is the live
   preview. The preview is clean; the editor is cluttered; they don't
   look like the same thing.
2. **Always-on cell chrome.** Every cell shows grip + palette + X +
   "Cell label (optional)" placeholder + dashed "Drag chunks here"
   dropzone — even when the cell is populated and the user isn't
   editing it.
3. **Schematic cell content.** Editor cells render chunk *names* as
   chips ("responsibilities", "tags") rather than the real rendered
   content. The mental translation from chip → final card is what the
   live preview was patching over.
4. **Hidden chunks read as deleted.** The "Hidden chunks" tray at the
   bottom uses strikethrough text, which signals "removed" instead of
   "available to add".
5. **Modal is wide.** 1500 px split into two panes forces both panes
   to ~700 px — neither feels generous. The editor pane is the busier
   of the two and gets cramped first.

## 2. Goal

One surface. Two modes.

- **Customize** (default): the bento is directly editable. Cells show
  real rendered content. Hover-reveal cell controls. Drag/resize
  works. Hidden-chunks tray is visible.
- **Preview**: same surface, same cells, all editing chrome gone. RGL
  drag/resize disabled. No labels, no grip, no palette, no resize
  handles. Looks pixel-for-pixel like the shipped review card.
- A segmented control at the top of the modal flips between them.

The user's mental model becomes: "I'm editing the actual card, and I
can hit Preview any time to see it clean."

## 3. Non-goals

- Changing the cell data model (`BentoCell { id, chunks[], gridCol, … }`
  is fine).
- Changing the chunk catalog or adding more body chunks.
- Replacing react-grid-layout. The drag/resize/push-neighbors system
  works — this spec only changes what wraps it.
- Cell-level animation flourishes beyond what RGL provides.
- A "fullscreen preview" or out-of-modal preview surface.
- AI-suggested layouts.

## 4. Architecture

### 4.1 Mode state

Single `mode: "customize" | "preview"` ref/state in
`<LayoutBuilderModal>`. Lifted there (not in the builder) because:

- The mode toggle UI sits in the modal header.
- The builder is reused by `/templates` and other surfaces that may
  not want a mode toggle — pass `mode` as a prop with a
  `"customize"` default.

### 4.2 Mode → builder props mapping

```
mode = "customize"
  isDraggable: true
  isResizable: true
  showCellChrome: true        // grip / palette / X
  showResizeHandles: true
  showHiddenChunksTray: true
  cellLabelEditable: true

mode = "preview"
  isDraggable: false
  isResizable: false
  showCellChrome: false
  showResizeHandles: false
  showHiddenChunksTray: false
  cellLabelEditable: false
```

Mode is passed to `<BentoLayoutBuilder mode="customize" | "preview">`.
The builder destructures and applies. No behavior change to the
underlying `desktop` / `mobile` layout state — Preview is a pure
read-only render of the same draft.

### 4.3 Cell rendering parity

Both modes render through the same `<RenderChunk>` pipeline already
used by `<BentoGrid>`. In Customize the chunk content sits inside a
cell wrapper that *adds* hover affordances; in Preview the wrapper is
a no-op (chunk content only, no border, no hover state). That way the
two modes can't visually diverge — same chunks rendered the same way.

The current "schematic chip" rendering (chunk-key chips inside cells)
is **removed**. Editor cells render real chunks like the preview
does. The wrapper provides editing affordances, but the *content* is
the same as ship.

## 5. UI changes

### 5.1 Modal frame

Before: `!w-[min(95vw,1500px)]` two-column grid (editor left, preview
right). After: `!w-[min(95vw,1200px)]` single column. Saves ~300 px
and removes the parallel-pane competition.

Header layout (new, top-to-bottom):

```
┌──────────────────────────────────────────────────────────┐
│ Customise layout card                              [X]   │  ← DialogTitle
│ How the card appears on the review queue.                │  ← DialogDescription
├──────────────────────────────────────────────────────────┤
│ [ Customize | Preview ]   [ Desktop | Mobile ]   Reset   │  ← mode + device + reset row
├──────────────────────────────────────────────────────────┤
│                                                          │
│             (canvas — the bento itself)                  │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ Hidden chunks (visible in Customize only)                │
│ [Tags] [Benefits] [Pref skills] [Quick actions] [+]      │
└──────────────────────────────────────────────────────────┘
```

`Reset` is per-device-tab (already correct in the current builder).
In Preview the Reset button is still visible but disabled (you're
not editing).

### 5.2 Cell affordances (Customize mode)

- **Default state**: cell shows real rendered chunk content + a thin
  border (`border border-rule`). No labels visible unless the user
  sets one.
- **Hover or focus**: top-right corner overlays:
  - `[≡]` grip handle (drag handle for RGL)
  - `[🎨]` palette icon button (opens the existing TonePalette popover)
  - `[✕]` delete cell button
  - These sit in a small `flex gap-1` row with a `bg-paper/95
    backdrop-blur` so they read over any chunk content beneath.
- **Bottom-right corner**: RGL SE resize handle (already styled via
  `globals.css` scoped overrides).
- **Cell label**: only rendered when `cell.label` is non-empty. The
  label sits as a small `font-mono uppercase tracking-[0.16em]
  text-ink-3` eyebrow at the top of the cell. Click-to-edit:
  clicking the label (or an inline pencil icon next to it on hover)
  swaps it for a text input. No "CELL LABEL (OPTIONAL)" placeholder.
- **Empty cell**: shows a subtle `border-dashed` pattern + a single
  centered `text-ink-3` line: "Drop a chunk here" — only when an
  active dnd-kit chunk drag is in flight (use the dnd-kit context's
  `active` state). Otherwise empty cells just look like empty cells.

### 5.3 Cell affordances (Preview mode)

- All hover affordances removed.
- Cell border removed (`border-0`). Cells blend into the canvas.
- Labels still render if set — they're part of the user's design.
- No resize handles, no grip.
- RGL `isDraggable=false, isResizable=false` (so even keyboard arrow
  nudge is disabled — Preview is read-only).

### 5.4 Hidden chunks tray

Before: bottom block with chunk-key chips rendered as strikethrough
text in a single line.

After: bottom strip with visual chunk *cards*. Each card:

- ~96 × 64 px
- Mini-preview of the chunk type (a tiny bullet list for
  `responsibilities`, three pills for `required-skills`, etc.) —
  reuses the same `<RenderChunk>` against a synthetic mini-fixture, or
  a flat icon if rendering is too heavy.
- Chunk label below in `font-mono text-[10px] uppercase`.
- Draggable into any cell on the canvas (existing dnd-kit drag).

Strikethrough is gone. Cards read as "available", not "deleted".

In Preview mode the tray is hidden entirely.

### 5.5 Mobile tab

Mobile editing is already a vertical priority list (not a grid). The
mode toggle still applies:

- **Customize**: priority list with handle + visibility toggle per
  chunk + the "expanded count" picker.
- **Preview**: rendered phone-width bento with the priority order
  applied. No editing.

Mobile is out of scope for visual redesign in this spec beyond what
the mode toggle gives it. The list works; only the toggle wiring is
new.

## 6. Implementation phases

| Phase | Scope | Files (≤5/phase) | Verify |
|---|---|---|---|
| **P0** — This spec | `docs/bento-builder-modal-redesign-spec.md` | this file | n/a |
| **P1** — Mode toggle + modal frame | Add `mode` state to modal; add segmented control; collapse to single column; resize modal width; wire `mode` prop through to builder; in Preview mode pass `isDraggable=false, isResizable=false` to RGL (no other visual change yet) | `layout-builder-modal.tsx`, `bento-layout-builder.tsx`, `layout-builder-modal.test.tsx` (new — toggle assertions), `bento-layout-builder.test.tsx` (assert RGL props flip) | `tsc`, scoped vitest, manual: toggle hides nothing yet but RGL drag becomes disabled in Preview |
| **P2** — Customize-mode cell polish | Hover-reveal grip/palette/X (default hidden); kill "CELL LABEL (OPTIONAL)" placeholder; render real chunks in cells (replace chunk-name chip block); inline label edit; "Drop a chunk here" only during active dnd-kit drag | `bento-layout-builder.tsx`, possibly new `bento-cell-affordances.tsx`, `render-chunk.tsx` (no change unless mini-fixture needed), `bento-layout-builder.test.tsx` | `tsc`, scoped vitest, forbidden-color lint, manual: hover a cell to see controls; empty cell shows nothing until drag |
| **P3** — Preview mode visuals | When `mode==="preview"`: hide all cell chrome (grip/palette/X), remove cell border, hide resize handles, hide hidden-chunks tray, disable label edit | `bento-layout-builder.tsx`, `layout-builder-modal.tsx`, `bento-layout-builder.test.tsx` | `tsc`, scoped vitest, forbidden-color lint, manual: Preview looks identical to `<BentoGrid>` shipped on the review card |
| **P4** — Hidden-chunks tray redesign | Replace strikethrough chip line with visual chunk cards (mini-previews or icons); horizontal strip below canvas; dnd-kit drag-out still works | `bento-layout-builder.tsx`, possibly new `bento-hidden-chunks-tray.tsx`, `bento-layout-builder.test.tsx` | `tsc`, scoped vitest, forbidden-color lint, manual: tray cards drag into cells |

Each phase ships as its own commit on `audit/overnight-01`.

P0 lands first (this commit). P1 is the load-bearing one — it
introduces the mode plumbing without changing visuals, so we can ship
and verify the toggle works before stacking P2/P3/P4 on top.

## 7. Acceptance criteria

Verifiable at HEAD after all phases land. Each row pinned to a phase.

- [x] **(P1)** Modal renders a segmented control with options
      `Customize` and `Preview`. Default is `Customize`. Clicking
      `Preview` flips the builder's underlying RGL props to
      `isDraggable={false} isResizable={false}`.
- [x] **(P1)** Modal width drops from `1500 px` to `1200 px`
      max-width and renders as a single column (no parallel preview
      pane).
- [x] **(P1)** Builder accepts a `mode: "customize" | "preview"`
      prop. Default value when unset is `"customize"`.
- [x] **(P2)** Cells render real chunk content via `<RenderChunk>` —
      not a chip block of chunk keys. Assertion pins this by checking
      the rendered preview contains a known chunk's real text (e.g.
      compensation cell contains the salary string from the fixture).
- [x] **(P2)** Grip handle, palette icon, and delete button are
      `opacity-0` by default and become `opacity-100` on hover or
      focus-within. Test asserts the initial DOM state.
- [x] **(P2)** The literal string `"CELL LABEL (OPTIONAL)"` no
      longer appears in the DOM. `expect(queryByText(/cell label/i)).toBeNull()`.
- [x] **(P2)** Empty cells with no chunks do **not** render the
      "Drop a chunk here" hint when no dnd-kit drag is active. The
      hint only appears while a chunk is being dragged.
- [x] **(P3)** When `mode === "preview"`: no grip, palette, or X
      buttons exist in the DOM. `queryByRole("button", {name: /delete cell/i})`
      returns null.
- [x] **(P3)** When `mode === "preview"`: hidden-chunks tray is not
      in the DOM. `queryByText(/hidden chunks/i)` returns null.
- [x] **(P3)** Preview mode visually matches `<BentoGrid>` for the
      same draft. Smoke: render `<BentoGrid layout={draft}>` and the
      builder in preview mode side-by-side in a Vitest snapshot or
      Playwright visual diff; pixel-diff under threshold.
- [x] **(P4)** Hidden chunks render as visual cards (not strikethrough
      chips). Assertion pins absence of `line-through` Tailwind class
      and presence of card-shaped DOM elements.
- [x] Type-check clean (`pnpm exec tsc --noEmit --pretty false`).
- [x] Full opportunity test scope passes (`pnpm exec vitest run
      src/components/opportunities 'src/app/[locale]/(app)/opportunities'
      src/lib/opportunities` → 24 files, 232 tests).
- [x] Forbidden-color lint clean (`node apps/web/scripts/forbidden-color-lint.cjs`).

## 8. Risks

| Risk | Mitigation |
|---|---|
| Removing the parallel preview pane removes a reference point users rely on while editing | The Customize mode renders real chunks in-cell — the cells *are* the preview. The Preview toggle gives users an unambiguous "clean" view on demand. Watch for confusion in the first week and add an inline "preview" hint if needed. |
| Rendering real chunks in editor cells increases DOM weight per cell | `<RenderChunk>` is already used by `<BentoGrid>` on the shipped card — same render cost. We're just calling it from the editor too. |
| Hover-reveal affordances are hard to discover on touch devices | Touch devices use tap-to-focus (which triggers `focus-within`) to reveal controls. Mobile already uses the priority list, not the grid, so this is desktop-only. |
| Mini-preview cards in hidden-chunks tray are expensive to render | If perf is an issue, fall back to flat icons + label rather than live `<RenderChunk>` calls. Decide in P4 by spiking both. |
| `mode` state confused with the existing `device` tab state | Two orthogonal axes: device = desktop/mobile (data + layout), mode = customize/preview (presentation). Document in the builder JSDoc; test both axes independently. |

## 9. Out of scope (future)

- Saved layout presets ("Recruiter view" / "Engineer view").
- AI-suggested cell composition.
- Drag a chunk *between* hidden tray and any cell across mode boundaries.
- A tablet-specific mode.
- Per-opportunity-source layouts.
- Inline tone editing without opening the palette popover.

## 10. Open questions

- **Q1**: Hidden-chunks tray placement — bottom strip vs right drawer?
  Bottom strip wins on draggability into top-row cells; right drawer
  wins on screen-real-estate efficiency. Spec assumes bottom strip;
  revisit in P4 if cramped.
- **Q2**: Should the Preview mode include a thin "viewing preview"
  banner at the top of the canvas to make the mode obvious? Or is
  the segmented control enough? Default: segmented control only;
  add banner if user testing shows confusion.
- **Q3**: When the user starts a dnd-kit chunk drag in Customize
  mode, should the tray cards swap to "drop here to remove" affordance?
  Default: no — the tray is the source, not a target. Removal happens
  by dragging chunk out of a cell *to* the tray.
