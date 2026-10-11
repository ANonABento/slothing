# Backend Phase 2 Remote DB Cleanup Spec

## Problem

Phase 1 fixed opportunity query correctness, and the first Phase 2 slice moved
opportunity-owned routes to `src/lib/db/jobs-async.ts`. The app still has a
broader deployment risk: many backend paths import either the synchronous
`src/lib/db/jobs.ts` wrapper or the local-only `src/lib/db/legacy.ts` adapter.

That means local development can pass while remote Turso/libSQL deployments can
fail at module load or execute different DB behavior than production expects.

## Current State

- Remote-safe opportunity boundary:
  - `src/app/api/opportunities/**`
  - `src/app/api/extension/opportunities/**`
  - `src/lib/opportunities.ts`
  - related callers in cover-letter generation, Tailor, notifications,
    Gmail status detection, and Google calendar status sync.
- Remote-safe read-only jobs consumers:
  - `src/app/api/insights/route.ts`
  - `src/app/api/recommendations/route.ts`
  - `src/app/api/learning/paths/route.ts`
  - `src/app/api/calendar/feed/route.ts`
  - `src/app/api/calendar/export/route.ts`
  - `src/app/api/google/calendar/sync/route.ts`
  - `src/app/api/analytics/export/route.ts`
  - `src/app/api/export/opportunities/route.ts`
  - `src/app/api/export/route.ts`
  - `src/app/api/google/sheets/export/route.ts`
  - `src/app/api/ats/analyze/route.ts`
  - `src/app/api/ats/scan/route.ts`
  - `src/app/api/ats/scans/route.ts`
  - `src/app/api/email/generate/route.ts`
  - `src/app/api/email/drafts/**`
  - `src/app/api/email/sends/route.ts`
  - `src/app/api/salary/offers/route.ts`
  - `src/app/api/resume/track/route.ts`
  - `src/app/api/resume/stats/route.ts`
  - `src/app/api/companies/[id]/enrich/route.ts`
  - `src/app/api/companies/[id]/enrich/slugs/route.ts`
  - `src/app/api/cover-letters/[id]/route.ts`
  - `src/app/api/interview/answer/route.ts`
  - `src/app/api/interview/followup/route.ts`
  - `src/app/api/interview/prep-guide/route.ts`
  - `src/app/api/interview/sessions/route.ts`
  - `src/app/api/interview/sources/route.ts`
  - `src/app/api/interview/start/route.ts`
  - `src/lib/interview/context-pack-builder.ts`
  - `src/app/api/backup/route.ts`
  - `src/app/api/dev/seed/route.ts`
  - `src/app/api/bank/imports/**`
  - `src/app/api/documents/[id]/**`
  - `src/app/api/import/route.ts`
  - `src/app/api/import/csv/route.ts`
  - `src/app/api/import/job/route.ts`
  - `src/app/api/import/opportunities/route.ts`
  - `src/lib/digest/daily.ts`
  - `src/app/[locale]/(app)/opportunities/[id]/opengraph-image.tsx`
  - `src/app/[locale]/(app)/opportunities/[id]/research/opengraph-image.tsx`
  - `src/app/api/extension/auth/route.ts`
  - `src/app/api/extension/auth/verify/route.ts`
  - `src/app/api/extension/field-mappings/correct/route.ts`
  - `src/app/api/extension/profile/route.ts`
  - `src/app/api/extension/resumes/route.ts`
  - `src/app/api/account/route.ts`
  - `src/app/api/analytics/route.ts`
  - `src/app/api/analytics/success/route.ts`
  - `src/app/api/analytics/trends/route.ts`
  - `src/lib/extension-auth.ts`
  - `src/lib/db/extension-sessions.ts`
  - `src/lib/db/account-deletion.ts`
  - `src/lib/db/analytics.ts`
  - `src/lib/db/analytics-queries.ts`
  - `src/lib/db/cover-letters.ts`
  - `src/lib/db/document-artifacts.ts`
  - `src/lib/db/document-parse-runs.ts`
  - `src/lib/db/email-drafts.ts`
  - `src/lib/db/email-sends.ts`
  - `src/lib/plan/quota.ts`
  - `src/lib/digest/eligible-users.ts`
  - `src/lib/reminders/fire-due.ts`
  - `src/lib/db/notifications.ts`
  - `src/lib/db/suggested-status-updates.ts`
  - `src/lib/db/external-calendar-events.ts`
  - `src/lib/db/salary.ts`
  - `src/lib/db/ats-scans.ts`
  - `src/lib/db/opportunity-contacts.ts`
  - `src/lib/db/resume-tracking.ts`
  - `src/lib/db/company-research.ts`
  - `src/lib/db/custom-templates.ts`
  - `src/lib/db/web-vitals.ts`
  - `src/lib/db/waitlist.ts`
  - `src/lib/db/product-analytics.ts`
  - `src/lib/db/reminders.ts`
  - `src/lib/db/profile-versions.ts`
  - `src/lib/db/subscriptions.ts`
  - `src/lib/db/credits.ts`
  - `src/lib/db/prompt-variants.ts`
  - `src/lib/db/resumes.ts`
  - `src/lib/resume/templates.ts`
  - `src/app/api/prompts/**`
  - `src/app/api/notifications/**`
  - `src/app/api/reminders/**`
  - `src/app/api/profile/versions/**`
  - `src/app/api/salary/offers/**`
  - `src/app/api/{builder,resume/export,tailor}/route.ts`
  - `src/app/api/monitoring/vitals/route.ts`
  - `src/app/api/{waitlist,product-analytics}/route.ts`
  - `src/lib/enrichment/index.ts`
  - `src/app/api/cron/follow-ups/route.ts`
  - `src/app/api/cron/{cleanup,status,digest/daily,digest/weekly,email/retry,gmail/status-detect,reminders/tick}/route.ts`
  - `src/app/api/share/**`
  - `src/app/share/[token]/page.tsx`
  - `src/app/api/streak/route.ts`
  - `src/lib/cron/email-retry.ts`
  - `src/lib/cron/cleanup.ts`
  - `src/lib/welcome-series/state.ts`
  - `src/lib/welcome-series/predicates.ts`
  - `src/lib/welcome-series/process.ts`
  - `src/lib/db/cron-runs.ts`
  - `src/lib/db/shared-resumes.ts`
  - `src/lib/db/streak.ts`
  - `src/lib/db/streak-schema.ts`
  - `src/lib/streak/track.ts`
