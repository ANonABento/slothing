# Research: insights, your own agent, MCP (2026-10-18)

Kevin asked for three things: **Insights**, **using your own agent or model** (Claude Code, Codex,
OpenCode, local models) and **an MCP server / API**. Second pass: every claim checked and every part not
needed for a first version cut ("less is more"). What was cut, and why, is at the end.

## 1. Insights

### The one thing to do now

Slothing stores a job's **current** status only. Whether a rejected job got an interview first, and
when anything moved, is lost. Every rate Insights could show needs that history, so record it now:

- A `job_events` table (job, from, to, at), written in `createJob` (the first status) and `updateJob`
  (every change; the app, the extension and follow-ups all go through it).
- Nothing to see yet. It only has to start collecting while you apply.

### Insights v1 (once there are ~10 real applications)

Counts, no percentages under 10, no AI, no comparisons:

- **Funnel:** applied → any reply → interview → offer, as counts ("14 applied · 3 replied · 1 interview").
  A reply is any status after Applied, including Rejected.
- **This week:** sent, replies, follow-ups due, quiet ones (applied 3+ weeks ago, no reply).

One line on Jobs, or the Insights page replacing its placeholder. Nothing else until the friction log
asks for it.

Why so little: with 10–50 applications, splitting by fit, template or AI makes groups of 2–5, where
"33% vs 0%" is noise. Large studies find the format of a resume makes no reliable difference
([Huntr format study][huntr-format]), and Huntr warns that even its 1.9M-application comparisons aren't
proof ([Huntr Q2 2026][huntr-q2]). A count is honest at any size.

## 2. Your own agent or model

- **Local models and any OpenAI-compatible server** (Ollama, LM Studio, OpenRouter): **done**.
- **Claude Code / Codex / OpenCode as Slothing's model** (spawning `claude -p`, `codex exec` or
  `opencode serve`): technically possible ([Claude Code headless][cc-headless],
  [Codex non-interactive][codex-exec], [OpenCode server][opencode]). **Not recommended:** a CLI
  provider per tool to maintain, and Claude subscription credentials are reported to be for Claude Code
  and Claude.ai only ([report][anthropic-oauth]; secondary, not checked against Anthropic's own page).
- **The agent uses Slothing instead (MCP, below):** the agent already runs on your subscription in
  its own app, writes the draft with its own model, and Slothing checks and saves it. No terms question,
  no new provider code. This is how "use my own agent" should work.

## 3. MCP server

### Checked

- `@modelcontextprotocol/server` 2.3.1 (the official TypeScript SDK) has `createMcpHandler(factory)`,
  which takes a web `Request` and returns a `Response`, so it mounts directly as a Next.js route. It also
  exports localhost host and origin checks (against DNS rebinding). Depends only on zod 4 (Slothing has
  4.6) and its core package. **Vercel's `mcp-handler` isn't needed.**
- Clients connect to a local HTTP URL, e.g. `claude mcp add --transport http slothing
  http://localhost:3000/api/mcp --header "Authorization: Bearer <key>"`.

### Design

- **`/api/mcp`**, beside `/api/extension`, using the **same key** (shown on the Extension page) and the
  same operations in `src/lib/extension.ts`. No second API, no second key.
- **Tools** (each reuses an existing function):

| Tool | Reuses |
|---|---|
| `get_profile` | `db.getProfile` |
| `list_jobs`, `get_job` (with fit, documents, warnings, applications, PDF links) | `db.listJobs`, `summary` |
| `add_job` (link or pasted description) | `saveJob` / URL import |
| `set_status` | `updateJob` (and so the status history) |
| `tailor_resume`, `write_letter` (Slothing's own AI) | `tailorJob`, `writeLetter` |
| `save_resume`, `save_letter` (a draft the agent wrote) | `tailorJob` with the agent's draft in place of the model's, so it is fitted and grounded like any draft; `letterWarnings` for letters |

- No delete, no submit, no answer bank or insights tools until they're asked for.

`save_resume` is what makes "use your own agent" work: the agent drafts, Slothing applies the rules.
It keeps "one tailoring system": the draft goes through `fitResume` and `groundResume` like every other.

## Order

1. Status history (small; starts the data).
2. MCP server, the tools above.
3. Insights v1, when there are ~10 real applications.

## Cut from the first pass, and why

| Cut | Why |
|---|---|
| Referral toggle | Notes cover it until it's asked for |
| Confidence intervals, percentages for small groups | Counts are honest and simpler |
| Breakdowns (fit, AI, letter, site…) | Groups too small to mean anything for months |
| Benchmarks in the UI ("cold applies get 2–3%") | Weakly sourced (career blogs); a target that isn't yours |
| AI weekly summary | Restates numbers you can read |
| CLI providers (Claude Code / Codex / OpenCode) | MCP covers it without per-tool code or a terms question |
| Vercel `mcp-handler` | The official SDK has the same handler |
| A separate MCP key, a stdio shim, PDF/answer/insights tools | One key; HTTP clients cover Claude Code, Codex, Cursor; add tools when used |

[huntr-q2]: https://huntr.co/research/job-search-trends-q2-2026
[huntr-format]: https://api.huntr.co/research/best-resume-format
[cc-headless]: https://code.claude.com/docs/en/headless.md
[codex-exec]: https://developers.openai.com/codex/noninteractive
[opencode]: https://opencode.ai/docs/server/
[anthropic-oauth]: https://winbuzzer.com/2026/02/19/anthropic-bans-claude-subscription-oauth-in-third-party-apps-xcxwbn/
