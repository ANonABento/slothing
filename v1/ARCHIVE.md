# Slothing v1 — archived

This folder is the original Slothing monorepo (Jan–Aug 2026, ~1,100 commits), frozen as a
reference. It is not built, tested, or deployed. Active development lives in `../v2`.

Useful things to borrow from here when v2 grows:

- `apps/web/src/lib/llm/` — multi-provider LLM client
- `apps/web/src/lib/latex/` — sandboxed Tectonic compile + `slothing.sty`
- `apps/web/src/lib/parse*/` — resume parsing
- `packages/shared/` — Zod schemas, scoring
- `apps/web/src/app/globals.css` + `tailwind.config.ts` — editorial design tokens
- `apps/extension/` — browser extension + job scrapers
- `docs/product-viability-roadmap.md` — anti-fabrication lessons

To run it, `cd v1` and follow `v1/README.md` (pnpm workspace).
