# Overnight report (2026-10-15)

Iteration 2 of `ROADMAP.md`, worked in the order from the handoff. This file is updated as the night goes.

## Setup notes

- A v2 dev server was already running on :3001 (on your real data). Stopping it was blocked by the
  permission classifier, so I left it alone and ran the dogfood server on **:3002** with its own build folder
  (`NEXT_DIST_DIR=.next-dogfood`, new in `next.config.ts`), so the two never shared `.next`.
  Data: a copy at `/tmp/slothing-dogfood`. `v2/data` was never touched.
- Port 3000 is another project (BentoSite), left alone.
- Test profile: a made-up demand-planning analyst ("Maya Lindqvist"), imported in the copy only.

## Shipped

| Feature | Commit | Try it |
|---|---|---|
| Keyword gap | `69497b89`, `781f0a5f` | Open a job with a resume. The chips above the editor are the posting's key terms: ✓ on the resume, orange "+" in your profile (click to see the bullets/skills that have it, then Add), grey dashed = not in your profile. Untick a role to watch chips turn orange live. |
| Reword this bullet | `4f528b21` | On a job's resume, open a role, click a bullet's ⋯ → "Reword with AI". Pick a quick hint or type one (Enter runs it). "Use" swaps the text in the draft; Save re-grounds it. "Reworded · show original" lets you revert. |

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

## Unfinished / unverified / unsure

- Keyword gap term picking is heuristic (title words; words used 3+ times; phrases 2+; your own skills
  named once; a noise list). It's decent on the 4 postings I tuned on, but a posting with a long company
  blurb still yields a few junk grey chips. I capped grey chips at 8 rather than keep growing the noise list.
- While previewing an older version from History, the chips still describe the current resume.
- Reword ignores the "Select only" tailoring level on purpose: it only runs when you ask for it on one bullet.
  If you'd rather "Select only" hide the menu item, it's a one-line change.
- Reword alternatives are checked for numbers only, like AI bullets. A swapped noun ("volume" → "demand")
  passes. Same limit as tailoring, so I left it.

## Ideas not built
