# Slothing — AI agent instructions

Active app is `v2/` (Next.js 15 App Router + React 19 + Tailwind 3 + better-sqlite3 + Zod, npm).
`v1/` is a frozen archive. Read it for reference and port code deliberately, but never edit it.

## Principles for v2

- **Stay small.** v2 exists because v1 grew to 300k LOC, 55 tables, and 4 competing render paths.
  Add a feature only when the core loop (profile → job → tailor → PDF) needs it. When
  something replaces something else, delete the old one in the same change.
- **Grounding is non-negotiable.** Tailored output references profile ids; identity fields
  come from the profile only. Every path that writes a resume goes through `groundResume`.
- **One tailoring system.** AI and no-AI drafts both go through `fitResume` (`src/lib/fit.ts`),
  which only selects and orders. Don't add a second path that builds resumes differently.
- Single local user, no auth. Don't add `user_id` plumbing until there is a second user.

## Commands (from `v2/`)

```bash
npm run dev        # :3000
npm run typecheck
npm test           # vitest; render tests skip if typst is missing
npm run engines    # fetch typst into .engines/
```

## Conventions

- Colors only via tokens in `src/app/globals.css` / `tailwind.config.ts` (`bg-paper`, `text-ink`, `text-brand`, …).
  No raw Tailwind palette colors (`bg-white`, `text-gray-500`).
- Headings: `font-display tracking-tight`. Eyebrows: `<Eyebrow>` (mono, uppercase).
- Every page starts with `<PageHeader>`. Its bottom rule must line up exactly with the sidebar brand row's
  (both are `--bar-h` tall with the border inside), so the two lines read as one.
- Mutations are server actions in `src/app/actions.ts` returning `Result`.
- PDFs are rendered with Typst only (`src/lib/render/typst.ts`). Templates read `ResolvedResume` /
  `ResolvedLetter` as JSON. A resume template and its letter template share one header style.
- Resume design is data, not templates: `ResumeStyle` in `src/lib/types.ts` (font, size, spacing, accent,
  header, entry style…) drives the one Typst template. New looks are presets (`STYLE_PRESETS`).
- Fonts are bundled in `.engines/fonts` (`npm run engines`) and Typst runs with `--ignore-system-fonts`,
  so a resume lays out identically everywhere (the fitter depends on it).
