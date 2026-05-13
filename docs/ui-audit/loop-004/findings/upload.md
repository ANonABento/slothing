# `upload` — `/en/upload`

**Source:** `apps/web/src/app/[locale]/(app)/upload/page.tsx` (4-line redirect)
**Effective render source:** `apps/web/src/app/[locale]/(app)/bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/upload-1280.png`
- 1440: `../screenshots/upload-1440.png`
- 1920: `../screenshots/upload-1920.png`

## Findings

### High

- **[H1] [STILL]** (loop-001 H1) `/upload` is still a 308-redirect to `/bank` (`apps/web/src/app/[locale]/(app)/upload/page.tsx:3-5`). The screenshots are bank's error state, sidebar highlights "Documents", page title reads "Documents". No upload-specific landing exists. Either delete the route + sidebar/SEO entries, or build a real upload-only view. All widths.

### Medium

- **[M1] [FIXED]** (loop-001 M1) Duplicate "Could not load source files" toasts have collapsed to one — loop-003 B2 `useErrorToast` dedupe is working. Single toast in bottom-right at all widths.
- **[M2] [STILL]** (loop-001 M2) Dual-channel error reporting remains: in-page `ErrorState` ("Failed to load documents") + bottom-right toast ("Could not load source files / Failed to fetch source documents") fire for the same fetch failure. Pick one channel per surface. All widths.

### Low

- **[L1] [STILL]** (loop-001 L1) 1920 header still has a wide stranded gap between description and the `+ Add Entry / From Drive / Upload` cluster. `PageHeader` (`apps/web/src/components/ui/page-layout.tsx`) uses `xl:flex-row xl:items-end xl:justify-between` with no max-width cap on the spacer. 1920 only.

## Cross-cutting observations

- **Redirect-only chrome.** `/upload` and `/documents` both 308 to `/bank` yet still get full sidebar treatment and SEO entries. Same dead-route shape as `/builder`, `/tailor`, `/cover-letter`. Either prune the routes or repoint sidebar / SEO so the redirect chain stops being a user-visible URL.
- **Toast dedupe shipped (B2)** — verified here: only one error toast renders. Worth confirming across other polling pages.

## Console / runtime

- Dev-env API 500s on `/api/bank` and `/api/bank/documents` (skip per task brief).
