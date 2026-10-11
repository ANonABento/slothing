# Slothing extension release follow-through — May 2026

> Status: release-readiness follow-up for the May 2026 extension roadmap.
> Scope: permission communication, representative Workday/Greenhouse verification, and MCP v2 write-tool planning.

## Release note: `webNavigation` permission

Slothing now requests the browser `webNavigation` permission.

Why it is needed:

- Workday and Greenhouse application flows often move between steps with client-side route changes instead of full page loads.
- `webNavigation` lets the extension notice those in-progress application step changes after the user has explicitly started autofill.
- When a step changes, Slothing can re-run field detection on the new form page and ask/fill the next step without requiring the user to reopen the popup.

Privacy and behavior boundaries:

- Slothing does not collect browsing history.
- The permission is used only to detect navigation events for tabs with an active multi-step application session.
- Autofill still starts only after explicit user intent.
- Slothing does not auto-submit applications.
- If `webNavigation` is unavailable or declined, Slothing falls back to an in-page prompt: "Looks like step N of M — fill this page too?"

Suggested user-facing release note:

> Slothing asks for a new browser navigation permission so it can follow multi-step Workday and Greenhouse application forms after you start autofill. It does not collect browsing history, and it does not submit applications. If the permission is unavailable, Slothing falls back to asking before filling each new step.

## Representative verification

Live Workday and employer-hosted Greenhouse tenants still need a final manual pass before broad release. The current automated verification uses representative jsdom DOMs and public-board fixtures.

### Commands

Run from the repo root:

```bash
pnpm --filter @slothing/extension exec vitest run \
  src/content/multistep/workday.test.ts \
  src/content/multistep/greenhouse.test.ts \
  src/content/multistep/prompt-fallback.test.ts \
  src/content/multistep/session.test.ts \
  src/content/scrapers/greenhouse-orchestrator.test.ts \
  src/content/scrapers/workday-orchestrator.test.ts \
  src/content/scrapers/lever-orchestrator.test.ts \
  --reporter=verbose
```

Optional full extension gate:

```bash
pnpm --filter @slothing/extension test:run
pnpm --filter @slothing/extension build:chrome
pnpm --filter @slothing/extension build:firefox
```

### Matrix

| Surface | Representative coverage | Live status | Release risk |
| --- | --- | --- | --- |
| Workday apply URL detection | `isWorkdayApplyUrl` covers canonical `/apply` and `applyManually` paths. | Pending live tenant check. | Medium: tenant URL variants may drift. |
| Workday page 1 fill | jsdom fixture with `data-automation-id` form fields verifies first, last, email. | Pending live tenant check. | Medium: Workday DOM labels and wrappers vary. |
| Workday step transition | Simulated step transition persists session and fills phone on page 2. | Pending live tenant check. | Medium: depends on route event timing and mounted fields. |
| Workday progress hint | `progressBarItem` / `progressBarActiveItem` fixture returns step 2 of 4. | Pending live tenant check. | Medium: selectors are best-effort. |
| Greenhouse apply URL detection | `boards.greenhouse.io` and `app.greenhouse.io` application URLs covered. | Pending live tenant check. | Low/medium: hosted forms are stable; employer iframes vary. |
| Greenhouse page 1 fill | jsdom form fixture verifies first, last, email, phone. | Pending live tenant check. | Low/medium. |
| Greenhouse step transition | Simulated step transition fills a recognizable follow-up email field and skips custom text. | Pending live tenant check. | Medium: multi-step forms are not uniform. |
| Prompted fallback | Tests cover Yes, No, timeout, replacement, and generic messages. | Pending browser check on Firefox permission decline. | Low: DOM behavior covered; browser prompt path still manual. |
| Session lifecycle | Tests cover set/get, provider filtering, TTL expiry, clear, and stale sweep. | Pending browser check. | Low. |
| Greenhouse bulk board | Orchestrator fixture tests row extraction, cap, malformed rows, and pagination. | Pending public board check. | Medium: board markup variants. |
| Lever bulk board | Orchestrator fixture tests representative public listing markup. | Pending public board check. | Medium. |
| Workday bulk board | Orchestrator fixture tests representative public listing markup and pagination. | Pending public board check. | Medium/high: Workday board markup varies by tenant. |

### Manual live checklist

Use a disposable or non-submitted application flow. Do not click final submit.

1. **Chrome permission prompt / install wording**
   - Load `apps/extension/dist/`.
   - Confirm Chrome shows `webNavigation` in the requested permissions during install/upgrade.
   - Confirm popup still connects and authenticates.

2. **Workday application flow**
   - Open a public Workday job and enter its apply flow.
   - Click the explicit Slothing autofill action.
   - Confirm page 1 fills expected contact fields.
   - Click Next or Save and continue.
   - Confirm the next step is detected via `webNavigation` and fields are filled only after the user-initiated session exists.
   - Confirm final Submit clears the session but is not clicked by Slothing.

3. **Greenhouse hosted flow**
   - Open a `boards.greenhouse.io/<company>/jobs/<id>` posting.
   - Start Slothing autofill.
   - Confirm contact fields fill.
   - If the employer has additional pages/sections, navigate to the next section and confirm re-fill behavior.

4. **Greenhouse iframe flow**
   - Open an employer-hosted page embedding `app.greenhouse.io`.
   - Confirm Slothing either fills same-origin/friendly iframes or no-ops without errors on cross-origin frames.
   - If `webNavigation` cannot observe the inner flow, confirm the prompted fallback appears.

5. **Bulk board smoke**
   - On one Greenhouse board, one Lever board, and one Workday board, confirm the popup detects row counts.
   - Run visible-row scrape only.
   - Confirm payloads in `/opportunities/review` have title, company, source URL, and no duplicate rows.

## Known release risks

- Workday and Greenhouse multi-step selectors are best-effort and must be validated against real tenants.
- `webNavigation` is visible at install/upgrade and should be called out in release notes.
- Firefox uses optional `webNavigation`; denied permission should fall back to the prompted path.
- Bulk scrapers intentionally cap at 200 rows per session.
- MCP v2 write tools are not shipped in v1; agents can still call REST endpoints directly with the extension token.
