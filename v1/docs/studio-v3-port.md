# Studio v3 port plan

Mapping for porting `design_handoff_v2/app-studio-v3.html` into our existing
`/studio` route. Scope confirmed with user: **full port incl. editor canvas**,
**split-buttons wired to existing handlers**, unbuilt actions go to stubs.

The current studio (`apps/web/src/app/[locale]/(app)/studio/page.tsx`) already
has the 3-column bones (FilePanel · ResumePreview · AiAssistantPanel) and a
working state layer (`useStudioPageState`). This port is **chrome polish +
sub-bar + tabbed left rail + tabbed AI rail + canvas frame**, not a rewrite.
Most state stays, the wrapper components change.

## Region-by-region map

| v3 region | Current component | Phase | Notes |
|---|---|---|---|
| App AppBar (top) | `apps/web/src/components/layout/app-bar.tsx` | — | Unchanged. Search already pinned to viewport center. |
| **Studio sub-bar** (new row) | _new_ `StudioSubBar` replacing `StudioHeader` | 1 | Doc-type tabs · title block · saved/versions · undo/redo/history · template pill · Tailor split · Export split. |
| **Left rail tabs** (Files / Knowledge / Jobs) | `StudioFilePanel` + new tabs | 2 | Files keeps current panel. Knowledge = profile-bank items, drag-to-canvas + "in doc" dot. Jobs = opportunities. |
| **Canvas editor** | `ResumePreview` | 3 | Wrap in v3 canvas frame: page-chrome footer (page count · word count), WYSIWYG / LaTeX toggle (LaTeX = stub). |
| **AI rail tabs** (Chat / Suggestions) | `AiAssistantPanel` | 4 | Split into Chat (conversation + model pill + input) and Suggestions (cover-letter critique, ATS, etc.) with badge. |

## Handler routing for the sub-bar split-buttons

| Split-button menu item | Wired to | Notes |
|---|---|---|
| Tailor → **AI tailor** | existing `/api/tailor` flow (today: button in `AiAssistantPanel` at `ai-assistant-panel.tsx:758`) | Lift trigger to sub-bar; keep inline AI panel button for now during transition. |
| Tailor → **Manual tailor** | _stub_ — toast "Coming soon: deterministic assembly from selected sections" | Future: `generateFromBank` without LLM. |
| Tailor → **Tailor settings…** | _stub_ — toast or no-op | Future settings dialog. |
| Export → **PDF** | `studio.handleDownloadPdf` | ✓ exists |
| Export → **DOCX** | `studio.handleDownloadDocx` | ✓ exists |
| Export → **LaTeX (.tex)** | _stub_ — toast "Coming soon" | New endpoint needed. |
| Export → **Plain text** | _stub_ or `handleCopyHtml` → strip | Could do client-side strip; minimal effort. |
| Export → **Share link** | _stub_ — toast "Coming soon" | New endpoint needed. |
| Undo / Redo | Tiptap editor instance | Need to expose editor commands through `useStudioPageState` or via ref. Currently the editor lives inside `ResumePreview`. |
| Version history icon | existing `versions` UI | Sub-bar button opens the existing `VersionHistorySection`. Could just scroll/focus the section in left rail. |
| Template pill | `studio.handleTemplateSelect` | ✓ exists; pill opens existing template menu. |
| Doc title pencil | `studio.handleRenameDocument` | ✓ exists; inline contenteditable + commit on blur/Enter. |

## State additions

Most of v3's state already exists in `useStudioPageState`. New additions:

- `editorMode: "wysiwyg" | "latex"` — sub-bar/canvas toggle. LaTeX renders a stub pane.
- `wordCount: number` — derived from `content` (Tiptap JSON). Compute in canvas footer, no state needed.
- `pageCount: number` — read from rendered preview. May need a `usePageCount` hook reading from the print layout DOM.
- `leftRailTab: "files" | "knowledge" | "jobs"` — replaces the implicit "files only" mode.
- `aiRailTab: "chat" | "suggestions"` — replaces the implicit single-pane assistant.
- `suggestionsCount: number` — derived from `coverLetterCritique` + any future ATS suggestion count.

## Phase order + acceptance

### Phase 1 — Studio sub-bar
- New `apps/web/src/components/studio/studio-sub-bar.tsx`.
- `StudioHeader` becomes the export+template-only fallback for non-sub-bar contexts, OR is replaced outright. Decision: **replace**. Migration: move template menu + export menu logic into sub-bar; delete `StudioHeader`.
- Tests:
  - sub-bar renders with `documentMode="resume"`, tab highlights resume.
  - clicking "Cover letter" calls `setDocumentMode("cover")`.
  - Tailor split opens menu; "AI tailor" calls the tailor handler.
  - Export split items call correct handlers.
- Acceptance: `pnpm run type-check`, `pnpm run lint`, full vitest pass. UI verified at `localhost:3000/studio`.

### Phase 2 — Left rail tabs
- New `apps/web/src/components/studio/studio-left-rail.tsx` wrapping `StudioFilePanel`.
- Tab switcher (Files / Knowledge / Jobs) with `t-count` badges.
- Knowledge tab reuses profile-bank query; "in doc" dot from `selectedIds`.
- Jobs tab reuses opportunities query; click → set `linkedOpportunityId`.
- Acceptance: same as Phase 1.

### Phase 3 — Canvas chrome
- Wrap `ResumePreview` body in `<div class="canvas-stage">` and add footer with page · word count.
- Editor-mode toggle (WYSIWYG / LaTeX) at the top of the canvas. LaTeX pane = stub showing "Coming soon — raw LaTeX source export will live here".
- Acceptance: same.

### Phase 4 — AI rail tabs
- `AiAssistantPanel` → tabbed shell with two panes.
- Chat: conversation list + input footer with model pill.
- Suggestions: existing cover-letter critique + ATS section, plus tag-style "apply / dismiss" actions.
- Acceptance: same.

## Tokens / styles

All v3 chrome uses the editorial tokens already in `globals.css`:
- Sub-bar surface: `bg-page` + 1px `border-rule`.
- Split-button menus: `bg-paper` + `shadow-paper-elevated` + `border-rule`.
- Active tab underline: `border-brand`.
- Caption mono (saved / page-stat): `font-mono uppercase tracking-[0.16em] text-ink-3`.

Do **not** introduce raw hex / `bg-white` / `bg-black`. The forbidden-color lint
will block.

## Open questions deferred to implementation

- Undo / redo: cleanest is to expose the Tiptap editor instance via a context
  provider so the sub-bar can call `editor.commands.undo()`. Add in Phase 1.
- Page count: render-pass-dependent. Use a `MutationObserver` on the preview
  DOM, or count `[data-page-break]` markers. Decide in Phase 3.
- LaTeX export: out of scope for this port. Keep the toggle so the chrome
  matches v3 but render a clearly-stubbed placeholder.
