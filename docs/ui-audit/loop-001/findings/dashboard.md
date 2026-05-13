# `dashboard` — `/en/dashboard`

**Source:** `apps/web/src/app/[locale]/(app)/dashboard/page.tsx`
**Widths audited:** 1280 / 1440 / 1920 (viewport-only screenshots — page uses `PageShell` with internal scroll)
**Loop:** 001

## Screenshots

- 1280: `../screenshots/dashboard-1280.png`
- 1440: `../screenshots/dashboard-1440.png`
- 1920: `../screenshots/dashboard-1920.png`

## Cross-cutting observations

- **Header primitive is inconsistent with the rest of the app.** Dashboard is the **only** authenticated app page that uses `InsetPageHeader` (`apps/web/src/components/ui/page-layout.tsx:178-206`); every other route under `app/[locale]/(app)/` (profile, settings, opportunities, bank, analytics, calendar, salary, emails, interview, answer-bank) uses the bordered, full-width `PageHeader` (`apps/web/src/components/ui/page-layout.tsx:49-81`). Side-by-side this looks like two different products — the dashboard title sits flush with the page body while every sibling has a card-bg banner with a `border-b` divider. Either the dashboard should switch to `PageHeader`, or the rest of the app should adopt `InsetPageHeader`. Picking one is a portfolio-wide consistency win.
- **`PageShell` content is left-aligned at >1536 px.** `pageWidthClasses.wide = "max-w-screen-2xl"` with no `mx-auto` (`apps/web/src/components/ui/page-layout.tsx:6-10`). At 1920 the dashboard content stops at the cap and leaves a wide blank gutter on the right — see the 1920 screenshot. Same pattern affects every other app page that uses `PageShell`/`PageContent` (this is also visible on profile/settings, see those files).
- The "Capture jobs from any site" sidebar promo card is rendered immediately above the `Settings` row in `Sidebar` and appears at all 3 widths — the sidebar shell itself is consistent.

## Findings

### High

- (none)

### Medium

- **[M1]** Header style mismatches every other app page — `InsetPageHeader` here vs `<PageHeader>` everywhere else. `apps/web/src/app/[locale]/(app)/dashboard/page.tsx:413-436`. Affects all widths. Pick one primitive and migrate the outliers.
- **[M2]** Dashboard content is left-stranded at 1920 — the `PageShell`/`PageContent` `wide` cap (`max-w-screen-2xl`, no `mx-auto`) leaves a large empty band on the right. `apps/web/src/components/ui/page-layout.tsx:6-10` + `apps/web/src/app/[locale]/(app)/dashboard/page.tsx:377`. Visible at 1920.
- **[M3]** "What unlocks next" aside hugs the right edge of the content area at 1920 because of M2. The content + aside together cap at `max-w-screen-2xl` and the aside ends up far from the screen edge with a blank right gutter, which makes it read as "the right column is in the middle of the page." Same root cause as M2; mentioning separately because the visual impact is louder on this two-column onboarding layout.
- **[M4]** Step row CTA chips (`Recommended` filled vs `Install extension →` outlined vs other steps) are all rendered with ad-hoc inline classes inside `SetupStep` (`apps/web/src/app/[locale]/(app)/dashboard/page.tsx:583-595`) rather than the shared `Button` component. They sit next to a real `Button` (the `Skip setup for now` in the aside, which uses `<Button variant="secondary">`). Result: visually similar but built two different ways — one is a `<span>`, one is a real button — so heights and focus styles drift. Prefer `Button asChild` here so the chip inherits all variant + a11y behavior from one source.

### Low

- **[L1]** Step number/checkmark column reserves `sm:w-12` even when the step is complete and only renders a small check icon (`apps/web/src/app/[locale]/(app)/dashboard/page.tsx:561-574`). At 1280 this looks fine but the spacing reads slightly cavernous on the active row at 1920 because the content row is tall and the number column is narrow — minor.
- **[L2]** Onboarding "01 / 02 / 03 / 04" labels use `text-muted-foreground` font-semibold uppercase, while the "START HERE" eyebrow above uses `text-primary` font-semibold uppercase. Consistent font system, but the two adjacent uppercase eyebrows in different colors are slightly noisy. Tiny nit.

## Console / runtime

- React hydration `nonce` mismatch on every load (cross-cutting — see `_global.md`). One per width.
- 25× `Failed to load resource: 500` per width — these are dashboard data fetches firing in dev with no DB/keys, not UI bugs. Not actionable from a UI standpoint.
- No `IntlError` missing-message warnings observed for `dashboard` namespace.
