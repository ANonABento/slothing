# Core Flow Dogfood Remediation Spec - 2026-05-16

## Status

Proposed. Based on the local dogfood run against `http://localhost:3000` on
2026-05-16.

## Source Audit

Artifacts from the run live outside the repo at:

`/tmp/slothing-dogfood-2026-05-16`

Key captured files:

- `api.json` - API responses from upload, bank, opportunity, ATS, and settings
  calls.
- `events.json` - browser actions, screenshots, console errors, and UI notes.
- Screenshots `01` through `27` - empty state, upload review, opportunity
  wizard, opportunity drawer/detail, ATS dialog, and Studio paths.

## Goal

Make the first-run core flow reliable and understandable:

1. Start from a clean local default user.
2. Upload a resume.
3. Review parsed components.
4. Create a target opportunity.
5. Analyze fit and ATS quality.
6. Build or tailor a resume in Studio.
7. Export the resulting resume.

The product should complete that path without hidden provider assumptions,
unclickable controls, ambiguous state, or inaccessible pseudo-controls.

## Non-Goals

- Rebuild the whole Studio layout.
- Replace the deterministic parser.
- Add a hosted billing flow.
- Solve every AI provider edge case. This spec focuses on local/self-host
  dogfood reliability and clear failure states.

## Baseline From Dogfood

The clean local DB was reset for user `default`. The run uploaded a deterministic
Riley Chen resume and created a deterministic ExampleWorks opportunity.

Observed good behavior:

- Upload succeeded.
- Resume classification succeeded.
- Deterministic parser returned `0.925` confidence with no LLM usage.
- `21` components were created:
  - `2` experience roots
  - `5` bullets
  - `1` education entry
  - `13` skills
- Profile auto-promotion persisted contact, summary, experiences, education,
  and skills.
- Manual opportunity creation persisted the job.
- ATS check succeeded with an overall score of `82`.

Observed failures and friction:

- `Analyze Match` returned `500`.
- Detail-page `Resume` generation returned `500`.
- The opportunity drawer's `Tailor in Studio` link was visually present but
  blocked by the drawer scrim.
- `/studio?opportunity=<id>` did not preload the opportunity description.
- Studio bank picker rows look like checkboxes but are implemented as buttons.
- Studio generation state is unclear and did not persist after reload.
- TXT upload review says preview cache expired/unavailable, even though TXT is
  simply not previewable as a PDF.
- Parser normalization issues: `bilingual English/French.` kept punctuation and
  was classified as technical; education year was not captured.
- ATS keyword matching missed useful synonym evidence such as `Postgres` for
  `PostgreSQL`, and omitted `French` from the expected keyword review.

## Product Principles

- The local self-host path must work without a live LLM daemon.
- AI actions must fail with actionable provider status, not generic 500s.
- Deep links should carry user intent. If a URL has `opportunity=<id>`, Studio
  should load that opportunity.
- Controls that look like checkboxes must behave like checkboxes.
- Generated or selected document state must persist or clearly say it is a
  draft-only preview.
- Parser output should be normalized before it enters the reusable bank.

## Phase Plan

### Phase 0 - Reproducible Dogfood Harness

Create a focused E2E dogfood spec that can reproduce this flow on demand.

Target file:

- `apps/web/e2e/dogfood-core-flow.spec.ts`

Fixtures:

- Reuse or add `apps/web/tests/fixtures/dogfood/riley-resume.txt`.
- Reuse or add `apps/web/tests/fixtures/dogfood/exampleworks-senior-product-engineer.md`.

Requirements:

- Start from a clean local SQLite DB for the test user.
- Upload the resume through the visible UI.
- Assert upload response:
  - `document.type === "resume"`
  - `entriesCreated >= 15`
  - `parsing.llmUsed === false`
- Assert persisted profile includes Riley contact, two experiences, education,
  and expected skills.
- Create the opportunity through the wizard.
- Assert opportunity appears in list and drawer.
- Assert ATS check returns a score and opens the dialog.
- Mark AI-dependent assertions separately so they can run in both:
  - deterministic fallback mode
  - live provider mode

Acceptance:

- The test is stable in Chromium with auth bypass.
- The test does not depend on hosted credentials.
- The test records enough failure context to diagnose parser, UI, or API
  regressions.

### Phase 1 - Stop AI Actions From Hard-Failing

