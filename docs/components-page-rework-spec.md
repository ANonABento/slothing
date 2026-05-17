# Components page — rework spec

**Status:** Implemented · 2026-05-16 (see "Implementation status" at bottom)
**Scope:** `/components` (the bank library page) + the post-upload "Review detected document components" modal.
**Goal:** Fix the issues surfaced in the audit so the page earns trust as the place users land to triage parsed resume data.

---

## Context

The page lives in `apps/web/src/app/[locale]/(app)/components/`. The bulk of the surface is a single 2,400-line React component: `components-tab.tsx`. Card and table views, the modal, and all data plumbing share that file. The page is the first place a user sees parsed output from PDFs / Drive / Extension imports, so accuracy and signal density are load-bearing.

## Out of scope (deferred)

- **Empty-zero-count tab collapse** (`Skills 0`, `Hackathons 0`, etc.) — overlaps with the in-flight empty-states work (`docs/empty-states-and-headers-plan.md`); will land there.
- **Two-search consolidation** (global search bar vs in-page "Search your career profile…") — affects global search UX; needs its own spec.
- **Components-tab file split / refactor** — `components-tab.tsx` is 2,400 lines and worth decomposing, but doing it inside this spec hides the user-visible fixes. We will extract the modal as a side-effect of P0.2 but otherwise leave the file alone.

## Phasing

| Phase | Theme | Items |
| ----- | ----- | ----- |
| **P0** | Trust-breaking bugs | Count divergence · Post-commit review modal · Drawer-based detail view · Wheel-event scroll trap |
| **P1** | Logic correctness + key UX | Auto-resolve trivial duplicates · "Keep both" gap · Cross-document dedupe · Confidence pill signal · Source UUID leakage · Cancel action in modal |
| **P2** | Polish + chrome | Action hierarchy · Truncation · Tag overflow · Time-format symmetry · Toggle clarity · Duplicate-chrome dedupe · Bulk actions · Confidence filter · Spacing scale · Table padding |

Each item below lists: **Decision**, **Why**, **Files**, **Acceptance**.

---

# P0 — Trust-breaking bugs

## P0.1 — Reconcile entry counts

**Decision:** Single source of truth for "how many components do I have." Tabs, page header, and section headers all read the same `allEntries` aggregate. The current paginated `entries` array becomes "results on this page" and is labelled as such.

- Page header switches from `· 50 entries` to `· 63 total · showing 50` (or drop the "showing" suffix when not paginated).
- Section headers (`Experience (4)`) read from `categoryCounts[cat]`, not `group.entries.length`.
- Tab pill counts unchanged — they're already global.

**Why:** Today the user sees three numbers — `50` (header), `63` (All tab), `(4)` vs `6` (Experience section/tab) — that disagree. Tabs count globally; header + section count the current page. Both individually correct, both lying to the user.

**Files:**
- `apps/web/src/app/[locale]/(app)/components/components-tab.tsx:1346` — `all` count already correct.
- `components-tab.tsx:1374-1376` — replace `entries.length` with `categoryCounts.all` (or split into `total` + `visible`).
- `components-tab.tsx:1786,1817` — section headers consume `categoryCounts[cat]`, not `group.entries.length`. Group rendering still iterates `group.entries` for the actual rows.

**Acceptance:**
- All three count surfaces agree on the same number when no filter / search is active.
- When a filter or search narrows results, header reads `N total · showing M`; section headers continue to show the category total (not the filtered subset) — or, alternatively, show both (`Experience (4 / 6)`). Pick one and apply consistently.
- Vitest: `components/components-tab.test.tsx` (or new file) covers the three-count alignment with mocked `allEntries`.

---

## P0.2 — Stop calling it "Review" if it's post-commit

**Decision:** Move the review modal **before** the components are committed to the bank. Upload returns a "parsed" payload; the modal mutates that staged payload; clicking `Save N components` is what writes them. Closing the modal without saving discards the parse.

If we don't want to ship a real staging step in this pass, then rename the modal to **"Clean up imported components"** and drop the "Review" framing entirely — but P0.2 is the staging change. The rename is the fallback if scope is tight.

Secondary: extract the modal from inline JSX into `apps/web/src/components/bank/upload-review-dialog.tsx`. Worth doing in this phase because all P1 work touches the same lines.

