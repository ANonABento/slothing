# Preview match cascade — spec

**Status:** Draft · 2026-05-16
**Builds on:** `docs/components-preview-feature-spec.md` (the fuzzy-match path).
**Goal:** Push the **free, deterministic, self-hostable** highlight-match accuracy from ~87% to ≥95% on a typical resume — without introducing any paid or external dependency. Premium tiers (embeddings, LLM citations, Document AI) layer on top as opt-in upgrades behind the existing AI gate.

---

## Why

After shipping the fuzzy-match path, the master-resume test landed at 34/39 entries matched (87%). The remaining 13% are mostly long bullets where the smart parser has rewritten enough of the text that strict in-order token coverage fails. Two structural observations:

1. The free tier is the OSS baseline. Per project memory (`oss-launch-pricing-and-billing-plan`), the OSS/self-host story is load-bearing — any improvement here has to work without a key in `.env.local`.
2. We have already-derived **structural information** (parent→child relationships, category, source document) that the current matcher ignores. Squeezing more out of that is cheaper than reaching for embeddings or LLM citations.

This spec is the deterministic-only reinforcement plan. A separate followup spec will cover the premium tier scaffolding.

---

## Out of scope

- **Embedding-based retrieval** (Voyage / OpenAI / sqlite-vec) — captured in `docs/preview-match-premium-spec.md` (followup).
- **LLM citation re-prompt** — same followup. Bigger architectural lift; not blocking the free-tier improvements.
- **Cloud Document AI providers** (Google, AWS) — same followup. Vendor lock-in considerations live there.
- **Parser rewrites** — keeping `smartParseResume` as-is. All wins below come from the matcher / extraction side.

---

## Phasing

| Phase | Theme | Items |
| ----- | ----- | ----- |
| **P0** | Quick wins, free tier | Tail-suffix cascade · Junk-item filter · Per-category thresholds |
| **P1** | Smarter matching, free tier | Multi-needle generation · Damerau-Levenshtein token fallback · Diagnostic endpoint |
| **P2** | Structural awareness, free tier | Parent-anchored bullet search · Premium tier scaffolding (no implementation) |

Each item below: **Decision · Why · Files · Acceptance**.

---

# P0 — Quick wins

## P0.1 — Tail-suffix cascade

**Decision:** Mirror the existing head-prefix cascade with a tail-suffix variant. After full-needle and head-shortened attempts fail, retry with the **last** 70%, 45% of significant tokens. First attempt that meets its threshold wins.

**Why:** The parser sometimes rewrites a bullet's head, not its tail. Example seen in the master-resume misses: needle `"Programmed firmware in .NET, integrating Emgu CV for real-time facial detection"` doesn't match because the head was rewritten — but the tail (`"for real-time facial detection"`) is verbatim in the PDF. The head cascade can't recover that.

**Files:**
- `apps/web/src/lib/parse/pdf-positions.ts` — extend the `attempts` array in `findPositionsForText` with the tail-suffix variants:
  ```ts
  const attempts: string[][] =
    needleTokens.length > 6
      ? [
          needleTokens,
          needleTokens.slice(0, Math.ceil(needleTokens.length * 0.7)),
          needleTokens.slice(0, Math.max(MIN_MATCH_TOKENS, Math.ceil(needleTokens.length * 0.45))),
          needleTokens.slice(-Math.ceil(needleTokens.length * 0.7)),
          needleTokens.slice(-Math.max(MIN_MATCH_TOKENS, Math.ceil(needleTokens.length * 0.45))),
        ]
      : [needleTokens];
  ```
- `apps/web/src/lib/parse/pdf-positions.test.ts` — new test case: needle whose head doesn't appear in the haystack, but whose tail does.

**Acceptance:**
- New test passes: head-rewritten bullets resolve via tail cascade.
- All existing 228 tests still pass.
- Re-uploading the master resume increases match count by at least 2 entries (target: 36/39).

---

## P0.2 — Junk-item filter

**Decision:** Before feeding pdf.js items to the matcher, filter out items whose normalized text is empty, single-char, or all-punctuation. The matcher's per-start budget (`maxWindowItems: 120`) then covers more *meaningful* content per iteration.

**Why:** A typical resume page has 30–60 single-char items (`|` separators, `•` bullets, `🔗` link glyphs) that contribute zero matching signal but eat budget. With them filtered, the window covers more content tokens before we bail.

**Files:**
- `apps/web/src/lib/parse/pdf-positions.ts`:
  - New helper `function isJunkItem(item): boolean` — returns true if normalized text is `""`, length 1, or matches `/^[\W_]+$/`.
  - `extractPdfPositions` applies the filter after `itemFromPdfJs` but before sorting.
  - Keep the original (unfiltered) items if the caller passes `__includeJunk: true` for diagnostic use.
