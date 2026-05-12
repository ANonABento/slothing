# `@slothing/mcp` — Agent Integration Spec

> Status: spec / design doc. Not implemented yet. Owners: TBD.

## Why

Slothing today exposes a token-authenticated HTTP surface that the Columbus browser extension uses to push scraped jobs into the review queue. The same surface is sufficient for any external agent (a Claude Agent SDK script, a Choomfie skill, a Hermes overlay) to drive Slothing — but it's plain REST, not a discoverable MCP toolset.

This spec describes a thin MCP server package, `@slothing/mcp`, that wraps the existing extension-side endpoints as MCP tools. The goal is to make Slothing legible to agent runtimes without adding a new auth model or duplicating business logic on the Slothing side.

## Non-goals

- Not a new API. The MCP server is a thin adapter over existing routes — no new database tables, no new auth code paths.
- Not a hosted product. Each user runs the MCP server locally against their own Slothing instance with their own extension token.
- Not a substitute for the browser extension. The extension still owns in-page scraping + autofill. MCP is for agents that already have a job payload or a URL.

## Package layout

```
packages/mcp/
├── package.json              # @slothing/mcp, bin entry "slothing-mcp"
├── tsconfig.json
├── src/
│   ├── index.ts              # stdio server bootstrap
│   ├── server.ts             # MCP Server instance + tool registration
│   ├── tools/
│   │   ├── push-job.ts
│   │   ├── list-queue.ts
│   │   ├── update-status.ts
│   │   └── scrape-url.ts
│   ├── client.ts             # tiny HTTP wrapper around /api/extension/* + /api/opportunities/*
│   ├── config.ts             # env loading + validation
│   └── types.ts              # request/response shapes
└── README.md
```

`packages/mcp/` lives inside the existing pnpm monorepo so it can share the `ScrapedJob` and opportunity types from `packages/shared/`.

## Configuration

Two env vars, set wherever the MCP server is launched (the user's Claude Code config, choomfie's plugin config, etc):

| Var | Required | Default | Description |
| --- | --- | --- | --- |
| `SLOTHING_BASE_URL` | yes | — | e.g. `http://localhost:3000` (local dev) or the user's Slothing deployment |
| `SLOTHING_EXTENSION_TOKEN` | yes | — | a token minted via `POST /api/extension/auth`; same as the Columbus extension uses |

A one-time token-minting helper lives in the package — `slothing-mcp init` mints a token (requires the user to be signed in to Slothing locally) and prints it for the user to paste into their MCP config. Mirrors the Columbus connect-account flow.

## Tool surface

All four tools take a JSON object and return a JSON object. Errors come back as MCP tool errors with HTTP status preserved in the message.

### `slothing_push_job`

Push one scraped/discovered job into the review queue.

```ts
input: {
  title: string;
  company: string;
  url: string;
  description?: string;
  location?: string;
  salary?: string;
  type?: "full-time" | "part-time" | "contract" | "internship";
  remote?: boolean;
  source?: string;        // free-form, defaults to "mcp"
  sourceJobId?: string;
  deadline?: string;
  requirements?: string[];
  responsibilities?: string[];
  keywords?: string[];
}

output: {
  opportunityId: string;
  deduped: boolean;       // true when the URL already existed
  pendingCount: number;   // size of the review queue after this push
}
```

Implementation: POST `/api/opportunities/from-extension` with `X-Extension-Token`. Dedup is automatic on `(user_id, url)`.

### `slothing_list_queue`

Read the user's current opportunities. Status filter optional; defaults to `pending` (review queue).

```ts
input: {
  status?: "pending" | "applied" | "interviewing" | "offer" | "rejected" | "all";
  limit?: number;         // capped server-side
}

output: {
  jobs: Array<{
    id: string; title: string; company: string; url: string;
    status: string; createdAt: string; deadline?: string;
  }>;
  totalPending: number;
}
```

Implementation: GET `/api/opportunities?status=...&limit=...` with the same auth header.

### `slothing_update_status`

Move an opportunity to a new status (or attach notes).

```ts
input: {
  opportunityId: string;
  status?: "pending" | "applied" | "interviewing" | "offer" | "rejected";
  notes?: string;
}

output: { ok: true; updatedAt: string }
```

Implementation: PATCH `/api/opportunities/[id]`.

### `slothing_scrape_url`

Ask Slothing to scrape a URL server-side (no browser needed). Useful for agents that have a job URL but not the rendered HTML.

```ts
input: { url: string; pushToQueue?: boolean }

output: {
  scraped: {
    title: string; company: string; description: string; /* ... */
  };
  opportunityId?: string;  // present iff pushToQueue was true
}
```

Implementation: POST `/api/opportunities/scrape` (existing server-side scraper). When `pushToQueue: true`, chain to `from-extension` in the same call to keep it one tool round-trip.

## Consumer examples

### Choomfie skill

```yaml
# choomfie plugin config
mcp_servers:
  slothing:
    command: pnpm
    args: [exec, slothing-mcp]
    env:
      SLOTHING_BASE_URL: http://localhost:3000
      SLOTHING_EXTENSION_TOKEN: ${SLOTHING_TOKEN}
```

Then a Choomfie skill can invoke `slothing_push_job` when the user asks "queue this job for me to apply to later."

### Claude Code

```jsonc
// .mcp.json
{
  "slothing": {
    "command": "pnpm",
    "args": ["exec", "slothing-mcp"],
    "env": {
      "SLOTHING_BASE_URL": "http://localhost:3000",
      "SLOTHING_EXTENSION_TOKEN": "...mint via /api/extension/auth..."
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

## Open questions

1. **Token lifetime / rotation.** Extension tokens currently have a 30-day TTL via `EXTENSION_TOKEN_TTL_RUNTIME_MS`. For headless MCP usage, do we want a longer "service" token type or just expect the user to re-mint monthly? Suggest reusing the existing TTL for v1 and adding a `slothing-mcp refresh` helper if it gets annoying.
2. **Per-tool rate limiting.** The existing routes go through `src/lib/rate-limit.ts`. For agent loops that push many jobs in succession the per-user limit will bite. Need to confirm thresholds work for agentic flows or expose a higher limit for extension-token requests.
3. **Status transitions.** `slothing_update_status` is a generic patch. Should it enforce the destructive-action confirm-dialog convention (per `docs/destructive-actions-pattern.md`)? Probably exempt — the agent is the user's deputy, not a UI button. Worth a one-line acknowledgement in the response if a status transition was destructive (e.g. `pending → rejected`).
4. **MCP transports.** v1 = stdio. SSE/HTTP transport is straightforward to add but not needed until someone wants to host the server remotely. Out of scope here.
5. **Bundling.** Bun vs Node for the server runtime. Node is the lowest common denominator and matches the rest of the monorepo; Bun would shave startup time. Default to Node for v1.

## Done definition

`pnpm exec slothing-mcp` starts a stdio MCP server. A Claude Code session with the server configured can run the following round-trip with no manual UI clicks:

1. `slothing_scrape_url` against a real Greenhouse/Lever URL → returns scraped payload
2. `slothing_push_job` with that payload → returns opportunityId, pending=N+1
3. `slothing_list_queue` → returns the job we just pushed
4. `slothing_update_status` → moves it to `applied`, returns ok
5. Verify in the Slothing web UI at `/opportunities/[id]`

That's v1. Anything beyond — LLM tailoring tools, cover letter generation, interview scheduling, calendar integration — is v2+.
