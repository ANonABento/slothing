# `upload` — `/en/upload`

**Source:** `apps/web/src/app/[locale]/(app)/upload/page.tsx` (4-line redirect)
**Effective render source:** `apps/web/src/app/[locale]/(app)/bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/upload-1280.png`
- 1440: `../screenshots/upload-1440.png`
- 1920: `../screenshots/upload-1920.png`

## Findings

### High

- **[H1]** `/upload` is dead — it 308-redirects to `/bank` (`apps/web/src/app/[locale]/(app)/upload/page.tsx:3-5`). The screenshots are literally bank's error state. There is no upload-specific landing page. If `/upload` is meant to be a discoverable surface (e.g. linked from onboarding emails or sidebar), the redirect strips that intent. Either remove the route entirely from the codebase + sidebar/SEO, or repoint it to a focused upload-only view — the current half-life is misleading. All widths.

### Medium

- **[M1]** Stacked duplicate error toasts — "Could not load source files / Failed to fetch source documents" renders twice in the bottom-right at all widths. Source: `apps/web/src/components/bank/source-documents.tsx:67` fires `showErrorToast` once per failed fetch, and the bank effect / refresh-key path triggers two fetches in dev. Even in prod, a single API failure shouldn't surface twice. All widths.
- **[M2]** Page-level `ErrorState` ("Failed to load documents") + bottom-right toast cover the same failure twice. The user gets one in-page error card and one toast for the same root cause; pick one channel per failure surface. All widths.

### Low

- **[L1]** Page header at 1920 has the action group (`+ Add Entry / From Drive / Upload`) tightly packed to the right of the description, leaving a wide stranded gap in the middle. `PageHeader` (`apps/web/src/components/ui/page-layout.tsx:60`) uses `xl:flex-row xl:items-end xl:justify-between` with an unbounded gap. Looks fine at 1280/1440 where the title column fills more horizontal space. 1920 only.

## Cross-cutting observations

- **Redirect-only routes:** `upload` and `documents` are both `redirect()` shells (`apps/web/src/app/[locale]/(app)/upload/page.tsx`, `documents/page.tsx`). This is the same pattern as the legacy `/builder`, `/tailor`, `/cover-letter` redirects to `/studio` per CLAUDE.md. Worth auditing whether any of these still need to exist, or if the sidebar should stop linking to them.
- **Toast spam from concurrent fetches:** `showErrorToast` has no dedupe. Every page that polls or refreshes risks the same bug.

## Console / runtime

- Dev-env API 500s on `/api/bank` and `/api/bank/documents` (skip per task brief).
- Likely hydration/intl warnings (skip per task brief).
