# @slothing/template-playground

Dev-only standalone harness for the resume-template render pipeline.
**Not shipped** — see `docs/resume-template-cloning-spec.md` §7 / §11.

```bash
pnpm --filter @slothing/template-playground dev   # http://localhost:5180
```

Imports the render pipeline straight from TS source via the workspace
(`@slothing/shared/resume-template`) — no build step, full Chrome devtools, hot reload.

**Phase 0 (now):** pick a template + sample resume, nudge tokens (accent / font / density),
see the `stubRenderHtml` placeholder render live.

**Roadmap:** Phase 1 swaps in the real `renderHtml` / `renderTypeset` adapters; Phase 3 adds
the original-PDF drag-drop side-by-side and the HTML / Typeset (Typst WASM) engine toggle.
