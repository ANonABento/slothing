# Dogfood Completion Audit - 2026-05-13

## Objective Restated

Dogfood Slothing across the website and Slothing extension in repeated loops:
create durable markdown audits, add realistic and edge-case fixtures, run web
and extension functionality through automated and browser-level checks, fix
issues found by those checks, and keep iterating until the product is better
than the starting behavior.

## Prompt-To-Artifact Checklist

| Requirement                                     | Evidence                                                                                                                                                                                                                                                                                             | Status                        | Gap / Next Action                                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Set an active `/goal` for iterative dogfooding. | Active thread goal created for website + extension dogfooding.                                                                                                                                                                                                                                       | Done                          | No current blocker.                                                                                               |
| Audit everything into markdown files.           | `docs/audits/dogfood-2026-05-13/README.md`, `fixtures.md`, `translation-placeholders.md`, this `completion-audit.md`, plus the provider-refresh runbook in `docs/i18n-translations.md`.                                                                                                              | Done for current loops        | No current blocker.                                                                                               |
| Test website functionality.                     | Web type-check, full Vitest run, focused parser/ATS/SEO/Studio/install/messages tests, translation script tests, translation preflight/generator/report/release checks, Chromium smoke e2e, DOCX bank upload e2e, translation drift with ICU parity, and strict-placeholder checks.                      | Done for covered flows        | No current blocker.                                                                                               |
| Test extension functionality.                   | Extension type-check, full Vitest run, Chrome production build, popup/options production-page e2e, scraper e2e, Greenhouse duplicate-count e2e, bundle-size check.                                                                                                                                   | Done for covered flows        | No current blocker.                                                                                               |
| Create realistic mockups/examples.              | `edge-case-resume.md`, `table-docx-resume.txt`, `table-docx-resume.docx`, `ambiguous-hybrid-job.md`, `unknown-jsonld-job.html`, `workday-apply-multistep.html`, malformed Greenhouse list unit fixture.                                                                                              | Done                          | Add future fixtures when new uncovered risks are found.                                                           |
| Test resume/document upload edge cases.         | Dogfood markdown resume fixture covered by parser/ATS tests; table-extracted DOCX-style text and real binary DOCX fixture covered by smart parser tests; real DOCX fixture covered by Chromium bank upload e2e; cover-letter prose and tracked-comment cover-letter fixtures covered by classifier tests; existing persona PDFs cover broader parser cases.          | Done for current fixtures     | Add future upload fixtures when new document risks are found.                                                     |
| Test scraper edge cases.                        | Unknown JSON-LD board, malformed JSON fallback, Greenhouse duplicate IDs/missing title/relative URL/missing location, browser-level duplicate-count propagation.                                                                                                                                     | Done for key scraper risks    | Add future scraper fixtures when new board-specific failures are found.                                           |
| Fix issues found during dogfooding.             | Parser date/header/degree fixes, command palette a11y metadata, SEO `metadataBase`, Greenhouse dedupe, duplicate-count UI/response propagation, install CTA placeholder links, Studio test synchronization, Workday multi-step hardening, popup/options shared UI chunking, translation strict gate, and full manual localization cleanup. | Done for found fixable issues | No current blocker.                                                                                               |
| Run multiple loops.                             | README records baseline plus loops for parser, Greenhouse, metadata, bundle budgets, Studio warnings, smoke harness, install CTAs, bundle tightening, and translation quality cleanup.                                                                                                               | Done                          | Continue opportunistic loops when new risks are found.                                                            |
| Verify against high-achieving benchmarks.       | Core checks are green; smoke, popup/options, and scraper e2e pass; bundle budgets cover every emitted JS chunk plus total JS; translation release gates pass with 0 placeholders, 0 drift, 0 ICU errors, and 0 language-quality issues.                                                               | Done                          | No current blocker.                                                                                               |
| Work better than initially intended.            | Product behavior improved over baseline: fewer parser misses, better scraper dedupe, no dead extension store links, cleaner tests, Workday multi-step fixture coverage, smaller popup/options bundles, tracked total JS limits, and fully cleared non-English placeholder debt.                         | Done                          | No current blocker.                                                                                               |

## Current Completion Decision

The completion audit now passes for the current dogfood objective. The
remaining items are future polish loops, not blockers for this goal.

The current state satisfies the main dogfood-loop mechanics, covers website
and extension behavior with automated/browser-level checks, records durable
markdown evidence, and fixes the issues found during the loops:

