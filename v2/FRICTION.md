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
| 2026-10-15 | speed | AI tailoring (Nebius · DeepSeek-V4.1-Flash) took ~70 s for a 4-role profile; the button just says "Working…" the whole time. | Waited. |
| 2026-10-15 | editor | "Replace this resume? … Your edits to this resume will be lost" appears even right after tailoring, with no edits. | Clicked Replace. |
| 2026-10-15 | jobs | AI-filled title shortened "Community Support Forecasting and Demand Planning Analyst" to "Forecasting and Demand Planning Analyst". | Left it. With URL import the posting's own title is used. |
| 2026-10-15 | letter | Letter header (split style) broke the phone number and LinkedIn URL across lines. | Fixed: `f8650d5b`. |
| 2026-10-15 | tailor | Keyword gap: without AI, grey chips still pick up some posting boilerplate ("state", "hosts", "guests", "Fortune"). | Noise list + thresholds; the rest is the price of no AI. |
| 2026-10-15 | tailor | Keyword gap: tools the posting names only once or twice (SQL, Tableau, ARIMA) didn't show at first. | Fixed before commit: a profile skill counts when named once. |
| 2026-10-15 | tailor | `terms()` folds "processes" to "processe", so "process" and "processes" are separate terms (in the gap and the fitter). | Logged; plural rules are a rabbit hole. |
| 2026-10-15 | import | Name imported as written, ALL CAPS ("MAYA LINDQVIST"), and the resume shows it in caps. | Left it; debatable whether import should title-case. |
| 2026-10-15 | other | Browser-automation clicks were often dropped (Add job, Tailor without AI) while a JS `.click()` on the same button worked. | Not an app bug as far as I can tell; used JS clicks. |
| 2026-10-15 | tailor | Keyword gap on a poor match (Benefits Analyst): 15 of 20 chips grey, mostly trademark boilerplate ("Fortune Media", "IP Limited") and places. | Fixed: at most 8 grey chips; the freed slots go to terms you have. |
| 2026-10-15 | speed | Reword with AI takes ~15–20 s per bullet (Nebius DeepSeek). Fine for one bullet, slow for a pass over the whole resume. | Waited. |
| 2026-10-15 | editor | After Save, every entry on the job's resume collapses again (the editor remounts), so you lose your place after each edit. | Re-opened the role. |
| 2026-10-15 | tailor | Reword alternatives sometimes swap a word for the posting's ("volume forecast" → "demand forecast"). Grounded (no new facts or numbers), but a subtle claim change worth a glance. | Used it anyway; worth knowing. |
| 2026-10-15 | jobs | URL import (new): Greenhouse, Airbnb/Stripe career sites, Lever, Ashby and LinkedIn links each imported in ~1 s with the posting's own title, company and location. | — |
| 2026-10-15 | jobs | URL import saved LinkedIn's search link (`/jobs/search/?currentJobId=…&keywords=…`) as the posting link. | Fixed before commit: saved as `/jobs/view/<id>`. |
| 2026-10-15 | jobs | URL import: a failed import cleared the link box, so you had to paste again. | Fixed: `5cc554dd`. |
| 2026-10-15 | jobs | URL import: Workday answered with JSON (we accepted it), giving a wrong "it may be a PDF" error. Workday, Workable and HN still can't be read (JavaScript shells / 419 to server fetches). | Fixed the header and message (`5cc554dd`); paste the description for those. |
| 2026-10-15 | speed | URL import's AI fallback (a page without structured data) took ~35 s for one posting. | Mozilla's pages link their Greenhouse job, so that case now takes 1 s (`d331b6fa`). |
| 2026-10-15 | tailor | **Grounding gap:** the AI summary for the ICU nurse said "experienced in hemodynamic monitoring", which isn't in the profile (it's in the posting). Summaries are only checked for numbers. | Logged. Worth a decision: flag summary phrases that match the posting but not the profile? |
| 2026-10-15 | letter | **Grounding gap:** the cover letter claimed "hemodynamic monitoring" experience and being "comfortable with a days schedule including weekend and holiday rotation", both lifted from the posting. Only numbers are checked in letters. | Logged; same question as above. |
| 2026-10-15 | tailor | Keyword gap: "RN" shows grey for a nurse whose profile says "Registered Nurse" (and RN in the name, which isn't counted). No acronym expansion. | Logged. |
