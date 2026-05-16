# Slothing — AI agent instructions

AI-powered job application assistant. Next.js 14 (App Router) + TypeScript + Tailwind + Drizzle/libSQL + NextAuth.

Tagline: **You're not lazy. Your job search system is.**

## Monorepo layout

- `apps/web` — Next.js app. When this doc says `src/...` it means `apps/web/src/...`.
- `apps/extension` — Slothing browser extension.
- `packages/shared` — types, Zod schemas, formatters, scoring logic.
- pnpm + Turborepo. Run workspace commands from repo root.

## Naming gotchas

The product is **Slothing** (domain `slothing.work`). The repo path is still `get-me-job` and the SQLite file is `apps/web/.local.db` (originally `data/get-me-job.db`). Browser `localStorage` keys still use the `taida:` prefix to preserve existing user data — do not rename them. Prefer "Slothing" in user-facing copy; "get-me-job" only for the file/path remnants.

## Routes — only the surprises

- `/jobs` is **removed**. The DB table is still named `jobs`, but the UX layer + API routes use `/opportunities`. Do not add `/api/jobs/*` aliases — they were deliberately removed.
- `/builder`, `/tailor`, `/cover-letter` are **308 redirect-only**. All resume + cover letter editing lives in `/studio` (`src/app/(app)/studio/page.tsx`). If you're building UI in those legacy routes, you're in the wrong place.
- `/opportunities/review` is the inbound queue for scraped/extension opportunities. New ingestion paths (URL scrape, extension, integrations) land here first — not directly in the tracked list.
- Marketing landing is `app/[locale]/(marketing)/page.tsx` — the **editorial reference** for visual polish. Don't edit it as a target; mimic its primitives elsewhere.

For anything else, `find src/app/[locale]` and `find src/app/api` are authoritative.

## Design system — editorial tokens (PR #271)

The active theme preset is **`slothing`** (`src/lib/theme/presets/slothing.ts`): cream paper light, Midnight Indigo dark, rust accent. The runtime theme-preset system aliases shadcn HSL tokens (`--background`, `--card`, `--primary`, …) onto Kev's palette so existing pages inherit the new look automatically.

Two coexisting token systems in `src/app/globals.css`:

**1. shadcn HSL stack** (driven by the runtime preset)

