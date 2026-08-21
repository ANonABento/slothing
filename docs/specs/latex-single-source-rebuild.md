# LaTeX single-source rebuild — resume, CV, and cover letter

**Status:** Planning / not started. No code written. Approved in conversation 2026-08-21.

**Supersedes:**
- `docs/resume-template-fidelity-roadmap.md` Phase C (Typst as export-of-record) and
  Phase D (pixel-fidelity gate). Both are cancelled by this document.
- `docs/resume-template-cloning-spec.md` — the grammar+tokens clone model is retired.
- The HTML→Chromium, `pdflatex` shell-out, and DOCX export paths.

**Why this exists:** the resume→PDF subsystem grew four competing render paths, two
disagreeing template registries, and a live silent-data-loss bug. The cause was additive
decisions: each new engine shipped without deleting the one it replaced. This spec's
single organising rule is therefore **subtraction is part of the deliverable**.

---

## 1. Goal

One document format, one render engine, one editor, for all three document kinds.

A Slothing document *is* a LaTeX file. Not a model that renders to LaTeX; not a LaTeX
file derived from a model. The `.tex` is the artifact of record — it is what we store,
what the AI edits, what the user downloads, and what compiles to the PDF.

The user, however, is never required to write LaTeX. They interact with a structured
inspector UI over a live PDF. LaTeX is the substrate, not the interface.

## 2. Non-goals

- A general-purpose LaTeX IDE. We are not rebuilding Overleaf.
- In-PDF caret editing (true WYSIWYG typing). Explicitly deferred — see §7.4.
- Arbitrary `.tex` package support. The compile sandbox constrains what is reachable.
- Cloning the *visual style* of an uploaded PDF. Retired — see §9.3.
- DOCX output. Retired — see §2.1.
- Preserving the TipTap document contract. Retired.

### 2.1 Accepted losses (named up front, not discovered later)

| Loss | Who it affects | Mitigation |
| --- | --- | --- |
| DOCX export | Users whose target ATS wants `.docx` | None in v1. The span tree (§3.3) keeps a future DOCX emitter cheap if demand appears. Do **not** pre-build it. |
| Style cloning from an uploaded PDF | Non-LaTeX users who wanted to keep their existing look | Content still parses into the bank; they pick a template for the look. `.tex` uploads keep their look exactly. |
| Rich-text WYSIWYG editing | Users used to the Studio TipTap surface | Replaced by the inspector; field editing is plainer but the preview is exact. |
| Server-side HTML preview / HTML share links | Share-link recipients | Share links serve the compiled PDF. |

## 3. The document contract

A Slothing document is a single `.tex` file written to a versioned contract. It compiles
unmodified in Overleaf (given `slothing.sty`, §3.5) and carries enough structure for the
app to address individual fields.

### 3.1 File shape

```latex
\documentclass[letterpaper]{article}
\usepackage{slothing}
\slothingcontract{1}

\slothingset{
  font        = LatinModern,
  fontsize    = 11pt,
  margin      = 0.5in,
  sectionskip = 8pt,
  accent      = {0,0,0},
}

\begin{document}
\slothingHeader[id=hdr]{Kevin Jiang}{kevin@example.com}{...}

\slothingSection[id=sec-a3f91c]{Experience}
  \slothingEntry[id=ent-7b21e4]{Bracket Bot}{Robotics Engineer}{2025--2026}{
    \slothingItem[id=itm-c4d883]{Cut calibration time 40% by ...}
    \slothingItem[id=itm-91ea27]{Shipped ...}
  }
\end{document}
```

Three layers, with strictly separated ownership:

| Layer | Owner | UI surface |
| --- | --- | --- |
| `\slothingset{...}` settings block | machine, schema-validated | Settings panel |
| `\slothing*` semantic macros | machine + AI, addressable by `id` | Inspector |
| Any other LaTeX | user | Source view (read-only in v1) |

### 3.2 Settings block

`\slothingset` takes a closed key–value set validated by a Zod schema. The settings panel
reads and writes **only** this block; it never parses arbitrary LaTeX. Unknown keys are a
validation error, not a silent pass-through — an unknown key means the document was
written by a newer contract version.

v1 keys: `font`, `fontsize`, `margin`, `sectionskip`, `accent`, `columns`.

### 3.3 Semantic macros and IDs