- Async DB entrypoint:
  - `src/lib/db/client.ts` owns the side-effect-free `@libsql/client` factory.
  - `src/lib/db/jobs-async.ts` owns opportunity job raw SQL and pagination.
  - `src/lib/db/index.ts` no longer re-exports `src/lib/db/jobs.ts`.
- Guardrail:
  - `src/lib/db/remote-safety.test.ts` fails if migrated opportunity paths
    re-import `@/lib/db/jobs`, `@/lib/db/legacy`, or `./legacy`.

## Remaining Legacy Inventory

As of this spec, static search still finds broad legacy usage:

- `@/lib/db/jobs` or `./jobs`: 4 import/export lines across `app/api` and
  `lib`, including tests/barrels.
- `@/lib/db/legacy` or `./legacy`: 12 import lines across `app/api` and `lib`,
  including tests.

High-priority production route groups still using the synchronous jobs module:

- Import/export/backup:
  - `src/app/api/import/**` migrated.
  - `src/app/api/export/**` migrated for opportunity/full export.
  - `src/app/api/backup/route.ts` migrated.
  - The previous `src/lib/db/index.ts` legacy jobs barrel export has been
    removed.
- Opportunity metadata:
  - Opportunity Open Graph image routes migrated.
  - `src/lib/db/opportunity-contacts.ts` migrated to the async client path, and
    opportunity contact list/create/delete routes now await contact reads and
    writes.
- Extension auth/support:
  - Extension auth, token verification, profile, resume picker, field-mapping
    correction, and shared extension-token auth helper migrated off direct
    `legacy.ts` imports.
