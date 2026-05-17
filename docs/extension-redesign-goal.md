# Extension Redesign and Improvement Goal

## North-star goal

Make the Slothing browser extension feel like a first-party part of the Slothing
web app, not a separate add-on. The popup, options page, in-page sidebar,
inline prompts, badges, and content-script UI should use the same editorial
paper-and-ink system as the website: warm cream surfaces, Midnight Indigo ink,
rust accent, restrained borders, flat cards, dense tool surfaces, and clear
workflow states.

The redesign should preserve the extension's current functionality while making
each action easier to scan, safer to trigger, and more consistent with the web
app's current `slothing` theme.

## Current status

As of May 16, 2026:

- TypeScript passes for `@slothing/extension`.
- Vitest passes: 27 files, 244 tests.
- Chrome and Firefox production builds pass.
- Chromium Playwright e2e passes: 21 passed, 1 skipped.
- `web-ext lint` on `apps/extension/dist-firefox` reports 0 errors, 32 warnings.
- The Firefox build is loadable manually through
  `about:debugging#/runtime/this-firefox`.

Known release warnings:

- Firefox manifest is missing Gecko data-collection metadata.
- Firefox MV2 bundle includes `chrome.action.*` badge calls that should use
  `browserAction` compatibility handling.
- `storage.session` is warned against the declared Firefox 112 minimum.
- Some `innerHTML` assignments need review before AMO submission.
- Automated extension e2e coverage is Chromium-only.

## Feature inventory

### Account and auth

- Connects to Slothing through `/extension/connect`.
- Stores extension token in browser extension storage.
- Supports localStorage fallback transport for Firefox.
- Shows unauthenticated, authenticated, error, and session-lost states.
- Supports disconnect/logout from the popup.

### Popup workflows

- Detects whether the active tab has an application form.
- Detects whether the active tab has a single job listing.
- Detects bulk board/list pages for supported ATS sources.
- Auto-fills detected application forms.
- Imports current job into the opportunity tracker.
- Generates a tailored resume from the current job.
- Generates a cover letter from the current job.
- Lets the user choose a base resume before tailoring.
- Opens dashboard, opportunity detail, and review queue deep links.
- Shows profile summary and profile completeness score.

### Scraping and import

- Scrapes LinkedIn job pages and lists.
- Scrapes Indeed job pages and lists.
- Scrapes Greenhouse job pages and board rows.
- Scrapes Lever job pages and board rows.
- Scrapes WaterlooWorks job pages and visible/paginated lists.
- Scrapes Workday job pages and visible/paginated lists.
- Falls back to generic JSON-LD `JobPosting` extraction.
- Supports batch import with duplicate counts and review-queue handoff.

### Autofill and application flow

- Detects 35+ application field types using name, id, label, placeholder,
  autocomplete, and ARIA signals.
- Maps profile data into text inputs, textareas, selects, checkboxes, radios,
  and date inputs.
- Supports confidence thresholds and optional confidence indicators.
- Tracks user corrections to improve field mapping.
- Supports multi-step Workday and Greenhouse flows using `webNavigation`.
- Falls back to an in-page prompt when navigation permissions are unavailable.
- Does not auto-submit applications.

### Learning and answer bank

- Detects custom/freeform application questions.
- Prompts to save typed answers.
- Searches learned answers and Answer Bank matches.
- Applies or copies saved answers from the in-page sidebar.
- Lets users delete learned answers from the options page.

### In-page sidebar and assistant

- Injects a collapsible Slothing sidebar on job pages.
- Shows scraped job title/company/location.
- Shows profile/job match score.
- Provides Tailor resume, Cover letter, Save job, and Auto-fill actions.
- Includes Answer Bank search.
- Includes a streaming inline AI chat panel.
- Persists sidebar dismissal per domain.
- Hides below the desktop breakpoint.

### Tracking and notifications

