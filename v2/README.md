# Slothing v2

> You're not lazy. Your job search system is.

A deliberately small rebuild of Slothing. One loop, done well:

1. **Profile**: import your resume once and edit it as structured entries.
2. **Jobs**: paste a job description and track its status.
3. **Tailor**: AI picks and rephrases from your profile. It never adds to it (see *Grounding* below).
4. **Cover letter**: drafted from your profile and the job description.
5. **PDF**: rendered with Typst.

Single user, local SQLite, no auth.

## Setup

```bash
cd v2
npm install
npm run engines            # downloads typst into .engines/
cp .env.example .env.local # add NEBIUS_API_KEY, ANTHROPIC_API_KEY or OPENAI_API_KEY
npm run dev                # http://localhost:3000
npm run v1                 # optional: the archived v1 app on http://localhost:3100, for comparison
```

Data lives in `v2/data/slothing.db` (override with `SLOTHING_DATA_DIR`).

## Grounding

A tailored resume never restates company, title, dates, or school. It references profile
entries by id, and each bullet cites the profile bullet(s) it came from. On every AI result
*and* every manual save, `src/lib/tailor.ts → groundResume`:

- drops entries that aren't in the profile
- drops bullets that cite nothing, or cite another entry's bullets
- drops skills that aren't already in the profile
- flags any number (40%, $2M, 12…) that isn't in the cited source

Warnings are shown above the editor and stored with the document.

## Layout

```
src/lib/types.ts     Zod schemas: Profile, TailoredResume, CoverLetter
src/lib/db.ts        better-sqlite3, 4 tables (profile, settings, jobs, documents)
src/lib/llm.ts       Anthropic / OpenAI-compatible JSON client; provider + model from Settings, keys from env
src/lib/import.ts    PDF/DOCX/text → Profile
src/lib/tailor.ts    grounded tailoring + cover letter
src/lib/resolve.ts   tailored doc + profile → render-ready shape
src/lib/render/      typst.ts templates → renderPdf(input)
src/app/actions.ts   server actions
src/app/api/pdf      GET ?kind=&job=&download=&source=
```

## Roadmap

What's next, what each v1 page became, and when planned pages get built: see [ROADMAP.md](ROADMAP.md).
Planned pages show in the sidebar as placeholders (`src/lib/roadmap.ts`).
