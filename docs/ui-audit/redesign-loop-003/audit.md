# Loop 003 — Audit

**Routes covered:** `/bank`, `/profile`, `/opportunities` at 1280px light.
**Carry-over from loop-002:** still chasing components that bypass shared
primitives + cleaning up affordance treatments where the editorial signal is
muddled.

## Methodology

Screenshots captured for /bank and /profile at 1280px light; reused the
loop-001 opportunities + dashboard captures for the cross-page checks. Both
new routes look noticeably more editorial than baseline thanks to the loop-001
PageHeader sweep + the sidebar mono swap (visible top-left in both shots).

## Findings (ranked)

### HIGH — StandardEmptyState reads as a drop-zone, not a paper card

`apps/web/src/components/ui/page-layout.tsx:396`:
```tsx
"flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 p-8 text-center"
```
The dashed border + 50% card-ghost bg is a generic Tailwind "drop something
here" pattern. On the editorial cream system it reads as "this UI is
incomplete." Swap to a solid border on a proper paper card (`border bg-paper`).
Used everywhere an empty state renders — bank, opportunities, etc.

### HIGH — Bank section group headings opt out of editorial typography

Three h2/h3 instances in `/bank` skip the shared primitives:

- `bank/page.tsx:1677` — `<h2 className="text-lg font-semibold mb-1 flex …">`
  (source-grouped entries header — e.g. filename of uploaded doc).
- `bank/page.tsx:1708` — same shape, category-grouped variant.
- `bank/page.tsx:2348` — review-component h3 (`text-lg font-semibold`).
- `bank/page.tsx:2262` — "Detected components" caption (`text-sm font-semibold`).

### HIGH — Bank "Review component" eyebrow uses body sans, not mono

`bank/page.tsx:2345`:
```tsx
<p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
  Review component
</p>
```
Same eyebrow pattern as loop-002's "Start here" / "Suggested rewrites" — should
be `font-mono tracking-[0.16em]`, drop `font-medium` (medium reads heavy on
mono captions, and Geist-medium uppercase here was already fighting the
caption rhythm).

### MEDIUM — Studio save-status pill placement (carry-over from loop-002)

Still reads as "pinned to the Export button's right elbow." Verdict: not a
single-class fix. Would need either a margin tweak that diverges from the
parent's `gap-2` rhythm or a small reorder. Leaving as carry-over; the visual
weight of the success-green pill is calm enough that it's a low-urgency item.

### LOW — Opportunities filter summary row prose

`opportunities/page.tsx:741` renders the count summary as prose
("Showing 1 · Jobs 1 · Hackathons 0 · Pending 1"). Mono caption would feel
correct stylistically but harder to scan at this density. Keep prose.

## Fix plan for this loop

1. `StandardEmptyState`: drop `border-dashed bg-card/50`, switch to solid
   `border bg-paper` for a calm editorial paper card.
2. `bank/page.tsx:1677` h2 — `font-display tracking-tight`.
3. `bank/page.tsx:1708` h2 — `font-display tracking-tight`.
4. `bank/page.tsx:2348` h3 — `font-display tracking-tight`.
5. `bank/page.tsx:2262` "Detected components" caption — `font-display tracking-tight`.
6. `bank/page.tsx:2345` "Review component" eyebrow — swap `font-medium uppercase tracking-normal` → `font-mono uppercase tracking-[0.16em]`.

Six edits across two files. All single class-list adjustments. No new
utilities, no token edits.

## Out of scope this loop

- Studio save-status placement (defer).
- Profile, settings, calendar, salary, emails, analytics — loop-004+.
- The dev-environment toast at bottom-left ("X errors") — that's the error
  notification dock, not styling for the calm-page surfaces.
