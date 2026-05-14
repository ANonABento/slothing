# Loop 007 — Audit

**Routes covered:** `/opportunities/review`, `/answer-bank` at 1280px light.

## Methodology

Two new captures of secondary in-app surfaces I haven't deep-audited yet.
Both already render with sidebar mono labels and PageHeader display font
(from loop-001) but have inline h1/h2/value spans that opt out of the
shared primitives.

## Findings (ranked)

### HIGH — Review queue inline headings + remaining counter

`apps/web/src/components/opportunities/review-queue.tsx`:
- Line 205 — `<h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>`.
- Line 210 — `<p className="text-3xl font-bold text-primary">{remainingCount}</p>`
  (the large "7 remaining" counter on the right).
- Line 258 — `<h2 className="text-3xl font-bold leading-tight">{activeJob.title}</h2>`
  (the role title rendered atop the focused card; the biggest piece of
  typography on the page).

All three lack `font-display`. Adding it gives the page editorial cohesion.

### HIGH — Answer Bank stat + entry headings

`apps/web/src/app/[locale]/(app)/answer-bank/page.tsx`:
- Line 772 — `<p className="mt-1 text-2xl font-semibold">{value}</p>` (the
  `AnswerStat` value — three of these for Saved answers / Known sources /
  Autofill uses).
- Line 857 — `<h2 className="text-base font-semibold leading-6">{entry.question}</h2>`
  (per-entry question heading inside the entry list).

Same pattern as prior loops; single-class additions.

### LOW — Review queue card "Apply / Dismiss / Save" buttons

Already rendering with the Slothing primary/outline button system from
prior loops. Looks fine.

## Fix plan for this loop

1. `review-queue.tsx:205` h1 → `font-display tracking-tight`.
2. `review-queue.tsx:210` remaining count → `font-display tracking-tight`.
3. `review-queue.tsx:258` role title h2 → `font-display tracking-tight`.
4. `answer-bank/page.tsx:772` AnswerStat value → `font-display tracking-tight`.
5. `answer-bank/page.tsx:857` entry h2 → `font-display tracking-tight`.

Five single-class edits across two files.
