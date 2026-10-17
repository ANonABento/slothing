# Slothing v2

> You're not lazy. Your job search system is.

A deliberately small rebuild of Slothing. One loop, done well:

1. **Profile**: import your resume once and edit it as structured entries.
2. **Jobs**: paste a job description and track its status.
3. **Tailor**: with AI, or without it by relevance scoring. Either way the result is fitted to your page
   length on the real layout and never adds to your profile (see *Grounding* below).
4. **Cover letter**: drafted from your profile and the job description.
5. **PDF**: rendered with Typst.
6. **Apply**: the browser extension notices postings as you browse (your history, under Jobs → Seen),
   saves and tailors from a side panel, fills application forms from your profile and your **answer
   bank** with the tailored PDF attached, and records what you sent when you submit.

Single user, local SQLite, no auth.

## Setup

```bash
cd v2
npm install
npm run engines            # downloads typst and the resume fonts into .engines/
npm run dev                # http://localhost:3000, then paste an AI key in Settings → AI model
npm run v1                 # optional: the archived v1 app on http://localhost:3100, for comparison
```

Data lives in `v2/data/slothing.db` (override with `SLOTHING_DATA_DIR`), and so do keys entered in Settings.
Keys can also come from the environment (`cp .env.example .env.local`), which wins when both are set.
A model on your own machine (Ollama, LM Studio) needs no key: Settings → AI model → use Ollama. From Docker,
the endpoint is `http://host.docker.internal:11434/v1`.

### Browser extension (Chrome)

```bash
npm run extension          # builds extension/dist (add -- --watch while working on it)
```

Then `chrome://extensions` → Developer mode → Load unpacked → `v2/extension/dist`, and click
**Connect extension** on the app's Extension page. After rebuilding, press reload on the extension card
(Chrome keeps running the old background worker otherwise).

Click the icon to open a side panel that follows your tab. On every page the extension classifies
locally (posting, application form, sign-in) and shows it as the icon's badge: **New** / **Seen**
(a posting, recorded under Jobs → Seen), **✓** (in your jobs), **Fill** (a form), **Sent** (applied).
Only postings are sent to the app, and only to this app (a key from the Extension page; no CORS, so
websites can't read the API). Turn off recording on the Extension page.

### With Docker

```bash
cd v2
docker compose up --build    # http://localhost:3000, then paste an AI key in Settings → AI model
```

Typst and the fonts are baked into the image. Your data is `v2/data/` on the host (mounted at `/data`),
the same folder `npm run dev` uses. The container runs as uid 1000; on Linux, make sure that user can
write `v2/data/`.

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
src/lib/db.ts        better-sqlite3: profile, settings, jobs, documents (+ versions), answers, kv
src/lib/llm.ts       Anthropic / OpenAI-compatible JSON client; provider + model from Settings, keys from env
src/lib/import.ts    PDF/DOCX/text → Profile
src/lib/tailor.ts    grounded AI tailoring + cover letter
src/lib/score.ts     job-relevance scoring (no AI)
src/lib/fit.ts       fills the page limit with the best bullets, measured on the real Typst layout
src/lib/resolve.ts   tailored doc + profile → render-ready shape
src/lib/render/      typst.ts templates → renderPdf(input)
src/app/actions.ts   server actions
src/lib/answers.ts   answer bank matching: question similarity, option picking
src/lib/autofill.ts  what goes in each form field (profile, bank, PDF), what to save back
src/lib/extension.ts the extension's API: key, job for a URL, fill / draft / save
src/app/api/pdf      GET ?kind=&job=&download=&source=
src/app/api/extension/[op]  POST, for the extension only (needs its key)
extension/           Chrome MV3: panel.tsx (side panel, the app's ui.tsx + tokens), watch.ts (classifies
                     every page), background.ts (badge, seen, submit → applied), page.ts (reads/fills forms)
```

## Roadmap

What's next, what each v1 page became, and when planned pages get built: see [ROADMAP.md](ROADMAP.md).
Planned pages show in the sidebar as placeholders (`src/lib/roadmap.ts`).
