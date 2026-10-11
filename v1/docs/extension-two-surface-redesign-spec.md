# Extension Two-Surface Redesign Spec

Date: 2026-05-16

## Goal

Make the Slothing extension feel like one coherent product with two surfaces:

- **Toolbar control center**: account, health, current-tab state, and global
  navigation.
- **In-page job workspace**: job-specific actions, assistant, answer bank, and
  application tools.

The toolbar popup should never feel like a second copy of the in-page panel.
The in-page panel should never feel disconnected from toolbar auth/profile
state.

## Current Problems

- Toolbar and in-page panel can disagree. Example: toolbar says no job detected
  while the page panel is showing a job.
- Toolbar can show a connected user while the in-page panel says profile needed.
- Both surfaces currently carry overlapping identity and extension-brand
  treatment without a clear role split.
- The in-page panel covers host-page content and needs proper docking,
  drag-to-move, and restore behavior.
- The extension uses generated icon PNGs, but UI branding should use the same
  Slothing logo/mark assets as the web app.

## Product Model

### Toolbar Popup: Control Center

Use for:

- Connection status.
- Profile summary and score.
- Current-tab diagnosis.
- Opening/restoring the in-page job workspace.
- Refreshing the active tab when the content script is not attached.
- Dashboard, review queue, settings, disconnect.
- Bulk-board import entry points when the active page is a listing board.

Do not use for:

- Tailor resume.
- Generate cover letter.
- Save current job.
- Auto-fill current application.
- Chat/AI assistant.
- Answer-bank search.

Those belong in the in-page workspace because they are contextual and often
need to stay visible while the user reads or edits the host page.

### In-Page Panel: Job Workspace

Use for:

- Current job identity: title, company, location/source.
- Match score/profile status.
- Tailor resume.
- Cover letter.
- Save job.
- Auto-fill, when fields are detected.
- AI assistant.
- Answer bank.
- Action result notices.

Do not use for:

- Full account management.
- Full settings.
- Global dashboard navigation except post-action deep links.

If auth is missing, show a compact reconnect CTA inside the workspace, not a
full account screen.

## Shared State Contract

Both surfaces should derive their UI from one current-tab context. Add a
background/content bridge that can return the same shape to popup and sidebar.

```ts
type ExtensionSurfaceContext = {
  auth: {
    state: "connected" | "session_lost" | "disconnected";
    profile: ExtensionProfile | null;
    profileScore: number | null;
    syncedAt: string | null;
  };
  tab: {
    id: number | null;
    url: string | null;
    host: string | null;
    supported: boolean;
    contentScriptReady: boolean;
    needsRefresh: boolean;
  };
  page: {
    job: ScrapedJob | null;
    hasApplicationForm: boolean;
    detectedFieldCount: number;
    bulkSource:
      | null
      | {
          source: "waterlooworks" | "greenhouse" | "lever" | "workday";
          rowCount: number;
          hasNextPage: boolean;
        };
  };
  workspace: {
    visible: boolean;
    collapsed: boolean;
    dock: "right" | "left" | "floating";
    position: { x: number; y: number } | null;
  };
  diagnostics: {
    lastDetectionAt: string | null;
    lastError: string | null;
  };
};
```

Acceptance:

- Toolbar and workspace show the same job/profile state.
- A job visible in the workspace never appears as "No job detected" in the
  toolbar.
- A connected profile in the toolbar never appears as "Profile needed" in the
  workspace unless profile loading truly failed and both surfaces show the same
  degraded state.

## Toolbar Popup Layout

Width: keep around 360px.

Structure:

1. Header
   - Slothing mark from web brand assets.
   - Product name.
   - Compact connection pill.
2. Profile strip
   - Initial/avatar or profile mark.
   - Name/email.
   - Current role/company.
   - Small score pill.
3. Current tab card
   - One of:
     - `Job workspace active`
     - `Job detected`
     - `Application detected`
     - `Bulk board detected`
     - `Page needs refresh`
     - `Unsupported page`
   - If job exists: title and company, one or two lines max.
   - If app form exists: field count.
4. Primary command row
   - `Open job tools` when a job exists.
   - `Open application tools` when only a form exists.
   - `Refresh tab` when content script is missing on a supported host.
   - `Review imports` after bulk import.
5. Bulk import card
   - Only render on listing/board pages.
   - Keep visible/paginated actions here because they are page-level, not
     single-job actions.
6. Footer
   - Dashboard.
   - Settings.
   - Disconnect.

Empty state:

- Replace the large dashed supported-sites panel with a compact status card.
- Copy: `Unsupported page` or `Open a supported job page`.
- Supported sites can be a muted one-line hint, not a chip cloud.

## In-Page Workspace Layout

Default width: 360px.
Minimum desktop viewport: keep current desktop-only behavior unless a mobile
bottom sheet is explicitly designed later.

Structure:

1. Header/drag handle
   - Slothing mark.
   - Source label.
   - Job title.
   - Company/location.
   - Controls: dock left, dock right, float, collapse, close.
2. Status strip
   - Match score or reconnect/profile-needed state.
   - Use compact horizontal treatment instead of a large circle.
3. Primary actions
   - Tailor resume.
   - Cover letter.
   - Save job.
   - Auto-fill only when fields exist.
   - If no fields exist, show `No fields found` as disabled secondary state.
4. AI assistant
   - Suggested prompt chips.
   - Input.
   - Streamed answer.
   - Copy/use/save actions.
5. Answer bank
   - Search.
   - Results with Copy/Apply.

Visual rules:

- Avoid card-inside-card stacking.
- Use flat sections separated by rule lines or subtle paper bands.
- Primary action should be ink background, cream text.
- Secondary actions should be paper with rule border.
- Use icon buttons for collapse, close, dock, and float controls.
- Do not use text arrows like `->` for command affordances.

