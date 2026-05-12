# `@slothing/mcp` — Agent Integration Spec

> Status: **v1 shipped** as of 2026-05-12 (PR #265). v2 (write-heavy push/queue surface) deferred — see "Deferred to v2" below.

## Why

Slothing today exposes a token-authenticated HTTP surface that the Columbus browser extension uses to push scraped jobs into the review queue. The same surface is sufficient for any external agent (a Claude Agent SDK script, a Choomfie skill, a Hermes overlay) to drive Slothing — but it's plain REST, not a discoverable MCP toolset.

`@slothing/mcp` is a thin MCP server package that wraps Slothing's extension-side endpoints as MCP tools. The goal is to make Slothing legible to agent runtimes without adding a new auth model or duplicating business logic on the Slothing side.

## Non-goals

- Not a new API. The MCP server is a thin adapter over existing routes — no new database tables, no new auth code paths.
- Not a hosted product. Each user runs the MCP server locally against their own Slothing instance with their own extension token.
- Not a substitute for the browser extension. The extension still owns in-page scraping + autofill. MCP is for agents that already have the context they need.

## Package layout (as shipped)

```
packages/mcp/
├── package.json              # @slothing/mcp, bin entry "slothing-mcp"
├── tsconfig.json
├── bin/slothing-mcp.mjs      # CLI shim
├── src/
│   ├── index.ts              # stdio server bootstrap
│   ├── server.ts             # MCP Server instance + tool registration
│   ├── api-client.ts         # HTTP wrapper around /api/extension/*
│   ├── config.ts             # env loading + validation
│   ├── types.ts              # shared request/response shapes
│   └── tools/
│       ├── index.ts
│       ├── get-profile.ts
│       ├── list-opportunities.ts
│       ├── get-opportunity-detail.ts
│       ├── search-answer-bank.ts
│       └── save-answer.ts
├── tests/                    # vitest integration tests via InMemoryTransport
└── README.md
```

`packages/mcp/` lives inside the existing pnpm monorepo so it can share types from `packages/shared/`.

## Configuration

Two env vars, set wherever the MCP server is launched:

| Var | Required | Default | Description |
| --- | --- | --- | --- |
| `SLOTHING_API_URL` | yes | — | e.g. `http://localhost:3000` (local dev) or the user's Slothing deployment. Legacy alias: `SLOTHING_BASE_URL`. |
| `SLOTHING_TOKEN`   | yes | — | A token minted via `POST /api/extension/auth`; same as the Columbus extension uses. Legacy alias: `SLOTHING_EXTENSION_TOKEN`. |

Bad token → MCP tool error with the missing-var details. Token-minting helper is deferred to v2; for now, mint via the extension's connect-account flow and copy the token.

## Tool surface (v1, shipped)

The v1 surface is **read-heavy** — designed for agents that need to ask about your data, draft against it, and write back targeted answers. All five tools take a JSON object and return a JSON object. Errors come back as MCP tool errors with HTTP status preserved.

### `get_profile`

Read the authenticated user's profile (contact, experience, education, skills, etc).

```ts
input: {}

output: {
  profile: ExtensionProfile;
}
```

Implementation: `GET /api/extension/profile` with `X-Extension-Token`.

### `list_opportunities`

Read the user's opportunities. Status filter optional; defaults to all statuses.

```ts
input: {
  status?: "pending" | "applied" | "interviewing" | "offer" | "rejected" | "all";
  limit?: number;        // capped server-side
}

output: {
  opportunities: Array<{
    id: string; title: string; company: string; url: string;
    status: string; createdAt: string; deadline?: string;
  }>;
  total: number;
}
```

Implementation: `GET /api/extension/opportunities` (added by PR #265).

### `get_opportunity_detail`

Read a single opportunity's full payload (description, requirements, linked documents).

```ts
input: { id: string }

output: { opportunity: OpportunityDetail }
```

Implementation: `GET /api/extension/opportunities/[id]` (added by PR #265).

### `search_answer_bank`

Semantic search across the user's answer bank for prior answers to similar questions.

```ts
input: { query: string; limit?: number }

output: {
  matches: Array<{
    id: string;
    question: string;
    answer: string;
    similarity: number;
  }>;
}
```

Implementation: `POST /api/extension/answer-bank/match`.

### `save_answer`

Save a new question/answer pair into the answer bank.

```ts
input: { question: string; answer: string; tags?: string[] }

output: { id: string; created: true }
```

Implementation: `POST /api/extension/answer-bank` (write).

## Consumer examples

### Claude Desktop

```jsonc
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "slothing": {
      "command": "pnpm",
      "args": ["exec", "slothing-mcp"],
      "env": {
        "SLOTHING_API_URL": "http://localhost:3000",
        "SLOTHING_TOKEN": "ext_..."
      }
    }
  }
}
```

### Cursor / Claude Code

```jsonc
// .mcp.json (project-local)
{
  "slothing": {
    "command": "pnpm",
    "args": ["exec", "slothing-mcp"],
    "env": {
      "SLOTHING_API_URL": "http://localhost:3000",
      "SLOTHING_TOKEN": "ext_..."
    }
  }
}
```

### Agent SDK script

```ts
import { ClaudeAgentSdkClient } from "@anthropic-ai/claude-agent-sdk";

const client = new ClaudeAgentSdkClient({
  mcpServers: { slothing: { command: "pnpm", args: ["exec", "slothing-mcp"] } },
});
```

## Deferred to v2

The original design doc described a **write-heavy** surface — pushing jobs into Slothing from external agent runtimes (Choomfie skills, scraper bots, Hermes overlays). That surface is deferred:

| Tool | Purpose | Underlying route |
| --- | --- | --- |
| `slothing_push_job` | Enqueue a scraped job into the review queue | `POST /api/opportunities/from-extension` |
| `slothing_list_queue` | Variant of `list_opportunities` filtered to the review queue | — (subsumed by v1's `list_opportunities`) |
| `slothing_update_status` | Move an opportunity through the status pipeline | `PATCH /api/opportunities/[id]` |
| `slothing_scrape_url` | Server-side scrape of an arbitrary URL | `POST /api/opportunities/scrape` |

These exist as REST endpoints today — agents that need them can call them directly via `fetch` with the extension token. Promote to MCP tools when a concrete consumer (Choomfie skill, etc.) needs the discoverability.

## Open questions (carried over, still open)

1. **Token lifetime / rotation.** Extension tokens have a 30-day TTL via `EXTENSION_TOKEN_TTL_RUNTIME_MS`. For headless MCP usage, do we want a longer "service" token type or just expect monthly re-mint? Suggest reusing the existing TTL for v1 and adding a `slothing-mcp refresh` helper if it gets annoying.
2. **Per-tool rate limiting.** Existing routes go through `src/lib/rate-limit.ts`. For agent loops that hit `search_answer_bank` rapidly, the per-user limit may bite — confirm thresholds work for agentic flows.
3. **MCP transports.** v1 = stdio (shipped). SSE/HTTP transport is straightforward to add but not needed until someone wants to host the server remotely.

## Done definition (v1, ✅)

`pnpm exec slothing-mcp` starts a stdio MCP server. A Claude Desktop / Claude Code session with the server configured can:

1. Call `get_profile` → returns the user's profile.
2. Call `list_opportunities` with `status: "pending"` → returns the review queue.
3. Call `get_opportunity_detail` against a returned id → returns full payload.
4. Call `search_answer_bank` with a question → returns similar prior answers.
5. Call `save_answer` to record a new Q/A pair → confirms write.
6. Bad token → clear MCP error mentioning `SLOTHING_TOKEN`.

All six paths covered by integration tests in `packages/mcp/tests/` using `InMemoryTransport` + stubbed `fetch`.
