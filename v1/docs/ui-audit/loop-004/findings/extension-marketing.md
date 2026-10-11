# `extension-marketing` — `/en/extension`

**Source:** `apps/web/src/app/[locale]/(marketing)/extension/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/extension-marketing-1280.png`
- 1440: `../screenshots/extension-marketing-1440.png`
- 1920: `../screenshots/extension-marketing-1920.png`

## Findings

### High

- **[H1]** [FIXED] 1920 capture no longer errors. `extension-marketing-1920.png` (not `-error`) renders full page top-to-bottom: hero, "Less copying, more deciding" features, "How it works", "Privacy and trust", FAQ, "Start capturing while you browse" CTA, footer all visible.

### Medium

- **[M1]** [FIXED] Hero asymmetry dead-zone gone — the right-column mockup is no longer a tall placeholder driving a 420px gap. Heights match and install buttons no longer have orphan whitespace below them at 1280.
- **[M2]** [STILL] Feature blocks still use the `even/odd` reverse trick (`reversed = index % 2 === 1`). At 1280 the alternating layout still reads as icons "jumping" between sides rather than an intentional rhythm.
- **[M3]** [STILL] Three different hero/section primitives in one file still present (`mx-auto max-w-{6|3|4}xl px-6 py-{12|16|20}` combinations + the one-off "WHAT IT DOES" uppercase eyebrow not used elsewhere).
- **[M4]** [STILL] How-it-works step badges still differ from home's numeric style — extension uses `bg-primary text-primary-foreground` numbered badges, home uses muted-foreground large numerals.

### Low

- **[L1]** [STILL] Final CTA section still uses `max-w-4xl` while other sections use `max-w-6xl`/`max-w-3xl`.
- **[L2]** [STILL] Privacy section bespoke `lg:grid-cols-[0.8fr_1.2fr]` layout unchanged.
- **[L3]** [STILL] `bg-card/45` opacity suffix still used; should be `/40` or `/50`.

## Cross-cutting observations

- 1920 capture issue confirmed fixed — page renders fully. H1 from loop-001 closed.
- Locale switcher chip renders correctly.
- `<MarketingHero>` / `<BrowserChromeMockup>` extractions still outstanding.

## Console / runtime

(0 console errors at all 3 widths; 1920 capture completed cleanly.)