v1 macro set: `\slothingHeader`, `\slothingSection`, `\slothingEntry`, `\slothingItem`,
`\slothingPara` (cover letters), `\slothingSkills`.

Every addressable macro carries `id=`. Rules:

- IDs are opaque: `<kind>-<6 hex>`, e.g. `itm-c4d883`. Not slugs — slugs collide on
  reorder and rename.
- Generated server-side with `crypto.randomBytes`. **Never `Math.random()`** (repo rule).
- IDs live in the source, so they survive download → re-upload → round-trip.
- IDs are the addressing scheme for: AI edits, bank swaps, diffs, undo, and the hit-map.
- An ID is stable for the life of the span. Editing text does not change it.

Parsing the contract is a **narrow scanner**, not a LaTeX parser: it locates `\slothing*`
macro heads, matches braces, and extracts the `id` and argument spans. Everything it does
not recognise is opaque text it must preserve byte-for-byte on write-back.

### 3.4 Field content model

Field content is **plain text by default, escaped on write** through the existing
`escapeLatex` in `lib/resume/latex-generator.ts` (that function is correct and survives
the rebuild).

A closed inline-markup subset is allowed and mapped to macros:

| Intent | Stored as |
| --- | --- |
| bold | `\slothingB{...}` |
| italic | `\slothingI{...}` |
| link | `\slothingLink{url}{text}` |

**The AI may only emit this subset.** Model output is validated against it and rejected
otherwise. This is a security boundary as much as a formatting one — free-form LaTeX from
a model would defeat both the sandbox reasoning and the addressability guarantees.

### 3.5 `slothing.sty`, versioning, and Overleaf export

- `slothing.sty` is shipped by the app and injected into the compile working directory. It
  is **not** stored in user documents, so macro implementations can be fixed centrally.
- `\slothingcontract{N}` pins the contract version. The `.sty` supports the current version
  and one back; a document on an older contract is migrated on open, with the migration
  recorded as a document version.
- **"Download for Overleaf"** emits a zip: `main.tex` + `slothing.sty` + any assets. This
  is also the no-engine fallback (§5.6) and the answer to "I want to leave." A one-click
  exit is a feature, not a leak.

## 4. Data model

Additive migrations only, following the `CREATE TABLE IF NOT EXISTS` + `PRAGMA table_info`
pattern already in `lib/db/`. **`drizzle db:generate` is broken (journal drift)** — add
tables and indexes via the runtime bootstrap path, not generated migrations.

Every table is user-scoped: `user_id TEXT NOT NULL DEFAULT 'default'` + `idx_<table>_user_id`.

**`tex_documents`** — the artifact of record.
`id`, `user_id`, `kind` (`resume` | `cv` | `cover_letter`), `title`, `source` (the `.tex`),
`contract_version`, `template_id`, `opportunity_id` (nullable), `created_at`, `updated_at`.

**`tex_document_versions`** — server-side history.
`id`, `user_id`, `document_id`, `source`, `label`, `created_at`.
This *replaces* the browser-localStorage version history (`taida:builder:versions:*`,
`lib/builder/version-history.ts`). Text sources are small; there is no reason history
should be trapped in one browser. Existing localStorage history is read once on first
open and imported, then ignored.

**`document_templates`** — reused, not replaced. `template_json` now stores the template's
`.tex` body plus contract metadata. The `rdm_json` and `export_engine` columns become dead
and are dropped from *use* in the deletion PR (columns stay; migrations are additive).

**Compiled artifacts** are a **filesystem cache**, keyed by
`sha256(source + sty_version + mode)`, with a DB-tracked pointer. Explicitly:

- Not in a public directory. Served only through an authed, user-scoped route
  (`GET /api/documents/[id]/pdf`).
- Content-addressed, evictable, and fully regenerable — losing the cache costs a recompile.

This is deliberately *unlike* the retired `/api/opportunities/[id]/generate`, which wrote
guessable filenames into a public directory and called the result a PDF.

## 5. Compile service

### 5.1 Interface

```ts
compile(input: {
  source: string;
  mode: "preview" | "export";
  timeoutMs?: number;
}): Promise<{
  pdf: Uint8Array;
  hitMap: SpanHitMap | null;   // §6
  log: CompileLog;             // parsed, not raw
  pages: number;
}>
```

One function, one module, no callers reaching around it. Transport is an implementation
detail so the subprocess can become a sidecar container later without touching callers.

