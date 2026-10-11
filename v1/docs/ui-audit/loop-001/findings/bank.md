# `bank` — `/en/bank`

**Source:** `apps/web/src/app/[locale]/(app)/bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/bank-1280.png`
- 1440: `../screenshots/bank-1440.png`
- 1920: `../screenshots/bank-1920.png`

## Findings

### High

- **[H1]** Two identical "Could not load source files / Failed to fetch source documents" toasts stack in the bottom-right at all widths. Source: `apps/web/src/components/bank/source-documents.tsx:58-74` — `fetchDocuments` runs in a `useEffect` keyed on `refreshKey`, and the page bumps `refreshKey` once on mount alongside the initial fetch, so the same error fires twice. There is no toast dedupe in `useErrorToast`. All widths.
- **[H2]** Two error surfaces for the same root cause — a full-width red `ErrorState` card ("Failed to load documents / Failed to fetch entries / Try Again") inside the page (`apps/web/src/app/[locale]/(app)/bank/page.tsx:1614`) AND the bottom-right toast(s). Pick one channel per failure; right now this looks like a runaway error system. All widths.

### Medium

- **[M1]** Header action group ("+ Add Entry / From Drive / Upload") sits ~1100px to the right of the title at 1920, leaving the middle of the header empty. `PageHeader` (`apps/web/src/components/ui/page-layout.tsx:60`) has no `max-w` cap or grid; it just `xl:justify-between`s. Either cap header width to e.g. `max-w-screen-xl` or pull actions back under the title at large widths. 1920 only.
- **[M2]** The page is titled "Documents" (via `a11yT("documents")` at `bank/page.tsx:1461`) on a route called `/bank` with sidebar label "Documents". The sub-brand split between `Documents` (sidebar) / `Bank` (route) / "documents" (header) / "entries" (description) / `BankEntry` (types) is incoherent. A user reading the description "Store reusable resumes, projects, achievements, and career notes" has no glossary connection to "bank". Naming alignment should land on a single noun. All widths.
- **[M3]** Empty / error states bypassed because the fetch errored — but the page still renders the description "Store reusable resumes, projects, achievements, and career notes for tailored applications" above the error card with no degraded-mode fallback (no Drive picker, no manual entry CTA visible without scrolling). When the API is down, the user sees only "Try Again" — no progressive disclosure. All widths.

### Low

- **[L1]** Toast cards use a soft-pink surface with no border-color on the icon tile that matches the surface tint (icon tile is a slightly darker pink). Inconsistent with the in-page `ErrorState` card which uses a single flat red surface. Low-priority visual nit. All widths.

## Cross-cutting observations

- **Empty-state pattern is shared.** `bank` uses `StandardEmptyState` (`bank/page.tsx:1621, 2248, 2463`) and `answer-bank` uses the same `StandardEmptyState` (`answer-bank/page.tsx:610`). The shared component lives at `apps/web/src/components/ui/page-layout.tsx:381`. **Good — no DRY work needed for empty states.** Both pages also use the same `ErrorState` (`apps/web/src/components/ui/error-state.tsx`).
- **List-item rendering is NOT shared.** Bank entries render via a custom `EntryCollection` that delegates to `chunk-card.tsx` in `components/bank/`. Answer-bank entries render through `AnswerCard` (defined inline in `answer-bank/page.tsx:676+`). They both wrap items in `VirtualGrid` (`components/ui/virtual-list.tsx`) but the card surfaces themselves are independently styled. **High DRY value:** extract a shared `ListItemCard` or `EntryCard` primitive that both use as the inner surface (rounded border, hover state, action-row affordances).
- **File upload affordance** is single-source: bank uses `<UploadOverlay onComplete=...>` (`components/bank/upload-overlay.tsx`) for drag-and-drop and a hidden `<input type="file" ref={fileInputRef}>` for the Upload button. Since `/upload` redirects to `/bank`, there is no second dropzone to share with. Good.
- **Toast dedupe is missing system-wide** — every page that does a `useEffect` fetch + retry pattern is at risk. `useErrorToast` (`hooks/use-error-toast.ts`) should de-dupe by title within a short window.
- **Page header at large widths.** Both bank and answer-bank put the action group flush right with no horizontal cap. 1920 looks stranded across all `PageHeader` users.
- **Route/title naming.** Same point as documents.md — single noun, please.

## Console / runtime

- Dev-env 500s on `/api/bank` + `/api/bank/documents` (skip per brief).
- Likely intl message-missing + hydration nonce warnings (skip per brief).
