# `bank` — `/en/bank`

**Source:** `apps/web/src/app/[locale]/(app)/bank/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/bank-1280.png`
- 1440: `../screenshots/bank-1440.png`
- 1920: `../screenshots/bank-1920.png`

## Findings

### High

- **[H1] [FIXED]** (loop-001 H1) Stacked duplicate toasts gone. Only one "Could not load source files / Failed to fetch source documents" toast renders bottom-right at all widths. Loop-003 B2 `useErrorToast` dedupe verified working on the exact route that originally surfaced the bug.
- **[H2] [STILL]** (loop-001 H2) Two error surfaces for the same root cause persist: full-width red `ErrorState` card ("Failed to load documents / Failed to fetch entries / Try Again") + bottom-right toast. Pick one channel — right now it still reads as a runaway error system. All widths.

### Medium

- **[M1] [STILL]** (loop-001 M1) Header action group stranded at 1920 — `+ Add Entry / From Drive / Upload` cluster sits ~1100px from the title with empty space between. `PageHeader` (`apps/web/src/components/ui/page-layout.tsx`) needs a `max-w-screen-xl` cap or a different alignment strategy at xl+. 1920 only.
- **[M2] [STILL]** (loop-001 M2) Route `/bank` + sidebar label "Documents" + page title "Documents" + description "Store reusable resumes…" + type name `BankEntry` is still incoherent. Naming alignment unresolved. All widths.
- **[M3] [STILL]** (loop-001 M3) Degraded-mode fallback still missing — when the API fails, only "Try Again" is offered. No manual entry CTA, no Drive picker fallback visible above the fold. All widths.

### Low

- **[L1] [STILL]** (loop-001 L1) Toast icon tile uses a slightly darker pink than the surrounding soft-pink toast surface, while the in-page `ErrorState` card uses a flat red. Minor visual inconsistency. All widths.

## Cross-cutting observations

- **B2 dedupe verified.** Confirms loop-003 fix landed on the canonical offender.
- **`ListItemCard` extraction still pending.** Bank's `chunk-card.tsx` and answer-bank's inline `AnswerCard` remain independently styled. Both wrap in `VirtualGrid` — extracting a shared inner card surface would cut real duplication.
- **`PageHeader` 1920 stranded actions** is a multi-route issue (bank, answer-bank, documents, upload, opportunities review). Worth one fix to `page-layout.tsx`.
- **Redirect-only route chrome** (`/upload`, `/documents`) still wears full sidebar + SEO; see `upload.md` cross-cutting.

## Console / runtime

- Dev-env 500s on `/api/bank` + `/api/bank/documents` (skip per brief).
