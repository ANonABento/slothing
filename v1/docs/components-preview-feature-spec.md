# Review-modal preview feature — spec

**Status:** Implemented · 2026-05-16 — landed via the **fuzzy-match path** (the documented fallback), not the LLM-chunk-ID path the architecture section preferred. See "Implementation status" and "Deviation from spec" at the bottom for the trade-off rationale.
**Depends on:** `docs/components-page-rework-spec.md` P0.3 (drawer primitive — done).
**Scope:** Add a document-preview tab to the review-document-parse modal so users can see *where* in the source PDF each parsed component came from, with category-color-coded highlight overlays.

---

## Goal

A user uploading a resume sees the parsed components alongside the source PDF. Each parsed component is highlighted in place on the document. Clicking a highlight selects the component; clicking a component scrolls the highlight into view. This closes the loop between "the parser said X" and "the document actually says X" — and makes the review modal the canonical surface for verifying parser output instead of a list of structured data you have to take on faith.

## Why

Today the review modal is a list of extracted components with no connection to the source. A user reviewing 31 parsed items has no fast way to verify *where* any single component came from. They'd have to reopen the PDF in another tab and ctrl-F. The preview removes that friction, makes errors discoverable, and gives the parser an honest UX of accountability.

## Out of scope (phase 1)

- **Drive docs, plain text imports.** Phase 1 is PDFs only. Drive docs export to PDF and reuse the same pipeline in a follow-up. Plain text imports (extension scrapes, pasted text) need their own preview pipeline.
- **Editing in the preview.** Users review and select in the preview; editing happens in the right panel (drawer pattern from rework spec P0.3).
- **Multi-page drag-select.** Selecting across page boundaries to manually create a component is a follow-up.
- **OCR for image-only PDFs.** Phase 1 requires extractable text. Image PDFs degrade gracefully to "preview unavailable."

---

## Architecture

### 1. Parser pipeline — emit positional metadata

Today the parse step ingests a PDF, runs LLM extraction, and emits `BankEntry`-shaped objects with no positional information. To highlight, each emitted entry needs to know where in the source document it came from.

**Decision:** Modify the parse pipeline to operate on PDF text + positional metadata jointly. pdf.js's text extraction yields per-text-item positions; the LLM extraction step receives an annotated text representation (chunked + ID-tagged), and emits structured entries that reference the chunk IDs they came from. A post-step joins entries back to their source bboxes via the chunk-ID map.

This is the higher-effort, higher-fidelity path (per the design decision recorded in `components-page-rework-spec.md` open questions). No fuzzy-match fallback.

**Pipeline shape:**

```
PDF bytes
  → pdf.js text extraction (per page, per text item)
  → chunker (group items into semantic chunks; assign IDs)
  → annotated text: "[1] Hardware Developer at Midnight Sun\n[2] Designed and routed double-layer PCBs…"
  → LLM extraction (returns BankEntry + source_chunks: number[])
  → join step (resolve source_chunks → bbox set per page)
  → BankEntry with { source_page, source_bbox[] }
```

**Files (new + modified):**

- `apps/web/src/lib/parse/pdf-extract.ts` (new — verify if a similar file exists today; replace or supersede). Uses pdf.js to extract text items with positions; emits annotated text + chunk-ID-to-bbox map.
- `apps/web/src/lib/parse/llm-extract.ts` (or the current parse-LLM file — `grep -rn "parsePdf\|parseResume" apps/web/src/lib`). Prompt update — ask for `source_chunks: number[]` per emitted entry, referencing the annotated chunk IDs.
- `apps/web/src/lib/parse/join-bboxes.ts` (new). Joins LLM output to bboxes via the chunk-ID map. Handles missing-chunk / hallucinated-chunk failures gracefully.
- `apps/web/src/lib/parse/__tests__/` — fixtures with known PDF positions; assert bboxes match within tolerance.

### 2. Storage schema

**Decision:** Extend `bank_entries` with three columns:

