# Product viability roadmap — what's needed before meaningful use

**Date:** 2026-06-07 · **Author:** Claude (evidence-backed; every claim verified in code/tests this session)
**Companions:** `docs/resume-template-fidelity-roadmap.md`, `docs/ui-audit/fidelity-audit-2026-06-06/`

This is the "what else before people meaningfully use this" plan, grounded in a code-level
audit of five areas: AI-tailoring safety/quality, the editor data model, the job-search
loop, first-run, and ATS. Findings are cited to `file:line`. Tiers are ordered by what
blocks *repeated, trusted* use — not demo-ability.

> Note: the configured LLM key was out of quota (429) the whole session, so live tailoring
> quality could not be measured — itself a Tier-0 signal (see §0.2).

---

## Tier 0 — Trust & correctness (nothing else matters without these)

### 0.1 Anti-fabrication — VERIFIED HOLE (highest stakes)

**State:** Partial. `contact` and `education` are forced from source data
(`src/lib/tailor/generate.ts:117,133` — an LLM-supplied "Wrong School/MBA" is correctly
discarded, `generate.test.ts:558`). But:
- `experiences` are taken **from the LLM** and only highlight-filtered:
  `sanitizeExperiences` spreads `...experience` (`generate.ts:249`), so **company, title,
  and dates pass through untouched** — a fabricated employer/title/date survives.
- The only grounding filter is `getUnsupportedKeywords(extractKeywordCandidates(jd), …)`
  where `extractKeywordCandidates` is a **hardcoded 9-term regex**
  (`AWS|Kubernetes|GraphQL|React|TypeScript|Python|Node|SQL`, `generate.ts:242-247`). Any
  fabricated metric ("grew revenue 40%"), responsibility, or skill outside those 9 words
  is **not validated**. Prompt "NON-OVERRIDABLE SAFETY RULES" exist (`prompt-builders.ts:79`)
  but are instruction-only.

**Why it matters:** a résumé that invents experience gets the user caught in interviews /
background checks. This is the one thing that makes the product a liability, not just weak.

**Next steps**
1. **Force experience identity from matched bank entries** — `company`/`title`/`dates`
   come from the bank entry the LLM was asked to rewrite, never from free output (mirror
   the education override). *~1 day.*
2. **Entry- and claim-level grounding validator** — every output bullet must be a
   paraphrase/substring of some bank-evidence sentence, or it's dropped/flagged. Replace
   the 9-term regex with real evidence matching over `buildBankEvidenceText`. *~1-2 days.*
3. **Grounding metric in evals** (see §1.1) as the regression guard. *~1 day.*

**Acceptance:** a test corpus of adversarial LLM outputs (invented employer, fake date,
unfounded metric) is provably stripped/flagged; no output entity/claim lacks a bank source.

### 0.2 AI reliability & billing correctness

**State:** The Gemini key 429'd all session → every AI action failed. The free-user gate
degrades gracefully (BYOK/Pro card, `ai-assistant-panel.tsx:784`), but for paying/BYOK
users a flaky or quota-exhausted provider = the core feature is dead, and quota/billing
bugs read to users as "the product is broken."

**Next steps:** provider fallback chain + clear, distinct error states (quota vs auth vs
outage); harden the BYOK + credit-ledger paths from the OSS/pricing plan; a synthetic
"can I actually call the model" health check surfaced in Settings. *~2-4 days.*

**Acceptance:** with a dead primary provider, a BYOK/credited user still tailors (fallback)
and a free user sees the correct upsell — both proven by tests.

### 0.3 Post-import correction UX

**State:** Extraction is a deliberate ~82% draft (`extract/content.ts:18-24`). Tonight's
audit fixed the worst cases, but real CVs still need correction. There is **no structured
"fix the extracted fields" step** — the user commits a template, then hand-edits prose in
Studio TipTap. So the first impression is "the import is wrong and I have to retype it."

**Next steps:** a structured review/correction screen for the extracted RDM before/after
commit (edit basics/work/education/skills as fields, not prose), reusing the import
dialog's preview. *~3-5 days.* Pairs with §1.2 (the converter makes field-edits round-trip).