`mode` matters: **preview compiles may inject the span hit-map layer; export compiles never
do.** A downloaded resume must contain nothing but the resume.

### 5.2 Engine

**Tectonic.** Self-contained Rust/XeTeX, on-demand zipped bundles, ~95% smaller than a full
TeX Live image, no shell-escape implementation to defend against, and `--synctex` support.

Invocation: `tectonic -X compile --untrusted --only-cached --synctex --outfmt pdf`.

The bundle is pre-warmed into the image / cache at build time, and `--only-cached` then
pins the compile to that cache so it never reaches the network. **Measured on Tectonic
0.17.0 (x86_64-linux-musl), a representative resume preamble** (geometry + enumitem +
titlesec + hyperref):

| | measured |
| --- | --- |
| Cold compile (bundle download) | 39s |
| Warm compile | **0.54s** |
| `--only-cached`, no network | 0.54s |
| Bundle cache on disk | 43 MB |

This supersedes the earlier "1–3s typical" estimate in §2 — sub-second warm compiles put the
edit loop comfortably inside the debounce window, and the cold/warm gap (72×) is what makes
pre-warming mandatory rather than an optimisation.

### 5.3 Sandbox

Compiling user-supplied LaTeX is arbitrary-code-execution territory. Layers, in order:

1. **`--untrusted`** — Tectonic's own flag; disables known-dangerous features regardless of
   other settings, including `-Z shell-escape`. Also set `TECTONIC_UNTRUSTED_MODE=1` as
   defence in depth (noting it is defeatable only by something already executing, which
   `--untrusted` prevents).

   **Verified behaviour:** under `--untrusted`, Tectonic **silently disables** `\write18`
   rather than raising an error — the document compiles and the shell command simply never
   runs. Sandbox tests must therefore assert the **absence of the side effect**, not a
   thrown error. A test that expects a compile failure here passes for the wrong reason
   today and would keep passing if the protection were removed.
2. **Process limits** — wall-clock timeout (20s default), memory cap, output-size cap, page
   cap. A compile that exceeds any limit is killed and surfaced as a user-facing error.
3. **Filesystem jail** — a fresh temp dir per compile containing only `main.tex`,
   `slothing.sty`, and declared assets. Deleted on completion, including on failure.
   `TEXMFHOME` pinned inside the jail.
4. **No network** during compile (the bundle is pre-warmed).
5. **Concurrency queue + per-user rate limiting**, via the existing sliding-window limiter
   in `lib/rate-limit.ts`. Compile is expensive; it gets the same treatment as LLM routes.

Sandboxing is **not** deferrable to "later hardening." It ships with the compile service.

### 5.4 Cache

Key: `sha256(source + sty_version + mode)`. Hit → serve bytes, no compile. This makes
reopening a document, re-downloading, and share-link views free.

### 5.5 Errors

LaTeX logs are hostile to normal humans. The compile service returns a **parsed** log:
error kind, the offending source line, and — where the line falls inside a known span — the
span ID, so the inspector can point at the field that broke.

**The last good PDF stays on screen.** A failed compile shows an error banner over a stale
preview; it never blanks the document. This is the single most important UX rule in the
editor and it is a requirement, not a polish item.

### 5.6 No-engine fallback

If no Tectonic binary is present (a self-hoster who did not install it), the app does not
break: document editing works, the preview shows an explanatory state, and every download
becomes the Overleaf zip (§3.5). We never ship a second render engine to paper over this.

## 6. The span hit-map — SPIKE, decision required before §7

To click an element in the PDF and resolve it to a field, we need a map from PDF page
coordinates to span IDs. Three viable mechanisms, none yet proven in this stack:

| Option | Mechanism | Upside | Risk |
| --- | --- | --- | --- |
| **A. Preview-only link annotations** | Wrap each span in an invisible link annotation carrying its ID; PDF.js exposes annotation rects directly | No parsing at all; hover rects for free | PDF.js may sanitise custom URI schemes; links across line breaks can be finicky. Preview-only, so no pollution of exported PDFs |
| **B. `\pdfsavepos` aux map** | Emit span ID → page + x/y to an aux stream during compile; read after | Exact, structured, engine-controlled, no PDF pollution in any mode | Bounding boxes across line breaks need care; XeTeX primitive behaviour needs verifying |
| **C. SyncTeX parse** | Parse `.synctex.gz` ourselves for reverse sync | Standard, engine-supported, already enabled | We must write a SyncTeX parser (~300–500 lines); granularity is line/box, so it needs the macro map anyway to resolve identity |

