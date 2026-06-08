# Overnight Agent → Review Queue — Implementation Spec

> Status: **planning** (branch `feat/agent-overnight-apply`). Goal-tracked, loop-driven build.
> Companion to `docs/mcp-package-spec.md` (the `@slothing/mcp` adapter) and the grounded-bank
> authoring work (PR #304). This spec owns the *agent-driven apply* feature end to end.

## North star

Hand an external agent (your own stack — Choomfie / Hermes / OpenClaw — or Claude Agent SDK)
a Slothing token, let it run overnight, and wake up to **useful, reviewable work**: at minimum a
ranked review queue; ideally a queue of **drafted applications** whose answers are grounded in your
profile and just need a glance; for power users, applications **submitted within rules you set**.

How far the agent goes is a **single user-settable autonomy level**, defaulting to the safest rung
that still does useful work — the same mental model as Claude Code's plan/auto modes.

## The autonomy ladder

A single `agent_autonomy` setting (in `/settings`) gates the agent. The agent **reads its own
policy** via MCP and self-governs — it must not exceed the configured level.

| Level | Agent does | User wakes to | Backend added |
| --- | --- | --- | --- |
| **L0 Off** | nothing | — | — |
| **L1 Source** *(default)* | scrape + rank jobs, push to review queue | ranked review queue | none (ships today) |
| **L2 Draft** | + detect screening Qs, pre-draft grounded answers | `pending_review` drafts | DraftApplication model |
| **L3 Submit w/ approval** | + submit, but only morning-approved drafts | submitted log | execution worker |
| **L4 Auto-submit** | + submit unattended within rules | submitted log (review after) | rules/guardrails |

Default ship state: **L1 enabled; L3/L4 off** until the user explicitly opts in
("never auto-submit" is the default).

## Architecture — brain / hands split

The headless MCP agent is the **brain**; it never drives a real careers page. It produces a
`DraftApplication`. A separate **executor with real browser context** — the existing browser
**extension** autofill (L3), or a server-side Playwright worker (L4/hosted) — consumes *approved*
drafts and submits. This isolates the fragile per-ATS automation and reuses what the extension
already does.

```
 your agent (MCP client)                         Slothing
 ──────────────────────                          ────────────
 get_agent_policy        ──▶  reads autonomy level + rules
 slothing_scrape_url / slothing_push_job ──▶  review queue           (L1)
 draft_application       ──▶  DraftApplication: pending_review        (L2)
                                     │
 (user approves in UI) ──────────────┤
                                     ▼
  executor (extension autofill / Playwright worker) ──▶ submit → status=submitted  (L3/L4)
```

MCP transport is **stdio today**; add **SSE/HTTP** so non-colocated agent stacks can connect.

## Integration boundary: MCP for all agents

Primary target is **any agent stack via MCP** (user runs their own). Slothing-hosted execution is a
**later, premium** tier — do not build it before the MCP surface is complete. No new auth model:
everything rides the existing extension token (`X-Extension-Token`, minted at `POST /api/extension/auth`).

## New backend objects

### `agent_settings` (P1)

Per-user agent policy the agent reads and obeys.

```
agent_settings
  user_id            TEXT NOT NULL DEFAULT 'default'  (unique)
  autonomy           TEXT  -- off | source | draft | submit_approval | auto_submit
  match_threshold    REAL  -- 0..1, skip below
  salary_floor       INTEGER NULL
  company_blocklist  JSON  -- string[]
  daily_submit_cap   INTEGER
  dry_run            INTEGER -- boolean
  schedule_cron      TEXT NULL  -- informational; agent/host owns scheduling
  updated_at         TEXT
```

Additive migration via the `PRAGMA table_info` + `ALTER TABLE ADD COLUMN` pattern in `schema.ts`.
Indexed `idx_agent_settings_user_id`. Exposed read-only to the agent via the `get_agent_policy`
MCP tool; edited by the user at `/settings`.

### `application_drafts` (P2)

The missing object: agent-proposed answers awaiting review. Reuses PR #304 grounding/provenance.

```
application_drafts
  id            TEXT PRIMARY KEY
  user_id       TEXT NOT NULL DEFAULT 'default'
  job_id        TEXT NOT NULL             -- FK-ish to jobs.id
  questions     JSON  -- [{ id, label, type, required }]
  answers       JSON  -- [{ questionId, value, groundedIn, confidence, source }]
  status        TEXT  -- pending_review | approved | rejected | submitted | failed
  authored_by   TEXT  -- 'agent:<id>'
  created_at    TEXT
  reviewed_at   TEXT NULL
  submitted_at  TEXT NULL
  submit_result JSON NULL  -- { ok, atsRef?, error? }
```

Indexed `idx_application_drafts_user_id`, `idx_application_drafts_user_status`. One open draft per
(user, job) — dedupe on insert.

## MCP tools to add

| Tool | Phase | Backing | Notes |
| --- | --- | --- | --- |
| `get_agent_policy` | P1 | `GET /api/extension/agent-policy` | Agent reads autonomy + rules; self-governs |
| `draft_application` | P2 | `POST /api/extension/drafts` | Create/update a draft with grounded answers |
| `list_drafts` | P2 | `GET /api/extension/drafts?status=` | List drafts for review/exec |

(Existing shipped tools: `get_profile`, `list_opportunities`, `get_opportunity_detail`,
`search_answer_bank`, `save_answer`, `slothing_push_job`, `slothing_update_status`,
`slothing_scrape_url`.)

## Phasing

| Phase | Scope | Verification (must pass before complete) |
| --- | --- | --- |
| **P0** | Fix stale `mcp-package-spec.md` (write tools ARE shipped); example overnight cron-agent script under `packages/mcp/examples/`; `slothing-mcp refresh` token helper | `pnpm --filter @slothing/mcp test:run` + `type-check`; example script type-checks; repo `lint` |
| **P1** | `agent_settings` table + additive migration; `/settings` autonomy UI (editorial primitives, no forbidden colors); `GET /api/extension/agent-policy` + `get_agent_policy` MCP tool; rank-on-push for `slothing_push_job` | type-check + test:run + lint; new unit tests for migration, route auth, ranking, MCP tool |
| **P2** | `application_drafts` table + migration; `/api/extension/drafts` (GET/POST, token auth) + `/api/applications/drafts/*` (session, for UI); `draft_application` + `list_drafts` MCP tools; **review UI** reusing #304 provenance (confidence + source + approve/edit inline) | type-check + test:run + lint; route + tool tests; `/verify` the review UI renders + approve/edit works |
| **P3** | Greenhouse + Lever submit adapters via extension; consume `approved` drafts → in-page fill + submit → `status=submitted` + `submit_result`; per-application approval gate | extension e2e (`.github/workflows/extension-e2e.yml`) green; adapter unit tests; manual `/verify` on a sandbox form |
| **P4** | Rules engine (threshold/salary/blocklist/cap/dry-run) + unattended runner honoring `agent_settings`; optional server-side Playwright worker | rules unit tests; dry-run produces no submits; type-check + test:run + lint |
| **P5** *(premium)* | Slothing-hosted cron runner reusing `/api/cron/*` + encrypted `llm_settings` BYOK; revoke/audit UI for service tokens | cron route tests; token revoke flow test; type-check + test:run + lint |
| **T** *(parallel)* | MCP SSE/HTTP transport (stdio stays default) | `@slothing/mcp` tests cover both transports |

P0–P2 deliver ~80% of felt value ("wake to drafted applications I just check"). P3+ is the
submission frontier.

## Cross-cutting requirements (apply to every phase)

- **CI gates** (`pnpm run type-check`, `pnpm run test:run`, `pnpm run lint`) pass before any task is
  marked complete and before any commit. Never `--no-verify`.
- **Forbidden-color lint**: no `bg-white`/hex/etc. Use editorial/semantic tokens only.
- **Auth**: every new user-owned table gets `user_id TEXT NOT NULL DEFAULT 'default'` + index; scope
  all queries by `user_id`. Token routes use `requireUserAuth`.
- **Schema**: additive `ALTER TABLE ADD COLUMN` migrations only — never drop/recreate.
- **Destructive actions**: any new destructive UI (reject draft, revoke token) follows
  `docs/destructive-actions-pattern.md` (confirm dialog or undo snackbar) + adds the doc-table row.
- **Anti-fabrication**: drafted answers MUST be grounded (`groundedIn` populated) — reuse #304 rules;
  an answer with no grounding is flagged, never silently asserted.
- **No AI-attribution trailers** in commits or PR descriptions (user's global rule).

## Risks / open questions

1. **Service-token lifetime** — 30-day extension TTL is wrong for an always-on agent. Add a
   longer-lived service token *with* a revoke UI (it can submit on the user's behalf). Tracked in P5
   prerequisites; P0 ships a `refresh` helper as a stopgap.
2. **Submission liability** — wrong/fabricated answers carry real reputational cost. Mitigated by the
   grounding requirement + L3 approval-gate default.
3. **ATS fragility** — adapters break on site changes. Greenhouse/Lever are v1; everything else is
   marked `needs_human`.
4. **Rate limits** — agent loops on `search_answer_bank` may hit `src/lib/rate-limit.ts`; confirm
   thresholds suit agentic flows.

## Done definition (feature)

A user sets autonomy to `draft`, points their agent at the MCP server with a token, and the agent —
overnight — sources + ranks jobs into the review queue, drafts grounded answers for each, and leaves
them in `pending_review`. In the morning the user opens the review UI, sees each answer with its
confidence + source, approves/edits, and (at L3) the extension submits the approved ones. All CI
gates green throughout.
