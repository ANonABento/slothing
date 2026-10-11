# `calendar` — `/en/calendar`

**Source:** `apps/web/src/app/[locale]/(app)/calendar/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/calendar-1280.png`
- 1440: `../screenshots/calendar-1440.png`
- 1920: `../screenshots/calendar-1920.png`

## Loop-001 H/M status

- **[M1 no week/month view selector]** — `[STILL]`. Only Today / chevron controls in the panel header; no week/agenda toggle.
- **[M2 calendar grid missing trailing May 30/31]** — `[STILL]`. Last row still terminates at 29; April 30 is rendered at the start as previous-month overflow but May 30/31 are not rendered. Trailing-pad logic in `calendarDays` is unchanged.
- **[M3 stacked empty states in right rail]** — `[STILL]`. Both "Click on a date to view events" and "No upcoming events" still render as identical dashed-border `StandardEmptyState` cards, doubling the dashed-border noise.
- **[M4 header crowding at 1280]** — `[STILL]` at 1280; less severe at 1440. "All Events" filter + Create / Subscribe / Export.ics still all share the same outline weight; Create Event not visually promoted.

## Findings

### High

- _(none)_

### Medium

- **[M1]** (Loop-001 M1) No week/month/agenda view selector in `apps/web/src/app/[locale]/(app)/calendar/page.tsx` header. Width: all.
- **[M2]** (Loop-001 M2) Calendar grid still missing May 30/31 — `calendarDays` only pads the start, not the trailing row. Width: all.
- **[M3]** (Loop-001 M3) Right rail still renders two identical dashed-border empty-state cards. Width: all.
- **[M4]** (Loop-001 M4) "Create Event" not visually promoted vs. Subscribe / Export.ics. Width: 1280, 1440.

### Low

- **[L1]** (Loop-001 L1) Selected-day pill on 13 is still a slightly-off rounded-rectangle, not circular. Width: all.
- **[L2]** (Loop-001 L2) Color-dot legend (`w-3 h-3`) larger than cell badges (`w-1.5 h-1.5`); inconsistent indicator sizing. Width: all.

## Cross-cutting observations

- PageHeader actions pattern duplication with analytics is unchanged — calendar still renders `flex flex-col items-start gap-3 sm:flex-row sm:items-center` inline rather than via a shared `<PageHeaderActions>` helper.
- The right rail's stacked dashed empty-states are the most actionable single-route fix: combine into one composite empty card or downgrade the upcoming-events placeholder to a lighter inline variant.

## Console / runtime

- 6x dev 500s per width on `/api/calendar/*` and `/api/google/*` endpoints (expected). No client-side errors beyond the network 500s. Toast layer was not visible in this capture — the calendar page does not surface fetch failures as toasts at the rate the interview/emails pages do.