**Preference order: A, then B, then C.** C is the guaranteed-to-work floor.

**This is a gated spike.** A small PR proves one mechanism against a real compiled document
before the editor phase starts. Do not begin §7 on an assumption here.

## 7. Editor architecture

### 7.1 Layout

Primary surface is the **live PDF** (PDF.js). Not a code editor, not a rich-text canvas —
the rendered document, which is the truth.

- **Canvas** — the compiled PDF, click- and hover-aware.
- **Inspector** (right) — the selected span: its text, its per-field settings, its AI actions.
- **Settings panel** — global `\slothingset` knobs.
- **Outline** (left) — the span tree; jump, reorder, add, remove sections and entries.
- **Source view** — read-only in v1 (§7.5).

### 7.2 Interaction loop

Click in PDF → hit-map → span ID → inspector opens with that field. Edit → patch that span
in the source → debounced recompile (600ms after last keystroke, plus on blur) → PDF
updates. Stale preview stays visible with a recompiling indicator. Typing is never blocked
on a compile.

### 7.3 Write-back discipline

All edits are **span-scoped patches**, never whole-document rewrites. Unrecognised regions
of the file are preserved byte-for-byte. A user's hand-written LaTeX must survive an AI
edit to an unrelated bullet — this is the guarantee that makes the escape hatch trustworthy.

### 7.4 Deferred: in-PDF caret

Typing directly into the PDF is the hard research problem SwiftLaTeX exists to solve.
Click-to-select plus edit-in-inspector delivers most of the feel at a fraction of the cost.
Revisit only after v1 is in real use.

### 7.5 Deferred: editable source view

v1 ships **read-only** source view (view, copy, download). Editable raw source can break
annotations and needs a re-annotate/repair flow; shipping that half-done produces documents
the inspector cannot address. v2.

## 8. AI integration

AI acts on **spans, not documents**. An action names a span ID, gets that span's text plus
context (the entry, the section, the target posting, the bank), and returns replacement
text in the allowed inline subset (§3.4).

- v1 actions: Rewrite, Tighten, Quantify, Tailor to this posting.
- Output is validated against the inline subset; invalid output is rejected and retried,
  never written through.
