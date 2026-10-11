# Resume Template Fidelity & Adjustability — Roadmap

**Status:** Planning. Follow-on to `docs/resume-template-cloning-spec.md` (that rebuild is
COMPLETE, merged via PRs #293/#294/#295). This doc scopes the *next* program: making
cloned résumés look closer to the source and giving users real adjustment controls —
without throwing away the reflow model that makes AI tailoring work.

---

## 0. Framing — the one decision that governs everything

Two opposed product philosophies:

| | **Semantic reflow** (what we built) | **Pixel/bbox fidelity** (Google Docs tables, hand-placed LaTeX) |
| --- | --- | --- |
| Model | closed grammar + tokens | absolute coordinates |
| Re-pour different content | trivial — everything reflows | breaks the moment a bullet changes length |
| AI-tailor bullets per job | the whole point | fights it constantly |
| Exact visual mimicry | approximate | exact |

The feature's value prop — *"swap the content, AI-tailor per job, keep the style"* —
**requires reflow.** So the spine stays semantic. We close the fidelity gap by **adding
parameters**, not coordinates. Pixel-fidelity is treated as a *separate, opt-in,
non-tailorable* track (Phase D), never the default path.

**Guiding rule for every phase below:** a new capability must survive "now change every
bullet's length." If it can't, it's a Phase D feature, not a core-grammar feature.

---

## Current model (baseline — `packages/shared/src/resume-template/`)

- **Grammar** (`grammar.ts`, closed vocab): `columns` (single / left-sidebar /
  right-sidebar), `header` (centered / left-aligned / split), `sectionTitle`
  (underline-rule / full-rule / small-caps / accent-bar), `bullets` (disc / dash /
  arrow / none), `density` (compact / normal / airy).
- **Tokens** (`tokens.ts`): `accent` (hex), `fontClass` (serif / sans / slab → curated
  stacks), `baseFontSizePt`, `lineHeight`.
- **Two render adapters** off one `layout.ts` brain: `render-html.ts` + `render-typeset.ts`
  (Typst — **not** LaTeX).
- **Extraction** (`extract/`): XMP self-import (lossless) → else deterministic fingerprint
  + per-axis confidence + curated fallback → scanned PDFs route to manual pick.
- **Nudge loop** (`nudge.ts` + `import-resume-dialog.tsx`): preview + adjust + accept.

**What we do NOT have:** absolute positioning, tables, margin/spacing control, per-element
overrides, `.tex`/`.typ` import, WYSIWYG editing. All four phases below add to this.

---

## Phase A — Widen the parametric model + real nudge UI  *(Tier 1; cheap, high ROI)* ✅ SHIPPED

> **Status: DONE** (branch `feat/resume-template-fidelity-phase-a`). New knobs:
> `dateAlignment` (grammar) + `accentPlacement`, `nameScale`, `pageMarginPt`,
> `sectionSpacing` (tokens) — all optional, defaulted to reproduce prior output
> byte-identically (render snapshots unchanged). Both backends honor them; fingerprint
> reads `dateAlignment`/`nameScale`/`pageMarginPt`/`accentPlacement` (and the inline-date
> case no longer trips the phantom-sidebar false positive); classifier picks each with
> per-axis confidence; playground + Studio import dialog expose all five. No DB migration
> needed (templates persist as JSON; new fields are optional). `sectionSpacing` is
> nudge-only (no reliable geometric signal). All CI gates green.

**Goal:** clones land visibly closer on first try, and users can dial the rest. No
architecture change — just more knobs through the existing grammar/tokens/nudge pipeline.

### A1. New style tokens (`tokens.ts`)
Additive to `StyleTokens` + `styleTokensSchema`, each with a curated default so old
templates keep validating:
- `pageMarginPt` — page margins (top/side). Single most visible "feels like mine" lever.
- `nameScale` (or `headerSizePt`) — name/header size as its own knob (today it's derived).
- `sectionSpacingPt` — vertical gap between sections (distinct from `density`, which is
  intra-content).
- `accentPlacement` enum — `name` | `rules` | `both` | `none`. Today accent does several
  jobs at once; splitting it is the second-biggest fidelity win.

### A2. New grammar axis (`grammar.ts`)
- `dateAlignment` — `inline` | `right-tab`. **The #1 thing the fingerprint gets wrong** —
  right-aligned dates currently read as a phantom sidebar column. Making it an explicit
  axis both improves clones *and* removes a false-positive class in `fingerprint.ts`.

### A3. Render both backends for every new knob
`layout.ts` consumes the new fields; `render-html.ts` and `render-typeset.ts` each honor
them. Parity bar stays **structural**, not pixel (see cloning spec §6 "accepted WYSIWYG
drift").

### A4. Fingerprint the new axes (`extract/fingerprint.ts`, `classify.ts`)
- Detect page margins from text-block bounding extent.
- Detect `dateAlignment` from x-position clustering of date-like tokens (and *retire* the
  current right-aligned-date → sidebar false positive).
- `accentPlacement` from where non-ink color appears (name vs rules).
- Each axis keeps its independent confidence + curated fallback (per cloning spec §3).

### A5. Nudge UI upgrade (`import-resume-dialog.tsx`, playground `main.ts`, `nudge.ts`)
- Surface every new knob as a live control: margin slider, name-size slider,
  section-spacing slider, accent-placement segmented control, date-alignment toggle.
- Live dual-pane preview already exists in the playground — extend it to the dialog.
- Keep the accept/commit gate.

### A6. XMP round-trip + migration
- Bump the embedded-XMP schema version; `extract/xmp.ts` reads old + new.
- Collapsed-store templates (`document_templates`) gain the new token fields via the
  existing additive-migration pattern — **defaults backfilled, never a rewrite.**

**Acceptance:** all 5 default templates + all fixtures render in both engines with the new
knobs; fingerprint sets margins/date-alignment/accent-placement with confidence; nudge UI
exposes them; XMP round-trips losslessly old→new; CI green (`type-check`, `test:run`,
`lint`). Update cloning-spec §12 + this doc.

---

## Phase B — Table-like section primitive  *(Tier 2; medium)* ✅ SHIPPED (skills grid)

> **Status: DONE for the skills grid** (branch `feat/resume-template-fidelity-phase-b`,
> stacked on Phase A). Added a reflowing `labeled-rows` layout primitive (aligned
> label | value columns) + a `skillsLayout` grammar axis (`list` | `grid`, default
> `list` → byte-identical to before). The Skills section renders as an aligned
> two-column table in `grid` mode in **both** backends, still wrapping/reflowing on
> content swap; it falls back to the flowing list when skill groups are unlabeled (no
> half-empty table). Reuses the existing skills RDM — **no RDM / content-extraction /
> tailoring churn**. `skillsLayout` is nudge-only for now (no reliable geometric
> signal; detecting an in-line label/value grid is fragile — deferred). Exposed in the
> playground + Studio import dialog. All CI gates green.
>
> **Deferred to a Phase B.2:** `entry-grid` (repeated dated-entry grid), and geometric
> fingerprint detection of an aligned label/value grid. The `labeled-rows` primitive is
> in place for certs/awards to reuse.

**Goal:** kill ~90% of why people reach for Google Docs tables (skills grids, dated
two-column entries, label|value rows) — **without** freezing positions. The user built
their own résumé in Docs tables; this is the honest middle path for that muscle memory.

### B1. New section *kind* in the RDM / grammar (`rdm.ts`, `grammar.ts`, `layout.ts`)
A reflowing structured block, not a positioned table:
- `labeled-rows` — left label column + right content column (e.g. "Languages | …"). Column
  split is a ratio token, content still wraps and reflows.
- `entry-grid` — repeated dated entries with a consistent label/date/right-tab structure
  (covers the dated-table résumé pattern).
- Both are **grammar-level layout patterns**, so they survive content swaps and tailoring.

### B2. Render in both backends
HTML: CSS grid / flex (no `<table>` needed, but semantically a table). Typst: native
`grid`/`table` function. Shared structure from `layout.ts`.

### B3. Extraction
`extract/content.ts` + `geometry.ts`: detect aligned label/value or repeated-row regions
(consistent x-tab stops across lines) and map to `labeled-rows` / `entry-grid`. Low
confidence → fall back to normal section (never a broken table).

### B4. Tailoring + bank wiring
`tailored-to-rdm.ts`: ensure skills/certs/awards can target the new section kinds so the
tailor fills them. The grid must regenerate cleanly when content changes.

**Acceptance:** a Docs-table-style résumé (skills grid + dated rows) clones into a
reflowing grid that re-pours tailored content without overflow; both engines; fixtures
added; CI green.

---

## Phase C — Overleaf positioning: Typst as export-of-record + source escape hatch  *(Tier 4; cheap, strategic)*

> **DECISION (open question #2 resolved): production Typst compiles SERVER-SIDE (node
> compiler).** The export route already ships ~200 MB headless Chromium for HTML→PDF
> and shells out to `pdflatex`; a node Typst compiler is *lighter and more
> deterministic* than what's already there (no `networkidle`/font flakiness, npm dep
> always present so no "binary missing" fallback). Client WASM (28 MB/user, slow
> in-tab) loses on every axis here.
>
> **C2 — DONE** (branch `feat/resume-template-fidelity-phase-c`, stacked on B): the
> `.typ` source escape hatch. Added `renderResumeTypstForTemplate` (collapsed store →
> shared default → null) and a `format: "typst"` export that returns the `.typ` source
> for grammar-based templates (422 for legacy-only). Surfaced as a **Typst** entry in
> the export menu. Pure `renderTypeset` — no compiler, no new dependency. CI green.
>
> **C1 — DONE** (branch `feat/resume-template-fidelity-phase-c1`, stacked on C2):
> server-side Typst→PDF as an opt-in export engine. Added
> `@myriaddreamin/typst-ts-node-compiler` as an **apps/web runtime dep** + a lazy,
> server-only `lib/resume/typst-compile.ts` (the shared package's index stays
> browser-safe — the addon is not re-exported there). `/api/resume/export` gains an
> `engine: "html" | "typst"` param; `format: "pdf" + engine: "typst"` renders via
> Typst (422 for legacy-only templates, 500 on a genuine compile error — no silent
> fallback). Export menu gains a **"PDF (Typst)"** entry. CI green.
>
> **C follow-up — DONE** (branch `feat/resume-template-export-engine-pref`): per-template
> preferred engine now persists. Added an `export_engine` column to `document_templates`
> (additive migration), the import dialog sends its `engine` choice to
> `/import/commit`, and `/api/resume/export` resolves the engine as **request →
> template's saved preference → HTML**. So a résumé imported with "Typeset" exports as a
> Typst PDF by default; the explicit "PDF (Typst)" menu item still force-overrides. The
> import dialog's toggle is now real (no menu change needed).
>
> **Remaining (deferred):** make Typst the *global default* PDF engine once trusted
> (product call); let users change a saved template's engine from the template manager.

**Goal:** capture LaTeX/Overleaf users **without** building LaTeX ingestion. The wedge is
"LaTeX-quality PDF + AI tailoring Overleaf will never have," not file compatibility.

### C1. Make Typst the canonical export
- Promote `render-typeset.ts` + the Typst compiler to the **default export engine**;
  HTML becomes the live-edit/preview surface. (See the opinion in the cloning spec —
  don't ship users two non-identical PDFs to reconcile.)
- Harden the pluggable `compile(src)->pdf` path for production (currently node compiler in
  tests, WASM in playground). Decide prod host: server-side node compile vs WASM.

### C2. `.typ` source escape hatch (power users)
- "View / edit Typst source" for a generated résumé — read-only first, then editable with
  re-compile. This is the Overleaf-feel without us owning a `.tex` parser.
- Guardrail: hand-edited `.typ` leaves the tailoring loop (or we diff-merge — open
  question). Flag clearly in UI.

### C3. Positioning / marketing (coordinate with `docs/COMPETITOR-ANALYSIS.md`, landing)
- Frame: "Overleaf-grade output, none of the LaTeX. Re-tailored to every job
  automatically." Not a `.tex` importer.

**Acceptance:** Typst export is the default download, production-hardened; `.typ` source
viewable (stretch: editable + recompile); positioning copy drafted. CI green.

**Explicitly out of scope here:** `.tex`/`.typ` *import*. If we ever do it, it's a Phase D
concern, and `.tex ≠ .typ` (separate parsers).

---

## Phase D — Pixel-fidelity / WYSIWYG track  *(Tier 3; big bet, gated, opt-in)*

> **Decision gate written up:** `docs/resume-template-pixel-fidelity-gate.md`. A+B+C are
> merged; the go/no-go (with evidence to gather + cheaper alternatives) lives there.
> Default verdict is **defer** until the residual gap + demand are measured. Do not write
> Phase D code until that gate is passed.

**Goal:** for users who want exact visual control and accept losing auto-tailoring on those
docs. **Do not start until A–C ship and demand is proven.** This is a different product
mode, not an enhancement of the clone path.

### D1. Decision gate (do this first, before any code)
- Is there real demand once A+B have closed most of the gap?
- Acceptable that pixel-locked docs **cannot be auto-tailored** (or only within fixed
  boxes)? Document the tradeoff explicitly.
- Maintenance cost of a second layout engine + editor — justified?

### D2. If green-lit, candidate scope (each independently large)
- **Bbox preservation** in extraction (keep coordinates as an *alternate* template kind,
  parallel to grammar templates — not a replacement).
- **WYSIWYG drag editor** surface in Studio.
- **`.tex` / `.typ` import** (true Overleaf migration) — separate parser work.
- A "fidelity mode" flag on a template that switches it from reflow to fixed layout, with
  clear UI about what it disables.

**Acceptance:** TBD at gate. Likely its own spec doc when/if green-lit.

---

## Sequencing & dependencies

```
A (knobs + nudge)  ──►  B (table primitive)  ──►  D gate (reassess pixel demand)
        │                                            ▲
        └──►  C (Typst export-of-record + .typ)  ────┘
```

- **A first** — unblocks the most fidelity per unit effort and fixes the date-alignment
  false positive that hurts every clone today.
- **B and C are parallel** after A (B = layout, C = export/positioning; little overlap).
- **D last and gated** — A+B should shrink the gap enough that D may prove unnecessary;
  decide with evidence.

### Cross-cutting (every phase)
- XMP schema versioning + backward-read (`extract/xmp.ts`).
- Additive collapsed-store migrations only (`lib/db/resume-templates.ts`) — defaults
  backfilled, never drop/recreate (per CLAUDE.md DB conventions).
- New fixtures in `fixtures.ts` for each capability; render in both engines.
- Playground (`packages/template-playground/`) is the manual-verify surface for each phase.
- CI gates per phase: `pnpm run type-check`, `pnpm run test:run`, `pnpm run lint`.
- Forbidden-color lint + destructive-action patterns apply to all new Studio UI.

---

## Open questions
1. **Date-alignment** — new grammar axis (A2) or a token? Leaning axis (it's structural).
2. **Typst in production (C1)** — server node-compile vs shipped WASM? Affects deploy +
   latency.
3. **Hand-edited `.typ` (C2)** — hard fork out of tailoring, or diff-merge back?
4. **Pixel mode + tailoring (D1)** — fully disable tailoring, or allow within fixed boxes?
5. **`accentPlacement`** — does splitting it break any existing template's look on
   migration? Verify defaults reproduce current renders exactly.
