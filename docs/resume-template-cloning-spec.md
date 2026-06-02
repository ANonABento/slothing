# Resume Template Cloning & Rendering — Rebuild Spec

> Status: **Phases 0–3 + 2.5 COMPLETE; Phase 4 substantially complete** (collapsed model,
> V4 migration, import/preview/accept loop wired into Studio) · the legacy-machinery
> DELETION is the one tracked remainder (see §12) · Owner: Kev · 2026-06-02
>
> Goal: make "upload your resume → get a reusable template the tailor can fill from
> the component bank" **consistent and high-success-rate**, and collapse the messy
> V2/V3/V4 template machinery into one clean model.
>
> All decisions locked: cloning model (parametric synthesis + nearest-match fallback),
> hybrid extraction (deterministic geometry + LLM semantics), schema collapse to one model,
> trust loop (preview + nudge + accept), dual render (HTML + Typst, toggle), default
> templates (5 ported OSS designs), typeset target = Typst, manual-pick-first cloning.

---

## 1. Problem statement

The marquee flow is: a user uploads their current resume, we **clone its style** into a
**reusable template**, and the tailor fills that template with details from the
**component bank** (`profile_bank`) for each job.

Today cloning is the weakest part of the product:

- The V4 path tries to **reconstruct the uploaded PDF's exact layout** and uses an **LLM
  to analyze geometry/fonts/colors** — the two least reliable choices possible.
