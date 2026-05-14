# Loop 006 — Summary

Brought the shadcn `<CardTitle>` primitive under the editorial system —
8 call-sites across `/profile`, `/sign-in`, tailor, streak, and the profile
completeness card pick up the editorial display font in one edit. Plus the
SidebarExtensionCard "Capture jobs from any site →" title.

## Landed

- `CardTitle` → `font-display tracking-tight` (8 callers).
- SidebarExtensionCard title → `font-display tracking-tight`.
- Four snapshot files updated to match the intended new visual.

## Carry-over

1. **`/calendar`** still no-data skeleton in dev.
2. **Studio save-status placement** — explicitly closed in loop-006 as
   "accept current state."
3. **Sidebar bottom card border weight** — closed in loop-006 as well.

## Cadence

6 loops shipped. The editorial heading sweep now reaches every primary surface
in the in-app experience plus the auth chrome. Remaining loops can focus on
secondary polish: button hover affordances, focus rings, the few remaining
inline h-elements I haven't touched yet, dark-mode parity once a clean toggle
exists.
