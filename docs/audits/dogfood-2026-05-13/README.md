# Iterative Dogfood Audit - 2026-05-13

## Goal

Exercise Slothing as a real job-search user would: web app, Columbus extension,
resume/document upload, scraping, autofill-adjacent flows, and edge-case data.
Each loop should leave durable evidence, fixtures, and fixes.

## High-Achieving Benchmarks

- Core checks stay green: type-check, unit tests, targeted e2e, production
  builds for web and extension.
- Website smoke flows work without seeded third-party credentials in unauth dev
  mode.
- Extension build loads in Chromium and validates supported ATS fixtures plus
  a generic unknown-board fallback.
- Upload/parser fixtures include normal, sparse, dense, multilingual, scanned,
  and adversarial formatting cases.
- Scraper fixtures include supported job boards, list pages, malformed rows,
  JSON-LD-only pages, salary variants, remote/hybrid/on-site ambiguity, and
  missing optional fields.
- Audit notes capture failures, warning-level polish issues, exact commands,
  and the next loop's target.

## Surface Map

### Website

- Public: landing, pricing, ATS scanner, extension marketing, competitor pages,
  privacy, terms.
- Auth/dev entry: sign-in, unauthenticated local dev bypass, onboarding.
- App workspace: dashboard, profile, bank/answer bank, upload, documents,
  studio, builder, tailor, cover letter, opportunities, review queue,
  applications/jobs redirects, interview, analytics, salary, calendar, emails,
  settings.
- APIs: document parsing/upload, ATS scan/analyze, opportunity CRUD/import,
  extension auth/import/profile/resumes/chat/learned answers, Google features,
  reminders, exports, billing gates, eval admin, templates.

### Columbus Extension

- Popup/options and connection flow.
- Content scripts: scraping, passive LinkedIn capture, page snapshots, submit
  watcher, answer capture, confidence UI, answer-bank button.
- Specialized scrapers: LinkedIn, Indeed, Greenhouse, Lever, Workday,
  WaterlooWorks.
- Generic scraper fallback for unknown job boards.
- Multi-step autofill/session handling for Greenhouse and Workday.

## Loop 1 Baseline

Commands run on 2026-05-13:

| Command                                                                                                                                                                                                     | Result             | Notes                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @slothing/shared test:run`                                                                                                                                                                   | Pass               | 8 files, 20 tests.                                                                                                                                                                                  |
| `pnpm --filter @slothing/extension test:run`                                                                                                                                                                | Pass               | 26 files, 239 tests.                                                                                                                                                                                |
| `pnpm --filter @slothing/extension type-check`                                                                                                                                                              | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web type-check`                                                                                                                                                                    | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web test:run`                                                                                                                                                                      | Pass               | 486 files, 3552 passed, 1 skipped.                                                                                                                                                                  |
| `pnpm --filter @slothing/extension build:chrome`                                                                                                                                                            | Pass with warnings | Production Chrome extension build completed; webpack reports oversized background/content/popup/options bundles.                                                                                    |
| `pnpm --filter @slothing/extension exec vitest run src/content/scrapers/generic-scraper.test.ts`                                                                                                            | Pass               | Added JSON-LD-only and malformed-JSON fallback coverage.                                                                                                                                            |
| `npx playwright test tests/e2e/scrapers.spec.ts --grep "fixture extracts\|job list cards"` from `apps/extension`                                                                                            | Pass               | 6 Chromium tests, including the new unknown-board JSON-LD fixture.                                                                                                                                  |
| `SLOTHING_ALLOW_UNAUTHED_DEV=1 NEXTAUTH_URL=http://localhost:8888 TURSO_DATABASE_URL=file:/tmp/slothing-dogfood-web-e2e.db npx playwright test e2e/smoke.spec.ts --project=chromium` from `apps/web`        | Pass               | 5 Chromium smoke tests.                                                                                                                                                                             |
| `pnpm --filter @slothing/extension test:run` after new fixture                                                                                                                                              | Pass               | 27 files, 241 tests.                                                                                                                                                                                |
| `pnpm --filter @slothing/extension type-check` after new fixture                                                                                                                                            | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web exec vitest run src/components/command-palette/command-palette.test.tsx`                                                                                                       | Pass               | Confirms command palette tests pass after dialog metadata fix, without Radix title/description warnings.                                                                                            |
| `pnpm --filter @slothing/web type-check` after command palette fix                                                                                                                                          | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/smart-parser.test.ts src/lib/ats/analyzer.test.ts`                                                                                              | Pass               | 49 focused tests. Dogfood markdown resume and ambiguous hybrid JD fixtures are now executable coverage.                                                                                             |
| `pnpm --filter @slothing/web type-check` after parser/ATS fixture loop                                                                                                                                      | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/field-extractor.test.ts src/lib/parser/smart-parser.test.ts src/lib/ats/analyzer.test.ts`                                                       | Pass               | 108 focused tests after fixing a wrapped PDF bullet regression caught by the full suite.                                                                                                            |
| `pnpm --filter @slothing/web test:run` after parser fix                                                                                                                                                     | Pass               | 486 files, 3554 passed, 1 skipped. Translation placeholders remain warn-only.                                                                                                                       |
| `pnpm --filter @slothing/extension exec vitest run src/content/scrapers/greenhouse-orchestrator.test.ts`                                                                                                    | Pass               | 10 focused tests. Added malformed ATS list coverage with duplicate IDs, missing title row, relative URLs, and optional location.                                                                    |
| `pnpm --filter @slothing/extension type-check` after Greenhouse dedupe                                                                                                                                      | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/extension test:run` after Greenhouse dedupe                                                                                                                                        | Pass               | 27 files, 242 tests.                                                                                                                                                                                |
| `pnpm --filter @slothing/extension build:chrome` after Greenhouse dedupe                                                                                                                                    | Pass with warnings | Chrome dist rebuilt; webpack bundle-size warnings remain.                                                                                                                                           |
| `npx playwright test tests/e2e/scrapers.spec.ts --grep "fixture extracts\|job list cards"` from `apps/extension` after rebuild                                                                              | Pass               | 6 Chromium scraper e2e tests against rebuilt extension dist.                                                                                                                                        |
| `pnpm --filter @slothing/web exec vitest run src/lib/seo.test.ts src/app/layout.test.tsx`                                                                                                                   | Pass               | 20 focused tests after adding site-level and route-level `metadataBase`.                                                                                                                            |
| `pnpm --filter @slothing/extension check:bundle-size`                                                                                                                                                       | Pass               | Explicit dist budgets now track background, content, popup, and options bundles.                                                                                                                    |
| `SLOTHING_ALLOW_UNAUTHED_DEV=1 NEXTAUTH_URL=http://localhost:8899 TURSO_DATABASE_URL=file:/tmp/slothing-dogfood-web-e2e-metadata.db npx playwright test e2e/smoke.spec.ts --project=chromium`               | Harness timeout    | Playwright webServer did not become ready before timeout; manual `next start -p 8899` plus `curl /` showed no `metadataBase` warnings.                                                              |
| `pnpm --filter @slothing/web exec vitest run 'src/app/[locale]/(app)/studio/page.test.tsx'`                                                                                                                 | Pass               | 24 Studio tests after wrapping global shortcut events and microtask saves in `act(...)`; no React `act(...)` warnings emitted.                                                                      |
| `PORT=8899 NEXTAUTH_URL=http://localhost:8899 SLOTHING_ALLOW_UNAUTHED_DEV=1 TURSO_DATABASE_URL=file:/tmp/slothing-dogfood-web-e2e-smoke.db npx playwright test e2e/smoke.spec.ts --project=chromium`        | Pass               | 5 Chromium smoke tests. The earlier timeout used `NEXTAUTH_URL=:8899` without `PORT=8899`; the Playwright webServer script reads `PORT`.                                                            |
| `pnpm --filter @slothing/web check:translations`                                                                                                                                                            | Pass with warnings | No missing or extra locale keys. 2,303 provider-generated placeholders remain; script requires Anthropic/OpenAI credentials to clear them.                                                          |
| `pnpm --filter @slothing/web exec vitest run src/lib/extension/install.test.ts src/components/marketing/extension-install-buttons.test.tsx`                                                                 | Pass               | 11 focused tests. Website extension CTAs no longer link to dead marketplace placeholder URLs.                                                                                                       |
| `pnpm --filter @slothing/web type-check` after extension CTA fix                                                                                                                                            | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `TARGET=chrome pnpm --filter @slothing/extension exec webpack --mode production --profile --json > /tmp/slothing-extension-stats.json`                                                                      | Pass               | Temporary stats file showed React/ReactDOM duplicated across content, popup, and options; deeper splitting would require manifest/runtime chunk work.                                               |
| `pnpm --filter @slothing/extension check:bundle-size` after tightening budgets                                                                                                                              | Pass               | Tightened budgets: background 890 KiB, content 1225 KiB, popup 600 KiB, options 470 KiB.                                                                                                            |
| Popup bulk-import surface inspection (`BulkSourceCard`, `popup/App.tsx`, scraper e2e)                                                                                                                       | Inspected          | Initial inspection found only aggregate `Imported X/Y` results; loop 15 later added duplicate counts and deduped row identities.                                                                    |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/document-classifier.test.ts`                                                                                                                    | Pass               | 22 focused tests. Added deterministic content classification for cover-letter prose and resume fixtures when LLM credentials are absent.                                                            |
| `pnpm --filter @slothing/web type-check` after classifier heuristic                                                                                                                                         | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/smart-parser.test.ts src/lib/parser/field-extractor.test.ts`                                                                                    | Pass               | 72 focused tests. Added table-extracted DOCX-style resume coverage and fixed table-header parsing plus extra bullet glyphs.                                                                         |
| `pnpm --filter @slothing/web type-check` after table parser fix                                                                                                                                             | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/document-classifier.test.ts` after tracked-comment cover-letter fixture                                                                         | Pass               | 25 focused tests. Cover-letter drafts with editor comments and referral wording remain `cover_letter`; explicit reference letters remain `reference_letter`.                                        |
| `pnpm --filter @slothing/web type-check` after tracked-comment classifier fix                                                                                                                               | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/document-classifier.test.ts src/lib/parser/smart-parser.test.ts src/lib/parser/field-extractor.test.ts`                                         | Pass               | 97 focused parser/classifier tests after audit docs were updated.                                                                                                                                   |
| `pnpm --filter @slothing/web type-check` final parser/classifier loop                                                                                                                                       | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `git diff --check`                                                                                                                                                                                          | Pass               | No whitespace errors in the current diff.                                                                                                                                                           |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/smart-parser.test.ts src/lib/parser/field-extractor.test.ts src/lib/parser/section-detector.test.ts` after binary DOCX fixture                  | Pass               | 96 focused tests. Real `.docx` extraction exposed Mammoth table-cell rows and singular `Credential` header splitting; both parser paths are fixed.                                                  |
| `pnpm --filter @slothing/web exec vitest run src/lib/parser/document-classifier.test.ts src/lib/parser/smart-parser.test.ts src/lib/parser/field-extractor.test.ts src/lib/parser/section-detector.test.ts` | Pass               | 121 focused parser/classifier tests with the binary DOCX fixture included.                                                                                                                          |
| `pnpm --filter @slothing/web type-check` after binary DOCX parser fix                                                                                                                                       | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `git diff --check` after binary DOCX parser fix                                                                                                                                                             | Pass               | No whitespace errors in the current diff.                                                                                                                                                           |
| `file apps/web/tests/fixtures/dogfood/table-docx-resume.docx`                                                                                                                                               | Pass               | Fixture is a real Microsoft Word 2007+ document, 9.3 KiB.                                                                                                                                           |
| `pnpm --filter @slothing/extension exec vitest run src/content/multistep/workday.test.ts` after Workday multi-step fixture                                                                                  | Pass               | 11 focused tests. Fixture covers contact, demographics, disabled fields, upload control skip, late review-step refill, and submit-session cleanup.                                                  |
| `pnpm --filter @slothing/extension type-check` after Workday multi-step fixture                                                                                                                             | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/extension test:run` after Workday multi-step fixture                                                                                                                               | Pass               | 27 files, 243 tests.                                                                                                                                                                                |
| `pnpm --filter @slothing/extension build:chrome` after Workday multi-step fixture                                                                                                                           | Pass with warnings | Chrome dist rebuilt; webpack default bundle warnings remain tracked by explicit budget command.                                                                                                     |
| `pnpm --filter @slothing/extension check:bundle-size` after Workday multi-step fixture                                                                                                                      | Pass               | Tracked budgets still pass: background 875.6/890 KiB, content 1215.1/1225 KiB, popup 586.3/600 KiB, options 452.0/470 KiB.                                                                          |
| `pnpm --filter @slothing/extension build:chrome` after popup/options shared UI chunk                                                                                                                        | Pass with warnings | Chrome dist rebuilt with `sharedUi.js`; popup fell to 206 KiB and options to 71.5 KiB. Webpack default warnings remain for background/content/sharedUi.                                             |
| `pnpm --filter @slothing/extension check:bundle-size` after shared UI chunk                                                                                                                                 | Pass               | Budgets now cover every emitted JS chunk plus total JS: background 875.6/890 KiB, content 1215.1/1225 KiB, sharedUi 391.9/405 KiB, popup 206.0/220 KiB, options 71.5/80 KiB, total 2760.2/2800 KiB. |
| `pnpm --filter @slothing/extension type-check` after shared UI chunk                                                                                                                                        | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/extension test:run` after shared UI chunk                                                                                                                                          | Pass               | 27 files, 243 tests.                                                                                                                                                                                |
| `npx playwright test tests/e2e/extension-pages.spec.ts --project=chromium` from `apps/extension`                                                                                                            | Pass               | 2 Chromium tests. Popup and options pages render from the production extension bundle with `sharedUi.js` loaded.                                                                                    |
| `npx playwright test tests/e2e/scrapers.spec.ts --grep "fixture extracts\|job list cards" --project=chromium` from `apps/extension` after shared UI chunk                                                   | Pass               | 6 Chromium scraper e2e tests against the rebuilt extension dist.                                                                                                                                    |
| `pnpm --filter @slothing/extension exec vitest run src/popup/BulkSourceCard.test.tsx` after duplicate-count UI                                                                                              | Pass               | 10 focused tests. Bulk import results now render duplicate counts and deduped row identities when present.                                                                                          |
| `npx playwright test tests/e2e/scrapers.spec.ts --grep "duplicate counts" --project=chromium` from `apps/extension`                                                                                         | Pass               | Browser-level Greenhouse bulk import e2e uses a local API stub and verifies imported/attempted/duplicateCount/dedupedIds through the real extension message path.                                   |
| `npx playwright test tests/e2e/scrapers.spec.ts --grep "fixture extracts\|job list cards\|duplicate counts" --project=chromium` from `apps/extension`                                                       | Pass               | 7 Chromium scraper e2e tests, including duplicate-count propagation.                                                                                                                                |
| `pnpm --filter @slothing/extension test:run` after duplicate-count UI                                                                                                                                       | Pass               | 27 files, 244 tests.                                                                                                                                                                                |
| `pnpm --filter @slothing/extension type-check` after duplicate-count UI                                                                                                                                     | Pass               | No TypeScript errors.                                                                                                                                                                               |
| `pnpm --filter @slothing/extension check:bundle-size` after duplicate-count UI                                                                                                                              | Pass               | Budgets still pass: background 875.6/890 KiB, content 1216.1/1225 KiB, sharedUi 391.9/405 KiB, popup 206.8/220 KiB, options 71.5/80 KiB, total 2762.0/2800 KiB.                                     |
| `pnpm --filter @slothing/web check:translations` after strict-mode addition                                                                                                                                 | Pass with warnings | No missing or extra locale keys. 2,303 placeholders and 24 identical-to-English warnings remain.                                                                                                    |
| `pnpm --filter @slothing/web check:translations:strict`                                                                                                                                                     | Expected fail      | Strict placeholder gate exits non-zero while the 2,303 `[locale] ...` placeholders remain.                                                                                                          |
| `pnpm --filter @slothing/web translate:messages --dry-run --locales=es`                                                                                                                                     | Expected fail      | Refuses to run without `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, preventing accidental English fallback rewrites.                                                                                    |
| `pnpm --filter @slothing/web exec vitest run src/messages/messages.test.ts src/messages/translation-scripts.test.ts`                                                                                        | Pass               | 48 tests. Covers message catalog invariants, warn-only default check, strict placeholder failure, providerless translate refusal, and markdown report generation.                                   |
| `GET_ME_JOB_SQLITE_PATH=/tmp/slothing-dogfood-docx-e2e.db PORT=8898 NEXTAUTH_URL=http://localhost:8898 SLOTHING_ALLOW_UNAUTHED_DEV=1 TURSO_DATABASE_URL=file:/tmp/slothing-dogfood-docx-e2e.db npx playwright test e2e/bank.spec.ts --grep "dogfood DOCX" --project=chromium` from `apps/web` | Pass               | 1 Chromium test. The production bank page accepts the real DOCX fixture, API classifies it as a resume, review dialog opens with parsed entries, and Source view shows the uploaded file metadata. |
| `pnpm --filter @slothing/web check:translations:report`                                                                                                                                                     | Pass with warnings | Verifies `translation-placeholders.md` is current against the locale JSON catalogs while preserving human-formatted markdown table spacing.                                                          |
| `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts`                                                                                                                      | Pass               | 6 focused tests. Covers default warn-only drift, strict placeholder failure, providerless translate refusal, markdown report generation, current-report verification, and stale-report failure.      |
| `pnpm --filter @slothing/web check:translations:generator`                                                                                                                                                   | Pass               | Provider-free self-test for translation output validation. Confirms valid ICU messages pass and missing, invented, or unbalanced ICU arguments fail before catalog writes.                           |
| `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts` after generator self-test                                                                                             | Pass               | 7 focused tests. Adds coverage for the provider-free translation validator self-test.                                                                                                                 |
| `pnpm --filter @slothing/web check:translations` after ICU catalog validation                                                                                                                                | Pass with warnings | No missing/extra keys and 0 ICU argument errors across all locales. 2,303 placeholders and 24 identical-to-English warnings remain.                                                                  |
| `pnpm --filter @slothing/web check:translations:report` after ICU catalog validation                                                                                                                         | Pass with warnings | Placeholder report remains current; drift output now includes an `ICU errors` column with all locales at 0.                                                                                           |
| `pnpm --filter @slothing/web check:translations:strict` after ICU catalog validation                                                                                                                         | Expected fail      | Strict mode still exits non-zero only because 2,303 placeholders remain; missing/extra keys and ICU errors are 0.                                                                                    |
| `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts` after ICU catalog validation                                                                                          | Pass               | 7 focused tests. Default check now asserts the ICU-errors column and a zero-error locale row.                                                                                                         |
| `docs/i18n-translations.md` provider-refresh runbook audit                                                                                                                                                   | Updated            | Documents preflight checks, provider refresh commands, human review criteria, strict placeholder release gate, report verification, and generator self-test.                                           |
| `pnpm --filter @slothing/web check:translations:preflight`                                                                                                                                                   | Pass with warnings | Runs drift/ICU parity, generator self-test, and placeholder-report verification as one pre-provider command. Placeholders remain warn-only until provider refresh.                                     |
| `pnpm --filter @slothing/web check:translations:release`                                                                                                                                                    | Expected fail      | Final post-refresh gate is wired. It currently stops at strict placeholder enforcement with 2,303 placeholders remaining; missing/extra keys and ICU errors are 0.                                     |
| `pnpm --filter @slothing/web exec vitest run src/messages/translation-scripts.test.ts` after aggregate gate coverage                                                                                        | Pass               | 9 focused tests. Adds coverage for aggregate preflight success and aggregate release-gate expected failure while placeholders remain.                                                                 |
| CI/i18n workflow localization gate audit                                                                                                                                                                    | Updated            | Main CI translation job now runs `check:translations:preflight`; i18n fanout validates generated catalogs with `check:translations:release`.                                                          |
| `pnpm --filter @slothing/web check:translations:update-report`                                                                                                                                              | Pass with warnings | Regenerates `translation-placeholders.md` before release/report verification. Current report still lists 2,303 placeholders.                                                                          |
| `pnpm --filter @slothing/web check:translations:release` after report regeneration                                                                                                                          | Expected fail      | Still fails only at strict placeholder enforcement; report verification is ready once placeholders are cleared and the report is regenerated.                                                         |
| i18n fanout PR path audit                                                                                                                                                                                   | Updated            | `create-pull-request` now has explicit `add-paths` for locale catalogs and `translation-placeholders.md`, matching the PR-branch `git add` path.                                                      |
| i18n fanout provider fallback audit                                                                                                                                                                         | Updated            | Workflow secret validation and translation step now accept either `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, matching `translate-messages.ts`.                                                          |
| CI workflow-change filter audit                                                                                                                                                                             | Updated            | CI app-quality gates now run for edits to any `.github/workflows/*.yml` or `.github/workflows/*.yaml`, not only `ci.yml`.                                                                             |

Warning-level findings:

- Translation drift check still reports placeholder strings across non-English
  locales. It is warn-only today, but it is visible product debt before public
  polish loops.
- Studio tests emitted repeated React `act(...)` warnings around async state
  updates. Fixed in loop 5 by synchronizing global shortcut dispatches and the
  microtask save completion in the Studio page tests.
- Command palette tests emitted Radix dialog accessibility warnings for missing
  title/description metadata. Fixed in loop 1 with hidden dialog title and
  description.
- Several route-contract tests intentionally log malformed-input errors; this
  is acceptable when assertions verify sanitized HTTP responses.
- Web smoke previously emitted `metadataBase` warnings and local sqlite-vec
  bootstrap logs (`no such module: vec0`) in this environment. Fixed the
  metadata warning path in loop 4 by adding `metadataBase` to generated route
  metadata and the root layout shim; manual start/probe no longer reproduces
  it. Loop 6 reran the Playwright smoke harness with `PORT` and `NEXTAUTH_URL`
  aligned and passed.
- Chrome extension production bundles exceed webpack's default performance
  budget: background 876 KiB, content 1.18 MiB, popup 586 KiB, options 452 KiB.
  Loop 4 added an explicit bundle-size budget command so this is now a tracked
  threshold instead of only a webpack warning. Loop 8 inspected webpack stats
  and tightened the tracked thresholds to leave only modest headroom; the main
  structural opportunity is React/ReactDOM duplication across extension
  surfaces, which needs explicit extension runtime chunk design before changing.
- Markdown resume uploads exposed parser gaps around heading markers, ISO
  month dates, entry headers followed by date-only lines, and `BMath` education
  parsing. Fixed in loop 2 and covered by the dogfood resume fixture.
- The first full web rerun after loop 2 caught a wrapped PDF bullet regression
  in `extractExperiences`; fixed by narrowing the standalone-header heuristic
  so it does not steal the text line following an isolated bullet marker.
- Malformed ATS list dogfooding exposed that Greenhouse bulk import should
  dedupe repeated posting IDs while still keeping valid rows with relative URLs
  and missing optional location fields. Fixed in loop 3.
- Website-to-extension onboarding exposed dead Chrome, Edge, and Firefox store
  links ending in `/placeholder`. Fixed in loop 7 by rendering unavailable
  marketplace listings as disabled "coming soon" buttons until real store URLs
  exist.
- Cover-letter uploads with generic filenames could fall back to `other` when
  no LLM credentials were configured. Fixed in loop 9 with deterministic
  content heuristics and `cover-letter-upload-prose.md`.
- DOCX table extraction can leave column header rows and pipe-delimited role
  rows in plain text. Loop 10 added `table-docx-resume.txt`, skipped table
  headers during experience parsing, preserved pipe-delimited locations, and
  accepted `◦`, `→`, and `✓` as bullet markers.
- Cover-letter drafts with editor comments and referral wording such as
  "recommended I apply" could be confused with reference letters by
  deterministic classification. Fixed in loop 11 by tightening the reference
  heuristic and adding `cover-letter-tracked-comments.md`.
- A real DOCX table resume extracts through Mammoth as adjacent cell lines
  rather than pipe-delimited rows, and a singular `Credential` table cell was
  being treated as a Certifications section header. Fixed in loop 12 by adding
  `table-docx-resume.docx`, reconstructing experience table rows, and narrowing
  the certification header detector.
- The Workday multi-step unit fixture now covers contact, optional demographic,
  upload, disabled, and late review-step controls. Loop 13 hardened Workday
  field collection to skip read-only and file inputs before detection, and the
  fixture verifies session cleanup when the final submit button is clicked.
- Extension popup and options bundles duplicated React/ReactDOM. Loop 14 added
  a shared `sharedUi.js` entry for those HTML surfaces, updated popup/options
  e2e coverage to prove production pages render with the shared chunk, and
  expanded the bundle-size check to fail on unbudgeted JS chunks and total JS
  growth.
- Greenhouse bulk import dedupe was only visible as imported/attempted totals
  in the popup. Loop 15 threads `dedupedIds` through the content response,
  renders duplicate counts and row identities in `BulkSourceCard`, and adds a
  browser-level Greenhouse e2e with a local API stub.
- Translation placeholders cannot be cleared safely without provider
  credentials, but loop 16 adds `check:translations:strict` as an explicit
  release gate and records the per-locale placeholder breakdown in
  `translation-placeholders.md`. Loop 17 adds script-level tests so the
  warn-only default, strict failure, and providerless translation refusal cannot
  regress silently.
- Browser-level DOCX upload coverage initially failed because the source-file
  assertion ignored the bank page's review dialog and Source display mode.
  Loop 18 keeps the review dialog in the workflow, closes it through the
  visible Done action, and verifies source metadata after switching display
  modes.
- Translation provider credentials are still absent, so loop 19 adds
  `check:translations:report` to fail when the markdown placeholder audit falls
  out of sync with the locale catalogs. The verifier normalizes markdown table
  spacing so human formatting does not create false failures.
- Loop 20 hardens the provider-backed translation generator before credentials
  are available: translated output now fails validation if it drops source ICU
  arguments, invents extra ICU arguments, unbalances ICU braces, changes
  passthrough keys, or removes protected brand terms. `check:translations:generator`
  exercises those checks without provider keys.
- Loop 21 adds the same ICU argument parity check to the existing locale drift
  gate. The first run exposed false positives around plural branch display text
  and French apostrophes, so the scanner now walks ICU plural/select branches
  instead of using a flat regex. Current locale catalogs have 0 ICU errors.
- Loop 22 updates the i18n translation runbook so the remaining provider-backed
  work has explicit preflight commands, human review criteria, strict release
  gates, and report/generator verification steps. This does not clear the
  placeholders, but it reduces the risk of an unsafe refresh when credentials
  are available.
- Loop 23 adds `check:translations:preflight` as the executable version of the
  runbook preflight. It combines drift/ICU parity, generator validation, and
  placeholder-report verification into a single command.
- Loop 24 adds `check:translations:release` as the final post-refresh gate. It
  combines strict placeholder enforcement with generator and report checks; in
  the current providerless state it fails exactly on the remaining placeholder
  strings.
- Loop 25 adds focused test coverage for the aggregate localization gates so
  `check:translations:preflight` and the expected-failing
  `check:translations:release` cannot silently drift from the documented
  workflow.
- Loop 26 aligns GitHub workflow gates with the new localization commands:
  normal CI runs provider-free preflight, and the provider-backed i18n fanout
  workflow requires the strict release gate before committing generated
  catalogs.
- Loop 27 closes a workflow mismatch: the post-refresh release gate verifies
  the markdown placeholder report, so fanout now regenerates that report before
  validation and commits it with the locale JSON files.
- Loop 28 makes the push-to-main fanout PR path explicit by limiting
  `create-pull-request` staging to the generated locale catalogs and refreshed
  placeholder audit, matching the pull-request branch path.
- Loop 29 aligns i18n fanout provider handling with the translation script:
  automation can run with either Anthropic or OpenAI secrets instead of
  requiring Anthropic only.
- Loop 30 broadens the CI path filter so edits to any workflow YAML, including
  the i18n fanout workflow, trigger the app quality gates.

## Loop Queue

1. Continue warning cleanup: translation placeholder warnings once provider
   credentials are available; the drift guard is structurally passing with no
   missing or extra keys, and the placeholder markdown report is now verified
   against the catalogs.
2. Continue opportunistic polish loops when new dogfood failures are found.
