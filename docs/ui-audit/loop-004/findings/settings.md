# `settings` — `/en/settings`

**Source:** `apps/web/src/app/[locale]/(app)/settings/page.tsx`
**Widths audited:** 1280 / 1440 / 1920 (viewport-only screenshots)
**Loop:** 004

## Screenshots

- 1280: `../screenshots/settings-1280.png`
- 1440: `../screenshots/settings-1440.png`
- 1920: `../screenshots/settings-1920.png`

## Findings

### High

- _None._

### Medium

- **[M1]** [STILL] "Could not load locale / Failed to get settings" toast is still anchored bottom-right and overlaps the AI Provider grid at all 3 widths (visible in 1280/1440/1920 screenshots). Toast pile-up dedupe lands (one toast instead of N), but positioning + persistence over interactive content is unchanged. Either auto-dismiss or top-anchor it.
- **[M2]** [FIXED] `BillingSection` now uses `<PageSection>` (`apps/web/src/components/settings/billing-section.tsx:7,12-18`) instead of inline `rounded-lg border bg-card p-5` markup. Settings sub-sections are uniform.
- **[M3]** [FIXED] Settings no longer left-stranded at 1920 — `pageWidthClasses.wide` now includes `mx-auto`. Page content centers within the available area.
- **[M4]** [STILL] Three implicit "buckets" (`space-y-6` groups separated by `space-y-8` at `apps/web/src/app/[locale]/(app)/settings/page.tsx:53, 81, 92`) still have no visible group headings. At 1280 the grouping is still imperceptible; at 1440/1920 it reads as continuous flow.
- **[M5]** [FIXED] `GmailAutoStatusSection` now spans both columns via `<div className="lg:col-span-2">` wrapper at `apps/web/src/app/[locale]/(app)/settings/page.tsx:105-107`. No more half-width orphan with empty right side.

### Low

- **[L1]** [STILL] BYOK callout sub-tiles still don't grow at wider widths — same minor cosmetic at 1440/1920.
- **[L2]** [STILL] "Selected" pill on Ollama provider tile shares primary color with the surrounding card border; checkmark inside the pill (visible in screenshots) helps slightly but the pill+border combo is still visually heavy.

### New

- **[N1]** Same dead `icon` prop on `<PageHeader>` as dashboard — settings passes `icon={Settings}` (`apps/web/src/app/[locale]/(app)/settings/page.tsx:46`) but the primitive ignores it (`apps/web/src/components/ui/page-layout.tsx:52`). No icon next to "Settings" title at any width. Cross-cutting; logged once on dashboard `[N1]` as well.

## Cross-cutting observations

- Header consistency goal is met across dashboard/profile/settings — all three use bordered `<PageHeader>` now.
- BillingSection conversion to `PageSection` is the right pattern; profile should follow (see profile [M1]).
- The unused `icon` prop on `PageHeader` is a global defect surfaced by this audit.

## Console / runtime

- ~13× `Failed to load resource: 500` per width (settings + locale + various integration fetches). One of these still surfaces the visible "Could not load locale / Failed to get settings" toast (M1) — now deduped to a single toast instead of multiple, per loop-003 fix.
