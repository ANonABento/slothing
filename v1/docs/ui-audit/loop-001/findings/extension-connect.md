# `extension-connect` — `/en/extension/connect`

**Source:** `apps/web/src/app/[locale]/(app)/extension/connect/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/extension-connect-1280.png`
- 1440: `../screenshots/extension-connect-1440.png`
- 1920: `../screenshots/extension-connect-1920.png`

## Findings

### High

- _(none)_

### Medium

- **[M1]** Connection-trust page renders inside the full app shell — sidebar, "Capture jobs from any site" promo card, profile dropdown all visible. This is an OAuth/extension-handshake page; the user lands here from a separate browser tab opened by the extension. Showing the full app chrome dilutes the trust signal (compare to typical OAuth callback pages which are minimal-chrome). The page lives at `apps/web/src/app/[locale]/(app)/extension/connect/page.tsx` under the `(app)` layout segment, which forces the sidebar. Consider moving it under `(marketing)` or a dedicated `(handshake)` segment. Width: 1280, 1440, 1920.

- **[M2]** Error-state "Connection failed / Slothing servers are having a problem" leaves the user with one actionable button (Try Again) and one secondary link ("Install it"). Missing: contact / status page link, or "If this keeps happening" guidance. The card is the only thing on the page, so adding a small footer line is cheap. Cite `apps/web/src/app/[locale]/(app)/extension/connect/page.tsx:198-209`. Width: all.

- **[M3]** `messageForStatus(500)` returns "Slothing servers are having a problem. Please try again in a minute." This is the captured error in all three screenshots. The transient 500 in dev is expected (skipped per audit rules), but the rendered card is the only state shown — there is no clear visual difference between a successfully-loaded "connecting…" state and the error state's red icon-on-white card. Both are centered in the same `CenteredPagePanel`. The success state (`CheckCircle h-12 w-12 text-success`) and error state (`AlertCircle h-12 w-12 text-destructive`) are tonally similar; rely entirely on color which is an a11y concern. Add a clearly-different shape or stronger text affordance. Width: all (error).

### Low

- **[L1]** Card width fixed at `max-w-md` (`apps/web/src/components/ui/page-layout.tsx:163` via `<CenteredPagePanel>`). At 1920 the card sits noticeably to the right of true center because the sidebar takes ~200px and `narrow` width centers within remaining space. Visually feels off-center. Consider centering relative to the viewport on this specific page (another reason to extract from `(app)`). Width: 1920.

- **[L2]** Chrome icon sized at `h-7 w-7` inside a `h-14 w-14` tile, with the icon-tile using `bg-primary/10` then a 12-px outline `AlertCircle` underneath. Two different "icon containers" stacked. Width: all.

- **[L3]** "Try Again" button is a default primary button; "Close tab" (success state) is `variant="outline"`. Different shapes for terminal actions; either both should be primary or both outline. Width: success/error states.

## Cross-cutting observations

- **`(app)` segment leakage onto a "single-purpose" page** — extension/connect is a flow page that shouldn't carry the app sidebar. The same critique would apply to any future "first-mile" or "device pairing" pages added under `(app)`.
- **`CenteredPagePanel` is the right primitive** for this kind of page — it's reused well here. The remaining issue is the surrounding layout segment, not the panel itself.
- **Status icon color-only differentiation** (success/destructive) is a small a11y issue that may exist on other terminal-state UI (`InterviewSummary`, salary script success copy) — worth a global pass.

## Console / runtime

- `/api/extension/auth` 500 in dev → drives the captured error state. Skipped per audit rules.
- No client-side console errors observed in the screenshots.