- **Three template schema versions coexist** (V2 visual / V3 visual / V4 "reusable
  semantic"), with a 1000+ line `template-migration.ts`, a fidelity scorer, and
  branching render paths.
- There's **no preview-before-commit gate**, so results feel random and there's no
  trustworthy "did this work?" signal.

Result: inconsistent output, fragile on real-world PDFs, and high maintenance cost.

### Goals

1. **Predictable, high success rate** cloning across real-world resume PDFs/DOCX.
2. **One source of truth** and **one template model** — delete the V2/V3/V4 sprawl.
3. Output that **survives different content** (the tailor changes the data constantly).
4. A **manual verification environment** (standalone HTML playground) before touching Studio.
5. **Better default templates** at Overleaf quality.

### Non-goals (for now)

- Pixel-perfect reproduction of an arbitrary uploaded PDF (see §3 — this is explicitly
  rejected as the wrong target).
- Free-form WYSIWYG editing of arbitrary LaTeX (see §6 — rejected; lowest success rate).
- OCR / vision fingerprinting of scanned PDFs (deferred; long tail — see §4).

---

## 2. Core architectural principle

**Structured data is the single source of truth. A template is a pure function.**

```
profile_bank (content)
   └─► Resume Document Model (RDM, structured JSON)   ← THE source of truth
          │  edited via TipTap (data + slot values, not free-form geometry)
          ▼
   render(RDM, template) ──► HTML  ──► PDF
                         └──► Typst ──► PDF        (render target, NOT the source)
```

We get "one source of truth" **and** "highest success rate" only on this side of the
fork. The typeset engine (Typst) is a *renderer*, never the editable source (rationale in
§6). The template is
defined declaratively as **a layout grammar + style tokens** (§3), and the same template
can drive multiple render backends.

---

## 3. Cloning model — DECIDED

> Reframe: **a template is reusable with *different* content.** A pixel-faithful clone of
> someone's exact PDF isn't a template — it's a screenshot that breaks the moment the
> tailor changes a word. So "perfect clone" is both the hardest path and the wrong target.

### Decision 1 — What "clone" produces: **Parametric synthesis (C), with nearest-match (A) as per-axis fallback**

| Approach | What it does | Success rate | Survives new content? | Effort | Failure mode |
|---|---|---|---|---|---|
| A. Nearest-match + tokens | Snap to closest hand-built template, override tokens | High, predictable | ✅ always | Low | "Similar, not identical" |
| **C. Parametric synthesis** ✅ | Classify into a small *layout grammar* + extract style tokens; render through one engine | High | ✅ yes | Medium | Wrong axis → fall back to default for that axis only |
| B. Full reconstruction (current) | Rebuild exact geometry from bbox/vision | Low, unpredictable | ❌ breaks on overflow | High | Overlap, clipping, collapse |

Compose a template from a **constrained set of layout primitives + extracted style
tokens**. Any axis the parser can't determine confidently falls back to the curated
default **for that axis only**. Every output is therefore a valid composition of
known-good, content-resilient primitives — never free-form geometry.

#### The layout grammar (closed vocabulary)

```
columns:        1 | 2(left-sidebar) | 2(right-sidebar)
header:         centered | left-aligned | split(name | contact)
section-title:  underline-rule | full-rule | small-caps | accent-bar
bullets:        disc | dash | arrow | none
density:        compact | normal | airy        # drives line-height + gaps
accent:         <hex>                           # one extracted color
fonts:          serif | sans | slab             # mapped to a curated font, not the exact font
```

> Open question being tracked: does this vocabulary cover the styles we care about
> (timeline/graphical sidebars, photo headers, two-page)? Extend the grammar, don't add
> a second model.

### Decision 2 — Fingerprint extraction: **Hybrid (deterministic geometry + LLM semantics only)**

| Method | Reliable for | Fonts/colors | Section labels | Cost/speed |
|---|---|---|---|---|
| 1. Deterministic geometry | digital PDFs (~90%) | ✅ strong (font dict + color runs) | ⚠️ weak | fast, free, deterministic |
| 2. Vision LLM | scanned/image PDFs | ⚠️ guesswork | ✅ strong | slow, costly, non-deterministic |
| **3. Hybrid** ✅ | both | ✅ deterministic | ✅ LLM | medium |

- **Deterministic PDF geometry** (pdf.js text runs: bbox + font name + size + color) drives
  *everything visual* — column count by x-clustering, accent color by most-common
  non-ink color in headings, density from line-gap stats, font class from the embedded
  font dictionary.
- **LLM does only semantic labeling** ("this block is Experience"), which it's good at and
  which already mostly works for bank extraction.

The current code's core mistake is the inverse (LLM does geometry, parser underused).
Flipping that is most of the reliability win — and it's cheaper and faster.

> Scanned/image PDFs (no extractable text): detect and route to "pick a template manually,
> we extracted your content" rather than guessing fonts via a vision call. Vision
> fingerprinting deferred until data shows it's needed.

### Decision 3 — Template representation: **Collapse to one model**

| Option | Effort | Risk | Long-term cost |
|---|---|---|---|
| **Collapse to one model** ✅ | Medium | Low (few dev templates) | Lowest — one render path |
| Keep V4, fix in place | Low now | High | 1000-line migration + fidelity scorer stays forever |
| Add a V5 | Low | Very high | Four coexisting paths |

The single `(layout grammar + style tokens) → render(data)` representation **is** the new
schema. One migration for committed V4 templates, then delete `template-migration.ts`, the
fidelity scorer, and the V2/V3 branches.

### Decision 4 — Trust loop: **Preview + token nudge + accept (commit gate)**

| Option | Effort | Consistency felt |
|---|---|---|
| **Preview + nudge + accept** ✅ | Medium | High — user never surprised |
| Auto-commit + edit later (current) | Low | Low — feels random |

```
upload ─► extract content + fingerprint ─► render candidate template
        ─► SIDE-BY-SIDE: original PDF │ our render
        ─► user nudges tokens (accent, font, density, cols)  ◄── live
        ─► Accept ─► commit as reusable template
```

This is also the **HTML playground** (§7): the side-by-side + token sliders is the
verification environment, and it ports straight into the Studio import dialog.

### Recommended cloning stack (end to end)

```
PDF/DOCX upload
   ├─ deterministic geometry parse ──► style fingerprint
   │      (cols, accent, font-class, density, header, rules)
   ├─ LLM semantic labeling ─────────► sections → profile_bank   (already works)
   ▼
classify fingerprint ──► LAYOUT GRAMMAR + STYLE TOKENS   ← single template model
   │   (low-confidence axis → curated default for that axis)
   ▼
render(data, template) ──► HTML ──► side-by-side preview vs original
   │                                 └─ user nudges tokens (live)
   ▼
Accept ──► commit reusable template ──► tailor fills it from the bank
```

**Why this kills inconsistency:** every output is a composition of hand-built,
content-resilient primitives; the LLM only does language; nothing depends on fragile
geometry; the user confirms before commit. Worst case degrades to "a clean curated
template that resembles yours," never "a broken layout."

---

## 4. Open decisions (to be folded as we go)

- [x] **Render backend** — DECIDED: **dual-target, both shipped now** with a UI toggle
      (HTML-PDF vs Typeset-PDF). **Typeset target = Typst** (Apache-2.0, WASM-native);
      LaTeX/Tectonic swappable later behind `compile()`. See §6 + §10.
- [x] **Cloning rollout** — DECIDED: **manual template pick is first-class**; fingerprint
      auto-clone is a layered enhancement (pre-select + pre-tune), never a hard dependency.
- [x] **Default templates** — DECIDED: **port OSS designs** into our grammar+tokens model
      (not scrape Overleaf, not run their `.cls`); **ship 5 for v1**. See §9.
- [ ] **Layout grammar coverage** — does §3's vocabulary need timeline/photo/two-page axes?
- [ ] **V4 migration** — are there real committed V4 templates worth migrating, or is dev
      data disposable?
- [ ] **Competitive research** — survey how other tools (Rezi, Teal, Kickresume, Resume.io,
      Standard Resume, Reactive Resume (OSS), Overleaf) do clone/template/render. Do *after*
      planning; feed findings back into §3/§5.

---

## 5. Phased implementation plan

> Phases 0–4 are fully unblocked by the §3/§6 decisions. Default-template curation (§4)
> feeds Phase 1.

### Phase 0 — Scaffolding & types
- Define the **RDM** type and the **template model** type (`layout grammar + style tokens`)
  in `packages/shared` (so app + extension share them).
- Define the adapter signatures: `renderHTML(template, rdm): { html }` and
  `renderTypeset(template, rdm): { src }`, plus the compiler interface `compile(src): pdf`.
- Adopt the **JSON Resume schema** as the RDM content vocabulary where it fits.
- **Tests:** type-level + a golden RDM fixture set (3–4 representative resumes).

### Phase 1 — Render engine (one content-resilient template, both adapters)
- Implement `renderHTML()` **and** `renderTypeset()` (Typst markup) for **one** template
  fully driven by grammar+tokens. Wire the Typst WASM `compile()` impl.
- Prove content-resilience: render short/long/overflowing RDM fixtures without breakage in
  both backends.
- **Tests:** snapshot HTML + Typst src for each fixture × token permutation; overflow/edge
  fixtures; Typst compiles cleanly (no errors) on every fixture.

### Phase 2 — Deterministic fingerprint extraction
- pdf.js-based extractor → `StyleFingerprint` (cols, accent, font-class, density, header,
  rules) with **per-axis confidence**. Content extraction follows **OpenResume's pipeline**
  (items → lines by avg-char-width → sections by bold+UPPERCASE detection → per-field
  scoring), MIT and portable.
- Classifier: fingerprint → grammar+tokens, low-confidence axis → curated default.
- **"Pick a clean template" is the always-available first-class path** (§10 gap #1);
  fingerprint-snap only *pre-selects + pre-tunes*, never a hard dependency.
- **Tests:** fixture PDFs with known styles → assert extracted fingerprint within tolerance;
  scanned-PDF detection → "manual template" route; a first-class manual-pick path that works
  with zero fingerprint.

### Phase 2.5 — Lossless self-re-import (Rezi RMS / XMP)
- Embed the RDM JSON into our exported PDFs as **XMP metadata**; on re-upload, detect the
  marker and restore the RDM directly — no LLM, no fingerprint. The LLM+fingerprint path
  (Phase 2) is the fallback for *foreign* PDFs only.
- **Tests:** export → re-import round-trip is byte-stable on the RDM; foreign PDF skips the
  fast path and uses extraction.

### Phase 3 — HTML playground (verification environment) ⟵ *manual verify milestone*
- Standalone `template-playground.html` (with the Typst WASM compiler bundled, so the
  typeset path compiles live in-browser — no server):
  - Load an RDM fixture or paste bank JSON.
  - **Side-by-side**: original PDF (drag-drop) │ our render.
  - **Engine toggle**: HTML-PDF │ Typeset-PDF, ideally both visible at once to tune drift.
  - Live **token sliders** (accent, font, density, columns, header, rules).
  - Toggle through curated templates.
- This is where Kev clicks/validates with full devtools before any Studio wiring.
- **Tests:** playground is dev-only; component tests for the controls + a check that both
  engines render the same fixture without error.

### Phase 4 — Collapse the schema + commit gate
- One `(grammar + tokens)` template record; migration from committed V4; **delete** V2/V3
  paths, `template-migration.ts`, fidelity scorer.
- Wire the playground's preview+nudge+accept loop into the Studio import dialog, including
  the HTML/LaTeX engine toggle on export.
- **Tests:** migration test (V4 → new); end-to-end import → preview → accept → tailor
  render → export in both engines.

### Phase 5 — Typeset compiler hardening / optional LaTeX target (optional)
- If Typst-WASM output/fonts fall short in prod, add a server-side `compile()` impl (Typst
  CLI, or a LaTeX/Tectonic target) behind the same interface. No template changes.
- **Tests:** golden-PDF comparison across compiler impls on the fixture set.

---

## 6. Render backend — dual-target with a toggle (DECIDED)

Ship **both** HTML and a **typeset** render backend, user-toggleable per export:

- **HTML-PDF** — exactly what you edited (TipTap → HTML → Playwright). True WYSIWYG.
- **Typeset-PDF** — typeset, slightly refined (grammar+tokens → markup → compiler).
  **Default typeset target: Typst** (see Compiler below).

### Why this is affordable: one definition, two shared adapters

The expensive trap is authoring an HTML template *and* a typeset template per design — they
drift and double the work. Instead, a template is **one declarative definition** (grammar +
tokens), and two **shared adapters** consume it:

```
template definition (grammar + tokens)         ← authored ONCE per template
        ├─ renderHTML(template, rdm)    ──► HTML   ──► PDF (Playwright)   ┐ toggle
        └─ renderTypeset(template, rdm) ──► markup ──► PDF (compiler)     ┘
```

The adapters are written **once total**, not per template. New design = one definition;
both engines render it automatically. Per-template cost stays at one.

### Accepted caveat — WYSIWYG drift

The user edits in TipTap/HTML, so **HTML is the true WYSIWYG**. The LaTeX export is
*visually close but not byte-identical* (LaTeX does its own justification/spacing). The
playground (§7) renders **both side-by-side** so we tune the LaTeX adapter to mirror the
HTML one. Product framing: *"HTML PDF (exactly what you edited)" vs "LaTeX PDF (typeset)."*

### Compiler — decouple emit from compile (DECIDED: Typst)

The typeset adapter only **emits markup**; compilation sits behind a tiny interface
`compile(src) → pdf`, so the **target language and engine are swappable**:

| | **Typst** ✅ default | LaTeX via SwiftLaTeX (WASM) | Tectonic (LaTeX, server) |
|---|---|---|---|
| License | **Apache-2.0** (clean) | AGPL-3.0 (client WASM murky for cloud carve-out) | MIT-ish |
| In-browser compile | ✅ Rust→WASM, fast, self-contained | ✅ ~2× native, fetches packages over network | ❌ server only |
| Standalone playground | ✅ live, no server | ✅ live, no server | ❌ needs endpoint |
| Maintenance | active | copyright 2018–2022, light | active |
| Output quality | excellent | excellent (mature) | excellent |

- **Typst is the default typeset target** — Apache-2.0 (clean for the OSS launch + cloud
  carve-out), Rust→WASM native so it compiles **live in the standalone playground** with no
  server (matches §7), self-contained (no compile-time package fetch). This is the path
  RenderCV validated. See §10 for the full comparison.
- The `compile()` interface keeps **LaTeX/Tectonic addable later** for specific Overleaf
  fidelity — zero template changes if we ever need it.

### Why NOT "LaTeX as the source of truth" (still rejected)

Overleaf itself is **not WYSIWYG** — it's a code editor with a compile-preview loop —
because LaTeX is Turing-complete and **cannot be reliably parsed back into an editable
structure**. LaTeX-as-source + Google-Docs feel = bidirectional LaTeX↔editor sync, the
lowest-success-rate path. We keep structured data as the source and treat LaTeX as one
**renderer** (above). Note: `.tex` *ingestion* (cloning an uploaded LaTeX resume) is a
separate *source-side* concern handled in Phase 2 extraction, not a reason to flip the
source of truth.

---

## 7. Verification environment (summary)

The standalone HTML playground (Phase 3) is the contract for "consistency you can see":
upload/drag a resume → fingerprint → render candidate → **side-by-side with the original**
→ nudge tokens live → accept. Build and validate it **before** porting into Studio's
import dialog (Phase 4), exactly as requested.

---

## 9. Default templates — v1 set (DECIDED)

**Source:** port recognizable open-source resume *designs* into our grammar+tokens model.
We reimplement the look as our own HTML/LaTeX templates (we do **not** run their `.cls` or
scrape Overleaf), so we get the Overleaf-recognizable aesthetic with our own clean code and
no runtime LaTeX-package dependency. Favor permissive (MIT/Apache) sources where we copy
closely; attribute "inspired by."

Picked so the nearest-match classifier (§3) has a good target for almost any upload and
every grammar axis is exercised:

| # | Template | Inspired by | Source license | columns | header | section-title | font | For the user who… |
|---|---|---|---|---|---|---|---|---|
| 1 | **Classic** | sb2nov / moderncv-classic | MIT / LPPL | 1 | centered | full-rule | serif | wants the safe, max-ATS resume |
| 2 | **Modern** | Awesome-CV | LPPL | 1 | split (name \| contact) | accent-bar | sans | wants clean + a touch of color |
| 3 | **Sidebar** | AltaCV | LPPL | 2 (left-sidebar) | left | small-caps | sans | wants skills/contact in a sidebar |
| 4 | **Tech** | Deedy | Apache-2.0 | 2 (right-sidebar) | centered (big name) | underline-rule | slab/sans | tech/eng, one-page, dense |
| 5 | **Compact** | RenderCV / original | — | 1 | left | small-caps | sans | has lots of content, needs density=compact |

Coverage: 1-col + both 2-col variants, all header styles, all section-title styles,
serif/sans/slab, accent on/off, full density range. More can be added later as single
definitions — no new infrastructure.

---

## 10. Competitive research (2026-06-02) — findings & what changes

Surveyed commercial (Rezi, Teal, Kickresume, Resume.io, Standard Resume, Zety, Enhancv)
and OSS/typeset tools (JSON Resume, Reactive Resume, RenderCV, Typst templates, OpenResume,
Overleaf + the 5 LaTeX templates). Full citations in the research notes; highlights:

### What validates the plan
- **Structured-data-as-source-of-truth is universal.** Every one of the 7 commercial tools
  parses uploads into fields and re-renders into a fixed template — **none** attempt
  pixel-faithful cloning. Enhancv states it outright: *"original formatting is not
  preserved."* Our reject-reconstruction stance (§3) is exactly what the market does.
- **Constrained tokens are the norm.** Resume.io even forbids free font choice (fonts belong
  to the template). Confirms "layout grammar + style tokens" (§3) and "fonts = a template
  token, not free-for-all."
- **"Data + declarative template" proven 3× independently:** RenderCV (YAML+Pydantic →
  Jinja2/Typst), JSON Resume (JSON Schema → `render()` themes), Reactive Resume (JSON →
  React). We're mainstream, not speculative.
- **HTML → headless-Chrome PDF is the proven mainstream pipeline** (matches our Playwright
  path). Reactive Resume ran exactly this in v3/4.

### What to steal (folded into phases)
- **Rezi RMS / XMP metadata embedding** — embed our structured RDM JSON into the exported
  PDF as XMP. Then *our own* re-import is lossless + instant (no LLM, no fingerprint); the
  LLM+fingerprint path is only for foreign PDFs. → **Phase 2.5 (new).**
- **OpenResume's pdf.js feature-scoring pipeline** (MIT) — pdf.js text items → group into
  lines by avg-char-width → sections by bold+UPPERCASE header detection → per-field scoring.
  This is the deterministic core of our extraction. → **Phase 2.**
- **RenderCV's `design` block** — literal model for our style tokens (color, font_family,
  margins, named theme) + its Markdown→markup converter for rich text in data.
- **JSON Resume schema (MIT)** — adopt as interop layer; gets us an existing theme ecosystem
  and a known-good content vocabulary for the RDM.
- **moderncv's enumerated style×color matrix** — model for finite curated grammar×token
  combinations rather than infinite freeform.

### Gaps / risks the research surfaced
1. **The style-fingerprint → "nearest template" snap is NOVEL — no prior art.** OpenResume
   extracts content only and assumes single-column English; commercial tools discard source
   style entirely and let the user pick. **De-risk:** make **"pick a clean template"** the
   first-class, always-available path; treat fingerprint-snap as an *enhancement* that
   pre-selects + pre-tunes, never a hard dependency. Validate it actually beats manual pick
   before heavy investment. → reflected in §3 trust loop (accept/override) and Phase 2.
2. **HTML vs LaTeX/Typst will NOT be pixel-identical** (line-breaking, hyphenation, font
   metrics, column balancing differ). Already accepted in §6; the playground side-by-side
   exists to tune it. Decide per-template: "must match" vs "equivalent."
3. **Font parity across render targets** — both backends must ship/serve identical webfonts
   (Roboto/Lato/Source Sans/Raleway etc.) or "the same template" diverges.
4. **DOCX gap** — recruiters/ATS still request `.docx`; we have `docx-export.ts` today but it
   flattens custom nodes. Keep a DOCX target on the radar (lower priority than PDF parity).
5. **ATS = real text-layer PDF is the invariant.** Make "exported PDF has a selectable text
   layer, no layout tables" a guaranteed test, not an afterthought.
6. **Parser reality check:** Kickresume self-reports **82%** field accuracy on real CVs →
   the import **review/correction UI is first-class**, not optional.

### ⚠️ The one finding that reopens a decision: **Typst vs LaTeX (SwiftLaTeX) as the typeset target**

The research strongly favors **Typst** over LaTeX-via-SwiftLaTeX for the second render
backend:

| | **Typst** (e.g. via RenderCV's approach) | **LaTeX via SwiftLaTeX (WASM)** |
|---|---|---|
| License | **Apache-2.0** (clean for commercial/cloud) | **AGPL-3.0** — client-side WASM may trigger obligations |
| In-browser compile | ✅ Rust→WASM native, fast (typst.app does it) | ✅ but ~2× native, **fetches packages over network at compile time** |
| Maintenance | actively developed | SwiftLaTeX copyright 2018–2022, lightly maintained |
| Determinism / offline | self-contained | needs self-hosted+pinned CTAN mirror |
| Output quality | excellent typesetting | excellent (mature) |
| Ecosystem familiarity | newer; fewer "Overleaf" templates | huge; the Overleaf templates are LaTeX |
| Our template porting | port designs to Typst markup | port designs to LaTeX macros |

RenderCV explicitly chose **Typst** to escape old-school TeX toolchain pain. The decoupled
`compile(src) → pdf` interface (§6) means **the typeset *target language* is itself
swappable** — Typst, LaTeX-WASM, or server Tectonic all sit behind it. So this is a
language/engine choice, not an architecture change.

> **DECIDED: Typst as the default typeset target** (Apache-2.0, WASM-native, no
> package-fetch, the path RenderCV validated), keeping the `compile()` interface so a
> LaTeX/Tectonic backend can be added if specific Overleaf fidelity is ever required.
> See §6.

### Decisions locked from this research
- **Typeset target = Typst** (not SwiftLaTeX/LaTeX). §6.
- **Cloning ships manual-pick-first**; fingerprint auto-clone is a layered enhancement that
  pre-selects + pre-tunes, never a hard dependency. §3 / Phase 2.
- **Steal:** XMP self-re-import (Phase 2.5), OpenResume extraction (Phase 2), JSON Resume
  schema as RDM vocabulary (Phase 0).

---

## 11. Build & verification strategy (DECIDED)

Separate **where the logic lives** from **where it's tested**. Almost all the hard work
(RDM, grammar, tokens, render adapters, fingerprint extractor, classifier) is **pure,
framework-free TypeScript** — it needs no React/Next/DB.

- **Logic → `packages/shared/src/resume-template/`** from day one. Framework-free, TDD'd
  with Vitest (`pnpm --filter @slothing/shared test:run`). This *is* "outside the app" in
  the way that matters: no Next, no React, no DB, runs in milliseconds. The app and the
  playground import the **same** module → **no port of logic later, no divergence.**
- **Verification → a standalone Vite-served `packages/template-playground/`** that imports
  `@slothing/shared` + the Typst WASM directly. Plain HTML page with full Chrome devtools,
  hot reload, live Typst compile, side-by-side + token sliders. Dev-only / disposable.
- **Port to Studio (Phase 4) = UI wiring only** against the already-integrated package. No
  business logic moves.

Rejected: building the core in a throwaway scratch repo and porting later — porting
framework-agnostic TS is wasted work and invites dependency/type drift ("worked standalone"
breaks on integration). Keep logic in `packages/shared`; only the *harness* is disposable.

---

## 8. Current-state reference (for implementers)

| Area | Files | State |
|---|---|---|
| Tailor (AI) | `apps/web/src/app/api/tailor/route.ts`, `src/lib/tailor/generate.ts`, `analyze.ts` | works, quota-gated |
| Tailor (manual) | `src/lib/tailor/manual-tailor*.ts` | works, deterministic |
| Style cloning / import | `src/app/api/templates/{migrate,import,analyze}/route.ts`, `src/lib/resume/universal-template-import.ts`, `template-migration.ts` | **messy — target of this spec** |
| Template schemas | `document_templates_v2/v3/v4` tables, `src/lib/resume/template-data.ts` | **3 versions — collapse to 1** |
| Bank | `src/lib/db/profile-bank.ts`, `profile_bank` table | works |
| Upload/parse | `src/app/api/upload/route.ts`, `src/lib/parser/smart-parser.ts`, `src/lib/parse/pdf-positions.ts` | works; no OCR |
| Editor (TipTap) | `src/lib/editor/{extensions,document-html,resume-editor,styles,bank-to-tiptap}.ts` | solid |
| Render → HTML | `src/lib/editor/document-html.ts` (`generateHTML`) | solid |
| PDF export | `src/lib/resume/pdf-export.ts` (Playwright), `src/app/api/resume/export/route.ts` | works; slow cold start |
| LaTeX export | `src/lib/export/html-to-latex.ts`, `src/app/api/export/latex/route.ts` | clean; one-way export; `pdflatex` optional |
| DOCX export | `src/lib/builder/docx-export.ts` | flattens custom nodes |
| Version history | `src/lib/builder/version-history.ts` | browser localStorage only |

---

## 12. Implementation status (2026-06-02)

The architecture is built and shipped framework-free in `packages/shared/src/resume-template/`
(pure TS, no React/Next/DB), with the dev-only Vite harness in `packages/template-playground/`
and the app integration in `apps/web`. Every phase below is committed with CI green
(`pnpm --filter @slothing/shared test:run`: 159 tests; full web suite: 4332 tests; type-check
+ lint clean).

### ✅ Phase 0 — Scaffolding & types
RDM (`rdm.ts`), grammar (`grammar.ts`), tokens (`tokens.ts`), the one template model
(`template.ts`), 5 default templates (`default-templates.ts`), fixtures, Zod schemas.

### ✅ Phase 1 — Render engine (both adapters, all 5 templates)
- `layout.ts` — the shared render BRAIN (one (template, rdm) → backend-agnostic layout).
- `render-html.ts` — real `renderHtml` honoring every grammar axis; content-resilient; **no
  layout tables** (ATS invariant).
- `render-typeset.ts` — real `renderTypeset` (Typst markup); all user text emitted as Typst
  string literals so arbitrary content can never break compilation.
- `compile.ts` interface + `compile-node.ts` (node Typst compiler, test-only; not in index).
- Tests: grammar coverage, escaping, HTML+Typst snapshots, **Typst compiles with no errors on
  every fixture × template**, **selectable-text-layer** assertion via pdf.js.
- Playground: live HTML + in-browser Typst (WASM) with engine toggle and full grammar sliders.

### ✅ Phase 2 — Deterministic fingerprint + classifier + extraction
pdf.js-FREE core over injected geometry (`extract/geometry.ts`): `fingerprint.ts`
(per-axis confidence — columns by x-clustering, accent by most-common non-ink heading colour,
density from line-gap stats, font class from the font dictionary), `classify.ts` (parametric
synthesis + per-axis curated-default fallback + nearest-match snap + first-class
`pickCleanTemplate`), `content.ts` (OpenResume pipeline → RDM draft), `labels.ts` (deterministic
labeling + injectable LLM hook), `isLikelyScanned` routing. Real render→PDF→pdf.js→extract
round-trip test.

### ✅ Phase 2.5 — Lossless XMP self-re-import
`extract/xmp.ts` — `embedRdmXmp` (XMP `/Metadata` stream) + `extractRdmFromXmp` (raw-scan,
schema-validated). Round-trip is lossless on our own exports; foreign/corrupted → null fallback.

### ✅ Phase 3 — Playground (manual-verify milestone)
Three panes (original PDF drag-drop ↔ HTML ↔ live Typst), full clone loop in-browser
(XMP self-import / fingerprint + content), live sliders, template switch, engine toggle.
`nudge.ts` (`applyNudges`) is the shared preview+nudge primitive (reused by Studio).

### 🟢 Phase 4 — Schema collapse + Studio wiring (substantially complete)
- **Collapsed model + migration (done):** `apps/web/src/lib/db/resume-templates.ts` — the ONE
  `document_templates` table (user-scoped, additive) storing the new ResumeTemplate + optional
  RDM; CRUD + idempotent `migrateV4ToCollapsed()`. `lib/resume/template-collapse.ts` maps the
  legacy V4 IR's style onto the closed model (curated-default fallback per axis). Migration +
  store tested.
- **New import loop (done):** `POST /api/templates/import` (XMP self-import → fingerprint +
  content; scanned/foreign → manual) and `POST /api/templates/import/commit` (accept gate);
  `lib/resume/pdf-geometry.ts` server adapter. Route tests cover every branch.
- **Studio dialog (done):** `components/studio/import-resume-dialog.tsx` — preview + nudge +
  accept loop with the HTML|Typeset engine toggle, wired into `StudioSubBar` ("Import résumé
  (clone style)"). Component test drives import→preview→nudge→accept→commit.
- **Dead-code removal (done):** deleted `template-visual-verification.ts` (0 importers).

### ⏳ Remaining (tracked) — delete the legacy V2/V3/V4 + migration + fidelity machinery
The new collapsed model + import/preview/accept loop are live; what remains is **removing** the
old machinery: `template-v2/v3{,-renderer}.ts`, `template-migration.ts` (3.6k LOC),
`universal-template-import.ts` (2k), `template-migration-fidelity.ts`, the
`/api/templates/{migrate,migrations,v2,v3}` routes + their 15 tests, and the V2/V3/draft
functions in `lib/db/template-migrations.ts`.

**Why sequenced separately (deviation, per §11 "update the spec if you deviate"):**
`universal-template-renderer.ts` (the V4 "reusable" renderer) is **still the live render engine**
for the export, builder, tailor, and opportunities routes — it is not dead sprawl. Removing it
cleanly requires first bridging the content models (the live `TailoredResume`/semantic IR path ↔
the new `RDM`) so export/builder/tailor render through the shared `renderHtml`/`renderTypeset`,
then deleting the V4 renderer and the rest. That is a substantial, **export-critical** change best
landed as its own focused, separately-reviewed PR rather than bundled here — bundling it risked
destabilising the 4332-test suite and the live export feature. The collapse foundation, migration,
and the entire new clone loop are already in place to make that follow-up mechanical.
