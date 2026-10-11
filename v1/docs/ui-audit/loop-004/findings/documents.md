# `documents` — `/en/documents`

**Source:** `apps/web/src/app/[locale]/(app)/documents/page.tsx` (3-line redirect)
**Effective render source:** `apps/web/src/app/[locale]/(app)/bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/documents-1280.png`
- 1440: `../screenshots/documents-1440.png`
- 1920: `../screenshots/documents-1920.png`

## Findings

### High

- **[H1] [STILL]** (loop-001 H1) `/documents` is still a 308-redirect to `/bank` (`apps/web/src/app/[locale]/(app)/documents/page.tsx:3-9`). Both `/documents` and `/bank` render identical UI titled "Documents". Pick one canonical route; the duality keeps muddying deep links, sitemaps, and analytics. All widths.

### Medium

- **[M1] [FIXED]** (loop-001 M1) Duplicate toasts collapsed to one — loop-003 B2 dedupe verified. Single "Could not load source files" toast at all widths.
- **[M2] [STILL]** (loop-001 M2) Dual-channel error reporting (in-page `ErrorState` + toast) for the same fetch failure persists. All widths.

### Low

- **[L1] [STILL]** (loop-001 L1) Header gap at 1920 — same `PageHeader` stranded-actions issue as `upload`/`bank`. 1920 only.

## Cross-cutting observations

- **Same as `upload.md`.** `/documents` is a paper-thin redirect; the canonical route is `/bank`. Sidebar label still reads "Documents" via the bank page's `a11yT("documents")` title. Route name vs. sidebar label vs. page title vs. brand pluralization ("documents" vs "bank entries") naming conflict is unresolved — see `bank.md` M2.
- **One channel per failure surface** is still the right call (in-page card OR toast, not both).

## Console / runtime

- Dev-env API 500s (skip per brief).
