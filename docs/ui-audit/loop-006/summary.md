# Loop 006 — Summary & Fix Plan

**Audit cycle:** Lighter iteration that skips re-capture before fixes. Type-check + the 4 affected component tests (21 tests) verify the refactor; loop-007 will re-capture and visually verify the layout matches.

## C3 Marketing primitives extraction (shipped this loop)

Introduces two shared primitives at `apps/web/src/components/marketing/section.tsx`:

- `<MarketingSection id? width? background? innerClassName? className?>` — wraps the duplicated `<section py-20 lg:py-32><div max-w-Nxl mx-auto px-6>` chrome. `width="wide"` (6xl) is the default; `width="narrow"` (4xl) is for CTA-style blocks. `background="muted"` adds `bg-muted/30`.
- `<MarketingSectionHeader eyebrow? title description? align?>` — wraps the duplicated `<div text-center max-w-2xl mx-auto mb-16>` eyebrow + h2 + lead pattern. `eyebrow` and `title` accept ReactNode so each section keeps its own pill style (features uses solid primary tint, how-it-works uses soft primary border) and the title can include the `<span className="gradient-text">` segment.

Adopted on the four home-page section components:

| File | Before | After |
| --- | --- | --- |
| `features.tsx` | 16 lines of inline section/header chrome | `<MarketingSection>` + `<MarketingSectionHeader>` |
| `how-it-works.tsx` | 16 lines (with `bg-muted/30` + bordered eyebrow) | `<MarketingSection background="muted">` + `<MarketingSectionHeader>` |
| `testimonials.tsx` | 16 lines | `<MarketingSection>` + `<MarketingSectionHeader>` |
| `cta-section.tsx` | 4 lines (no header — has its own dual-card body) | `<MarketingSection width="narrow" background="muted">` |

No visual changes expected — the primitive renders the same DOM the inline code did. Tests pass (21/21 across the 4 component test files), type-check clean.

## Not adopted yet (deferred to next iteration)

- **hero.tsx** — uses a completely different structure (split-screen with mock app preview). Not a fit for `MarketingSection`.
- **`/extension/page.tsx`** — has its own custom hero + multiple unique section layouts. Migration would close several extension-marketing M findings but needs a targeted pass.
- **`/pricing/page.tsx`** — 524 lines, multiple custom sections. Worth its own loop given complexity.
- **`/ats-scanner/page.tsx`** — uses raw `<div className="py-16 px-4">` wrapper; doesn't quite fit `MarketingSection`'s 20/32 padding. Could add a `padding="compact"` variant or just leave.
- **`/vs/{page,competitor}/page.tsx`** — comparator pages have their own hero + tabular comparison layouts.

## Exit criteria check

Carry-over post-loop-005: ~13 H + ~77 M. Loop-006 doesn't directly close M findings (primitives are infrastructure for future closes), but unblocks the next several iterations to start collapsing per-page chrome onto the shared layer.

**Continue** to loop-007. Priority: rebuild + re-capture to visually confirm the four home sections render identically; then expand primitive adoption to `extension/page.tsx`.
