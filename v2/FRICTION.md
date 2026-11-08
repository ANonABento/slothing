# Friction log

Step 6 of the roadmap: use v2 for ~10 real applications and write down every moment it gets in
the way. This log decides what gets built next (see `ROADMAP.md`). A feature needs at least two
entries pointing at it.

**Log it when you:** leave the app to do something by hand · retype something the app already
knows · fight an editor · distrust or rewrite the AI's output · wait too long · can't find something.

One line per moment is enough. Tag it so patterns show up: `import` `jobs` `tailor` `fit`
`letter` `pdf` `editor` `settings` `speed` `other`.

## Applications

| # | Date | Company · role | Tailored with | Sent? |
|---|------|----------------|---------------|-------|
| 1 | | | AI / no AI | |

## Friction

| Date | Tag | What happened | What I did instead |
|------|-----|---------------|--------------------|
| | | | |

## Patterns (fill in after ~5 applications)

-

## Agent dogfooding (overnight)

Made-up test profiles on a copy of the data, real public postings. Not Kevin's applications.

| Date | Tag | What happened | What I did instead |
|------|-----|---------------|--------------------|
| 2026-10-15 | speed | AI tailoring (Nebius · DeepSeek-V4.1-Flash) took ~70 s for a 4-role profile; the button just says "Working…" the whole time. | Fixed: the button counts the seconds ("Tailoring… 23 s"), the letter's too. |
| 2026-10-15 | editor | "Replace this resume? … Your edits to this resume will be lost" appears even right after tailoring, with no edits. | Fixed: it only asks when there are unsaved changes or hand edits (resume and letter). |
| 2026-10-15 | jobs | AI-filled title shortened "Community Support Forecasting and Demand Planning Analyst" to "Forecasting and Demand Planning Analyst". | With URL import the posting's own title is used; the AI prompts now say to copy it exactly. |
| 2026-10-15 | letter | Letter header (split style) broke the phone number and LinkedIn URL across lines. | Fixed: `f8650d5b`. |
| 2026-10-15 | tailor | Keyword gap: without AI, grey chips still pick up some posting boilerplate ("state", "hosts", "guests", "Fortune"). | Noise list + thresholds; the rest is the price of no AI. |
| 2026-10-15 | tailor | Keyword gap: tools the posting names only once or twice (SQL, Tableau, ARIMA) didn't show at first. | Fixed before commit: a profile skill counts when named once. |
| 2026-10-15 | tailor | `terms()` folds "processes" to "processe", so "process" and "processes" are separate terms (in the gap and the fitter). | Fixed: -es/-ies plurals, and "status"/"analysis" stay whole (it was why "status" escaped the noise list). |
| 2026-10-15 | import | Name imported as written, ALL CAPS ("MAYA LINDQVIST"), and the resume shows it in caps. | Fixed: a name in capitals is stored as a name ("Maya Lindqvist"); credentials after a comma are kept. |
| 2026-10-15 | other | Browser-automation clicks were often dropped (Add job, Tailor without AI) while a JS `.click()` on the same button worked. | Not an app bug as far as I can tell; used JS clicks. |
| 2026-10-15 | tailor | Keyword gap on a poor match (Benefits Analyst): 15 of 20 chips grey, mostly trademark boilerplate ("Fortune Media", "IP Limited") and places. | Fixed: at most 8 grey chips; the freed slots go to terms you have. |
| 2026-10-15 | speed | Reword with AI takes ~15–20 s per bullet (Nebius DeepSeek). Fine for one bullet, slow for a pass over the whole resume. | Waited. |
| 2026-10-15 | editor | After Save, every entry on the job's resume collapses again (the editor remounts), so you lose your place after each edit. | Fixed: the editor takes the saved version in place instead of remounting. |
| 2026-10-15 | tailor | Reword alternatives sometimes swap a word for the posting's ("volume forecast" → "demand forecast"). Grounded (no new facts or numbers), but a subtle claim change worth a glance. | Used it anyway; worth knowing. |
| 2026-10-15 | jobs | URL import (new): Greenhouse, Airbnb/Stripe career sites, Lever, Ashby and LinkedIn links each imported in ~1 s with the posting's own title, company and location. | — |
| 2026-10-15 | jobs | URL import saved LinkedIn's search link (`/jobs/search/?currentJobId=…&keywords=…`) as the posting link. | Fixed before commit: saved as `/jobs/view/<id>`. |
| 2026-10-15 | jobs | URL import: a failed import cleared the link box, so you had to paste again. | Fixed: `5cc554dd`. |
| 2026-10-15 | jobs | URL import: Workday answered with JSON (we accepted it), giving a wrong "it may be a PDF" error. Workday, Workable and HN still can't be read (JavaScript shells / 419 to server fetches). | Fixed the header and message (`5cc554dd`); paste the description for those. |
| 2026-10-15 | speed | URL import's AI fallback (a page without structured data) took ~35 s for one posting. | Mozilla's pages link their Greenhouse job, so that case now takes 1 s (`d331b6fa`). |
| 2026-10-15 | tailor | **Grounding gap:** the AI summary for the ICU nurse said "experienced in hemodynamic monitoring", which isn't in the profile (it's in the posting). Summaries are only checked for numbers. | Fixed: the posting's key terms are flagged in the summary when the profile never uses them, and in a bullet when its sources don't. |
| 2026-10-15 | letter | **Grounding gap:** the cover letter claimed "hemodynamic monitoring" experience and being "comfortable with a days schedule including weekend and holiday rotation", both lifted from the posting. Only numbers are checked in letters. | Fixed: flagged in sentences about you ("I…", "my…") that aren't about them ("your team"). |
| 2026-10-15 | tailor | Keyword gap: "RN" shows grey for a nurse whose profile says "Registered Nurse" (and RN in the name, which isn't counted). No acronym expansion. | Fixed: an acronym matches its spelled-out form either way; the chip says how your profile spells it. |
| 2026-10-16 | other | Extension, Greenhouse (GitLab, live): every Yes/No question is a searchable dropdown (react-select). First version skipped them and filled react-select's hidden "required" inputs instead. | Fixed (`b193bdad`): dropdowns are filled by opening them like a click (Greenhouse opens on mouse*up*) and picking the matching option. |
| 2026-10-16 | other | Extension, Lever: labels read "Resume/CV ✱ATTACH RESUME/CVCouldn't auto-read resume.Analyzing resume…", hidden status text included. | Fixed: labels are read as displayed, not from a copy of the DOM. |
| 2026-10-16 | other | Extension, Ashby: the form renders after load, so the popup said "no form" when opened right away. Its "Autofill from resume" upload showed as "Overview Application · upload this yourself". | Fixed: the popup keeps looking for ~2 s in the background; resume-parser uploads are ignored. |
| 2026-10-16 | other | Extension, Ashby: Yes/No questions are buttons, and Lever's location is a custom search list. Neither is filled. | Fixed (checked on live Ramp/Ashby and Spotify/Lever forms): toggle-button rows fill like radios; a location that searches as you type gets a result picked (Lever cleared typed text on blur). |
| 2026-10-16 | jobs | Extension Save job on Workday (NVIDIA): read in 0.13 s from the rendered page, but the company was the legal entity "IN02 NVIDIA GraphicsPLtd,Pune". | Fixed: the Workday tenant names the company. |
| 2026-10-16 | pdf | The attached resume was named "Daniel_Okafor,_BSN,_RN,_CCRN_Lakeside_Health.pdf": credentials in the file name a recruiter sees. | Fixed: the name before the first comma. |
| 2026-10-16 | other | Extension drafts (Nebius DeepSeek) took ~2.4 s for two questions and stayed grounded (bed count, years, CRRT all from the profile). | — |
| 2026-10-16 | other | Bugbash: a posting whose form renders late (Greenhouse) was recorded on the first report, then "seen before · today" on the second, seconds later. | Fixed: one record per page; visits within 30 min count as one. |
| 2026-10-16 | other | Bugbash: clicking Submit marked the job applied even when the form refused it (required field empty), and then blocked the real submit from counting. | Fixed: it counts once the page thanks you, the form goes away, or the tab moves on. |
| 2026-10-16 | other | Bugbash: the job picked on one site's form stayed with the tab and was used for a later form on another site. | Fixed: remembered per site. |
| 2026-10-16 | jobs | Bugbash: Add job with the link of a posting already in Seen made a duplicate. | Fixed: opens it (and saves it). |
| 2026-10-16 | other | Bugbash: after reconnecting from the Extension page, an open panel stayed on "Connect" until reopened. | Fixed. |
| 2026-10-17 | tailor | Dogfood as a new user: keyword gap left out tools the posting names once or twice (ClickHouse, Terraform, OpenTelemetry) and showed "Senior", "Engineer". | Fixed: tools in a list or spelled like products count once named; seniority never counts. Checked on 15 Greenhouse postings. |
| 2026-10-17 | tailor | Keyword gap ✓'d "Go" for "you'll go beyond" (8 of 15 real postings had a "go" chip). Also "Fortune Media", "EEO", "never ask" boilerplate. | Fixed: short capitalized skills only match capitalized; legal footnotes and EEO/scam sentences are dropped. |
| 2026-10-17 | letter | Grounding never read spelled-out numbers ("ten engineers"); a letter quoting the posting's "5 billion events" got the same warning as a made-up claim. | Fixed: number words are checked; a posting's number says it's from the posting. |
| 2026-10-17 | editor | "Unsaved changes" bar appeared over the bullet being typed in at the bottom of the screen. | Fixed: the field scrolls above the bar. |
| 2026-10-17 | editor | Warning grammar: "mentions 12, 70%, which isn't". Resume paste box grew past the screen and pushed Parse away. | Fixed: "aren't"; the paste box scrolls after 40% of the screen. |
| 2026-10-17 | other | Fill, live (made-up profile, never submitted): Greenhouse 13 of 17 fields, Lever 11 of 11, Ashby 6 of 15, Workable 12 of 17. Every field left empty was a question with no saved answer, or a choice whose options don't fit the answer (Workable's "Notice period" vs "Two weeks after an offer"). No wrong values. | — |
| 2026-10-17 | other | Fill missed: country dropdowns (Greenhouse "country of residence", Lever's "What is your location?" listing countries); Workable's read-only "Select an option…" dropdowns and its YES/NO radios (role=radio over hidden inputs; the click has to reach the input); "Expected salary" vs a saved "salary expectations"; cover letter and summary text boxes. | Fixed: country from the profile location (US states, Canadian provinces), ARIA radio groups, read-only comboboxes, button dropdowns (aria-haspopup=listbox), contenteditable boxes, the letter's text in a cover-letter box, the profile summary in a summary box, salary and start-date synonyms. |
| 2026-10-17 | other | Couldn't test headless: SmartRecruiters ("Access is temporarily restricted", a bot wall), Recruitee (cookie banner over Apply), Rippling (no open posting found). Workday, iCIMS, Taleo, LinkedIn Easy Apply and Indeed need a signed-in account. | Kevin, in real Chrome. |
| 2026-10-17 | other | Dogfood, new user (made-up backend engineer, empty database, live GitLab posting): import 3 s and exact (roles, bullets, project tools, skills, name in capitals); Add job by link 1 s; AI tailoring 10 s, letter 10 s; panel showed the resume and letter with their checks, filled 7 fields and attached both PDFs; Mark applied recorded the answers and both versions and set a follow-up a week out. | — |
| 2026-10-17 | letter | False alarm: "I am eager to apply my backend fundamentals to Ruby and GraphQL" was flagged as claiming Ruby and GraphQL. | Fixed: sentences about wanting to learn ("eager to apply… to", "new to", "not yet") aren't claims; "excited to bring my Ruby experience" still is. |
| 2026-10-17 | jobs | A new job page said nothing about fit until you tailored (the keyword gap only appears with a resume), so "is this worth it?" had no answer where you decide. | Fixed: the fit shows above Tailor until there's a resume. |
| 2026-10-17 | jobs | Fit read "Weak 3/20" for a backend engineer on a backend posting: word forms missed ("engineering" vs "engineer", "reliability" vs "reliable") and GitLab's own product words fill the rest. | Fixed: fit matches word forms (by first letters, fit only; the gap and grounding stay exact); bands 50% / 25%. Now Partial 5/20. |
| 2026-10-17 | other | Profile preview stays empty after an import until you save, so you can't see the parsed resume before keeping it. | Fixed (2026-11-08): unsaved changes, an import included, are previewed as you go (marked Unsaved). |
| 2026-10-17 | other | Greenhouse pages are a posting and a form at once, so the badge says Fill (not New) on a posting you've never seen. It's still recorded in Seen. | Logged, not changed. |

| 2026-10-18 | other | Insights v1, checked with `npm run seed`: 40 real postings (24 companies' Greenhouse boards, data/analytics analyst roles) with a made-up six-week history. Every count matched the plan as of now, three weeks ago, before the first application (0 applied) and Monday 00:00:00.000 (a save at 23:59:59.999 Sunday counted last week). It also matched the Jobs list and the served page. 4 time zones in tests. | — |
| 2026-10-18 | jobs | The strip said "Seen 40" and the line under it "11 seen": same word, different counts (so far vs now). | Fixed: the line reads "Now: 11 seen · …". |
| 2026-10-18 | jobs | In a new user's first week every cell reads "5 / 5 this week", which says the same thing twice. Honest, a little redundant. | Logged, not changed. |
| 2026-10-18 | other | Dogfood, new user (made-up data analyst, Toronto, empty database, PDF made with Typst): import 8 s, exact (roles, bullets, project tools, links). Selecting the file isn't enough: "Parse resume" is a second click. | Fixed (2026-11-08): picking a file starts the parse; the button stays for pasted text. |
| 2026-10-18 | jobs | Add job with a Lyft link (`app.careerpuck.com/job-board/lyft/job/…?gh_jid=…`): "almost no text on that page". It's a JavaScript shell, but the URL names the board and the job. | Fixed: names in the path are tried as the Greenhouse board. 0.8 s. |
| 2026-10-18 | fit | "Missing: analytics" for a data analyst whose profile says analyst and analysis (six-letter roots split analyt-/analys-). | Fixed: analy- and scien- word families. Lyft went from 7/20 to 9/20. |
| 2026-10-18 | tailor | **Grounding gap:** AI summary said "stakeholder-facing readouts", which isn't in the profile. The keyword gap ticked "stakeholder" and there was no warning: grounding checked the top 20 key terms, the gap shows up to 40. | Fixed: both use the same 40. A re-tailor now flags "stakeholder", "question". |
| 2026-10-18 | letter | False alarm: "I'm interested in applying that experience to ThoughtSpot and its AI features" flagged as claiming ThoughtSpot and AI. | Fixed: "interested in / keen on / looking forward to" + learning/applying aren't claims. The same letter's "analytical models" and "partner with stakeholders" are still flagged (fairly). |
| 2026-10-18 | speed | Letter with AI (Nebius DeepSeek) took 54 s, tailoring 11–14 s. Last dogfood the letter took 10 s. Provider variance, probably. | Waited. |
| 2026-10-18 | other | Extension, live Reddit (Greenhouse): New → Save → Tailor (14 s) → Fill: 7 of 22 fields from the profile, resume attached, nothing wrong. Missed "name of your current (or most recent) company". | Fixed (8 of 22 now): the bracket broke the match. The rest are questions with no saved answer (work authorization, EEO, "how did you hear"). |
| 2026-10-18 | other | Fill filled the company as "Maplecart (grocery delivery)": the resume's own parenthetical, imported into the company name. Not wrong, a bit long for a form. "Preferred First Name" is skipped on purpose. | Fixed (2026-11-08): a trailing parenthetical is left off the company in forms. |
| 2026-10-18 | other | MCP (curl, as an agent): initialize, 9 tools, add_job by Brex link 0.4 s. save_resume refused the first draft because `extras` and `educationIds` were required. | Fixed: optional; education defaults to the profile's. Then a planted draft got every problem caught: a skill not in the profile removed, an invented 45, a bullet with no source dropped, posting words ("business", "Hex") flagged. |
| 2026-10-18 | fit | Noise in fit/gap: "tools" (Brex; also the profile's skill group name), "self" (from self-serve), "DoorDash" (a company the posting names), "business" for most analyst postings. | Fixed "tools" and "self". Company names in a posting and "business" logged, not changed. |