#### Problem

`/api/opportunities/:id/analyze` and `/api/opportunities/:id/generate` returned
500 in local dev. The app reported Ollama as configured, but the action failed
instead of falling back or explaining provider connectivity.

Likely files:

- `apps/web/src/app/api/opportunities/[id]/analyze/route.ts`
- `apps/web/src/app/api/opportunities/[id]/generate/route.ts`
- `apps/web/src/lib/billing/ai-gate.ts`
- `apps/web/src/lib/llm/client.ts`
- `apps/web/src/components/opportunities/opportunity-actions.tsx`

Proposed behavior:

- `Analyze Match` should always produce a deterministic keyword analysis if no
  usable provider is available.
- Detail-page `Resume` generation should always produce a deterministic resume
  if no usable provider is available.
- If a provider is configured but unreachable, the response should be a typed
  provider error with:
  - `code: "provider_unavailable"`
  - provider name
  - model/base URL when relevant
  - whether deterministic fallback was used
- The UI toast should say what happened:
  - "Ollama is not reachable, so Slothing used deterministic matching."
  - Or "Ollama is not reachable. Start Ollama or choose another provider."

Implementation notes:

- Split "provider configured" from "provider usable".
- Add a provider health probe or convert known LLM transport errors into typed
  fallback responses.
- For analyze, prefer deterministic fallback rather than failing.
- For generate, call `generateTailoredResume(profile, job, null)` when the LLM
  request fails before any irreversible writes.
- Preserve credit refund behavior for hosted paid paths.

Acceptance:

- With no Ollama running, `Analyze Match` returns `200` with deterministic
  analysis and an explicit `fallbackUsed: true`.
- With no Ollama running, `Resume` generation returns `200`, writes a generated
  resume row, and opens a deterministic resume.
- With a live provider, existing AI behavior still works.
- No generic 500 is returned for expected provider connectivity failures.

Tests:

- Unit tests for provider-unavailable error classification.
- Route tests for analyze and generate fallback.
- E2E assertion in the dogfood core flow.

### Phase 2 - Fix Opportunity To Studio Handoff

#### Problem A - Drawer Link Is Blocked

The opportunity drawer renders `Tailor in Studio`, but the scrim intercepts
clicks. A visible primary CTA is not usable.

Likely files:

- `apps/web/src/app/[locale]/(app)/opportunities/_components/opportunity-drawer.tsx`
- `apps/web/src/components/editorial/*`

Proposed behavior:

- The drawer panel should sit above the scrim in stacking order.
- The scrim should only intercept clicks outside the panel.
- All footer CTAs inside the drawer must be clickable by mouse and keyboard.

Acceptance:

- Playwright can click `Tailor in Studio` from the drawer.
- Clicking outside the panel still closes the drawer.
- Keyboard focus remains trapped inside the drawer while open.

Tests:

- E2E: open opportunity drawer, click `Tailor in Studio`, assert URL contains
  `/studio?opportunity=<id>`.
- Component-level regression if the drawer primitive has a test harness.

#### Problem B - Studio Ignores `opportunity` Query Param

Opening `/studio?opportunity=<id>` shows Studio but does not load the job
description. Users must manually select the same opportunity again.

Likely files:

- `apps/web/src/app/[locale]/(app)/studio/page.tsx`
- `apps/web/src/components/studio/ai-assistant-panel.tsx`
- `apps/web/src/components/studio/use-studio-page-state.ts`

Proposed behavior:

- On Studio mount, parse `opportunity` from search params.
- Fetch the opportunity.
- Populate the AI Assistant job description panel.
- Show a small loaded state:
  - `Senior Product Engineer at ExampleWorks`
  - "Loaded from opportunity link."
- Keep the loaded JD editable.

Acceptance:

- Direct URL `/en/studio?opportunity=<id>` loads the job description without
  manual selection.
- Invalid IDs show a non-blocking warning and leave the panel empty.
- Re-selecting another opportunity from the Opportunity Bank replaces the JD.

Tests:

- E2E: navigate directly to Studio with `opportunity=<id>`, assert JD text is
  visible.
- Unit or component test for Studio state initialization from search params.

### Phase 3 - Make Studio Draft Generation Clear And Durable

#### Problem

