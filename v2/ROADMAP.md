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
bullet, import a job from its URL. On 2026-10-16, also at his request, the extension and the answer bank
(he counts both as core: applying is part of the loop). See `OVERNIGHT-REPORT.md`.

- **Extension** *(built; side panel since 2026-10-16)*. Click the icon for a panel beside the page that
  follows your tab. Every page is classified locally (posting / form / sign-in) and shown as the badge.
  Postings you open are recorded as **Seen** (Jobs → Seen: a history, and "seen before" when you
  return; structured data only, never AI). From the panel: **Save**, **Tailor**, **Write cover letter** (each then shows its PDF and what to check
  before sending), **Fill form** (profile,
  answer bank, tailored PDFs; never submits), **Save my answers**, and **applied** is recorded when you
  submit a form it filled (answers + resume version, on the job page). Matching lives in
  `src/lib/autofill.ts`; the extension only reads and writes the page. Chrome only.
  v1 had a field-mapping store, a learning loop and per-site multistep drivers: none ported.
- **Answer bank** *(built)*. Saved answers to application questions, matched to a form's wording by
  terms, not text. A draft from your profile on request (AI), checked like a letter plus one check letters
  don't have yet: a key term of the posting your profile never uses.
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

## Next up (planned 2026-10-17, not started)

From "what's still missing" and a look at similar tools (Simplify, Teal, Huntr, Jobscan; self-hosted
job-ops and JobSync). Slothing already covers what they do, except a fit score, follow-ups,
local models and Workday. Bulk auto-apply, job discovery/alerts, contacts, Kanban and LinkedIn
optimization are **not planned**: each is another product, and auto-apply works against grounding.

Order: **A → B → C → E → F**, with **D** (real use) running alongside. E was gated on the friction log;
Kevin chose to build it now (2026-10-17).

### A. Housekeeping (no features)

1. **Commit** what's waiting, as three commits: panel shows tailoring results + Write cover letter;
   keys in Settings; migration race fix.
