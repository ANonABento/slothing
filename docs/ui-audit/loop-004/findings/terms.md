# `terms` — `/en/terms`

**Source:** `apps/web/src/app/[locale]/(marketing)/terms/page.tsx` (moved into `(marketing)` per loop-002 A2 fix)
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/terms-1280.png`
- 1440: `../screenshots/terms-1440.png`
- 1920: `../screenshots/terms-1920.png`

## Findings

### High

- **[H1]** [FIXED] Marketing navbar + footer now render — same fix as Privacy. Visible across all 3 widths.
- **[H2]** [FIXED] Footer "Legal" links into Terms no longer strip chrome.

### Medium

- **[M1]** [STILL] "Pre-launch draft" callout still uses `border-warning/40 bg-warning/10` whereas pricing's "Hosted billing is live" callout uses `border-primary/30 bg-primary/5`. Two near-identical callout intents, two styles. Shared `<Callout>` primitive still missing.
- **[M2]** [STILL] `max-w-3xl` content cap still leaves whitespace at 1920 (less acute now that navbar/footer anchor the page).
- **[M3]** [STILL] Pre-launch "TBD" sections (governing law, disputes) still visually indistinguishable from the rest of the document despite the page-level draft warning.

### Low

- **[L1]** [STILL] "Back to home" link still lacks an arrow icon (and is now redundant given the marketing navbar — same nit as Privacy).
- **[L2]** [STILL] No table-of-contents for long document.
- **[L3]** [STILL] "Last updated: May 11, 2026" hardcoded; same on Privacy.

## Cross-cutting observations

- Privacy + Terms route-group placement bug fully fixed.
- `<LegalPage>` / `<MarketingProse>` shared shell still outstanding — both pages share identical wrappers and prose styling.
- `<SupportEmail>` extraction still outstanding.

## Console / runtime

(0 console errors at all 3 widths.)
