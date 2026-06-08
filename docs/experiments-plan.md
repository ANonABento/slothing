# Extension A/B experiments

Lightweight A/B framework + the three experiments cherry-picked from the
SpeedyApply competitive review (see `docs/COMPETITOR-ANALYSIS.md`). Experiment
#1 (profile picker) is **built**; #2 and #3 are **registered but disabled**,
waiting on this plan.

## The framework (built)

No third-party experiment platform. The substrate is three small pieces:

| Concern | Where | Notes |
| --- | --- | --- |
| Assignment | `apps/web/src/lib/experiments/assign.ts` | `bucket()` = sha256(`key:unitId`) → `[0,1)`; `assignVariant()` maps it onto weighted variants. Deterministic, DB-free, unit-tested. |
| Registry + override | `apps/web/src/lib/experiments/index.ts` | `EXPERIMENTS` registry + `getVariant(name, userId)`. A per-user override in the `settings` table (`<key>_override`) wins — the QA/dogfood escape hatch. |
| Telemetry | `apps/web/src/lib/experiments/track.ts` | `trackExposure` / `trackExperimentEvent` / `getExperimentResults` on the shared `product_events` table (`source` = experiment key, `metadata.variant` = variant). |
| Assignment API | `GET /api/experiments/[name]` | Returns `{ variant }` for the extension (extension-token auth) + logs exposure. |

**Caveat:** `product_events` is a funnel counter, not a stats engine.
`getExperimentResults(key)` returns per-variant event counts — you eyeball the
rates; there's no p-value. For decisions, also use `COUNT(DISTINCT user_id)`
per variant (exposure rows duplicate if a user re-fetches assignment).

### Adding an experiment

1. Add an entry to `EXPERIMENTS` (`enabled: false` until ready).
2. Gate the code on `getVariant("name", userId)` (server) or
   `Messages.getExperiment("name")` (extension).
3. Emit outcome events with `trackExperimentEvent(key, variant, event, userId)`.
   Prefer server-side attribution — the variant is deterministic from `userId`,
   so the server re-derives the same assignment the client saw (see the tailor
   route for the pattern).
4. Flip `enabled: true`, watch `getExperimentResults(key)`.

---

## Experiment #1 — Profile picker + best-fit badge (BUILT)

**Hypothesis.** Letting users pick *which* saved resume to tailor from — and
recommending the best-fit one — increases tailors per user and applications
completed, vs. always tailoring from the latest/master resume.

**Registry key:** `exp_profile_picker` · variants `control` / `treatment` (50/50).

**Control:** today's behavior — sidebar "Tailor resume" seeds from the master
profile; popup shows only the latest resume.

**Treatment:**
- Sidebar (`job-page-sidebar.tsx`): a "Tailor from" `<select>` ranked best-fit
  first (★ + `NN% fit`); the selection threads through as `baseResumeId` to
  `/api/tailor`. Defaults to the best-fit resume.
- Popup (`App.tsx`): a "Best-fit resume" card on the detected-job status card
  surfacing the top match; "Open job tools" carries the user to the sidebar to
  pick + tailor (the popup itself doesn't tailor).
- Best-fit ranking: `POST /api/extension/best-fit` scores the user's recent
  `generated_resumes` against the scraped job via the shared `scoreResume`
  (per-resume `rawText` differentiates them on keyword match), best-fit first.

**Events.** `experiment_exposure` (on assignment fetch); `resume_tailored`
(server-side in `/api/tailor`, with `usedBaseResume`).

**Primary metric:** tailors per exposed user. **Secondary:** share of tailors
using a non-default base; applications completed.

**Follow-ups / known gaps:**
- No visual QA yet (no browser in the build env) — smoke-test both surfaces.
- Picker styling is minimal (native `<select>` in the shadow DOM).
- `pickedResumeId` persists across job changes within a mounted sidebar; the
  default tracks the new best-fit only until the user picks once.
- Consider showing best-fit reasons (matched keywords) in the option labels.

---

## Experiment #2 — Inline answer pre-fill (REGISTERED, disabled)

**Hypothesis.** Auto-pre-filling matched answer-bank responses into custom
question fields during autofill (push) raises fields-completed-per-application
vs. today's pull model (search box + 💡 bulb).

**Registry key:** `exp_answer_prefill` · `control` / `treatment`.

**Control:** answer bank is pull-only (sidebar search + inline bulb popover).

**Treatment:** during the autofill pass, for each detected custom-question
field, query `/api/answer-bank/match`; pre-fill high-similarity matches into the
**warm zone** only (never auto-submit, never overwrite existing values). Mark
pre-filled fields visibly so users can review/edit.

**Events.** `experiment_exposure`; `answer_prefilled` (count + similarity);
`answer_edited` (user changed a pre-filled value); `application_submitted`.

**Primary metric:** custom-question fields completed per application.
**Guardrail:** `answer_edited` rate (high = low-quality matches; back off the
similarity threshold).

**Build notes:** extend the autofill engine (`content/auto-fill/engine.ts`) to
consult the answer bank for warm-zone custom questions; reuse the existing
match endpoint. No new server scoring needed.

---

## Experiment #3 — Hardened generic autofill (REGISTERED, disabled)

**Hypothesis.** A more robust *generic* field detector lifts fill-success on
ATSs we don't have a bespoke scraper for — closing SpeedyApply's "25+ platforms"
breadth claim without writing N new scrapers. (Reviewers say SpeedyApply itself
breaks on custom fields, which is our strength.)

**Registry key:** `exp_generic_autofill` · `control` / `treatment`.

**Control:** current generic detector (`content/auto-fill/field-detector.ts`).

**Treatment:** hardened detector — broader signal heuristics, better
label/aria association, graceful degradation on unknown layouts.

**Events.** `experiment_exposure`; `autofill_run` with metadata
`{ fields_filled, fields_detected, success, host }`.

**Primary metric:** fill-success rate (`fields_filled / fields_detected`) on
non-supported ATS hosts. **Guardrail:** mis-fill / correction rate (via the
existing corrections tracker) must not rise.

**Build notes:** gate the detector swap on the variant; the corrections feedback
loop (#33) already captures the guardrail signal.

---

## Rejected — Auto-submit ("Auto Pilot")

Deliberately **not** built. Filling *and submitting* applications without review
floods employers with low-signal applications, risks account flags, and clashes
with Slothing's quality/anti-fabrication positioning. The line we hold:
autofill → **review** → user submits.