**Acceptance:** a user can correct a mis-parsed entry in <30s without retyping the résumé.

---

## Tier 1 — The value loop must actually pay off

### 1.1 Tailoring quality eval (currently can't measure it)

**State:** Real eval infra exists (`apps/web/evals/`): a golden set (50 résumés / 250 jobs
/ 250 cases, `evals/data/`), a harness (`evals/harness.ts`, `pnpm eval`), deterministic
metrics (keyword overlap, action verbs), an LLM judge (`evals/judge.ts`), and an offline
prompt-QA suite. **But:** (a) the offline harness is broken — `profileToBankEntries`
(`evals/adapters.ts:31`) dumps the whole profile into one `bullet`-category entry while
`generateBaseFromBank` only reads `experience/skill/education` (`generate.ts:153`), so the
offline path produces an empty résumé and scores ~0 (measured: `EVAL_OFFLINE=1 pnpm eval`
→ avg 0.016, keyword_overlap 0); (b) no grounding/factuality metric; (c) judge needs a live
key and has no factuality dimension; (d) evals aren't in CI.

**Next steps:** fix the offline adapter (~2-4h); add a deterministic grounding metric
(~1d, doubles as §0.1's guard); add a factuality dimension to the judge (~0.5d); wire a
capped offline eval into CI (~0.5d). *Total ~2-3 days.*

**Acceptance:** `pnpm eval` offline produces meaningful, non-zero quality + grounding
numbers on the golden set, and a regression in tailoring quality/safety fails CI.

### 1.2 TipTap → RDM converter (the keystone)

**State:** The editor data graph is **fan-out only** — `Bank/TailoredResume → TipTap/RDM/
HTML` exist; **every reverse edge into a structured model is missing** (no `tipTapToRdm`,
no `tipTapToTailoredResume`). Studio edits live only in TipTap
(`use-studio-page-state.ts:1023`). **Consequence (a real silent bug):** `/api/resume/export`
renders Typst/grammar from `tailoredResumeToRdm(resume)` — the *original* résumé, not the
edited doc (`render-resume.ts:80`, `route.ts:266,325`) — so **Typst/typeset export silently
ignores everything the user edited in Studio.** (HTML/DOCX escape this; they consume the
edited `content`/`html`.)

**Feasibility (good):** the résumé TipTap doc is **self-describing** — custom nodes carry
identity in attrs: `contactInfo` (basics fields), `resumeSection` (`title`), `resumeEntry`
(`company/title/dates`) (`editor/extensions.ts:237,365,433`). So a reverse converter is a
deterministic walk for the canonical shape, with heuristics only at the edges (date string
→ start/end; skills re-split; renamed/custom sections; projects/certs/awards aren't emitted
forward so can't reverse). Categorically easier than the PDF extractor.

**Next steps:** build `src/lib/editor/tiptap-to-rdm.ts` (`tipTapToRdm(doc)`), validate
against `resumeDocumentModelSchema`, with a round-trip test suite
(`tailoredResumeToTipTapDocument → tipTapToRdm` ≈ identity modulo known-lossy fields). Then
rewire the Typst/LaTeX/grammar export paths + the export-menu payload to send `content` and
build RDM from the live doc. *~2-3 days.* **Unlocks:** Typst-from-Studio (finishes audit
F-012), faithful re-tailoring of edited résumés, and round-tripping.

**Acceptance:** editing a bullet in Studio then exporting Typst PDF reflects the edit;
round-trip test passes; the F-012 Studio menu items can ship.

### 1.3 Close the job-search loop

**State:** The skeleton is genuinely built and the kanban/status layer is strong (8 statuses,
drag-between-lanes, `job_status_history`). But three seams force manual re-entry:
- **Follow-up reminders never auto-create.** `createFollowUpReminder`
  (`lib/db/reminders.ts:320`) is **dead code** — never called. Marking a job "applied"
  schedules nothing, despite full reminder infra + cron existing. (`/api/cron/follow-ups`
  is the *welcome-email* series, not job follow-ups — a naming trap.)
- **Studio deep-link drops job context.** `/studio?opportunityId=` is emitted
  (`opportunity-drawer.tsx:227`) but Studio never reads it (`use-studio-page-state.ts:374`),
  so tailoring-from-a-job forces manual re-selection.
- **Studio-tailored résumés are browser-local.** `linkedResumeId` stores a localStorage
  version id (`lib/opportunities.ts:184`), not server-resolvable — the résumé attached to a
  job can't be retrieved on another device. (The `/opportunities/[id]/generate` path *does*
  persist server-side — two divergent tailoring systems.)

**Next steps (high ROI, small):** auto-create a follow-up reminder on status→applied
(~0.5d); make Studio honor `opportunityId` + preload the JD (~0.5-1d); persist
Studio-tailored résumés server-side before linking (~1-2d); add a per-job "application
packet" read-model (~1-2d). *Items 1-2 are the loop-closers.*

**Acceptance:** apply → a follow-up reminder appears automatically; "tailor from job" opens
Studio pre-loaded; the linked résumé opens on any device.

---

## Tier 2 — Stickiness

### 2.1 First-run time-to-value (cold-start wall)

**State:** Two disconnected onboarding systems (a welcome modal + a dashboard checklist),
and the modal's "Upload Your Resume" step is a **non-functional placeholder** — a decorative
drop-zone with no file input (`components/onboarding/steps/UploadStep.tsx`); it routes to
`/studio` with an empty bank, where tailoring is hard-blocked
(`studio/page.tsx:388`, `resume-preview.tsx:95`). The only real path is upload → extract →
**review/commit gate** → stage entries → paste JD → tailor (~6-8 steps), and there is **no
demo/sample data** to reach the aha first.

**Next steps:** make the modal upload actually upload or route to `/components` (~1-2d); add
a "try with example data" seed (~1-2d); one-click "accept all" for high-confidence
extractions to collapse the review gate (~1d); unify the two onboarding systems (~0.5d).

**Acceptance:** a brand-new user reaches a tailored résumé in <5 minutes, or sees a sample
tailored résumé in <60s.

### 2.2 Surface ATS (great engine, walled off)

**State:** The ATS engine is genuinely thorough and well-tested (5 weighted axes; catches
hidden-text/prompt-injection/keyword-stuffing; 210/210 tests pass — `lib/ats/scoring/`).
**But it's isolated in a standalone `/ats` page** — Studio and the tailor flow never call
`scanResume`; the only in-product "ATS" claim is the static export label "ATS-friendly"
(`studio-sub-bar.tsx:1006`). A user must leave their flow and re-paste résumé+JD to get a
score.

**Next steps (high leverage — engine + UI cards already exist, mostly wiring):** auto-run
`scanResume` on the tailored draft and show `ATSScoreCard` in Studio (~M); a real "ATS
readiness" check at export time replacing the static label (~S-M); promote single-column
templates as "ATS-safe" using the existing `layout` flag (~S).

**Acceptance:** the ATS score updates live as the user tailors, inside Studio.

---

## Tier 3 — Business viability

Largely planned (`project_oss_launch_pricing_and_billing_plan`): AGPL + cloud carve-out,
BYOK, Stripe, credit ledger. The gap is execution + hardening; §0.2 (billing/quota
correctness) is the part that directly affects perceived product quality.

---

## Recommended sequencing

1. **§0.1 anti-fabrication** + **§1.1 eval grounding metric** — do together; the eval is the
   safety net for the fix. *Highest stakes, ~3-4 days combined.*
2. **§1.2 TipTap→RDM converter** — keystone; unlocks Typst-from-Studio, re-tailoring,
   round-trip; fixes a live silent-data-loss export bug. *~2-3 days.*
3. **§1.3 loop-closers** (auto follow-up + Studio `opportunityId`) — tiny, high retention ROI.
4. **§2.2 surface ATS in Studio** — high leverage, mostly wiring.
5. **§2.1 first-run** + **§0.3 correction UX** — convert trials to activated users.
6. **§0.2 / Tier 3** billing hardening alongside the OSS launch.

The throughline: **trust first** (don't fabricate, don't silently drop edits, don't show a
broken first run), then **make the value legible** (eval-proven tailoring, ATS in-flow), then
**close the loop** so it's a system people return to — which is the actual product promise.
