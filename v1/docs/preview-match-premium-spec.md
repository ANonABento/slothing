# Preview match — premium tier spec (followup)

**Status:** Stub · 2026-05-16
**Builds on:** `docs/preview-match-cascade-spec.md` (deterministic free-tier baseline).
**Goal:** When the free deterministic cascade fails to resolve a bank entry to its source bbox, fall through to optional premium tiers powered by external APIs (embeddings, LLM citations, Document AI). Gated behind a user-controlled setting so the OSS/self-host path never hits an external service unless the operator opts in.

This document is **not yet implemented** — it captures the design intent so the data model + settings flag introduced in P2.2 of the parent spec are aligned with the eventual implementation.

---

## Architecture

```
free deterministic cascade (P0–P2 of the parent spec)
        │
        ├─ matched ─► persist source_page + source_bbox + match_method="fuzzy"
        │
        └─ missed ─► consult aiConfig.matchUpgrade
                        ├─ "off"          ─► persist no bbox; entry shows "no preview"
                        ├─ "embedding"    ─► tier 1 (nearest-neighbor)
                        └─ "llm"          ─► tier 2 (LLM citation re-prompt)
```

Each premium tier must run **after** the free cascade has exhausted, never instead of it. The free path is the canonical baseline.

`match_method` records the winning tier so the preview modal can surface "matched via X" when premium ran. Free-tier matches stay labelled `"fuzzy"`.

---

## Tier 1 — Embedding nearest-neighbor

**Stack:**
- Embeddings: Voyage `voyage-3-lite` (~$0.02 / 1k tokens, 1024-dim) — best quality-per-dollar for short snippets.
- Vector store: sqlite-vec (extension to better-sqlite3, already in the stack).
- Index: per-document, in-memory, built once at upload time and persisted via the existing PDF cache pattern.

**Flow:**
1. At upload time (after free-tier match attempt), embed every pdfjs text item with its surrounding context (current line + 1 above + 1 below).
2. For each missed entry, embed the bank entry's content (joined fields) and find the top-k nearest items.
3. Use the same `buildBboxTuples` infra to convert the matched items into bboxes.
4. Persist with `match_method = "embedding"`.

**Cost estimate:** A 2-page resume has ~600 text items. ~$0.012 per upload to embed. Per-document, not per-query — re-uses across all missed entries.

**Latency estimate:** ~500ms for the bulk-embed call. Acceptable for the upload code path (already async + non-blocking).

---

## Tier 2 — LLM citation re-prompt

**Stack:**
- LLM: Anthropic `claude-haiku-4-5` (fast, cheap, JSON output) — falls back to OpenAI `gpt-5-mini` if the user's provider is OpenAI.
- Input: the full pdfjs text stream (with per-item IDs) + the missed bank entry's content.
- Output: JSON array of item IDs that compose this entry.

**Flow:**
1. For each missed entry, build a prompt: "Here is the PDF text item-by-item with IDs. Here is a parsed entry. Return the item IDs that compose this entry in the PDF."
2. The LLM returns `{ itemIds: ["item-42", "item-43"] }`.
3. Look up those items, build bboxes via `buildBboxTuples`.
4. Persist with `match_method = "llm-citation"`.

**Cost estimate:** ~$0.001 per missed entry. A typical resume has ≤5 misses, so ~$0.005 per upload.

**Latency estimate:** ~2s per entry. Run in parallel across missed entries — total ~2s for the batch.

---

## Tier 3 — Cloud Document AI

**Stack alternatives:**
- Google Document AI (Form Parser / Custom Document Classifier)
- AWS Textract (with custom queries)
- Azure Document Intelligence

**Use case:** Last-resort tier for very tricky PDFs (multi-column research papers, heavy graphical layouts). Not run by default — only when `matchUpgrade === "document-ai"` is explicitly set.

**Considerations:**
- Vendor lock-in. The other tiers swap providers easily; Document AI's response shape is provider-specific.
- Pricing varies widely ($1.50/1k pages for Google; $1.50/1k for Textract). Pre-paid only.
- Skip for OSS — only enabled in cloud tier where Stripe billing already exists.

---

## Settings + gating

New field `aiConfig.matchUpgrade: "off" | "embedding" | "llm" | "document-ai"`.

- Default: `"off"`. The OSS path runs only the free deterministic cascade.
- Surfaced in `/settings/ai` alongside the existing provider config.
- Must respect the existing `gateOptionalAiFeature` check — premium tiers won't run if the user hasn't paid (cloud) or hasn't configured a provider (OSS self-host).

Cost cap: enforce a per-document budget (e.g., $0.05) so a malicious upload of a 100-page document can't run up bills. Tracked in the existing credit ledger.

---

## Open questions

1. **Should embeddings be persisted across uploads?** Probably yes for the same document (so re-running match against an edited entry doesn't re-pay). Probably no for cross-document — would require a vector DB schema migration.
2. **Should LLM citation re-prompt be one-shot or batched?** One-shot keeps prompts focused; batched amortizes API overhead. Recommend one-shot for v1 — easier to debug, marginal cost difference.
3. **UI surface for `match_method`.** Probably a small chip in the preview modal: "Matched via fuzzy / embedding / LLM citation". Skip for free tier (always "fuzzy" → noise).
4. **Self-hostable embedding path.** Voyage requires a key. Ollama can serve `nomic-embed-text` locally — viable for OSS users who already run Ollama. Document AI is cloud-only.

---

## Related specs

- `docs/preview-match-cascade-spec.md` — the deterministic free-tier baseline this builds on.
- `docs/components-preview-feature-spec.md` — the preview feature itself.
- `ROADMAP.md` → "preview-match-premium" entry (TBA).