- Surfaces: `bg-background`, `bg-card`, `bg-muted`, `bg-popover`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`
- Borders: `border-border`, `border-input`, `border-primary`

**2. Static editorial tokens** (Kev's vocabulary — these are direct CSS vars, not HSL-wrapped)

- Surfaces: `bg-page`, `bg-page-2`, `bg-paper`, `bg-inverse`
- Ink: `text-ink`, `text-ink-2`, `text-ink-3`, `text-inverse-ink`
- Lines: `border-rule`, `border-rule-strong`, `bg-rule-strong-bg`
- Brand: `text-brand`, `text-brand-dark`, `bg-brand`, `bg-brand-soft`, `border-brand`
- Type: `font-display` (Outfit, H1/H2), `font-body` (Geist), `font-mono` (JetBrains Mono, captions)
- Editorial shadows: `shadow-paper-card`, `shadow-paper-elevated`, `shadow-panel`

Headings use `font-display tracking-tight`. Captions (mono eyebrows like "INSIDE SLOTHING") use `font-mono uppercase tracking-[0.16em]`. Editorial paper cards use `bg-paper` + solid `border` (not `border-dashed` — empty states are not drop-zones). Shared primitives (`PageHeader`, `PagePanelHeader`, `PageSection`, `StandardEmptyState`, shadcn `CardTitle`) already carry the editorial classes — adopt them rather than rendering bare `<h2>`.

Audit-loop history lives under `docs/ui-audit/redesign-loop-NNN/` (8 loops, PR #271). The editorial rollout plan is `docs/ui-redesign-plan.md`. Design handoff is `.design-ref/` (gitignored).

## Forbidden-color lint (hard-fail in CI)

`apps/web/scripts/forbidden-color-lint.cjs` runs as part of `pnpm run lint` and fails on:

- Tailwind color utilities: `bg-white`, `bg-black`, `text-gray-500`, `bg-slate-900`, `bg-zinc-*`, etc.
- Inline style props with hex/rgb/hsl/named colors.
- Arbitrary values like `bg-[#fff]` or `text-[rgb(0,0,0)]`.

Allowed: `var(--token)`, `transparent`, `inherit`, and any of the semantic utilities above. If you need a neutral surface, pick `bg-card`/`bg-paper`/`bg-background`/`bg-muted`. If you reach for `bg-white` _anywhere_, the build fails — no exceptions.

## Destructive actions

All user-facing destructive actions MUST follow `docs/destructive-actions-pattern.md`. Two patterns:

- **Pattern A — Confirm dialog** for hard deletes, bulk deletes, account resets, anything irreversible. Use `useConfirmDialog` from `src/components/ui/confirm-dialog.tsx`.
- **Pattern B — Optimistic undo snackbar** for reversible status changes / soft deletes. Use `useUndoableAction` from `src/hooks/use-undoable-action.ts`. 5-second default undo window.

Never ship a bare `<Button onClick={() => deleteX()}>`. When you add a destructive action, append a row to the **Current Actions** table in `docs/destructive-actions-pattern.md` and add a confirm/undo flow test.

## Pluralize, time, IDs

- `pluralize(count, "Job")` from `src/lib/text/pluralize.ts`. No inline `count === 1 ? "Job" : "Jobs"`.
- `<TimeAgo />` from `src/components/format/time-ago.tsx`, or `formatDateAbsolute` / `formatDateRelative` / `normalizeLocale` from `src/lib/format/time.ts`. Never `Date.toLocaleString()` inline — locale is user-configurable.
- Stable hash IDs (activity feed, dedupe). Never `Math.random()` — use `crypto.randomBytes()` server-side or a content hash client-side.

## Database conventions

- SQLite via better-sqlite3 + Drizzle (`src/lib/db/schema.ts`, `apps/web/drizzle.config.ts`).
- **Every user-owned table has `user_id TEXT NOT NULL DEFAULT 'default'`** plus a `idx_<table>_user_id` index. Always scope queries by `user_id`. `src/lib/auth.ts` resolves the current user via NextAuth, falling back to the `default` local user when env vars are missing (E2E can override via the `x-get-me-job-e2e-user` header).
- **Schema changes are additive migrations**, not rewrites. Use the `PRAGMA table_info` + `ALTER TABLE ... ADD COLUMN` pattern already in `schema.ts`. Existing dev DBs depend on it — don't drop and recreate.
- **Dedupe hashes are load-bearing.** `documents.file_hash` (sha256) + `idx_documents_user_file_hash`; `chunks` has unique `idx_chunks_user_hash` on `(user_id, hash)`; `profile_bank` has `idx_profile_bank_user_source`. Schema bootstrap + backfill live in `src/lib/db/dedupe-backfill.ts`. Hash first, short-circuit on collision — never insert blindly.

LLM-touching routes are wrapped with the sliding-window limiter from `src/lib/rate-limit.ts`. Errors flow through `src/lib/api-utils.ts`.

## LLM surface — BentoRouter

Slothing AI calls route through `@anonabento/bento-router`. User-facing provider/model settings are gone; provider keys and per-task policies live under Settings → AI keys and `/api/settings/llm/*`.

- Register Slothing task IDs in `src/lib/llm/tasks.ts`. Every AI call must carry one of those task IDs.
- Use `getBentoRouterClient()` or the transitional helpers in `src/lib/llm/client.ts`; do not add new direct provider switches.
- Legacy `getLLMConfig` / `setLLMConfig` exists only for silent migration and legacy import paths. New UI/API code should not expose the old `provider` enum.
- Provider keys are encrypted with AES-256-GCM using HKDF key material from `NEXTAUTH_SECRET`. Missing `NEXTAUTH_SECRET` is a configuration error for provider storage.
- BentoRouter file stores live under `~/.slothing/bento-router/` by default: `providers.json`, `policies.json`, and `usage.json`.

## CI gates

`.github/workflows/ci.yml` runs on every PR and push to `main`:

1. `pnpm run type-check` — strict TS across workspaces.
2. `pnpm run test:run` — full Vitest (3584+ tests).
3. `pnpm run lint` — `next lint` **and** `scripts/forbidden-color-lint.cjs`.

A Husky pre-commit hook runs `pnpm lint-staged` + `pnpm run type-check`. **Don't `--no-verify`.** If the hook fails, fix the underlying issue. (One past incident: a workspace-wide type-check failure silently destroyed staged work — recovery via `git fsck` dangling commits.)

The extension has its own pipeline: `.github/workflows/extension-e2e.yml`.

## Things future agents miss

1. **`width="narrow"` on app pages is lint-flagged.** App pages stay wide by default. For text-heavy blocks use `max-w-prose`. See `docs/page-width.md`.
2. **Welcome email series state is JSON** on `user.welcome_series_state`. Daily cron via `/api/cron/follow-ups`. All transactional sends go through `src/lib/email/transactional.ts`.
3. **Dashboard onboarding steps live in `src/lib/onboarding/steps.ts`.** Add/remove there. Restore dismissed onboarding with `setOnboardingDismissedAt(userId, null)`.
4. **`docs/architecture.md` (lowercase)** is the canonical architecture doc.
5. **TipTap document JSON is the editor data contract** for Studio — see `src/lib/editor/bank-to-tiptap.ts`, `src/lib/editor/cover-letter-tiptap.ts`, `src/lib/editor/resume-editor.tsx`, `src/lib/editor/document-html.ts`.
6. **Version history is browser-storage** keyed `taida:builder:versions:<document-id>` (see `src/lib/builder/version-history.ts`). Server doesn't persist drafts.
7. **Multiple theme presets are user-selectable.** `slothing` is the new default; `default`, `bloxy`, `glass`, `minimal`, `neon`, `earth`, `premium` still ship and switch via `/settings`. Edit `globals.css` tokens carefully — the runtime preset machinery in `src/lib/theme/apply.ts` overwrites HSL vars at runtime.

## Development commands

```bash
pnpm dev                                  # web dev server, port 3000
pnpm run build                            # production build, all workspaces
pnpm run type-check                       # strict TS across workspaces
pnpm run lint                             # next lint + forbidden-color + page-width
pnpm run test:run                         # one-shot Vitest (CI)
pnpm --filter @slothing/web test          # Vitest watch
pnpm --filter @slothing/web test:e2e      # Playwright e2e
```

## Environment variables (`.env.local`)

```env
# At least one LLM provider required
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434

# Optional — NextAuth + Google OAuth (omit for single-user dev fallback)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_NEXTAUTH_ENABLED=true

# Optional — email magic-link sign-in
RESEND_API_KEY=
EMAIL_FROM="Slothing <noreply@yourdomain.com>"
```

## Worktree gotcha

`apps/web/.env.local` and `apps/web/.local.db` are gitignored. A fresh `git worktree add` boots without auth + with an empty DB. Symlink from main:

```bash
MAIN=$(dirname "$(git rev-parse --git-common-dir)")
ln -sf "$MAIN/apps/web/.env.local" apps/web/.env.local
ln -sf "$MAIN/apps/web/.local.db"  apps/web/.local.db
```

## Key files

| File                                        | Purpose                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| `src/app/globals.css`                       | All theme + editorial tokens (light + `.dark`)                         |
| `src/lib/theme/presets/slothing.ts`         | Active theme preset (cream + Midnight Indigo)                          |
| `tailwind.config.ts`                        | Editorial utilities (`bg-page`, `text-ink`, `font-display`, …)         |
| `apps/web/scripts/forbidden-color-lint.cjs` | Hard-fail color lint                                                   |
| `src/lib/db/schema.ts`                      | Tables + additive migrations                                           |
| `src/lib/db/dedupe-backfill.ts`             | Dedupe schema bootstrap                                                |
| `src/lib/auth.ts`                           | NextAuth helper + local-dev fallback                                   |
| `src/lib/llm/tasks.ts`                      | Slothing BentoRouter task and model registrations                      |
| `src/lib/llm/bentorouter-client.ts`         | Embedded BentoRouter client + stores                                   |
| `src/lib/llm/migrate-legacy.ts`             | Silent legacy LLM settings migration                                   |
| `src/lib/llm/client.ts`                     | Transitional task-aware LLM helpers                                    |
| `src/lib/rate-limit.ts`                     | Sliding-window limiter for LLM routes                                  |
| `src/lib/text/pluralize.ts`                 | `pluralize(count, singular, plural?)`                                  |
| `src/lib/format/time.ts`                    | Locale-aware time helpers                                              |
| `src/components/format/time-ago.tsx`        | `<TimeAgo />`                                                          |
| `src/components/ui/confirm-dialog.tsx`      | Destructive Pattern A                                                  |
| `src/hooks/use-undoable-action.ts`          | Destructive Pattern B                                                  |
| `src/components/ui/page-layout.tsx`         | `PageHeader` / `PagePanel` / `StandardEmptyState` editorial primitives |
| `docs/architecture.md`                      | Architecture overview                                                  |
| `docs/destructive-actions-pattern.md`       | Destructive-action convention                                          |
| `docs/ui-redesign-plan.md`                  | Editorial rollout plan + decisions log                                 |
| `ROADMAP.md`                                | Product roadmap                                                        |