- Shows toolbar badge when a job is detected.
- Tracks submitted applications when enabled.
- Optionally captures a screenshot when tracking submitted applications.
- Sends tracked applications to extension API routes.

### Settings

- Configurable API base URL.
- Toggle auto-fill.
- Toggle confidence indicators.
- Set minimum confidence threshold.
- Toggle learned-answer capture.
- Toggle submitted-application tracking.
- Toggle screenshot capture.
- Toggle job-detected badge notifications.
- View/delete learned answers.

## Visual system target

Use the web app's current Slothing editorial tokens as the source of truth.

Core light-mode tokens:

```css
--bg: #f5efe2;
--bg-2: #e9dec8;
--paper: #fffaef;
--ink: #1a1530;
--ink-2: #3a2f24;
--ink-3: #6a5e4a;
--rule: rgba(26, 20, 16, 0.12);
--rule-strong: rgba(26, 20, 16, 0.4);
--rule-strong-bg: rgba(26, 20, 16, 0.07);
--brand: #b8704a;
--brand-dark: #8e5132;
--brand-soft: #f0d9c1;
--r-sm: 6px;
--r-md: 10px;
--r-lg: 14px;
--r-pill: 9999px;
```

Core dark-mode tokens, if dark support is implemented in this pass:

```css
--bg: #0f1226;
--bg-2: #1a1d38;
--paper: #161936;
--ink: #f6ecd6;
--ink-2: #d2c5a8;
--ink-3: #8a83a8;
--rule: rgba(246, 236, 214, 0.1);
--rule-strong: rgba(246, 236, 214, 0.32);
--brand: #e09060;
--brand-dark: #b8704a;
--brand-soft: rgba(224, 144, 96, 0.18);
```

Interaction rules:

- Primary action: ink background, cream text.
- Secondary action: paper background, rule border, ink text.
- Rust accent: use for emphasis, focus, selected states, and status highlights,
  not as a full-page wash.
- Cards: flat paper with one rule border; reserve elevation for popovers,
  drawers, hover lift, and sidebar attachment.
- Radius: 6-10px for compact controls and cards.
- Text: no negative letter spacing in compact panels; use display treatment only
  for true headings.
- Icons: use simple familiar glyphs in icon-sized controls where the extension
  cannot import web app icon components. Avoid text-only utility buttons when an
  icon affordance is clearer.
- Compact density: extension surfaces should be denser than marketing pages.

## Redesign scope

Primary files:

- `apps/extension/src/popup/styles.css`
- `apps/extension/src/options/styles.css`
- `apps/extension/src/content/sidebar/styles.ts`
- `apps/extension/src/content/ui/styles.css`
- `apps/extension/src/content/multistep/prompt-fallback.ts`
- `apps/extension/src/content/learning/answer-capturer.ts`

Secondary files, only if markup changes are needed:

- `apps/extension/src/popup/App.tsx`
- `apps/extension/src/popup/BulkSourceCard.tsx`
- `apps/extension/src/options/App.tsx`
- `apps/extension/src/content/sidebar/job-page-sidebar.tsx`
- `apps/extension/src/content/sidebar/chat-panel.tsx`
- `apps/extension/src/content/ui/answer-bank-button.tsx`

Out of scope for the first redesign pass:

- Rewriting scraper logic.
- Rewriting auth flow.
- Changing API contracts.
- Adding new dependencies.
- Changing web app theme tokens in `apps/web/src/app/globals.css`.
- Changing `apps/web/src/lib/theme/presets/slothing.ts`.

## Current two-surface direction

The current product direction is specified in
`docs/extension-two-surface-redesign-spec.md`.

Short version:

- Toolbar popup is the control center: account, profile, current-tab health,
  open/restore job tools, refresh, dashboard/settings, and bulk board import.
- In-page panel is the job workspace: tailor resume, cover letter, save job,
  autofill, AI assistant, and answer bank.
- The browser toolbar popup cannot be draggable or docked; docking applies to
  the in-page workspace.
