# `studio` — `/en/studio`

**Source:** `apps/web/src/app/[locale]/(app)/studio/page.tsx`
**Widths audited:** 1280 / 1440 / 1920 (viewport-only — Studio uses fixed-height columns with internal scroll)
**Loop:** 004

## Screenshots

- 1280: `../screenshots/studio-1280.png`
- 1440: `../screenshots/studio-1440.png`
- 1920: `../screenshots/studio-1920.png`

## Findings

### High

- **[H1] [FIXED]** (loop-001 H1) 1920 empty-state CTA no longer floats in dead center of an 1100px void. The "Select entries from your bank" block is now sized to the resume-page intrinsic width (~580px wide), reading clearly as the resume body. Confirmed at 1920.
- **[H2] [FIXED]** (loop-001 H2) Save-status badge ("Saved Just now") no longer wraps to its own row at 1280. Badge sits to the right of the Export button on the same line at 1280/1440/1920.
- **[H3] [FIXED]** (loop-001 H3) Export help text no longer pushes header layout taller at 1280. Help-text caption renders on a single line under the Export-area cluster; no breakpoint-jumping observed.

### Medium

- **[M1] [STILL]** (loop-001 M1) Drawer asymmetry persists. AI panel collapsed rail still shows three quick-launch buttons (Sparkles / Wand2 / FileText) while the Files panel collapsed rail only shows the open toggle + create. Right rail reads as "tall and busy", left rail as "short and calm". Either trim AI quick-launchers or add equivalents to the file rail. (Cannot verify directly — both panels are open in loop-004 captures — but source unchanged.)
- **[M2] [STILL]** (loop-001 M2) Save-status badge color logic: still flashes warning-yellow during the "saving" debounce window. Should be info/muted while saving, only warn on stale-draft. (Captured screenshot shows the success state, but `studio-header.tsx:472-477` source unchanged.)
- **[M3] [STILL]** (loop-001 M3) "Add from bank" full-width pill button + the "0 of 0 entries selected" row above it both use `px-4 py-3`, reading as one ambiguous container. Visible at all widths in the left drawer.
- **[M4] [STILL]** (loop-001 M4) Template picker still uses imperative `getBoundingClientRect` + `position: fixed` math instead of a Popover/Floating-UI primitive.
- **[M5] [STILL]** (loop-001 M5) Save-status time still polled via `setNow(nowEpoch())` every 5s instead of the shared `<TimeAgo />` component.
- **[M6] [STILL]** (loop-001 M6) Decorative `Sparkles` icon still in the AI Assistant panel header alongside the close icon, while the Files panel header has `+ New` + close. Different control densities for parallel panels. Visible at all widths.

### Low

- **[L1] [STILL]** (loop-001 L1) "Sections / Drag to reorder" hint still small + right-aligned on the same row as the Sections heading at 1280.
- **[L2] [STILL]** (loop-001 L2) "0 of 0 entries selected" copy still reads as a stuck state — would benefit from the empty-state hint pattern used in the canvas.
- **[L3] [STILL]** (loop-001 L3) Right edge of AI panel still touches the viewport at 1920 with no scrollbar gutter.
- **[L4] [NEW]** Center canvas at 1280 is visibly cramped — the resume preview page sits at full template width, leaving only ~12px horizontal padding between the page edge and the inner drawer borders. Consider tightening the page-preview shadow/border or shrinking the preview scale at 1280. 1280 only.

## Cross-cutting observations

- **Drawer asymmetry / `<CollapsibleRail>` extraction** is still the highest-value DRY in this route. Files panel + AI panel + app sidebar all reimplement collapsed-icon-rail behaviour independently.
- **Imperative popover positioning** (template picker + Export ▾ menu, ten lines apart in `studio-header.tsx`) still ships two different popover implementations.
- **Save-status visual mapping** still lives in `studio-header.tsx` instead of next to the state machine in `studio/save-status.ts`.
- **Quick-launch icon rail** in the collapsed AI panel is still a single-panel pattern; would slot into the file panel rail as well.

## Console / runtime

- Dev-env 500s on Studio data endpoints (skip per brief).
