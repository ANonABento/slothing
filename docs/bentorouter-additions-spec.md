# BentoRouter Additions for BYOK + Runtime Provider Management — Spec

**Status:** implementation-ready spec
**Owner:** TBD (handoff at bottom)
**Target version:** BentoRouter 0.2.0
**Last updated:** 2026-05-16
**Companion spec:** [`bentorouter-migration-spec.md`](./bentorouter-migration-spec.md) in the Slothing repo
**Intended home:** this file should move to the BentoRouter repo at `docs/byok-provider-management-spec.md` once the BentoRouter maintainer agent picks up the work. Lives in Slothing's docs temporarily so it's reviewable alongside the migration spec.

---

## 1. Goal

Add the BentoRouter capabilities required for **runtime, per-user provider configuration** — so apps embedding BentoRouter can let end users **add provider keys via a UI**, **edit per-task policies via that UI**, and **isolate by user identity** for multi-tenant deployments.

Today BentoRouter expects provider keys at boot via env vars. This is fine for apps where the operator owns all keys. For BYOK apps like Slothing (where end users bring their own keys), we need:
- Runtime CRUD for provider configurations
- Persistence for those configs (with optional encryption-at-rest delegated to the embedding app)
- A validation endpoint to test a key before committing
- Admin component extended with a "Providers" section
- A migration helper for apps coming from a `{ provider, apiKey, model }`-style legacy config
- Per-user scoping on every API operation
- Documented theming contract so apps can match their visual identity

This is a foundation that benefits any app embedding BentoRouter, not just Slothing.

---

## 2. Required additions

### 2.1 `ProviderConfigStore` (new)

A persistence layer matching the `PolicyStore` / `UsageStore` pattern.

```ts
// src/providers/providerConfigStore.ts
export interface ProviderConfig {
  id: string;                  // stable user-visible ID, e.g. "openai-personal"
  type: "openai" | "anthropic" | "openrouter" | "openai-compatible";
  displayName: string;         // user-facing label
  encryptedApiKey: string;     // ALWAYS encrypted by the embedding app before storage
  encryptionScheme: string;    // e.g. "aes-256-gcm-v1" — store-side records it for future migration
  baseUrl?: string;            // for "openai-compatible"
  defaultModel?: string;       // optional override
  createdAt: string;           // ISO 8601
  userId: string;              // scoping; "default" for single-user installs
  metadata?: Record<string, unknown>;
}

export interface ProviderConfigStore {
  list(userId: string): Promise<ProviderConfig[]>;
  get(userId: string, id: string): Promise<ProviderConfig | null>;
  upsert(config: ProviderConfig): Promise<ProviderConfig>;
  delete(userId: string, id: string): Promise<void>;
  // Bulk read for ProviderRegistry refresh on policy resolution
  listAll(): Promise<ProviderConfig[]>;
}
```

**Adapters to ship:**
- `MemoryProviderConfigStore` — for tests
- `JsonFileProviderConfigStore` — persists to a single JSON file with file-locking. Format:
  ```json
  {
    "version": 1,
    "configs": [{...}, {...}],
    "writtenAt": "2026-05-16T..."
  }
  ```
- `DatabaseProviderConfigStore` (optional) — uses the same DB connection as `DatabasePolicyStore`

**Adapter that DOES NOT need to ship:** remote/HTTP variant. Apps using the BentoRouter service mode talk to the existing API endpoints.

### 2.2 Runtime provider CRUD via API

`createBentoRouterApi()` gains these operations:

```ts
export type BentoRouterApi = BentoRouterApi & {  // extends existing
  listConfiguredProviders(userId: string): Promise<ProviderConfig[]>;
  getConfiguredProvider(userId: string, id: string): Promise<ProviderConfig | null>;
  addConfiguredProvider(input: AddProviderInput): Promise<ProviderConfig>;
  updateConfiguredProvider(userId: string, id: string, patch: ProviderConfigPatch): Promise<ProviderConfig>;
  removeConfiguredProvider(userId: string, id: string): Promise<void>;
  validateProvider(input: ValidateProviderInput): Promise<ValidateProviderResult>;
}

export interface AddProviderInput {
  type: ProviderConfig["type"];
  displayName: string;
  apiKey: string;              // plaintext from caller; encrypted by store before persistence
  baseUrl?: string;
  defaultModel?: string;
  userId: string;
}

export interface ValidateProviderInput {
  type: ProviderConfig["type"];
  apiKey: string;
  baseUrl?: string;
}

export interface ValidateProviderResult {
  ok: boolean;
  latencyMs?: number;
  modelsAvailable?: string[];   // populated when the provider exposes /models
  error?: { code: string; message: string };
}
```