- Non-English message catalogs now contain 0 provider-generated placeholders,
  0 missing keys, 0 extra keys, 0 ICU errors, 0 wrong-language quality issues,
  and 0 unexpected identical-to-English strings across all target locales.
- `check:translations:preflight` and `check:translations:release` both pass in
  the current environment. No provider credentials were needed for the final
  manual localization cleanup; the provider runbook remains for future copy
  refreshes.
- Extension popup/options now share a `sharedUi.js` chunk and every emitted JS
  file plus total JS has an explicit budget. Background/content remain large
  and still trigger webpack's default performance warning, but the remaining
  deeper split is no longer an untracked prerequisite for current features.
- Greenhouse duplicate rows are now visible beyond aggregate imported/attempted
  counts: `BulkSourceCard` renders duplicate counts and deduped row identities,
  and browser-level e2e verifies `duplicateCount`/`dedupedIds` propagation
  through the real extension message path.
- The real DOCX dogfood fixture is now covered beyond parser unit tests: the
  bank-page Chromium e2e uploads it through the production UI, checks the
  upload API response, verifies the review dialog, and confirms source-file
  metadata in Source view.
- `check:translations:report` verifies the markdown placeholder audit is
  current against the actual message catalogs, so localization debt tracking is
  now guarded instead of a manually maintained snapshot.
- `check:translations:generator` validates the translation generator's output
  safety without provider keys: source ICU arguments must be preserved, provider
  output cannot invent extra ICU arguments, braces must be balanced, brand
  terms stay protected, and passthrough keys remain unchanged.
- `check:translations` now validates ICU argument parity in the existing
  locale catalogs. Current evidence shows 0 missing/extra keys, 0 ICU errors,
  0 placeholders, 0 wrong-language quality issues, and 0 identical-to-English
  warnings across all target locales.
- `docs/i18n-translations.md` now documents the exact provider-refresh runbook:
  preflight checks, provider commands, human review criteria, strict release
  gates, markdown report verification, and generator self-test.
- `check:translations:preflight` now executes the runbook preflight as a single
  command: drift/ICU parity, generator validation, and placeholder-report
  verification.
- `check:translations:release` is the final post-refresh gate. It now passes
  with 0 placeholders, 0 missing keys, 0 extra keys, 0 ICU errors, 0
  wrong-language quality issues, and 0 identical-to-English warnings.
- Focused translation script tests now cover both aggregate gates:
  `check:translations:preflight` and `check:translations:release` pass after
  generated placeholders are cleared.
- GitHub workflow gates now call the same commands: regular CI runs
  `check:translations:preflight`, and provider-backed i18n fanout validates
  generated catalogs with `check:translations:release`.
- `check:translations:update-report` regenerates the placeholder markdown audit
  before release/report verification. The i18n fanout workflow now runs it and
  commits `translation-placeholders.md` with generated locale JSON changes.
- The push-to-main fanout path explicitly stages only the generated locale
  catalogs and `translation-placeholders.md` through `create-pull-request`
  `add-paths`, matching the pull-request branch path.
- The i18n fanout workflow now accepts either `ANTHROPIC_API_KEY` or
  `OPENAI_API_KEY`, matching the provider fallback behavior in
  `translate-messages.ts`.
- CI app-quality gates now run for edits to any workflow YAML, so changes to
  the i18n fanout gate are covered instead of only changes to `ci.yml`.
- Release localization gating now fails on unexpected identical-to-English
  strings as well as explicit `[locale]` placeholders. This prevents a provider
  refresh from passing by stripping placeholder prefixes while leaving English
  UI text in non-English catalogs.
- The 24 identical-to-English warnings found by the stricter gate were cleared:
  literal English carryover was manually localized, while placeholder-only
  format strings are now treated as expected identical values because they have
  no translatable letters.
- Manual review also caught and corrected two Spanish privacy labels that were
  accidentally written in Portuguese, a quality issue outside exact-English
  drift detection.
- The translation drift check now includes a small wrong-language guard for
  high-risk Spanish/Brazilian Portuguese bleed. The refreshed markdown audit
  records 0 current locale quality issues.
- Focused translation maintenance tests now exercise the wrong-language guard
  with a temporary catalog fixture that injects Portuguese text into Spanish
  and another fixture that injects Spanish text into Brazilian Portuguese; both
  expect the drift check to fail.
