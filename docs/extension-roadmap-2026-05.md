# Columbus Extension — May 2026 roadmap

> Authored 2026-05-12. Drift-check reference for tasks #27–#41.
> This is a **plan**, not an implementation. Files and ranges are pointers for follow-up tickets.
> If you are an agent picking up one of these tasks, read **Drift-check rules** first.

## TL;DR

The auth bug + popup redesign landed in `ad47bf8`. Next four phases:

| Phase | Theme | Tasks | Effort | Ship together |
|---|---|---|---|---|
| P1 | Quick UX wins | #27 self-heal, #28 human errors, #29 options save status, #30 fast popup, #31 deep-link | ~1 day | Yes — one PR |
| P2 | Compounding value | #32 two-pass fill, #33 corrections loop, #34 multi-resume, #35 inline answer bank | ~3–4 days | Each its own PR |
| P3 | Bulk + multi-step | #36 Workday steps, #37 Greenhouse steps, #38 passive LinkedIn, #39 bulk orchestrators | ~1 week | Per site |
| P4 | Strategic | #40 inline AI sidebar, #41 MCP server | 1–2 weeks each | Independent |

## Drift-check rules

Agents picking up any task here MUST honor these before opening a PR:

1. **Scope is what the task description says — no more.** If you discover an adjacent improvement, file a new task; don't roll it in.
2. **No new dependencies without flagging.** If you reach for a new npm package, stop and ask. Prefer the existing toolchain.
3. **Tests are required for any new code path.** Vitest unit tests live colocated. Aim for: at least one happy-path test, at least one failure-path test per new function.
4. **No raw color literals in source.** Use the violet/cream tokens defined in `apps/extension/src/popup/styles.css` (popup + options share the same palette). The web app's hard-fail color lint applies to `apps/web/src/**`; the extension doesn't have that lint yet but follow the convention.
5. **The popup is the focal surface.** Anything that grows the popup must justify its column inches.
6. **Auth-touching code must be tested in both transports** — chrome.runtime (Chrome path) and localStorage (Firefox path). The harness at `apps/extension/demo/_harness.mjs` already supports both.
7. **No commits with Co-Authored-By or "Generated with Claude Code" tags.** (User preference.)
8. **Don't push to main from an agent.** Open a PR, let the user merge.
9. **The `data/get-me-job.db` filename is intentional** — repo is rebranded but the DB filename + `taida:` localStorage prefix stay for backwards compatibility.

## Shared groundwork (use across phases)

These already exist — reach for them, don't reinvent:

- **Messaging:** `apps/extension/src/shared/messages.ts` — typed `Messages.*` factories + `sendMessage<T>()` wrapper. Add new types here, add the matching switch arm in `apps/extension/src/background/index.ts`.
- **Storage:** `apps/extension/src/background/storage.ts` — `getStorage`, `setStorage`, `setAuthToken`, `getSettings`. **Never** call `chrome.storage.local` directly; always through these helpers (default-merge semantics matter).
- **API client:** `apps/extension/src/background/api-client.ts` — `getAPIClient()` returns a singleton. Add new methods to the class, not new clients.
- **Page detection:** `apps/extension/src/content/index.ts` runs at `document_idle` on every match. Scrapers register through the existing dispatch — see `apps/extension/src/content/scrapers/` for the pattern.
- **Test harness:** `apps/extension/demo/_harness.mjs` — `MODE=launch|connect|screenshot|teardown`. Chromium on CDP `:9333`. Profile at `/tmp/slothing-harness-profile`.
- **Theme tokens:** `apps/web/src/lib/theme/presets/default.ts` is the source of truth. Extension mirrors them as plain CSS vars in `popup/styles.css` and `options/styles.css`.

---

## Phase 1 — Quick UX wins (one PR)

These five are small enough to ship together. Each is <100 LOC of touch.

### #27 Self-heal SW state on activation

**Problem.** When `chrome.runtime.reload()` runs (e.g., after extension update), storage gets half-cleared. The popup just flips to "Connect Account" — the user has no idea they were silently logged out.

**What we build.** Track `lastSeenAuthAt: string` in storage on every successful `setAuthToken` AND every successful `isAuthenticated()` call. On popup open, if `authToken` is missing but `lastSeenAuthAt` is within the last 24h, show a distinct "Session lost — reconnect" view instead of the unauthenticated hero. CTA goes directly to `/extension/connect`.

