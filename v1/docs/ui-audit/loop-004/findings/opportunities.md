# `opportunities` — `/en/opportunities`

**Source:** `apps/web/src/app/[locale]/(app)/opportunities/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/opportunities-1280.png`
- 1440: `../screenshots/opportunities-1440.png`
- 1920: `../screenshots/opportunities-1920.png`

## Status vs loop-001

- **[H1 — STILL]** Per-row status `Select` still collides with the right-hand meta column on 1280. Even with toast dedupe shipped (loop-003 B2), at 1280 the two surviving toast stacks still obscure the right column of the second card; underlying `xl:w-80 xl:grid-cols-1` density bug is unchanged. `apps/web/src/app/[locale]/(app)/opportunities/page.tsx:1144-1191`. Width: 1280.
- **[H2 — FIXED]** Toast pile-up resolved. Loop-001 showed 4 stacked toasts; loop-004 shows 2 at 1280/1440/1920 (one each for `/api/opportunities` and `/api/settings`). `dedupeKey` in `hooks/use-error-toast.ts:55` is doing its job.
- **[M1 — STILL]** Status badge is still `<Badge variant="outline" className="capitalize">{opportunity.status}</Badge>` in list view (`page.tsx:1103`). Kanban still routes only `closed` sub-statuses through `CLOSED_SUB_STATUS_BADGE_VARIANTS` (`_components/kanban-board.tsx:407-413`). No shared `<StatusPill />` exists yet — confirmed by `find … -name "status-pill*"` returning nothing. **This is the primary loop-004 target.**
- **[M2 — STILL]** Two parallel tab UIs unchanged (`SegmentedToggle` + raw inline `<button>`s at `page.tsx:680-696`). All widths.
- **[M3 — STILL]** Filter/summary/tab vertical stack unchanged. Still four rows between header and first card at 1280/1440. `page.tsx:664-751`.
- **[M4 — STILL]** At 1920 the right meta column is still single-column dead space inside a half-empty card. `page.tsx:1125`. Width: 1920.
- **[M5 — STILL]** Add Opportunity still `variant="gradient"` (`page.tsx:466`); review queue empty state uses a default `Button asChild` (`review-queue.tsx:152`). Visual identity for primary "Add" is still inconsistent.
- **[L1/L2/L3 — STILL]** No changes; "source" still plain text (`page.tsx:1106-1108`), separator-`·` strip still hand-rolled (`page.tsx:740-751`), tab-height mismatch unchanged.

## New observations (loop-004)

- **[NEW M6]** Three call-sites for the type/status badge pair are now visibly diverging: list row uses `Badge variant={isHackathon ? "warning" : "info"}` + `Badge variant="outline"` (status). Kanban uses `Badge variant={…hackathon ? "warning" : "info"}` + truncated location badge + an optional closed-status badge. Review queue uses neither, only a free-floating `Badge variant="info">Remote</Badge>`. A single `<StatusPill />` is necessary but not sufficient — the *combination* "type badge + status badge + source" should also become a primitive (`<OpportunityChipRow />`) so the three card variants stop diverging further. `page.tsx:1096-1109`, `_components/kanban-board.tsx:396-414`, `components/opportunities/review-queue.tsx:252-264`. All widths.
- **[NEW L4]** Toast description text is now duplicated in two halves ("Could not load opportunities" + "Failed to list opportunities") because the title is the user-facing label and the description is the raw API error. After dedupe the duplication is more obvious — descriptions feel like log lines, not user copy. `hooks/use-error-toast.ts:42-49`. All widths.

## Cross-cutting observations

- **Status pill is the right Tier C extraction.** Eight distinct statuses to support (`OPPORTUNITY_STATUS_OPTIONS` in `apps/web/src/app/[locale]/(app)/opportunities/utils.ts:167`): `pending`, `saved`, `applied`, `interviewing`, `offer`, `rejected`, `expired`, `dismissed`. Today only `rejected`/`expired`/`dismissed` get color via `CLOSED_SUB_STATUS_BADGE_VARIANTS` (`utils.ts:260`).
- **Three opportunity-card implementations** unchanged — see loop-001 cross-cutting.

## Console / runtime

- 2 (not 4) toasts visible at all widths from the dev-env 500s on `/api/opportunities` and `/api/settings`. Dedupe is working. No new warnings.
