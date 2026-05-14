# Loop 001 — Audit

**Routes covered:** `/dashboard`, `/opportunities`, `/studio` (1280px light + dark, + 1920px light).
**Reference:** `/en` landing — same workspace, same theme tokens.

## Methodology

Screenshots captured via Playwright MCP and stored at
`docs/ui-audit/redesign-loop-001/screenshots/`. Light captures use the
slothing preset's default `data-palette="cream" data-accent="rust"`. Dark
captures forced `.dark` on `<html>` after navigation; `next-themes` keeps the
class once added, so the dark-mode shots reflect the same SSR + hydration path
a real toggle would produce.

## Findings (ranked)

### HIGH — editorial typography missing on every app-page heading

The new landing leans on a single editorial signal: the Outfit display font
(700 weight, -0.035em letter-spacing) used on every H1/H2, paired with
JetBrains-mono captions for eyebrows. In `(app)` routes, *zero* headings carry
that signal — they all render in body sans (Geist via system fallback) at body
tracking. The eyebrows likewise default to body sans, not mono.

Concretely:

- **H1-1 — `PageHeader` H1.** `apps/web/src/components/ui/page-layout.tsx:64`
  renders `<h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">`.
  This is the title surface for `/dashboard`, `/opportunities`, `/bank`,
  `/profile`, `/calendar`, `/salary`, `/settings`, `/analytics`, `/emails`,
  `/answer-bank`, `/interview`, `/opportunities/[id]/research` — 12+ routes
  in one place. Missing display font is the single biggest editorial gap.
- **H1-2 — `InsetPageHeader` H1.** Same component file, line 193. Same
  issue, smaller blast radius (legacy pre-PageHeader callers).
- **H2-1 — `PagePanelHeader` h2.** `page-layout.tsx:260` —
  `text-xl font-semibold text-foreground`. Used for inline panel titles
  ("Set up your workspace", "What unlocks next" on the dashboard).
- **H2-2 — `PageSection` h2.** `page-layout.tsx:328` — `font-semibold`. Used
  for section-card wrappers across opportunities, profile, settings.
- **H2-3 — `StandardEmptyState` h2.** `page-layout.tsx:397` —
  `text-lg font-semibold`. Empty states for opportunities, bank, etc.

### HIGH — sidebar group label is body sans, not mono caption

`sidebar.tsx:443` renders nav group labels ("HOME", "DOCUMENTS", "PIPELINE",
"PREP", "REPORTING") with `text-[10px] font-semibold uppercase tracking-normal
text-muted-foreground/70`. The editorial system reserves mono + wider tracking
for these caption-eyebrow patterns ("INSIDE SLOTHING", "01 · KNOWLEDGE BANK").
Same JetBrains Mono is already loaded — adopting `font-mono tracking-[0.16em]`
on the group label is one class swap that lands across every app page.

### MEDIUM — Studio header doesn't use PageHeader

The Document Studio shell renders its own header (`/studio` screenshot, top-left
"Document Studio" + sloth icon). Title is body sans semibold, no display font,
no editorial eyebrow. Fix scope: studio-specific component edit, deferred to
loop-002 so this loop can ship the cross-page heading fix in isolation.

### MEDIUM — dashboard panel descriptions feel cramped

"Start here" eyebrow above "Set up your workspace" is 11px uppercase, tight
tracking, and reads as part of the panel body instead of separating it. Would
benefit from mono treatment + 0.16em tracking, same as the sidebar group label.
**Defer** — same fix lands when the underlying primitive (likely a custom
eyebrow within the onboarding panel) is mono-fied; better picked up in loop-002
when I'm in the dashboard onboarding component anyway.

### MEDIUM — Studio "Saved Just now" pill at top-right reads as a destructive-looking pill on cream

It's actually a soft success pill, but at 1280px the `Saved Just now` text with
green dot lands very close to the dark `Export` button and visually competes
with it. Defer — Studio loop-002 will look at the save-status pill anyway.

### LOW — `gradient-text` brand wordmark

Sidebar's `Slothing` wordmark uses `gradient-text` (ink → rust 135deg). On the
cream palette this is *actually editorial-appropriate* (subtle warm fade). Not
changing in this loop.

### LOW — dark-mode parity glitch on Studio document canvas

When forcing `.dark` on `<html>` from `/en/studio`, the document preview canvas
flips to indigo paper while the rest of the chrome stays cream. That's because
`next-themes` re-hydrates and removes the manually-added `.dark` class, but the
TipTap canvas snapshot was already painted with `.dark` evaluated. Not a real
production bug — `pnpm dev` reloads with system theme. Skipping.

## Fix plan for this loop

1. `PageHeader` h1: add `font-display tracking-tight`.
2. `InsetPageHeader` h1: same.
3. `PagePanelHeader` h2: add `font-display tracking-tight`.
4. `PageSection` h2: add `font-display tracking-tight`.
5. `StandardEmptyState` h2: add `font-display tracking-tight`.
6. Sidebar group label (`sidebar.tsx:443`): swap `tracking-normal` → `font-mono tracking-[0.16em]` + drop the `font-semibold` (mono looks busy at semibold).

Six single-class edits across two files. No new dependencies, no token edits,
no new utilities. Existing unit tests assert on class *presence* (e.g. `text-3xl`)
not exclusivity — adding `font-display` won't break them.

## Out of scope this loop

- Studio header (defer loop-002).
- Sign-in card branding (auth UI out-of-scope per `docs/ui-redesign-plan.md`).
- New tailwind utilities (will revisit if `tracking-tight` doesn't read close
  enough to the `--display-letter -0.035em` target after capture).
