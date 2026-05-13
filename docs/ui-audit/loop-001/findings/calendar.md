# `calendar` — `/en/calendar`

**Source:** `apps/web/src/app/[locale]/(app)/calendar/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/calendar-1280.png`
- 1440: `../screenshots/calendar-1440.png`
- 1920: `../screenshots/calendar-1920.png`

## Findings

### High

- _(none)_

### Medium

- **[M1]** No week / month view selector — the page header description says "Track interviews, deadlines, and reminders in one place" and the panel exposes Today / chevrons (`apps/web/src/app/[locale]/(app)/calendar/page.tsx:454-473`), but there's no week/agenda toggle. Audit prompt asks whether the week/month switcher works visually; the answer is that it doesn't exist. If it's intentionally month-only, the description should not imply otherwise; if it's missing, this is a feature gap that reads like a layout gap because the header has plenty of room for a `<Tabs>` group at all three widths. Width: 1280, 1440, 1920.

- **[M2]** Calendar grid renders only the first week with previous-month overflow, then shows blank cells for May 30/31 — May 2026 has 31 days but the grid in `calendarDays` (`apps/web/src/app/[locale]/(app)/calendar/page.tsx:249-271`) builds days 30 (April), 1, 2 in the first row and skips trailing days. Looking at the screenshot the visible last-row dates are 24..29 and the 30th/31st of May are missing entirely. The padding logic only pads the start, not the end, so the grid is uneven (last row has 6 cells instead of 7). Width: 1280, 1440, 1920.

- **[M3]** Right column has stacked empty states — `StandardEmptyState` is rendered twice in the right rail (one for "Click on a date to view events" with `min-h-48`, one for "No upcoming events" with `min-h-40`). Both are visually identical dashed-border cards, which doubles the dashed-border noise on a page that otherwise has none. Consider rendering only one empty state at a time or using a lighter-weight inline placeholder for the upcoming-events sub-section. Cite `apps/web/src/app/[locale]/(app)/calendar/page.tsx:619-625` and `:649-655`. Width: 1280, 1440, 1920.

- **[M4]** Filter dropdown + 4 action buttons crowd the header at 1280 — the header actions wrap correctly to a 2-line layout via `flex-wrap`, but the resulting visual hierarchy is muddled. "Create Event" is the primary action; today it sits beside Subscribe and Export.ics with the same "outline" weight on either side. Consider promoting Create Event visually and grouping Subscribe + Export.ics into a "More" menu. Width: 1280, 1440.

### Low

- **[L1]** Selected day pill visually clips at the bottom of its cell — `bg-primary/20` on day 13 looks like a slightly-off rounded-rectangle highlight rather than a circle; consistent with no nearby badges so easy to overlook. Width: all.

- **[L2]** Color-dot legend at the bottom of the calendar (`Interview / Deadline / Reminder`) and the same colors used as small badges in cells use different sizes (`w-3 h-3` vs `w-1.5 h-1.5`); legend reads larger than the actual indicators. Width: all.

## Cross-cutting observations

- **PageHeader pattern is shared** with interview/emails/analytics/salary via `apps/web/src/components/ui/page-layout.tsx:49`. Good. The actions slot uses the documented "wrap a Select + button group" pattern — the same `flex flex-col items-start gap-3 sm:flex-row sm:items-center` markup is **duplicated verbatim** in `calendar/page.tsx:377-422` and `analytics/page.tsx:279-335`. Lift to a `<PageHeaderActions>` helper.
- **`StandardEmptyState`** is the right primitive but multiple stacked instances on a single panel (right rail) look noisy; consider an `<InlineEmptyState>` variant for sub-sections that doesn't add a dashed border.
- **`bg-info/10` / `border-info/30`** notice card (calendar-sync banner, `:430`) is the same shape as the `bg-warning/10` skill-gap pills in analytics; both are ad-hoc — there's no shared `<NoticeBanner>` component.

## Console / runtime

- No console errors specific to this route observed in the screenshots.
- "Calendar sync available" notice card renders because `googleCalendarConnected === false`, which is expected in dev.