- The simple high-frequency `Sort`, `Back`, `Delete`, and `Edit` placeholders
  were manually localized across all seven target locales, reducing
  provider-generated placeholders from 2,303 to 2,079 while preserving 0
  drift/ICU/quality issues.
- The marketing navigation placeholders were manually localized for the five
  locales that still needed them. French `Extension` was revised to `Module
  navigateur` after the strict identical-to-English checker flagged it.
- Compact job-toolbar labels and status filters were manually localized across
  all target locales. The strict identical-to-English checker caught pt-BR
  `Status` and fr `Type`, which were revised to `Situação` and `Catégorie`.
- The remaining compact job-toolbar status/type/location/sort options were
  manually localized across all target locales, reducing placeholders to 2,079
  while preserving 0 drift/ICU/quality/identical-English issues.
- Job import edit-form type selector, type options, and remote/onsite options
  were manually localized across all target locales, reducing placeholders to
  2,030 while preserving 0 drift/ICU/quality/identical-English issues.
- Dashboard recent-activity headings and activity type labels were manually
  localized across all target locales, reducing placeholders to 1,995 while
  preserving 0 drift/ICU/quality/identical-English issues.
- Onboarding upload/review step copy plus basic optional/action/error labels
  were manually localized across all target locales, reducing placeholders to
  1,890 while preserving 0 drift/ICU/quality/identical-English issues.
- Onboarding builder field labels were manually localized across all target
  locales, reducing placeholders to 1,778 while preserving 0
  drift/ICU/quality/identical-English issues.
- The remaining onboarding builder title, description, and example placeholder
  values were manually localized across all target locales. Three initially
  identical role-title examples were revised, leaving onboarding fully out of
  the placeholder report and reducing total placeholders to 1,694 with 0
  drift/ICU/quality/identical-English issues.
- Interview summary labels, response states, job-selection empty state,
  practice actions, and controls were manually localized across all target
  locales. One French identical-to-English count label was revised, reducing
  total placeholders to 1,477 with 0 drift/ICU/quality/identical-English
  issues.
- Interview difficulty labels and quick-practice fields/categories/actions were
  manually localized across all target locales. Spanish `General` and French
  `Questions` identical-English labels were revised, reducing total
  placeholders to 1,323 with 0 drift/ICU/quality/identical-English issues.
- The remaining interview prep-guide labels, tabs, sections, categories, and
  error messages were manually localized across all target locales. Brazilian
  Portuguese `Checklist` and French `Questions` identical-English labels were
  revised, removing `interview` from the placeholder report and reducing total
  placeholders to 1,148 with 0 drift/ICU/quality/identical-English issues.
- Jobs toolbar search/count text, import edit-form labels/actions, and import
  preview labels were manually localized across all target locales. Location
  examples and a French `Description` label were revised after the
  identical-English checker flagged them, reducing total placeholders to 1,008
  with 0 drift/ICU/quality/identical-English issues.
- Jobs add-opportunity dialog title, body, fields, placeholders, action, and
  error copy were manually localized across all target locales. Shared `Acme
  Corp` examples were revised after the identical-English checker flagged them,
  reducing total placeholders to 917 with 0
  drift/ICU/quality/identical-English issues.
- Google Calendar, Contacts, and Drive integration strings were manually
  localized across all target locales, removing `integrations` from the
  placeholder report and reducing total placeholders to 658 with 0
  drift/ICU/quality/identical-English issues.
- Resume comparison labels, summary terms, score text, empty state, close
  action, and errors were manually localized across all target locales,
  removing `resume` from the placeholder report and reducing total placeholders
  to 560 with 0 drift/ICU/quality/identical-English issues.
- Dialog upload, bank add-entry, builder section-picker, studio picker/version
  comparison, opportunity add title, and calendar create strings were manually
  localized across all target locales, reducing total placeholders to 427 with
  0 drift/ICU/quality/identical-English issues.
- Source-document dialog labels, delete confirmations, inline filename markup,
  pluralized bullet/source-file copy, and errors were manually localized across
  all target locales, removing `dialogs` from the placeholder report and
  reducing total placeholders to 322 with 0
  drift/ICU/quality/identical-English issues.
- Settings help and data-management strings were manually localized across all
  target locales, reducing total placeholders to 147 with 0
  drift/ICU/quality/identical-English issues.
- The remaining jobs CSV preview, text import, URL import, and related empty
  state strings were manually localized across all target locales, reducing
  total placeholders to 0 with 0 drift/ICU/quality/identical-English issues.

