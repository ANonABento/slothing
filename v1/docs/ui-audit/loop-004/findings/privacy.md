# `privacy` — `/en/privacy`

**Source:** `apps/web/src/app/[locale]/(marketing)/privacy/page.tsx` (moved into `(marketing)` per loop-002 A2 fix)
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/privacy-1280.png`
- 1440: `../screenshots/privacy-1440.png`
- 1920: `../screenshots/privacy-1920.png`

## Findings

### High

- **[H1]** [FIXED] Marketing navbar (Slothing logo, Features/Extension/How It Works/Pricing, EN chip, Sign In, Get Started) and footer (Product/Resources/Legal columns + © 2026 Slothing) now render at top and bottom of the privacy page across all 3 widths. The old "Notion export" appearance is gone.
- **[H2]** [FIXED] Marketing footer "Legal → Privacy/Terms" links no longer strip chrome — clicking them keeps users inside the marketing layout.

### Medium

- **[M1]** [STILL] Content cap `max-w-3xl` still leaves significant gutters at 1920, though the surrounding navbar/footer now anchor the page so it no longer reads as a stranded prose dump. Less severe than loop-001.
- **[M2]** [FIXED] Locale switcher in the now-rendered nav allows users to switch to other locales; addresses the loop-001 medium finding.
- **[M3]** [STILL] No `Last updated` versioning UI beyond the static date string.

### Low

- **[L1]** [STILL] Sequential `<h2>` + `<p>` structure with no sticky TOC.
- **[L2]** [STILL] "Back to home" link (now redundant with navbar) lacks a chevron icon — and arguably should be removed entirely now that the marketing navbar is present.

## Cross-cutting observations

- Big H1+H2 win from the route-group move into `(marketing)`.
- `<L2>` is interesting now: with the marketing navbar present, the in-page "Back to home" link is redundant — consider removing for cleanup next loop.
- Prose styling could still use `@tailwindcss/typography` for consistency.

## Console / runtime

(0 console errors at all 3 widths.)
