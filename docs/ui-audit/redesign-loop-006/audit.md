# Loop 006 — Audit

**Routes covered:** `/profile`, `/sign-in`, plus the SidebarExtensionCard
visible on every authed page.

## Methodology

Captured /profile + /sign-in at 1280px light. Sign-in renders the
`AuthDisabledCard` state (no Google OAuth env vars in this dev env).

## Findings (ranked)

### HIGH — shadcn `CardTitle` opts out of editorial typography

`apps/web/src/components/ui/card.tsx:38`:
```tsx
className={cn(
  "text-2xl font-semibold leading-none [letter-spacing:var(--letter-spacing)] [text-transform:var(--text-transform)]",
  className,
)}
```
`CardTitle` is the shadcn primitive used as the H3 inside a `<Card>` block.
Currently no display font, no editorial letter-spacing. The 8 callers in this
repo include:
- `/profile` page (the "Let's set up your profile" hero h3).
- `/sign-in` page (both `AuthDisabledCard` and `SignInCard` use it).
- Profile completeness card, profile-empty-state, tailor gap-analysis and
  preview, streak lifetime-stats card.

Adding `font-display tracking-tight` here is the same kind of high-leverage
single-class edit that loop-001's `PageHeader` swap was — eight surfaces light
up at once.

### MEDIUM — SidebarExtensionCard "Capture jobs from any site →" title

`apps/web/src/components/layout/sidebar-extension-card.tsx:54` — the call-to-action
title inside the sidebar promo card is `text-sm font-semibold`. Single-class
add to bring it under the editorial system.

### LOW — Sidebar bottom card border weight (carry-over from loop-003)

`border-primary/20 bg-primary/5` is actually fine on the cream system —
primary is ink, so it renders as a soft ink-tinted card. Closing as
"accept current state" rather than chasing a tweak.

### LOW — Studio save-status pill placement (carry-over)

Same call as loop-003: keep as-is. Visual weight is calm enough.

### LOW — Sign-in `AuthBrandLink` uses `gradient-text`

Same one as the sidebar brand. Renders as a subtle ink→rust gradient on
cream — editorial-appropriate. Keep.

## Fix plan for this loop

1. `card.tsx:38` `CardTitle` — add `font-display tracking-tight`.
2. `sidebar-extension-card.tsx:54` title — add `font-display tracking-tight`.

Two edits — small loop because the first one is so high-leverage that I want
to avoid stacking other risks alongside it. Profile, sign-in, profile
completeness, tailor surfaces, streak surfaces all light up at once.
