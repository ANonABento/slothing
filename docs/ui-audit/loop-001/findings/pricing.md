# `pricing` — `/en/pricing`

**Source:** `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/pricing-1280.png`
- 1440: `../screenshots/pricing-1440.png`
- 1920: `../screenshots/pricing-1920.png`

## Findings

### High

- _None._ Tier cards, comparison table, FAQ, trust grid, and bottom CTA all render visibly with working CTAs across all widths.

### Medium

- **[M1]** First "Self-host" pricing card title clips/wraps awkwardly. At 1280 the four tier cards squeeze into `lg:grid-cols-4` (`pricing/page.tsx:246`); the inline header row is `<icon><h2 className="text-2xl font-semibold">Self-host</h2>` plus a `Open source` badge (`pricing/page.tsx:267-279`). On 1280 the "Self-host" title forces "Self host" onto two lines and pushes the badge to overlap or vertically misalign with the icon. Other tiers ("Hosted Free", "Weekly", "Monthly") fit on one line because they have shorter strings; this is purely the worst-case string in the column. Width: 1280, 1440.
- **[M2]** Page-level container caps at `max-w-6xl` (`pricing/page.tsx:230`) but the marketing navbar/footer cap at `max-w-6xl` too — that's consistent. However the home hero uses `max-w-7xl`, so navigating home → pricing snaps content noticeably narrower. See cross-cutting note. Width: 1920.
- **[M3]** Tier card CTAs use three different code paths (`Button asChild` for internal, `CheckoutButton` for Stripe, `Button asChild` wrapping `<a target="_blank">` for external) (`pricing/page.tsx:305-341`). Functional, but the variant choice (`tier.highlighted ? "default" : "outline"`) is duplicated across the checkout and external branches, and the internal-link branch ignores `tier.highlighted` so the "Start with your key" button is `default` even though Hosted Free is `highlighted: false`. Visual inconsistency with the other two non-highlighted tiers. Width: all.
- **[M4]** Repeated section pattern `mt-16 border-t pt-10` for "Plan questions", "Security and data handling", and the "Hosted billing is live" CTA all use the same prelude (`pricing/page.tsx:411,427`). Same pattern as home — strong DRY candidate. Width: all.
- **[M5]** Comparison table forces a horizontal scrollbar at 1280 because of `min-w-[820px]` (`pricing/page.tsx:366`). At 1280 the page content area is `max-w-6xl` minus `px-4` ≈ ~1120px, so it should fit, but the `min-w-[820px]` is unnecessary defensive width. Visually fine here, but it means the explicit `overflow-x-auto` wrapper is doing nothing on desktop. Width: all desktop.

### Low

- **[L1]** Two near-identical "Self-host on GitHub" / Stripe checkout button blocks: tier cards (`pricing/page.tsx:246-351`) and the bottom "Hosted billing is live" panel (`pricing/page.tsx:497-520`) both render Weekly/Monthly Checkout buttons. Slight duplication of intent. Width: all.
- **[L2]** "Pre-launch draft" warning on terms uses `border-warning/40 bg-warning/10` — pricing's "Hosted billing is live" panel uses `border-primary/30 bg-primary/5`. Two different alert styles for similar callouts. Cross-route note. Width: all.

## Cross-cutting observations

- **Marketing-route container widths are not unified.** Pricing → `max-w-6xl`. Home hero → `max-w-7xl`. Home sections → `max-w-6xl`. ATS scanner → `max-w-3xl`. Extension → `max-w-6xl` (most), `max-w-3xl` (FAQ), `max-w-4xl` (final CTA). Privacy/terms → `max-w-3xl`. Eight routes, five different widths, no shared primitive. This causes left-edge "jumping" when navigating between marketing routes.
- **Tier card pattern is bespoke.** `pricing/page.tsx:259-348` is ~90 lines of inline JSX for one card. If the `vs/[competitor]` pages also do tier-style comparisons (TBD by audit there), they likely reinvent it. Should consider a `<PricingTier>` or `<MarketingCard>` primitive.
- **Lint allows `bg-warning/10` and `border-warning/40`** which is correct (warning is a semantic token) but the inline gradient card (`pricing/page.tsx:497`) hardcodes its own border/bg. Consider a shared `<CalloutPanel variant="info|warning|success" />` for these one-off banners.

## Console / runtime

(None observed.)
