# Empty states + header cleanup plan

**Status:** Phase 1–3 shipped, Phase 4 in progress — 2026-05-16
**Owner:** TBD
**Related:** `docs/ui-redesign-plan.md`, `docs/editorial-rebuild-roadmap.md`, `src/components/ui/page-layout.tsx`, `src/components/ui/empty-states.tsx`, `docs/empty-states-and-headers-plan/illustration-prompt.md`

## Phase status — 2026-05-16

| Phase | Status | Notes |
| ----- | ------ | ----- |
| 1 — Primitives | ✅ shipped | `PageHeader` `variant="compact"`, `OnboardingEmptyState`, `ZeroResultEmptyState`, `ErrorEmptyState`, `PrerequisiteEmptyState`, `HowItWorksDiagram`, `EmptyIllustration`. 19 unit tests. |
| 2 — Illustration system | ✅ spec locked | Prompt template at `docs/empty-states-and-headers-plan/illustration-prompt.md`, asset manifest at `apps/web/public/illustrations/empty/README.md`. No SVGs generated yet — icon fallback holds the slot at runtime. |
| 3a — `/components` flagship | ✅ shipped | `OnboardingEmptyState` (zero entries) + `ZeroResultEmptyState` (filtered to zero) wired up, compact header with entry-count meta. |
| 3b — Mass header flip | ✅ shipped | 11 other `(app)` pages flipped to `variant="compact"`. Per-page empty-state upgrades are still TODO — see follow-up table. |
| 4 — Cleanup + verify | 🟡 in progress | type-check + lint + relevant tests green; description prop deprecation still pending until all callers have been audited for non-redundant copy. |

### Phase 3b — per-page empty-state follow-ups

The page now has a compact header. The empty state still uses the existing `StandardEmptyState` (or a custom hero) until each page gets the `OnboardingEmptyState` treatment.

| Page | Compact header | Onboarding empty state |
| ---- | -------------- | ---------------------- |
| `/analytics` | ✅ | TODO — sloth-with-charts |
| `/answers` | ✅ | TODO — per-tab sloth-with-flashcards |
| `/ats` | ✅ | TODO — sloth-feeding-resume-into-machine |
| `/calendar` | ✅ | TODO — sloth-with-day-planner |
| `/components` | ✅ | ✅ shipped |
| `/interview` | ✅ | TODO — sloth-with-index-cards |
| `/opportunities` | ✅ | TODO — migrate existing `empty-hero.tsx` to new primitive |
| `/opportunities/[id]/research` | ✅ | TODO — sloth-with-magnifying-glass |
| `/opportunities/review` | (no `PageHeader`) | TODO — sloth-at-empty-inbox |
| `/profile` | ✅ | N/A (form) |
| `/settings` | ✅ | N/A (form) |
| `/toolkit` | ✅ | TODO — per-tab illustrations |
| `/dashboard` | uses `EditorialDashboardHeader` — no change needed | TODO — fresh-account onboarding hero |
| `/studio` | workspace — no `PageHeader` | TODO — sloth-at-typewriter |
| `/upload` | not yet audited | TODO |
| `/documents` | not yet audited | TODO |
| `/extension/connect` | not yet audited | TODO |



## Why this exists

Today's app pages start with a tall `PageHeader` block: title, icon tile, two-line description, action cluster. The sidebar already names the section ("Library → Components"), so the title and description are restated for every page load. The buttons end up bottom-aligned against a two-line paragraph, which is what creates the orphan whitespace above them.

Meanwhile, **empty states are anemic.** Most pages reuse `StandardEmptyState` — one icon, one line, one button. That's the wrong place to be sparse. Empty states are the only moment a new user has full attention on *what this page is for*. We're spending pixels on returning-user reminders instead.

The plan: **flip the budget.** Compact header for everyone. Rich, illustrated, diagram-led empty states for new users and zero-result moments. Sloth illustrations carry the brand voice ("you're not lazy — your system is").

## Design direction

