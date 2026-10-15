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
| 5b | The resume you send (below) | Done |
| 5c | Other sections (certifications, awards…), promotions, dates column, template presets; version history | Done |
| 6 | Use it: ~10 real applications, keeping `FRICTION.md` | Next |

### Step 5b: the resume you send (from the first look at real output)

The PDF is the product, and the first real import showed it falling short of the resume it came from.

- **Import keeps what's on the page.** Projects split into name + tools ("Trailmap | Python | React" →
  name Trailmap, tools Python, React). Hyperlinks are matched to the line they sit on, so roles, projects
  and contact links keep their URLs. Contact links get a label ("Portfolio" → its URL), and a link
  without a URL is plain text in the header ("Open to relocation").
- **Resume design** in Settings, with a live preview: font (bundled, so every machine renders the same),
  size, spacing, margins, accent color, header (left or centered), section headings, entry style
  (one line or two), bullet character, link icons. Presets to start from: Classic, LaTeX, Modern.
  The cover letter shares the font, accent and header.
- **Entry rows say less.** Title on the first line, details on the second. Pin and hide show only when
  set; every action (pin, hide, move, remove) is in one menu per row.

Not in 5b: a template gallery, uploaded templates, rich text, two-column layouts.

Iteration 1 ends when step 6 is done. Nothing from the lists below starts before then.

## Iteration 2: capture and polish (candidates, gated by the friction log)

Built overnight on 2026-10-15 ahead of the friction log, at Kevin's request: keyword gap, reword this
bullet, import a job from its URL (see `OVERNIGHT-REPORT.md`). The extension is not started.

- **Extension: job capture.** One click on a posting sends it to v2 on localhost. Ports v1's
  LinkedIn / Greenhouse / Lever / generic JSON-LD scrapers. No autofill.
- **Import a job from its URL.** A link field in "Add job" (one form for a link, a pasted description or both), using the same JSON-LD parser.
  It may make the extension unnecessary.
- **Keyword gap.** On the job page, above the resume editor: chips for the job's key terms.
  A term in your profile but not on this resume is clickable and shows the profile bullets that
  have it, ready to add. A term not in your profile at all is grey, because grounding means it
  can't be added, only noticed. The fitter's scorer already computes the terms.
- **Reword this bullet.** In the ⋯ menu of each bullet on a job's resume: "Reword with AI".
  Two or three alternatives appear under the bullet, citing the same source, with an optional
  hint ("shorter", "lead with the result"). Pick one or dismiss. Not on Profile: the profile is
  your own words, and rewording it with AI would blur what the AI is grounded against.

## Iteration 3: self-hosting (others can run it with their own data and keys)

The data is already one SQLite file (`SLOTHING_DATA_DIR`) and the keys are already the user's own,
so this is mostly packaging. In order, each step only if the one before falls short:

1. **Docker image.** One `docker run` with a volume for the data folder and Typst baked in. Keys
   come from env vars, as now. *Written (`Dockerfile`, `docker-compose.yml`), not yet built in Docker.*
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
