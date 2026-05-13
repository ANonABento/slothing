# `profile` — `/en/profile`

**Source:** `apps/web/src/app/[locale]/(app)/profile/page.tsx`
**Widths audited:** 1280 / 1440 / 1920 (viewport-only screenshots)
**Loop:** 004

## Screenshots

- 1280: `../screenshots/profile-1280.png`
- 1440: `../screenshots/profile-1440.png`
- 1920: `../screenshots/profile-1920.png`

## Findings

### High

- **[H1]** [STILL] "Could not load profile" red banner is still rendered alongside the full editor at all 3 widths (`apps/web/src/app/[locale]/(app)/profile/page.tsx:448-452`). Reproducible visually in loop-004: the red alert appears between the `<PageHeader>` (Discard / Save changes still active in disabled style) and the answer-bank prompt, with the 0% completeness card and Identity / Avatar tile rendering as if the load succeeded. Same first-time-user "broken form" perception as loop-001. Confirmed reproducible at 1280, 1440, 1920.

### Medium

- **[M1]** [STILL] ~10 copies of `<Card><CardHeader><CardTitle class="text-xl"><CardDescription>` in one file — Identity (line 602), Contact (646), Summary (729), Saved Signals (752), Career Details (807), Work Style (867), Target Roles, Salary, Privacy. No migration to `<PageSection>` yet. Affects all widths.
- **[M2]** [STILL] Profile section style still differs from settings (no icon tile, base `<Card>` only). Same root cause as M1.
- **[M3]** [STILL] "Want richer profile details?" prompt is still a hand-rolled bar (`apps/web/src/app/[locale]/(app)/profile/page.tsx:483` — `border bg-card/70 p-4`) sitting between header and body. Visible at all widths in loop-004 screenshots.
- **[M4]** [FIXED] Profile no longer left-stranded at 1920 — `pageWidthClasses.wide` now includes `mx-auto`. Right gutter is now balanced (~80px each side).
- **[M5]** [STILL] Tab list still built ad-hoc (`role="tablist"` at line 570 + manual `<button role="tab">`s at line 580). Not visible in viewport screenshots (likely below fold), but unchanged in source.

### Low

- **[L1]** [STILL] "Save changes" disabled-but-prominent primary button next to red error band — same odd visual at all widths in loop-004 screenshots.
- **[L2]** [STILL] Sidebar avatar disc still fills with giant solid `bg-primary` "P" (visible in all 3 loop-004 screenshots).

### New

- _None._

## Cross-cutting observations

- The H1 error-state UX bug is the only critical finding in the route audit set and is still in the backlog. The error toast is also visible bottom-right in some widths (settings cross-cutting), but the full-form-plus-banner is unique to profile.
- Avatar disc uses raw `bg-primary` for an empty placeholder — could be softened to `bg-muted` until the user enters a name.

## Console / runtime

- 3× `Failed to load resource: 500` per width in loop-004 (profile + streak fetches in dev). These are what surface the H1 banner, but the UI bug (rendering the full editor regardless) is independent of dev artefacts.
