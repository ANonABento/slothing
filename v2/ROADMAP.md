# Slothing v2 roadmap

v2 grows only when the core loop (profile → job → tailor → PDF) needs it. A feature ships when real
use asks for it: it should fix friction logged at least twice in `FRICTION.md`, fit the loop, and
replace something where it can. Planned pages appear in the sidebar as placeholders
(`src/lib/roadmap.ts`) so the shape of the app stays visible. A placeholder is deleted when its page
ships or the idea is dropped.

## Iteration 1: the core loop (now)

| # | Step | Status |
|---|------|--------|
| 1 | Commit the UI shell | Done |
| 2 | Typst as the only PDF engine | Done |
| 3 | Settings: model, tailoring level, instructions, layout, letter length | Done |
| 4 | Profile ranking: pin / normal / hide and order on entries and bullets | Done |
| 5 | Tailoring without AI + fit to exactly one page (the AI path goes through the same fitter) | Done |
| 6 | Use it: ~10 real applications, keeping `FRICTION.md` | Next |

Iteration 1 ends when step 6 is done. Nothing from the lists below starts before then.

## Iteration 2: capture (candidates, gated by the friction log)

- **Extension: job capture.** One click on a posting sends it to v2 on localhost. Ports v1's
  LinkedIn / Greenhouse / Lever / generic JSON-LD scrapers. No autofill.
- **Import a job from its URL.** A paste-a-link box on the Jobs page, using the same JSON-LD parser.
  It may make the extension unnecessary.
- **Keyword gap.** Job keywords that are in your profile but missing from the tailored resume.
  The fitter's scorer computes these anyway.

## Iteration 3: self-hosting (others can run it with their own data and keys)

The data is already one SQLite file (`SLOTHING_DATA_DIR`) and the keys are already the user's own,
so this is mostly packaging. In order, each step only if the one before falls short:

1. **Docker image.** One `docker run` with a volume for the data folder and Typst baked in. Keys
   come from env vars, as now.
2. **Keys in Settings.** Entered in the app and stored locally, so a user never edits `.env.local`.
   Env vars still win when set.
3. **Backup and restore.** Download the database file from Settings and load it back.
4. **Desktop app** (Tauri or Electron around the same server) if Docker is too much for the
   people using it.

Not planned: a hosted multi-user version. That brings back auth, `user_id` and billing.

## Later (maybe, each needs its own case)

- **Templates.** A gallery once a second Typst resume + letter pair exists.
- **Follow-ups.** Applied date, plus a nudge when nothing has happened in N days.
- **Answer bank.** Saved answers to application questions. Mostly valuable alongside autofill.
- **Interview prep.** Likely questions from the job description and your profile.
- **Insights.** Funnel counts: saved → applied → interview → offer.
- **Company research.** A notes panel on the job page, not its own page.
- **Document history.** Earlier versions of a job's resume and letter, so a re-tailor can be undone.
  Each job already keeps its latest pair, so the Jobs list is the history today.

## v1 pages and where they went

| v1 page | v2 |
|---|---|
| Opportunities, Jobs, Review queue | **Jobs** (shipped). The review queue needs scrapers, so not planned. |
| Opportunity detail, Tailor, Studio, Builder, Cover letter, Documents | **Job page**: resume + cover letter editors with live preview (shipped) |
| Bank, Components, Upload, Profile | **Profile**, with import (shipped) |
| Settings | **Settings** (shipped) |
| Extension connect | **Extension** (Iteration 2, capture only) |
| ATS scanner | **Keyword gap** on the job page (Iteration 2) |
| Templates (custom upload) | **Templates** (later, in-repo Typst only, no uploads) |
| Calendar, reminders | **Follow-ups** (later) |
| Answer bank, Answers | **Answer bank** (later) |
| Interview | **Interview prep** (later) |
| Dashboard, Analytics | **Insights** (later) |
| Company research | **Job page panel** (later) |
| Studio TeX editor, Toolkit, Application drafts | Not planned: replaced by the structured editors |
| Salary, Emails (Gmail), Google integrations | Not planned |
| Marketing, pricing, blog, auth, billing, i18n | Not planned: single local user |
