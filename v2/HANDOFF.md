# Overnight handoff (delete once read)

You're continuing work on Slothing v2 overnight while Kevin sleeps. He tests in the morning. Read this
whole file, then `CLAUDE.md` (repo root), `v2/ROADMAP.md` and `v2/FRICTION.md` before touching code.

## Goal

Ship Iteration 2 of `v2/ROADMAP.md`, one feature at a time, each one dogfooded in the browser before
the next starts. Quality over count: two features that work end to end beat four half-done ones.

Order (stop wherever the night ends):

1. **Keyword gap** on the job page (spec in ROADMAP.md). Reuse `terms()` / `relevance()` from
   `src/lib/score.ts`. No AI.
2. **Reword this bullet** in the bullet ⋯ menu of a job's resume (spec in ROADMAP.md). The
   alternatives must go through grounding: same `sourceIds`, and number warnings like any AI bullet.
3. **Import a job from its URL**: a paste-a-link box on the Jobs page. Fetch server-side, parse
   schema.org `JobPosting` JSON-LD first, then fall back to AI extraction from the page text. Port
   v1's parsers deliberately (read `v1/` for them; never edit `v1/`). Handle Greenhouse, Lever,
   Ashby and LinkedIn public postings, or fail with a clear message.
4. Only if 1–3 are done and solid: **Self-hosting step 1** from ROADMAP.md: a `Dockerfile` +
   `docker-compose.yml` with a volume for the data folder and Typst + fonts baked in. Verify that
   it builds if Docker is installed; otherwise write it and say it's unverified.

Do **not** start the browser extension. It's too big for an unattended night.

## Dogfooding: required after every feature

- Use the app in Chrome like a job seeker would: add a job, tailor (with and without AI), check the
  preview, edit, use the new feature, download the PDF, write a cover letter, try History.
- Use 3–5 real public postings, from different companies and fields (not only software). Use a
  **test profile**, not Kevin's: import a realistic resume you write yourself (a made-up person,
  e.g. a nurse, a data analyst, a mechanical engineer) so the app gets exercised beyond one profile
  shape. Try the extra sections, promotions and the different design presets.
- Log every snag in `v2/FRICTION.md` under a heading **"Agent dogfooding (overnight)"**, using the
  same table. Fix small, clear bugs as you go (one commit each). Write bigger or debatable ones down
  instead of fixing them.

## Rules

- **Never touch Kevin's real data.** Before starting a server, copy it:
  `cp -R v2/data /tmp/slothing-dogfood` and run every server with `SLOTHING_DATA_DIR=/tmp/slothing-dogfood`.
  The test profile goes in that copy. Never write to `v2/data/`.
- **One dev server only.** Two `next dev` processes sharing `.next` corrupt it (500 errors). If
  something is already listening on 3001 or 3000, stop it first (`lsof -ti tcp:3001 | xargs kill`),
  then from `v2/`: `SLOTHING_DATA_DIR=/tmp/slothing-dogfood npx next dev -p 3001`.
  v1 runs at 3100 via `npm run v1` if you need to compare; it's read-only reference.
- No subagents, forks or workflows (Kevin's global rule). Work directly.
- Branch `v2-rebuild`. Commit after each working step with a clear message. **Never push**, never
  force anything, never rewrite history.
- `npm run typecheck` and `npm test` pass before every commit. Add tests for new logic (see
  `src/lib/__tests__/`). Never weaken a test to make it pass.
- Follow `CLAUDE.md`: stay small, grounding on every resume path, one tailoring system (`fitResume`),
  token colors only, server actions return `Result`, delete what a change replaces.
- Don't run `prettier` on whole files: the repo isn't prettier-formatted, and it bloats diffs.
- AI calls cost Kevin money (keys in `v2/.env.local`). Keep it to what dogfooding needs (roughly 40
  calls for the night) and never loop on them.
- Don't add features outside this list. If something seems essential, write it under "Ideas" in the
  report instead.
- No personal details of Kevin's in UI text, examples, tests or docs.

## Morning report

Keep `v2/OVERNIGHT-REPORT.md` up to date as you go, not only at the end, so it's useful even if the
night is cut short:

- What shipped (commit hashes), and how to try each feature in 1–2 lines.
- What you dogfooded and the worst friction you found (link the FRICTION.md rows).
- Bugs fixed along the way.
- What's unfinished or unverified, and anything you're unsure was the right call.
- Ideas you deliberately didn't build.

Before you finish: stop the dogfood server, so Kevin can start his own on his real data with `npm run dev`.