## Docking and Positioning

The browser toolbar popup cannot be made draggable or docked; Chrome/Firefox
own that window. Docking applies to the in-page workspace.

Workspace modes:

- `right`: fixed to right side, current default.
- `left`: fixed to left side.
- `floating`: draggable panel with explicit x/y.
- `collapsed`: compact rail/button at the chosen dock side or floating position.
- `dismissed`: hidden for the current domain until restored from toolbar.

Controls:

- Header drag starts floating mode.
- Dock-left button pins to left.
- Dock-right button pins to right.
- Float button keeps current panel position and enables drag.
- Collapse keeps dock/position.
- Close dismisses for current domain.

Persistence:

- Persist per normalized hostname:
  - dock mode.
  - floating position.
  - collapsed state.
  - dismissed state.
- Clamp floating position to viewport on resize.
- If viewport becomes too small, fall back to collapsed rail or hide at the
  existing desktop breakpoint.

Toolbar integration:

- Toolbar `Open job tools` sends `SHOW_SLOTHING_PANEL`.
- If dismissed, restore the domain.
- If collapsed, expand it.
- If content script is missing, show `Refresh tab`.
- If no job is detected but content script is ready, show diagnostics instead
  of pretending the extension is disconnected.

## Logo and Brand Assets

Use the web app's public brand assets as the source of truth:

- `apps/web/public/brand/slothing-mark.png`
- `apps/web/public/brand/slothing-logo.png`

Implementation requirement:

- Do not hotlink `https://slothing.work/brand/...` from extension UI.
- Copy the brand assets into the extension bundle at build time, for example:
  - source: `apps/web/public/brand/slothing-mark.png`
  - output: `apps/extension/dist/brand/slothing-mark.png`
  - output: `apps/extension/dist-firefox/brand/slothing-mark.png`
- Reference bundled assets with `chrome.runtime.getURL("brand/slothing-mark.png")`
  where needed.
- Keep generated extension icon PNGs for browser install/icon requirements, but
  use the brand mark/logo inside UI surfaces.

Acceptance:

- Toolbar header uses the real Slothing mark, not a text `S` square.
- In-page workspace header uses the same mark.
- Connect/options pages should use the same mark/logo where appropriate.
- Asset dimensions are stable so headers do not shift while images load.

## Quality-of-Life Requirements

- Toolbar can always reopen the in-page workspace when a job is detected.
- Toolbar can restore a dismissed workspace for the current domain.
- Toolbar can refresh the current tab when content script injection failed.
- In-page workspace can be moved away from host-page content.
- Docking choice survives reloads on the same domain.
- Close/dismiss is recoverable from toolbar.
- Current job title/company are visible in both toolbar and workspace.
- State copy is concrete: avoid generic "No job detected" when the content
  script is simply not attached.

## Implementation Plan

### Phase 1: Shared Context

- Add `GET_SURFACE_CONTEXT` message.
- Build context in background by combining auth storage and active-tab status.
- Let content script respond with job/form/sidebar state.
- Replace popup's separate page probes with this context where possible.
- Add tests for connected/profile/job consistency.

### Phase 2: Workspace Positioning

- Extend sidebar storage with per-domain dock/position/collapsed state.
- Add dock controls to workspace header.
- Make drag set dock mode to `floating`.
- Clamp on resize.
- Ensure `SHOW_SLOTHING_PANEL` restores dismissed/collapsed panel.

### Phase 3: Toolbar Redesign

- Remove supported-site chip cloud from the main state.
- Replace with current-tab status card.
- Add `Open job tools`, `Refresh tab`, and `Review imports` primary commands.
- Keep bulk-board import cards only when relevant.
- Use bundled brand mark.

### Phase 4: Workspace Redesign

- Replace large score circle with compact score strip.
- Flatten section layout.
- Replace text arrows with icon affordances.
- Tighten header and long-title wrapping.
- Add profile/auth degraded states that match toolbar context.
- Use bundled brand mark.

### Phase 5: Asset Pipeline

- Update extension webpack copy patterns or icon-generation script to copy web
  brand assets into both Chrome and Firefox builds.
- Add asset existence check to build or smoke tests.
- Document asset source of truth in `apps/extension/README.md`.

### Phase 6: Verification

Automated:

```bash
pnpm --filter @slothing/extension type-check
pnpm --filter @slothing/extension test:run
pnpm --filter @slothing/extension build:chrome
pnpm --filter @slothing/extension build:firefox
pnpm --filter @slothing/extension check:bundle-size
pnpm --filter @slothing/extension test:e2e
pnpm --filter @slothing/extension smoke:firefox
pnpm dlx web-ext@latest lint -s apps/extension/dist-firefox
```

Manual:

- Chrome: LinkedIn job, WaterlooWorks job, Greenhouse/Lever/Workday board.
- Firefox: connect flow, LinkedIn job, WaterlooWorks job.
- Drag panel over several host pages and confirm no off-screen placement.
- Dock left/right, reload, confirm persistence.
- Dismiss from panel, restore from toolbar.
- Open toolbar on unsupported page and confirm truthful state.

## Non-Goals

- Making the browser toolbar popup draggable.
- Building a mobile workspace sheet in this pass.
- Rewriting scraper logic as part of the redesign.
- Replacing browser extension icon generation.
- Adding a new UI dependency just for icons.

## Definition of Done

- The toolbar and in-page workspace have distinct, non-overlapping roles.
- They agree on auth/profile/job/page state.
- The workspace can be opened, restored, moved, docked, collapsed, and dismissed
  predictably.
- Brand assets come from `apps/web/public/brand`.
- All extension gates pass.
- Chrome and Firefox manual passes are documented with screenshots or notes.
