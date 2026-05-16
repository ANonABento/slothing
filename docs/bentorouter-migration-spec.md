# Slothing → BentoRouter Migration — Spec v2

**Status:** implementation-ready spec
**Owner:** TBD (handoff at bottom)
**Target version:** Slothing post-OSS-launch
**Last updated:** 2026-05-16
**Companion specs:** [`bentorouter-additions-spec.md`](./bentorouter-additions-spec.md) (BentoRouter-side gaps that must land before this can complete)

> **What changed in v2:** v1 added BentoRouter as a fifth provider alongside the existing four. v2 makes BentoRouter **the only provider layer** — direct OpenAI/Anthropic/Ollama/OpenRouter usage gets subsumed inside BentoRouter as backend providers. The user-facing `provider` enum disappears entirely. Reason: cleaner mental model (users pick *per-task* models, not a single global provider), free multi-provider routing, Choomfie integrates as just another backend, and the managed/paying-user mode falls out for free.

---

## 1. Goal

Replace Slothing's hand-rolled `LLMClient` (4-provider switch statement) with **BentoRouter as the sole AI runtime**. After this migration:

- Users add **multiple provider keys** in `/settings` (OpenAI, Anthropic, OpenRouter, custom OpenAI-compat URLs like Choomfie's eventual endpoint).
- Per-task model assignment happens in BentoRouter's embedded admin UI — also rendered in `/settings`.
- Every Slothing AI call is `router.run({ task: "slothing.X", messages, userId })`.
- The `provider` field disappears from user-facing types and settings.
- Cost and usage are first-class — visible to the user in `/settings`, available to the operator for billing.

This is the foundation for both:
- **BYOK (free OSS Slothing):** BentoRouter embedded; users bring their own keys.
- **Managed Slothing (future):** BentoRouter remote service; operator-side keys; per-user spend tracked via `userId`.

Same package, same task definitions. Mode differs by one env var.

---

## 2. Context

### What disappears

- `apps/web/src/lib/llm/client.ts` (`LLMClient` class) — replaced.
- `apps/web/src/lib/constants/llm.ts` (`LLM_PROVIDERS` enum, `LLM_ENDPOINTS`, `DEFAULT_MODELS`, `DEFAULT_MODEL_BY_PROVIDER`, `llmProviderSchema`, `llmConfigSchema`) — replaced.
- The "Provider" dropdown in `/settings/llm` — replaced.
- The single `llm: { provider, apiKey, baseUrl, model }` shape on `user.settings` — migrated to BentoRouter's provider+policy shape.

### What stays

- All other Slothing functionality. The user never sees `provider: "openai"` or any direct mention of which LLM made their resume parse. They configure providers once, set per-task policies (or accept defaults), and use the app.

### Dependency on BentoRouter v0.2.0

This migration depends on additions to BentoRouter described in [`bentorouter-additions-spec.md`](./bentorouter-additions-spec.md). **That work must complete and BentoRouter must publish a v0.2.0 (or be SHA-pinnable to the post-merge commit) before this Slothing migration can ship.** Specifically the Slothing migration requires:
- Runtime provider CRUD API
- `ProviderConfigStore` with JSON-file adapter
- Encryption hooks on `ProviderConfigStore`
- Extended admin component with Providers section
- `migrateLegacyLLMConfig()` helper export

---

## 3. Architecture

```
                    ┌──────────────────────┐
                    │  Slothing /settings  │
                    │   - Manage keys      │
                    │   - Per-task admin   │  (embeds BentoRouterAdminPage)
                    │   - Usage dashboard  │
                    └──────────┬───────────┘
                               │
                               │ user adds keys / edits policies
                               ▼
                  ┌────────────────────────────┐
                  │  BentoRouter (embedded)    │
                  │  - ProviderConfigStore     │ ◄─ encrypted by Slothing
                  │  - PolicyStore             │
                  │  - UsageStore              │
                  │  - ProviderRegistry        │
                  └────────────────────────────┘
                               ▲
                               │
   Slothing API route:         │  router.run({ task, messages, userId })
   const result = await router.run({...})
                               │
                               ▼
              ┌──────────┬──────────┬──────────────┬──────────────────┐
              │ OpenAI   │Anthropic │  OpenRouter  │  OpenAI-compat   │
              │  direct  │  direct  │              │  (Choomfie, etc) │
              └──────────┴──────────┴──────────────┴──────────────────┘
```

### Embedded vs service mode (still abstracted, defaulting to embedded)

`apps/web/src/lib/llm/bentorouter-client.ts` exports:
```ts
export interface BentoRouterClient {
  run(input: BentoRunInput): Promise<BentoRunOutput>;
  api(): BentoRouterApi;  // for /settings to call listProviders / addProvider / etc.
}

// EmbeddedBentoRouterClient — instantiates BentoRouter in-process
// RemoteBentoRouterClient   — POSTs to ${BENTO_ROUTER_URL}/api/bento-router/...
```

`BENTO_ROUTER_MODE=embedded` (default) or `remote`. v1 of this migration ships only embedded; remote wiring is a future PR.

### BYOK vs managed split

| | BYOK (default OSS) | Managed (future) |
|---|---|---|
| `BENTO_ROUTER_MODE` | `embedded` | `remote` |
| `ProviderConfigStore` | `JsonFileProviderConfigStore` at `~/.slothing/bento-router/providers.json` (encrypted) | Operator DB |
| `PolicyStore` | `JsonFilePolicyStore` at `~/.slothing/bento-router/policies.json` | Operator DB |
| `UsageStore` | `JsonFileUsageStore` at `~/.slothing/bento-router/usage.json` | Operator DB |
| Provider keys | User's keys; encrypted at rest via Slothing-provided encryption | Operator's keys; never sent to client |
| Admin UI scope | Full edit (providers + tasks) | Tasks only; provider section gated to ops |

### Encryption at rest

Provider API keys are the highest-sensitivity data Slothing handles after passwords. The migration spec assumes:
1. Slothing provides an `encrypt(plaintext: string) → string` and `decrypt(stored: string) → string` pair to BentoRouter at construction time.
2. The encryption key is derived from `NEXTAUTH_SECRET` (which is always present in Slothing) via HKDF — never stored on disk.
3. If `NEXTAUTH_SECRET` rotates, stored keys decrypt-fail; user is prompted to re-enter their provider keys. Acceptable tradeoff.
4. JSON file format stores `{ encryptedApiKey: "...", scheme: "aes-256-gcm-v1" }` so future scheme upgrades are detectable.

---

## 4. Task surface (unchanged from v1)

Define in `apps/web/src/lib/llm/tasks.ts`. Same 10 tasks as v1 §4:

| Task ID | Purpose | Primary (default) | Fallbacks (default) | Notes |
|---|---|---|---|---|
| `slothing.parse_resume` | Extract chunks from résumé text | `openrouter/anthropic/claude-haiku-4.5` | `openrouter/google/gemini-flash`, `openrouter/openai/gpt-4o-mini` | JSON-mode |
| `slothing.profile_extract` | Pull contact/headline/experience | `openrouter/anthropic/claude-haiku-4.5` | `openrouter/google/gemini-flash` | JSON-mode |
| `slothing.chunk_atomize` | Split long bullets | `openrouter/google/gemini-flash` | `openrouter/anthropic/claude-haiku-4.5` | Cheapest model |
| `slothing.opportunity_extract` | Job posting → structured | `openrouter/anthropic/claude-haiku-4.5` | `openrouter/google/gemini-flash` | JSON-mode |
| `slothing.classify_email` | Email → category | `openrouter/google/gemini-flash` | `openrouter/anthropic/claude-haiku-4.5` | JSON-mode |
| `slothing.score_match` | ATS-style résumé vs JD | `openrouter/anthropic/claude-sonnet-4.6` | `openrouter/openai/gpt-4o` | Long context |
| `slothing.tailor_resume` | Rewrite for JD | `openrouter/anthropic/claude-sonnet-4.6` | `openrouter/openai/gpt-4o` | Quality |
| `slothing.cover_letter_generate` | Cover letter from JD | `openrouter/anthropic/claude-sonnet-4.6` | `openrouter/openai/gpt-4o` | Quality |
| `slothing.answer_generate` | Interview Q&A | `openrouter/anthropic/claude-sonnet-4.6` | `openrouter/openai/gpt-4o` | Quality |
| `slothing.embedding` | Embed text chunks | `openrouter/openai/text-embedding-3-small` | local `nomic-embed-text` via Ollama | Embedding task |

Guardrails and defaults: see v1 §4. Same.

---

## 5. Implementation plan (6 phases)

### Phase 0 — Settings migration helper (Day 0.5)

Before any user-facing changes, build the migration helper that translates existing `user.settings.llm` rows to BentoRouter shape. This must be idempotent — running it twice is safe.

1. Import `migrateLegacyLLMConfig` from `@anonabento/bento-router` (per the BentoRouter additions spec).
2. `apps/web/src/lib/llm/migrate-legacy.ts` — wraps the BentoRouter helper, persists results into Slothing's user settings row.
3. A `migrationStatus: "pending" | "migrated"` flag on the user row gates re-runs.
4. Migration runs lazily on first API request after deploy, NOT in a batch migration script. This avoids needing to encrypt-decrypt every user's key in one transaction.

**DoD:** unit test that a user with `{ provider: "openai", apiKey: "sk-...", model: "gpt-4o-mini" }` after migration has a single OpenAI provider configured in BentoRouter and all 10 tasks' `primaryModel` set to `openai/gpt-4o-mini`.

### Phase 1 — Replace LLMClient core (Day 1)

1. Install dep: `pnpm add @anonabento/bento-router@github:ANonABento/bento-router#<sha>` (pin to BentoRouter post-additions SHA).
2. Create `apps/web/src/lib/llm/tasks.ts` per §4.
3. Create `apps/web/src/lib/llm/bentorouter-client.ts` with `BentoRouterClient` interface + `EmbeddedBentoRouterClient`:
   - Reads provider configs from `JsonFileProviderConfigStore` (path: `~/.slothing/bento-router/providers.json`)
   - Uses Slothing-provided encryption (HKDF from `NEXTAUTH_SECRET`)
   - `JsonFilePolicyStore` + `JsonFileUsageStore` at same root
   - Registers tasks at construction via `registerSlothingTasks(registry)`
4. **Replace** `apps/web/src/lib/llm/client.ts`:
   - Remove the `LLMClient` class entirely
   - Export `getLLMClient(): Promise<BentoRouterClient>` (signature change: now returns the bento client)
   - Old `LLMClient.complete()` and `stream()` callsites still work — but the underlying call is `router.run({...})`
5. **Wrapper compat layer** — to avoid a massive callsite sweep in Phase 1, ship a `LegacyClientCompat` that exposes `.complete(opts)` and `.stream(opts)` matching the old shape, internally calling `router.run`. Marked deprecated. Phase 2 sweeps callsites to use the new shape directly.
6. Remove from `apps/web/src/lib/constants/llm.ts`: `LLM_PROVIDERS`, `LLM_ENDPOINTS`, `DEFAULT_MODELS`, `DEFAULT_MODEL_BY_PROVIDER`. Keep `DEFAULT_LLM_TIMEOUT_MS` (used elsewhere).
7. Replace `llmProviderSchema` and `llmConfigSchema` in `updateSettingsSchema` with the new shape (see Phase 3).

**DoD:** Slothing dev server boots. Existing résumé-upload flow works end-to-end through `LegacyClientCompat`. Type-check + lint green.

### Phase 2 — Sweep callsites to native shape (Day 1.5)

Run `grep -rn "getLLMClient\|LLMClient\|\.complete\(\|\.stream\(" apps/web/src/` to find every callsite. For each:
- Replace `client.complete({ messages, temperature })` with `client.run({ task: "slothing.X", messages })`
- Remove `temperature`/`maxTokens` overrides at the callsite — those are now task policy.
- Add the appropriate `task` ID per §4 task surface.

Remove `LegacyClientCompat` after the last callsite migrates.

**DoD:** `grep` for `LegacyClientCompat` returns 0 hits. All callsites carry a `task` field. Existing E2E tests pass with no observable behavior change.

### Phase 3 — Rebuild `/settings/llm` UI (Day 2.5)

New page structure under `/settings/llm`:

```
┌──────────────────────────────────────────────────────────────┐
│  Providers                                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ OpenAI         sk-...3a4f       [Test] [Edit] [Remove] │ │
│  │ Anthropic      sk-ant-...8c1d   [Test] [Edit] [Remove] │ │
│  │ Choomfie       http://localhost:4141/v1   [Test] [...] │ │
│  └────────────────────────────────────────────────────────┘ │
│  [ + Add provider ]                                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Per-task model assignment                                   │
│  (embedded BentoRouterAdminPage with Providers extension)    │
│                                                              │
│  Task                          Primary       Fallbacks       │
│  slothing.parse_resume         Haiku 4.5     Gemini, GPT-4o  │
│  slothing.tailor_resume        Sonnet 4.6    GPT-4o          │
│  ...                                                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Usage (last 30 days)                                        │
│  (embedded BentoRouterUsageTable)                            │
└──────────────────────────────────────────────────────────────┘
```

1. New React tree under `apps/web/src/app/[locale]/(app)/settings/llm/page.tsx`:
   - `<ProvidersSection />` — uses BentoRouter's extended admin component (or sibling component `BentoRouterProviderManager` if the additions spec splits them)
   - `<TaskPoliciesSection />` — embeds `BentoRouterAdminPage` with full task list from `createBentoRouterApi(router).listTasks()`
   - `<UsageSection />` — embeds `BentoRouterUsageTable`
2. API routes: `apps/web/src/app/api/settings/llm/providers/route.ts` (GET/POST/DELETE) + `apps/web/src/app/api/settings/llm/providers/[id]/validate/route.ts` (POST). These proxy to `BentoRouterClient.api()`.
3. Theming: map Slothing editorial tokens onto BentoRouter's CSS contract per the BentoRouter additions spec's theming section. If the BentoRouter component doesn't yet expose enough hooks, file an issue against BentoRouter rather than working around it.
4. Validate flow: user enters a key → "Test" button → POST to `/providers/[id]/validate` → BentoRouter pings the provider's `/models` endpoint → green check or error message.

**DoD:** A user can add a new OpenAI key in `/settings/llm`, click Test, see it validated, save it, change `slothing.parse_resume`'s primary model to a GPT-4o variant, run a résumé upload, and see the cost logged in the usage table.

### Phase 4 — Auth + scoping (Day 0.5)

1. Provider keys belong to the Slothing user. Multi-user Slothing (managed mode) needs per-user scoping. v1 BYOK has only one user per install, but the schema must support multi-user from day 1.
2. `JsonFileProviderConfigStore` keys rows by `userId`. BentoRouter's API gets a `userId` filter on all provider/policy ops.
3. The Slothing API route layer enforces "user can only see/edit their own providers and policies."

**DoD:** integration test with two simulated users — User A can't see User B's providers, can't edit User B's policies.

### Phase 5 — Tests + docs (Day 1.5)

1. Unit: per-task definitions, migration helper, encryption round-trip.
2. Integration: full flow for each of the 10 tasks against a stub provider; fallback chain when primary fails; budget exhaustion → degradation message; multi-provider routing (different providers for different tasks).
3. E2E (Playwright): real résumé upload through `/en/components` with `bentorouter` active, assert chunks land in DB. Add `/settings/llm` E2E — add provider → test → save → edit task policy → upload → verify routing.
4. `apps/web/docs/llm-providers.md` (new) — user guide. Why BentoRouter, how to add providers, how to pick models per task, how to interpret usage.
5. `apps/web/CHANGELOG.md` — entry with **breaking change** notice (the `provider` field is gone). Auto-migration is silent and transparent for OpenAI users, but doc it.
6. `CLAUDE.md` updates — agent instructions for the new LLM surface.

**DoD:** all CI gates green, including `pnpm run lint`, `type-check`, `test:run`. Manual smoke through `/en/settings/llm` flows.

---

## 6. Files touched

**New:**
- `apps/web/src/lib/llm/tasks.ts`
- `apps/web/src/lib/llm/bentorouter-client.ts`
- `apps/web/src/lib/llm/migrate-legacy.ts`
- `apps/web/src/lib/llm/encryption.ts` (HKDF wrapper)
- `apps/web/src/app/api/settings/llm/providers/route.ts`
- `apps/web/src/app/api/settings/llm/providers/[id]/validate/route.ts`
- `apps/web/src/app/api/settings/llm/policies/[taskId]/route.ts`
- `apps/web/src/app/api/settings/llm/usage/route.ts`
- `apps/web/src/components/settings/llm/providers-section.tsx`
- `apps/web/src/components/settings/llm/task-policies-section.tsx`
- `apps/web/src/components/settings/llm/usage-section.tsx`
- `apps/web/docs/llm-providers.md`

**Modified:**
- `apps/web/src/lib/llm/client.ts` — replaced contents
- `apps/web/src/lib/constants/llm.ts` — removed legacy exports, kept `DEFAULT_LLM_TIMEOUT_MS`
- `apps/web/src/app/[locale]/(app)/settings/llm/page.tsx` — new layout
- All `LLMClient.complete()` / `.stream()` callsites (sweep in Phase 2)
- `apps/web/src/types/api.test.ts` line 312 — drops `llm: { provider: "openai", model: "gpt-4" }` shape
- `apps/web/src/lib/db/schema.ts` — settings table: add `migrationStatus` column (additive migration)
- `apps/web/package.json` — add `@anonabento/bento-router` dep
- `CLAUDE.md` — section on the new LLM surface
- `apps/web/CHANGELOG.md` — entry

**Deleted (or stubbed for backwards compat then deleted in Phase 2):**
- Old `LLMClient` class (eventually)
- Old `/settings/llm` form components

---

## 7. Testing strategy

### Unit (Vitest)
- 10 task registrations work
- Migration helper translates every combination of legacy `{ provider, apiKey, model }` correctly
- Encryption round-trip stable across NEXTAUTH_SECRET stability (and detects rotation)
- Multi-user scoping enforced in `JsonFileProviderConfigStore`

### Integration
- Stub providers + real BentoRouter + real tasks → each task runs end-to-end
- Fallback chain assertion (audit events have both attempts)
- Budget exhaustion assertion
- Provider validation endpoint pings stub providers, returns success/error appropriately

### E2E (Playwright)
- Fresh user → adds provider → tests it → saves → uploads résumé → chunks appear in DB
- Existing user (with legacy `llm.provider` settings) → first request triggers silent migration → uploads résumé → same chunks
- Two users isolation test

### Manual
- LobeChat or another OpenAI client → point at Slothing's BentoRouter via internal endpoint (if exposed; otherwise this is a Choomfie test)
- Real OpenRouter key, real résumé, real Slothing dev server

---

## 8. Open questions

1. **Migration timing for existing users** — silent on first request (Phase 0 default) vs. one-time `/settings` banner prompting them? Default is silent. Banner is nicer UX but more work.
2. **Default fallback chains** — the v1 §4 defaults use `openrouter/...` model strings everywhere. If a fresh user only adds an OpenAI direct key (no OpenRouter), the fallback chains have unreachable models. **Recommendation:** on every provider add, BentoRouter automatically updates task policies to add the new provider's equivalent model as a fallback (e.g., if user adds OpenAI direct, every task's fallback list gets `openai/gpt-4o-mini` appended). This needs to land in the BentoRouter additions spec.
3. **What happens when zero providers configured?** First-time install can't run any task. Recommendation: redirect any AI-feature use to `/settings/llm` with a banner ("Add at least one provider to get started"). Show a "Free tier" callout pointing to OpenRouter signup.
4. **Streaming through BentoRouter** — BentoRouter has first-class streaming. Verify Slothing's existing streaming callsites (Studio, ATS) survive the swap.
5. **Choomfie as a provider** — when Choomfie ships its endpoint (separate spec), users add it as a custom OpenAI-compat provider. Document this explicitly in `apps/web/docs/llm-providers.md`.

