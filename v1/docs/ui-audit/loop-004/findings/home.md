# `home` — `/en`

**Source:** `apps/web/src/app/[locale]/(marketing)/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/home-1280.png`
- 1440: `../screenshots/home-1440.png`
- 1920: `../screenshots/home-1920.png`

## Findings

### High

- _None._

### Medium

- **[M1]** [STILL] Hero `max-w-7xl` vs sections `max-w-6xl` — at 1920 the hero copy column still extends noticeably further left than "Your career data, working for you" and the feature/how-it-works/CTA blocks beneath. Left-edge misalignment between hero and rest of marketing chrome persists.
- **[M2]** [STILL] Section-header pattern (badge → headline with `gradient-text` → subhead) is still duplicated verbatim in `features.tsx`, `how-it-works.tsx`, `testimonials.tsx`, `cta-section.tsx`. No `<MarketingSectionHeader />` extraction.
- **[M3]** [STILL] Section vertical rhythm still uses two paddings (`py-20 lg:py-32` vs hero `pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32`). No shared `<MarketingSection>` primitive.
- **[M4]** [STILL] Literal palette gradients (`from-violet-500 to-purple-400`, etc.) still present in `features.tsx` and `how-it-works.tsx` icon tiles.

### Low

- **[L1]** [STILL] Hero floating accent cards still overlap at 1280 (visible at narrow widths).
- **[L2]** [STILL] Hero "active development" caption breathing room still tight at 1280.

## Cross-cutting observations

- Locale switcher correctly shows globe + "EN" compact chip on home (loop-001 cross-cutting "Engl" leak fixed).
- Marketing chrome (navbar + footer) renders correctly across widths.

## Console / runtime

(0 console errors at all 3 widths per run-summary.json.)
