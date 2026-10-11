# Loop 005 — Audit

**Routes covered:** `/calendar`, `/settings`, `/salary`, `/emails` at 1280px
light (this time with real data hydrated, unlike the loop-004 skeleton capture).

## Methodology

Re-captured all four routes after restarting the dev server. Calendar still
renders skeleton placeholders (no events in dev DB) — accepting as-is.

## Findings (ranked)

### HIGH — Salary panel h2s render in body sans

`apps/web/src/app/[locale]/(app)/salary/page.tsx` has three inline h2s outside
the shared primitives:

- Line 410 — `<h2 className="font-semibold mb-6">Market Salary Range</h2>` —
  the result panel's title.
- Line 563 — h2 inside the Offer comparison panel.
- Line 739 — `<h2 className="font-semibold">Your Negotiation Script</h2>` —
  Negotiate-tab title.

Plus the salary "Market Rate Calculator" panel itself goes through
`PagePanelHeader` (already editorial via loop-001), so we're left with these
three inline h2s as the holdouts. All single-class fixes.

### HIGH — Settings BYOK benefit cards use body-sans h3

`apps/web/src/components/settings/byok-explainer.tsx:50` renders the three
benefit-card titles ("Free on hosted", "Any provider", "Encrypted at rest") as
`<h3 className="text-sm font-medium">{title}</h3>`. Three card heads, one
component definition — single edit reaches all three on /settings.

### MEDIUM — Emails Preview panel h2 inline

`apps/web/src/app/[locale]/(app)/emails/page.tsx:911` — `<h2 className="font-semibold">Preview</h2>`. Single inline h2 instance; same fix shape.

### MEDIUM — Salary stat values still in body sans

Lines 429, 437, 445, 627 — `text-lg|text-xl font-bold text-<warning|success|info>`
for the salary range min / mid / max + offer total. Same pattern as analytics
loop-004; deserves the display swap. Bundling into this loop.

### LOW — Calendar still skeleton

Dev DB has no events, so we get shimmer placeholders. Not actionable from a
typography pass — accept.

### LOW — Settings AI Provider grid card titles

`/settings` AI Provider list shows Ollama / OpenAI / Anthropic / OpenRouter
cards. Their titles render fine — they're functional brand labels, not
editorial headings. Skip.

## Fix plan for this loop

1. Salary h2 line 410 "Market Salary Range" → `font-display tracking-tight`.
2. Salary h2 line 563 → `font-display tracking-tight`.
3. Salary h2 line 739 "Your Negotiation Script" → `font-display tracking-tight`.
4. Emails preview h2 line 911 → `font-display tracking-tight`.
5. BYOK BenefitCard h3 (`byok-explainer.tsx:50`) → `font-display tracking-tight`.
6. Salary stat values lines 429, 437, 445, 627 → add `font-display tracking-tight`
   to the four `text-lg|text-xl font-bold text-<color>` lines. Use surgical
   edits (the color modifier differs so `replace_all` won't catch them all).

Six edits across three files. All single-class adds. No new utilities.
