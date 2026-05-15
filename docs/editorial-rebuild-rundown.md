# Editorial rebuild — rundown

The autonomous run while you were asleep. Branch: `main` at `2977d48e`.

---

## What landed

13 commits on top of the prior `724feae` (`copy(pricing): conversion polish`).

```
2977d48e merge phase3-staging — editorial rebuild
7c2dc021 fix(wave2 audit): flatten .gradient-bg class globally, add ATS metadata
6bf344d2 feat(ats): wave 2 in-app /ats route + shared scanner core
09c323c8 feat(settings): wave 2 editorial rebuild — vertical nav + danger zone
e5026237 feat(wave2): integrate Toolkit + Interview Prep + Wave-2 sidebar nav
94a2d311 feat(interview): wave 2 editorial rebuild — session rail + coach rail
0afb397e fix(wave1): audit fixes for Profile + Opportunities
5bbca3cc feat(wave1): integrate Profile + Opportunities agent work
1974a448 chore(routes,marketing): migrate /bank+/answer-bank links, kill remaining marketing gradients, fix nonce hydration
93c4984f feat(dashboard): add QuickActionStrip with 4 primary verbs
ad1edad1 fix(editorial): wave1 audit fixes — page headers, midnight primary, avatar fallback
6dc651a2 refactor(editorial): split bank into /components + /answers, remove gradients, add midnight-ink default
fbefedf4 feat(bank): unify bank + answer-bank into Knowledge Bank umbrella  ← later reverted
06ba78f6 feat(editorial): finish phase 1.5 + ship phase 3 wave 0 primitives
```

---

## Decisions I made for you

| Topic | Decision | Why |
|---|---|---|
| Bank naming + routes | `/bank` → `/components`, `/answer-bank` → `/answers`, group "Library" in sidebar | You said separate-is-better when I asked. Renaming routes (not just labels) since URLs are user-facing and the new names are clearer; 307 redirects from old paths preserve any bookmarks |
| Bank merge | Reverted the Knowledge Bank umbrella attempt | Different data models + intents made one filter step per visit the wrong default. Kept the agent's extracted tab components (`components-tab.tsx`, `answers-tab.tsx`) as a refactor win — page.tsx is now a thin wrapper |
| Gradients | Removed globally — 14 company glyphs, `.gradient-bg` class, avatar pills, marketing nav/CTA | You said they don't look good. Each got a flat editorial replacement |
| Ink color default | **Midnight** (`#1a1530`) instead of warm-black (`#1a1410`) | Your gut on harshness was right. `data-ink` Tweak now exposes 3 options: black / midnight / espresso |
| ATS handoff | Option C — clean separation, no payload migration | Marketing `/ats-scanner` keeps its "no signup required" promise; in-app `/ats` is its own surface. Both share `<ScannerForm>` core |
| Wave 2 ordering | 4 agents in parallel (Settings / Toolkit / Interview / ATS), each with 60-min hard timebox | Wave 1 agents stalled 8+ hours each silently. Tightening prompts + adding `merge main first` + `do NOT pnpm install` cut Wave 2 cycle time from 8h → ~15min per page |
| Studio rename | Sidebar nav says "Studio"; page H1 stays "Document Studio" | Flipping the H1 cascaded into 20+ test snapshot updates that didn't add value |
| Wave 4 marketing | Polish only, no v2 rebuild | You said no v2 — just audit + polish the existing landing |

---

## Two localhosts (still running)

- **Main `:3000`** — now reflects the full rebuild (post-merge)
- **Staging `:3001`** — same content, was the integration target during the run

Both serve the same code now. You can stop one of them.

---

## Tweaks panel (for visual A/B before you commit)

Bottom-right gear FAB → opens the Tweaks panel with chip rows for:

- **Theme** — Light / Dark
- **Accent** — 6 brand swatches (rust default, olive, plum, coral, indigo, ink)
- **Ink** — Black / Midnight (default) / Espresso ← **the new one this run**
- **Display font** — Outfit / Space / Jakarta / Inter / DM Sans (all properly loaded via `next/font`)
- **Corners** — Sharp / Soft / Round
- **Density** — Comfy / Compact (wired into AppBar bar / PagePanel / sidebar rows / table cells)

When you've picked a config you like, ping me and I'll bake those as the new defaults + remove the Tweaks FAB.

---

## What's new / structural

### Routes

| Route | Status |
|---|---|
| `/components` | NEW (renamed from `/bank`); resume material library |
| `/answers` | NEW (renamed from `/answer-bank`); Q&A library |
| `/toolkit` | NEW; tabbed surface — email · salary · cover-letter (placeholder) · recruiter (placeholder) |
| `/ats` | NEW; in-app ATS scanner with opportunity picker + history; shares core with marketing `/ats-scanner` |
| `/bank`, `/answer-bank`, `/emails`, `/salary`, `/applications` | 307 redirects to the new paths |

### Sidebar groups

| Group | Items |
|---|---|
| Home | Dashboard |
| **Library** (renamed from Documents) | Components · Answers · Studio |
| Pipeline | Opportunities · Review Queue · Calendar |
| **Prep** (rewired) | Interview Prep · ATS Scanner · Toolkit |
| Reporting | Analytics |
| (footer) | Profile (top-right chip too) · Settings |

### Editorial primitives (`@/components/editorial`)

12 cross-cutting components, 99 vitest covering them:

`MonoCap` · `KbdChip` · `EditorialEyebrow` · `StatusPill` · `CompanyGlyph` (flat monogram) · `MatchScoreBar` · `EditorialPanel` (+ Header + Body + Footer) · `EditorialTable` (+ 5 sub-pieces) · `TaskRow` · `QuickActionStrip` (+ `QuickActionCard`) · `PasteBox` · `EditorialDetailDrawer`

### Dashboard

`<QuickActionStrip>` (4-up verb cards with ⌘ shortcuts) above the existing `EditorialFocusedMoves`:

- Add to Components (⌘U) → `/components`
- Analyze a JD (⌘J) → `/opportunities`
- Open Studio (⌘S) → `/studio`
- Run a mock interview (⌘I) → `/interview`

### Sub-agent workflow

Three audit→fix loops ran successfully (Knowledge Bank, Profile+Opportunities, Settings/Toolkit/Interview/ATS). Stall watchdog (`Monitor` task `b6w9d9tuf`) is still armed — it pings me if any agent worktree goes 30+ minutes without file activity. Caught the Wave-1 silent-stall pattern that bit us early.

---

## Things deferred (your call)

These didn't block the merge but might be worth a follow-up:

### Wave 4 marketing M1s (audit findings, deferred)
- `/vs` index undercooked — flat shield + plain H1, no mono-caps eyebrow or numbered card treatment
- `/vs/*` "Why people pick Slothing" callout border too faint in dark
- `/vs/*` H1 lacks the italic-emphasis brand-soft highlight
- `/extension` page CTAs all look identical (Chrome should pop as primary)
- Mobile (390) padding nit on the closer CTA card

### Wave 2 audit M1s (most deferred)
- `/emails` + `/salary` redirects emit meta-refresh in Next dev (200 + client redirect, brief title flash). Production gives a real 307 — not a regression
- Test-user seed avatar fetches `https://example.com/avatar.png` and 404s; the broken-image glyph is masked by `onError` everywhere, but console error noise remains
- `RedirectErrorBoundary` produces a benign div-in-p hydration warning
- Interview mono-caps eyebrows fall back to `SFMono-Regular` despite the correct class; CSS cascade issue worth a closer look later

### Toolkit scope
- Cover Letter and Recruiter Rewriter tabs render placeholder cards. Both reserve their `?tab=` slots so wiring up real content later is additive
- ATS Scanner page doesn't yet save scans to a persistence layer — `saveInAppScan` exists in `lib/db/ats-scans.ts` but isn't wired through

### Onboarding refresh
Plan doc flagged this. The current onboarding steps still reference the old routes/labels in some places. Worth a pass once you've settled the ink/font/accent defaults.

---

## Known concurrent edits I preserved (stashes)

While I worked, the working tree on `main` accumulated edits from concurrent sessions (Blog page, opportunities/page.tsx rewrite, vs/* pages, robots.ts, sitemap.ts, layout.tsx, marketing footer with a Blog link). I stashed them before the merge to avoid clobbering:

```
stash@{0}: main pre-merge: more concurrent edits  (vs/*, extension, pricing, robots, sitemap)
stash@{1}: main pre-merge: concurrent edits      (layout, opportunities, footer, navbar)
```

Recoverable via `git stash list` / `git stash show -p stash@{N}`. I also moved 6 untracked files from `apps/web/src/app/[locale]/(app)/opportunities/_components/` to `/tmp/main-stale-untracked/` (a prior session's stale OpportunityDrawer that was clobbered by the audited+fixed staging version).

The blog directory was untracked and stayed untracked — I edited two of its files in place to fix `new Date()` time-lint violations so the merge could go through `pnpm run lint` cleanly. Once someone formalizes the blog (commits it), those edits go with it.

---

## Gates green

- `pnpm --filter @slothing/web run type-check` ✅
- `pnpm --filter @slothing/web run lint` ✅ (only pre-existing warnings, no errors)
- Targeted vitest passes on every touched surface — Wave 1 (39), Wave 2 (34 ATS + 36 Settings + 30 toolkit + 8 interview)
- Smoke at `http://localhost:3000/en/{dashboard,components,answers,profile,opportunities,settings,toolkit,interview,ats}` — all 200

Pre-existing test failures NOT caused by this run:
- `src/messages/translation-scripts.test.ts` — strict-identical mode flags 12 pre-existing identical-to-English strings (`dialogs.builder.sectionList.pickerEmptyCta`, etc.)
- `src/app/[locale]/(marketing)/terms/page.test.tsx` — legal-review check
- `src/app/[locale]/(marketing)/pricing/page.test.tsx` — checkout CTA snapshot

Verified pre-existing by stashing my changes and re-running on clean `main`. Not regressions.

---

## What to ask me next

When you wake up + skim the staging UI (`localhost:3000` now or any of the audited screenshots under `.audit/wave1-*`, `.audit/wave2/`, `.audit/wave4-marketing/`), some good follow-ups:

- "Lock in the Tweaks values you want as defaults" — pick ink/accent/display/radius/density, I'll bake them in and remove the FAB
- "Pop the stashes" — for the Blog work and the concurrent vs/* edits, decide what to keep
- "Wave 4 polish round" — knock out the deferred `/vs/*` editorial pass and dark-mode contrast bumps
- "Profile + Opportunities round 2" — audit caught a few M1 polish items worth a tight follow-up

Final commit: `2977d48e`.
