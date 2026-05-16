# Legacy duplication audit — 2026-05-16

Survey-style read-only audit of `slothing` for *legacy duplication*: code/config patterns where the same value or behaviour is expressed in two unsynchronised places, creating "do I have to configure this in BOTH places?" UX pain. Triggered by the LLM API-key env/DB split we just patched in `LLMClient` (commit `5094f8b5`).

## Executive summary

The codebase has accumulated 4 active *job/opportunity* status definitions, 3 *job-schema* definitions (`createJobSchema` exported from two unrelated files with different field sets), 4 different `localStorage` key prefixes (`taida:`, `slothing:`, `get_me_job_`, `taida-`), and a `/api/settings/status` route that still answers "configured: false" when only env-fallback keys are present (the issue we just fixed in `LLMClient` did not propagate to the configured-check route). Stale LLM model defaults (2024-era Claude 3 / Llama 3.2) live alongside fresh Gemini additions in the same file. Most legacy `/builder`/`/tailor`/`/cover-letter` plumbing is intentional 308 redirects, but a few non-redirect surfaces (SEO page entries, OG image components) still treat them as primary canonicals.

## Findings

### Category 1 — Settings duplicated across env + DB

#### F1.1 — `/api/settings/status` ignores env-fallback API keys (HIGH)
- `apps/web/src/lib/llm/is-configured.ts:7` — `isLLMConfigured` only inspects the DB config; no env-fallback parity with `LLMClient` (which we just patched in `apps/web/src/lib/llm/client.ts:31-42`).
- `apps/web/src/app/api/settings/status/route.ts:18` consumes it; `apps/web/src/hooks/useLLMStatus.ts:24` and `apps/web/src/components/studio/ai-assistant-panel.tsx:260` poll it.
- Result: a user whose only key is `OPENAI_API_KEY` in `.env.local` will see "not configured" in the sidebar/AI panel even though `LLMClient` will happily complete requests. This is the *exact bug pattern* we just fixed in the client, but only half-fixed.
- Fix size: **small.** Move `resolveEnvApiKey` out of `client.ts`, share it with `is-configured.ts`, and have the status route compute the effective key (DB ?? env) before deciding `configured`.

#### F1.2 — OpenAI key read in two places, only one falls back (LOW-MED)
- `apps/web/src/lib/knowledge/embedder.ts:204-212` (`getOpenAIKey`) reads the DB config and falls back to `process.env.OPENAI_API_KEY` — but this duplicates the resolution logic that now lives in `LLMClient`, so the fallback order can drift.
- Fix size: **small.** Extract one `resolveOpenAIApiKey(userId)` helper and have both call sites use it.

#### F1.3 — `FEATURE_CHECKS` env-only check vs reality (LOW)
- `apps/web/src/lib/env.ts:9-26` warns "LLM Providers disabled — missing one of: OPENAI_API_KEY,…" at boot when none are env-set, even though the user may have a working DB-configured provider. Boot-time check has no DB view.
- Fix size: **medium.** Either accept the false warning (note it), or downgrade to a startup-info log and have a runtime check inside `/api/settings/status` be the authoritative "configured" signal.

### Category 2 — Constants / defaults duplicated across files

#### F2.1 — `JobStatus` defined four times, three sets of values (HIGH)
- `packages/shared/src/types.ts:82-90` — `JobStatus` type union with 8 values incl. `offered`, `withdrawn`, `dismissed`.
- `packages/shared/src/schemas.ts:3-10` — `jobStatusSchema` (zod) with 6 values: `pending,saved,applied,interviewing,offered,rejected`.
- `apps/web/src/lib/constants/jobs.ts:4-15` — `JOB_STATUSES` array + `JobStatus` type with 8 values incl. `offered`, `withdrawn`, `dismissed`, `pending`, `dismissed`.
- `packages/shared/src/schemas.ts:129-138` — `OPPORTUNITY_STATUSES` with `offer` (not `offered`), `expired`, `dismissed`.
- The UI surface uses `OpportunityStatus`; legacy `JobStatusBadge` (`apps/web/src/components/jobs/job-status-badge.tsx:2`) is still mounted on the dashboard (`apps/web/src/components/dashboard/editorial-sections.tsx:13,379`) and uses the *old* 8-value `JobStatus`. So a row written with `status: 'offer'` from the API path will fall through `STATUS_LABELS[status as JobStatus] ?? 'Saved'` and silently render as "Saved".
- Fix size: **medium.** Pick one canonical: `OpportunityStatus` from `@slothing/shared/schemas`. Delete `JOB_STATUSES`/`JobStatus`/`jobStatusSchema` from both other files. Replace `JobStatusBadge` consumers with an `OpportunityStatusBadge` (or extend the existing one to accept the canonical union).

