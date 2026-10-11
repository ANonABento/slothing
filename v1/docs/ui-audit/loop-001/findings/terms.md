# `terms` — `/en/terms`

**Source:** `apps/web/src/app/[locale]/terms/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/terms-1280.png`
- 1440: `../screenshots/terms-1440.png`
- 1920: `../screenshots/terms-1920.png`

## Findings

### High

- **[H1]** Same root cause as Privacy: page renders with **no navbar and no footer**. `terms/` lives at `apps/web/src/app/[locale]/terms/` (sibling of `(marketing)/`, not under it) and inherits only `[locale]/layout.tsx` which has no chrome. Only nav is `<Link href="/">Back to home</Link>` at the top (`terms/page.tsx:13-18`). Users landing here have no way to reach Privacy, Pricing, Sign-in, or anywhere else without a back-button click. Width: all.
- **[H2]** Marketing footer's "Legal" links in `(marketing)/components/footer.tsx:14-18` point to both `/privacy` and `/terms` — clicking them strips all chrome. Same cross-route regression flagged on the Privacy findings; consolidated here to keep counts honest. Width: all.

### Medium

- **[M1]** "Pre-launch draft" callout uses `border-warning/40 bg-warning/10 ... text-foreground` (`terms/page.tsx:27`) — a bespoke alert style. The pricing page's "Hosted billing is live" callout uses `border-primary/30 bg-primary/5 ... ` (`pricing/page.tsx:497`). Two near-identical callout intents, two styles. Width: all.
- **[M2]** Content cap at `max-w-3xl` (`terms/page.tsx:11`) — same stranded-at-1920 problem as Privacy. Width: 1440, 1920.
- **[M3]** Pre-launch "TBD" governing-law and disputes sections (`terms/page.tsx:205-240`) are visually indistinguishable from the rest of the document. Given the bright "Pre-launch draft" warning at the top, these unresolved sections probably deserve their own subtle visual marker (e.g., a "Draft" pill or a different left-border accent), not just inline mention. Cosmetic. Width: all.

### Low

- **[L1]** "Back to home" link lacks an arrow icon — same nit as Privacy. Width: all.
- **[L2]** No table-of-contents; long document benefits from a sticky TOC at lg+. Width: 1440, 1920.
- **[L3]** "Last updated: May 11, 2026." string is hardcoded (`terms/page.tsx:23`) — should come from a single config (same string also on Privacy). Width: all.

## Cross-cutting observations

- **Privacy + Terms route group placement bug.** Both routes live outside `(marketing)/` so they don't get the marketing `Navbar`/`Footer`. This is the highest-impact finding from the audit: easy single-PR fix (move directories or update layout), big visible impact across two routes. See `privacy.md` cross-cutting note for details.
- **`max-w-3xl` prose container is identical between privacy and terms** — same `mx-auto max-w-3xl px-6 py-16` outer + same `space-y-8 text-sm leading-7 text-muted-foreground` inner. Strong candidate for a shared `<LegalPage title="…" lastUpdated="…">` wrapper or just a `<MarketingProse>` shell that both pages compose.
- **`<a href="mailto:support@slothing.work">` repeated ~7 times across this file alone.** Could be a `<SupportEmail>` component (and would let us swap the support address centrally).

## Console / runtime

(None observed.)