- `apps/web/src/lib/parse/pdf-positions.test.ts` — assert junk items don't appear in the extracted output.

**Acceptance:**
- Items returned from `extractPdfPositions` on test-resume.pdf have no single-char-only items.
- The matcher reports the same or higher match rate.
- No test regressions.

---

## P0.3 — Per-category match thresholds

**Decision:** Replace the global `MATCH_THRESHOLD_RATIO = 0.55` + `MIN_MATCH_TOKENS = 3` with per-category tuning:

| Category | min tokens | coverage ratio | rationale |
| -------- | ---------- | -------------- | --------- |
| `experience` | 2 | 0.55 | title + company; usually short |
| `project` | 2 | 0.55 | name + maybe tech stack |
| `education` | 2 | 0.55 | institution + degree |
| `bullet` | 2 | 0.40 | long, often paraphrased → permissive |
| `achievement` | 2 | 0.45 | same as bullet, slightly tighter |
| `skill` | 1 | 1.00 | usually one token; needs exact |
| `certification` | 2 | 0.60 | name + issuer; high precision |
| `hackathon` | 2 | 0.55 | name + project |

**Why:** Long bullets fail the current uniform 55% threshold even when 40% of tokens correctly land in order. The same threshold over-permissive on short skill names would also cause false positives. Per-category tuning gives us recall where we need it (bullets) and precision where we need it (skills).

**Files:**
- `apps/web/src/lib/parse/pdf-positions.ts`:
  - `findPositionsForText(needle, items, options)` accepts a new `category?: string` in options.
  - Threshold derivation reads from a `CATEGORY_MATCH_PARAMS` map.
- `apps/web/src/app/api/upload/route.ts`:
  - Pass `category: entry.category` when calling `findPositionsForText`.
- `apps/web/src/lib/parse/pdf-positions.test.ts` — new test: a bullet that matches at 0.40 coverage; the same content as a "skill" needle should NOT match.

**Acceptance:**
- Bullets that match 40-54% in order now resolve.
- Skill needles still require exact match.
- Match-count on the master resume should rise by 1–2 entries.

---

# P1 — Smarter matching

## P1.1 — Multi-needle generation

**Decision:** `deriveSearchNeedle(category, content)` returns **an array of needle candidates** (ranked, highest-precision first). The matcher tries each candidate and takes the best-scoring match.

**Why:** Single-needle generation loses every time the parser drops/adds a connector word, abbreviates a company name, or fills the title with extra metadata. Multi-needle handles all these cases without per-case branching.

Example candidates for an experience entry `{title: "Hardware Developer", company: "Midnight Sun"}`:
```
1.  "Hardware Developer Midnight Sun"         (precise — title + company)
2.  "Hardware Developer at Midnight Sun"      (with connector — matches PDFs that include "at")
3.  "Hardware Developer"                      (title only — works when company appears separately)
4.  "Midnight Sun"                            (company only — disambiguates if title was rewritten)
```

For a bullet, candidates would be:
```
1.  <full description>
2.  <first 8 words>
3.  <last 8 words>
4.  <noun-heavy substring> (drop verbs/adjectives — optional, more complex)
```

**Files:**
- `apps/web/src/lib/parse/pdf-positions.ts`:
  - `deriveSearchNeedles(category, content): string[]` (plural; backward-compatible re-export of `deriveSearchNeedle` returning the first candidate).
  - Match cascade in `findPositionsForText` becomes the existing logic + outer loop over candidates.
- `apps/web/src/app/api/upload/route.ts`:
  - Use the plural API; track which needle won for the diagnostic endpoint.
- `apps/web/src/lib/parse/pdf-positions.test.ts` — assert that the first candidate is the highest-precision one (so callers that only use `deriveSearchNeedle` keep working).

**Acceptance:**
- Existing tests pass unchanged.
- New test: experience with rewritten title (matches via company-only candidate).
- Match-count on master resume rises by 1–2.

---

## P1.2 — Damerau-Levenshtein token fallback

**Decision:** When `countMatchedTokensInOrder` fails to find a needle token via exact `indexOf`, fall back to a fuzzy token-search: scan the haystack's tokens for one within Damerau-Levenshtein distance 1 (or 2 for tokens longer than 6 chars). Accept that as a match for that needle token.

**Why:** Handles three real classes of issue:
- OCR-like substitutions (`il8n` for `i18n`, `cli‑X` for `cli-X` — soft-hyphen-vs-hyphen)
- Pluralization differences (`pipeline` vs `pipelines`)
- Minor parser typos / capitalization-after-normalize edge cases