- Grounding rules from the existing anti-fabrication work (PRs #304/#306) apply unchanged.
  A tailoring action may not invent experience absent from the bank.
- Every AI route is rate-limited via `lib/rate-limit.ts` and gated through the existing
  `ai-gate` billing path.
- Every AI edit writes a `tex_document_versions` row, so every AI change is revertible.

**Full-document tailoring** is a batch of span edits presented as a reviewable diff, not an
opaque rewrite. The user sees which bullets changed before accepting.

## 9. Import paths

### 9.1 `.tex` upload — the wedge

Upload a `.tex` (Jake's Resume, Deedy, moderncv, anything). It compiles as-is; the look is
preserved exactly, because it *is* their document.

### 9.2 Annotation pass

An un-annotated `.tex` still compiles and still tailors — coarsely, since there are no span
IDs. A one-time **AI annotation pass** proposes `\slothing*` wrappers and IDs, presented as
a **reviewable diff**. Accepting makes the document fully addressable. Declining leaves it
working at coarse grain. It is never applied silently.

### 9.3 PDF upload — content only

A PDF resume parses into the **bank** (that parser exists and survives). It does not
reconstruct the visual style; the user picks a template. This is the accepted loss in §2.1.

## 10. Templates

The template gallery is a set of curated, annotated `.tex` files, replacing the 9 built-in
`TEMPLATES` and 4 cover-letter templates in `lib/resume/template-data.ts`.

Each template ships already conforming to the contract, so a document created from one is
fully addressable from the first render. Users can save their own document as a template.

## 11. Cover letters

Same pipeline, same engine, same editor, same contract — a cover letter is a short LaTeX
document using `\slothingPara`. The existing `lib/cover-letter/generate.ts` prompt work is
retargeted to emit contract-conforming `.tex` instead of TipTap/HTML.

This is what allows TipTap to be deleted outright rather than kept alive for one surface.

## 12. ATS and text extraction

ATS scanning extracts text from the **compiled PDF**, not from our own model. That is what
a real ATS does, so it is strictly more faithful than the current path, and it removes a
whole class of "our score disagrees with reality" bugs.

## 13. Deletion manifest

Approximate, to be exact-listed in the deletion PRs.

**Deleted in PR 1 — actively harmful, or dead code with no live consumer:**
- `app/api/opportunities/[id]/generate/route.ts` — LLM-generated an HTML file into
  `public/resumes/`, returned it as `pdfUrl`, and the UI opened it so the user could hit the
  browser print dialog. Never produced a PDF.
- the identical `public/resumes/` write in `app/api/tailor/route.ts`, plus `PATHS.RESUMES_OUTPUT`
- `renderPrintButton()` in `lib/resume/pdf.ts` — the fake "Download PDF" button injected into
  generated HTML (also the file's inline-hex offender)
- the `pdflatex` `exec` shell-out in `app/api/resume/export/route.ts` (`format: "latex"` now
  always returns `.tex`; server-side LaTeX returns in PR 2, sandboxed)
- `app/api/opportunities/templates/route.ts` — sole consumer was the deleted UI
- orphaned `components/tailor/`: `export-menu`, `gap-analysis`, `jd-input`, `resume-preview`

**Deferred out of PR 1 — verified unsafe to cut early:**

| Item | Why it cannot go in PR 1 | Lands in |
| --- | --- | --- |
| HTML→Chromium PDF (`lib/resume/pdf-export.ts`) | It is the **only live PDF export**. Studio's export goes `use-studio-page-state.ts` → `lib/builder/document-export.ts` → `format: "pdf"` with raw HTML. The Typst engine has no live UI — its only caller was the orphaned `components/tailor/export-menu.tsx`. | PR 9 |
| Typst engine + grammar model | Grammar defaults cover only 5 template ids (`classic`, `modern`, `sidebar`, `tech`, `compact`) against 9 legacy built-ins. Switching PDF to Typst-only would strand `minimal`, `executive`, `creative`, `professional`, `two-column` with no PDF at all. | PR 9 |
| `lib/resume/pdf.ts` (`generateResumeHTML`, `TEMPLATES`) | Still backs the live Studio preview fallback (`lib/builder/resume-preview-fallback.ts`) and manual tailor (`lib/tailor/manual-tailor-handler.ts`). | PR 9 |
| DOCX export | Live in Studio today. An approved permanent loss (§2.1), but removing it early buys nothing and costs users a working feature for eight PRs. | PR 9 |
| `packages/shared/.../extract/**` | Removing it early leaves users with **no** template import for six PRs. It should die the day `.tex` import replaces it. | PR 7 |

**Rule applied:** PR 1 removes what is dead, duplicated, or actively harmful. It does not
remove working features whose removal is merely eventual — those go in the PR that replaces
them. Cutting a live feature early is not discipline, it is just an outage with a roadmap.

**Survives:** `escapeLatex` from `lib/resume/latex-generator.ts`, the bank, the document
parser, `generator.ts` LLM tailoring, the `document_templates` store, the ATS engine.

## 14. Migration for existing data

Existing generated resumes are stored as `TailoredResume` JSON. On first open after the
rebuild, convert to an annotated `.tex` using the user's chosen template — the conversion is
forward-only and deterministic (structured data → macros), which is the easy direction.

Existing imported grammar templates cannot be converted to `.tex` faithfully. Affected users
get an explicit notice and a template re-pick, with their original uploaded file still
downloadable. **Do not fake a conversion.**

Existing browser-localStorage version history is imported once (§4), then ignored.

## 15. PR sequence

Deletion is split into two PRs, deliberately. Deleting everything before the replacement
exists would leave the product broken for weeks; deleting nothing until the end is how we
got four engines. The rule that actually matters is: **users are never shipped two
rendering paths.** PR 1 removes paths with no user-visible replacement cost; PR 9 removes
the last old path on the day the new one takes over.

| PR | Scope | Acceptance |
| --- | --- | --- |
| 1 | Deletion part 1 (§13) | CI green; no user-facing regression — the opportunity drawer's fake-PDF button is replaced by a link to Studio for that opportunity |
| 2 | Contract + `slothing.sty` + compile service + sandbox + cache | `compile()` produces a PDF from a fixture; every sandbox limit has a test that trips it |
| 3 | Span hit-map spike (§6) | One mechanism proven against a real compiled document; decision recorded in this doc |
| 4 | Generation: bank + template → annotated `.tex` → PDF; `tex_documents` store | A document generates, compiles, downloads, and round-trips through re-upload with IDs intact |
| 5 | Inspector editor: PDF canvas, click-to-select, field edit, settings panel, recompile loop | Click a bullet, edit it, see the PDF update; a failed compile keeps the last good PDF on screen |
| 6 | AI span actions + reviewable diff for batch tailoring | Actions are rate-limited, grounded, validated against the inline subset, and revertible |
| 7 | Import: `.tex` upload, annotation pass, PDF→bank | An un-annotated Jake's Resume compiles, then annotates via a reviewable diff |
| 8 | Cover letters onto the same pipeline | Cover letter generates, edits, and exports through the identical path |
| 9 | Deletion part 2 (§13) — Typst, grammar model, TipTap, `lib/editor` | New path is the only path; dependency count drops; CI green |
| 10 | Template gallery, share links, ATS retarget, docs | Gallery renders; share link serves a compiled PDF; `docs/architecture.md` updated |

## 16. Testing

- **Contract tests are engine-free** and run on every CI job: scanner round-trip
  (parse → write-back is byte-identical for untouched regions), ID stability, escaping,
  settings-schema validation, inline-subset validation. This is the bulk of the suite.
- **Compile tests need Tectonic.** The unit `Test` job has no browser today and will not
  have a TeX engine either. Follow the existing precedent
  (`it.skipIf(!existsSync(chromium.executablePath()))`) with a `describeIf(hasTectonic)`
  guard so a missing engine never breaks the suite.
- **Add a dedicated CI job that installs Tectonic** (one binary) with the bundle cached via
  `actions/cache`, so compile tests genuinely run in CI rather than being skipped forever.
  A skipped gate is not a gate.
- **Golden PDFs**: assert on parsed text + page count + span hit-map, not on PDF bytes.
  Byte comparison is a flake generator.
- **Sandbox tests are mandatory**: a shell-escape attempt, an infinite loop, a memory bomb,
  and an absolute-path `\input` each get a test asserting the compile is refused or killed.

## 17. Repo conventions this must honour

- `user_id` scoping on every new table + `idx_<table>_user_id`; additive migrations only;
  no `drizzle db:generate` (journal drift) — use the runtime bootstrap pattern.
- Forbidden-color lint hard-fails CI: no `bg-white`, no hex in style props. Editorial tokens
  only. (Note: retired `lib/resume/pdf.ts` is full of inline hex — deleting it is a net win here.)
- Destructive actions (delete document, delete template, discard version) follow
  `docs/destructive-actions-pattern.md` and get a row in its Current Actions table.
- `pluralize()`, `<TimeAgo />`, `crypto.randomBytes` IDs. No inline `toLocaleString()`, no
  `Math.random()`.
- LLM and compile routes wrapped with `lib/rate-limit.ts`; errors through `lib/api-utils.ts`.
- Studio remains the home surface; `/builder`, `/tailor`, `/cover-letter` stay 308 redirects.

## 18. Risks

| Risk | Severity | Response |
| --- | --- | --- |
| Span hit-map: none of A/B/C works cleanly | High | Gated spike (§6) before any editor work. C is the guaranteed floor. |
| Compile latency makes editing feel sluggish | Low (was Medium) | Measured 0.54s warm on a representative preamble (§5.2). Still: debounce + cache + stale-preview-never-blanks, and re-measure p50/p95 on a real full-page resume in PR 5. |
| Self-hosters without Tectonic | Medium | Graceful degradation to the Overleaf zip (§5.6). Never a second engine. |
| Sandbox escape | High | `--untrusted` + process limits + jail + no network, each with a test that trips it (§16). |
| Non-LaTeX users lose their existing look | Medium | Named in §2.1. Template gallery must be genuinely good — it is the mitigation, so PR 10 is not optional polish. |
| Scope creep back toward a second engine | High | The rule: users are never shipped two rendering paths. PR 9 is a hard gate on PR 5–8 being live. |

## 19. Open questions

1. Which hit-map mechanism (§6) — resolved by the PR 3 spike.
2. Curated template list for the gallery — how many, which licences (must be
   redistribution-safe; the repo is heading to AGPL with a cloud carve-out).
3. Do share links serve a PDF only, or PDF + `.tex`?
4. Does `kind: cv` differ from `kind: resume` in v1, or is it only a template difference?
