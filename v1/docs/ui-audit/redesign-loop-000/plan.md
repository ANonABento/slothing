# UI Redesign Audit Loop — Plan (loop-000)

Started: 2026-05-13
Branch: `feat/ui-redesign`
Worktree: `/home/anonabento/slothing/.claude/worktrees/ui-redesign`

## North-star

Bring every in-app page up to the editorial polish of `/en` (the new marketing
landing): cream paper, ink type, Outfit display on H1/H2, JetBrains mono on
captions, restrained rust accent, paper cards on the page band — not page-band
inside cards.

## Reading-list summary

**Editorial system (live in this branch)**
- `apps/web/src/app/globals.css` — defines static editorial vars: `--bg`,
  `--bg-2`, `--paper`, `--ink`, `--ink-2`, `--ink-3`, `--rule`,
  `--rule-strong`, `--rule-strong-bg`, `--paper-shadow`, `--paper-shadow-strong`,
  `--inverse-bg/-ink`, `--brand`/`--brand-dark`/`--brand-soft`, `--display`,
  `--font-body`, `--font-mono`, `--r-sm/md/lg/xl/pill`. Both light + dark sets.
- `apps/web/tailwind.config.ts` — exposes the editorial colors as direct utilities:
  - Surfaces: `bg-page`, `bg-page-2`, `bg-paper`, `bg-inverse`
  - Ink: `text-ink`, `text-ink-2`, `text-ink-3`, `text-inverse-ink`
  - Lines: `border-rule`, `border-rule-strong`, `bg-rule-strong-bg`
  - Brand: `text-brand`, `text-brand-dark`, `bg-brand`, `bg-brand-soft`,
    `border-brand`
  - Type: `font-display`, `font-body`, `font-mono`
  - The shadcn HSL stack (`bg-card`, `text-foreground`, `bg-primary`, etc.)
    still works — the `slothing` theme preset (`src/lib/theme/presets/slothing.ts`)
    maps them onto the new palette, so existing pages already inherit the warm
    cream feel.
- Defaults on `<html>`: `data-palette="cream" data-accent="rust" data-display="outfit" data-radius="soft"`.
- `apps/web/src/components/landing/*` — primitives I should mimic (NOT touch):
  `<Eyebrow>`, `<DeepSection>`, `<PropCard>`, `<FeaturePill>`, `<LogoChip>`,
  `<HighlighterEm>`, `<DashList>`, `<MonoCap>`. These show the editorial
  vocabulary in action.

**What's already polished (reference, not a target):**
- `apps/web/src/app/[locale]/(marketing)/page.tsx` — the rebuilt landing.
- Landing primitives in `apps/web/src/components/landing/`.

**What needs work:** every `(app)` route. They inherit the new palette through
preset aliasing, but the layout primitives (PageHeader, Card, StatusPill,
Sidebar, PageSection, drawers, table chrome, etc.) were tuned for the old slate
look. They render *acceptably* on cream but rarely *editorially* — wrong
shadow weight, wrong border tone, off-rhythm spacing, generic radii, no display
font on the section heads.

**Conventions to honor (CLAUDE.md):**
- No `bg-white`/`bg-black`/`bg-gray-*`/`text-gray-*`/inline hex. Hard-fail lint.
- Destructive actions still need confirm-dialog or undo-snackbar.
- `pluralize()` and `<TimeAgo />` everywhere.
- Pre-commit hook runs lint-staged + type-check — fix at source, never
  `--no-verify`.
- App pages stay wide by default; `width="narrow"` is lint-flagged.

## Routes I intend to cover (loops 001–004)

Rough plan, subject to redirection by what I find.

| Loop | Routes (priority) | Theme |
| ---- | ---------------- | ----- |
| 001  | `/dashboard`, `/opportunities`, `/studio` | Highest-traffic surfaces; sets the bar |
| 002  | `/bank`, `/profile`, `/upload` | Document/data entry pages; lots of cards |
| 003  | `/interview`, `/emails`, `/calendar` | Mid-tier feature pages |
| 004  | `/analytics`, `/salary`, `/settings`, `/sign-in` | Charts, dense forms, auth chrome |

Cross-cutting components likely to surface in loop-001 and pay dividends in
later loops: `Sidebar` active state, `PageHeader` display font, `Card` shadow
weight, `StatusPill` paper variant, sticky save-status pill, drawer chrome.

## Screenshot capture protocol

- Browser: Playwright (chromium) via MCP.
- Viewports: **1280×800** and **1920×1080** (matches Kev's prototype design size).
- Themes: light first; toggle to dark for at least one route per loop.
- File names: `<route-slug>-<viewport>-<theme>-{before,after}.png`.
  Example: `dashboard-1280-light-before.png`.
- Stored in `docs/ui-audit/redesign-loop-NNN/screenshots/`.
- Full-page on routes that don't have unbounded scroll; first-viewport only
  on routes with infinite/long content (studio editor, etc.) — note which in
  the audit.

Server is already running at `http://localhost:3000` (i18n prefix `/en/...`).
Authed routes resolve via the local-dev fallback user, no login flow needed.

## Stop signal

I'll declare this audit-loop session done when **either**:

1. Five consecutive loops report only Low-severity items in `audit.md`
   (i.e. nothing that materially moves the app closer to editorial parity).
2. Eight loops have run (matches the prior `worktree-ui-audit-loop` cadence
   from PR #269). At that point summarize residual carry-over and stop.
3. The user says stop, or a drift gate stays red twice in a row — pause,
   document, and ask.

I won't pause between loops to wait for confirmation; I'll just keep going and
push each loop's commits to `feat/ui-redesign` so PR #271 updates in place.

## What I will deliberately NOT touch

- `apps/web/src/components/landing/*` and `app/[locale]/(marketing)/page.tsx`
  (the reference, not the target).
- `apps/web/src/app/globals.css` editorial token block (the values are
  settled; if I think one needs to change, I'll file it in `audit.md`).
- `apps/web/src/lib/theme/presets/slothing.ts` HSL values.
- `tailwind.config.ts` token *renames* (additions OK, renames not).
- Auth UI — out-of-scope per the redesign plan.

If I want to add a new editorial utility class, I will, but only when at least
two routes would adopt it. Otherwise the change stays as a local Tailwind class
list on the consumer.
