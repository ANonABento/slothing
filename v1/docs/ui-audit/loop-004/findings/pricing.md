# `pricing` — `/en/pricing`

**Source:** `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/pricing-1280.png`
- 1440: `../screenshots/pricing-1440.png`
- 1920: `../screenshots/pricing-1920.png`

## Findings

### High

- _None._

### Medium

- **[M1]** [STILL] "Self-host" tier title still wraps to two lines at 1280 (visible in pricing-1280.png; "Self host" splits and badge position looks off vs the other three tiers which fit on one line). At 1440 also still wraps. 1920 fits on one line.
- **[M2]** [STILL] Pricing caps at `max-w-6xl` but home hero is `max-w-7xl` — same site-wide width inconsistency. Documented globally but persists.
- **[M3]** [STILL] Tier card CTAs still use three code paths (`Button asChild` internal / `CheckoutButton` / external link Button); the "Hosted Free" internal-link branch still ignores `tier.highlighted` so its CTA looks like a primary button despite non-highlighted state.
- **[M4]** [STILL] Repeated `mt-16 border-t pt-10` section prelude for "Plan questions", "Security and data handling", and "Hosted billing is live" still inline.
- **[M5]** [STILL] Comparison table still has defensive `min-w-[820px]`; `overflow-x-auto` wrapper still does nothing on desktop widths.

### Low

- **[L1]** [STILL] Tier-card and bottom-banner Stripe checkout buttons remain duplicated.
- **[L2]** [STILL] Two callout styles for pricing's "Hosted billing is live" (`border-primary/30 bg-primary/5`) vs terms' warning style.

## Cross-cutting observations

- Marketing nav locale switcher now shows globe + "EN" compact chip (loop-003 fix confirmed).
- Container width inconsistencies still cause left-edge "jumping" between marketing routes.

## Console / runtime

(0 console errors at all 3 widths.)
