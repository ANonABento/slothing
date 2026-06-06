# GOAL — Overnight audit of the résumé-template fidelity feature

**Date:** 2026-06-06 · **Branch for fixes:** `audit/resume-fidelity-2026-06-06`
**Mission owner:** Claude (autonomous overnight run, user-approved)

## The one-line mission

Act as a real user with no AI quota ("free tier"): **upload a résumé → clone its style →
tailor the content to a synthetic job → export a PDF**, all through the *actual site*, and
find every place the result diverges from what a user would reasonably expect. Then fix
what we find.

## Scope (what "the feature" is)

The merged fidelity program (PRs #296/#298/#299/#300/#301): upload a résumé in Studio,
the app fingerprints its style into the grammar+tokens model and extracts its content
(RDM), the user nudges Phase-A/B knobs (date alignment, accent placement, name scale, page
margin, section spacing, skills grid), accepts a template, then re-pours tailored content
and exports via HTML→PDF **or** server-side Typst→PDF (and `.typ`/`.tex` source).

## Decisions (locked with the user)

1. **Persona = free / BYOK-less user.** The configured LLM (Gemini, OpenAI-compat) is out
   of quota (429) and the default model 404s on that endpoint. So drive the flow via
   **Manual tailor** (deterministic, no LLM). Probe **AI tailor** once only — to confirm it
   *degrades gracefully* (clear error, no crash/hang) — and record the failure as a finding,
   not a blocker.
2. **Both fixture sets** (see below).
3. **Report + attempt all fixes.** Findings get a prioritized report AND fixes on
   `audit/resume-fidelity-2026-06-06` with tests + PR(s). Respect all CLAUDE.md gates
   (forbidden-color/time/font/radius lint, type-check, vitest; no `--no-verify`; no
   `Co-Authored-By` trailer; destructive actions use confirm/undo patterns).

## Environment (already set up)

- Dev server: `pnpm dev` on http://localhost:3000 (running; logs `/tmp/slothing-dev.log`).
- Auth: local dev fallback user `default` (no sign-in needed; server-side bypass confirmed
  via curl). Studio: http://localhost:3000/en/studio
- LLM: **degraded** — Gemini key returns 429. Treat AI features as down.

## Fixtures (`.audit-fixtures/`, gitignored)

Controlled (known ground truth — compiled locally via the app's Typst node compiler):
- `01-classic-single.pdf` — single-column, **right-tab dates**, accent on name+rules, list skills.
- `02-twocol-skillsgrid.pdf` — two-column, **labeled skills grid**, **inline dates**.
- `03-tight-bigname.pdf` — tight 0.4in margins, **large name**, accent on name only, dense.

Real-world (fetched):
- `overleaf/jake-resume.tex` — Jake Gutierrez (the most-cloned Overleaf résumé), `.tex` source.
- `overleaf/altacv.tex` — AltaCV sample, `.tex` source.
- `overleaf/resume-pdf-sample.pdf` — Awesome-CV **compiled PDF** (Byungjin Park).

Synthetic target job: `.audit-fixtures/fake-job.md` (Senior Full-Stack Engineer, Meridian Robotics).

## Expected behavior (the bar to compare against)

| Step | Expected |
| --- | --- |
| Upload PDF | Fingerprint route; name/contact/work/education/skills extracted **faithfully** (no phantom entries from date/location lines; bullets attached to the right job). |
| Upload `.tex`/`.docx` | Routes to "manual"; UI should **say so clearly** (not silently blank). |
| Nudge knobs | Live preview updates per knob; defaults reproduce the source closely. |
| Engine toggle | HTML vs Typeset choice **persists** onto the saved template. |
| Accept | Template saved + auto-selected; toast "Template accepted". |
| Manual tailor | Deterministically assembles a résumé from selected content — no LLM, no error. |
| AI tailor | With no quota: **clear, non-fatal error**; UI stays usable. |
| Export PDF (HTML) | Downloads a valid PDF that visually matches the preview. |
| Export PDF (Typst) | Downloads a valid PDF; `X-Render-Engine: typst`. |
| Export `.typ` / `.tex` | Downloads valid source. |

## Acceptance criteria for the run

1. Every fixture taken through the full flow at least once (Manual path).
2. A findings report (`findings/REPORT.md`) with: id, severity (P0–P3), area, repro steps,
   expected vs actual, evidence (screenshot/JSON), and a proposed fix.
3. AI-tailor graceful-degradation confirmed (or filed as P-level bug).
4. Fixes landed on the branch with tests; CI gates green; PR(s) opened.

## Findings log (seeded from API-level smoke before the browser run)

> Severity: P0 broken/data-loss · P1 major wrong output · P2 noticeable · P3 polish.

- **F-001 (P1)** Right-tab date rows become **phantom work entries**. Fixture 01: the job
  "Senior Software Engineer @ Northwind Labs" yields a real entry (empty highlights) **plus**
  a phantom `{organization:"Present", position:"2021"}` from the `2021 — Present` date column.
  Repro: `POST /api/templates/import` with `01-classic-single.pdf`. Evidence: `findings/imp01.json`.
- **F-002 (P1)** Location/subtitle lines become **phantom entries AND steal the bullets**.
  The italic `Boston, MA` line becomes `{organization:"MA", position:"Boston"}` and the job's
  highlights attach to *it*, leaving the real title entry empty. Same repro as F-001.
- **F-003 (P2)** Education date row splits into a phantom institution
  `{institution:"2018", area:"2014"}`. Same repro.
- **F-004 (P2)** Phone `(617) 555-0142` parsed as `"617) 555-0142"` — leading paren dropped.
- **F-005 (P2, by-design-but-UX)** `.tex`/`.docx` upload extracts **nothing** (route "manual",
  rdm null). Real Overleaf `.tex` users get a blank import. Per Phase D gate this is deferred,
  but the UI must make the "no content imported, pick a template" outcome obvious.

(The browser persona run appends F-006+ below.)
