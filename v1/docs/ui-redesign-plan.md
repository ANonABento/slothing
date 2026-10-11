# UI Redesign — Editorial System Rollout

**Branch:** `feat/ui-redesign`
**Started:** 2026-05-13
**Owner:** Claude (driven by user)
**Design handoff:** `.design-ref/` (Kev's slothing-kev bundle — gitignored, copy at `/tmp/slothing-kev-design/`)

### Worktree dev-server setup gotchas

`apps/web/.env.local` and `apps/web/.local.db` are both gitignored, so a fresh `git worktree add` boots without auth flags **and** with an empty SQLite — the `(app)` layout redirects authed routes to `/sign-in?error=auth-unavailable`, and `/api/opportunities` 500s with `no such table: jobs`. Fix once per new worktree by symlinking both back to main:

```bash
MAIN=$(dirname "$(git rev-parse --git-common-dir)")
ln -sf "$MAIN/apps/web/.env.local" apps/web/.env.local
ln -sf "$MAIN/apps/web/.local.db"  apps/web/.local.db
```

Sharing the DB across worktrees is fine for dev — both see the same data. If you need an isolated DB, copy instead of symlinking and let the schema bootstrap auto-run on first DB connection.

Done for this worktree on 2026-05-13.

---

## North-star goal

> **Ship Kev's editorial design system end-to-end on `feat/ui-redesign`: a rebuilt landing page at `/` matching the 8-section handoff, plus a token foundation so every existing app page inherits the cream-paper / midnight-indigo palette automatically — without rewriting every component.**

Every phase below justifies itself against this goal. If a task doesn't move us toward it, cut the task.

---

## Drift checks — how to tell we're off-track

Run these gates at the end of every phase. **If any fails, stop and fix before moving on.**

| Gate | Command | Pass = |
| ---- | ------- | ------ |
| TypeScript strict | `pnpm run type-check` | exit 0 |
| Lint (incl. forbidden-color) | `pnpm run lint` | exit 0 |
| Unit tests | `pnpm run test:run` | exit 0 |
| Landing page renders | `pnpm dev` → load `/` | no console errors, both themes work |
| Existing app pages don't break | spot-check `/studio`, `/opportunities`, `/dashboard` | no white-on-white, no missing buttons |
| Visual parity with handoff | screenshot `/` light + dark | matches `.design-ref/index.html` within ±5% |

**Hard rules (never violate):**
- No `bg-white` / `bg-black` / `bg-gray-*` / `text-gray-*` / hex inline colors. The forbidden-color lint catches these.
- No `--no-verify`. Pre-commit hook failures get fixed at the source.
- No bypassing CLAUDE.md conventions: destructive actions still need confirm/undo, pluralize/TimeAgo helpers still apply, `user_id` scoping still required.

---

## Decisions log

| Date | Decision | Why |
| ---- | -------- | --- |
| 2026-05-13 | Full system swap (not foundation-only or sandboxed `/preview`) | User chose; deliver visible value, not just plumbing. |
| 2026-05-13 | Theme attribute: keep `.dark` class (next-themes default); remap Kev's `[data-theme="dark"]` → `.dark` | Smallest blast radius — every existing `dark:` utility keeps working. |
| 2026-05-13 | Dark-mode bg: **Midnight Indigo `#0F1226`** (not Kev's dusk `#1a1530`) | User wanted something between dusk and midnight; this pair (cream `#f6ecd6` on `#0F1226`) reads as "lit study at night," 16.4:1 contrast, complements all accent ramps. |
| 2026-05-13 | `--ink-3` nudged to `#8a83a8` (cooler than Kev's `#8e7fa8`) | Kev's lavender was tuned for the purpler dusk bg; cooler tone harmonizes with indigo. |
| 2026-05-13 | Alias shadcn HSL vars to new hex values; do **not** rename `bg-card`/`text-foreground` callsites | Achieves visual swap in one diff instead of touching 200+ files. Rename sweep is a future task. |
| 2026-05-13 | Tweaks panel (runtime palette/accent/display/radius picker) **stripped for v1** | Per Kev's README. Tokens still support the data-attrs so we can add a settings-page picker later. |
| 2026-05-13 | **Architecture pivot:** codebase has a runtime theme-preset system (`src/lib/theme/presets/*`) with 7 presets applied via JS. Editing globals.css HSL vars would be overwritten at runtime. **Add `slothing` as a new theme preset, set it as the default.** Existing presets (default, bloxy, glass, minimal, neon, earth, premium) stay user-selectable from settings. | Smallest blast radius; preserves the existing theme-switching feature; reuses the apply.ts machinery for the new palette. |
| 2026-05-13 | **`--brand` (not `--accent`) for Kev's editorial accent color.** shadcn's `--accent` stays HSL-wrapped for hover backgrounds (mapped to a soft warm beige). Kev's brand rust lives as a separate direct-color var `--brand` / `--brand-dark` / `--brand-soft`, exposed as `bg-brand`, `text-brand`, `bg-brand-soft` Tailwind utilities. | Tailwind config wraps `--accent` with `hsl()`; that conflicts with Kev's hex values. Separating keeps both systems coherent and avoids visually-loud rust hover states everywhere. |

---

## Phases

Status legend: `[ ]` pending · `[~]` in progress · `[x]` done · `[-]` cut

### Phase 0 — Setup `[x]`

**Why this serves the goal:** Can't redesign without a sandboxed branch and the handoff in hand.

- [x] Create worktree `.claude/worktrees/ui-redesign` on branch `feat/ui-redesign`
- [x] Extract `slothing-kev.zip` to `.design-ref/`
- [x] Read tokens.css, tokens.json, README, tailwind.config.snippet.js
- [x] Read current `apps/web/src/app/globals.css` + `apps/web/tailwind.config.ts`
- [x] Confirm scope (full swap), theme attr (`.dark`), and dark-mode color (Midnight Indigo) with user
- [x] Write this plan doc

**Exit criteria:** worktree exists, plan committed.

---

### Phase 1 — Token foundation `[ ]`

**Why this serves the goal:** Existing pages using `bg-card` / `text-foreground` will inherit the new palette the moment a Slothing theme preset becomes the default. This is the single highest-leverage change in the whole project.

- [ ] **1.1a** Create new theme preset `apps/web/src/lib/theme/presets/slothing.ts` with Kev's cream/paper/ink palette (light) and Midnight Indigo palette (dark). All shadcn HSL tokens (`background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, `popover`, …) defined here. Fonts reference `var(--font-body)` and `var(--display)` (defined statically in step 1.2).
- [ ] **1.1b** Register the preset:
  - Add `"slothing"` to `themeIds` in `src/lib/theme/tokens.ts`
  - Export `slothingTheme` from `src/lib/theme/presets/index.ts`
  - Add to `ALL_THEMES` and set `DEFAULT_THEME_ID = "slothing"` in `src/lib/theme/registry.ts`
- [ ] **1.2** Add Kev's *additional* tokens to `apps/web/src/app/globals.css` (these don't conflict with shadcn — different names):
  - Static vars (`--bg`, `--bg-2`, `--paper`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, `--rule-strong`, `--rule-strong-bg`, `--paper-shadow`, `--paper-shadow-strong`, `--inverse-bg`, `--inverse-ink`) for both light and `.dark`
  - `--brand` / `--brand-dark` / `--brand-soft` (Kev's editorial accent, distinct from shadcn `--accent`)
  - `--display`, `--font-body`, `--font-mono` font-family vars
  - `--r-sm/md/lg/xl/pill` radius scale (separate from shadcn `--radius`)
  - Palette system (`[data-palette="cream|ivory|sage|sand"]` — light only)
  - Accent system (`[data-accent="rust|olive|plum|coral|indigo|ink"]` — switches `--brand` vars; both light + dark variants)
  - Display-font system (`[data-display="outfit|space|jakarta|inter|dm"]` — switches `--display`)
  - Radius system (`[data-radius="sharp|soft|round"]` — switches `--r-*`)
  - Defaults on `<html>`: `data-palette="cream" data-accent="rust" data-display="outfit" data-radius="soft"`
- [ ] **1.2** Extend `apps/web/tailwind.config.ts`:
  - Add color utilities: `bg-page`, `bg-page-2`, `bg-paper`, `text-ink`, `text-ink-2`, `text-ink-3`, `border-rule`, `border-rule-strong`, `text-accent`, `text-accent-dark`, `bg-accent-soft`, `bg-inverse`, `text-inverse-ink`
  - Add `fontFamily`: `display: ["var(--display)"]`, plus `mono: ["var(--font-mono)", …]`
  - Add `fontSize`: `hero-h1`, `section-h2`, `closer-h2`, `preview`, `lede`, `hero-sub`, `mono-cap`
  - Add `boxShadow`: `card`, `card-elevated`, `panel` (overlay onto existing)
  - Add `maxWidth.wrap: 1240px`
  - Add `keyframes` + `animation`: `kb-drop`, `caret-blink`, `spin-slow`
  - **Keep existing shadcn color names + radii** — additive only
- [ ] **1.3** Update `apps/web/scripts/forbidden-color-lint.cjs`:
  - Whitelist new semantic utilities (`bg-page`, `bg-paper`, `text-ink*`, `border-rule*`, `text-accent*`, `bg-accent-soft`, `bg-inverse`, `text-inverse-ink`)
  - Continue to reject `bg-white|black|gray-*|slate-*|zinc-*` and hex/rgb inline colors

**Drift gates:** type-check + lint + test:run + dev server cold-loads `/` without errors. **Spot-check `/studio` and `/dashboard`** — they should look different (warmer, creamier) but not broken.

---

### Phase 2 — Theme wiring + fonts `[ ]`

**Why this serves the goal:** Tokens are inert without the data-attrs on `<html>` and the right fonts loaded. The display-font is what makes the editorial feel land.

- [ ] **2.1** Wire `data-palette` / `data-accent` / `data-display` / `data-radius` on `<html>` in the root layout. Defaults hardcoded for v1 (no runtime picker). Read from localStorage keys `slothing-palette`, `slothing-accent`, `slothing-display`, `slothing-radius` if present, so we can ship a settings-page picker later without re-plumbing.
- [ ] **2.2** Load fonts via `next/font/google`:
  - **Geist** (body, weights 400/500) → `--font-body`
  - **JetBrains Mono** (mono, weight 500) → `--font-mono`
  - **Outfit** (display, weight 700) → `--display`
- [ ] **2.3** Remove now-unused `--font-sans` / `--font-heading` if no callers; otherwise alias them to the new vars.

**Drift gates:** all of phase-1's gates, **plus** font face matches handoff (Outfit on H1, Geist on body, JetBrains on mono captions like "INSIDE SLOTHING").

---

### Phase 3 — shadcn primitive refresh `[ ]`

**Why this serves the goal:** The shadcn primitives (`Button`, `Card`, `Badge`, `Input`, `Tabs`) are referenced everywhere. Adjusting them to use the new shadows + radii + accent system propagates the editorial feel across the whole app at zero per-page cost.

- [ ] **3.1** `Button` — primary variant uses `--ink` bg / `--bg` text, hover swaps to `--accent-dark` bg. Ghost: transparent → `--rule-strong-bg` + `--rule-strong` border on hover. Padding `10px 18px` (sm) / `13px 22px` (lg). Radius `--r-md`. No shadow.
- [ ] **3.2** `Card` — `bg-paper`, `border-rule`, `rounded-lg` (→ `--r-lg`), `shadow-card`. Padding `22px` default, `28px` for `card-lg`.
- [ ] **3.3** `Badge` / pill — `bg-paper` + `border-rule` + `rounded-pill`, `pill-pad`. Add a `halo-dot` variant for the eyebrow pattern (`::before` + `::after` accent-soft + accent dot).
- [ ] **3.4** `Input` — `bg-paper`, `border-rule`, `text-ink`, focus ring uses `--accent`.
- [ ] **3.5** `Tabs` — active tab uses `--bg` background (sits on `--paper` parent), inactive uses `text-ink-3`.

**Drift gates:** all prior gates, **plus** an audit of `/studio` + `/opportunities` for visual regressions (no clipped text, no missing focus states, no broken contrast).

---

### Phase 4 — Landing page rebuild `[ ]`

**Why this serves the goal:** This *is* the goal's visible deliverable. Every prior phase exists to make this section land cleanly.

Replace `apps/web/src/app/[locale]/(marketing)/page.tsx`. Each subtask = one section from Kev's `index.html`:

- [ ] **4.1** Primitives: `<Eyebrow>`, `<DeepSection>` (with `--alt` variant for full-bleed `--bg-2` bands), `<PropCard>`, `<FeaturePill>`, `<LogoChip>`, `<HighlighterEm>` (italic + accent + underline mark)
- [ ] **4.2** Nav (sticky, blurred): brand + center links + theme toggle + Sign in + "Get started free" CTA
- [ ] **4.3** Hero: two-column grid, eyebrow badge, H1 with italic-accent emphasis, sub copy, primary + ghost CTAs, feature pill bar, mascot + 3 floating prop cards (`prop-resume`, `prop-match`, `prop-next`)
- [ ] **4.4** Section 01 — Knowledge Bank: `kb-doc` paper card → dashed arrow → 5 staggered `kb-chip` pills (kb-drop animation)
- [ ] **4.5** Section 02 — Slothing extension (alt band): `bx-frame` with traffic lights, URL bar, detected strip, 5-row list, KBD pill ⌘⇧I
- [ ] **4.6** Section 03 — ATS match: `ats-card` with donut score, keyword chips (matched + missed), seniority pills, "suggested swap" callout
- [ ] **4.7** Section 04 — Form autofill (alt band): `af-form` with 3 fields (filled, typing-with-caret, filled), `af-pop` popover with ⌘⇧F kbd
- [ ] **4.8** Section 05 — Interview prep: `iv-stage` with bot/you chat bubbles, feedback card with 3 score rows + italic note
- [ ] **4.9** Globe / integrations strip: 3-card grid (i18n, local & private, plays well with your tools)
- [ ] **4.10** Job-queue product preview: `--paper` framed card, search row, 5 tabs, 6-row table with status pills + match progress, right rail with ATS donut + component bank
- [ ] **4.11** Closer (inverse block): H2 + sub + CTAs + testimonial quote card
- [ ] **4.12** Footer: 4-column (brand, product, open source, community) + bottom strip
- [ ] **4.13** Sticky-nav `scroll-margin-top: 84px` on each `[id^="feat-"]` so anchor scroll clears the nav
- [ ] **4.14** Responsive breakpoints: `≤980px` stacks, `≤560px` tightens padding. Mobile menu out of scope per Kev's "out of scope" list.

**Drift gates:** all prior, **plus**:
- Lighthouse perf ≥ 90 on landing
- No CLS from floating prop cards (use `transform`, not `top/left` reflow)
- Theme toggle works, persists via next-themes
- `pnpm --filter @slothing/web test:e2e` passes the marketing landing test (update assertions if copy changed)

---

### Phase 5 — App-page sanity sweep `[ ]`

**Why this serves the goal:** Goal includes "every existing app page inherits the palette." Aliasing handles 95%, but a 5-minute audit per page catches the awkward corners (hard-coded shadows, hover states tuned to the old palette).

- [ ] **5.1** `/dashboard` — onboarding banner, stat cards, activity feed
- [ ] **5.2** `/studio` — editor, drawers, save-status pill, AI panel
- [ ] **5.3** `/opportunities` + `/opportunities/review` — table rows, status badges, wizard
- [ ] **5.4** `/bank` — document list, knowledge bank entries
- [ ] **5.5** `/interview`, `/calendar`, `/emails`, `/analytics`, `/salary` — quick walk-through, screenshot
- [ ] **5.6** Sidebar (`src/components/layout/sidebar.tsx`) — active state uses `--rule-strong-bg`, hover uses `--rule`
- [ ] **5.7** Settings, profile, auth pages — quick check

Per page, the audit is: load it, scroll through, fix any obvious break. If a deeper rework is needed, file as a follow-up — don't expand scope here.

**Drift gates:** all prior. No new task added to phase 5 that isn't a one-line fix.

---

### Phase 6 — Tests, screenshots, PR `[ ]`

**Why this serves the goal:** A redesign that doesn't ship to a reviewable PR doesn't ship.

- [ ] **6.1** Update / add unit tests for any changed shadcn primitive (Button variants, Card shadow, Badge halo-dot).
- [ ] **6.2** Update Playwright marketing test (`apps/web/e2e/`) for new copy/structure.
- [ ] **6.3** Capture screenshots: `/` light, `/` dark, `/studio` light, `/studio` dark, `/opportunities` light. Drop in `.design-ref/screenshots/`.
- [ ] **6.4** Final gate run: `pnpm run type-check && pnpm run lint && pnpm run test:run && pnpm --filter @slothing/web test:e2e`
- [ ] **6.5** Open PR `feat/ui-redesign` → `main`. Body links this plan doc + screenshots + decisions log.
- [ ] **6.6** Update CLAUDE.md "Recent Improvements" section with the new design system (after merge).

**Drift gates:** PR description references this plan; all gates green in CI.

---

## Out of scope (parked for follow-up PRs)

- Tweaks panel as a user-facing settings picker
- Renaming `bg-card`/`text-foreground` callsites to `bg-paper`/`text-ink` (deep migration)
- Editorial rebuild of in-app pages (studio, opportunities, etc.) — palette-only here
- Mascot SVG/WebP optimization (PNGs ship as-is for v1)
- Marketing sub-pages (`/pricing`, `/ats-scanner`, `/extension`, `/vs/*`)
- Mobile sheet menu / hamburger
- Auth UI redesign

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Aliasing HSL vars to hex-derived HSL loses fidelity for translucent colors | Translucent tokens (`--rule`, `--rule-strong`, `--paper-shadow`) stay as `rgba()` — they're separate vars, not part of the shadcn HSL aliasing. |
| Existing pages designed for cool slate look weird on warm cream | Phase 5 sanity sweep catches the obvious ones. If something needs a real rework, file as follow-up. |
| Display font (Outfit) doesn't load reliably and falls back to system | `next/font` self-hosts; we ship as a Google webfont with `display: swap` fallback to `system-ui`. |
| Forbidden-color lint regresses (we add a new utility but forget to whitelist it) | Phase 1.3 explicitly whitelists; CI gate catches drift. |
| Landing page e2e breaks from copy changes | Phase 6.2 updates Playwright assertions in lockstep. |

## File touch budget

Rough estimate of files modified, to flag if we're sprawling:

| Phase | Expected files modified |
| ----- | ----------------------- |
| 1 — Tokens | 3 (globals.css, tailwind.config.ts, forbidden-color-lint.cjs) |
| 2 — Theme + fonts | 2–3 (root layout, possibly font config) |
| 3 — shadcn primitives | 5–8 (button, card, badge, input, tabs in `components/ui/`) |
| 4 — Landing | 8–12 (new page + 6–10 section components) |
| 5 — App sweep | 0 ideally, ≤10 worst case |
| 6 — Tests + PR | 2–4 test files, screenshots, PR body |

**If any phase blows its budget by 2× — stop and check in with user.**

---

## Status snapshot

Last updated: 2026-05-13 (Phases 1–4 complete, full landing live)

- Phase 0: `[x]` complete
- Phase 1: `[x]` complete — slothing preset registered as default, editorial tokens in globals.css, Tailwind extended.
- Phase 2: `[x]` complete — `<html>` carries `data-palette="cream" data-accent="rust" data-display="outfit" data-radius="soft"`, Geist Sans/JetBrains Mono/Outfit loaded.
- Phase 3: `[x]` complete — Button hover → `bg-brand-dark`, Badge gets a `paper` editorial variant. Card/Input/Tabs already render correctly via aliasing.
- Phase 4: `[x]` complete — landing primitives (Eyebrow, Halo eyebrow, HighlighterEm, DeepSection, DeepGrid, PropCard, FeaturePill, LogoChip, DashList, MonoCap) at `components/landing/primitives.tsx`; Hero with 3 floating prop cards; 5 deep-dive sections (KnowledgeBank, Extension, ATSMatch, FormAutofill, InterviewPrep); IntegrationsStrip, JobQueuePreview, Closer; new `[locale]/(marketing)/page.tsx` composes them. Mascot + logo PNGs at `public/landing/`. **All 3552 unit tests pass.**
- Phase 5: `[ ]` ready to start (app-page sanity sweep — 5-min audits of /studio, /opportunities, /dashboard etc.)
- Phase 6: `[ ]` blocked on phase 5

### Files added/touched in Phase 4 (within budget)
- `apps/web/src/components/landing/primitives.tsx` (new)
- `apps/web/src/components/landing/Nav.tsx` (new, currently orphan — existing marketing layout provides nav for v1)
- `apps/web/src/components/landing/Hero.tsx` (new)
- `apps/web/src/components/landing/FeatureSections.tsx` (new, contains 5 sections)
- `apps/web/src/components/landing/ClosingSections.tsx` (new, contains IntegrationsStrip + JobQueuePreview + Closer + LandingFooter)
- `apps/web/src/app/[locale]/(marketing)/page.tsx` (replaced)
- `apps/web/public/landing/{logo,mascot}.png` (assets)

### Known scope cuts vs. Kev's prototype (deliberate, per plan non-goals)
- Marketing layout's existing `<Navbar>` / `<Footer>` still wrap the new sections — my `LandingNav`/`LandingFooter` are orphan components ready for a follow-up swap.
- Visual mocks inside feature sections are simplified vs. the prototype's pixel-perfect framing (e.g., the Columbus browser frame, ATS donut, autofill popover) — they convey the feature at MVP fidelity without trying to reproduce every shadow/rotation.
- Floating prop cards in hero hide at `md` breakpoint and below (the prototype tucks them differently on mobile).

### Dev server
Running at **http://localhost:3000** (background process). `/en` returns 200 with the cream-paper landing.

### Phase 1 final touch — files modified (within budget)
- `apps/web/src/lib/theme/presets/slothing.ts` (new)
- `apps/web/src/lib/theme/presets/index.ts`
- `apps/web/src/lib/theme/tokens.ts`
- `apps/web/src/lib/theme/registry.ts`
- `apps/web/src/lib/theme/registry.test.ts`
- `apps/web/src/components/settings/theme-section.test.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/tailwind.config.ts`
- `docs/ui-redesign-plan.md` (this file)
