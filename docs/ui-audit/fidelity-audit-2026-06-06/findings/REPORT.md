# Résumé-template fidelity audit — findings report

**Date:** 2026-06-06 · **Branch:** `audit/resume-fidelity-2026-06-06`
**Method:** API-level smoke (curl) of the import pipeline against controlled + real
fixtures, then a persona browser run (chrome-devtools MCP) driving the live Studio UI as
"Maya Chen," a free-tier user, plus code verification of each finding before any fix.
**Persona constraint:** free user, no AI quota (Gemini key is 429) → drove via Manual
tailor; AI tailor probed once for graceful degradation.

Severity: **P0** broken/data-loss · **P1** major-wrong output · **P2** noticeable · **P3** polish.
Status: ✅ fixed (this branch) · 🧭 needs design decision · 📋 follow-up (clear fix, deferred) · ☑️ not-a-bug.

## Summary

16 findings. The audit caught **the headline Typst feature being unreachable from the UI**
(F-006 + F-012) and **content extraction degrading badly on common real-world layouts**
(F-001/2/3/10). Fixed 9 with tests; 1 needs a product/architecture decision; 4 are clear
follow-ups; 2 were not bugs / dev-only.

| ID | Sev | Status | One-line |
| --- | --- | --- | --- |
| F-001 | P1 | ✅ | Right-tab/standalone date lines spawned phantom work entries |
| F-002 | P1 | ✅ | Location lines spawned phantom entries AND stole the job's bullets |
| F-003 | P2 | ✅ | Education date line split into a phantom institution |
| F-004 | P2 | ✅ | Phone `(617)…` lost its leading paren |
| F-006 | P1 | ✅ | "Typeset" engine toggle 400'd silently — never saved (PR #301 shipped broken) |
| F-007 | P2 | ✅ | Undetected name rendered literally as "Unknown" |
| F-008 | P1 | ✅ | `.tex`/`.docx`/scanned import showed a stranger's sample with no explanation |
| F-010 | P2 | ✅ | Dates rendered twice (visible symptom of F-001) |
| F-011 | P2 | ✅ | In-dialog preview identical for HTML/Typeset, no feedback |
| F-014 | P3 | ✅ | File picker said "PDF" but accepts pdf/docx/tex |
| F-012 | P1 | 🧭 | Typst export (PDF + .typ) unreachable — its UI is mounted nowhere in Studio |
| F-009 | P1 | 📋 | Real multi-column/styled PDFs (Awesome-CV) extract an empty body |
| F-013 | P2 | 📋 | Sub-bar "AI tailor" is a silent no-op (panel button gates correctly) |
| F-015 | P3 | 📋 | `flushSync`-in-lifecycle React warning from bank selection |
| F-016 | P3 | ☑️ | Accept success toast — it does fire (`handleAccept`); persona missed it |
| F-005 | P2 | 🧭 | `.tex`/`.docx` extract nothing (by Phase-D-gate design) — folded into F-008/F-012 |

---

## Fixed on this branch (with tests)

### F-001 / F-002 / F-003 / F-010 — phantom entries from date & location lines (P1)
**Repro:** `POST /api/templates/import` with `.audit-fixtures/01-classic-single.pdf`.
**Before:** one job → 3 garbled work entries; the `2021 — Present` date column became
`{organization:"Present", position:"2021"}`, the italic `Boston, MA` became
`{organization:"MA", position:"Boston"}`, and the bullets attached to that phantom, leaving
the real title entry empty. Education got a phantom `{institution:"2018", area:"2014"}`.
**Root cause:** `parseEntries` treated *every* non-bullet line as a new entry header. On
real PDFs pdf.js emits right-tab dates and location subtitles on their own lines (the
synthetic tests merged them onto one `y`, so they never caught it).
**Fix** (`extract/content.ts`): a date-only line attaches its range to the current entry;
a conservative `City, ST` line attaches as the entry's location without resetting `current`
(so bullets stay with the real job). `CITY_STATE_RE` is stricter than `LOCATION_RE` so it
never swallows a real "Role, Company" header. **After:** 2 clean work entries + 1 clean
education entry, bullets and dates correctly attached (`findings/imp01.json` →
verified post-fix). Regression test: `extract.test.ts` "standalone date/location lines".

### F-004 — phone leading paren dropped (P2)
`PHONE_RE` began `\+?\d`, so `(617) 555-0142` matched from `617)`. Fix: allow an optional
leading `(`. Covered by the same regression test.