2. **Real-browser checks** (Kevin; headless can't do these). Each result goes in `FRICTION.md`:
   - Clicking the toolbar icon opens the side panel and it follows tab switches.
   - The panel after Tailor and Write cover letter: warnings readable, View PDF opens.
   - LinkedIn while logged in: a posting badges as New/Seen, Save job reads the description.
   - A Workday apply flow: Fill on each step (tells us whether F is needed).
3. **Docker.** Docker isn't installed on this Mac (OrbStack or Docker Desktop is needed). Then
   `docker compose up --build` on a copy of the data. Pass: a resume PDF renders with the same page
   count as `npm run dev`, a key saved in Settings survives a container restart, and the Extension
   page connects. Fix what breaks. Keep the README's Docker section only if it passes.

### B. Local models (Ollama, LM Studio) — done 2026-10-17

Today a local endpoint can't be used: `resolveLlm` only picks a provider with a key, and Ollama has
none. Ollama is running on this Mac (`qwen3.5:4b`), so this can be tested for real.

- `llm.ts`: the OpenAI provider counts as configured without a key when its endpoint is on this
  machine (`localhost`, `127.0.0.1`, `[::1]`, `host.docker.internal`). No `Authorization` header then.
  Labelled "Local (OpenAI-compatible)".
- **JSON mode fallback:** some servers reject `response_format: json_object` (LM Studio wants
  `json_schema`). On a 400 that names `response_format`, retry once without it. `extractJSON` and
  the existing retry already cope with loose output.
- **Timeout:** 5 min for a local endpoint (a 4B model on a laptop is slow), 2 min otherwise.
- **Settings:** under the endpoint field, "Ollama: http://localhost:11434/v1 · LM Studio:
  http://localhost:1234/v1 · no key needed". README: from Docker, use `host.docker.internal`.
- **Tests:** a local endpoint with no key resolves; a remote endpoint with no key doesn't; the JSON-mode retry.
- **Checked** with `qwen3.5:4b` on a copy of the data: import, AI tailoring and a letter all worked
  (the letter took ~2.5 min). Grounding dropped one made-up bullet and flagged three uses of the
  posting's "systems". A blank model uses the first one the server lists; `<think>` blocks are stripped.
- ~60 lines. No new settings, no model downloads from the app.

### C. Fit score on postings (no AI) — done 2026-10-17

Answers "is this worth applying to?" before you save or tailor. It reuses the keyword gap's
machinery: the posting's key terms (`keyTerms`), split into the ones your profile has and the ones
it doesn't (`hasTerm` / `spelledAs` over the whole profile, hidden items included).

- **Shown as a band plus counts, not a percentage** (LinkedIn's "N of M skills" style, which shows its
  evidence; Jobscan's and Jobright's percentages look more precise than a term count is): "Strong fit · 14 of 18 key terms", "Partial",
  "Weak", plus up to 3 missing terms ("Missing: Kubernetes, Terraform"). The missing side is the
  noisiest (leftover boilerplate, place names), so a percentage would look more exact than it is.
  Bands (strong ≥ 55% of key terms, partial ≥ 30%) were tuned on only 4 saved postings: retune after
  real use. Calibrating also dropped words nobody can act on from key terms (internship, co-op, summer,
  student, USA, NYC, "e.g."), which cleans up the keyword gap too.
- **`gap.ts`:** `fitOf(profile, job)` returns `{ band, have, total, missing[] }`, or `null` without a
  description (LinkedIn seen in passing). Pure and unit-tested. Computed when shown, never stored, so it
  never goes stale when the profile changes. Hundreds of jobs are fine; the profile text is built once.
- **Where it shows:**
  - Jobs list: a chip on each row; in Seen, a "Best fit" sort next to "Recent".
  - Panel: under the posting's title, before Save (`JobSummary.fit`).
  - Job page: the band in the keyword gap's header, which already lists the terms.
- **Not:** LLM ranking (job-ops does it, but it costs a call per posting you open), weights per
  term, a "should I apply" verdict.
- ~150 lines with tests.

### D. Use it (Iteration 1, step 6)

Ten real applications, with `FRICTION.md` kept as you go. This decides whether E and F happen. Do it
alongside B and C, not after them.

### E. Follow-ups

- **Applied date, one source:** the `applications` table. Setting the status to Applied by hand
  records an application too (no answers), like the panel's Mark applied, so every applied job has a
  date.
- **`jobs.follow_up_at`** (nullable): set when a job is applied (applied + 7 days). Cleared when the
  status moves on (interviewing, offer, rejected, archived). Snooze (+3 days, +1 week) and Done.
- **Jobs page:** a "Follow up" card at the top when any are due: company · role · "applied 9 days
  ago", with Copy follow-up note (a template filled from the job and profile, no AI), Snooze, and
  Got a reply → Interviewing / Rejected. The Jobs count in the sidebar shows how many are due. Applied
  rows say "Applied 9d" instead of "updated".
- Ships by deleting the Follow-ups placeholder in `src/lib/roadmap.ts`. Not included: email or
  calendar integration, notifications, an AI-written follow-up.

### F. Fill works on any application site (after B, C, E)

Kevin: it should work on all kinds of sites, not only Workday. So it isn't a Workday driver: it's
handling the custom widgets application sites are built from, by what they are (ARIA roles, the
visible label), and then a pass over each major platform with fixes where it falls short. No
per-site scripts unless a site can't be handled any other way.

1. **Widgets, generically** (`extension/src/page.ts`):
   - Comboboxes and listboxes by ARIA role (`role=combobox`/`listbox`/`option`, `aria-haspopup`):
     open them, type to filter, pick the matching option. Greenhouse's react-select and Lever's
     location search are special cases of this today.
   - Button groups (Yes/No as buttons) and `role=radio`/`role=switch`/`role=checkbox` that aren't inputs.
   - Split dates (month/year selects or spinbuttons) and date pickers with a typed input.
   - `contenteditable` text areas.
   - Repeaters ("Add another" for roles and education): fill the ones there; adding rows only
     where the platform has no resume parser (below).
2. **Platforms, one at a time.** On each: fill a real form up to Review without submitting, then log
   what was missed. Workday (multi-step; attach the PDF first so its parser fills My Experience, and
   the panel notices a new step even when the URL doesn't change), iCIMS (often an iframe), SmartRecruiters,
   Workable, Taleo / Oracle Recruiting, SuccessFactors, Jobvite, BambooHR, Rippling, LinkedIn Easy Apply (a modal
   with steps), Indeed Apply, and a company's own form.
3. **Never:** submit, create accounts, enter passwords, solve CAPTCHAs. Sign-in stays yours.
4. **Pass:** a table in `FRICTION.md` per platform with fields filled / left, and no wrong value in a
   field (a wrong value is worse than an empty one).

## Iteration 3: self-hosting (others can run it with their own data and keys)

The data is already one SQLite file (`SLOTHING_DATA_DIR`) and the keys are already the user's own,
so this is mostly packaging. In order, each step only if the one before falls short:

1. **Docker image.** One `docker run` with a volume for the data folder and Typst baked in. Keys
   come from env vars, as now. *Written (`Dockerfile`, `docker-compose.yml`), not yet built in Docker.*
2. **Keys in Settings.** Entered in the app and stored locally, so a user never edits `.env.local`.
   Env vars still win when set. *Done 2026-10-17 (pulled forward: a fresh start stalled on it).*
3. **Backup and restore.** Download the database file from Settings and load it back.
4. **Desktop app** (Tauri or Electron around the same server) if Docker is too much for the
   people using it.

Not planned: a hosted multi-user version. That brings back auth, `user_id` and billing.

## Later (maybe, each needs its own case)

- **Agent apply.** An agent drives the same steps the panel does (detect → import → tailor → fill →
  review), with submit still yours to approve. The extension's API is already one call per step and
  every application is recorded, which is what an agent needs. Not before the human-in-the-loop version
  has been used for real.

- **Follow-ups.** Applied date, plus a nudge when nothing has happened in N days.
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
| Extension connect, extension | **Extension** (shipped: save job, fill form, save answers) |
| ATS scanner | **Keyword gap** on the job page (Iteration 2) |
| Templates (custom upload) | Not planned: Resume design in Settings (presets + every style setting) replaced it |
| Calendar, reminders | **Follow-ups** (later) |
| Answer bank, Answers | **Answer bank** (shipped) |
| Interview | **Interview prep** (later) |
| Dashboard, Analytics | **Insights** (later) |
| Company research | **Job page panel** (later) |
| Studio TeX editor, Toolkit, Application drafts | Not planned: replaced by the structured editors |
| Salary, Emails (Gmail), Google integrations | Not planned |
| Marketing, pricing, blog, auth, billing, i18n | Not planned: single local user |
