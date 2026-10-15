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
| 2026-10-15 | jobs | "Add job" did nothing on the first click right after the page loaded (dev server, before hydration). | Clicked again. Probably dev-only. |