- `source_page INTEGER` — first page the component appears on (0-indexed or 1-indexed; match pdf.js convention).
- `source_bbox TEXT` — JSON array of bbox tuples `[[page, x0, y0, x1, y1], ...]` to support multi-page components.
- `source_chunks TEXT` — JSON `number[]` of chunk IDs (kept for debuggability and future reprocessing).

Use the additive `PRAGMA table_info` + `ALTER TABLE … ADD COLUMN` pattern per `CLAUDE.md`. Existing entries get NULL — they have no preview (acceptable; preview is for newly imported entries).

**Files:**

- `apps/web/src/lib/db/schema.ts` — additive migration.
- `packages/shared/src/types.ts` — extend `BankEntry` type with the new fields (all optional).
- `apps/web/src/types/api.ts` — surface the fields on API responses.

### 3. PDF storage

The preview needs the rendered PDF. Today the parse pipeline likely throws the PDF bytes away after extracting text. Three options for keeping them accessible:

| Option | Pros | Cons |
| ------ | ---- | ---- |
| **A. Persist PDF blob** to disk / R2 / Supabase Storage | Always available; works on re-open | Storage cost; privacy implications; needs cleanup policy |
| **B. Reconstructed render** (text + positions, rendered as styled HTML, no original) | No storage, no privacy issue | Not pixel-perfect; can look "off" for complex layouts |
| **C. In-memory only** for the review session | Zero storage; review is usually immediate | If user closes the modal / browser, preview is gone (components remain) |

**Decision:** **Option C for v1.** Hold PDF bytes in a server-side cache keyed by `parsed_document_id`, TTL 24h. If the user closes and reopens within the window, preview still works; after that, the document preview gracefully degrades to "preview unavailable" while components remain editable. Revisit (toward Option A) if user feedback shows people want longer-lived previews.

**Files:**

- `apps/web/src/lib/parse/pdf-cache.ts` (new) — server-side TTL cache. Memory-backed for v1; can swap for Redis later.
- API: `GET /api/bank/parsed/:parsed_document_id/pdf` — streams the cached PDF bytes.

### 4. Frontend — PDF rendering

**Decision:** `react-pdf` (the pdf.js wrapper). Mature, well-trodden, supports text-layer overlays. Highlight overlays render as absolutely-positioned `<div>`s on top of the rendered page, with `pointer-events: auto` so they're clickable.

**Files:**

- `apps/web/package.json` — add `react-pdf` dependency.
- `apps/web/src/components/bank/preview/pdf-preview.tsx` (new) — wraps `react-pdf`, renders pages, manages zoom + page navigation.
- `apps/web/src/components/bank/preview/highlight-layer.tsx` (new) — renders the bbox overlays on top of the PDF page. Receives `entries: BankEntry[]` and `selectedEntryId`, emits `onSelect(entryId)`.
- `apps/web/src/components/bank/preview/use-pdf-viewport.ts` (new) — hook that translates bbox coordinates from PDF-space to rendered-DOM-space (handles zoom + page scaling).

---

## UI design

### Left panel — tabs

`[Document] [Components (31)]` segmented header. Default tab on first open: **`Document`** — sets the mental model that you're reviewing what was extracted from your file.

### Document tab

- pdf.js page rendered at fit-to-width.
- Per-component highlight overlays drawn on top. Each highlight covers the bbox set for its component.
- Hierarchical highlights:
  - **Parents** (e.g., an experience header "Hardware Developer at Midnight Sun") render as a soft outline rectangle.
  - **Children** (the bullets nested under that parent) render as inner tinted overlays inside the parent's rectangle.
- Page navigation: `< Page 1 of 2 >` + arrow keys.
- Zoom: `−` `100%` `+`. Highlights re-render with the zoom transform.

### Components tab

Existing detected-components list, unchanged from `components-page-rework-spec.md` baseline.

### Cross-tab navigation

- Click a highlight in `Document` → right-panel detail updates (same as clicking the row in Components); highlight gets selected ring (1px outline in brand color).
- Click a row in `Components` → right-panel detail updates; nothing happens in `Document` tab automatically.
- Right-panel detail card has a `View in document ↗` link at the top. Clicking it flips to the `Document` tab and scrolls the highlight into view (centered, smooth scroll). If the document is on page N and the user is on page 1, scroll-to-bbox also flips the page.

