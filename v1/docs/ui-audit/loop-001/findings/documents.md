# `documents` — `/en/documents`

**Source:** `apps/web/src/app/[locale]/(app)/documents/page.tsx` (3-line redirect)
**Effective render source:** `apps/web/src/app/[locale]/(app)/bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/documents-1280.png`
- 1440: `../screenshots/documents-1440.png`
- 1920: `../screenshots/documents-1920.png`

## Findings

### High

- **[H1]** `/documents` is a 308-redirect to `/bank` (`apps/web/src/app/[locale]/(app)/documents/page.tsx:3-9`), same as `/upload`. The sidebar still labels the active item "Documents" because the bank page sets `title={a11yT("documents")}` (`apps/web/src/app/[locale]/(app)/bank/page.tsx:1461`). So both `/documents` and `/bank` render identical UI titled "Documents". Pick one route as canonical; the duality breeds confusion in deep links, sitemaps, and analytics. All widths.

### Medium

- **[M1]** Same duplicated toasts as upload — "Could not load source files" appears twice (`apps/web/src/components/bank/source-documents.tsx:67`). All widths.
- **[M2]** Same dual-channel error reporting — page-level `ErrorState` ("Failed to load documents") AND a toast for the same fetch failure. All widths.

### Low

- **[L1]** Header gap at 1920 same as upload (`PageHeader` `xl:flex-row` with no `max-w` on the spacer). 1920 only.

## Cross-cutting observations

- Same as `upload.md`: `/documents` and `/upload` are paper-thin redirect routes. The bank page is the single source of truth — but it's titled "Documents" via translation, not "Bank". The naming conflict between the route, the sidebar label, the page title, and the brand pluralization ("documents" vs "bank entries") is a UX hazard.
- Reaffirms the case for shared error-reporting policy (in-page error state OR toast, never both).

## Console / runtime

- Dev-env API 500s + likely intl warnings (skip per brief).