- Slothing UI branding should use the web app public brand assets as source of
  truth, especially `apps/web/public/brand/slothing-mark.png` and
  `apps/web/public/brand/slothing-logo.png`.

## Phase 1: Token alignment

Create a shared extension token block for popup/options/content surfaces.

Acceptance:

- Popup/options/sidebar no longer use the old violet/rose theme.
- Sidebar no longer uses the green/white visual system.
- Extension UI names map clearly to web tokens: background, paper, ink, muted
  ink, rule, brand, brand-soft, success, warning, danger.
- Existing tests still pass.

Suggested approach:

- Add consistent CSS variables in each isolated CSS surface.
- Keep duplicated token blocks acceptable for now because popup/options/content
  run in separate CSS contexts.
- Avoid introducing a bundling dependency just to share CSS variables.

## Phase 2: Toolbar popup redesign

Redesign the browser toolbar popup as a compact control center. It should
diagnose the active tab and open/restore the in-page workspace, not duplicate
the job workspace actions.

Target structure:

1. Header: brand mark, "Slothing", compact connected/session status.
2. Profile strip: name/email/current role, profile score, synced time if present.
3. Page context:
   - Job workspace active.
   - Application form detected.
   - Job detected.
   - Bulk board detected.
   - Page needs refresh.
   - Unsupported page.
4. Primary commands:
   - Open/restore job tools.
   - Refresh tab.
   - Open review queue after bulk import.
   - Bulk scrape visible/paginated rows on listing pages only.
5. Utility footer: dashboard, settings, disconnect.

Out of scope for the toolbar popup:

- Tailor resume.
- Cover letter.
- Save current job.
- Auto-fill current application.
- AI assistant.
- Answer Bank search.

Acceptance:

- No nested card-on-card appearance.
- Main command is obvious for each detected state.
- Job context card handles long titles and company names without layout shifts.
- Bulk cards fit within popup width without truncating critical counts.
- Idle and unsupported states are truthful and compact.
- Toolbar and in-page workspace derive from the same page/profile context.
- Loading, error, unauthenticated, and session-lost states match the same visual
  system.

## Phase 3: Options redesign

Make the options page look like a compact Slothing settings page.

Acceptance:

- Header and sections use paper/ink/rust tokens.
- Settings are grouped by workflow: Connection, Autofill, Learning, Tracking,
  Notifications, Saved Answers, About.
- Save-status pills are single-line and unobtrusive.
- Range/checkbox/input controls have consistent focus and hover states.
- Destructive saved-answer deletion has a clear affordance and does not look
  like a primary action.
- The placeholder GitHub URL is either corrected or removed.

## Phase 4: In-page job workspace redesign

Make the in-page panel feel like the active job workspace, not a generic widget
or a second account popup.

Acceptance:

- Rail and panel use the Slothing editorial palette.
- The collapsed rail communicates score and brand without vertical text feeling
  awkward.
- Header handles long job titles/company/location with predictable wrapping.
- Header includes workspace controls: dock left, dock right, float, collapse,
  and close/dismiss.
- Action buttons are scannable and have consistent loading/disabled states.
- The workspace owns Tailor resume, Cover letter, Save job, Auto-fill, AI
  assistant, and Answer Bank actions.
- Match score uses rust/ink/status tokens, not green-only scoring.
- Large score-circle treatment is replaced with a compact score/status strip.
- Chat and Answer Bank sections read as tool panels, not marketing cards.
- Sidebar is visually distinct from host pages without being loud.
- Floating position/docking/collapsed state persists per domain.
- Dismissed workspace can be restored from the toolbar popup.
- Mobile/desktop breakpoint behavior remains unchanged.

## Phase 5: Inline content UI redesign

Bring smaller injected surfaces into the same system.

Targets:

- Answer-bank inline button/popover.
- Confidence indicators.
- Learned-answer save prompt.
- Multi-step fallback prompt.
- Applied/tracking toast.
- Field highlights and correction UI.

