# `interview` — `/en/interview`

**Source:** `apps/web/src/app/[locale]/(app)/interview/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/interview-1280.png`
- 1440: `../screenshots/interview-1440.png`
- 1920: `../screenshots/interview-1920.png`

## Loop-001 H/M status

- **[H1 toast stack overlaps Situational card]** — `[STILL]` at 1280 only; `[FIXED]` at 1440/1920. Loop-003 B2 toast dedupe is working (now 2 stacked toasts instead of 4), but the deduped pair still sits at the bottom-right, and at 1280 the lower toast still occludes the bottom half of the Situational card (description + "Fresh track · start anytime"). At 1440/1920 the toasts now land in the empty gutter between the cards and the right edge — Situational fully readable.
- **[H2 voice/text mode toggle not visible in empty state]** — `[STILL]` all widths. Empty state still surfaces only "Add an Opportunity" CTA; "Quick Practice" entry from `openQuickPractice` is still not surfaced.
- **[M1 IntlError missing-message]** — `[FIXED]`. Loop-001 G-M1 fix landed; no IntlError entries appear in `loop-004/console-errors.json` for interview at any width, and the category headings ("Behavioral / Technical / Situational") render normalized titles (no key-fallback strings).
- **[M2 three-card grid awkward at 1280]** — `[STILL]`. Cards still rendered `grid-cols-3` with no responsive collapse; at 1280 they are tight, and combined with H1 the third card is still partly hidden.
- **[M3 duplicate "Fresh track · start anytime" microcopy]** — `[STILL]`. All three cards still carry the identical caption.

## Findings

### High

- **[H1]** (Loop-001 H1, narrowed) Toast pair still overlaps Situational card body at **1280 only**. Loop-003 dedupe reduced the stack from 4→2, so 1440/1920 no longer overlap; the remaining occlusion at 1280 is because the toast positioner uses a viewport-anchored offset and the page content reaches further toward the right edge at 1280. Either anchor toasts to the right of the main content area (not the viewport) or shrink the toast width below the third card's column at 1280. Width: 1280.

### Medium

- **[M1]** (Loop-001 H2) Empty state still hides Quick Practice / voice-text toggle — `openQuickPractice` exists in code but is not surfaced when the user has zero opportunities. Width: all.
- **[M2]** (Loop-001 M2) Category grid does not collapse below `md`; still `grid-cols-3`. Width: 1280 (visible), <1280 (assumed worse).
- **[M3]** (Loop-001 M3) Duplicate "Fresh track · start anytime" caption on all three cards. Width: all.

### Low

- **[L1]** (Loop-001 L1) "No Opportunities to Practice For" Title Case still inconsistent with rest of empty-state sentence case. Width: all.

## Cross-cutting observations

- Toast dedupe (loop-003 B2) is observably working, but the toast positioner does not yet account for the active content's right edge — same pattern likely contributes to the emails 1280 occlusion (and salary/interview show the extension-promo sidebar card competing for the same bottom-left/right gutters).
- Category cards on this route remain visually identical to email template cards and document cards — same primitive opportunity called out in loop-001 cross-cutting.

## Console / runtime

- 3x `/api/interview/*` 500s per width (expected dev-env), surfaced as 2 deduped toasts. No IntlError entries.