After selecting bank entries, Studio shows counts and can produce a preview, but
the state is confusing. The generated preview did not persist after reload, and
the picker can reopen/cover the result after `Generate from Bank`.

Likely files:

- `apps/web/src/app/[locale]/(app)/studio/page.tsx`
- `apps/web/src/components/studio/studio-canvas.tsx`
- `apps/web/src/components/studio/studio-left-rail.tsx`
- `apps/web/src/components/studio/ai-assistant-panel.tsx`
- `apps/web/src/components/studio/use-studio-page-state.ts`

Proposed behavior:

- Selecting entries updates a persistent draft model immediately.
- `Generate from Bank` closes any picker, builds content, and keeps the preview
  visible.
- The document status changes to `Unsaved changes` until saved.
- `Save` persists the selected entries and generated content.
- Reopening Studio restores the last saved draft, not the empty first-run state.
- If the user generated but did not save, show a clear unsaved warning on
  navigation/reload.

Data model direction:

- Store selected bank entry IDs with the Studio document.
- Store generated content in the existing Studio document state, not only
  component-local UI state.
- Avoid inflating `Knowledge` count when selecting entries. The dogfood run saw
  `Knowledge` move from `21` to `23` after generation attempts, which suggests
  generation may be creating or duplicating bank entries unintentionally.

Acceptance:

- Select 2 experiences, 1 education, 6 skills, and 3 bullets.
- Click `Generate from Bank`.
- Preview renders actual Riley resume content.
- Picker is closed.
- Counts remain stable after generation unless a user explicitly creates new
  bank entries.
- Save, reload Studio, and see the same draft content.
- Export PDF becomes enabled once content exists.

Tests:

- E2E for select entries -> generate -> save -> reload -> export enabled.
- Unit tests for Studio state reducer or hook.
- Regression test that bank entry count does not increase from draft
  generation alone.

### Phase 4 - Fix Bank Picker Semantics

#### Problem

The Studio bank picker rows look like checkbox rows but are implemented as
buttons. This makes the UI hard to automate and less accessible.

Likely files:

- `apps/web/src/components/studio/*bank*`
- `apps/web/src/app/[locale]/(app)/studio/page.tsx`

Proposed behavior:

- Use real checkbox inputs or `role="checkbox"` with correct
  `aria-checked`.
- The accessible name should be the entry label.
- Clicking the row toggles the checkbox.
- Space toggles the focused row.
- The footer or sidebar should say exactly how many entries are selected and
  expose a clear `Add selected` or `Use selected entries` action.

Acceptance:

- `page.getByRole("checkbox", { name: /Product Engineer/ })` works.
- Keyboard users can toggle rows with Space.
- Screen readers get selected/unselected state.
- The visual checkbox and semantic state cannot diverge.

Tests:

- Component tests for keyboard toggling and accessible roles.
- E2E update to select entries by role.

### Phase 5 - Parser Normalization Improvements

#### Problem

The deterministic parser is good enough to unblock the core flow, but some
normalization issues reduce downstream quality:

- `bilingual English/French.` kept a trailing period and was tagged as
  technical.
- Education year `2019` did not become `endDate`.
- `Postgres` evidence did not fully satisfy `PostgreSQL` downstream.

Likely files:

- `apps/web/src/lib/parser/field-extractor.ts`
- `apps/web/src/lib/parser/smart-parser.ts`
- `apps/web/src/lib/resume/info-bank.ts`
- `packages/shared/src/scoring/synonyms.ts`
- `apps/web/src/lib/ats/*`

Proposed behavior:

- Trim terminal punctuation from skill names.
- Detect language skills:
  - `bilingual English/French` -> either `English`, `French`, or a language
    skill entry with category `language`.
  - Do not classify bilingual language strings as `technical`.
- Parse compact education lines:
  - `University of Waterloo, BMath Statistics, 2019`
  - institution: `University of Waterloo`
  - degree: `BMath`
  - field: `Statistics`
  - endDate: `2019`
- Add synonym handling for common pairs:
  - `Postgres` <-> `PostgreSQL`
  - `API design` <-> `APIs` / `REST API` where applicable
  - `French language ability` <-> `French`

Acceptance:

- Riley fixture parses `French` or bilingual language as a language skill
  without trailing punctuation.
- Riley education has `endDate: "2019"`.
- ATS recognizes `Postgres query tuning` as evidence for `PostgreSQL`.