### Header pattern (every app page)

- **One row, ~48px tall.** Vertically centered.
- Left: `[icon] Title` + optional inline meta chip (count, status, last sync).
- Right: action cluster (primary on far right, dark fill; secondary outlined).
- **No description paragraph in the header.** Description moves to either:
  - the empty state (when there is no data), or
  - an `(i)` info popover next to the title (for power users / sidebar-collapsed sessions).
- Tabs / segmented controls sit on a second row *below* the header line, not crammed into the title row.
- Tight breakpoint behavior: at `<sm`, primary action keeps label; secondaries collapse to icon-only.

`PageHeader`, `InsetPageHeader`, `PagePanelHeader` all converge on this single row pattern. The current `PageHeader` (3xl/4xl `h1`, icon tile, max-w-3xl description, xl:flex-row actions) is the most expensive offender — that's where most of the height comes from.

### Empty state taxonomy

Four shapes, each gets its own primitive:

| Shape | When it fires | What it carries |
| ----- | ------------- | --------------- |
| **`OnboardingEmptyState`** | User has 0 of X *and has never had any* | Illustration, 1-line headline, 2–3 line value prop, 2–3 step "how it works" diagram, primary CTA, secondary "learn more" link |
| **`ZeroResultEmptyState`** | Filter / search / date range returns 0 but data exists | Small illustration, "no matches" line, **"Clear filters"** action, list of currently active filters as chips to remove individually |
| **`ErrorEmptyState`** | Fetch failed | Sloth-with-clipboard illustration, error summary, "Retry" + "Report" actions, optional error code in mono |
| **`PrerequisiteEmptyState`** | Feature locked behind another step (e.g. ATS scanner needs a resume) | Illustration, "you need X first" copy, deep-link to the prerequisite page, optional "skip with sample data" for demos |

The current `StandardEmptyState` becomes the low-key fallback (still used inside small panels and tabs), but app-level zero states upgrade to `OnboardingEmptyState`.

### Sloth illustration system

- **One illustration per feature**, generated via codex image gen (or similar), stored as static SVG/PNG in `apps/web/public/illustrations/empty/<page>-<state>.{svg,png,webp}`.
- Concept: a single sloth interacting with the **feature's actual artifact** — a sloth reading a resume for `/components`, a sloth peering at a calendar for `/calendar`, a sloth tangled in interview index cards for `/interview`. Avoid generic "cute mascot waving" — the illustration is itself a diagram.
- Style guardrails (locked in a prompt template — see `docs/empty-states-and-headers-plan/illustration-prompt.md` TBD):
  - Palette pulled from active theme: cream paper background, indigo + rust accents, line-weight matches editorial rules.
  - Slight hand-drawn quality, no glossy 3D render, no AI-generic gradients.
  - No copy *inside* the illustration — text always lives outside so we can translate.
  - 1:1 aspect, ~480×480 source, displayed ~280×280 desktop / 200×200 mobile.
- **Diagram-led, not decoration-led.** Each empty state pairs the illustration with a small **3-step numbered diagram** describing how the feature works (e.g. for Components: `1. Upload resume → 2. We extract bullets → 3. Studio composes a tailored doc`). The diagram is HTML/SVG, not part of the raster illustration — keeps it translatable and theme-aware.

## Per-page audit

App routes only. Marketing pages skip this pass (they already are the editorial reference). Redirect-only routes (`/jobs`, `/builder`, `/tailor`, `/cover-letter`) are excluded.

Format: `Page` — `Current header copy` → `Proposed header` · `Empty state(s) to design`.

### `/dashboard`
- **Current:** `EditorialDashboardHeader` with title + subline. Already relatively tight.
- **Header:** Keep — this is the closest existing pattern to the new target. Verify subline is dynamic and never redundant with sidebar.
- **Empty states:**
  - **Fresh account** (no opportunities, no resume): big onboarding card titled "Let's get your search system running" with 3-step diagram (Add resume → Connect inbox → Track first role). Sloth carrying a moving box. **Highest priority illustration.**
  - **Empty activity feed:** small sloth-napping illustration + "No activity yet — once you start applying we'll log it here."