**Files.**
- `apps/extension/src/shared/types.ts` — add `lastSeenAuthAt?: string` to `ExtensionStorage`.
- `apps/extension/src/background/storage.ts` — write `lastSeenAuthAt = nowIso()` inside `setAuthToken`.
- `apps/extension/src/background/api-client.ts` — write the same on `isAuthenticated() === true` path.
- `apps/extension/src/popup/App.tsx` — new `ViewState = "session-lost"` branch.

**Acceptance.**
- After clearing only `authToken` (simulate reload corruption) AND `lastSeenAuthAt` within 24h → popup shows "Session lost — reconnect" with single CTA.
- After deleting both keys (true logout) → popup shows normal unauthenticated hero.
- After 24h+ since `lastSeenAuthAt` → popup shows normal unauthenticated hero (not "session-lost"; we don't want stale prompts).

**Out of scope.** Don't add a refresh-token flow; we don't have one. Don't attempt silent re-auth.

**Tests.** Three unit tests in `apps/extension/src/background/storage.test.ts` covering the three time windows.

---

### #28 Map raw API errors to human messages

**Problem.** `setActionError(response.error)` shows raw `"Request failed: 503"` or `"Authentication expired"` to the user. The connect page already has `messageForStatus()` doing this well — duplicate logic lives there.

**What we build.** Extract `messageForStatus(status: number): string` into `apps/extension/src/shared/error-messages.ts`. Import it from both the connect page and the popup. Apply to popup's `actionError` + `wwBulkError` + sidebar error toasts.

**Files.**
- New: `apps/extension/src/shared/error-messages.ts` — exports `messageForStatus`, `messageForError(err: unknown)`.
- `apps/web/src/app/[locale]/(app)/extension/connect/page.tsx` — import from new shared location (or keep its own copy — these are different package boundaries; OK to leave that one alone, just match the strings).
- `apps/extension/src/popup/App.tsx` — wrap `setActionError` and `setWwBulkError` calls.

**Acceptance.**
- 429 response → "We're rate-limited. Try again in a minute."
- 5xx → "Slothing servers are having a problem."
- 401 → "Sign in expired. Reconnect the extension."
- Anything else / network error → "Something went wrong. Please try again."

**Out of scope.** Don't add internationalization here; English strings only. The web app uses next-intl but the extension does not.

**Tests.** Unit tests on `messageForStatus` covering each branch.

---

### #29 Save-status indicator on options page

**Problem.** Options page's API URL save click gives no feedback. Other settings (checkboxes, range slider) save silently.

**What we build.** Tiny save-status state machine: `"idle" → "saving" → "saved" → "idle"` with 2s "saved" duration. Show as inline text next to "Save" button. Auto-save checkboxes/range on change with a 500ms debounce.

**Files.**
- `apps/extension/src/options/App.tsx` — wire state, debounce.
- `apps/extension/src/options/styles.css` — `.save-status` styles (use existing tokens).

**Acceptance.**
- Type in API URL → click Save → "Saving…" → "Saved ✓" → fade.
- Toggle a checkbox → 500ms later → "Saved ✓".
- Drag range slider → final value saved 500ms after release, not during drag.

**Out of scope.** No optimistic UI rollback on error — just show "Save failed" string.

**Tests.** Unit test for the debounce timing (use vi.useFakeTimers).

---

### #30 Cache auth verdict for fast popup open

**Problem.** Popup waits 500–800ms on every open for GET_AUTH_STATUS → server verify roundtrip. Feels sluggish.

**What we build.** In background, when `isAuthenticated()` returns `true`, cache `{authenticated: true, at: nowIso()}` in `chrome.storage.session` (NOT `local` — session storage clears on browser restart, which is desirable). On `GET_AUTH_STATUS`, return the cache if <60s old, then revalidate in the background. Popup gets a fast response and self-corrects if the verdict flips.

**Files.**
- `apps/extension/src/background/index.ts` — `handleGetAuthStatus` reads + writes session cache.
- `apps/extension/src/background/storage.ts` — new `getSessionAuthCache` / `setSessionAuthCache` helpers.

**Acceptance.**
- Open popup twice within 60s — second open shows authenticated UI in <50ms.
- After 60s — popup waits for verify (still works correctly).
- On 401 from any subsequent API call → cache cleared.

**Out of scope.** Don't cache the verdict in `chrome.storage.local`; we don't want it surviving a browser restart.

**Tests.** Unit tests for cache TTL behavior.

---

### #31 Deep-link to /opportunities/[id] after import

**Problem.** Import success closes popup with no way to view the imported opportunity.

**What we build.** The `IMPORT_JOB` response already includes `opportunityIds: string[]`. After success, popup shows "Imported ✓" + an inline "View in tracker →" button that opens `${apiBaseUrl}/opportunities/{id}` and closes the popup. Same for bulk-scrape results — show "View first" + "View tracker" buttons.

**Files.**
- `apps/extension/src/popup/App.tsx` — augment `actionSuccess` state to hold `{action, opportunityId?}`. Render the link.

**Acceptance.**
- Single import → success row with "View in tracker" button.
- Bulk scrape with ≥1 import → "View tracker" button (opens `/opportunities/review`).
- Bulk scrape with 0 imports → just shows the error count.

**Out of scope.** Don't add inline status-change controls in the popup. View-in-tracker is enough.

**Tests.** Component test (jsdom) verifying the link href.

---

## Phase 2 — Compounding value

### #32 Two-pass confidence-driven autofill

**Problem.** Today: any field ≥ `settings.minimumConfidence` (default 0.5) gets filled. The 0.5–0.7 band fills wrong often enough to make people distrust autofill.

**What we build.** Three confidence zones with distinct UX:
- **≥0.85 silent zone:** fill, no visual marker.
- **0.6–0.85 yellow zone:** fill, but apply a 1px yellow outline + tiny "?" tooltip "Press Enter to accept · Esc to clear".
- **<0.6 cold zone:** don't fill, but add a small "?" badge near the field with tooltip "Slothing has 3 candidates — click to pick" → opens a small popover with the candidates.

`settings.minimumConfidence` becomes the cold-zone floor (existing semantics preserved).

**Files.**
- Find the current fill site: `grep -rn "TRIGGER_FILL" apps/extension/src/` — likely `apps/extension/src/content/index.ts` + a fill helper.
- New file: `apps/extension/src/content/ui/confidence-band.ts` — exports the zone classification + DOM marker helpers.
- `apps/extension/src/content/ui/styles.css` — add `.columbus-zone-yellow` outline + popover styles.

**Acceptance.**
- A field with confidence 0.9 fills with no marker.
- A field with confidence 0.7 fills with a yellow outline AND clears the outline on user interaction (typing, focus-out after edit).
- A field with confidence 0.4 stays empty but shows a "?" badge.

**Out of scope.** Don't change the scoring algorithm itself. This is presentation only.

**Tests.** Pure unit tests on the `classifyConfidence(score) → "silent" | "yellow" | "cold"` function. DOM behavior gets a manual test pass.

---

### #33 Corrections feedback loop into field_mappings

**Problem.** Right now corrections die — user fixes an autofilled field, we never learn from it.

**What we build.** Content script tracks each autofilled field's `(element, originalSuggestion, fieldType, fieldSignature)` for 30s after fill. On `blur` after edit (final value different from original), POST `/api/extension/field-mappings/correct` with `{domain, fieldSignature, originalSuggestion, userValue, fieldType, confidence: original}`. Server upserts into `field_mappings` table, boosting the per-domain mapping for that signature.

**Schema impact.** `field_mappings` table already exists per CLAUDE.md. Verify schema or add: `domain TEXT, field_signature TEXT, field_type TEXT, observed_value TEXT, hit_count INTEGER DEFAULT 1, last_seen_at TEXT, PRIMARY KEY(user_id, domain, field_signature)`.

**Files.**
- `apps/extension/src/content/` — new `corrections-tracker.ts`.
- `apps/extension/src/shared/messages.ts` — add `SAVE_CORRECTION` message type.
- `apps/extension/src/background/api-client.ts` — `saveCorrection(payload)` method.
- `apps/web/src/app/api/extension/field-mappings/correct/route.ts` — POST handler.
- `apps/web/src/lib/db/schema.ts` — verify `field_mappings` columns; add migration if needed.

**Acceptance.**
- Autofill writes "kevin@gmail.com" into an email field.
- User clears it and types "kevin@hamming.ai", then tabs out.
- A `/api/extension/field-mappings/correct` request fires within 5s.
- DB row inserted/incremented for `(domain, fieldSignature)`.
- Next time the same form is opened on the same domain, autofill prefers the corrected value (with confidence boost).

**Out of scope.** Don't try to detect cross-user patterns or share mappings between users — single-user scope only.

**Tests.** Server-side route test (mock DB). Content-side: unit test the `wasCorrection(original, current)` heuristic.

---

### #34 Multi-resume picker for "Tailor resume" action

**Problem.** Tailor button always pulls from the master profile. Users with 3 specialty resumes can't pick.

**What we build.** When user clicks "Tailor resume" on a job page:
1. Popup fetches `GET /api/extension/resumes` — returns top 5 most-recently-updated tailored resumes `{id, name, targetRole, updatedAt}`.
2. Popup shows a small picker dropdown above the action buttons: "Base on: [master profile ▼ / Backend Senior / Frontend Senior / ...]".
3. User picks, clicks Tailor → request includes `baseResumeId`.
4. Tailor flow re-tailors against the JD using the selected base instead of pure profile.

**Files.**
- New API route: `apps/web/src/app/api/extension/resumes/route.ts` — GET, gated by extension token.
- `apps/extension/src/shared/messages.ts` — add `LIST_RESUMES` message.
- `apps/extension/src/background/api-client.ts` — `listResumes()` method.
- `apps/extension/src/popup/App.tsx` — picker state + dropdown UI.
- `apps/web/src/lib/llm/` or wherever tailor lives — accept `baseResumeId` and use that document as the seed.

**Acceptance.**
- User has 2 saved resumes. Popup shows picker with "Master profile" + 2 named resumes.
- Selecting "Backend Senior" → tailor uses that resume's content as the base.
- Result links into Studio with `?baseResumeId=…` query.

**Out of scope.** Don't add resume management to the popup (rename, delete). Picker is read-only.

**Tests.** Route test for /api/extension/resumes. Component test for the picker.

---

### #35 Inline answer-bank search on long textareas

**Problem.** Long application essays ("Tell us about a time you…") are the worst part of applying. We have an answer bank but no surface inline.

**What we build.** Content script scans textareas where:
- `maxlength` > 300 OR no maxlength, AND
- Associated label matches `/tell us about|describe a|why are you interested|why this company|what motivates|biggest challenge/i`.

For each match, inject a floating "💡" button (16×16) into the textarea's top-right corner (position: absolute relative to the textarea wrapper). On click → small popover (240×200) listing top 3 matches from `/api/extension/answer-bank/match?q=<label>` plus a "Generate new" button. Click a result → insert into textarea. "Generate new" → call existing answer-gen route, insert.

**Files.**
- New: `apps/extension/src/content/ui/answer-bank-button.tsx` (TSX in content needs JSX setup — check existing sidebar for pattern).
- `apps/extension/src/content/index.ts` — wire the textarea scanner.
- Reuse `/api/answer-bank/match` (already exists per docs/extension-api.md).
- `apps/extension/src/content/ui/styles.css` — popover styles using shared tokens.

**Acceptance.**
- A textarea labeled "Why are you interested in this role?" gets a 💡 button.
- Click → popover with 3 candidate answers and confidence.
- Click a candidate → textarea fills with that answer, popover closes.
- Pressing Esc closes the popover without inserting.
- The 💡 button never overlaps form controls (z-index correct, doesn't block tabbing).

**Out of scope.** Don't auto-suggest while typing (no inline IME-style autocomplete). Click-only.

**Tests.** Unit test the label-matching regex + textarea filter. Manual test the popover positioning (different sites have different overflow rules).

---

## Phase 3 — Bulk + multi-step

### #36 Multi-step form support — Workday

**Why Workday first.** Most stable step structure. URL hash + section markers are predictable (e.g., `applyManually` flow with `[data-automation-id]` selectors).

**What we build.** New `apps/extension/src/content/multistep/workday.ts` that:
1. Detects Workday applicant flow (URL: `*.myworkdayjobs.com/*/job/*/apply` or post-click `applyManually` route).
2. Captures user-confirmed fill choices when they click an explicit "Fill this form" button (NOT on every page load — explicit intent only).
3. Persists `{tabId, jobUrl, profile snapshot, baseResumeId, confirmedAt}` in `chrome.storage.session` keyed by `tabId`.
4. Subscribes to `chrome.webNavigation.onHistoryStateUpdated` for the same tab.
5. On each step transition, re-runs the field detector against the new DOM and fills using the persisted choices.
6. Stops on submit click, tab close, or 30 minutes of inactivity.

**Files.**
- New file as above.
- `apps/extension/src/content/index.ts` — register the Workday handler when on a Workday domain.
- `apps/extension/src/background/index.ts` — listen for `webNavigation` events, broadcast step transitions to the tab's content script.
- `apps/extension/manifest.json` + `manifest.firefox.json` — verify `webNavigation` permission (currently only `storage`, `activeTab`, `scripting`). **NEW PERMISSION.** Flag this to the user.

**Acceptance.**
- On a Workday applicant flow, clicking "Auto-fill this application" fills page 1.
- Clicking "Next" navigates to page 2, autofill runs again with the same profile snapshot.
- Submit click clears the session state.
- Closing the tab clears the session state.

**Out of scope.** Don't tackle Greenhouse here — that's #37. Don't submit the form automatically.

**Tests.** Vitest with jsdom + a Workday fixture HTML. Manual end-to-end on a real Workday posting.

**Open question.** Adding `webNavigation` permission triggers an "Access your browsing activity" warning at install. This is a real trade-off — discuss with user before merging.

---

### #37 Multi-step form support — Greenhouse

Same pattern as #36 but for `boards.greenhouse.io` and the iframe-embedded `app.greenhouse.io/jobs/*/applications/new` flows. Different selectors, different navigation model (some are iframes, not URL changes).

**Out of scope.** Don't touch Workday here.

---

### #38 Passive LinkedIn capture (no auto-nav)

**Problem.** LinkedIn TOS prohibits auto-navigation; their anti-bot is active. But scraping pages the user is *already* viewing is fine.

**What we build.** The existing LinkedIn scraper already runs on detail pages. Extend it to:
1. Maintain `chrome.storage.session.linkedInSeen: string[]` — list of job-ids seen this session.
2. On every detail page view, if `jobId` is not in `seen`, append scraped job to a server-side queue via existing `/api/extension/jobs` endpoint (or new lightweight enqueue endpoint that doesn't dedupe immediately).
3. Show a non-blocking toast on the first capture per session: "Saved for later — 1 LinkedIn job captured this session."
4. Daily cap (50 captures per 24h) to prevent storage / API spam.
5. NO automation of clicks, NO list-page bulk, NO modal opening.

**Files.**
- `apps/extension/src/content/scrapers/linkedin-scraper.ts` — extend.
- Lightweight enqueue endpoint OR reuse `/api/opportunities/from-extension` (already exists per CLAUDE.md).

**Acceptance.**
- Browsing 5 LinkedIn job pages → 5 opportunities show up in `/opportunities/review`.
- Visiting the same job twice → counted once.
- Hitting 50/day → no further enqueues, no error toast (silent rate limit).
- No clicks generated by the extension on LinkedIn pages.

**Out of scope.** No pagination, no list-page scraping, no auto-modal opening. If you find yourself writing `.click()` against a LinkedIn element, stop.

**Tests.** Unit test the `linkedInSeen` deduplication. Test that no DOM mutation occurs on LinkedIn pages.

---

### #39 Bulk-scrape orchestrators for Greenhouse + Lever + Workday board pages

**Why these are OK.** `boards.greenhouse.io`, `jobs.lever.co`, and `*.myworkdayjobs.com` listing pages are job-board hosts paid for by the company to syndicate openings. Public, indexed, no anti-scrape posture.

**What we build.** Three orchestrators following the `apps/extension/src/content/scrapers/waterloo-works-orchestrator.ts` pattern:

- `apps/extension/src/content/scrapers/greenhouse-orchestrator.ts`
- `apps/extension/src/content/scrapers/lever-orchestrator.ts`
- `apps/extension/src/content/scrapers/workday-orchestrator.ts`

Each exposes `scrapeAllVisible()` + `scrapeAllPaginated()`. Cap at 200 per session. Popup surfaces "Detected: Greenhouse" / "Detected: Lever" / "Detected: Workday" sections identical to the WW one.

**Files.**
- Three new orchestrators.
- `apps/extension/src/popup/App.tsx` — add three more `wwState`-like sections (refactor to a generic `BulkSourceCard` component to avoid copy-paste).
- `apps/extension/src/shared/messages.ts` — add `BULK_*` message types per site.

**Acceptance.**
- Greenhouse company page → "Detected: Greenhouse — 23 rows" with Scrape visible / Scrape filtered set.
- Same for Lever, Workday.
- Each respects the 200/session cap.
- Each surfaces errors per-row without aborting the batch.

**Out of scope.** Don't extend to LinkedIn or Indeed. Don't try to navigate to other companies' pages.

**Tests.** Three orchestrator test files following `waterloo-works-orchestrator.test.ts`. Use jsdom + hand-crafted fixtures.

---

## Phase 4 — Strategic

### #40 Inline AI assistant in the in-page sidebar

**Vision.** The biggest moat. When the user is on a job page, the existing sidebar (`apps/extension/src/content/sidebar/job-page-sidebar.tsx`) gains a chat input. Two seed actions:
- **"Why am I qualified?"** — streams a 4-sentence pitch based on profile × JD.
- **"Draft a cover-letter opener"** — streams the first paragraph, button to "Use in cover letter" pipes into Studio.

**Files.**
- `apps/extension/src/content/sidebar/job-page-sidebar.tsx` — chat input + result panel.
- New API: `apps/web/src/app/api/extension/chat/route.ts` — accepts `{prompt, jobContext}`, streams via existing LLM client.
- `apps/extension/src/background/api-client.ts` — `chat(prompt, ctx)` SSE-style consumer.

**Acceptance.**
- Sidebar shows chat input + 2 seed prompt buttons.
- Click "Why am I qualified?" → streaming text appears in <2s, completes in <10s.
- "Use in cover letter" opens `/studio?mode=cover_letter&jobId=…&seed=...`.
- Rate-limit hits show the human error (#28).

**Out of scope.** Don't add conversational history (no multi-turn) in v1. One-shot per prompt.

**Risks.** LLM cost. Restrict to 5 calls/day/user via the existing rate-limit middleware.

---

### #41 @slothing/mcp server

**Spec already exists.** `docs/mcp-package-spec.md`. Implement.

**Files.**
- New workspace: `packages/mcp/` with its own `package.json`, `tsconfig.json`.
- Tools: `get_profile`, `list_opportunities`, `get_opportunity_detail`, `search_answer_bank`, `save_answer`.
- Auth: extension token via env var `SLOTHING_TOKEN`. Server hits `${SLOTHING_API_URL}/api/extension/*` exactly like the extension does.
- README: how to wire into Claude Desktop / Cursor.

**Acceptance.**
- `pnpm dlx @slothing/mcp` starts the server.
- All 5 tools callable from a connected MCP client.
- Bad token → clear error.

**Out of scope.** Don't ship to npm as part of this task — that's a follow-up after manual review.

**Tests.** Integration test using `@modelcontextprotocol/sdk` test client.

---

## Dependency graph

```
P1 (#27..31) — parallel, ship as one PR
   ↓
P2 #32 (two-pass) ─→ #33 (corrections) ─→ feeds back into #32 over time
P2 #34 (multi-resume) — independent
P2 #35 (answer bank inline) — independent

P3 #36 (Workday steps) — requires webNavigation permission decision
P3 #37 (Greenhouse steps) — after #36 lands
P3 #38 (LinkedIn passive) — independent
P3 #39 (bulk orchestrators) — independent, shares popup refactor with #31

P4 #40 (AI sidebar) — depends on rate-limit verification
P4 #41 (MCP) — fully independent
```

## Open questions for the user

1. **#36 Workday — `webNavigation` permission ok?** Triggers an extra install warning. Worth it?
2. **#38 LinkedIn passive — daily cap of 50 OK, or tunable?**
3. **#40 AI sidebar — LLM cost cap of 5 calls/day/user OK?**
4. **PR vs direct push?** P1 is small enough to push if you trust the agents; everything else should be a PR for review.

## Verification protocol per task

Every agent finishing a task should leave behind:

1. **Diff scope** — only the files listed in "Files." section.
2. **Tests pass** — `pnpm --filter @slothing/extension test:run` + `pnpm --filter @slothing/web test:run` both green.
3. **Type-check clean** — both workspaces.
4. **Manual screenshot** for any UI change (popup / options / sidebar). Save to `/tmp/slothing-screenshots/<task>-<state>.png`.
5. **Self-review note** in PR description: what was in scope, what was deliberately deferred, what they noticed but didn't fix.