**Why:** Today the upload flow at `components-tab.tsx:1049-1068` fires the success toast (`Added 31 entries from KevinJiang_Resume.pdf`) **before** the modal opens. The components already exist in the bank. The modal then offers `Discard parsed copy` and `Merge bullets` — but those are post-hoc cleanup operations, not gating. Mental model is wrong. A user who closes the modal with the X still has the entries.

**Files:**
- `components-tab.tsx:1043-1068` — split upload into two phases: `POST /api/bank/parse` (returns staged entries, does not commit) and `POST /api/bank/commit` (called from modal `Save`). Toast fires after commit, not after parse.
- `components-tab.tsx:1464-1512` — extract into `apps/web/src/components/bank/upload-review-dialog.tsx`. New file owns `UploadReviewEntries` (currently at line 2270+ of the same file).
- `apps/web/src/app/api/bank/upload/route.ts` (or wherever the upload handler lives — verify) — split into parse + commit. Parse persists a `parsed_documents` row keyed by `sourceDocumentId` with the candidate entries; commit promotes them.
- Schema: additive migration in `src/lib/db/schema.ts` for a `parsed_documents` table or a `committed BOOLEAN DEFAULT 0` column on existing entries. Follow the `PRAGMA table_info` + `ALTER TABLE … ADD COLUMN` pattern per CLAUDE.md.

**Acceptance:**
- Closing the modal with the X discards the parsed entries; they do not appear in the table.
- The success toast (`Added N entries from …`) fires only after `Save`, never on initial upload.
- Modal title updates to reflect gating (e.g., `Review parsed components`).
- "Keep editing later" actually preserves staged state across sessions (parsed docs persist; user can resume from `/components` on next visit). Surface a banner: *"You have N parsed components waiting for review — Resume / Discard."*
- Vitest covers the parse-without-commit flow.

**Fallback path** (if staging is too big for this pass): rename only. Modal becomes "Clean up imported components." Toast wording changes to "Imported N entries — review before they're used in Studio." Defer the actual staging to a follow-up. This is acceptable as a P0.2-lite but flag it explicitly in the PR.

---

## P0.3 — Drawer for card detail; keep table inline as read-only peek

**Decision:** Replace card-view inline expansion with a right-side drawer. Click any card → drawer slides in (≈480px, `40vw` on viewports ≥ 1440px). Drawer owns the full edit surface: meta, bullets, inline edit, tags, source, actions.

**Keep** the table view's chevron-expansion — but constrain it to a **read-only peek** (bullet list only, no edit chrome). The row body (anywhere outside the chevron) click opens the same drawer for editing. Two complementary affordances per table row: chevron = peek, row-body = edit.

The drawer becomes the shared "edit a component" primitive. It also powers the preview feature (see `docs/components-preview-feature-spec.md`).

**Why:** Card-view inline expansion never worked in a 3-column grid — `flex-1 min-w-0` shrinks the bullet body to the column width and wraps at word boundaries (`Designed / and / routed / double-layer / PCBs…`). Forcing one expansion pattern across both views was the wrong abstraction. Tables already use inline expand well — Linear, Vercel, Notion do this. Cards do not — they want focused editing. Pick the right tool per view; share the editing surface.

**Files:**
- `apps/web/src/components/bank/component-detail-drawer.tsx` (new) — owns the full edit surface. Built on shadcn `Sheet`.
- `apps/web/src/components/bank/chunk-card.tsx` — drop the expanded-card render path. Card is always collapsed in grid; click → `onSelect(entryId)`.
- `apps/web/src/components/bank/chunk-expanded-content.tsx` — split into two callers: full-edit content moves into the drawer; the table peek pulls a slimmed `<BulletListReadOnly />` from this file (or this file becomes that primitive).
- `components-tab.tsx:1919-2029` — grid render. Cards always collapsed; card click → `setSelectedEntryId(id)`.
- `components-tab.tsx:2031-2235` — table render. Chevron click toggles inline peek (read-only). Row body click → `setSelectedEntryId(id)`.
- `components-tab.tsx` top-level state — add `selectedEntryId` + render `<ComponentDetailDrawer open={!!selectedEntryId} entryId={selectedEntryId} onOpenChange={...} />`.

