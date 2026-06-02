# @slothing/template-playground

Dev-only standalone harness for the resume-template render pipeline.
**Not shipped** — see `docs/resume-template-cloning-spec.md` §7 / §11.

```bash
pnpm --filter @slothing/template-playground dev   # http://localhost:5180
```

Imports the render pipeline straight from TS source via the workspace
(`@slothing/shared/resume-template`) — no build step, full Chrome devtools, hot reload.

**Phase 1 (now):** pick a template + sample/edge-case resume, nudge the full grammar
(accent / font / columns / header / section-title / bullets / density), and see the **real**
`renderHtml` and live in-browser `renderTypeset` (Typst → WASM → PDF) render **side-by-side**
so HTML vs Typeset drift is tunable. The Typst compiler + renderer WASM run client-side — no
server (spec §6 / §7).

**Roadmap:** Phase 3 adds the original-PDF drag-drop into a third pane (clone-target
comparison) and folds this preview+nudge loop into the Studio import dialog (Phase 4).