#### F2.2 — `createJobSchema` exported from two files with different fields (HIGH)
- `packages/shared/src/schemas.ts:20-50` — `createJobSchema` (shared package, accepts `requirements/responsibilities/keywords` arrays, no `notes` length defaults same).
- `apps/web/src/lib/constants/jobs.ts:84-103` — `createJobSchema` (local, slightly different validation: `description.min(10)`).
- `apps/web/src/lib/validation/jobs.ts` re-exports the **shared** one; `apps/web/src/lib/constants/index.ts:28` re-exports the **local** one.
- `/api/opportunities/route.ts:16,133` consumes `createJobSchema` from `@/lib/constants` (local 8-value statuses, min(10) description), while `validation/jobs.ts` is the supposed canonical wrapper around the shared schema. If anything in the codebase ever switches its import source, validation rules will silently change.
- Fix size: **medium.** Delete the local copy; route everything through `@slothing/shared/schemas` (or `@/lib/validation/jobs`).

#### F2.3 — `KANBAN_LANE_IDS`, `CLOSED_SUB_STATUSES`, `KANBAN_LANE_GROUPS`, `inferLaneFromStatus`, `isClosedSubStatus`, `normalizeKanbanVisibleLanes`, `kanbanLaneIdSchema`, `kanbanVisibleLanesSchema`, `DEFAULT_KANBAN_VISIBLE_LANES` defined **identically** in two files (MED)
- `packages/shared/src/schemas.ts:140-205, 292-295`
- `apps/web/src/types/opportunity.ts:39-112`
- Both are exported. Risk: a future contributor edits one and not the other.
- Fix size: **small.** Make `apps/web/src/types/opportunity.ts` a pure re-export from `@slothing/shared/schemas` for these symbols (it already imports `OpportunityStatus` from there).

#### F2.4 — `InterviewQuestionCategory` (5 values incl. `cultural-fit`) vs `INTERVIEW_CATEGORIES` (5 values incl. `company`) vs `SESSION_QUESTION_CATEGORIES` (5 values incl. `cultural-fit`) (MED)
- `apps/web/src/types/interview.ts:3-8` — inline union with `cultural-fit`.
- `apps/web/src/lib/constants/interview.ts:4-10` — `INTERVIEW_CATEGORIES` with `company` (no `cultural-fit`).
- `apps/web/src/lib/constants/interview.ts:73-79` — `SESSION_QUESTION_CATEGORIES` with `cultural-fit` (no `company`).
- Note `apps/web/src/lib/constants/interview.ts:43-49` literally re-spells the same `cultural-fit` set inline inside `startInterviewSchema` rather than reusing `SESSION_QUESTION_CATEGORIES`.
- Fix size: **small-medium.** Collapse to one source; have `InterviewQuestionCategory = SessionQuestionCategory`; reuse the schema everywhere.

#### F2.5 — `STORAGE_KEYS.THEME` is dead duplication of theme storage keys (LOW)
- `apps/web/src/lib/constants/storage.ts:13` — `STORAGE_KEYS.THEME = "get_me_job_theme"` (never read).
- Actual theme storage: `apps/web/src/lib/theme/storage-keys.ts:1-2` — `THEME_STORAGE_KEY = "theme"`, `THEME_DARK_STORAGE_KEY = "theme-dark"`.
- Fix size: **small.** Delete `STORAGE_KEYS.THEME` and `STORAGE_KEYS` entirely if `ONBOARDING_COMPLETED` is its only other entry (see F4.1).

#### F2.6 — `PATHS.DATABASE` points at deprecated `data/get-me-job.db` (LOW)
- `apps/web/src/lib/constants/paths.ts:7-10` — `PATHS.DATABASE = process.env.GET_ME_JOB_SQLITE_PATH || path.join(process.cwd(), "data", "get-me-job.db")`. No consumers (grepped). Actual DB resolution lives in `apps/web/src/lib/db/index.ts:27` and `apps/web/src/lib/db/legacy.ts:6` (`file:./.local.db`).
- Fix size: **small.** Remove `PATHS.DATABASE` and `GET_ME_JOB_SQLITE_PATH` references.