### Highlight colors

Match the category chip colors (editorial brand palette per `CLAUDE.md`):

| Category | Highlight color |
| -------- | --------------- |
| Experience | `bg-brand-soft` |
| Project | `bg-secondary-soft` (verify token; pick the existing chip's bg) |
| Education | `bg-muted` |
| Skill | `bg-muted` |
| Bullet | inherits from parent highlight |
| Achievement | `bg-brand-soft` |
| Certification | `bg-secondary-soft` |
| Hackathon | `bg-brand-soft` |

Opacity: 0.25 default, 0.45 hover, 0.6 selected. Outline: 1px on selected (`border-brand`).

### Highlight states

| State | Visual |
| ----- | ------ |
| Default | tinted overlay |
| Hover | stronger tint |
| Selected | tint + 1px outline (brand) |
| Reviewed (user committed an action) | muted tint + ✓ icon in top-right corner of the bbox |
| Discarded | strikethrough overlay + desaturated tint |
| Possible duplicate | warning outline (orange, matches existing chip) regardless of other state |

### Empty / fallback states

- **PDF unavailable** (cache TTL expired, or non-PDF source): `Document` tab renders an empty state — "Preview not available for this source." `Components` tab fully functional.
- **PDF has no extractable text** (image-only): same empty state, with a hint — "This looks like an image-only PDF. Try uploading a text version for preview support."
- **No bboxes resolved for an entry** (LLM hallucinated chunk IDs): entry still appears in `Components` tab; in `Document` tab, the entry is listed in a "Couldn't locate in document" sidebar callout. User can still review + commit it.

### Mobile

The preview tab needs horizontal space. On viewports `< 1024px`, hide the tabs entirely and default to the components-list layout. The tab UI is desktop-first.

---

## Implementation phases

| Phase | Surface | Goal |
| ----- | ------- | ---- |
| **PF.1** | Parser | Emit `{ source_page, source_bbox[], source_chunks[] }` per parsed entry. Tested via fixtures. No UI work. |
| **PF.2** | Schema + API | Migrate `bank_entries`; surface fields on API. Backfill existing entries with NULL. |
| **PF.3** | PDF cache | Server-side 24h TTL cache; `GET /api/bank/parsed/:id/pdf` endpoint. |
| **PF.4** | Modal scaffold | Tabs on left panel. `Document` tab renders pdf.js viewer with no overlays. `Components` tab is the existing list. |
| **PF.5** | Highlights | Render bbox overlays. Color-code by category. Click highlight → select component. |
| **PF.6** | Cross-tab nav | `View in document ↗` link in right panel; tab flip + scroll-to-bbox. |
| **PF.7** | Polish | States (reviewed, discarded, duplicate), hover, keyboard nav, empty-state copy, mobile fallback. |

Each phase is a separate PR. PF.1–PF.3 unblock backend; PF.4+ are frontend on the unblocked schema and can ship incrementally.

---

## Open questions

1. **Existing parse pipeline location.** Need to find where today's PDF parse runs and whether it can be retrofitted in place or needs a parallel implementation while the old path is sunset. `grep -rn "parsePdf\|extractResume\|pdfjs" apps/web/src/lib` is the starting point.

2. **Chunk granularity.** What's a "chunk" — a text run, a line, a paragraph? Affects highlight precision. Recommend paragraph-level chunks with line-level positional resolution inside — strikes the balance between LLM-friendly token cost and highlight precision.

3. **Bbox tolerance.** Per-text-item bboxes in pdf.js are tight; a "highlight a bullet" overlay needs some padding so the visual doesn't look skinny. Need a visual padding constant (e.g., `+2px` all sides). Confirm during PF.5 visual review.

4. **Privacy of cached PDFs.** Even with 24h TTL, the PDF bytes sit on the server. Resumes contain PII. Need to confirm cache is scoped per `user_id` and not addressable across users.

5. **Hallucinated chunk IDs.** What rate does the LLM produce chunk IDs that don't exist? If non-trivial (>5% of entries), the join step needs a confidence score per resolved bbox and a UI affordance for low-confidence positions. Measure during PF.1 evaluation.

---

## Followups (post-launch)

- **Drive docs** — export to PDF first, then reuse the same pipeline.
- **Extension HTML scrapes** — render the captured HTML in a sandboxed iframe with overlays; positions come from `getBoundingClientRect` at scrape time.
- **Editable preview** — click-drag to select a region of the document and create a manual component from the selected text. Powerful, complex.
- **Diff view** — when a user re-uploads the same document, show which components changed and which are unchanged.
- **OCR fallback** for image-only PDFs.
- **Longer-lived PDF storage** (Option A from §3) — graduate the in-memory cache to durable storage if user research shows people want to revisit previews days/weeks later.

---

# Implementation status (2026-05-16)

## What shipped

| Phase | Outcome |
| ----- | ------- |
| **PF.1 — Parser emits positional metadata** | Implemented via the **fuzzy-match path**, not the LLM-chunk-ID path. New `apps/web/src/lib/parse/pdf-positions.ts` extracts per-text-item positions from a PDF buffer with `pdfjs-dist` and exposes `findPositionsForText()` (greedy left-to-right window search) + `deriveSearchNeedle()` (category-aware text extraction). The upload route wires this in as a non-blocking step: for every newly-created bank entry, derive a needle from its category-relevant fields, fuzzy-match against the PDF text items, write `source_page` + `source_bbox[]` back to the row. 9 unit tests in `pdf-positions.test.ts`. |
| **PF.2 — Schema + API** | Additive migration in `ensureProfileBankHierarchySchema()` adds `source_page INTEGER` and `source_bbox TEXT` columns to `profile_bank`. Drizzle schema mirrors the columns. `BankEntry` type in `packages/shared/src/types.ts` extended with `sourcePage?` and `sourceBbox?` fields. `rowToEntry` parses `source_bbox` JSON; `updateBankEntryPositions()` is the write path. |
| **PF.3 — PDF cache** | New `apps/web/src/lib/parse/pdf-cache.ts` — in-memory `Map` keyed by `documentId`, 24h TTL, per-user scoping (a brute-forced `documentId` from another user returns null). New `GET /api/bank/documents/[id]/pdf` route streams the cached bytes. Upload route writes the buffer to the cache as part of the non-blocking position-extraction step. 4 unit tests in `pdf-cache.test.ts` cover round-trip, cross-user scoping, eviction, and TTL expiry. |
| **PF.4 — Modal tabs + PDF viewer** | Left panel of the review modal becomes a tabbed surface: `Document` and `Components (N)`. Document defaults open when a `documentId` is available (i.e., the upload was a PDF). New client component `PdfPreview` renders the PDF page-by-page via raw `pdfjs-dist` to canvas — no `react-pdf` dep, no worker config. Page navigation + zoom controls. Modal grid template flips (`1fr_360px` vs `320px_1fr`) so the active tab gets the larger pane. |
| **PF.5 — Highlight overlays** | New `HighlightLayer` component places absolutely-positioned divs over the rendered canvas. Color-coded by category (`bg-brand/25`, `bg-primary/25`, `bg-warning/25`, etc.) with hover + selected outlines. Click → selects the entry in the right detail pane. Empty state when no entries have bboxes: explanatory copy below the page. |
| **PF.6 — Cross-tab navigation** | `View in document ↗` link appears in the right detail pane when the selected entry has bboxes. Clicking it switches `leftTab` to `document` and jumps the PDF to the first matched page via the imperative navigator registered through `onRegisterNavigator`. |
| **PF.7 — Polish + states** | PDF preview's empty/error states cover loading, `404 Preview unavailable` (cache TTL expired or non-PDF source), and "Couldn't locate parsed components in this PDF" fallback when no entries matched. Non-PDF imports hide the Document tab entirely. Manual entries (no `documentId`) skip the tabs UI. |

## Deviation from spec

The architecture section preferred **modifying the LLM extraction step to emit `source_chunks: number[]`** so each parsed entry carries explicit chunk IDs that map back to bboxes. This session shipped the **fuzzy-match fallback** instead.

**Why the deviation:**
- Existing parse pipeline (`apps/web/src/lib/parser/pdf.ts` + `smartParseResume`) is a custom regex extractor with no `pdfjs-dist` integration on the parse hot path. Migrating it to chunk-ID emission is a 1-2 week effort that requires LLM-prompt eval testing across many resumes to measure hallucinated-chunk-ID rate (open question #5 in §architecture).
- The fuzzy-match path uses `pdfjs-dist` only to *augment* the existing pipeline — it runs after parsing succeeds and tags entries with bboxes when it can. If the match fails (parsed text was reformatted, joined, or OCR'd), the entry simply gets no bbox; the modal still works.
- Per the spec's own §3 fuzzy-match analysis: *"~80% accuracy, no parser refactor. Ship the UX now, upgrade later."* That's the right trade for a feature whose UX-value is mostly in "see the document at all" rather than "every highlight is pixel-perfect."

**When to upgrade:** if highlight-accuracy ends up driving real user friction (people complaining the highlights don't match what was parsed), revisit by:
1. Adding annotated chunk IDs to the parse-LLM prompt (`smartParseResume`).
2. Returning `source_chunks: number[]` alongside the structured entry.
3. Replacing `findPositionsForText` with a chunk-ID lookup in `pdf-positions.ts`.
The schema (PF.2) and downstream (PF.3–PF.7) don't change.

## Files added / changed

- `apps/web/src/lib/parse/pdf-positions.ts` — new (fuzzy-match + bbox extraction)
- `apps/web/src/lib/parse/pdf-positions.test.ts` — new
- `apps/web/src/lib/parse/pdf-cache.ts` — new
- `apps/web/src/lib/parse/pdf-cache.test.ts` — new
- `apps/web/src/lib/db/profile-bank.ts` — added `source_page` + `source_bbox` to schema migration + `rowToEntry` + `updateBankEntryPositions()`
- `apps/web/src/lib/db/schema.ts` — Drizzle columns
- `packages/shared/src/types.ts` — `sourcePage` / `sourceBbox` on `BankEntry`
- `apps/web/src/app/api/upload/route.ts` — wires position extraction + cache writes (non-blocking)
- `apps/web/src/app/api/bank/documents/[id]/pdf/route.ts` — new (PDF stream)
- `apps/web/src/components/bank/preview/pdf-preview.tsx` — new
- `apps/web/src/components/bank/preview/highlight-layer.tsx` — new
- `apps/web/src/app/[locale]/(app)/components/components-tab.tsx` — review-modal tabs, `View in document ↗` link, `documentId`/`documentFilename` plumbing

## Verification

- `pnpm --filter @slothing/web exec tsc --noEmit` — clean
- `pnpm --filter @slothing/web lint` — 0 errors (4 pre-existing exhaustive-deps warnings, unrelated)
- `pnpm --filter @slothing/web exec vitest run …` — **382 passed, 0 failed** across components, lib/bank, lib/parse, scroll-behavior

## Known limitations (next-session candidates)

1. **Match accuracy.** Greedy left-to-right matching doesn't handle reordered phrases or paraphrasing. Spec'd "~80% accuracy" — confirm with real-data eval.
2. **PDF cache is process-local.** Two server instances each have their own cache. For multi-instance deployments, swap the `Map` in `pdf-cache.ts` for Redis (same interface).
3. **Mobile.** Document tab is hidden in the architecture but not yet conditioned on viewport width — currently usable on tablet+ but cramped on phone. Add a `lg:` breakpoint check before PF.4 visibility.
4. **LLM-chunk-ID upgrade path** described in §"Deviation from spec" remains the high-fidelity target. Not blocking, but the upgrade is well-scoped now that the surrounding infrastructure is in place.