### F-006 — Typeset engine toggle silently fails (P1) ⭐
The import dialog typed the engine as `"html" | "typeset"` and POSTed the label `"typeset"`,
but `commit/route.ts` accepts only `z.enum(["html","typst"])` → **400 on every Typeset
accept**. PR #301 ("make the Typeset toggle real") shipped a label-as-value bug that made
the toggle a no-op. Fix: send `"typst"`. Regression test asserts `body.engine` and the
`onImported` engine arg.

### F-007 — literal "Unknown" name (P2)
Extractor fell back to `"Unknown"`, which rendered in the header. Fix: fall back to `""`
and surface a "couldn't detect your name" note in the dialog.

### F-008 — dishonest no-content import (P1)
`.tex`/`.docx`/scanned uploads route to "manual" with `rdm: null`; the dialog then rendered
the default sample template (a stranger, "Avery Chen") with no explanation — looks like the
tool is showing someone else's résumé as your clone. Fix: a banner states we couldn't read
the file's content and that the preview is replaceable sample content.

### F-011 / F-014 — preview labeling + file-type copy (P2 / P3)
Preview now carries an "HTML preview" caption + a note that Typeset applies at export.
Upload copy now states "PDF, DOCX, or .tex" and what each does.

---

## Needs a decision

### F-012 — Typst export is unreachable from the live UI (P1) 🧭
The "PDF (Typst)" and "Typst (.typ)" options exist only in `components/tailor/export-menu.tsx`,
which is mounted only in `components/tailor/resume-preview.tsx` — and `/tailor` 308-redirects
to `/studio`, so that component is never rendered. Studio's own export menu
(`studio-sub-bar.tsx`) has PDF/DOCX/LaTeX/Plain/Copy/Share but **no Typst**. So the entire
server-side Typst→PDF feature (Phase C1) and the per-template engine (F-006, now fixed)
have no reachable UI.
**Why it's a decision, not a quick fix:** Studio's PDF export is *client-side HTML*
(`use-studio-page-state.ts → downloadHtmlAsPdf`), while Typst compiles *server-side* via
`/api/resume/export` which needs a saved `resumeId` + `templateId`. Studio drafts are
browser-storage (no server `resumeId`) until a tailor run saves one. Wiring Typst into
Studio means choosing: (a) only offer Typst for saved/tailored resumes; (b) add a
draft→server export path that sends rendered Typst source; or (c) honor the saved template's
engine automatically when exporting PDF. Recommend deciding before building.

---

## Follow-ups (clear fix, deferred)

### F-009 — real multi-column/styled PDFs extract an empty body (P1) 📋
`.audit-fixtures/overleaf/resume-pdf-sample.pdf` (Awesome-CV) → name/title only, 0 sections,
0 bullets. Header/section detection (`isSectionHeader`, column handling in `geometry.ts`/
`partitionSections`) doesn't segment styled two-column PDFs. Needs dedicated extraction work
+ a real-PDF fixture suite (out of scope for a same-night safe fix; the phantom-entry fix
already lifts the common single-column case). At minimum the dialog should warn "only the
header could be read" (the F-008 banner covers the empty-content case partially).

### F-013 — sub-bar "AI tailor" silent no-op (P2) 📋
Two AI-tailor entry points: the AI-panel "Tailor to JD" button shows the correct BYOK/Pro
gate; the sub-bar Tailor split-button "AI tailor" does nothing (no network call, no gate).
Fix: route the sub-bar action through the same quota-gate path.

### F-015 — `flushSync` in lifecycle warning (P3) 📋
7× `Warning: flushSync was called from inside a lifecycle method` when toggling bank
checkboxes quickly. Move the `flushSync` out of render into an effect/event handler.

---

## Not a bug

- **F-016** — the "Template accepted" success toast does fire (`handleAccept`); the persona
  inferred success from the picker label and missed the toast. No change.

## What worked well (persona)

Fast, never-broken preview render (~2-3s); genuinely live nudge knobs (font, columns,
accent, all three sliders); correct fingerprinting of single-column big-name + sidebar
layouts; the AI-panel free-user gate (clear BYOK/Pro card, no crash); Manual tailor + PDF
and LaTeX exports produced valid files.

## Fixtures & evidence

`.audit-fixtures/` (gitignored): `01/02/03-*.pdf` (controlled), `overleaf/jake-resume.tex`,
`overleaf/altacv.tex`, `overleaf/resume-pdf-sample.pdf`, `fake-job.md`. Evidence:
`findings/imp01.json`, `findings/imp-awesomecv.json`, `screenshots/`.