**Wire these into `createBentoRouterHttpHandler`:**
- `GET /api/bento-router/providers?userId=X`
- `POST /api/bento-router/providers`
- `GET /api/bento-router/providers/:id?userId=X`
- `PUT /api/bento-router/providers/:id`
- `DELETE /api/bento-router/providers/:id?userId=X`
- `POST /api/bento-router/providers/validate`  (does NOT persist; just validates)

Validation endpoint behavior per provider type:
- `openai`: `GET https://api.openai.com/v1/models` with Bearer
- `anthropic`: `GET https://api.anthropic.com/v1/models` with `x-api-key`
- `openrouter`: `GET https://openrouter.ai/api/v1/models` with Bearer
- `openai-compatible`: `GET ${baseUrl}/models` with Bearer; tolerate 404 (some local servers don't expose `/models`) — fall back to a minimal completion call with `max_tokens: 1`.

### 2.3 Encryption hooks on `ProviderConfigStore`

Stores do not encrypt themselves — they delegate to the embedding app:

```ts
export interface EncryptionAdapter {
  encrypt(plaintext: string): Promise<string>;   // returns "{scheme}:{ciphertext}"
  decrypt(stored: string): Promise<string>;      // parses scheme and decrypts
  scheme: string;                                // e.g. "aes-256-gcm-v1"
}

export interface BentoRouterOptions {
  // ...existing...
  providerConfigStore?: ProviderConfigStore;
  encryption?: EncryptionAdapter;
}
```

If `encryption` is provided but `providerConfigStore` is not, throw on construction (no point encrypting if there's nothing to persist).

If `providerConfigStore` is provided but `encryption` is not, **emit a strong warning** at startup and store plaintext. Document this as fine for local dev but not production.

### 2.4 `migrateLegacyLLMConfig()` helper

A pure function to translate `{ provider, apiKey, model }`-shaped legacy app configs into BentoRouter's provider+policy shape.

```ts
// src/migrations/legacyLLMConfig.ts
export interface LegacyLLMConfig {
  provider: "openai" | "anthropic" | "ollama" | "openrouter";
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export interface MigrationOutput {
  provider: AddProviderInput;          // single provider to register
  taskPolicies: Record<string, {       // patches to apply, keyed by task ID
    primaryModel: string;
  }>;
}

export function migrateLegacyLLMConfig(
  legacy: LegacyLLMConfig,
  options: { userId: string; taskIds: string[]; displayName?: string }
): MigrationOutput;
```

Translation table:
- `provider: "openai"` → `type: "openai"`, model string becomes `openai/${legacy.model}`
- `provider: "anthropic"` → `type: "anthropic"`, model string becomes `anthropic/${legacy.model}`
- `provider: "openrouter"` → `type: "openrouter"`, model string already includes vendor prefix
- `provider: "ollama"` → `type: "openai-compatible"`, `baseUrl: legacy.baseUrl ?? "http://localhost:11434"`, model `local/${legacy.model}` (with documented caveats)

Every task in `taskIds` gets `primaryModel` set to the resolved model string. Fallbacks left untouched (apps can add them later).

### 2.5 Extended admin component — Providers section

Two options. Pick **option A** (extension) for less ceremony.

**Option A — extend `BentoRouterAdminPage`:**

Add new props:

```ts
export type BentoRouterAdminPageProps = {
  // ...existing tasks props...
  providers?: ProviderConfigSummary[];
  onAddProvider?: (input: AddProviderInput) => Promise<void>;
  onRemoveProvider?: (userId: string, id: string) => Promise<void>;
  onValidateProvider?: (input: ValidateProviderInput) => Promise<ValidateProviderResult>;
};

export type ProviderConfigSummary = Pick<
  ProviderConfig,
  "id" | "type" | "displayName" | "createdAt" | "baseUrl"
>;
```

When `providers` is provided, render a "Providers" section above the tasks list. When omitted, hide the section entirely (backwards compat with existing consumers).

**Option B — new sibling `BentoRouterProviderManager`:**

A standalone component that hosts a get only the providers UI. Cleaner separation but apps must compose both. Defer.

### 2.6 Theming contract documentation

Document — in `docs/admin-ui-theming.md` (new) — the exact contract:

1. **Root selector:** `.bento-router-admin` (existing).
2. **CSS custom properties read by the component:**
   - `--bento-router-bg` (background of root, defaults to `transparent`)
   - `--bento-router-fg` (text color, defaults to `inherit`)
   - `--bento-router-muted` (secondary text)
   - `--bento-router-border` (borders)
   - `--bento-router-accent` (interactive accent)
   - `--bento-router-font-sans`, `--bento-router-font-mono`
   - `--bento-router-radius` (border-radius for cards/inputs)
3. **Class hooks for advanced overrides:** `.bento-router-admin__list`, `.bento-router-admin__task`, `.bento-router-admin__providers`, etc. Document the BEM-style naming convention so apps know what's stable.
4. **Style prop on root** — last-resort override.

Refactor `BentoRouterAdminPage`'s internal stylesheet to actually use these variables (today the README example mentions them but the component doesn't necessarily honor them — fix that).

---

## 3. Optional additions (defer; tracked here for future)

### 3.1 Direct providers for Gemini / Groq / Mistral / DeepSeek

Currently apps reach these only via OpenRouter. Direct providers unlock:
- Gemini's generous free tier
- Groq's sub-second inference latency (great for `slothing.chunk_atomize`)
- Mistral's EU residency story
- DeepSeek's 10× lower cost at similar quality

Each is a ~50-100 line provider file matching the `OpenAIProvider` pattern. **Defer to v0.3.0** unless they're trivial. Slothing migration works fine without them.

### 3.2 Automatic fallback population on provider add

Per the Slothing migration spec's §8.2 open question: when a user adds a new provider, automatically add its equivalent default model to every task's fallback list (deduplicated). Implementation: on `addConfiguredProvider`, the API loops over current task policies and appends the provider's `defaultModel` (or a sensible default per provider type) if not already present.

Worth implementing in this version. ~50 lines.

### 3.3 Per-user usage rollup

The existing `UsageStore` already records `userId`. Add an API operation:

```ts
usageSummaryByUser(userId: string, range?: { from: string; to: string }): Promise<UsageSummary>;
```

So apps can show "Your spend last 30 days" without complex queries. Worth shipping.

---

## 4. Implementation phases

### Phase 1 — `ProviderConfigStore` + encryption hooks (Day 1)
1. Interface + memory adapter + JSON-file adapter.
2. `EncryptionAdapter` interface; document the no-encryption fallback warning.
3. Tests for round-trip persistence, encryption integration.

### Phase 2 — Runtime CRUD API (Day 1)
1. Extend `createBentoRouterApi` with `listConfiguredProviders`, `addConfiguredProvider`, etc.
2. Extend `createBentoRouterHttpHandler` with the new routes.
3. On `addConfiguredProvider`, refresh `ProviderRegistry` so the new key is immediately usable.
4. Tests: full CRUD via HTTP handler.

### Phase 3 — Validation endpoint (Day 0.5)
1. `validateProvider` implementation per provider type.
2. Timeout (5s default), error envelope shaped to match the OpenAI-style error format used elsewhere.
3. Tests with mock fetch.

### Phase 4 — `migrateLegacyLLMConfig` helper (Day 0.5)
1. Pure function implementation.
2. Tests for every legacy provider type, including edge cases (missing apiKey → return only policy patches, no provider).
3. Export from package main.

### Phase 5 — Admin component extension (Day 1.5)
1. Add the optional Providers props.
2. Build the section UI (list, add form, remove confirmation, test/validate button).
3. Implement the theming contract — refactor existing styles to use CSS custom properties consistently.
4. Storybook entries or example app screenshots in the README.

### Phase 6 — Optional 3.2 (fallback auto-population) (Day 0.5)
If included: implement on `addConfiguredProvider`.

### Phase 7 — Tests + docs + 0.2.0 release (Day 1)
1. Comprehensive integration tests covering all new surfaces.
2. New `docs/byok-provider-management.md` user guide.
3. Existing `docs/architecture.md` updated to reflect the new surfaces.
4. `docs/admin-ui-theming.md` (new) per §2.6.
5. `CHANGELOG.md` entry for 0.2.0.
6. Tag a release. SHA-pinnable.

**Total estimated effort: 5-7 days.** Slothing's migration is unblocked once 0.2.0 ships.

---

## 5. Testing strategy

### Unit
- `ProviderConfigStore` round-trip (memory + JSON file)
- Encryption adapter round-trip with a deterministic test key
- Migration helper for every legacy provider permutation
- Validation endpoint for each provider type (mocked HTTP)

### Integration
- Full CRUD via HTTP handler
- Add provider → router.run picks it up without restart
- Validation against real provider mocks (per provider type)
- Multi-user isolation (User A's configs invisible to User B)

### Manual smoke
- Run BentoRouter as a service with `JsonFileProviderConfigStore`
- Curl: add a provider, validate, list, delete
- Embed admin component in a fresh React app, exercise the Providers section

---

## 6. Open questions

1. **Encryption scheme registry** — if v0.2 ships with `aes-256-gcm-v1` and v0.3 introduces `aes-256-gcm-v2`, how do stored entries upgrade? Recommendation: on read, detect scheme mismatch, decrypt with old, re-encrypt with new, persist. Write-through migration.
2. **Validation rate limiting** — should `/providers/validate` rate-limit per IP? Probably yes, but BentoRouter doesn't have a built-in rate limiter today. Default to per-process in-memory token bucket; document.
3. **`defaultModel` semantics** — if a `ProviderConfig.defaultModel` is set, does it override task policies? Recommendation: no — task policies always win. `defaultModel` is informational, used only when the provider is added and the fallback auto-population (§3.2) needs a starting point.
4. **Should `JsonFileProviderConfigStore` support hot-reload?** Tempting (operator edits the file → BentoRouter picks it up). But file-watching is finicky. Defer; require a process restart for now.
5. **`ProviderConfig.id` collision policy** — when a user adds two OpenAI providers, do we auto-suffix (`openai-personal`, `openai-personal-2`) or 409? Recommendation: 409 with a clear error, force the user to pick a unique displayName.

---

## 7. Non-goals

- Multi-region or distributed `ProviderConfigStore`. Single-process JSON or single-DB only.
- OAuth flows for provider keys (Anthropic OAuth, OpenAI OAuth via Codex, etc.). Apps that need this build it themselves and pass a fully-authenticated key into `addConfiguredProvider`.
- A "credentials vault" SaaS. BentoRouter persists encrypted keys; how the encryption key is managed is the embedding app's problem.
- Removing the env-var-based provider initialization. Apps that don't need runtime CRUD continue to work as before.

---

## 8. Handoff prompt (paste this to the next agent)

> You are implementing BentoRouter v0.2.0 — runtime provider management for BYOK apps — per the spec at `/home/anonabento/slothing/docs/bentorouter-additions-spec.md` (which should be moved to BentoRouter's `docs/byok-provider-management-spec.md` as your first commit).
>
> **Repo:** `ANonABento/bento-router` on GitHub. Clone it locally: `gh repo clone ANonABento/bento-router /home/anonabento/bento-router`. The current state is v0.1.0 with all P0/P1/P2 features per `TODO.md`.
>
> **Project conventions:** This is a personal project but treat it with care. Standard TypeScript, Vitest, ESLint. **Do NOT include `Co-Authored-By: Claude` in any commit message, PR description, or git trailer** — this is a hard rule that applies to all of the owner's projects (their global Claude Code config explicitly forbids it).
>
> **Scope:** Implement Phases 1-7 in §4. Phase 6 (fallback auto-population) is optional but recommended — if you skip it, document why in the PR. Optional §3.1 (direct Gemini/Groq/Mistral/DeepSeek providers) is explicitly deferred to v0.3.0 — do not include them in this PR.
>
> **Backwards compat is mandatory.** v0.1.0 consumers (TomodachiAI? others?) must continue to work with v0.2.0 without code changes. All new APIs are additive. Env-var-based provider init still works exactly as it does today. The admin component's existing prop shape is preserved; new props are optional.
>
> **Encryption hook contract.** The store NEVER encrypts itself. Embedding apps pass an `EncryptionAdapter`. If a store is configured without an adapter, log a strong warning at construction time but allow plaintext storage (useful for local dev). Document this in the new `docs/byok-provider-management.md`.
>
> **Theming contract.** The README's CSS example today mentions `--foreground`, `--background`, etc. but the actual component doesn't necessarily honor them. Phase 5 is partly about FIXING that — refactor `BentoRouterAdminPage`'s styles to read from a documented set of `--bento-router-*` custom properties. Apps embedding the component must be able to fully restyle it via CSS variables alone (no class overrides required for basic theming).
>
> **Migration helper.** `migrateLegacyLLMConfig` is pure and should be importable from the package main. The Slothing migration depends on this exact symbol.
>
> **Validation endpoint.** The validation HTTP call must time out gracefully (5s default). Return `{ ok: false, error: { code, message } }` for any failure mode — don't throw. Slothing's /settings UI will surface these messages directly.
>
> **Per-user scoping.** Every CRUD operation requires a `userId` argument. The JSON-file store keys rows by userId. Multi-user is foundational, not optional — single-user apps just pass `"default"`.
>
> **Resolve every §6 open question in PR description and update §6 with the decisions.**
>
> **Final deliverables:**
> 1. PR(s) implementing all phases. Tag `v0.2.0` after merge.
> 2. Move this spec into the BentoRouter repo at `docs/byok-provider-management-spec.md` as the first commit.
> 3. New `docs/byok-provider-management.md` (user guide).
> 4. New `docs/admin-ui-theming.md` (theming contract).
> 5. Updated `README.md` quick-start section to mention BYOK runtime provider config.
> 6. Updated `TODO.md` — mark P0/P1/P2 items from this spec as complete; open new section for v0.3.0 direct providers.
> 7. Updated `CHANGELOG.md` with the 0.2.0 entry.
>
> **Sign-off criterion:** Slothing's migration spec (`bentorouter-migration-spec.md` in the Slothing repo) becomes implementable. The Slothing agent will validate by attempting Phase 0 of their spec — if any required BentoRouter symbol is missing, surface it for follow-up.
>
> **When stuck:** the original requester owns both repos. Surface ambiguities in PR descriptions rather than guessing.