### `/opportunities`
- **Current:** Custom hero (`empty-hero.tsx`) already exists for zero state — good. Header has full title + description.
- **Header:** `[briefcase] Opportunities · 24 active` left, `[+ Add]` + `[Filters]` right.
- **Empty states:**
  - **Zero opportunities:** keep current hero but upgrade with sloth-at-desk illustration + 3-step diagram (Add role → Tailor docs → Track status). Audit `empty-hero.tsx` against the new `OnboardingEmptyState` primitive.
  - **Filtered to zero:** new `ZeroResultEmptyState` with active filter chips.

### `/opportunities/[id]`
- **Header:** company name + role + status pill in a single row. No description.
- **Empty states:** when an opportunity has zero tailored docs / zero notes / zero events, each panel gets a mini `StandardEmptyState` (the low-key one is correct here — it's a sub-panel, not the whole page).

### `/opportunities/[id]/research`
- **Header:** breadcrumb back to opportunity + "Research" label. Inline meta: last refreshed.
- **Empty states:**
  - **Not yet researched:** `OnboardingEmptyState` — "We haven't researched [Company] yet. Hit run to pull public signal." Sloth-with-magnifying-glass.
  - **Research failed:** `ErrorEmptyState`.

### `/opportunities/review`
- **Current:** Inbound queue for scraped/extension opportunities.
- **Header:** `[inbox] Review · 7 pending` + bulk-action toolbar (Accept all / Dismiss all) on the right.
- **Empty states:**
  - **Empty inbox:** `OnboardingEmptyState` — "Nothing to review. New roles from the extension or scraping land here first." Sloth holding an empty inbox tray. Include "Install the extension" CTA if not installed (prerequisite chained).
  - **Not yet connected (extension never installed):** `PrerequisiteEmptyState` linking to `/extension/connect`.

### `/studio`
- **Current:** Workspace layout (uses `PageWorkspace`, not standard header). Studio is a doc editor, so a tall page header doesn't apply — it has its own toolbar.
- **Header:** Keep existing toolbar pattern. Audit for any redundant text.
- **Empty states:**
  - **No documents yet:** full-bleed onboarding panel — "Studio composes tailored resumes + cover letters from your Component library." 3-step diagram (Pick role → Pick components → Export). Sloth-at-typewriter illustration.
  - **Document open but components library empty:** inline banner inside the composer pointing back to `/components`.

### `/components`
- **Current — and this is the screenshot we're fixing:** `<PageHeader title="Components" description="Reusable bullets, stories, and project chunks pulled from your resume — the source material Studio composes into tailored documents." />` with three buttons (Add Entry / From Drive / Upload).
- **Header:** `[database] Components · {count}` left, `[+ Add] [Drive] [Upload]` right. Drop the description.
- **Empty states:**
  - **Zero components, no upload yet:** big onboarding panel — sloth pulling threads out of a resume into labeled cards. Headline: "Components are the building blocks of every tailored document." 3-step diagram (Upload resume → We extract bullets → Studio composes). Primary CTA `Upload resume`, secondary `Paste manually`.
  - **Upload in progress, zero structured components detected:** existing copy `noComponentsDetected` survives, but rewrap in `ErrorEmptyState` styling.
  - **Filtered to zero:** `ZeroResultEmptyState`.

### `/answers`
- **Current:** Tabbed page (uses `StandardEmptyState` per tab).
- **Header:** `[message-circle] Answers · {count}` + tab strip below.
- **Empty states:**
  - **Per tab:** sloth-with-flashcards illustration. Headline matched to the tab ("Behavioral answers", "Technical answers", "Salary answers", etc.). 3-step diagram (Drop a question → AI drafts an answer → You edit + save).

### `/calendar`
- **Current:** Uses `StandardEmptyState`.
- **Header:** `[calendar] Calendar` + view toggle (Month / Week / Agenda) on the right.
- **Empty states:**
  - **No events:** sloth-with-day-planner illustration. "Nothing scheduled yet. Interview prep, follow-ups, and reminders show up here." CTA: "Connect Google Calendar" if not connected, else "Add event".
  - **Calendar disconnected:** `PrerequisiteEmptyState` to settings.

### `/interview`
- **Current:** Uses `PageHeader`.
- **Header:** `[mic] Interview prep` + scenario selector.
- **Empty states:**
  - **No prep sessions yet:** sloth-with-index-cards illustration. 3-step diagram (Paste job → Generate questions → Practice answers). CTA "Start prep".

### `/ats`
- **Current:** Uses `PageHeader` and has its own `ats-scanner-panel.tsx` with empty state.
- **Header:** `[scanner] ATS scanner` + recent scans count.
- **Empty states:**
  - **No scan yet:** sloth-feeding-resume-into-machine illustration. 3-step diagram (Paste JD → Drop resume → See keyword gaps).
  - **No resume on file:** `PrerequisiteEmptyState` to `/components` or `/studio`.

### `/toolkit`
- **Current:** Uses `PageHeader`, tabbed (Email templates, Salary research, …).
- **Header:** `[wrench] Toolkit` + tab strip.
- **Empty states (per tab):**
  - **Email templates:** sloth-licking-envelope illustration. "Pre-built outreach, follow-up, and thank-you templates."
  - **Salary research:** sloth-counting-coins. "Pull salary bands for any role + level."
  - Each tab gets its own 3-step diagram.

### `/analytics`
- **Current:** Uses `PageHeader` and `PagePanelHeader` per section.
- **Header:** `[bar-chart] Analytics` + date range picker.
- **Empty states:**
  - **No data yet:** sloth-with-charts illustration. "We need 3+ tracked opportunities before charts get interesting." Direct link to `/opportunities`.
  - **Per-panel empty:** small `StandardEmptyState` is fine — keep it low-key, the page header already framed it.

### `/profile`
- **Header:** `[user] Profile` (no description — it's literally a form). Save action stays sticky bottom.
- **Empty states:** N/A (forms don't have empty states; they have unfilled fields).

### `/settings`
- **Header:** `[settings] Settings` + tab strip (Account, Billing, Theme, …).
- **Empty states:** N/A per above. Each tab is a form.

### `/extension/connect`
- **Header:** `[puzzle] Browser extension` + connection status pill.
- **Empty states:**
  - **Not connected:** big onboarding panel — sloth holding a chrome puzzle piece. 3-step diagram (Install → Sign in → Capture roles). Browser-specific CTAs (Chrome / Firefox / Edge).
  - **Connected, no roles captured yet:** sloth waiting at a window. "Visit any job board — we'll quietly capture roles you open."

### `/upload`
- **Header:** `[upload] Upload` (no description).
- **Empty states:** the page **is** an empty state. Keep the drop-zone front and center, sloth-with-papers illustration above the drop zone, 3-step "what happens after upload" diagram below.

### `/documents`
- **Header:** `[file] Documents · {count}` + view toggle.
- **Empty states:**
  - **Zero docs:** sloth-with-filing-cabinet illustration. "Tailored resumes and cover letters from Studio land here."
  - **Filtered to zero:** `ZeroResultEmptyState`.

### Redirect-only / deprecated
Confirm and skip:
- `/jobs` — 308 to `/opportunities` per CLAUDE.md.
- `/builder` — 308 to `/studio`.
- `/tailor` — 308 to `/studio`.
- `/cover-letter` — 308 to `/studio`.
- `/bank`, `/answer-bank`, `/emails`, `/salary` — *verify* these are redirects (file exists in route tree, may be legacy). If active, audit and add to this doc.

## Implementation phases

### Phase 1 — Primitives (no per-page edits yet)
- [ ] Convert `PageHeader` to the single-row pattern. Behind a prop flag (`variant="compact"` default) so we can flip pages incrementally.
- [ ] Add `OnboardingEmptyState`, `ZeroResultEmptyState`, `ErrorEmptyState`, `PrerequisiteEmptyState` to `src/components/ui/page-layout.tsx` (or a new `src/components/ui/empty-states.tsx`).
- [ ] Add `<HowItWorksDiagram steps={[…]} />` primitive — numbered 3-step horizontal flow with optional icon per step.
- [ ] Add `<EmptyIllustration name="…" />` primitive — loads SVG from `/public/illustrations/empty/<name>.svg`, falls back to lucide icon if asset missing, theme-aware via CSS filters or matched SVG variants for light/dark.
- [ ] Storybook entries / docs page demonstrating all four shapes + a few illustrations.
- [ ] Snapshot + a11y tests.

### Phase 2 — Illustration generation
- [ ] Lock the illustration style prompt (`docs/empty-states-and-headers-plan/illustration-prompt.md`).
- [ ] Generate the first 5 (highest-traffic pages): `dashboard-fresh`, `components-zero`, `opportunities-zero`, `studio-zero`, `upload-zero`.
- [ ] QA: light + dark + each non-default theme preset. Adjust palette as needed.
- [ ] Batch 2: remaining ~10.

### Phase 3 — Per-page rollout
Roll out in this order to derisk:
1. `/components` (the page that prompted this — also validates the pattern on a complex page).
2. `/opportunities` (highest traffic, already has a custom hero to migrate).
3. `/dashboard` (sets the tone for new users).
4. `/studio` (workspace shape, validates the pattern works for non-list pages).
5. Everything else in alphabetical-ish order.

For each page in this phase:
- Header → compact variant.
- Wire empty states to the new primitives.
- Update copy. Confirm description copy is either deleted or moved into the empty state.
- Add/update an e2e or screenshot test for the empty case.
- Run forbidden-color lint + type-check.

### Phase 4 — Cleanup
- [ ] Remove `description` prop from `PageHeader` once all callers are migrated (or keep it but mark deprecated and lint against new uses).
- [ ] Delete unused empty-state copy strings from i18n bundles.
- [ ] Update `docs/ui-redesign-plan.md` decisions log with the outcome.

## Open questions

1. **Where do feature explanations live for returning users?** If we kill the header description, a user who collapses the sidebar loses the page's identity. Options: (a) `(i)` popover next to title, (b) breadcrumb shows current section, (c) accept that the icon + title is enough. **Recommendation: (a) for the first three months, then measure popover usage and decide.**
2. **Translation cost.** Each empty state now carries ~30 more words than the current `StandardEmptyState`. Confirm with i18n budget before generating 15 panels of copy.
3. **Illustration ownership.** Codex image-gen is fine for v1, but who owns iteration? Consider: ship v1 generated, then a designer pass before any marketing push.
4. **Dark mode illustrations.** Two variants per illustration (light + dark)? Or one with CSS `mix-blend-mode` adjustments? **Recommendation: two variants — blend modes are unreliable across the 7 theme presets.**
5. **A11y for illustrations.** Decorative `alt=""` everywhere, or named `alt`? **Recommendation: empty `alt` — the headline and diagram carry the meaning, illustration is decoration.**

## Appendix — current vs. proposed header (Components example)

```
BEFORE
┌────────────────────────────────────────────────────────────────┐
│ [icon]  Components                                              │
│         Reusable bullets, stories, and project chunks pulled    │
│         from your resume — the source material Studio composes  │
│         into tailored documents.        [+ Add] [Drive] [Upload]│
└────────────────────────────────────────────────────────────────┘
  ~120px tall, buttons orphaned below paragraph

AFTER
┌────────────────────────────────────────────────────────────────┐
│ [icon] Components · 24      (i)         [+ Add] [Drive] [Upload]│
└────────────────────────────────────────────────────────────────┘
  ~48px tall, single baseline
```