**Files:**
- Either:
  - Inline a small Damerau-Levenshtein implementation in `pdf-positions.ts` (~30 lines), OR
  - Add `talisman` to deps and import `talisman/metrics/damerau-levenshtein` (~2KB gzipped).
  Recommend inline — one fewer dep, this is the only place we need it.
- `apps/web/src/lib/parse/pdf-positions.ts`:
  - New helper `function fuzzyTokenSearch(needleTok, haystackTokens, fromIndex): index | -1`.
  - Used as fallback inside `countMatchedTokensInOrder` after `indexOf(...)` returns -1.
- `apps/web/src/lib/parse/pdf-positions.test.ts` — tests for the typo-tolerance: `il8n` matches `i18n`, `pipelines` matches `pipeline`, but `dragon` does NOT match `python` (distance > threshold).

**Acceptance:**
- DL helper handles common cases (typos, plurals) within distance 1–2.
- Threshold tuned so unrelated tokens don't match.
- Master-resume match rate flat or higher; no false-positive highlights.

---

## P1.3 — Diagnostic match-report endpoint

**Decision:** New API route `GET /api/bank/documents/:id/match-report` returns per-entry match diagnostics — which tier succeeded (or all attempts and their best scores if it failed). Gated to the document's owner. Used for debugging without grepping server logs.

**Why:** When a real-world resume has missing highlights, we currently fly blind unless we tail the dev server log. The endpoint formalizes the diagnostic output as a stable, queryable artifact — and unblocks future UI work (a `?debug=match` panel on the preview modal, or a one-off "see why this didn't match" affordance).

**Files:**
- `apps/web/src/app/api/bank/documents/[id]/match-report/route.ts` (new):
  - Loads cached PDF bytes (via `pdf-cache`).
  - Re-runs `extractPdfPositions` (or reads cached items if we add a positions cache).
  - For each entry in the document, runs `findPositionsForText` with `{return: 'diagnostic'}` and collects per-tier attempt scores.
  - Returns JSON: `{ items, entries: [{id, category, needles, attempts, winningTier, bboxes}] }`.
- `apps/web/src/lib/parse/pdf-positions.ts`:
  - Optional `diagnostic?: boolean` flag on `findPositionsForText` — when true, returns rich attempt records instead of just bboxes.
- `apps/web/src/app/api/bank/documents/[id]/match-report/route.test.ts` (new):
  - Smoke test that the endpoint returns the expected shape.
  - Auth test (denies cross-user access).

**Acceptance:**
- Endpoint returns a JSON document with per-entry diagnostics.
- Auth-gated (uses existing `requireAuth` helper).
- Doesn't run on every upload — only on explicit request. No latency impact on uploads.

---

# P2 — Structural awareness

## P2.1 — Parent-anchored bullet search

**Decision:** When matching a bullet whose parent (experience/project) already has a bbox, restrict the bullet's search to PDF items in the y-range immediately below the parent's match. Permits a much lower match threshold (down to 1–2 tokens) within that anchored region because the search space is small enough that false positives can't drift in.

**Why:** Short / generic bullet text ("Built the CLI", "Wrote tests") doesn't have enough unique tokens to pass the global threshold. But when we know it lives **directly under** the parent experience whose bbox is at y=200, the search region collapses to a ~150px tall band — small enough that even a 1-token match is meaningful.

```
                ┌──────────────────────────────────────┐
                │  parent: Robotics Engineer (y=200)   │ ← matched
                └──────────────────────────────────────┘
                    │
                    │ y range: parent.y0 .. parent.y0 + 200
                    │ (capped at next-sibling-parent's y)
                    ▼
                ┌──────────────────────────────────────┐
                │  bullet candidates only in this band │
                └──────────────────────────────────────┘
```

**Files:**
- `apps/web/src/lib/parse/pdf-positions.ts`:
  - `findPositionsForText` accepts an optional `anchorBbox: { page, y0, yMax }` in options.
  - When anchored: filter `items` to those on `anchorBbox.page` with `y0 >= anchorBbox.y0 && y1 <= anchorBbox.yMax`.
  - With the smaller corpus, the match threshold can drop to `max(1, ceil(tokens × 0.3))` because false-positive risk is low.
- `apps/web/src/app/api/upload/route.ts`:
  - Process **roots first** (experiences, projects, education) — write their bboxes.
  - Then process bullets — for each, look up its parent's bbox and pass it as `anchorBbox`.
  - If parent has no bbox, fall back to unanchored search.
- `apps/web/src/lib/parse/pdf-positions.test.ts` — test that a generic-bullet needle matches inside its parent's anchor but NOT outside it.

**Acceptance:**
- Generic bullets that previously missed now resolve when their parent is known.
- No regressions on bullets whose parent didn't match (unanchored fallback path).
- Master-resume match rate target: ≥38/39 entries.

---

