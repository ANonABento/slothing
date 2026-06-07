# Spec — AI Bank Authoring + Grounded Tailoring

**Date:** 2026-06-07 · **Status:** Draft for review · **Author:** Claude
**Supersedes/extends:** `docs/product-viability-roadmap.md` §0.1 (anti-fabrication) and §1.1
(eval grounding). All file:line refs verified this session.

## 1. The problem this unifies

Two things look opposed but are the same feature:
- **Anti-fabrication** (verified hole): AI tailoring takes experience `company/title/dates`
  straight from the LLM and only filters claims through a hardcoded 9-word regex
  (`src/lib/tailor/generate.ts:242,249`). Fabricated employers/dates/metrics survive.
- **AI bank authoring** (new ask): let AI help users add/strengthen bullets in their bank,
  and let tailoring add/tweak points toward a job — *without* inventing experience.

The resolution is one model: **AI never originates facts; it only re-expresses material the
user supplied, and anything AI writes is a `draft` that isn't usable as fact until the user
confirms it.** That single rule powers anti-fabrication, bank authoring, and the
tailoring↔bank loop.

## 2. Foundation — provenance & verification on every bank entry

`profile_bank` (`src/lib/db/schema.ts:750-794`) already carries provenance
(`source_document_id`, `confidence_score`, `match_method` which even reserves `llm-citation`)
but has **no verification state**. Add it via the established additive-migration pattern
(`ensureProfileBankHierarchySchema`, `src/lib/db/profile-bank.ts:186-236`):

| New column | Values | Meaning |
| --- | --- | --- |
| `status` | `verified` \| `draft` \| `suggested` | `verified` = user-confirmed fact (tailoring may assert it). `draft` = AI/user-in-progress, not yet a fact. `suggested` = AI proposal toward a specific job. |
| `authored_by` | `user` \| `import` \| `ai_articulated` \| `ai_strengthened` | who produced the text. |
| `grounded_in` | JSON | what the AI text was derived from: `{ kind: "raw_input"\|"entry", refId?, rawText? }` — the evidence the grounding check ran against. |
| `verified_at` | text | when the user confirmed. |

**Migration default = `verified` / `authored_by` per origin.** Existing imported + manual
entries are the user's real content → `verified`. (Uploaded-résumé content is the user's own
truth.) Only AI output starts as `draft`/`suggested`.

**The load-bearing invariant:** tailoring's groundable evidence = **`status = 'verified'`
entries only.** Drafts/suggestions are visible in the bank and usable in the editor, but are
never treated as established fact and are always shown with an "unverified" treatment.

## 3. The grounding engine (shared)

A new pure module `src/lib/grounding/` — the single validator reused everywhere:

```
groundClaims(outputText, evidenceText) -> {
  supported: string[],          // claims traceable to evidence
  unsupported: string[],        // claims with no evidence (drop or flag)
  ungroundedNumbers: string[],  // digits/metrics in output absent from evidence (hard fail)
}
```

Rules: tokenize output into claims (bullets/phrases); a claim is *supported* if its content
words sufficiently overlap an evidence sentence (lemmatized overlap + key-noun match); **any
number/metric in the output must appear verbatim (normalized) in the evidence** — this is the
highest-risk axis and gets a hard check, not fuzzy overlap. This replaces the 9-word regex
(`generate.ts:242`) and is the basis of the eval metric (§7).

## 4. The two AI operations (both grounded, never fact-originating)

### 4.1 Strengthen (existing entry → better entry)
Input: a `verified` bullet/entry (+ optional job context). AI rewrites for impact / clarity /
keyword surfacing. **Grounding:** output claims ⊆ original entry's claims; no new numbers.
Output: a `draft` variant beside the original (user accepts → replaces or adds; original is
never silently overwritten). This is the safest op (evidence = the user's own existing
bullet) → ship first.

