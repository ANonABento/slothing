# Slothing v2

> You're not lazy. Your job search system is.

A deliberately small rebuild of Slothing. One loop, done well:

1. **Profile**: import your resume once and edit it as structured entries.
2. **Jobs**: paste a job description and track its status.
3. **Tailor**: AI picks and rephrases from your profile. It never adds to it (see *Grounding* below).
4. **Cover letter**: drafted from your profile and the job description.
5. **PDF**: rendered by three swappable engines (HTML/Chrome, Typst, LaTeX) so you can compare them side by side.

Single user, local SQLite, no auth.

## Setup

```bash
cd v2
npm install
npm run engines            # downloads typst + tectonic into .engines/ (HTML engine uses your Chrome)
cp .env.example .env.local # add NEBIUS_API_KEY, ANTHROPIC_API_KEY or OPENAI_API_KEY
npm run dev                # http://localhost:3000
```

Data lives in `v2/data/slothing.db` (override with `SLOTHING_DATA_DIR`). The first LaTeX render downloads the TeX bundle, so it takes a while.

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
src/lib/db.ts        better-sqlite3, 3 tables (profile, jobs, documents)
src/lib/llm.ts       Anthropic / OpenAI-compatible JSON client
src/lib/import.ts    PDF/DOCX/text → Profile
src/lib/tailor.ts    grounded tailoring + cover letter
src/lib/resolve.ts   tailored doc + profile → render-ready shape
src/lib/render/      html.ts, typst.ts, latex.ts → renderPdf(engine, input)
src/app/actions.ts   server actions
src/app/api/pdf      GET ?engine=&kind=&job=&download=&source=
```

## Not in v1 (on purpose)

Browser extension, scrapers, auth/multi-user, Google integrations, interview prep, salary,
ATS scanner, analytics, email, billing, i18n, extra themes. The archived app in `../v1` has
working versions of most of these to borrow from once the core loop is solid.
