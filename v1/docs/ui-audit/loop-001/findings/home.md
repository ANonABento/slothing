# `home` — `/en`

**Source:** `apps/web/src/app/[locale]/(marketing)/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/home-1280.png`
- 1440: `../screenshots/home-1440.png`
- 1920: `../screenshots/home-1920.png`

## Findings

### High

- _None._ Hero, Features, How It Works, Testimonials, CTA section all render with content visible across widths. CTAs are present and clickable.

### Medium

- **[M1]** Hero container width inconsistent with the rest of the site. The hero uses `max-w-7xl` (`apps/web/src/app/[locale]/(marketing)/components/hero.tsx:38`) while every other section on the home page (`Features`, `HowItWorks`, `Testimonials`, `CTASection`) and the marketing navbar/footer all use `max-w-6xl`. At 1920 the hero copy column extends noticeably further left than the sections beneath it, breaking left-edge alignment with the navbar/footer/feature grid below. Width: 1440, 1920.
- **[M2]** Repeated section-header pattern is duplicated verbatim instead of extracted. The "badge → headline with `gradient-text` span → subhead" block appears 4 times: `features.tsx:39-51`, `how-it-works.tsx:35-46`, `testimonials.tsx:29-41`, `cta-section.tsx:31-37`. Same `text-3xl md:text-4xl font-bold tracking-tight` headline class, same `text-lg text-muted-foreground` subhead class. Should be a shared `<MarketingSectionHeader />` component. Width: all.
- **[M3]** Section vertical rhythm uses two slightly different paddings (`py-20 lg:py-32` everywhere except hero, which uses `pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32`). The mobile-first hero padding is fine but the inconsistency means there's no shared `<MarketingSection>` primitive; every section reinvents its own outer wrapper. Width: all.
- **[M4]** `from-violet-500 to-purple-400`, `from-rose-400 to-orange-400`, `from-blue-500 to-indigo-400`, `from-amber-400 to-orange-400` literal Tailwind palette gradients in `features.tsx:9,16,23,30` and `how-it-works.tsx:10,18,26`. These are not strictly forbidden by the lint (which targets solid `bg-*` and `text-*` grayscale), but they do bypass the semantic-token system and would produce non-themed gradients in dark mode. Width: all.

### Low

- **[L1]** "Floating accent card — top-left" inside the hero (`hero.tsx:280-295`) only appears on `lg:flex` (≥1024px). At 1280 it floats over the bottom-left edge of the product preview card with `-left-3` and overlaps with the bullet "Cover letter — Drafted in 38s" floating card sitting at `-left-4 bottom-6 translate-y-1/3`. Both visible, no occlusion of real content, but the spacing is tight at 1280. Width: 1280.
- **[L2]** The hero "Slothing is in active development — features ship weekly." caption is rendered with `lg:text-left` but immediately follows a `lg:max-w-2xl` trust-cue row, so on 1280 the cue row wraps to two rows but the caption sits flush left with no extra breathing room. Cosmetic. Width: 1280.

## Cross-cutting observations

- **Locale switcher in navbar shows truncated text "Engl" on some pages.** `LocaleSwitcherCompact` (`apps/web/src/components/i18n/locale-switcher.tsx:84-103`) sets `<SelectValue className="sr-only" />` to hide the locale name, but the rendered output on `vs-index` shows literal "Engl" inside the trigger pill. The navbar uses the same component on every marketing route — likely affects every marketing page; just less visible on dense pages. Worth verifying the `sr-only` actually wins against the Radix Select default.
- **No shared marketing section/header primitive.** Every marketing route reinvents its own hero (`max-w-7xl`/`max-w-6xl`/`max-w-3xl`) and its own section headers. Strong candidate for a `<MarketingSection>` + `<MarketingSectionHeader>` extraction — would also force max-width consistency across routes (currently every marketing route picks a different cap).
- **`gradient-bg` and `gradient-text` are CSS utility classes referenced but not always paired.** Buttons use `gradient-bg` directly via `className` instead of going through a shared `<Button variant="gradient">` (the home hero uses `variant="gradient"`, but `cta-section.tsx:42` and `navbar.tsx:97-98` reach for raw `className="gradient-bg text-primary-foreground hover:opacity-90"` instead). Same visual, two implementations.

## Console / runtime

(None observed in screenshots; runtime not exercised.)
