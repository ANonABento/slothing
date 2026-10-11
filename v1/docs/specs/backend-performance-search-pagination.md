# Backend Performance, Search, and Pagination Spec

## Problem

Slothing's opportunity surfaces were fast to build but not correct at scale:

- `/api/opportunities` defaulted to the first 50 rows, then the UI searched,
  filtered, sorted, counted, and showed review queue links from only that local
  slice.
- `/opportunities/review` fetched unfiltered opportunities, so pending records
  outside the first 50 newest rows were invisible until unrelated records moved
  out of the way.
- The command palette fetched 10 recent opportunities and filtered in memory,
  so global search missed almost every older opportunity.
- Several hot DB helpers still use the synchronous local-only legacy libSQL
  wrapper, while production docs/config point at remote Turso/libSQL.

The target state is server-owned query semantics: the backend decides what
matches, returns stable cursor pages, exposes counts/facets, and uses indexes
or full-text search appropriate to the deployed database.

## Goals

1. Opportunity search must search all matching records for the authenticated
   user, not only records already loaded in the browser.
2. Review queue must be complete and deterministic for pending opportunities.
3. Command palette search must call backend search with the user query.
4. List pages must use keyset/cursor pagination and avoid deep offset paging.
5. Query paths must have matching indexes and regression tests.
6. Backend DB access should converge on one async Drizzle/libSQL surface that
   works for local SQLite and remote Turso.
7. Dogfooding must prove the app still feels fast and that no old slice-only
   search bugs remain.

## Non-Goals

- Replacing the entire storage model in phase 1.
- Building a dedicated external search service before measuring DB-native
  search limits.
- Removing local self-host support.

## Research Baseline

- Cursor/keyset pagination is the default for large user-owned feeds because
  offset pagination gets slower and less stable as pages get deeper.
- Stripe's public list APIs model this with a bounded `limit`, object cursors,
  and a `has_more` response flag.
- Algolia pages the full matching result set with `hitsPerPage`/page metadata
  and documents explicit pagination limits rather than expecting the client to
  filter an already-loaded slice.
- Elastic recommends `search_after` with stable sort values for deep search
  pagination instead of relying on deep `from`/`size` offsets.
- SQLite/libSQL can support exact-ish search with indexed columns and DB-native
  full text search before a separate search service is justified.
- SaaS global search should call backend search endpoints per entity type and
  merge bounded results client-side; it should not fetch recent records and
  filter in memory.

References:

- Prisma pagination docs: https://www.prisma.io/docs/orm/prisma-client/queries/pagination
- SQLite FTS5 docs: https://www.sqlite.org/fts5.html
- Turso FTS docs: https://docs.turso.tech/sql-reference/functions/fts
- Typesense search docs: https://typesense.org/docs/latest/api/search.html
- Algolia search docs: https://www.algolia.com/doc
- Stripe pagination docs: https://docs.stripe.com/api/pagination
- Elastic pagination docs: https://www.elastic.co/docs/reference/elasticsearch/rest-apis/paginate-search-results

## Current DB Surface Findings

- `src/lib/db/index.ts` is the deployable async database surface. It uses
  `@libsql/client` with Drizzle and supports both local `file:` URLs and remote
  Turso/libSQL URLs.
- `src/lib/db/legacy.ts` is a synchronous local-only adapter. It accepts
  `:memory:` and `file:` URLs, configures WAL/busy timeout, and throws for
  remote `libsql:`, `https:`, or `wss:` URLs.
- Opportunity routes currently depend on `src/lib/db/jobs.ts`, which imports
  `legacy.ts`. That keeps opportunity listing fast locally but means the same
  route is not remote-DB safe until jobs move to the async surface.
- The legacy adapter is widespread: direct imports appear in cron, extension,
  digest, reminders, welcome-series, knowledge-bank, analytics, templates,
  subscriptions, resumes, notifications, and opportunity-related modules.
  Phase 2 should migrate by feature ownership rather than trying a single
  repo-wide async rewrite.
- `src/lib/db/queries/jobs.ts` is already async Drizzle-based, but it is behind
  the current synchronous `src/lib/db/jobs.ts` implementation and lacks the new
  server-side search/filter/count pagination semantics. The least risky next
  step is to port the new `jobs.ts` query behavior into an async repository,
  then switch opportunity API routes and `src/lib/opportunities.ts` to await it.