**Acceptance:**
- Grid: no inline card expansion anywhere; click → drawer.
- Table: chevron expands inline showing read-only bullets; row body click → drawer (not inline).
- Inline peek shows no edit controls (no `Edit` button, no drag handles, no delete).
- Drawer keyboard: `Esc` closes; `↑ / ↓` walks siblings in the active view.
- Closing the drawer returns focus to the originating card / row.
- Playwright snapshots cover: card-click drawer (grid), row-body-click drawer (table), chevron-peek (table).

---

## P0.4 — Fix wheel-event trap over tables

**Decision:** Wheel events over the table bubble to the page when the table has nothing more to scroll. Likely culprit: `VirtualGrid` / `VirtualList` calling `preventDefault` on every wheel event regardless of whether it can consume the scroll — textbook scroll-trap.

**Why:** User report — "can't scroll when mouse cursor is over tables." Reproduces in the audit screenshots' page setup. Standard symptom of virtual-scroll libs taking too-aggressive ownership of wheel events.

**Files:**
- `apps/web/src/components/ui/virtual-list.tsx` (verify path with `grep -rn "VirtualGrid" apps/web/src`) — audit wheel handling. Either drop `preventDefault` entirely and let the browser handle it, or only call it when the scroll position can actually move within the virtual list.
- `components-tab.tsx:2019` — `<VirtualGrid>` call site. If the fix is opt-in, pass `passThroughWheel` (or whatever the new prop ends up named).

**Acceptance:**
- Mouse hovered over the components table, scroll wheel → page scrolls when the table is at its top or bottom limit.
- Manual test: viewport height 768px with a long table; can scroll past the table without lifting the cursor.
- No regression on intra-table scrolling when the table has content above/below the viewport.

---

# P1 — Logic correctness + key UX

## P1.1 — Auto-resolve trivial duplicates

**Decision:** When the parsed copy has zero new bullets to merge (`Parsed copy: 0 new bullets to merge from 3 parsed`), the modal:
- Auto-selects `Discard parsed copy` as the default action.
- Disables `Merge bullets` with tooltip "Nothing to merge."
- Skips the item in the "next" walk if `Apply same action to remaining N duplicates` (P2.7) is used.

**Why:** Today the highlighted CTA is `Merge bullets` even when there is literally nothing to merge — a destructive-feeling click that's actually a no-op. Wastes the user's attention.

**Files:**
- `apps/web/src/components/bank/upload-review-dialog.tsx` (post-extraction) — the duplicate panel render block.
- The `newBullets.length === 0` branch is computable from `existingKeys` + the parsed entry's children at the existing `reviewDuplicateKey` lookup (`components-tab.tsx:2330-2332` today).

**Acceptance:**
- When the parsed copy contributes zero new bullets, `Discard parsed copy` is the visually highlighted CTA and `Merge bullets` is disabled.
- A unit test covers the `newBullets.length === 0` branch.

---

## P1.2 — Add the "Keep both" action

**Decision:** Add a third button — `Keep both` — to the duplicate panel. It commits the parsed copy alongside the existing entry, leaving both visible in the bank. The body copy already promises this; the button has been missing.

**Why:** Modal copy: *"Merge only the new parsed bullets, discard this parsed copy, or keep both for now."* Buttons today: `Discard parsed copy`, `Merge bullets`. The third option is implied but not actionable.

**Files:**
- `apps/web/src/components/bank/upload-review-dialog.tsx` — add `onKeepBoth(entryId)` callback.
- `components-tab.tsx` (the parent) — `onKeepBoth` is a no-op against the staged payload; both entries land at commit.

**Acceptance:**
- Clicking `Keep both` advances to the next item in the list; both entries appear in the bank after Save.
- If the experience flag is "we explicitly don't want users keeping both," remove the phrase from the body copy instead — but don't ship the current half-state.

---

## P1.3 — Cross-document duplicate detection

**Decision:** Duplicate detection runs against the **whole bank**, not just the entries from the current upload. Existing entries from other documents are eligible matches.

**Why:** `Expressive Animatronic Head` appears twice in the table — one from `Master Resume-3.pdf`, one from `KevinJiang_Resume.pdf`. They were uploaded in separate sessions, so the per-upload `existingKeys` map never compared them. The whole point of the review modal is to prevent this.

**Files:**
- `components-tab.tsx:1489-1492` — today `existingEntries` is filtered to exclude entries with the same `sourceDocumentId` as the upload. Drop that filter — pass **all** existing bank entries.
- `apps/web/src/lib/db/dedupe-backfill.ts` — add a one-shot dedupe scan that runs on bank load (or as a cron) to catch the existing cross-doc duplicates created before this fix landed. Optional but recommended.
- `components-tab.tsx:196-224` — `reviewDuplicateKey` is fine; it's category-aware and doesn't need changes.