## P2.2 — Premium tier scaffolding (no implementation)

**Decision:** Lay the data + settings groundwork for the premium upgrades without implementing any of them in this spec. Specifically:

1. **Schema column** `profile_bank.match_method TEXT` — `null` for legacy entries; `"fuzzy"` for free-tier matches; future values `"embedding"`, `"llm-citation"`, `"document-ai"`.
2. **Settings flag** `aiConfig.matchUpgrade: "off" | "embedding" | "llm"` — read in the upload route to decide whether to run premium tiers after the free cascade exhausts.
3. **Followup spec stub** `docs/preview-match-premium-spec.md` — documents the embedding and LLM-citation paths in detail, marked as not-yet-implemented.

**Why:** Future-proofs the schema so we don't need a second migration when the embedding tier ships. Keeps the OSS/self-host promise intact — `matchUpgrade: "off"` is the default, and free-tier deployments never hit any external API.

**Files:**
- `apps/web/src/lib/db/profile-bank.ts` — additive migration for `match_method`.
- `apps/web/src/lib/db/schema.ts` — drizzle column.
- `packages/shared/src/types.ts` — extend `BankEntry` with `matchMethod?: string`.
- `apps/web/src/app/api/upload/route.ts` — write `"fuzzy"` when the free cascade succeeds.
- `docs/preview-match-premium-spec.md` (new) — stub documenting:
  - Embedding nearest-neighbor with sqlite-vec + Voyage `voyage-3-lite`
  - LLM-citation re-prompt path
  - Document AI provider path (Google / AWS)
  - All gated behind `matchUpgrade !== "off"` and the existing `gateOptionalAiFeature` check
  - Cost / latency estimates per option

**Acceptance:**
- Migration is additive (existing rows get `null`).
- Type-check passes.
- The OSS code path is unchanged — no new external calls happen when `matchUpgrade` is unset.
- Followup spec exists and is linked from the main rework spec's "Related specs" section.

---

# Verification

For each phase:

1. **Unit tests in `pdf-positions.test.ts`** — every new behavior gets a small synthetic test.
2. **Real-resume tests in `pdf-positions.real-resume.test.ts`** — extend the multi-page scenario with the specific patterns each P-item targets (head-rewritten, tail-rewritten, generic-bullet, junk-heavy page).
3. **Manual re-upload after each phase** — re-upload Kevin's master resume, capture the `[upload] bank entries matched to positions { ... }` log, paste the new match count into the spec's progress table.
4. **No regression on the test-resume.pdf fixture** — Playwright e2e test continues to highlight both entries.

**Match-count targets:**

| Phase | Target on master resume |
| ----- | ----------------------- |
| Current | 34/39 (87%) |
| After P0 | 36/39 (92%) |
| After P1 | 37/39 (95%) |
| After P2 | 38/39 (97%) |

If we miss a target, we stop and diagnose before moving to the next phase — the diagnostic endpoint (P1.3) is the tool.

---

# Open questions

1. **Where does `match_method` get exposed in the UI?** Probably nowhere user-facing in the free tier. For premium, surfaced in the preview modal as "matched via embedding" / "matched via LLM citation" so the user knows when they're getting the upgrade.
2. **Should the diagnostic endpoint be production-accessible or dev-only?** Recommend dev-only (gate behind `NODE_ENV !== 'production'` or a debug flag) to avoid leaking match internals as a side channel.
3. **Damerau-Levenshtein distance threshold tuning.** Distance 1 is safe; distance 2 risks false positives. Recommend starting with 1 and bumping only after empirical evidence.

---

# Related specs

- `docs/components-page-rework-spec.md` — the broader components-page rework this builds on.
- `docs/components-preview-feature-spec.md` — the fuzzy-match feature itself; this spec is its hardening phase.
- `docs/preview-match-premium-spec.md` — premium-tier upgrades (embedding, LLM-citation, Document AI).

---

# Implementation order

1. P0.1 (tail-suffix cascade) — smallest change, biggest immediate win
2. P0.2 (junk-item filter) — orthogonal cleanup, frees budget for downstream tiers
3. P0.3 (per-category thresholds) — recovers the long-bullet misses
4. **Manual re-test against master resume; verify P0 target**
5. P1.1 (multi-needle generation) — broader recall improvement
6. P1.2 (Damerau-Levenshtein) — long tail of typo/plural cases
7. P1.3 (diagnostic endpoint) — debug infrastructure for the future
8. **Manual re-test against master resume; verify P1 target**
9. P2.1 (parent-anchored search) — exploits structural info; biggest single recall jump
10. P2.2 (premium scaffolding) — sets up the followup
11. **Manual re-test against master resume; verify P2 target**

Each numbered item is a separately committable PR with its own tests.
