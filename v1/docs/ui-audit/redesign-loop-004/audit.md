# Loop 004 — Audit

**Routes covered:** `/analytics` (deep), `/calendar`, `/settings`, `/interview`
at 1280px light.
**Note:** `/calendar`, `/settings` rendered as skeleton placeholders during
capture (no data + async hydration). Re-audit in a later loop once data is
present.

## Methodology

Five new captures. Re-used loop-001 dashboard / opportunities / studio shots
for cross-reference.

## Findings (ranked)

### HIGH — Analytics stat values are body-sans bold

`apps/web/src/app/[locale]/(app)/analytics/page.tsx` shows the same
`text-2xl font-bold` class on **seven** stat-value spans:
- 4 main cards: Profile Complete %, Total Opportunities, Interview Sessions,
  Resumes Generated.
- 3 conversion rates: Applied, To Interview, To Offer.

These big numerical values are the focal point of the analytics surface — they
deserve the Outfit display character. Adding `font-display tracking-tight` to
all seven via a single `replace_all` keeps the diff small.

### HIGH — Analytics "Advanced Insights" header + sub-section h3s opt out of editorial

- Line 649 — `<h2 className="text-xl font-bold">Advanced Insights</h2>`.
- Lines 658, 671, 684 — three h3s (`font-semibold mb-4 flex items-center gap-2`):
  Activity Trends, Success Metrics, Skill Development.

All inline `<h2>` / `<h3>` instances; bypass PageSection. Same single-class
swap as prior loops.

### MEDIUM — Interview Preparation card titles look acceptable

Cards on `/interview` render with the editorial PageHeader at top and a
prose-y filter row. Card titles for each role ("Senior Software Engineer",
etc.) read fine in the current sans. Skip unless I get a stronger signal in a
later loop.

### MEDIUM — `/calendar` and `/settings` are skeleton placeholders at capture

The screenshot shows shimmer/skeleton placeholders only. Will need to revisit
with data once we land on these in a future loop — likely loop-005 or 006.

### LOW — Sidebar bottom card (`SidebarExtensionCard`) still reads as muddy on cream

Carry-over from loop-003. Faint cream-on-cream border. Could try
`border-rule-strong` for a touch more definition. Skipping this loop because
the change goes through a separate component file and the visual urgency is
low.

## Fix plan for this loop

1. **`replace_all` `text-2xl font-bold` → `font-display text-2xl font-bold tracking-tight`** in `analytics/page.tsx`. Catches all 7 stat-value spans (4 cards + 3 conversion rates).
2. **`replace_all` `font-semibold mb-4 flex items-center gap-2` → `mb-4 flex items-center gap-2 font-display font-semibold tracking-tight`** in `analytics/page.tsx`. Catches the 3 sub-section h3s.
3. **"Advanced Insights" h2** (line 649) — add `font-display tracking-tight`.
4. **"Conversion Rates" h4** (line 487) — add `font-display tracking-tight`.

Four edits, but two are bulk `replace_all`s that hit 10 lines total. All
single-file. No new utilities.

## Out of scope this loop

- /calendar, /settings, /salary, /emails — re-audit once they render real data.
- Sidebar bottom card border weight (carry-over).
- Studio save-status placement (still carry-over).
