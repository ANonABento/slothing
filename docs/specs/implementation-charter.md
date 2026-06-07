# Implementation charter — Grounded Bank Authoring (autonomous /goal)

**Date:** 2026-06-07 · **Branch:** `feat/grounded-bank-authoring` (off `main`) · **One PR at the end.**
**Mode:** Run straight through all phases; stop only on a genuine blocker. **Owner:** Claude (autonomous).

This is the operating contract for the autonomous loop. The *what* lives in
`docs/specs/ai-bank-authoring.md` (the spec) and `docs/product-viability-roadmap.md`. This is
the *how* — definition of done, the verification loop, and stop conditions.

## Phases (in order, one branch, one PR at end)

- **P0 — Foundation:** `status`/`authored_by`/`grounded_in`/`verified_at` additive migration on
  `profile_bank`; `src/lib/grounding/` engine; fix offline eval adapter; grounding eval metric; CI wiring.
- **P1 — Grounded tailoring:** id-anchored experiences (rebuild company/title/dates from
  verified bank entries); replace the 9-word regex with `groundClaims`; tailoring reads `verified`-only.
- **P2 — Strengthen:** per-entry AI rewrite (claims ⊆ original); draft/verified badge; confirm flow.
- **P3 — Articulate:** raw-material → draft bullets (claims ⊆ user input); "Draft with AI" flow.
- **P4 — Tailoring↔bank loop:** JD gap → inline Articulate; "strengthen toward job" suggestions; confirm gate.
- **P5 — Polish & eval expansion:** adversarial fixtures, judge factuality dim, bulk-confirm UX, metrics.

## Per-phase Definition of Done (ALL must hold before moving on)

1. **Acceptance criteria** for the phase (from the spec) are met and demonstrated.
2. **Tests written** for the new behavior (unit + integration as applicable), and they pass.
3. **Full gates green locally:** `pnpm run type-check`, `pnpm run lint`, `pnpm run test:run`.
4. **No regressions:** the full suite still passes (4249+ tests baseline).
5. **Committed** on the branch with a clear message (no `Co-Authored-By` trailer; never `--no-verify`).
6. **Self-review pass:** re-read the diff for correctness/altitude before declaring done.

## The verification & fix loop (per phase)

```
implement smallest coherent slice
  → run targeted tests → fail? fix → repeat until green
  → run type-check + lint → fail? fix → repeat
  → run full suite → regressions? fix → repeat
  → self-review diff → issues? fix → repeat
  → commit
repeat slices until the phase's Definition of Done holds
  → then advance to the next phase
```
"Tip top perfect" = Definition of Done holds AND a skeptical re-read finds nothing to fix.

## LLM-down handling (current: Gemini key 429)

The live LLM is out of quota. Therefore:
- Everything is built to be **verifiable offline** with a mocked/stub LLM (unit + integration).
  This is required regardless of quota.
- Where a phase has *live-LLM end-to-end* verification (P1 quality, P3/P4 real generation), that
  E2E check is recorded as **`PENDING-QUOTA`** in the PR + charter checklist and is **not** a reason
  to halt — continue to the next offline-testable work. Never mark such a step "verified" from a
  live run that didn't happen; mark it pending.

## Stop conditions (surface to the user, don't guess)

Stop and summarize only when:
- A decision is genuinely ambiguous / not derivable from the spec, code, or sensible defaults.
- A gate fails in a way I cannot resolve without a product/architecture decision.
- Something requires the live LLM to *decide correctness* (not just to run) and quota is down.
- A change would violate a CLAUDE.md guardrail (forbidden colors/time/font/radius, destructive
  actions without confirm/undo, schema rewrite instead of additive migration, etc.).

## Guardrails (CLAUDE.md — non-negotiable)

- Additive migrations only (`PRAGMA table_info` + `ALTER TABLE ADD COLUMN`); never drop/recreate.
- Scope every query by `user_id`. Respect dedupe hashes.
- Forbidden-color/time/font/radius/page-width lint must pass. No `bg-white` etc.
- Destructive/irreversible UI actions use confirm dialog or undo snackbar.
- No `Co-Authored-By` trailer; no AI-attribution in commits/PR. No `--no-verify`.

## Progress ledger (updated as the loop runs)

- [x] **P0 Foundation** — DONE 2026-06-07. Commits: 3e3abc86 (docs), 48d9add9 (provenance
  migration: status/authored_by/grounded_in/verified_at + helpers + /api/bank + tests),
  465d5049 (shared grounding engine src/lib/grounding, 12 tests), 8207c381 (offline eval
  adapter fix → 0.016→0.51, grounding metric + weight 0.3, capped offline CI gate
  grounding-gate.test.ts). All gates green; no live LLM needed.
- [x] **P1 Grounded tailoring** — DONE 2026-06-07. Commit d9b56114: generate.ts id-anchors
  experiences to verified bank entries via sourceEntryId (company/title/dates rebuilt from
  the entry; unanchored dropped), grounds highlights/skills/summary via src/lib/grounding
  (deleted the 9-word regex + sanitizeExperiences/buildBankEvidenceText), verified-only
  reads; prompt-builders exposes id= + requires sourceEntryId. Anti-fabrication test
  rewritten + green; full suite green (web 4268). Live-LLM tailoring quality: PENDING-QUOTA.
- [x] **P2 Strengthen** (backend) — DONE 2026-06-07. Commits: baa3f453 (confirm path:
  setBankEntryStatus + POST /api/bank/[id]/confirm), cedd9ddc (AI Strengthen:
  src/lib/bank/ai-authoring.ts + POST /api/bank/ai/draft — grounded rewrite ⊆ original →
  status:draft authoredBy:ai_strengthened, AI-gated, getBankEntryById). Mocked-LLM tests
  green. Live rewrite quality: PENDING-QUOTA. NOTE: the per-card "Strengthen with AI" button
  + draft/verified badge (UI) are folded into the P5 UI pass.
- [x] **P3 Articulate** — DONE 2026-06-07. Commit 6f4ca294: POST /api/bank/ai/draft
  mode:'articulate' turns the user's raw notes into bullets grounded ⊆ the notes →
  status:'draft' authoredBy:'ai_articulated' groundedIn{kind:'raw_input'}; 422 when nothing
  grounds. Route is a discriminated union (strengthen|articulate). Also fixed a
  grounding-engine NUMBER_RE bug (unit suffix ate the next word's first letter, "6 minutes"→
  "6m"). Mocked-LLM tests for both modes; live quality PENDING-QUOTA.
- [ ] P4 Tailoring↔bank loop
- [ ] P5 Polish & eval

> The loop appends a dated note under each phase as it completes, with what was verified and
> any `PENDING-QUOTA` items.