- Calendar/Google:
  - `src/app/api/calendar/**` migrated for feed/export.
  - `src/app/api/google/calendar/sync/route.ts` migrated.
  - `src/lib/db/reminders.ts` migrated to the async client path, and reminder
    APIs plus calendar feed/export and Google calendar sync now await reminder
    reads and writes.
  - `src/app/api/google/sheets/export/route.ts` migrated.
- Interview/ATS/email consumers:
  - `src/app/api/interview/{answer,followup,prep-guide,sessions,sources,start}`
    and `src/lib/interview/context-pack-builder.ts` migrated.
  - `src/app/api/ats/**` migrated for analyze/scan.
  - `src/lib/db/ats-scans.ts` migrated to the async client path, and ATS scan
    history/persistence routes now await scan reads/writes.
  - `src/lib/db/cover-letters.ts` migrated to the async client path, and cover
    letter generate/save/history/detail plus import/export callers now await
    cover-letter reads and writes.
  - `src/lib/db/document-artifacts.ts` and
    `src/lib/db/document-parse-runs.ts` migrated to the async client path.
    Document extraction, parser-v2 run creation/list/detail/source-map, upload
    replacement cleanup, and bank import preview/commit callers now await
    artifact and parse-run reads/writes without importing through the DB barrel.
  - `src/app/api/email/**` migrated for generate/drafts/sends.
  - `src/lib/db/email-drafts.ts`, `src/lib/db/email-sends.ts`, and
    `src/lib/cron/email-retry.ts` now use the async libSQL client path.
- Analytics/recommendations/learning:
  - `src/lib/db/analytics.ts` migrated to the async client path, and analytics
    overview/trends, insights, and opportunity status-change callers now await
    snapshot/history reads and writes.
  - `src/lib/db/analytics-queries.ts` migrated to the async client path, so
    analytics overview/trends/success reads no longer hydrate through the
    local adapter.
  - `src/app/api/analytics/export/route.ts` migrated.
  - `src/app/api/insights/route.ts` migrated.
  - `src/app/api/recommendations/route.ts` migrated.
  - `src/app/api/learning/paths/route.ts` migrated.
- Prompt variants:
  - `src/lib/db/prompt-variants.ts` migrated to the async client path, and
    prompt settings APIs plus Tailor prompt selection/result logging now await
    prompt variant reads and writes.
- Company enrichment:
  - `src/app/api/companies/[id]/enrich/**` migrated.
  - `src/lib/db/company-research.ts` migrated to the async client path, and
    enrichment, interview prep, and context-pack callers now await cached
    company research and GitHub slug reads/writes.
- Digest/dev support:
  - `src/lib/digest/daily.ts` migrated.
  - `src/lib/digest/eligible-users.ts` migrated.
  - `src/app/api/dev/seed/route.ts` migrated.
- Billing/quota support:
  - `src/lib/plan/quota.ts` migrated.
  - `src/lib/db/subscriptions.ts` migrated to the async client path, and
    cloud checkout, portal, webhook, plan detection, and AI gate callers now
    await subscription reads/writes before making billing decisions.
  - `src/lib/db/credits.ts` migrated to the async client path, and cloud credit
    balance/history, Stripe invoice grants, AI credit deduction, and refunds
    now await credit ledger writes.
- Streak tracking:
  - `src/lib/db/streak.ts` and `src/lib/db/streak-schema.ts` migrated to the
    async client path, and `/api/streak` plus the safe tracking wrapper now
    await streak reads and writes.
- Profile versions:
  - `src/lib/db/profile-versions.ts` migrated to the async client path, and
    profile version list/detail/restore APIs now await version reads. Legacy
    `updateProfile` snapshot creation now awaits async profile-version writes.
- Account deletion:
  - `src/lib/db/account-deletion.ts` migrated to the async client path.
  - User-scoped deletes now run through an atomic libSQL batch while preserving
    optional-table checks and stored-document cleanup.
- Salary offers:
  - `src/lib/db/salary.ts` migrated to the async client path.
  - Salary offer list/create/detail/update/delete routes now await async
    repository calls.