## Phases

### Phase 1: Correct Existing Opportunity Queries

- Add server-side `q`, `status`, `sort`, and basic facet params to
  `/api/opportunities`.
- Return `statusCounts` and `totalMatching` from backend-owned counts.
- Make `/opportunities/review` request `status=pending`.
- Make command palette opportunities search pass `q`.
- Add indexes for status, deadline, company/title, and created-at pagination.
- Add regression tests for query propagation and slice-only search prevention.

### Phase 2: Backend Query Surface Cleanup

- Move opportunity/job helpers from `src/lib/db/legacy.ts` to the async
  `src/lib/db/index.ts` Drizzle/libSQL client.
- Keep raw SQL only behind typed repository functions.
- Add an integration test that boots against `file:` libSQL through the same
  async client used by remote Turso.
- Add a startup/build check that fails when a remote `TURSO_DATABASE_URL` route
  imports local-only legacy DB helpers.

Status:

- In progress. Opportunity-owned routes now use `src/lib/db/jobs-async.ts`,
  which talks to `@libsql/client` through `src/lib/db/client.ts` and does not
  import the legacy adapter or the `db/index.ts` barrel.
- `src/lib/db/client.ts` owns the side-effect-free libSQL client factory;
  `src/lib/db/index.ts` re-exports it for existing callers while continuing to
  provide the Drizzle barrel.
- Regression coverage includes an async job repository unit test plus route
  tests for opportunity list/detail/status/link/import/generate/cover-letter
  surfaces.
- `src/lib/db/remote-safety.test.ts` now guards migrated opportunity backend
  paths against re-importing `@/lib/db/jobs`, `@/lib/db/legacy`, or `./legacy`.
- Detailed remaining inventory and migration order live in
  `docs/specs/backend-phase-2-remote-db-cleanup.md`.
- Remaining Phase 2 work: migrate non-opportunity modules that still import
  `src/lib/db/legacy.ts`, add a remote-URL import guard, and decide whether the
  older synchronous `src/lib/db/jobs.ts` should become a compatibility wrapper
  or be deleted after callers move.

### Phase 3: Full-Text Search

- Add DB-native full-text indexing for opportunities:
  title, company, location, description, requirements, responsibilities,
  keywords, notes.
- For local SQLite/libSQL, use FTS5 or a compatible virtual table.
- For hosted Turso, use the Turso-supported FTS path.
- Keep fallback `LIKE` search for migrations or unsupported local builds.
- Add ranking and highlighting only after correctness and latency are verified.

### Phase 4: Unified App Search

- Add `/api/search?q=&limit=` with bounded per-entity results:
  opportunities, bank entries, answer bank, email drafts/templates.
- Move command palette providers to `/api/search` once entity search behavior is
  consistent.
- Add telemetry for provider latency and empty-result rates.

### Phase 5: Performance Audit and Dogfooding

- Seed at least 500 opportunities, including pending records beyond row 50 and
  search terms only present deep in the dataset.
- For local manual dogfooding, use the dev-only seed endpoint with
  `{"preset":"opportunities-heavy"}` and header
  `x-slothing-dev-tools: enabled`; it creates 120 opportunities including
  `deepsearch-sentinel` and `deep-pending-sentinel` fixtures beyond the first
  default page.
- Verify:
  - `/opportunities` first useful controls render promptly.
  - Search finds records beyond first page.
  - Review queue sees pending records beyond first page.
  - Command palette finds deep opportunity matches.
  - Load more keeps stable ordering with no duplicates.
- Capture before/after timings and screenshots for desktop and mobile.

## Acceptance Criteria

- No opportunity surface performs primary search/filter/count logic only on a
  browser-held first page.
- Review queue fetches pending opportunities directly.
- Command palette opportunity search sends the query to the backend.
- `pnpm --filter @slothing/web test:run -- src/app/api/opportunities/route.test.ts src/lib/db/jobs.test.ts src/components/command-palette/command-palette-search.test.ts` passes.
- A dogfood script or Playwright test proves deep-record search and pending
  queue visibility.