## Verified Commands Snapshot

- `pnpm --filter @slothing/shared test:run`
- `pnpm --filter @slothing/extension test:run`
- `pnpm --filter @slothing/extension type-check`
- `pnpm --filter @slothing/extension build:chrome`
- `pnpm --filter @slothing/extension check:bundle-size`
- `npx playwright test tests/e2e/extension-pages.spec.ts --project=chromium` from `apps/extension`
- `npx playwright test tests/e2e/scrapers.spec.ts --grep "fixture extracts|job list cards|duplicate counts"` from `apps/extension`
- `pnpm --filter @slothing/web type-check`
- `pnpm --filter @slothing/web test:run`
- `pnpm --filter @slothing/web check:translations`
- `pnpm --filter @slothing/web check:translations:strict` expected failure while placeholders remain
- `pnpm --filter @slothing/web translate:messages --dry-run --locales=es` expected failure without provider credentials
- `pnpm --filter @slothing/web exec vitest run src/messages/messages.test.ts src/messages/translation-scripts.test.ts`
- `pnpm --filter @slothing/web check:translations:report`
- `pnpm --filter @slothing/web check:translations:generator`
- `pnpm --filter @slothing/web check:translations:preflight`
- `pnpm --filter @slothing/web check:translations:release` expected failure while placeholders remain
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts` after aggregate gate coverage
- `pnpm --filter @slothing/web check:translations:update-report`
- `pnpm --filter @slothing/web check:translations:release` expected failure after report regeneration and strict identical-to-English enforcement
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts` with 12 translation maintenance tests
- `pnpm --filter @slothing/web check:translations:preflight` after adding identical-to-English report coverage
- `pnpm --filter @slothing/web type-check`
- `git diff --check`
- `pnpm --filter @slothing/web test:run` after localization quality guard and
  locale JSON cleanup: 487 files passed, 3,576 tests passed, 1 skipped
- A later full `pnpm --filter @slothing/web test:run` after additional manual
  locale cleanup hit six Vitest timeouts under full-suite load. The timed-out
  UI/studio/settings files passed when rerun directly, and the translation
  script suite now gives aggregate shell-out tests explicit 30s timeouts.
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after the timeout adjustment: 12 tests passed
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after dashboard recent-activity localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after dashboard
  recent-activity localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after dashboard recent-activity localization: 1,995 placeholders remain
- `pnpm --filter @slothing/web check:translations:update-report` after
  onboarding upload/review/action localization: 1,890 placeholders remain
- `pnpm --filter @slothing/web check:translations:update-report` after
  onboarding builder-label localization: 1,778 placeholders remain
- `pnpm --filter @slothing/web check:translations:update-report` after full
  onboarding cleanup: 1,694 placeholders remain, 0 identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after full onboarding cleanup: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after full
  onboarding cleanup
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after full onboarding cleanup: 1,694 placeholders remain
- `pnpm --filter @slothing/web type-check` after full onboarding cleanup
- `git diff --check` after full onboarding cleanup
- `pnpm --filter @slothing/web check:translations:update-report` after
  interview summary/job-selection localization: 1,477 placeholders remain, 0
  identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after interview summary/job-selection localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after interview
  summary/job-selection localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after interview summary/job-selection localization: 1,477 placeholders remain
- `pnpm --filter @slothing/web type-check` after interview
  summary/job-selection localization
- `git diff --check` after interview summary/job-selection localization
- `pnpm --filter @slothing/web check:translations:update-report` after
  interview quick-practice localization: 1,323 placeholders remain, 0
  identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after interview quick-practice localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after interview
  quick-practice localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after interview quick-practice localization: 1,323 placeholders remain
- `pnpm --filter @slothing/web type-check` after interview quick-practice
  localization
- `git diff --check` after interview quick-practice localization
- `pnpm --filter @slothing/web check:translations:update-report` after
  interview prep-guide localization: 1,148 placeholders remain, 0
  identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after interview prep-guide localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after interview
  prep-guide localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after interview prep-guide localization: 1,148 placeholders remain
- `pnpm --filter @slothing/web type-check` after interview prep-guide
  localization