Acceptance:

- Injected elements are visually consistent with sidebar/popup.
- No injected UI blocks application form inputs.
- Prompts have clear Yes/No/Skip affordances.
- Focus states are keyboard-visible.
- Long text wraps without overlapping controls.

## Phase 6: Firefox release cleanup

Address Firefox-specific warnings after the redesign is stable.

Acceptance:

- `web-ext lint -s apps/extension/dist-firefox` has 0 errors and materially
  fewer warnings.
- `chrome.action.*` usage is compatibility-wrapped for Firefox MV2
  `browserAction`.
- `storage.session` paths have a durable fallback or the Firefox minimum is
  adjusted intentionally.
- `browser_specific_settings.gecko.data_collection_permissions` is present.
- `innerHTML` warnings are either removed or documented as sanitized/controlled.
- Manual Firefox test checklist passes.

## Verification commands

Run from repo root:

```bash
pnpm --filter @slothing/extension type-check
pnpm --filter @slothing/extension test:run
pnpm --filter @slothing/extension build:chrome
pnpm --filter @slothing/extension build:firefox
pnpm --filter @slothing/extension check:bundle-size
pnpm --filter @slothing/extension test:e2e
pnpm dlx web-ext@latest lint -s apps/extension/dist-firefox
```

Manual Firefox smoke:

1. Build Firefox extension.
2. Open `about:debugging#/runtime/this-firefox`.
3. Load `apps/extension/dist-firefox/manifest.json`.
4. Start the web app locally.
5. Connect account through the popup.
6. Open `apps/extension/demo/job-form.html` through a localhost server.
7. Verify popup state, autofill, import, sidebar, options, and disconnect.

## Post-redesign improvement backlog

Prioritize after visual parity is done.

### P0: Safety and release readiness

- Firefox compatibility cleanup from Phase 6.
- Add a Firefox-focused manual QA checklist to `apps/extension/README.md`.
- Add AMO submission notes and required privacy/data-collection copy.
- Add a site diagnostics panel: content script loaded, scraper matched, auth ok,
  API ok, last error.

### P1: Autofill trust

- Review-before-fill drawer: show detected fields, confidence, source value, and
  skipped fields before filling.
- Per-field undo after autofill.
- "Never fill this field" and "Never fill this site" controls.
- Existing-value conflict mode: ask before overwriting user-entered content.
- Explain low-confidence skips in plain language.

### P1: Import and bulk workflow

- Pre-import duplicate preview in popup.
- Bulk import queue with row-level include/exclude before sending.
- Bulk scrape pause/cancel.
- Better progress display for paginated scrapes.
- Add "Open review queue" as persistent post-import action.

### P1: Documents

- Resume upload/attach support for file inputs.
- Let users choose default resume per site/source.
- Show recently tailored resumes for the detected company/job.
- Add "tailor from selected opportunity" handoff if the job is already tracked.

### P2: Sidebar assistant

- Suggested prompts based on current application question.
- "Draft answer from profile" next to long textareas.
- Inline citation/source hints for AI-generated answers.
- Save generated answer back to Answer Bank.
- Better streamed response actions: copy, insert, use in cover letter, save.

### P2: Site support

- Add Taleo support.
- Harden Workday tenant variants with more live fixtures.
- Harden employer-hosted Greenhouse iframe behavior.
- Add public test fixture capture docs for scraper regressions.

### P2: Personalization

- Sync website theme preference into extension storage.
- Optional compact/comfy density setting.
- Per-site sidebar dismissal and action preferences.
- Per-source default import behavior.

## Definition of done

The redesign is done when:

- Popup, options, sidebar, and inline prompts visibly match the website's
  Slothing editorial system.
- All extension automated gates pass.
- Firefox build loads manually and the smoke checklist passes.
- No feature from the current inventory regresses.
- Remaining additions are captured in the backlog above, not mixed into the
  visual redesign pass.
