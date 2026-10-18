# Research: insights, bring-your-own agent, MCP (2026-10-18)

Three features Kevin raised together: **Insights** (what's working in your search), **using your own
agent or model** (Claude Code, Codex, OpenCode, local models) and **an MCP server / API** so agents can
use Slothing. They connect: an agent connected over MCP can use its own model to do Slothing's AI work,
and can keep statuses current, which is the data Insights depends on. Sources at the end.

## 1. Insights

### What the data can and can't say

The question a job seeker has is "what's working?" The honest answer at 10–50 applications is mostly
"not enough data yet", and a dashboard that shows 33% vs 0% for groups of 3 makes things worse.
Huntr's research makes the same point about its 1.9M applications: raw differences aren't proof that a
change will help ([Huntr Q2 2026][huntr-q2]).

What's known from large samples, as rough reference points:

- Cold online applications get a response roughly 2–3% of the time (career-blog consensus, weakly
  sourced) ([HiringThing][hiringthing], [uppl][uppl]).
- Tailored resumes: 5.7% interview rate vs 3.1% untailored, across ~100k vs ~1.9M applications.
  Observational and self-reported (users mark their own interviews) ([Huntr Q2 2026][huntr-q2]).
- Volume: 11–20 applications interviewed at 9.3% per application, 100+ at 2.6%. Applying 8+ times to one
  company: 1.9% ([Huntr Q1 2026][huntr-q1]).
- Resume layout, colors, templates and section order: no reliable effect ([Huntr format study][huntr-format]).
- Referrals: interviews from a referral are 35% more likely to end in an offer (Glassdoor via
  [CNBC][cnbc]). Blog claims of 10–20× aren't sourced.

### What Slothing already records, and the gap

| Have | Where |
|---|---|
| Every posting you opened (Seen), when, how often | `jobs.last_seen_at`, visits |
| Saved, applied (with date, exact resume/letter versions, answers, the form's site) | `jobs.status`, `applications` |
| How each resume was made (AI or not, model, latitude, edited) | `documents.meta`, versions |
| Fit at the time you look | `fitOf()` (computed) |
| Follow-ups | `jobs.follow_up_at` |

**Missing, and needed before any insight is possible:**

1. **Status history.** Only the current status is stored, so "how long until a reply", "what share of
   applications got any response" and the funnel can't be computed for the past. Add a `job_events`
   table (job, from, to, at) written by `updateJob`. Tiny, and it should ship **now** so data accumulates
   while you apply.
2. **How you applied:** referral or cold (the biggest known factor). A toggle on the job.
3. **Outcomes.** Replies and rejections arrive by email, and statuses are only as good as what you mark
   by hand. The follow-up card's "Heard back" helps. The better fix is an agent: one with access to
   your mail (Claude with a Gmail connector, for example) updates statuses through Slothing's MCP
   server (section 3). Slothing never reads your email itself, which keeps Gmail "not planned".

### How to show it properly

- **Counts first, rates second.** "3 replies from 14 applications", then "21%".
- **Intervals, not bare percentages.** A Wilson interval for each rate ("21%, likely 8–48%") is the
  standard choice for small samples. The usual ± formula collapses to a single point at 0 or 100%
  ([interval comparison][wilson]). Below 5 applications, show only the count.
- **No breakdown under a minimum group size** (say 5 per group). Show "not enough applications yet"
  instead of a comparison.
- **Benchmarks labelled as rough** ("cold applications usually get 2–3% replies"), never as a target.
- **Correlation, not advice.** "Jobs you applied to with a Strong fit got replies 3 of 6 times; Weak,
  0 of 7" is fine. "Only apply to Strong fits" isn't.

### What to show, in order

1. **Funnel:** seen → saved → applied → any reply → interview → offer, with counts and drop-off.
2. **This week:** applications sent, follow-ups due, replies, quiet ones (applied 3+ weeks, no reply).
3. **Response and interview rate** (with intervals), **median days to first reply**.
4. **Breakdowns, once groups are big enough:** fit band, tailored with AI / without / edited, with or
   without a letter, referral or cold, the site you applied on (Greenhouse, Lever…), role type.
5. **Optional AI summary:** a short weekly read of the numbers above. The numbers are computed; the
   model only phrases them and is checked like a letter (no number it wasn't given).

No AI needed for 1–4. The closest existing product is Jobera's analytics (funnel, rates, response by
resume version and source) ([Jobera][jobera]). Teal and Huntr show trackers and boards more than analysis.

### Where it goes

A page replacing the "Insights" placeholder, plus one line on Jobs ("3 replies from 14 · 2 follow-ups
due"). The roadmap's gate was "enough applications for the numbers to mean something"; the interval and
minimum-group rules are what make it safe to build before then.

## 2. Bring your own agent or model

Two directions, and the second is the better one.

### A. Slothing calls your agent as its model

| Option | How | Status |
|---|---|---|
| Any OpenAI-compatible server (Ollama, LM Studio, vLLM, OpenRouter) | Settings → endpoint | **Done** (local needs no key) |
| Claude Code | `claude -p --output-format json --json-schema <schema>`: the answer comes back in `structured_output` ([headless docs][cc-headless]) | Possible |
| Codex | `codex exec --output-schema <file> -o <out>`: final JSON written to a file, progress on stderr; schemas need `additionalProperties: false` ([Codex non-interactive][codex-exec]) | Possible |
| OpenCode | `opencode serve` gives a local HTTP API (OpenAPI 3.1 at `/doc`, port 4096), or `opencode run` ([OpenCode server][opencode]) | Possible |

These would be a new provider type in `llm.ts`: spawn the CLI with the prompt and schema, read the
JSON, then the same retry and validation as now.

**Caution, Claude subscriptions:** Anthropic's terms say Free/Pro/Max subscription credentials are for
Claude Code and Claude.ai only; other products, including Agent SDK apps, should use API keys
([reports][anthropic-oauth], [AlternativeTo][anthropic-oauth-2]). Shelling out to your own installed
Claude Code on your own machine may be fine for you personally, but Slothing shouldn't ship it as
"use your Claude subscription" without checking the current terms. Direction B avoids the question.

### B. Your agent calls Slothing (MCP), using its own model

You already work in Claude Code, Codex, Cursor or Claude Desktop. Connect Slothing as an MCP server and
the agent does the AI part with its own model: it reads the job and your profile, drafts the resume or
letter, and saves it. Slothing runs the same grounding, fitting and rendering on what it saves, so the
rules don't change. "One tailoring system" holds because a saved draft goes through `fitResume` and
`groundResume` like any other.

This makes the in-app AI optional for agent users. It's also how others do it: Workopia's MCP server
runs its resume and letter features on the connected client's model ([Workopia][workopia]).

## 3. MCP server (and API)

### Design

- **One endpoint, inside the app:** `/api/mcp` (Streamable HTTP), next to `/api/extension`. Vercel's
  `mcp-handler` mounts an MCP server as a Next.js route; its 2.x line needs the MCP TypeScript SDK v2,
  zod 4 and Node 20+, and supports the current stateless protocol ([mcp-handler][mcp-handler],
  [changelog][mcp-changelog]). Slothing already has zod 4 and Node 24, so 2.x fits.
- **Connect:** `claude mcp add --transport http slothing http://localhost:3000/api/mcp --header
  "Authorization: Bearer <key>"`, and the same URL in Codex, Cursor and others. For clients that only
  speak stdio, a few-line `npx` shim that forwards to the local URL.
- **Auth:** a bearer key from a "Connections" section (the Extension page grown a little), separate from
  the extension's key so each can be revoked. No CORS headers, as with the extension API.
- **One operations layer:** `src/lib/extension.ts` already has `status`, `saveJob`, `tailor`, `letter`,
  `fill`, `applied`, `saveAnswers`. Rename it to a shared ops module both the extension route and the
  MCP route call. Don't build a second API.

### Tools

| Tool | Does | Notes |
|---|---|---|
| `get_profile` | Your profile | Read only |
| `list_jobs` / `get_job` | Jobs with status, fit, documents, warnings, applications | Read only |
| `add_job` | From a link or a pasted description | Same importer |
| `set_status` | applied / interviewing / offer / rejected… | Writes the status history; how an agent reading your mail keeps Insights true |
| `tailor_resume` / `write_letter` | Slothing's own AI (if configured) | Existing paths |
| `get_tailoring_context` | Profile + job + rules + key terms, for the agent to draft with its own model | New |
| `save_resume_draft` / `save_letter_draft` | Agent-written draft → grounded, fitted, saved; returns the warnings | New; no path skips grounding |
| `get_pdf` | The resume or letter PDF (or its local URL) | |
| `find_answer` / `save_answer` | Answer bank | |
| `get_insights` | The numbers from section 1 | After Insights |

Mark read-only tools as such. Expose no delete. Never submit an application: that stays the
extension's rule, with you clicking Submit.

Examples of the same idea: resume-tailor MCP servers that avoid inventing experience
([glama][resume-tailor]) and a local job tracker over stdio with SQLite ([jobfinder-mcp][jobfinder]).
None combine grounding, tailoring, PDFs and form filling.

## Recommendation and order

1. **Status history + referral toggle** (small, now): Insights has nothing to work with without them,
   and every week without them is data lost.
2. **MCP server**: read tools, `add_job`, `set_status`, `get_tailoring_context` + `save_*_draft`, `get_pdf`.
   Makes Slothing usable from the agents you already use, lets those agents bring their own model, and
   gives Insights accurate statuses.
3. **Insights v1** (no AI): funnel, this week, rates with counts and intervals; breakdowns only past the
   minimum group size. Build when there are ~10 real applications to look at.
4. **CLI providers** (Claude Code / Codex / OpenCode as Slothing's model): only if MCP doesn't cover it
   and the Claude terms question is settled.

Agent apply (on the roadmap's Later list) builds on 2: the same tools plus the extension's fill, with
submit still yours.

## Sources

[huntr-q2]: https://huntr.co/research/job-search-trends-q2-2026
[huntr-q1]: https://api.huntr.co/research/job-search-trends-q1-2026
[huntr-format]: https://api.huntr.co/research/best-resume-format
[hiringthing]: https://blog.hiringthing.com/job-application-statistics
[uppl]: https://www.uppl.ai/job-application-response-rate
[cnbc]: https://www.cnbc.com/2026/01/12/cold-applying-is-still-the-no-1-way-to-get-a-new-job-but-this-method-is-quickly-getting-more-common.html
[jobera]: https://jobera.com/tools/job-analytics/
[wilson]: https://metricgate.com/blogs/wilson-vs-agresti-coull-vs-clopper-pearson/
[cc-headless]: https://code.claude.com/docs/en/headless.md
[codex-exec]: https://developers.openai.com/codex/noninteractive
[opencode]: https://opencode.ai/docs/server/
[anthropic-oauth]: https://winbuzzer.com/2026/02/19/anthropic-bans-claude-subscription-oauth-in-third-party-apps-xcxwbn/
[anthropic-oauth-2]: https://alternativeto.net/news/2026/2/anthropic-officially-bans-using-subscription-authentication-for-third-party-claude-use
[mcp-handler]: https://github.com/vercel/mcp-handler
[mcp-changelog]: https://vercel.com/changelog/latest-mcp-spec-now-supported-in-mcp-handler
[workopia]: https://www.getdrio.com/mcp/io-github-workopia-workopia-mcp
[resume-tailor]: https://glama.ai/mcp/servers/ybwy4h7c6u
[jobfinder]: https://glama.ai/mcp/servers/c6a2gd0d8t

- Huntr, job search trends Q2 2026 and Q1 2026; best resume format study (links above)
- HiringThing, job application statistics; uppl, response rate guide; CNBC on referrals (Glassdoor data)
- Jobera job search analytics
- MetricGate, Wilson vs Agresti-Coull vs Clopper-Pearson
- Claude Code headless docs; OpenAI Codex non-interactive docs; OpenCode server docs
- Reports on Anthropic's subscription-credential terms (Winbuzzer, AlternativeTo): secondary, check the
  current Claude Code legal and compliance docs
- Vercel mcp-handler repo and changelog
- MCP directories: Workopia MCP, resume-tailor MCP servers, jobfinder-mcp (unverified listings)