**Acceptance:**
- Uploading a second resume containing a project already in the bank from a different document triggers the duplicate panel.
- One-shot backfill removes (or surfaces in a banner) existing cross-doc duplicates for users with the bug-state data.

---

## P1.4 — Make the confidence pill mean something

**Decision:** Two-part fix.

1. **Investigate the data.** Every visible row shows `90%`. Either the parser is producing a quantized default, or the rounding `Math.round(score * 100)` in `ConfidenceBadge` (line 2238) is hiding variation. Drop the rounding to one decimal for diagnostics, sample 20 entries, decide.
2. **Mute the chip when value > 90%.** If confidence is genuinely high, the green "High confidence" badge adds chrome without information. Show the chip **only** when score is below the high threshold (i.e., when there's something to flag).

**Why:** Color signals only matter when they differentiate. A page where every row is green-pilled "High confidence" trains the user to ignore the chip.

**Files:**
- `apps/web/src/components/bank/chunk-card.tsx:200-204` — invert the conditional: render the chip only when score is < 0.9 (with `variant="warning"` for 0.7-0.9, `destructive` < 0.7).
- `components-tab.tsx:2237-2253` (`ConfidenceBadge`, table view) — same logic. Keep the numeric % for the table column (it's a column header, the data has a slot), but the colored "High confidence" badge disappears for high-confidence rows.
- Upstream: trace `confidenceScore` source in the parse pipeline. Likely `apps/web/src/lib/llm/` or the bank parse route. If it's a placeholder default, fix that separately and reference this spec in the commit.

**Acceptance:**
- After data investigation, document the confidence-score distribution in this spec (append a section at the bottom).
- High-confidence rows show no chip; medium/low rows show a chip with appropriate variant.
- Numeric % stays in the table column for sortability.

---

## P1.5 — Stop leaking source UUIDs

**Decision:** Replace `from 6f857cf671f93e5df2b1884e` with `from KevinJiang_Resume.pdf · 3h ago`. Filename is available in the `sourceDocuments` state; we just need to join it. Hide the UUID entirely from production view (move it to a `data-source-id` attribute for debugging, or behind a `?debug=1` query string).

**Why:** Even in dev mode the UUID is noise. The audit screenshot shows it leaking into the user view — either `showDebugIds` is on by default for the user's setup, or it's leaking conditionally. Either way, filename is what the user actually needs.

**Files:**
- `apps/web/src/components/bank/chunk-card.tsx:211-215` — change the rendered field. Look up filename via `sourceDocuments.find(d => d.id === entry.sourceDocumentId)?.fileName`.
- `components-tab.tsx:316` — make sure `sourceDocuments` is available to the card (prop drill or context).
- Audit the `showDebugIds` flag — find where it's set, ensure it's `false` outside `NODE_ENV === 'development'`.

**Acceptance:**
- All `from <hash>` instances in the app render as `from <filename> · <relative-time>`.
- UUID accessible via DOM inspector (`data-source-id`) but not visible text.
- For entries with no source document (manual entry), show `from manual entry` or omit the line entirely.

---

## P1.6 — Cancel action in review modal

**Decision:** Modal footer gets three actions: `Cancel`, `Keep editing later`, `Save N components` (post-P0.2 staging). `Cancel` discards the parsed payload — modal closes, no entries created.

Fallback if P0.2 ships as rename-only: `Cancel` becomes a soft-cancel — parsed entries already exist, so `Cancel` deletes them and shows an undo snackbar (Pattern B per `docs/destructive-actions-pattern.md`, 5-second window). Same outcome, less satisfying technically.

**Why:** Today the modal has only `Done` (filled, primary) and `Keep editing later` (ghost). The `X` is the only way to back out; it doesn't communicate destruction. Users have no explicit "throw this away" affordance.

**Files:**
- `apps/web/src/components/bank/upload-review-dialog.tsx` (post P0.2 extraction).
- For the rename-only fallback: integrate `useUndoableAction` from `apps/web/src/hooks/use-undoable-action.ts`.

**Acceptance:**
- Modal footer: `Cancel`, `Keep editing later`, `Save N components`.
- `Cancel` (staging path): discards staged payload, modal closes, no entries created.
- `Cancel` (rename-only path): deletes the just-created entries, shows undo snackbar with 5s window.
- Vitest covers both branches.

---

# P2 — Polish + chrome

## P2.1 — Add-action hierarchy

**Decision:** Replace the three top-right buttons (`Add Entry`, `From Drive`, `Upload`) with one primary `+ Add component` split button. Menu items: `Upload file…`, `Import from Drive`, `Add manually`. Demotes `From Drive` from competing-CTA status.

**Files:** `components-tab.tsx` near the top of the render (search for `Add Entry`).

**Acceptance:** Single primary CTA; menu enumerates the three sources; keyboard accessible (Enter opens menu, arrows navigate).

## P2.2 — Title truncation

**Decision:** Two-line clamp on card titles (`line-clamp-2`) instead of single-line truncation with `...`. Table view keeps single-line truncation but adds `title="<full title>"` for native tooltip.

**Files:** `apps/web/src/components/bank/chunk-card.tsx` (card title block); `components-tab.tsx` table title cell.

**Acceptance:** No `Mi…` / `Reaz…` truncation in card view; native tooltip on table titles.

## P2.3 — Tag overflow

**Decision:** Cap visible tags at 3, render `+N more` chip for the remainder. Hover (or click) expands.

**Files:** `chunk-expanded-content.tsx` tag-render block (and wherever else tags render — `grep -n "tags" components-tab.tsx`).

**Acceptance:** No more than 4 chips visible per card (3 + overflow); overflow chip lists remaining tags on hover.

## P2.4 — Time-format symmetry

**Decision:** Both views use `<TimeAgo />`. Drop `formatDateOnly()` in table view at `components-tab.tsx:2209` and replace with `<TimeAgo date={entry.createdAt} />`. Absolute date on hover (already supported by `<TimeAgo />` — verify).

**Files:** `components-tab.tsx:2209`.

**Acceptance:** Table column shows `3h ago` (not `May 16, 2026`); hover reveals absolute date.

## P2.5 — Toggle clarity

**Decision:** `Category | Source` toggle uses an explicit segmented-control treatment from shadcn (`ToggleGroup` with `variant="outline"`) so active state reads at a glance. View-mode toggle (grid/table icons) gets `aria-label` + `title` attrs.

**Files:** `components-tab.tsx` toggle render block (search for `Category`).

**Acceptance:** Active toggle state visibly distinct at 1m viewing distance; keyboard navigation works.

## P2.6 — De-duplicate "Possible duplicate" chrome in the modal

**Decision:** One visual treatment per duplicate state. Keep the inline orange chip at the top of the right-panel card; drop the secondary bold "Possible duplicate" section header below.

**Files:** `apps/web/src/components/bank/upload-review-dialog.tsx` (post-extraction).

**Acceptance:** Each duplicate item shows the flag exactly once.

## P2.7 — Bulk actions in the review modal

**Decision:** Below the left-panel list, add a bulk action bar: `Discard all 6 duplicates` · `Merge all bullets` · `Mark all reviewed`. Applies to all currently flagged duplicates (or all unreviewed items).

**Files:** `apps/web/src/components/bank/upload-review-dialog.tsx`.

**Acceptance:** Bulk action collapses 6+ clicks into one; per-item override still possible.

## P2.8 — Confidence filter

**Decision:** Add a `Confidence ≥` slider (default 0%) to the filter row. Lets the user surface low-confidence rows specifically.

**Files:** `components-tab.tsx` filter bar (where `Newest` sort dropdown lives).

**Acceptance:** Slider filters rows in real-time; URL state preserves the filter value.

## P2.9 — Spacing scale instead of hardcoded gaps

**Decision:** Page-level vertical rhythm comes from a single container's `space-y-N` (or `gap-N`), not from per-row `mt-N` / `pt-N`. Drop any hardcoded margins on the search row; let it inherit from the page container.

**Why:** Audit observation — header→search gap is tuned for one viewport and feels off elsewhere. Centralizing spacing on the container makes future spacing changes propagate.

**Files:** `components-tab.tsx` near the top of the page render — wrap header + search + filter rows in a single `space-y-6` container; remove per-element margins.

**Acceptance:** No `mt-N` / `pt-N` on individual page-level rows; spacing is centralized.

## P2.10 — Table padding audit

**Decision:** `<th>` / `<td>` padding in `EntryTable` aligns to a single scale (`px-4 py-3` is the convention elsewhere — verify and apply uniformly).

**Files:** `components-tab.tsx:2083+` (the `<table>` block).

**Acceptance:** All cells share horizontal + vertical padding; header cells align with body cells under each column.

---

# Open questions / verification needed

1. **`showDebugIds` flag origin.** Need to find where it's set and confirm it shouldn't be visible to end users. If the audit screenshot was taken with the flag on, P1.5's urgency drops — but the underlying decision (filename, not UUID) stands.
2. **Confidence-score data check.** P1.4 step 1 needs a real data investigation. Run a query against `bank_entries` (or whatever the table is called) and bin scores into 10 buckets. If 95% of values are exactly 0.9, the parser is the bug, not the chip.
3. **Staging-vs-rename decision for P0.2.** Real staging (`parsed_documents` table) is the right architecture; rename is the fallback. Decide before implementation starts — affects schema migration scope.
4. **Section-header count style.** When a search/filter narrows results, do section headers show the global count (`Experience (4)`) or the filtered count (`Experience (2 / 4)`)? The simpler choice is global-everywhere; the more informative choice is dual.

---

# Followups (not in this spec)

- **Components-tab file decomposition.** After this work lands, `components-tab.tsx` is still a 2,400-line file. Worth carving up: extract `EntryTable`, `UploadReviewEntries`, the grid render, and the filter bar into their own modules. Out of scope here — separate refactor PR.
- **Open in Studio deep-link.** From a component row, click through to where it's used in resumes / cover letters. Touches Studio; needs its own UX pass.
- **(Reserved) UI QoL feature idea.** User has a follow-on feature in mind; will be spec'd after this lands.

---

# Implementation order (suggested)

1. **P0.1** (count reconciliation) — small, isolated, immediately rebuilds trust.
2. **P0.4** (wheel-event trap) — quick, isolated, fixes an actively broken behavior.
3. **P0.3** (drawer for cards + table peek split) — introduces the drawer primitive; replaces card-view expansion. Drawer is reused by the preview feature later.
4. **P0.2** modal extraction + staging (or rename fallback) — biggest, most architectural.
5. **P1.1 + P1.2 + P1.4 + P1.5 + P1.6** — modal + chunk-card tweaks; ship together once P0.2 + P0.3 have landed.
6. **P1.3** (cross-doc dedupe) — needs the cross-doc backfill.
7. **P2 batch** — smallest UI tweaks, last.

Each phase is a separate PR. Each PR includes the relevant Vitest coverage and a Playwright snapshot where the change is visual.

---

# Related specs

- `docs/components-preview-feature-spec.md` — the document-preview tab inside the review modal. Depends on P0.2 (modal extraction) and P0.3 (drawer primitive).

---

# Implementation status (2026-05-16)

## Shipped this session

| Phase | Outcome |
| ----- | ------- |
| **P0.1 — Count reconciliation** | Extracted `deriveCategoryCounts` / `deriveSourceDocumentCounts` / `deriveVisibleEntryCount` into `apps/web/src/lib/bank/count-derivation.ts`. Page header reads from a single source-of-truth, section headers use global category counts, tab pills unchanged. 13 unit tests in `count-derivation.test.ts` lock the three-surface alignment. |
| **P0.4 — Wheel-event scroll trap** | Root cause was `overscroll-behavior: none` set globally on `.overflow-auto` / `.overflow-y-auto` / `.overflow-x-auto` in `globals.css`. Removed the rule; updated `scroll-behavior.test.ts` to assert the opposite (utilities must NOT carry `none`/`contain` — scroll chaining must work). |
| **P0.3 — Drawer + table read-only peek** | New `Sheet` primitive (`apps/web/src/components/ui/sheet.tsx`). New `ComponentDetailDrawer` (`apps/web/src/components/bank/component-detail-drawer.tsx`). Cards now open the drawer on click (no inline expansion). Table row body click also opens the drawer; the chevron toggles a read-only bullet peek rendered by new `ChunkPeek` (`apps/web/src/components/bank/chunk-peek.tsx`). |
| **P0.2 (lite path) — Rename + Cancel** | Modal title → "Clean up imported components"; description updated. New `Discard import` button in the modal footer (with confirm dialog) deletes the parsed entries. Translation keys added to all 8 locales. **Real-staging path is NOT implemented** (no `parsed_documents` table). Closing the modal with `X` or `Keep editing later` still leaves entries in the bank — but `Discard import` now provides the missing "throw this away" affordance. |
| **P1.1 — Auto-resolve trivial duplicates** | When the parsed copy adds zero new bullets, `Discard parsed copy` becomes the visually highlighted CTA and `Merge bullets` is disabled with tooltip "Nothing new to merge." |
| **P1.2 — Keep both action** | Third button added to the duplicate panel. Per-session `keepBothIds` Set tracks dismissals; warning panel hides for the marked entry. |
| **P1.3 — Cross-document dedupe** | The filter on `existingEntries` no longer excludes by `sourceDocumentId` — only by entry ID (to avoid self-matching). A project from one resume now matches the same project in another. |
| **P1.4 — Confidence pill signal** | Inverted the chip logic. High-confidence rows carry no chip; only `Medium confidence` (warning) and `Low confidence` (destructive) variants render. Numeric % stays in the table column. |
| **P1.5 — Source UUID → filename** | `ChunkCard` accepts a `sourceFilenames` map prop. Card now renders `from <filename>` instead of `from <uuid>`. Raw UUID accessible via `data-source-id` attribute only in debug mode. |
| **P1.6 — Cancel action** | Implemented as part of P0.2 — `Discard import` button is the cancel action with confirm dialog. |
| **P2.2 / P2.3 / P2.4 / P2.5 / P2.6** | Line-clamp-2 titles · tag overflow cap 5 → 3 (with hover tooltip) · `<TimeAgo />` in the table (replaces `formatDateOnly`) · `DisplayModeButton` gets a bordered pill on inactive state · de-duped "Possible duplicate" chrome (the standalone warning hides when the duplicate panel is rendering). |
| **P2.9 / P2.10** | Audited: the page already used `space-y-6` containers and `px-4 py-3` cells consistently. No change needed. |

## Deferred to a separate effort

| Phase | Why |
| ----- | --- |
| **P0.2 (real-staging path)** | Requires new `parsed_documents` table (additive migration), split of upload API into `parse` + `commit` phases, resume-from-session UX, and Vitest coverage for both phases. The rename + `Discard import` button covers the user-visible mental model gap for now. |
| **P2.1 — Split add-button** | UX redesign of the add-action cluster (`Add Entry / From Drive / Upload`). Not blocking other fixes. |
| **P2.7 — Bulk actions in review modal** | New UI surface (bulk action bar inside the modal); cleanest as its own change. |
| **P2.8 — Confidence filter** | New filter UI in the search bar; cleanest as its own change. |

## Files changed

- `apps/web/src/app/[locale]/(app)/components/components-tab.tsx` — primary surface edits
- `apps/web/src/components/bank/chunk-card.tsx` — drawer-mode prop, confidence chip inversion, filename rendering
- `apps/web/src/components/bank/chunk-card.types.ts` — `onSelect` and `sourceFilenames` props
- `apps/web/src/components/bank/component-detail-drawer.tsx` — new
- `apps/web/src/components/bank/chunk-peek.tsx` — new
- `apps/web/src/components/ui/sheet.tsx` — new (shadcn-style)
- `apps/web/src/lib/bank/count-derivation.ts` — new
- `apps/web/src/lib/bank/count-derivation.test.ts` — new
- `apps/web/src/components/bank/chunk-card.test.tsx` — updated tests for drawer mode + confidence + source filename
- `apps/web/src/components/bank/chunk-content-preview.tsx` — tag cap 5 → 3
- `apps/web/src/app/globals.css` — dropped `overscroll-behavior: none` on bare overflow utilities
- `apps/web/src/app/scroll-behavior.test.ts` — inverted the assertion
- `apps/web/src/messages/*.json` — added `a11y.collapse` and `dialogs.bank.page.review.discard*` keys to all 8 locales

## Verification

- `pnpm --filter @slothing/web exec tsc --noEmit` — clean
- `pnpm --filter @slothing/web check:translations` — clean (12 pre-existing identical-to-en warnings, unrelated)
- `pnpm --filter @slothing/web lint` — 0 errors (4 pre-existing exhaustive-deps warnings, unrelated)
- `pnpm --filter @slothing/web exec vitest run src/components/bank src/lib/bank src/app/scroll-behavior src/app/[locale]/(app)/components` — 164 passed, 0 failed
