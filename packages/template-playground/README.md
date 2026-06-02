# @slothing/template-playground

Dev-only standalone harness for the resume-template render pipeline.
**Not shipped** — see `docs/resume-template-cloning-spec.md` §7 / §11.

```bash
pnpm --filter @slothing/template-playground dev   # http://localhost:5180
```

Imports the render pipeline straight from TS source via the workspace
(`@slothing/shared/resume-template`) — no build step, full Chrome devtools, hot reload.

**Now (Phase 3 — manual-verify milestone):** three panes — the dropped **original PDF**,
our **HTML** render, and our live in-browser **Typeset** render (Typst → WASM → PDF) of the
same template definition, so original ↔ HTML ↔ Typeset drift is tunable. Drop a PDF and the
real clone pipeline runs: **XMP self-import** (lossless RDM restore) when present, else
**deterministic fingerprint** (pre-selects + pre-tunes a template, with per-axis confidence)
plus **OpenResume content extraction** drafting the RDM. Then nudge the full grammar
(accent / font / columns / header / section-title / bullets / density), switch templates, and
toggle the engine. Everything runs client-side — no server (spec §6 / §7).

**Next:** Phase 4 folds this preview+nudge+accept loop into the Studio import dialog.