Tests:

- Parser fixture test for Riley resume.
- ATS keyword synonym tests.
- Regression test for skill punctuation cleanup.

### Phase 6 - Improve ATS Keyword Source Priority

#### Problem

ATS check found useful signals, but it omitted `French` even though the job's
required skills included it. It also treated some manually-entered tags as JD
keywords.

Likely files:

- `apps/web/src/app/api/ats/analyze/route.ts`
- `apps/web/src/lib/ats/analyzer.ts`
- `apps/web/src/lib/ats/jd-keywords.ts`
- `apps/web/src/app/api/opportunities/*`

Proposed behavior:

ATS keyword extraction should prioritize:

1. Explicit `requiredSkills`.
2. Explicit `requirements`.
3. Job description keyword extraction.
4. Tags/tech stack as supporting context, not primary source.

Manual tags such as `product engineering` and `fintech` should not dominate the
ATS keyword list unless they appear in the JD or explicit requirements.

Acceptance:

- Riley/ExampleWorks ATS keyword list includes `French`.
- `PostgreSQL`, `GraphQL`, `React`, `TypeScript`, `Node.js`,
  `accessibility`, and `performance` are evaluated.
- Tags do not crowd out explicit requirements.
- The UI can show where each keyword came from: required skill, JD, tag, or
  inferred.

Tests:

- Unit test for keyword source ordering.
- Route test with an opportunity containing `requiredSkills`, `techStack`, and
  tags.

### Phase 7 - Upload Review Copy For Non-PDF Sources

#### Problem

TXT uploads show "Preview unavailable for this upload" with cache-oriented copy
about re-uploading to refresh. For TXT, preview is unsupported, not expired.

Likely files:

- `apps/web/src/components/bank/preview/pdf-preview.tsx`
- `apps/web/src/app/[locale]/(app)/components/components-tab.tsx`
- `apps/web/src/components/bank/upload-overlay.tsx`

Proposed behavior:

Use source-aware preview messages:

- PDF cache hit: render preview.
- PDF cache miss/expired: "PDF preview expired. Re-upload to preview the
  source again."
- TXT/DOCX unsupported preview: "Source preview is not available for TXT/DOCX
  uploads yet. Parsed components are still editable."
- Parse produced no positions: "Parsed components are editable, but Slothing
  could not locate them in the source preview."

Acceptance:

- TXT upload review does not mention a 24h PDF cache refresh.
- PDF expired state still mentions the TTL.
- Components remain visible and editable in all states.

Tests:

- Component tests for preview empty-state copy by document type/status.
- E2E assertion for TXT upload message.

## Suggested Priority Order

1. Phase 0: dogfood E2E harness.
2. Phase 1: AI fallback / typed provider errors.
3. Phase 2: drawer link and Studio deep-link handoff.
4. Phase 4: bank picker semantics.
5. Phase 3: durable Studio generation.
6. Phase 5 and 6: parser and ATS quality.
7. Phase 7: upload preview copy.

Reasoning:

- Phase 0 prevents regressions while fixing.
- Phase 1 and 2 unblock the user-visible core flow.
- Phase 4 makes Phase 3 testable and accessible.
- Phase 5 and 6 improve quality once the flow itself is reliable.

## Done Definition

The remediation is done when a clean local user can complete this exact flow:

1. Upload Riley resume.
2. Review parsed components.
3. Create ExampleWorks opportunity.
4. Click `Analyze Match` and see either AI or deterministic analysis.
5. Click `ATS Check` and see score details.
6. Click `Tailor in Studio` from the drawer.
7. Studio opens with the ExampleWorks JD loaded.
8. Select entries from the bank using accessible checkbox rows.
9. Generate a resume draft.
10. Save the draft.
11. Reload Studio and see the saved draft.
12. Export PDF is enabled.

No step should return a generic 500, require hidden provider setup, or depend on
clicking an element that is not semantically represented in the UI.

## Verification Commands

Run after implementation:

```bash
pnpm --filter @slothing/web type-check
pnpm --filter @slothing/web test:run
pnpm --filter @slothing/web test:e2e:chromium -- --grep "dogfood core flow"
```

Manual verification:

```bash
pnpm dev
```

Then run the same browser flow against `http://localhost:3000/en/components`
with a clean default user.
