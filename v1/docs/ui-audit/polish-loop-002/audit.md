# polish-loop-002 — Audit

First post-fix capture pass. Verifying polish-loop-001 fixes landed cleanly and
sweeping for follow-up affordance polish.

## Capture summary

- 25 routes captured at 1280px after polish-loop-001 fixes shipped.
- 0 non-OK responses.
- Console issues are dev-env 500s (missing LLM/NextAuth env vars). Out of
  scope.

## Polish-loop-001 fix verification

| Loop-001 ID | Status | Note |
| ----------- | ------ | ---- |
| S-H1 (JD line-clamp) | `[FIXED]` (verified by inspection) | Opportunities list is empty in the seeded dev DB, so the visual proof has to wait until populated data shows up. Code path matches `JobCard` kanban clamp. |
| S-H2 (toast surface) | `[FIXED]` | Toasts now opaque `bg-card`; tests assert new classes; no instances of bleed-through in re-captured routes. |
| S-H3 (save pill nowrap) | `[FIXED]` | Studio header `studio-1280.png` shows the pill on a single line. |
| S-M1 (Studio H1 nowrap) | `[FIXED]` | Same screenshot — "Document Studio" intact. |
| S-M2 (PageIconTile size) | `[FIXED]` | Dashboard, Opportunities, Documents, Profile, Settings, Salary, Email Templates all show the smaller 36px tile; visually quieter against the H1s. |

No regressions surfaced.

## New findings

### G-L2 [Low] — Disabled gradient CTA washes to opacity-50 only
- **Where:** `salary/page.tsx:391` ("Calculate Range") + `ats/scanner-form.tsx:770`
  ("Scan Resume"). Both use `variant="gradient"` (or `gradient-bg`) with the
  Button primitive's default `disabled:opacity-50`.
- **What:** The rust gradient stays fully visible in disabled state — just at
  50% opacity. Reads as "softer rust", not unambiguously "disabled". Consistent
  across the app, low priority.
- **Fix vector:** Defer. A future affordance pass could swap the disabled-state
  background to `bg-muted` for these two CTAs while keeping the gradient on the
  enabled state. Not bundling here because the convention is repository-wide.

### G-L3 [Low] — `/vs` hub icon detached from H1
- **Where:** `apps/web/src/app/[locale]/(marketing)/vs/...` (marketing hub).
- **What:** Shield icon sits on a row above the "Compare Slothing" H1 with no
  visual connection — different pattern from the app workspace headers and
  different from the landing reference. Marketing surface, not the primary
  reference (landing at `/en`), so worth a note but not a stop-the-loop fix.
- **Fix vector:** Defer to a marketing polish bundle if the user wants one.

### S-L1 [Low] — Studio "Rewrite section" alignment (re-check from loop-001)
- **Where:** `ai-assistant-panel.tsx:798-836`.
- **What:** Re-checked source. Both the SelectTrigger and Button (`size="icon"`)
  resolve to `h-11`. Heights match. The visual discrepancy I noted in
  loop-001's audit was a screenshot artefact, not real. **Closed as
  non-issue.**

## Routes scanned — clean

`/dashboard`, `/profile`, `/upload`, `/documents`, `/bank`, `/answer-bank`,
`/studio`, `/opportunities`, `/opportunities/review`, `/applications`,
`/interview`, `/analytics`, `/salary`, `/calendar`, `/emails`, `/settings`,
`/extension-connect`, `/sign-in`, plus marketing surfaces (home, pricing,
ats-scanner, extension-marketing, vs-index, privacy, terms).

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 0     |
| Medium   | 0     |
| Low      | 2 (G-L2, G-L3) — both deferred |

## Convergence counter

`0 H + 0 M` → **1 / 5** consecutive 0-H-0-M loops.

## Tier plan

**Tier A:** none (no H findings).
**Tier B:** none (no M findings).
**Tier C — deferred:**
- G-L2 disabled-gradient CTA — wait for a richer affordance pass.
- G-L3 `/vs` icon layout — marketing surface, not the primary reference.

Dark-mode parity remains deferred — next-themes hydration breaks the capture
script. To do dark properly, the script needs a per-run theme override and
ideally a runtime toggle; that's tooling work I'm not ready to gate this loop
on.