### 4.2 Articulate (raw user material → bullets)
Input: the user's own words — a sentence, messy notes, or an answer to an interview-style
prompt ("What did you do at Acme? What changed because of it?"). AI turns *that text* into 2-3
strong bullet variants. **Grounding:** claims/numbers ⊆ the user's input text. Output: `draft`
entries (with `grounded_in.rawText` = the user's input, so the evidence is auditable). The
facts come from the user; AI only phrases them.

**Neither op ever generates from a job description alone.** A JD can *prompt a question*
("this role wants Kubernetes — did you use it?") but the user must supply the substance.

## 5. UX & UI placement

Reuse the existing **upload review modal** flow (`components-tab.tsx:1193-1727`, commit at
`:1674`) as the "AI drafted → you review → confirm" template — it already does
accept/edit/discard → commit.

**A. Bank page (`/components`)** — primary home:
- **"Draft with AI"** entry next to `AddEntryDialog` → opens the Articulate flow (an
  interview-style mini-form; the user types real material) → draft entries land in a review
  panel → confirm flips them to `verified`.
- **Per-card "Strengthen with AI"** (the `Sparkles` icon already imported but unused —
  `components-tab.tsx:57`; card header `chunk-card.tsx:205-231`) → Strengthen op → shows the
  variant inline to accept/dismiss.
- **"Unverified draft" badge** at the confidence-chip slot (`chunk-card.tsx:222-230`); one
  change covers cards, drawer, and review modal (all reuse `ChunkCard`). Draft entries are
  visually distinct and sort/filterable.

**B. Studio / AI tailor** — the loop (see §6):
- **Gap chips** ("Missing: Kubernetes") → **"Add evidence"** → inline Articulate with the JD
  as context → draft → confirm → re-tailor.
- **"Strengthen toward this job"** → Strengthen on relevant verified bullets to surface
  keywords the user *already has evidence for* → `suggested` entries the user accepts.

## 6. Tailoring integration (the loop)

1. **Grounded tailoring (anti-fabrication fix).** Tailoring runs on `verified` entries only.
   Feed bank entries to the LLM **with ids**; require it to return `{ sourceEntryId,
   rewrittenHighlights }` per role. The server rebuilds each role's `company/title/dates`
   **from the entry by that id** (mirrors the education override at `generate.ts:133`) — fake
   employers/dates become structurally impossible. Every output bullet passes
   `groundClaims` against that entry's evidence; unsupported claims/numbers are dropped.
2. **Gap → Articulate.** When a JD requirement has no verified evidence, tailoring emits a
   gap (it already computes `keywordsMissing`, `analyze.ts`). The UI offers "Add evidence",
   which launches Articulate with job context. The AI asks; the user answers; a draft is
   created. Tailoring **never** fills the gap itself.
3. **Strengthen toward job.** For keywords the user *does* have evidence for but didn't
   surface, tailoring proposes grounded Strengthen rewrites as `suggested` entries.
4. **Confirmation gate.** Anything AI adds toward a job is `draft`/`suggested`. It can appear
   in the preview with an explicit "unverified — confirm to keep" treatment, but is excluded
   from the "facts" set and from export-as-final until confirmed.

## 7. Anti-hallucination — the full stack of guarantees

1. AI only transforms user-supplied text (existing entry or raw input); never the JD alone.
2. `groundClaims` runs on **every** AI write and every tailoring output; unsupported
   claims/numbers are stripped or flagged.
3. Hard numeric check: any metric/number in output must appear in the evidence.
4. All AI output is `draft`/`suggested`; only user confirmation makes it `verified` fact.
5. Tailoring grounds only on `verified` entries.
6. Eval + CI: a grounding metric + adversarial fixtures (invented employer/date/metric) gate
   regressions (fixes the broken offline harness at `evals/adapters.ts:31`; adds the metric
   to `evals/metrics/index.ts` and a factuality dimension to `evals/judge.ts`).

## 8. API surface (new/changed)

- `POST /api/bank/ai/draft` — `{ mode: "articulate"|"strengthen", input, jobContext? }` →
  returns ungrounded-stripped draft variants (not yet persisted, or persisted `status:draft`).
- `POST /api/bank` — extend `createBankEntrySchema` (`src/lib/schemas/bank.ts`) to accept
  `status`, `authoredBy`, `groundedIn` (default `status:verified, authoredBy:user` to preserve
  current behavior).
- `PATCH /api/bank/[id]` — allow `status` transition `draft→verified` (sets `verified_at`).
- `POST /api/bank/ai/commit` (optional) — batch-confirm drafts, mirroring the import commit
  route, for the review-modal flow.
- Tailoring (`/api/tailor`, `generate.ts`) — id-anchored generation + `groundClaims`; reads
  `verified`-only.

## 9. Risks & decisions

- **Scope creep into "AI writes your résumé for you."** Mitigation: the draft/verified gate +
  grounding are non-negotiable; "generate from JD alone" is explicitly out of scope.
- **Grounding false-positives** (dropping legit bullets). Mitigation: tune overlap threshold
  on the eval golden set; prefer *flag* over *delete* in the UI where a human is present.
- **Two banks confusion.** `profile_bank` (this spec) vs `answer_bank` (Q&A, has its own
  `source`) vs `chunks` (RAG; note `runRetrievalPipeline` reads `chunks`, not `profile_bank`).
  This spec is `profile_bank` only.
- **Numbers in evidence vs output formatting** ("40%" vs "40 percent"). Normalize before the
  numeric check.

---

# Implementation roadmap

Phased; each phase ships independently and is CI-green. Effort is rough dev-days.

### Phase 0 — Foundation (safety + testability) · ~3-4d · **do first**
- Additive migration: `status`/`authored_by`/`grounded_in`/`verified_at` on `profile_bank`
  (default existing → `verified`). Update `BankEntry` type, `/api/bank` schemas, helpers.
- Build `src/lib/grounding/` + unit tests (incl. the numeric hard-check).
- Fix the offline eval adapter (`evals/adapters.ts:31`); add a `grounding` metric to
  `evals/metrics/`; wire a capped offline eval into CI.
- **Acceptance:** migration safe on existing dev DBs; grounding engine + eval run green
  offline; adversarial fixtures (invented employer/date/metric) are caught.

### Phase 1 — Grounded tailoring (close the anti-fabrication hole) · ~2-3d
- Id-anchored generation: experiences rebuilt from `verified` bank entries by id; replace the
  9-word regex with `groundClaims`; tailoring reads `verified`-only.
- **Acceptance:** test corpus of fabricated outputs is provably stripped; no output
  entity/claim lacks a verified-bank source; eval grounding score gates CI.

### Phase 2 — Bank authoring: Strengthen · ~2-3d
- `status` badge + per-card "Strengthen with AI" + accept/dismiss; `POST /api/bank/ai/draft`
  (strengthen mode); draft→verified confirm.
- **Acceptance:** strengthening a bullet never adds facts/numbers (grounded ⊆ original);
  output is a draft until accepted; original never silently lost.

### Phase 3 — Bank authoring: Articulate · ~3-5d
- "Draft with AI" interview/raw-text flow → draft entries → review-modal-style confirm.
- **Acceptance:** articulated bullets contain only facts/numbers present in the user's input;
  all land as drafts; confirm flips to verified.

### Phase 4 — Tailoring ↔ bank loop · ~3-4d
- Gap chips → inline Articulate with job context; "Strengthen toward this job" suggestions;
  drafts/suggestions shown unverified in preview; confirm gate before export-as-final.
- **Acceptance:** a JD gap routes to a user-answered draft (never auto-invented); suggestions
  toward a job are grounded and require confirmation.

### Phase 5 — Polish & eval expansion · ~2-3d
- Expand adversarial fixtures; judge factuality dimension; UX for bulk-confirm; metrics on
  draft→verified conversion.

**Critical path:** Phase 0 → 1 (safety) before any authoring UI ships. Phases 2-4 can then go
in order; the TipTap→RDM converter (viability roadmap §1.2) is independent and can run in
parallel.
