# `ats-scanner` — `/en/ats-scanner`

**Source:** `apps/web/src/app/[locale]/(marketing)/ats-scanner/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/ats-scanner-1280.png`
- 1440: `../screenshots/ats-scanner-1440.png`
- 1920: `../screenshots/ats-scanner-1920.png`

## Findings

### High

- _None._

### Medium

- **[M1]** [STILL] Page still wrapped in `max-w-3xl` at 1920 — ~580px empty gutters on each side. Visible in ats-scanner-1920.png: form sits in a thin centered column with vast whitespace either side, dramatically narrower than home/pricing/extension siblings.
- **[M2]** [STILL] Three-up benefits row still uses tiny `text-xs` description cards with 5x5px icons; visually cramped at 1280 relative to the rest of the page.
- **[M3]** [STILL] Hero pattern not unified — ATS scanner's `bg-primary/10 rounded-2xl` icon block hero is still bespoke vs extension/home heroes. No shared `<MarketingHero>`.
- **[M4]** [STILL] Inline source-citation block (`text-xs leading-5`) remains a one-off.

### Low

- **[L1]** [STILL] Section-level icon styling conventions still differ across routes.

## Cross-cutting observations

- Locale switcher correctly shows globe + "EN" chip.
- The `max-w-3xl` stranding issue applies to this route at 1920 — primary visible regression next loop should consider widening hero or wrapping with a wider outer container.

## Console / runtime

(0 console errors at all 3 widths.)