#### F2.7 — DB tables defined in Drizzle schema *and* via raw `CREATE TABLE IF NOT EXISTS` (MED)
- `apps/web/src/lib/db/credits.ts:70-87` defines `credit_balances`/`credit_transactions`; same tables in `schema.ts:401-419`.
- Same pattern in `streak-schema.ts`, `email-sends-schema.ts`, `opportunity-contacts-schema.ts`, `prompt-variants.ts`, `external-calendar-events.ts`, `suggested-status-updates.ts`, `subscriptions.ts`, `knowledge/knowledge-bank.ts`.
- Risk: Drizzle definition can be edited and forget to keep the runtime DDL in sync (or vice versa). This is *partly* deliberate (additive bootstrap when the table didn't exist in the original schema), but the duplication is permanent.
- Fix size: **medium-large.** Either generate the bootstrap SQL from the Drizzle metadata, or move all `CREATE TABLE` strings into a single migration registry file that imports column names from the Drizzle objects so a column rename fails to type-check.

### Category 3 — Stale models / version strings

#### F3.1 — `DEFAULT_MODEL_BY_PROVIDER.anthropic` is `claude-3-haiku-20240307` (HIGH user-pain)
- `apps/web/src/lib/constants/llm.ts:88-92`. `claude-3-haiku-20240307` and `claude-3-sonnet-20240229` are early-2024 model IDs and may already be retired (Anthropic retires legacy 3.x periodically). Today's Anthropic users on this default will silently fall through to "model not found" errors.
- `apps/web/src/lib/constants/llm.ts:62` — `ollama: ["llama3.2", ...]` is fine but newer Llama 3.3 / Llama 4 omitted.
- `apps/web/src/lib/billing/ai-gate.ts:166` — `model: process.env.SLOTHING_HOSTED_LLM_MODEL ?? "gpt-4o-mini"` is fine for now but the same staleness clock is ticking.
- Fix size: **small.** Bump anthropic defaults to `claude-haiku-4-5-20251001` / `claude-sonnet-4-5-20250929` (or your preferred 4.x SKUs), update `DEFAULT_MODELS.anthropic`. Add a comment explaining "this list is the *default* dropdown; users can paste any model ID."

### Category 4 — Legacy routes vs new

#### F4.1 — SEO entries for `/builder`, `/tailor`, `/cover-letter` still point at the redirect routes (LOW; mitigated by noindex)
- `apps/web/src/lib/seo.ts:39-50, 69-74` — `pages.builder.path = "/builder"`, `coverLetter.path = "/cover-letter"`, `tailor.path = "/tailor"`.
- These are emitted as `<link rel="canonical">` and OG URLs for the redirect pages (`apps/web/src/app/[locale]/(app)/builder/opengraph-image.tsx` etc.). App layout is `noindex/nofollow` (`apps/web/src/app/[locale]/(app)/layout.tsx:17`) so the SEO impact is muted — but the canonical still resolves to a `308` route, which crawlers report as soft errors.
- Fix size: **small.** Point all three at `/studio` (or delete the entries and the OG images for redirect routes — they don't serve crawlers).

#### F4.2 — `/api/extension/jobs`, `/api/export/jobs`, `/api/import/jobs` survive as "legacy compatibility" routes without callers (LOW)
- `apps/web/src/app/api/extension/jobs/route.ts`, `apps/web/src/app/api/export/jobs/route.ts`, `apps/web/src/app/api/import/jobs/route.ts` all document themselves as legacy. No client-side fetcher refers to them (grepped; extension uses `/api/opportunities/from-extension`).
- Per `CLAUDE.md`: "Do not add `/api/jobs/*` aliases — they were deliberately removed." These three sub-routes still exist and write through `createJob` to the *jobs* table (not the *opportunities* table flow), so anything that did hit them would create silent state divergence.
- Fix size: **medium.** Decide: either delete them, or make them write through the opportunities path with a deprecation header.

#### F4.3 — `components/jobs/*` + `lib/jobs/*` UI primitives still mounted on dashboard + opportunities (MED)
- `apps/web/src/components/jobs/job-status-badge.tsx`, `job-card.tsx`, `jobs-toolbar.tsx`, `job-kanban-utils.ts`, `import-job-dialog.tsx`; `apps/web/src/lib/jobs/filter-jobs.ts`. All still consumed by `dashboard/page.tsx` and `opportunities/page.tsx`.
- These work against the legacy `JobStatus` union (F2.1), so they render `OpportunityStatus="offer"` rows as the fallback "Saved" label.
- Fix size: **medium.** Either rename the directory to `opportunities/` and migrate to the canonical `OpportunityStatus`, or wrap with adapters that map `offer ↔ offered`, `closed ↔ withdrawn|dismissed|expired`. The current state silently mis-labels Offer rows on the dashboard.

### Category 5 — localStorage namespace fragmentation

#### F5.1 — Four prefixes coexist; only `taida:` is wiped by Danger Zone reset (MED)
- `taida:` (intentional per `CLAUDE.md`) — `chrome-provider.tsx`, `command-palette.ts`, `version-history.ts`, `studio/use-studio-page-state.ts`, `interview/*`, `answers-tab.tsx`, `sidebar-extension-card.tsx`.
- `slothing:` — `apps/web/src/app/[locale]/(app)/components/components-tab.tsx:625` (`slothing:selectedBankEntryIds`) and `apps/web/src/components/studio/use-studio-page-state.ts:170` (`slothing:selectedBankEntryIds` again).
- `get_me_job_` — `apps/web/src/lib/constants/storage.ts:11-13` (`STORAGE_KEYS.ONBOARDING_COMPLETED = "get_me_job_onboarding_completed"`), read by `apps/web/src/components/onboarding.tsx:61-85`.
- `taida-` (dash, not colon) — `apps/web/src/app/[locale]/(app)/opportunities/page.tsx:89` (`taida-opportunities`).
- `theme` / `theme-dark` (no prefix) — `apps/web/src/lib/theme/storage-keys.ts` and `apps/web/src/lib/theme/preload-script.ts`. Bare `localStorage.getItem('theme')` collides with literally any other library that namespaces its theme key as `theme` (Tailwind UI demos use this exact key).
- `editorial-prefs` / `editorial-prefs:font-body` — `apps/web/src/lib/editorial-prefs/provider.tsx:34`, `apps/web/src/lib/editorial-prefs/preload.ts:6`.
- Danger Zone "Reset local preferences" (`apps/web/src/components/settings/danger-zone-section.tsx:59`) only wipes keys starting with `taida:` — so `slothing:selectedBankEntryIds`, `get_me_job_onboarding_completed`, `taida-opportunities`, `theme`, `theme-dark`, and `editorial-prefs` all survive the "reset" and leave inconsistent state.
- Fix size: **medium.** Either (a) widen the reset prefix list to include all five, or (b) migrate every key to `taida:`-prefix at next read (with one-shot migrators) and centralise key constants in one module.

#### F5.2 — `slothing:selectedBankEntryIds` collides between Studio and Components page (LOW)
- Same key used in `apps/web/src/components/studio/use-studio-page-state.ts:170` AND `apps/web/src/app/[locale]/(app)/components/components-tab.tsx:625`. If the Components tab and the Studio happen to be open in two tabs, they fight over the value.
- Fix size: **small.** Rename one of them or accept that they're meant to share.

### Category 6 — Type / schema drift

#### F6.1 — `Settings` interface (UI shape) ≠ Drizzle `Settings` row type (LOW; intentional but trap-shaped)
- `apps/web/src/types/index.ts:66-70` — `{ llm, theme, locale }`.
- `apps/web/src/lib/db/schema.ts:957` — `Settings = typeof settings.$inferSelect` (a single key/value row).
- Same name, totally different shape. A new contributor will import the wrong one.
- Fix size: **small.** Rename the Drizzle export to `SettingsRow`.

#### F6.2 — Manual TS interface where `z.infer` would suffice — `LLMConfig` (LOW)
- `packages/shared/src/types.ts:124-129` — hand-written `LLMConfig` interface.
- `apps/web/src/lib/constants/llm.ts:19-26` — `llmConfigSchema` (zod) + `LLMConfigInput = z.infer<typeof llmConfigSchema>`. They line up today.
- Risk: schema and type drift on the next field addition.
- Fix size: **small.** Make `LLMConfig = z.infer<typeof llmConfigSchema>` and delete the manual interface.

#### F6.3 — `BankEntry` defined in three slightly different shapes (LOW)
- `packages/shared/src/types.ts:144-152` — `BankEntry` (canonical).
- `apps/web/src/lib/db/profile-bank.ts:5-19` — `BankEntryRow` and `BankEntryCursor` (DB row shape, different field names).
- `apps/web/src/app/api/bank/[id]/route.ts:18-23` — `BankEntryUpdateBody` and `BankEntryParams` (HTTP request shape).
- This is normal layering (domain/db/http), but the names are confusing.
- Fix size: **small.** Suffix the local ones (`…Row`, `…Body`) consistently and reserve `BankEntry` for the domain type.

## Triage table

| ID | Finding | User-visible pain | Ease of fix | Priority |
| -- | ------- | ----------------- | ----------- | -------- |
| F1.1 | `/api/settings/status` ignores env keys → sidebar/AI panel says "not configured" | HIGH (the exact UX bug we set out to fix) | SMALL | **P0** |
| F2.1 | 4 JobStatus enums; `OpportunityStatus="offer"` renders as "Saved" on dashboard | HIGH (silent mis-label on dashboard) | MEDIUM | **P0** |
| F3.1 | Default Anthropic model is 2-year-old, possibly retired SKU | HIGH (user hits "model not found" on first run) | SMALL | **P0** |
| F2.2 | Two `createJobSchema` exported with different validations | MED (silent validation drift on import-source change) | MEDIUM | P1 |
| F5.1 | Danger-Zone reset misses 5 of 6 localStorage namespaces | MED (advertised reset doesn't reset) | MEDIUM | P1 |
| F4.3 | Legacy `components/jobs/*` still on dashboard, drives F2.1's mis-label | MED | MEDIUM | P1 |
| F2.3 | Kanban primitives literally copy-pasted between two files | LOW (drift waiting to happen) | SMALL | P2 |
| F1.2 | OpenAI key fallback duplicated between `client.ts` and `embedder.ts` | LOW (works today, drifts tomorrow) | SMALL | P2 |
| F2.4 | Three near-identical interview-category enums | LOW | SMALL-MED | P2 |
| F2.7 | DB tables defined in Drizzle + raw `CREATE TABLE IF NOT EXISTS` | LOW (no current bug, real footgun) | MED-LARGE | P2 |
| F4.2 | Three legacy `/api/*/jobs` routes without callers | LOW (dead code, possible state drift) | MEDIUM | P3 |
| F2.5 | `STORAGE_KEYS.THEME` dead constant | LOW | SMALL | P3 |
| F2.6 | `PATHS.DATABASE` points at non-existent path | LOW (dead code) | SMALL | P3 |
| F4.1 | SEO entries canonicalise `/builder`,`/tailor`,`/cover-letter` (redirect routes) | LOW (noindex'd anyway) | SMALL | P3 |
| F1.3 | Boot-time env check warns even when DB-configured | LOW (noisy logs) | MEDIUM | P3 |
| F5.2 | `slothing:selectedBankEntryIds` shared between two pages | LOW | SMALL | P3 |
| F6.1 | Two `Settings` types with totally different shape | LOW (foot-gun on import) | SMALL | P3 |
| F6.2 | `LLMConfig` interface hand-written next to its zod schema | LOW | SMALL | P3 |
| F6.3 | Three `BankEntry`-ish names | LOW | SMALL | P3 |

## Top 3 high-impact items

1. **F1.1** — Make `isLLMConfigured` env-aware so `/api/settings/status` matches `LLMClient`'s behaviour. Same fix shape as commit `5094f8b5`, applied one route deeper.
2. **F2.1 + F4.3** — Unify on `OpportunityStatus`. The legacy `JobStatus` enum + `JobStatusBadge` mis-label `offer`-status rows as "Saved" on the dashboard, today, with no warning.
3. **F3.1** — Bump default Anthropic / model SKUs in `apps/web/src/lib/constants/llm.ts`; the current defaults date to early 2024 and produce "model not found" errors as Anthropic retires legacy 3.x.

## What I did not get to

- Did not audit the Chrome extension (`apps/extension/`) for parallel constants — only checked its API endpoint surface.
- Did not enumerate every `<TimeAgo />`-flavoured locale fallback; spot-check looked clean.
- Did not check the welcome-email JSON schema vs the DB row shape (CLAUDE.md flagged it as already canonical-on-`user.welcome_series_state`); a deeper look might find drift between `welcomeSeriesStateSchema` in `state.ts` and the read path in `process.ts`.
- Did not exhaustively grep marketing pages (`apps/web/src/app/[locale]/(marketing)/`) for hardcoded copy that duplicates editorial tokens or LLM model lists.
- Did not check `packages/shared/dist/` for stale built output — it does exist (`packages/shared/dist/types.d.ts`) and could drift from `src/`, but a build step keeps it in sync.
- Did not enumerate `tailor` / `studio` / `resume` type duplication; many `Resume*`, `CoverLetter*` interfaces in `apps/web/src/types/api.ts` look like layered (request/response/db) variants, which is fine.
