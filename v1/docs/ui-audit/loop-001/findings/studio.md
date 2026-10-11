# `studio` — `/en/studio`

**Source:** `apps/web/src/app/[locale]/(app)/studio/page.tsx`
**Widths audited:** 1280 / 1440 / 1920 (viewport-only — Studio uses fixed-height columns with internal scroll)
**Loop:** 001

## Screenshots

- 1280: `../screenshots/studio-1280.png`
- 1440: `../screenshots/studio-1440.png`
- 1920: `../screenshots/studio-1920.png`

## Findings

### High

- **[H1]** Document canvas at 1920 is uncapped, so the empty-state CTA "Select entries from your bank" sits in the dead center of an 1100px-wide whitespace, dwarfed by the surrounding chrome. The canvas container is `flex-1` with no `max-w` (`apps/web/src/app/[locale]/(app)/studio/page.tsx:165-174`); the resume preview underneath fits a fixed page width but the empty state has no width constraint of its own. Wrap the empty-state inner block in `max-w-md` (or read the active template's intrinsic page width) so the CTA reads as "the resume body" instead of "a button floating in a void". 1920 only.
- **[H2]** Save-status badge ("Saved Just now") wraps to its own row above the Export button at 1280 (`apps/web/src/components/studio/studio-header.tsx:228-498`). The header uses `flex flex-wrap` with no priority order, so the badge gets pushed to a second line under the help text. Visible at 1280; mostly OK at 1440/1920. Consider rendering save-status in a dedicated slot left of the export action, or hiding the help text when the badge has wrapped.
- **[H3]** Export help text "Select bank entries or edit the resume to enable export." (`studio-header.tsx:411-415`) renders as a wrapped two-line caption to the right of the disabled Export button at 1280. Combined with the wrapped save-status badge, the header takes ~80px vertical at 1280 vs ~56px at 1440. Layout jumping at the breakpoint. 1280 only.

### Medium

- **[M1]** Drawer toggle affordances are *almost* symmetric but not identical. Files panel collapsed bar is `w-12` with a single `PanelLeftOpen` button + a `+` create-affordance (`studio-file-panel.tsx:84-110`). AI panel collapsed bar is `w-12` with a `PanelRightOpen` button **plus three contextual quick-launch buttons** (Sparkles / Wand2 / FileText at `ai-assistant-panel.tsx:617-653`). Visually inconsistent: a user looking at the screen sees a tall, busy right rail vs. a short, calm left rail. Either trim the AI quick-launchers or add a couple to the files rail (e.g., quick-create / quick-pick from bank).
- **[M2]** Save-status badge color logic (`studio-header.tsx:472-477`) treats `saved && draftIsSaved` as success-green, otherwise warning-yellow even when the actual status is "saving". So while a user types and the debounced save kicks in, the badge flashes warning-yellow with a spinning Loader icon. Should be `info`/`muted` while saving, only warn on stale-draft.
- **[M3]** "Add from bank" button width and spacing — full-width pill button (`studio/page.tsx:147-159`) inside the left drawer is great, but the surrounding `px-4 py-3` wrapper duplicates the `px-4 py-3` of the section above (`Sections / 0 of 0 entries selected`). Two adjacent equal-padding blocks read as one ambiguous container. Reduce or merge.
- **[M4]** Template picker positioning logic uses `getBoundingClientRect` + manual `position: fixed` calculations (`studio-header.tsx:159-209`) — this re-renders on every scroll and resize. Functional but ad-hoc; this is where a Popover/Floating-UI primitive (already in shadcn ecosystem) would replace ~50 lines of imperative DOM math.
- **[M5]** "Saved Just now" badge updates by polling `setNow(nowEpoch())` every 5 seconds (`studio-header.tsx:134-137`) — same `<TimeAgo />` use case the rest of the app standardised on. Use the shared component.
- **[M6]** AI Assistant panel header has two icons in the top-right (`Sparkles` decorative + `PanelRightClose` collapse — `ai-assistant-panel.tsx:668-683`), while the Files panel header has the `+ New` button + `PanelLeftClose` (`studio-file-panel.tsx:130-146`). Different control densities for parallel panels. Sparkles icon is decorative only; drop it.

### Low

- **[L1]** "Sections / Drag to reorder" hint text is small and right-aligned in the same row as the Sections heading (left-aligned) — minor readability nit at 1280 where the column is narrow. Consider stacking on a second line.
- **[L2]** "0 of 0 entries selected" copy reads as a stuck state when there's literally nothing to select. Use the empty-state hint pattern from `studio/page.tsx:141-145` ("Select entries to build your first draft.") here too.
- **[L3]** Right-edge of the AI panel touches the viewport edge with no scrollbar gutter at 1920 — minor, but consistent gutter would feel less crammed.

## Cross-cutting observations

- **Drawer collapsed-state pattern.** Both panels independently implement "collapsed → 12-wide column with vertical icon stack, expanded → fixed-width column with content". This is the same architecture as the **app sidebar** in `apps/web/src/components/layout/sidebar.tsx`. A shared `<CollapsibleRail>` primitive would normalise the open/close icon, the collapsed icon column spacing, and the keyboard shortcut wiring. High-value extraction.
- **Imperative popover positioning** (template picker `studio-header.tsx:159-209`) is the kind of manual `getBoundingClientRect` math that deserves a shared `<Popover>` / `<Dropdown>` primitive — would also benefit the `Export ▾` menu in the same file (`studio-header.tsx:416-465`), which today uses `absolute right-0` with a `<div className="fixed inset-0">` overlay click-catcher. Two different popover implementations, ten lines apart.
- **Save-status state machine** (`studio/save-status.ts`) is well-isolated. The visual mapping in `studio-header.tsx:472-477` should be hoisted into the same module so the colour/icon decisions live next to the state.
- **Page-width ergonomics.** Studio is the only `<PageWorkspace>` (`apps/web/src/components/ui/page-layout.tsx:132-144`) — fixed `h-screen` flex container. Other "wide" pages use `PageHeader` + `PageContent` and suffer the 1920 stranded-actions problem. Studio doesn't, because its header is a custom `flex` row. The split is fine; just note that any future Studio-style workspace (interview prep? calendar?) shouldn't reinvent the chrome.
- **Quick-launch icon rail** in the collapsed AI panel is a nice pattern that could move into the file panel collapsed state too — preview-only mode toggle, version history quick-jump, etc. Today only one of the two panels surfaces it.

## Console / runtime

- Dev-env 500s on Studio data endpoints (skip per brief).
- intl/hydration warnings (skip per brief).
