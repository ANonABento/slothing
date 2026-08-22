# LaTeX editor — open work (handoff)

Temporary working doc. Delete when the list is done.

## Where things stand

The LaTeX single-source rebuild is built and merged through PR 8. **PR 9 (#336) is open
and deliberately NOT auto-merged** — it is waiting on hands-on testing.

- Branch `feat/latex-consolidation` is checked out; PR #336 targets `main`.
- Spec: `docs/specs/latex-single-source-rebuild.md`.
- Merged so far: #327 · #328 · #329 · #330 · #331 · #332 · #333 · #334 · #335.

## Running it

```bash
pnpm dev                      # http://localhost:3000/en/studio
```

- **Tectonic** is at `~/.local/bin/tectonic` (0.17.0); override with `SLOTHING_TECTONIC_BIN`.
- **No LLM provider key is configured** (`OPENAI_API_KEY` is present but empty, and Ollama
  is not running), so every AI path fails. See section E.
- **Playwright chromium is installed**, but the playwright **MCP** does not work — it wants
  `/opt/google/chrome`. Drive a browser with a `node` script importing
  `node_modules/.pnpm/playwright@*/node_modules/playwright/index.mjs`. That is what found
  every bug listed under "Fixed by the browser pass".
- Kill the dev server with `ss -lptn 'sport = :3000'` → `kill <pid>`. Never
  `pkill -f "next dev"` — it has killed the agent's own shell.

## Done

### A. Copy and naming — done

- "résumé" → "resume" everywhere user-facing (the one remaining accent is deliberate
  Unicode test data in `lib/upload/filename.test.ts`).
- "Import a .tex file" → **"Upload your own"**, with the format named in helper text
  underneath rather than in the button.
- Jargon pass on the inspector: "Structure" → **"Outline"**, "elements" → "parts",
  "Not annotated yet" → "Not broken into parts yet", "This element has no editable
  fields" → "There is nothing to edit in this part".

### B. Document kind — done

- `lib/latex/detect-kind.ts` guesses from the document BODY first (our own macros, then a
  salutation or sign-off) and the filename second. Whole-word matching, so "discovery"
  is not read as "cover".
- The browser reads the file, detects, and **shows the guess with its reasoning** in a
  confirm dialog before anything is created. The API applies the same detection for
  direct callers instead of the old unconditional `kind: "resume"`.
- Kind is editable afterwards — `PATCH /api/tex-documents/[id]` accepts `kind`, and the
  editor's new document bar exposes it.

### C. Studio page — done

- **Delete** (Pattern A confirm; row added to `docs/destructive-actions-pattern.md`),
  **inline rename** (optimistic, rolls back on failure), **duplicate** (new
  `POST /api/tex-documents/[id]/duplicate`, `copyTitle` numbers repeats).
- **Grid view** with real first-page thumbnails: lazy via IntersectionObserver, globally
  capped at 2 concurrent compiles, cached per `(id, updatedAt)`, with a "No preview yet"
  placeholder for documents that will not compile or when no engine is present.
- Search, kind filter chips (zero-count chips are disabled rather than leading to a dead
  end), sort. A distinct "Nothing matches" empty state so a filter is never mistaken for
  lost work. View/sort/defaults persist under `taida:studio:view|sort|defaults`.
- **New-document defaults** (font, size, margin) behind the toolbar's settings toggle,
  applied at creation and honestly scoped — the panel says it cannot restyle existing
  documents, because it cannot.
- **`POST /api/tex-documents/starter`** — new. An empty knowledge bank used to be a dead
  end: `from-bank` refuses it and the cover-letter route needs both a job description and
  a provider key, so a new account could create nothing at all.
- The editor gained a **document bar** — title, type, save state, and a link back to
  Studio. It previously opened into two panes with no chrome whatsoever.

### D. Browser pass — done

Walked with a real browser at 1440×900 and 390×844, light and dark: create (all three
kinds, both sources), upload (a Slothing `.tex`, a foreign Overleaf `.tex`, a broken one,
a `.txt`), open, click-to-select, rename, duplicate, delete, grid, filters, settings.
**Zero console errors, zero failed API calls, no horizontal scroll at 390px.**

Fixed by the browser pass:

1. **Documents that could never compile.** `generateResumeTex` emitted
   `\begin{slothingItems}\end{slothingItems}` for an entry with no bullets — an education
   row, the ordinary case. An empty `itemize` is a hard LaTeX error, not an empty render,
   so "build from my bank" produced resumes that 422'd forever. Fixed in the generator
   (no list at all) **and** guarded in `slothing.sty` (`\ifslothing@sawitem`) for
   documents the generator does not control. `STY_VERSION` bumped to 4 so cached PDFs
   are invalidated. Both verified against the real engine.
2. **The editor overflowed the viewport** — `lg:h-screen` ignored the shell's 3.5rem
   sticky bar, pushing "Download PDF" off the bottom of the window.
3. **Vague AI errors.** A missing provider key and a model returning nonsense gave the
   identical "Could not annotate this document." Now separated, and the model-failure
   case says the document is unchanged, which is the actual worry.

Not a bug: the floating gear that overlaps the inspector footer is `TweaksPanel`, which
is **development-only**.

## Still open

### E. Unverified

- [ ] **No AI path has ever run against a real model.** Span revision (PR 6), the
      annotation pass (PR 7b), and cover-letter generation (PR 8) all rest on this, and
      PR 7b's design was *broken* in a way only real execution revealed. The failure
      paths are now verified graceful; the success paths are not verified at all.
      Add a working `ANTHROPIC_API_KEY`/`OPENAI_API_KEY` to `apps/web/.env.local`.
- [ ] `/api/tailor` was ported for the extension but never tested against a live extension.
- [ ] Command palette lists **no templates** — both template routes return empty lists.
      Resolves when the curated `.tex` gallery lands (spec §10).
- [ ] Multipart import has no unit test (jsdom lacks a real `File`/`FormData`); covered by
      the live-server browser pass only.

### F. Deliberately not done

- [ ] **Mobile is functional but not designed.** Below `lg` the two panes stack and
      everything is reachable and scrollable, with no horizontal overflow — but the
      planned bottom sheet (`components/ui/sheet.tsx`) was not built.
- [ ] Whether `cv` should differ from `resume` beyond its label is still open (spec §19
      Q4). They currently share a pipeline and a starter.
- [ ] Version history has no UI. The rows are written on every source change and
      `GET /api/tex-documents/[id]?versions=true` returns them; nothing renders them.
- [ ] Pre-existing and unrelated: the dev log spams
      `[db] chunks_vec bootstrap skipped: SQLITE_ERROR: no such module: vec0`.

## Conventions that will bite

- **Lints hard-fail CI**: no `bg-white`/`text-gray-*`/hex in style props; no `font-sans`
  or `font-serif`; no arbitrary `rounded-[8px]`; **no `new Date()` / `Date.now()`** —
  use `nowIso()` from `@/lib/format/time`.
- `pluralize()` for counts; `<TimeAgo />` for times; `crypto` for ids, never `Math.random()`.
- Destructive actions need confirm/undo **and** a row in
  `docs/destructive-actions-pattern.md`.
- The shared test setup replaces `localStorage` with no-op `vi.fn()`s. A round-trip
  assertion has to install its own backing store — see `lib/studio/preferences.test.ts`.
- `error.tsx` in any new route dir must match the exact 3-line shape asserted by
  `route-errors.test.ts`.
- **i18n**: app pages hardcode English (Studio included). Adding a message key means
  genuinely translating it into all 7 non-English files. Keep hardcoding English.
- **Prettier reformats between edits**, so a string replacement's "before" text goes
  stale. Always assert the replacement matched instead of letting it silently no-op.
- `/api/documents/*` is the uploaded-documents API. The LaTeX one is
  **`/api/tex-documents/*`**. Do not `mkdir -p` into the former.
