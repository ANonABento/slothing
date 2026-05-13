# `extension-marketing` — `/en/extension`

**Source:** `apps/web/src/app/[locale]/(marketing)/extension/page.tsx`
**Widths audited:** 1280 / 1440 / 1920 (1920 errored mid-capture)
**Loop:** 001

## Screenshots

- 1280: `../screenshots/extension-marketing-1280.png`
- 1440: `../screenshots/extension-marketing-1440.png`
- 1920: `../screenshots/extension-marketing-1920-error.png` (only hero captured — screenshot tool aborted)

## Findings

### High

- **[H1]** 1920 screenshot file has the `-error` suffix — the capture aborted partway through the page. Looking at the partial capture, the hero renders fine, but the rest of the page wasn't reachable for audit. Worth re-running the screenshot tool against this route to confirm there isn't a runtime error blocking layout below the hero. (Could also be a screenshot-runner timeout, not a page bug.) Width: 1920.

### Medium

- **[M1]** Hero grid asymmetry produces dead zone at narrow widths. `grid max-w-6xl ... lg:grid-cols-[0.92fr_1.08fr] lg:items-center` (`extension/page.tsx:96`) gives the right column slightly more space, but the right column is a fully bespoke `HeroMockup` component rendered as a tall placeholder. At 1280 the right column min-height (`min-h-[420px]` on the mockup, `extension/page.tsx:299`) drives a ~420px gap below the install buttons in the left column. Width: 1280.
- **[M2]** Feature blocks use the `even/odd` reverse trick (`reversed = index % 2 === 1`, `extension/page.tsx:129-153`) but the visual swap is `md:order-2`. At 1280 (md+), the second feature card has its image on the LEFT and text on the RIGHT — but the icon-above-title block stays at the top, which means the icon is positioned above the text on one side and above the image on the other. Visually the alternating layout doesn't read as intentional; it just looks like the icons "jumped". Width: 1280, 1440.
- **[M3]** Three different hero/section primitives in one file. Hero (`extension/page.tsx:96`), feature section header (`extension/page.tsx:118-125`), how-it-works header (`extension/page.tsx:160`), privacy section (`extension/page.tsx:178`), final CTA (`extension/page.tsx:244-271`) all wrap `mx-auto max-w-{6|3|4}xl px-6 py-{12|16|20}` in slightly different combinations. The "WHAT IT DOES" eyebrow (`text-sm font-semibold uppercase text-primary`) on `extension/page.tsx:119` is a one-off — not used on home, pricing, or ats-scanner. Width: all.
- **[M4]** "How it works" step cards use a numbered badge `bg-primary text-primary-foreground` (`extension/page.tsx:164`) — the home page's `HowItWorks` uses a `text-4xl font-bold text-muted-foreground/80` numeric instead of a badge (`how-it-works.tsx:60`). Both are 3-step primary actions, two different visual languages. Width: all.

### Low

- **[L1]** Final CTA section uses `max-w-4xl` (`extension/page.tsx:245`) while every other section uses `max-w-6xl` (or `max-w-3xl` for FAQ). Three different caps within the same page. Width: all.
- **[L2]** Privacy section grid `lg:grid-cols-[0.8fr_1.2fr]` (`extension/page.tsx:178`) plus the `lg:col-start-2` legal-links row (`extension/page.tsx:213`) is a bespoke layout that probably wants to be a 2-row stack at narrow widths but renders the lg-only column-start at 1280 only correctly because both columns auto-flow. Inspect at md only to confirm. Width: 1280.
- **[L3]** `bg-card/45` (`extension/page.tsx:116, 177`) — the `/45` opacity suffix is non-Tailwind-default and only used here in the marketing tree. Should be `/40` or `/50` for consistency. Width: all.

## Cross-cutting observations

- **No `<MarketingHero>` extraction.** The home, pricing, ats-scanner, and extension heroes all do roughly: outer section + max-w container + title + subhead + CTA(s), but each picks a different layout, max-width, and CTA composition. Strong DRY candidate.
- **`HeroMockup` in `extension/page.tsx:295-337` is an inline functional component with hardcoded skeleton blocks.** Same pattern as the home page's faux dashboard preview (`hero.tsx:138-258`). Two routes, two completely independent implementations of "fake browser chrome with a product preview inside". A shared `<BrowserChromeMockup>` would help.
- **Image assets at `/marketing/extension/*.png` are referenced but their existence isn't validated by the audit.** Worth a quick `ls public/marketing/extension/` to confirm the three feature screenshots actually ship; otherwise the feature section would render broken alt-text only.

## Console / runtime

- 1920 screenshot is incomplete (`-error` suffix). Re-run capture to determine whether this is a screenshot-tool timeout or a real layout/runtime regression. Hero alone looks correct.
