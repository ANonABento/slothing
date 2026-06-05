# Phase D — Pixel-Fidelity / WYSIWYG: Decision Gate

**Status:** Decision pending — **do not write Phase D code until this gate is passed.**
Companion to `docs/resume-template-fidelity-roadmap.md` (Phase D). Phases A, B, C2, C1
and the per-template-engine follow-up are all merged to `main`; this doc decides whether
the *gated* pixel-fidelity track is worth starting at all.

---

## 0. The question

> Now that A (more knobs) + B (table primitive) + C (Typst export) have shipped, is
> there enough *residual* fidelity gap — and enough demand — to justify a second,
> position-based layout engine that **cannot be auto-tailored**?

This is a go/no-go, not a how. The honest default is **NO / not yet**: pixel-fidelity
fights the core value prop (swap content → AI-tailor per job → reflow), and A+B were
specifically meant to shrink the gap so D becomes unnecessary. Phase D should only start
if the evidence below clears the bar.

---

## 1. Why the bar is high (the core tension, restated)

| | Semantic reflow (shipped) | Pixel/bbox fidelity (Phase D) |
| --- | --- | --- |
| Re-pour different content | trivial | breaks on any length change |
| AI-tailor bullets per job | the whole point | disabled or box-clipped |
| Exact visual mimicry | approximate | exact |
| Engines to maintain | 1 (grammar→HTML/Typst) | 2 (+ a positioned layout + editor) |

A résumé tool's wedge over Overleaf/Docs is *tailoring*. A pixel-locked document is, by
construction, a document the tailor can't safely touch. So Phase D isn't "more fidelity"
— it's a **second product mode** with its own engine, editor, and support cost.

---

## 2. Evidence to gather BEFORE deciding (fill these in)

Pass the gate only if the answers are convincingly yes.

1. **Residual gap, measured.** Take 10–15 real uploaded résumés. Clone each with the
   shipped pipeline (A+B knobs, Typst export). Score "looks like mine" 1–5.
   - *Bar:* median ≥ 4 → gap is small → **lean NO**. Median ≤ 3 with a recurring,
     *nameable* cause that A/B knobs can't express → candidate YES (but first ask: can a
     new knob or a B.2 primitive fix that cause more cheaply than a whole engine?).
   - Record the top 3 recurring failure causes here: _______.
2. **Demand, observed not assumed.** Are users actually asking for pixel control / exact
   replicas / "import my .tex", or asking for *better tailoring + good-enough looks*?
   - Signal sources: support/Discord, churn reasons, sales asks. Note them: _______.
3. **Tailoring tradeoff, accepted in writing.** Pixel-locked docs lose auto-tailoring (or
   only tailor within fixed boxes). Is that acceptable to the people asking? If they want
   *both* exact layout *and* per-job tailoring, Phase D does **not** give them that —
   say so plainly.
4. **Maintenance budget.** A second layout engine + a WYSIWYG editor is a quarters-long,
   permanently-maintained surface. Is that the best use of that capacity vs. (e.g.) B.2,
   more templates, or tailoring quality?

---

## 3. If the gate passes — candidate scope (each independently large)

Pick the *smallest* slice that addresses the measured cause from §2.1; do not build all
of these speculatively.

- **D-a · bbox-preserving template kind.** Store absolute coordinates as an *alternate*
  template type living beside the grammar model (not replacing it). Render via Typst
  `place`/absolute positioning. Tailoring disabled or box-bounded for these.
- **D-b · WYSIWYG drag editor** in Studio for that template kind. The big cost; only if
  users need to *author/adjust* positions, not just preserve them.
- **D-c · `.tex` / `.typ` import.** True Overleaf migration — a parser project. Note
  `.tex` ≠ `.typ` (separate parsers); Typst import is far smaller than LaTeX import.
- **D-d · per-template "fidelity mode" flag** that switches reflow ↔ fixed, with explicit
  UI about what it disables (tailoring). The integration glue if any of the above ship.

Each slice would get its own spec + acceptance criteria when greenlit.

---

## 4. Cheaper alternatives to weigh first

If §2.1's recurring causes are addressable here, prefer these over Phase D:

- **More grammar knobs / a new section primitive** (the A/B playbook) — e.g. finish
  **B.2** (`entry-grid` + geometric grid detection) if "dated grids don't match" is a top
  cause.
- **Geometric fingerprint detection** for `skillsLayout` and any new primitive, so clones
  pick the right layout automatically instead of needing a nudge.
- **Make Typst the default export** (better typography for free) once trusted — a product
  call already noted in the roadmap.

---

## 5. Recommendation

**Default: NO / defer.** Ship nothing in Phase D until §2 is filled in with real numbers
and the tailoring tradeoff is accepted by the people requesting it. Most likely outcome:
A+B closed enough of the gap that the residual causes are better served by a new knob or
B.2 than by a second engine. Revisit only with evidence.

**Owner / decision date:** _______ · **Verdict:** ☐ defer ☐ proceed with slice: _______