- Custom template fallback rendering:
  - `src/lib/db/custom-templates.ts` migrated to the async client path.
  - `src/lib/resume/templates.ts` now resolves custom templates asynchronously,
    and builder, Tailor, opportunity generation, and resume export rendering
    await that lookup.
- Resume A/B tracking:
  - `src/lib/db/resume-tracking.ts` migrated to the async client path.
  - Resume track and stats APIs now await tracking writes, outcome updates, and
    stats reads.
- Generated resumes:
  - `src/lib/db/resumes.ts` migrated to the async client path.
  - Resume generation, Tailor, insights, backup/export, resume detail,
    comparison, export, and opportunity resume list/delete callers now await
    generated-resume reads and writes.
- Web vitals monitoring:
  - `src/lib/db/web-vitals.ts` migrated to the async client path.
  - `src/app/api/monitoring/vitals/route.ts` now awaits metric persistence,
    keeping load-time telemetry usable in remote libSQL deployments.
- Waitlist/product analytics:
  - `src/lib/db/waitlist.ts` and `src/lib/db/product-analytics.ts` migrated to
    the async client path.
  - Public waitlist signup, product analytics, opportunity creation, Tailor,
    and extension auth callers now await activation-event writes.
- Reminder firing:
  - `src/lib/reminders/fire-due.ts` migrated for due-reminder selection,
    claiming, rollback, and notification insert.
- Notifications/status suggestions:
  - `src/lib/db/notifications.ts` and
    `src/lib/db/suggested-status-updates.ts` migrated to the async libSQL
    client path.
  - Notification list/count/mutation APIs now await async DB access.
  - Gmail status detection, Google calendar sync, and extension imports now
    await notification/suggestion writes instead of relying on synchronous
    local inserts.
- Calendar event dedupe:
  - `src/lib/db/external-calendar-events.ts` migrated to the async client path,
    so the migrated Google calendar sync cron no longer reaches the local-only
    legacy adapter through event dedupe/recording.
- Welcome/follow-up cron:
  - `src/app/api/cron/follow-ups/route.ts` and
    `src/lib/welcome-series/{state,predicates,process}.ts` migrated.
- Cron/share support:
  - `src/lib/db/cron-runs.ts` and cron run writers/readers migrated to the
    async client path.
  - `src/lib/db/shared-resumes.ts`, share API routes, public share page, and
    cleanup cron share cleanup bootstrap migrated off direct `legacy.ts`.

## Plan

1. Convert read-only jobs consumers to async.
   - Replace `getJob`/`getJobs` route imports with `jobs-async`.
   - Await callers and update tests.
   - Prioritize routes that are user-facing on common page loads.

2. Convert import/create flows.
   - Move CSV/import/job/backup restore/dev seed onto `createJob` from
     `jobs-async`.
   - Keep dedupe behavior explicit for imports that currently call `getJobs`.

3. Collapse the old synchronous jobs module.
   - Production callers have moved off `src/lib/db/jobs.ts`.
   - Next, either delete `src/lib/db/jobs.ts` or turn it into a test/dev-only
     compatibility wrapper.

4. Expand static remote-safety coverage.
   - Add route groups to `remote-safety.test.ts` as they migrate.
   - Add a production-readiness check that fails when remote Turso is configured
     and production route code still imports `src/lib/db/legacy.ts`.

5. Migrate remaining `legacy.ts` feature modules by owner area.
   - Suggested order: notifications/suggested status, emails/drafts/sends,
     documents/artifacts/parse-runs, profile bank/knowledge bank, billing/plan,
     welcome/digest/cron.

## Acceptance Criteria

- No production opportunity path imports `@/lib/db/jobs` or `legacy.ts`.
- No production route that runs in remote deployments imports `legacy.ts`.
- `src/lib/db/index.ts` no longer re-exports a module that imports `legacy.ts`.
- Full type-check and full Vitest pass after each migration slice.
- Dogfood seed/search/review flows still pass after the old jobs module is
  deleted or isolated.
