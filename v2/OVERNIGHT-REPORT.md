# Overnight report (2026-10-15)

Iteration 2 of `ROADMAP.md`, in the order from the handoff. **All four items are done**: keyword gap,
reword this bullet and URL import are shipped and dogfooded; Docker is written but not built (no Docker here).
`npm run typecheck` and `npm test` (92 tests) pass. Nothing pushed. `HANDOFF.md` deleted as it asked.
About 11 AI calls in total (2 resume imports, 1 job-title fill, 2 tailorings, 2 letters, 2 rewordings,
2 URL-import fallbacks).

**Start here:** the grounding gap in the nurse's summary and letter (under Dogfooding). It's the one
finding that affects trust in what the app sends.

## Setup notes

- A v2 dev server was already running on :3001 (on your real data). Stopping it was blocked by the
  permission classifier, so I left it alone and ran the dogfood server on **:3002** with its own build folder
  (`NEXT_DIST_DIR=.next-dogfood`, new in `next.config.ts`), so the two never shared `.next`.
  Data: a copy at `/tmp/slothing-dogfood`. `v2/data` was never touched.
- Port 3000 is another project (BentoSite), left alone. **Your :3001 server is still running** (I couldn't
  stop it), so it has been serving your real data all night with the old code; restart it to pick up these
  commits. The `next.config.ts` → `.mjs` rename means a restart is needed anyway.
- Test profile: a made-up demand-planning analyst ("Maya Lindqvist"), imported in the copy only.

## Shipped

| Feature | Commit | Try it |
|---|---|---|
| Keyword gap | `69497b89`, `781f0a5f` | Open a job with a resume. The chips above the editor are the posting's key terms: ✓ on the resume, orange "+" in your profile (click to see the bullets/skills that have it, then Add), grey dashed = not in your profile. Untick a role to watch chips turn orange live. |
| Reword this bullet | `4f528b21` | On a job's resume, open a role, click a bullet's ⋯ → "Reword with AI". Pick a quick hint or type one (Enter runs it). "Use" swaps the text in the draft; Save re-grounds it. "Reworded · show original" lets you revert. |
| Import a job from its URL | `687b4000`, `5cc554dd`, `d331b6fa` | Jobs page → paste a posting link → Import (or Enter). Opens the new job. Try `https://job-boards.greenhouse.io/gitlab/jobs/8864819002`, a `jobs.lever.co/…`, `jobs.ashbyhq.com/…` or `linkedin.com/jobs/view/…` link. Unreadable pages say why and suggest "Add job". |
| Docker (self-hosting step 1) | `3ba186f3` | `cd v2 && docker compose up --build` → :3000, data in `v2/data`, keys from `.env.local`. **Unverified: Docker isn't installed here.** I verified `next build` + `next start` (in a separate build folder) serve pages and render a Typst PDF. |

## Bugs fixed along the way

- `f8650d5b` Letter/resume header: contact items broke mid-item ("(312" / "555-0147", a hyphenated URL).
  Each item is now a Typst `box`, so lines only break between items.
- `0ec92a72` `terms()` folded plurals before dropping stop words, so "this" was scored as the term "thi"
  (and "does" as "doe"). It affected the fitter's ranking a little too.

## Dogfooding

Rows are in `FRICTION.md` under "Agent dogfooding (overnight)".

- **Keyword gap**: Airbnb "Community Support Forecasting and Demand Planning Analyst" (good match) and
  GitLab "Benefits Analyst" (poor match) with the analyst profile. Tailored with and without AI, edited,
  added bullets from chips, saved, wrote a cover letter, viewed and restored History, checked the PDF endpoint.
  Design presets: switched to ModernCV; promotions group under one company line as intended.
- **Reword this bullet**: two bullets on the Airbnb resume, one with "Lead with the result", one with a typed
  hint. Alternatives kept every number; picked, saved, checked the PDF.
  Worst friction (both features): AI tailoring took ~70 s with no progress feedback; and the no-AI term picker still lets
  some boilerplate through as grey chips.

- **URL import**, second test profile (a made-up ICU nurse with 4 roles, licenses, an award): imported a
  LinkedIn ICU posting from a *search* link, tailored without and with AI (fitter cut one old bullet to hold
  one page), wrote a cover letter. Also imported GitLab (Greenhouse), Airbnb and Stripe career sites
  (Greenhouse behind them), Spotify (Lever), Ramp (Ashby), two Mozilla postings (one via the AI fallback,
  6.7k chars copied verbatim; one via its Greenhouse link). Failure paths seen for real: a closed LinkedIn
  posting, LinkedIn rate limiting (429), Workday and Workable (JavaScript shells), HN (419), a listings page
  (AI said "not a single posting").
  **Worst friction of the night:** the AI summary and cover letter for the nurse claimed things from the
  *posting* ("hemodynamic monitoring", "comfortable with weekend and holiday rotation"). Only numbers are
  checked outside bullets, so this passes grounding. Not fixed: it needs a decision (see Ideas).

## Unfinished / unverified / unsure

- **Docker image never built** (no Docker on this machine). Likely snags if any: better-sqlite3 compiling
  (build tools are in the build stage), font downloads from GitHub during build, and bind-mount
  permissions on Linux (container runs as uid 1000). `next.config.ts` became `next.config.mjs` because
  `next start` would otherwise try to npm-install TypeScript at runtime.

- URL import: Greenhouse, Lever, Ashby and LinkedIn are verified against live postings (and unit-tested
  with fixtures). LinkedIn rate-limits quickly (I hit a 429 after ~10 requests), then the import falls back
  to the page's JSON-LD and otherwise says to wait. Workday and Workable aren't supported (JavaScript shells).
- URL import has no duplicate check: importing the same link twice makes two jobs.
- The `fetch` runs from your machine to whatever link you paste (http/https only). Fine for a local
  single-user app; it would need an allow-list before any hosted use.
- The noise-word tweak for keyword gap (`current`, `upon`, `hire`…) went into the URL import commit
  `687b4000` by accident rather than its own.

- Keyword gap term picking is heuristic (title words; words used 3+ times; phrases 2+; your own skills
  named once; a noise list). It's decent on the 4 postings I tuned on, but a posting with a long company
  blurb still yields a few junk grey chips. I capped grey chips at 8 rather than keep growing the noise list.
- While previewing an older version from History, the chips still describe the current resume.
- Reword ignores the "Select only" tailoring level on purpose: it only runs when you ask for it on one bullet.
  If you'd rather "Select only" hide the menu item, it's a one-line change.
- Reword alternatives are checked for numbers only, like AI bullets. A swapped noun ("volume" → "demand")
  passes. Same limit as tailoring, so I left it.

## Ideas not built

- **Grounding for prose** (the nurse finding): flag summary/letter phrases that appear in the posting but
  nowhere in the profile ("hemodynamic monitoring"). The keyword gap's `keyTerms` + `hasTerm` already
  compute exactly that set, so it could become a warning like the number check. Needs your call on noise.
- Workday and Workable readers: both have public JSON endpoints behind their SPAs.
- URL import: if the link is already a job, open that job instead of creating a second one.
- Progress feedback for slow AI calls (tailoring ~60–70 s on Nebius DeepSeek): even an elapsed-seconds counter.
- Keyword gap: acronym pairs (RN ↔ Registered Nurse, ICU ↔ intensive care).
