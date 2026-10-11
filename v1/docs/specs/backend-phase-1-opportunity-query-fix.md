# Phase 1 Opportunity Query Fix Spec

## Scope

Phase 1 fixes the user-visible backend bugs without changing the whole
database architecture:

- Opportunities list search/filter/sort must be backed by `/api/opportunities`.
- Review queue must fetch pending opportunities directly.
- Command palette must search opportunities by query server-side.
- Indexes must support the new hot predicates.

## API Contract

`GET /api/opportunities` accepts:

- `limit`: `1..200`, default `50`.
- `cursor`: opaque keyset cursor.
- `status`: comma-delimited opportunity statuses.
- `q` or `search`: text search across title, company, location, description,
  requirements, responsibilities, keywords, and notes.
- `sort`: `createdAt`, `scrapedAt`, `deadline`, `company`, or `salary`.
- `remoteType`: currently maps `remote` to `remote = 1` and non-remote remote
  types to `remote = 0`.
- `type`: job type.
- `techStack` or `tag`: keyword JSON containment fallback via `LIKE`.

Response includes:

```json
{
  "jobs": [],
  "opportunities": [],
  "items": [],
  "nextCursor": null,
  "hasMore": false,
  "statusCounts": {
    "pending": 0,
    "saved": 0,
    "applied": 0,
    "interviewing": 0,
    "offer": 0,
    "rejected": 0,
    "expired": 0,
    "dismissed": 0
  },
  "totalMatching": 0
}
```

`statusCounts` is computed with the same non-status filters so tabs and review
badges are not derived from the current page slice.

## Query Rules

- Default API order remains newest created first.
- `sort=scrapedAt` aliases newest created first because the legacy `jobs` table
  stores created/scraped time as `created_at`.
- `sort=deadline` places non-empty deadlines first, ascending, then falls back
  to newest created and descending ID.
- `sort=company` orders company/title case-insensitively, then newest created
  and descending ID.
- `sort=salary` is a stopgap numeric parse of the first salary number; phase 3
  should replace this with structured salary columns.

## Migration

Add indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_jobs_user_status_created_id
ON jobs (user_id, status, created_at, id);

CREATE INDEX IF NOT EXISTS idx_jobs_user_deadline_created_id
ON jobs (user_id, deadline, created_at, id);

CREATE INDEX IF NOT EXISTS idx_jobs_user_company_title_created_id
ON jobs (user_id, company, title, created_at, id);
```

## UI Changes

- `/opportunities` sends `q`, `sort`, and `status` to the API and uses returned
  `statusCounts`/`totalMatching`.
- `/opportunities/review` sends `status=pending&sort=deadline&limit=50` and
  prefetches more pending records as the local queue gets low.
- Command palette sends `/api/opportunities?q=<query>&limit=5`.

## Regression Tests

- API route test proves query/sort/filter params reach the repository.
- API route test proves `statusCounts` and `totalMatching` are returned.
- DB helper test proves SQL contains server-side `LIKE`, status, sort, and
  cursor predicates.
- Command palette test proves the query goes to `/api/opportunities`.

## Known Followups

- Source filtering is weak because extension source metadata is currently
  packed into notes rather than first-class columns.
- `jobs` is still the storage table for opportunities.
- Most hot query helpers still use the synchronous local-only legacy wrapper.
- Search is `LIKE`-based until DB-native full text search is added.
