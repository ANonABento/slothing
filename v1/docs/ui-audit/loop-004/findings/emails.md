# `emails` — `/en/emails`

**Source:** `apps/web/src/app/[locale]/(app)/emails/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/emails-1280.png`
- 1440: `../screenshots/emails-1440.png`
- 1920: `../screenshots/emails-1920.png`

## Loop-001 H/M status

- **[H1 page failed to load at 1280]** — `[FIXED]`. Loop-004 1280 capture renders the full Email Templates page with the 8 template cards, "Choose Template" header, and Drafts/Sent toggles. `run-summary.json` records `emails` 1280 as `status: ok` with finalUrl `/en/emails`. Loop-001's 1280 failure was a capture-script artifact, as anticipated.
- **[H2 single 56rem column with empty space at 1440/1920]** — `[STILL]`. At 1920 the panel is still capped near 56rem and ~40% of the viewport is blank to the right. `getResponsiveDetailGridClass(false, "comfortable")` not yet relaxed.
- **[M1 toasts duplicate (4)]** — `[FIXED]`. Loop-003 B2 dedupe is observably working — only 2 unique toasts ("Could not load jobs" + "Could not load drafts") appear at all three widths instead of the previous 4.
- **[M2 template cards diverge from documents/bank cards]** — `[STILL]`. Cards still bespoke; not lifted to a shared `<SelectableCard />`.
- **[M3 "Drafts (0) / Sent (0)" uninformative counts in the same panel header row]** — `[STILL]`. Counts still rendered as `(0)`.
- **[M4 no empty state for missing templates]** — `[STILL]`. Still relies on hardcoded `TEMPLATE_ORDER` with no fallback.

## Findings

### High

- **[H1]** (Loop-001 H2) Page caps at ~56rem at 1440 and 1920, leaving large dead space on the right. `getResponsiveDetailGridClass(false, "comfortable")` in `apps/web/src/app/[locale]/(app)/shared-layout-utils.ts:6` still resolves to `lg:grid-cols-[minmax(0,56rem)]`. At 1920 the templates panel ends ~960px in; right half is empty. Either widen the no-detail layout or push template cards to 4 columns at xl. Width: 1440, 1920.

### Medium

- **[M1]** (Loop-001 M2) Template cards still diverge from documents/bank `<Card>` primitives — different radius/padding/selected-state. Lift to shared `<SelectableCard />`. Width: all.
- **[M2]** (Loop-001 M3) `Drafts (0) / Sent (0)` counts in the panel header are visual noise. Hide-when-zero or use icon-only badge. Width: all.
- **[M3]** (Loop-001 M4) No empty state for "no templates" / "loading templates". Width: all.

### Low

- **[L1]** (Loop-001 L1) "Email Templates" header takes ~120px of vertical space with only title + sub. Asymmetric vs. calendar (similar height, 4 actions). Width: all.
- **[L2]** (Loop-001 L2) Extension-promo sidebar card still stacks at the same horizontal anchor as the toast pair at 1440/1920. Width: 1440, 1920.

## Cross-cutting observations

- Loop-003 toast dedupe is also observable here — same 4→2 reduction pattern as interview. The remaining two toasts no longer occlude the templates content.
- The 56rem cap on `getResponsiveDetailGridClass` is the highest-leverage shared fix: it controls width on emails, salary calculator, and any other no-detail panel. A `wide` variant or a "fill remaining viewport" mode would resolve emails H1, salary M3, and likely future no-detail pages in one change.

## Console / runtime

- 3x `/api/opportunities` and `/api/email/*` 500s per width (dev expected); surfaced as 2 deduped toasts.
