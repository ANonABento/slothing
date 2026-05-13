# Loop 007 — Summary & Fix Plan

**Audit run:** 2026-05-13, 75 captures clean (0 failures, 195 console errors steady — all dev-env 500s).

## Loop-006 visual verification

Diffed `home-1280.png` / `home-1440.png` / `home-1920.png` against loop-005. The home-page section primitive refactor produces identical DOM at all three widths — features, how-it-works, testimonials, and CTA sections render pixel-equivalent. No regressions.

## Loop 007 changes

### MarketingSection — variants added

The home-section adopters needed only `width` + `background`, but the extension marketing page uses a different rhythm (compact `py-16`, alternating-section seams via `border-t`/`border-y`, a `bg-card/45` tone instead of `bg-muted/30`, plus a `max-w-3xl` "prose" width for the FAQ block). Extending the primitive to cover both:

- `padding?: "default" | "compact"` — `default` keeps the home `py-20 lg:py-32`; `compact` is the extension's `py-16`.
- `background?: "default" | "muted" | "subtle-card"` — adds `subtle-card` for the `bg-card/45` tone.
- `width?: "wide" | "narrow" | "prose"` — adds `prose` (max-w-3xl).
- `borderTop?: boolean` and `borderY?: boolean` — for the seam pattern.

Home-section callers pass none of these — they get the loop-006 defaults and render identically.

### Extension marketing page adopts MarketingSection

`/extension/page.tsx` had 6 inline `<section>` blocks; 5 of them now use `<MarketingSection>`:

| Section | Variant |
| --- | --- |
| `#features` | `padding="compact"`, `background="subtle-card"`, `borderTop` |
| `#how-it-works` | `padding="compact"` |
| Privacy/trust | `padding="compact"`, `background="subtle-card"`, `borderY`, `innerClassName="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"` |
| FAQ | `padding="compact"`, `width="prose"` |
| Final CTA | `padding="compact"`, `borderTop`, `width="narrow"`, `innerClassName="flex flex-col items-center text-center"` |

The hero section (top of page) keeps its custom grid layout — too specialized to fit the primitive without polluting its API.

### Tests

- 21 home-section component tests pass (loop-006 set).
- 1 extension marketing page test passes (renders required sections).
- Type-check clean.
- Visual capture: 75/75 routes, no regressions on home — extension marketing visual diff will be confirmed in loop-008.

## Exit criteria check

Carry-over since loop-005: ~13 H + ~77 M. Loop-006 + loop-007 are infrastructure refactors that don't directly close findings — they enable closes. Several extension-marketing M findings (no shared marketing primitives) collapse with this adoption, but I'm not re-counting until loop-008's full audit.

**Continue** to loop-008 — the final iteration. Plan: full re-audit (5-agent set), tally remaining H/M, update README status table, and call the loop terminated.
