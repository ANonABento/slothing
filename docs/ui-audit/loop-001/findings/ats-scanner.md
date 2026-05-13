# `ats-scanner` — `/en/ats-scanner`

**Source:** `apps/web/src/app/[locale]/(marketing)/ats-scanner/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/ats-scanner-1280.png`
- 1440: `../screenshots/ats-scanner-1440.png`
- 1920: `../screenshots/ats-scanner-1920.png`

## Findings

### High

- _None._ Hero, scanner form, honesty panel render with content visible. Submit button and form fields are present.

### Medium

- **[M1]** Page content is severely under-wide on desktop. The entire page is wrapped in `max-w-3xl mx-auto` (`ats-scanner/page.tsx:41`) → ~768px content cap. At 1920 the form sits in a thin column with ~580px of empty whitespace on each side, creating a "stranded in the center" look. The home hero is `max-w-7xl`, pricing is `max-w-6xl`, extension is `max-w-6xl` — this route is dramatically narrower than its siblings without a clear reason (the scanner form itself doesn't need 768px+ but the hero/benefits row does). Width: 1440, 1920.
- **[M2]** Three-up benefits row at 1280 is cramped. The `grid-cols-1 sm:grid-cols-3 gap-4 mb-12` (`ats-scanner/page.tsx:69`) puts three small cards side-by-side, but each card is only `text-xs` description (`ats-scanner/page.tsx:74`) with a 5×5px icon. At 1280 the descriptions wrap to 3-4 lines each but the cards are visually tiny relative to the page. The contrast vs the home page's much chunkier benefit cards in `Testimonials` is jarring. Width: 1280.
- **[M3]** Hero pattern reinvented. ATS scanner uses `<div className="text-center mb-12">` with a `w-16 h-16 rounded-2xl bg-primary/10` icon block + `text-4xl font-bold` h1 + `text-lg text-muted-foreground` subhead (`ats-scanner/page.tsx:43-66`). The extension page hero (`extension/page.tsx:96-114`) uses `<Badge>` + `text-4xl ... lg:text-6xl` h1 + `text-lg leading-8` subhead — same intent, different implementation. The home hero has a third variation. No shared `<MarketingHero>` component. Width: all.
- **[M4]** Inline `text-xs leading-5` source-citation block (`ats-scanner/page.tsx:56-65`) is the only marketing route with academic source citations. Pattern looks reasonable but could be a `<SourceCitation />` if reused. Cosmetic. Width: all.

### Low

- **[L1]** "Free ATS Resume Scanner" hero icon is a `ShieldCheck` in a `bg-primary/10 rounded-2xl` box (`ats-scanner/page.tsx:44`). The pricing page security section uses the same `Lock`/`ShieldCheck`/`Sparkles`/`Trash2` motif but with a smaller `mb-3 h-5 w-5 text-primary` style (`pricing/page.tsx:442,449,458,473`). Different conventions for "section-level icon" across routes. Width: all.

## Cross-cutting observations

- **`max-w-3xl` page caps strand content at 1920.** Same problem as `privacy` and `terms`. Three routes (`ats-scanner`, `privacy`, `terms`) all use `mx-auto max-w-3xl px-…` as their entire desktop layout. At 1920, this leaves ~1150px of whitespace gutters. Either (a) bump these to `max-w-5xl` for non-prose hero sections, or (b) wrap a wider hero around a narrower prose body.
- **Scanner form is heavy and likely shared with `/upload` or another auth route.** `<ScannerForm locale={locale} />` from `@/components/ats/scanner-form` — likely the only place this component is used, so no DRY concern, but worth verifying.

## Console / runtime

(None observed.)