- `git diff --check` after interview prep-guide localization
- `pnpm --filter @slothing/web check:translations:update-report` after jobs
  toolbar/edit-form/preview localization: 1,008 placeholders remain, 0
  identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after jobs toolbar/edit-form/preview localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after jobs
  toolbar/edit-form/preview localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after jobs toolbar/edit-form/preview localization: 1,008 placeholders remain
- `pnpm --filter @slothing/web type-check` after jobs toolbar/edit-form/preview
  localization
- `git diff --check` after jobs toolbar/edit-form/preview localization
- `pnpm --filter @slothing/web check:translations:update-report` after jobs
  add-dialog localization: 917 placeholders remain, 0 identical-to-English
  warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after jobs add-dialog localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after jobs
  add-dialog localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after jobs add-dialog localization: 917 placeholders remain
- `pnpm --filter @slothing/web type-check` after jobs add-dialog localization
- `git diff --check` after jobs add-dialog localization
- `pnpm --filter @slothing/web check:translations:update-report` after Google
  integrations localization: 658 placeholders remain, 0 identical-to-English
  warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after Google integrations localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after Google
  integrations localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after Google integrations localization: 658 placeholders remain
- `pnpm --filter @slothing/web type-check` after Google integrations
  localization
- `git diff --check` after Google integrations localization
- `pnpm --filter @slothing/web check:translations:update-report` after resume
  comparison localization: 560 placeholders remain, 0 identical-to-English
  warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after resume comparison localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after resume
  comparison localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after resume comparison localization: 560 placeholders remain
- `pnpm --filter @slothing/web type-check` after resume comparison
  localization
- `git diff --check` after resume comparison localization
- `pnpm --filter @slothing/web check:translations:update-report` after short
  dialogs localization: 427 placeholders remain, 0 identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after short dialogs localization: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after short
  dialogs localization
- `pnpm --filter @slothing/web check:translations:release` expected failure
  after short dialogs localization: 427 placeholders remain
- `pnpm --filter @slothing/web type-check` after short dialogs localization
- `git diff --check` after short dialogs localization
- `pnpm --filter @slothing/web check:translations:update-report` after
  source-document dialogs localization: 322 placeholders remain, 0
  identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/components/result-quality/result-quality-card.test.tsx src/components/ui/button.test.tsx src/components/ui/page-layout.test.tsx 'src/app/[locale]/(app)/studio/page.test.tsx' 'src/app/[locale]/(app)/settings/page.test.tsx'`:
  5 files passed, 55 tests passed
- `pnpm --filter @slothing/web exec vitest run --maxWorkers=50%` after the
  timeout adjustment: 487 files passed, 3,576 tests passed, 1 skipped
- `PORT=8899 NEXTAUTH_URL=http://localhost:8899 SLOTHING_ALLOW_UNAUTHED_DEV=1 TURSO_DATABASE_URL=file:/tmp/slothing-dogfood-web-e2e-smoke.db npx playwright test e2e/smoke.spec.ts --project=chromium` from `apps/web`
- `GET_ME_JOB_SQLITE_PATH=/tmp/slothing-dogfood-docx-e2e.db PORT=8898 NEXTAUTH_URL=http://localhost:8898 SLOTHING_ALLOW_UNAUTHED_DEV=1 TURSO_DATABASE_URL=file:/tmp/slothing-dogfood-docx-e2e.db npx playwright test e2e/bank.spec.ts --grep "dogfood DOCX" --project=chromium` from `apps/web`
- `pnpm --filter @slothing/web check:translations:update-report` after
  settings localization: 147 placeholders remain, 0
  drift/ICU/quality/identical-English issues
- `pnpm --filter @slothing/web check:translations:update-report` after final
  jobs import localization: 0 placeholders, 0 missing keys, 0 extra keys, 0
  ICU errors, 0 wrong-language quality issues, 0 identical-to-English warnings
- `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`
  after zero-placeholder cleanup: 12 tests passed
- `pnpm --filter @slothing/web check:translations:preflight` after
  zero-placeholder cleanup
- `pnpm --filter @slothing/web check:translations:release` after
  zero-placeholder cleanup
- `pnpm --filter @slothing/web type-check` after zero-placeholder cleanup
- `git diff --check` after zero-placeholder cleanup

## Next Best Loops

1. Run a fresh full website and extension e2e sweep when the next UI-facing
   feature lands.
2. Get human native-speaker review for the manually localized high-traffic
   flows before a major release.
3. Use the provider-refresh runbook when source copy changes, then re-run
   `check:translations:release` and update this audit with any new findings.
