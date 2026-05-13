# `vs-index` — `/en/vs`

**Source:** `apps/web/src/app/[locale]/(marketing)/vs/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/vs-index-1280.png`
- 1440: `../screenshots/vs-index-1440.png`
- 1920: `../screenshots/vs-index-1920.png`

## Findings

### High

- **[H1]** [STILL] Page still feels "dead on arrival". Single hero (`ShieldCheck` icon + `Compare Slothing` title + 1-sentence subhead) followed by 3 small comparator cards in a single row, then ~600px empty whitespace before the footer at 1920. No content density improvement since loop-001.
- **[H2]** [FIXED] Locale switcher "Engl" leak resolved — vs-index-1280/1440/1920 all render the compact globe + "EN" chip cleanly in the navbar; no truncated text leaking through the trigger.

### Medium

- **[M1]** [STILL] Hero `ShieldCheck` icon still sits alone above the title with no badge/eyebrow context. Three different hero icon-styling approaches across home/ats-scanner/vs persist.
- **[M2]** [STILL] Comparator cards still `rounded-lg border p-5` with no `bg-card` fill. Cards visually disappear into the page background — visible at 1920 (and at 1280 they sit on the same paper-tone wash without any surface contrast).
- **[M3]** [STILL] No competitor logo / icon / visual differentiator on the comparator cards.
- **[M4]** [STILL] No "Slothing wins because…" preview on the index — same UX gap.

### Low

- **[L1]** [STILL] `tracking-normal` on h1 still present.
- **[L2]** [STILL] One-off `border-b bg-card/40` outer wrapper for hero still present.

## Cross-cutting observations

- Locale switcher fix confirmed across all marketing routes (loop-003 user-flagged item).
- Comparator card bg/visual still the most visually-broken thing on this route — single highest-impact next-loop fix.

## Console / runtime

(0 console errors at all 3 widths.)
