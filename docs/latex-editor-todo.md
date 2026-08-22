# LaTeX editor — open work (handoff)

Temporary working doc. Delete when the list is done.

## Where things stand

The LaTeX single-source rebuild is built and merged through PR 8. **PR 9 (#336) is open
and deliberately NOT auto-merged** — it is waiting on hands-on testing.

- Branch `feat/latex-consolidation` is checked out; PR #336 targets `main`.
- Spec: `docs/specs/latex-single-source-rebuild.md` (kept current — §6 records the
  hit-map decision, §13 the corrected deletion manifest).
- Merged so far: #327 (deletion 1) · #328 (contract + compile) · #329 (hit map) ·
  #330 (store/generation/cache/API) · #331 (inspector editor) · #332 (AI span actions) ·
  #333 (.tex import) · #334 (annotation pass) · #335 (cover letters).
- PR 9 deletes 30,823 lines: TipTap Studio, `lib/editor`, the grammar model, Chromium
  PDF, DOCX, Typst, PDF style cloning, `template-playground`, 23 dependencies.

**Do not merge #336 until the list below is worked through and re-tested**, since several
items change surfaces that PR introduces.

## Running it

```bash
pnpm dev                      # http://localhost:3000/en/studio
```

Environment facts worth not rediscovering:

- **Tectonic** is at `~/.local/bin/tectonic` (0.17.0). `resolveEngine()` finds it; override
  with `SLOTHING_TECTONIC_BIN`.
- **No LLM provider key is configured.** Every AI path therefore fails with a friendly
  error. Add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` to `apps/web/.env.local` to exercise
  them.
- **Playwright chromium is installed** (`~/.cache/ms-playwright/`). The playwright **MCP**
  does *not* work — it wants `/opt/google/chrome`. Drive the browser with a small
  `node` script using `require("playwright")` instead; that is what verified PRs 5–9.
- Port 3000 is the dev server. Kill it with
  `ss -lptn 'sport = :3000'` → `kill <pid>` (never `pkill -f "next dev"`; it has killed the
  agent's own shell).

## The work

### A. Copy and naming

- [ ] **Drop the accent: "résumé" → "resume"** in all user-facing copy. Grep is
      `rg 'résumé' apps/web/src`. Present in `studio-document-list.tsx`,
      `from-bank/route.ts`, `import.ts` (`titleFromFilename` fallback), and several
      error strings.
- [ ] **Friendlier file wording.** "Import a .tex file" → something like "Upload a file"
      or "Use your own file". The `.tex` restriction should be explained *after* the
      click (or in helper text), not be the label. Same for the empty state.
- [ ] Re-read every string added in PRs 5–9 for jargon. "Span", "annotate", and
      "structure" leak implementation vocabulary; `docs/specs/vocabulary-reskin.md` is the
      existing parked spec on this problem.

### B. Document kind — resume vs CV vs cover letter

Right now import **always creates `kind: "resume"`** and nothing asks or detects. The
kinds already exist in the DB (`TexDocumentKind`) and in `generateCoverLetterTex`.

- [ ] Let the user pick a kind on import (and on create).
- [ ] Consider light detection as a *default*, never a silent decision — e.g. filename
      containing "cover", or the body having `\slothingPara` / no `\slothingSection`.
- [ ] Make kind editable after the fact (it drives the list label and, later, the
      thumbnail badge).
- [ ] Decide whether `cv` differs from `resume` beyond the label — spec §19 Q4 is still
      open. If it does not, consider collapsing the two.

### C. Studio page (`/studio`)

Currently: a flat list, two buttons, no settings, no delete.

- [ ] **Delete a document.** Backend already exists (`DELETE /api/tex-documents/[id]`,
      cascades versions). Must use **Pattern A** (`useConfirmDialog`) per
      `docs/destructive-actions-pattern.md`, and **append a row to its Current Actions
      table** — that is a hard project rule.
- [ ] **Rename** (backend exists: `PATCH` with `title`). Inline rename in the list.
- [ ] **Duplicate** — cheap and useful given documents are just strings.
- [ ] **Grid view, Google-Docs style,** with a real first-page thumbnail so a document is
      identifiable at a glance. Toggle between list and grid, persisted under
      `taida:studio:view` (canonical `taida:` prefix; see `lib/constants/storage.ts`).
      - Thumbnail source: the PDF already exists per document. Options are rendering page
        1 to a PNG server-side, or rendering client-side with the pdfjs loader already
        extracted at `lib/pdf/load-pdfjs.ts` and caching the data URL. Prefer whichever
        avoids adding a dependency.
      - Needs a placeholder for documents that have never compiled and for the
        engine-unavailable case.
- [ ] **Expose settings on the Studio page**, not only inside a document. At minimum
      default font/size/margin for new documents. Decide where these live — a new
      user-preferences row, or reuse the existing settings surface.
- [ ] Sort/filter (by kind, by edited-at). Empty state should point at the bank when the
      bank is empty, since "New resume from my bank" fails in that case.

### D. UI pass, driven in the browser

The agent should drive Chrome itself and walk every path, capturing screenshots and
console errors. Precedent: this method caught two blank-screen bugs in PR 5, a broken
settings panel in 7a, and a design flaw in 7b that no unit test saw.

- [ ] `/studio` — empty state, populated list, grid view, every action.
- [ ] Import flow — a real Overleaf `.tex`, a broken one, a non-`.tex`, a huge one.
- [ ] Editor — click/hover on every span kind, multi-page documents, zoom, the splitter,
      selection surviving a recompile, the never-blank rule under a failing compile.
- [ ] Field editing — plain fields, rich fields (the read-only + "Edit as LaTeX" path),
      "Remove formatting" confirm.
- [ ] AI actions and the annotation pass **with a provider key configured** — these have
      never run against a real model (see E).
- [ ] Cover letter end to end.
- [ ] Narrow viewport. Below ~1024px the two-pane layout has **no** mobile treatment yet;
      the plan was a bottom sheet using the existing `components/ui/sheet.tsx`.
- [ ] Dark mode. None of the new UI has been looked at in dark mode. Note the documented
      precedent in `bank/preview/highlight-layer.tsx`: overlay colours are inline-styled
      because the PDF canvas is white regardless of theme.

### E. Unverified and known

- [ ] **No AI path has ever run against a real model.** Three features rest on this:
      span revision (PR 6), the annotation pass (PR 7b), cover-letter generation (PR 8).
      PR 7b's design was *broken* in a way only real execution revealed, so treat all
      three as unproven until exercised with a key.
- [ ] `/api/tailor` was ported for the extension but **not tested against a live
      extension** — only read from its source that it consumes `savedResume.id` + `jobId`.
- [ ] Command palette lists **no templates** (both template routes return empty lists).
      Resolves when the curated `.tex` gallery lands — spec §10, was "PR 10".
- [ ] PDF **style** cloning is gone (accepted trade, spec §2.1). PDF *content* import into
      the bank still works.
- [ ] Pre-existing, unrelated to this work: the dev log spams
      `[db] chunks_vec bootstrap skipped: SQLITE_ERROR: no such module: vec0`.
      That is the sqlite-vec extension being absent locally.
- [ ] Multipart import has no unit test (jsdom lacks real `File`/`FormData`, and the
      shared test setup requires jsdom). Covered by a live-server check only.

## Conventions that will bite

From `CLAUDE.md` plus things learned the hard way this session:

- **Lints hard-fail CI**: no `bg-white`/`text-gray-*`/hex in style props; no `font-sans`
  or `font-serif`; no arbitrary `rounded-[8px]`; **no `new Date()` / `Date.now()`** outside
  a small allowlist — use `nowIso()` from `@/lib/format/time`.
- `pluralize()` for counts; `<TimeAgo />` for times; `crypto` for ids, never `Math.random()`.
- Destructive actions need confirm/undo **and** a row in
  `docs/destructive-actions-pattern.md`.
- Adding a sidebar entry breaks `sidebar.test.ts` (exact-array assertions). Studio already
  has one, so no change is needed.
- `error.tsx` in any new route dir must match the exact 3-line shape asserted by
  `route-errors.test.ts`.
- **i18n**: app pages hardcode English (22 of 27, including Studio). Adding a message key
  means genuinely translating it into all 7 non-English files, since the suite effectively
  enforces strict-identical. Keep hardcoding English.
- `pnpm run test:run` runs the translation check first; the LaTeX CI job needs Tectonic and
  self-skips without it.
- **Prettier reformats between edits**, so a string-replacement's "before" text goes stale.
  Always assert the replacement matched instead of letting it silently no-op — that
  silently swallowed two edits this session.
- `/api/documents/*` is the uploaded-documents API. The LaTeX one is
  **`/api/tex-documents/*`**. Do not `mkdir -p` into the former.
