# Extension Redesign Screenshot Audit — 2026-05-17

## Scope

This audit covers the Slothing extension redesign goal:

- Toolbar popup as a control center.
- In-page sidebar as the job workspace.
- Options page as a compact Slothing settings surface.
- Brand assets copied from `apps/web/public/brand`.
- Editorial paper/ink/rust visual system across extension surfaces.
- Dock/collapse/floating workspace states.
- Chrome and Firefox smoke coverage.

## Screenshot Set

Generated with:

```bash
pnpm --filter @slothing/extension audit:screenshots
```

Screenshots:

- `screenshots/01-popup-unauthenticated.png` — signed-out popup.
- `screenshots/02-options-authenticated.png` — authenticated options/settings.
- `screenshots/03-popup-unsupported.png` — connected popup on unsupported tab.
- `screenshots/04-popup-job-detected.png` — connected popup with active job
  workspace.
- `screenshots/05-sidebar-right.png` — in-page job workspace docked right.
- `screenshots/06-sidebar-collapsed.png` — collapsed workspace rail.
- `screenshots/07-sidebar-left.png` — workspace docked left.
- `screenshots/08-sidebar-floating.png` — floating workspace.
- `screenshots/09-inline-content-ui.png` — representative injected field
  highlights, confidence popover, suggestions, and toast.

## Visual Findings

Pass:

- Popup and options use the website's warm paper background, Midnight Indigo
  primary action, rust accents, flat cards, and restrained borders.
- Popup and workspace have distinct roles: the popup diagnoses the current tab
  and opens job tools; the job-specific actions live in the in-page workspace.
- Real Slothing brand mark is used in popup, options, and workspace.
- Unsupported-tab copy is truthful and compact.
- In-page workspace uses compact sections and a score/status strip rather than a
  large score circle.
- Dock left, dock right, floating, and collapsed states render without blank or
  broken UI.
- Inline field highlights, confidence UI, suggestion lists, and toasts use the
  same paper/ink/rust palette.

Deferred:

- Host-page content can still be visually covered when docked left or floating.
  This is expected for the current pass because the workspace is an overlay; the
  user can move/dock/collapse it. A future pass could add smarter collision
  avoidance or host-page margin reservation.
- Firefox still reports 2 AMO lint warnings for React DOM's bundled
  `innerHTML` assignments in `sharedUi.js`. Errors are 0; the duplicate React
  DOM copy was removed from `content.js`.
- Bundle sizes are within the current budget but close to the total JS limit.

## Verification

Automated gates run from the repo root:

```bash
pnpm --filter @slothing/extension type-check
pnpm --filter @slothing/extension test:run
pnpm --filter @slothing/extension build:chrome
pnpm --filter @slothing/extension build:firefox
pnpm --filter @slothing/extension check:bundle-size
pnpm --filter @slothing/extension test:e2e
pnpm --filter @slothing/extension smoke:firefox
pnpm dlx web-ext@latest lint -s apps/extension/dist-firefox --output json
```

Results:

- TypeScript: pass.
- Vitest: pass, 28 files / 259 tests.
- Chrome build: pass, with webpack size warnings only.
- Firefox build: pass, with webpack size warnings only.
- Bundle-size gate: pass.
- Chromium e2e: pass, 23 passed / 1 skipped.
- Firefox smoke: pass.
- `web-ext lint`: 0 errors, 2 warnings.

Firefox smoke verified:

- Temporary add-on load.
- Popup unauthenticated state.
- Options page.
- LocalStorage connect callback.
- Authenticated popup state.
- Job-page sidebar.
- Sidebar autofill.
- Save-job import request.
- Disconnect flow.

## Notes

The screenshot command seeds a local test profile and local test API server; it
does not depend on external network access or a real Slothing account.