---

## 9. Non-goals

- Removing BentoRouter as a dependency. It's now required for any Slothing AI feature.
- Keeping the existing `provider` enum for backwards compat. It's deleted; legacy users get auto-migrated silently.
- Building managed/paying-user infrastructure. That's a future PR; this migration only ships BYOK embedded.
- Building Stripe integration. Future.
- Adding direct Gemini/Groq/Mistral providers to BentoRouter. Tracked in [`bentorouter-additions-spec.md`](./bentorouter-additions-spec.md) as optional; deferred.

---

## 10. Handoff prompt (paste this to the next agent)

> You are implementing the Slothing → BentoRouter migration per the spec at `/home/anonabento/slothing/docs/bentorouter-migration-spec.md`. Read it end-to-end before writing any code.
>
> **Hard prerequisite:** The BentoRouter additions described in `/home/anonabento/slothing/docs/bentorouter-additions-spec.md` MUST be merged and tagged in the BentoRouter repo before you start. If you're spawned before the BentoRouter agent finishes, check the BentoRouter repo's `main` branch for the expected additions: `ProviderConfigStore`, runtime provider CRUD API, encryption hooks, `migrateLegacyLLMConfig` helper export, extended admin component with Providers section. If anything is missing, stop and surface what's missing rather than working around it.
>
> **Repo:** `/home/anonabento/slothing` (Next.js 14 App Router + TypeScript + Tailwind + Drizzle/libSQL). Project conventions in `CLAUDE.md` are mandatory — forbidden-color/font/radius lints, `pluralize()`, `<TimeAgo />`, destructive-action pattern, additive migrations, no `--no-verify`, **no `Co-Authored-By: Claude` trailer** in any commit, PR description, or other attached text (project-wide user rule; hard ban).
>
> **Dependency:** `"@anonabento/bento-router": "github:ANonABento/bento-router#<sha>"` in `apps/web/package.json`. Pin to the BentoRouter post-additions SHA.
>
> **Scope:** Implement Phases 0-5 in §5. One PR per phase or stacked — your call. Each phase has its own Definition of Done; confirm before moving on.
>
> **Breaking change discipline.** The `provider` field is gone from user-facing types. Legacy users get auto-migrated silently in Phase 0. Document this in CHANGELOG. Smoke-test the migration helper with at least three legacy shapes: OpenAI direct, Anthropic direct, OpenRouter.
>
> **Encryption is a hard requirement.** Provider keys at rest must be AES-256-GCM encrypted with HKDF-derived key material from `NEXTAUTH_SECRET`. If `NEXTAUTH_SECRET` is missing (which shouldn't happen — Slothing requires it), throw on Slothing startup rather than storing plaintext.
>
> **Theming.** When `BentoRouterAdminPage` (or sibling Providers component) ships, Slothing wraps it in a container that sets the BentoRouter theming variables to Slothing's editorial tokens. If the component doesn't yet expose enough theming hooks, open an issue on `ANonABento/bento-router` — do NOT work around it in Slothing with CSS overrides past `.bento-router-admin { ... }`.
>
> **Auth scoping.** Phase 4's multi-user scoping is mandatory even for BYOK single-user installs. Every BentoRouter API call from Slothing carries `userId: session.user.id` (or `"default"` for the local-dev fallback). Tests must include the multi-user isolation case.
>
> **Resolve every §8 open question in PR descriptions and update §8 with the decisions.** Leave a paper trail.
>
> **Final deliverables:**
> 1. Slothing PRs implementing all 6 phases.
> 2. Updated `CLAUDE.md`, `CHANGELOG.md`, and new `apps/web/docs/llm-providers.md`.
> 3. Smoke test passes on a fresh OS-X / Linux install with no prior Slothing state.
> 4. Smoke test passes on an existing install with legacy `llm.provider` settings → silent migration.
>
> **When stuck:** the original requester owns both Slothing and BentoRouter. Surface ambiguities in PR descriptions rather than guessing.
