# `extension-connect` — `/en/extension/connect`

**Source:** `apps/web/src/app/[locale]/(app)/extension/connect/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/extension-connect-1280.png`
- 1440: `../screenshots/extension-connect-1440.png`
- 1920: `../screenshots/extension-connect-1920.png`

## Loop-001 H/M status

- **[M1 page renders inside full app shell]** — `[STILL]`. Sidebar, "Capture jobs from any site" promo, profile dropdown all still present in all three captures. Page still lives under `(app)` segment.
- **[M2 only one actionable button on error]** — `[STILL]`. Card has Try Again + "Install it" link; still no contact / status-page guidance.
- **[M3 success vs. error rely on color only]** — `[STILL]` (error rendered in capture; success shape unchanged in source). `CheckCircle` (success) and `AlertCircle` (error) at the same size in the same `CenteredPagePanel` slot.

## Findings

### High

- _(none)_

### Medium

- **[M1]** (Loop-001 M1) Full app shell still rendered around the connection-trust card. Sidebar, profile, promo card visible. Move route under `(marketing)` or a dedicated `(handshake)` segment. Width: all.
- **[M2]** (Loop-001 M2) Error card still missing "If this keeps happening" guidance / status-page link. Width: all.
- **[M3]** (Loop-001 M3) Success vs. error state rely entirely on icon color. Add shape/text differentiation for a11y. Width: all (error captured).

### Low

- **[L1]** (Loop-001 L1) `max-w-md` card sits noticeably off-center at 1920 because the sidebar consumes ~200px; centering is within the remaining space, not the viewport. Width: 1920.
- **[L2]** (Loop-001 L2) Chrome icon-tile (`h-14 w-14 bg-primary/10`) stacked above an outline `AlertCircle` — two different "icon containers" in the same card. Width: all.
- **[L3]** (Loop-001 L3) Try Again (primary) vs. Close tab (outline) — different shapes for terminal actions. Width: error vs. success.

## Cross-cutting observations

- Single-purpose / handshake pages should not inherit the `(app)` sidebar. Same critique applies to any future device-pairing or OAuth-callback page added under `(app)`.
- The 1920 off-center effect would also apply to any other `CenteredPagePanel` page that needs to be visually viewport-centered (sign-in / billing handoff pages). Could pair with a new `(handshake)` segment that drops the sidebar.

## Console / runtime

- 2x `/api/extension/auth` 500s per width (dev expected). Drives the rendered error state. No client-side console errors beyond the network 500s.
