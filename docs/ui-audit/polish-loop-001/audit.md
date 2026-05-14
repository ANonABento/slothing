# polish-loop-001 — Audit

## Capture summary

- Captured 43 routes initially (1280/1440), 12 target re-captures (1280/1440/1920)
  after fixes landed. Re-captured emails, applications, pricing once the dev
  server stabilised.
- 0 non-OK responses on the final pass.
- Console issues per route are mostly dev-env 500s from missing API keys (LLM
  providers + NextAuth disabled). Out of scope per goal doc.

## Starting-evidence findings

Severity rubric: High = broken or visibly degrades the page; Medium =
inconsistency or readability tax; Low = polish.

### S-H1 [High] — Opportunity list JD wall-of-text
- **Where:** `apps/web/src/app/[locale]/(app)/opportunities/page.tsx:1124` —
  `<p className="max-w-prose text-sm leading-6 text-muted-foreground">{opportunity.summary}</p>`.
- **What:** Long job descriptions render in full inside `OpportunityRow`, so a
  single card can dominate the entire viewport vertically. The list becomes
  unreadable when one role's JD is 2,000+ characters.
- **Fix vector:** Add `line-clamp-3` to the summary paragraph. The card title
  already links to `/opportunities/[id]` (line 1112) — full JD lives there.

### S-H2 [High] — Toast surface bleeds page content through
- **Where:** `apps/web/src/components/ui/toast.tsx:112-117` — toast styles
  `bg-{type}/10` (10% alpha) over `[backdrop-filter:var(--backdrop-blur)]`.
- **What:** When two toasts stack, the page content (cards/text) shows through
  both surfaces, creating the visual illusion that they overlap. They don't —
  the container is `flex flex-col gap-2` — but the transparency makes them
  appear collision-y and unreadable.
- **Fix vector:** Switch surface to `bg-card` with a slightly stronger tinted
  ring (`border-{type}/40`). Solid surface + restrained ring matches the
  editorial paper-card system.

### S-H3 [High] — Studio "Saved Just now" pill wraps to two lines
- **Where:** `apps/web/src/components/studio/studio-header.tsx:468-486`.
- **What:** At ~900–1024px (and inside a constrained Studio layout) the
  inline-flex pill wraps "Saved Just now" to two lines because the span has no
  `whitespace-nowrap`. Looks broken.
- **Fix vector:** Add `whitespace-nowrap` to the pill span.

### S-M1 [Medium] — Studio "Document Studio" H1 wraps
- **Where:** `apps/web/src/components/studio/studio-header.tsx:242-244`.
- **What:** At narrow viewports the H1 inherits the flex-wrap header and breaks
  to two lines: "Document" / "Studio". Visually crowded.
- **Fix vector:** `whitespace-nowrap` on the H1. The surrounding `min-w-0`
  wrapper already permits truncation if absolute overflow ever happens.

### S-M2 [Medium] — Dashboard Home icon tile reads outsized
- **Where:** `apps/web/src/components/ui/page-layout.tsx:282-301` — every
  `PageHeader` uses `h-10 w-10` with an `h-5 w-5` glyph.
- **What:** Next to a short H1 like "Dashboard" the rust-tinted 40×40 tile
  competes with the title for visual weight. Same primitive is used across the
  app, so the fix is one place.
- **Fix vector:** Drop the `md` default to `h-9 w-9` (36×36). Glyph stays
  `h-5 w-5` so it reads as more breathing room around the icon. Visible
  improvement on dashboard and quieter overall.

### S-L1 [Low] — Studio "Rewrite section" select vs. icon button height
- **Where:** `apps/web/src/components/studio/ai-assistant-panel.tsx:798-836`.
- **What:** The Select trigger appears slightly taller than the icon button in
  the right rail at the 1280 capture. Visual not broken — just a hair
  off-axis. Pure low priority.
- **Fix vector:** Deferred to a later loop (small affordance polish bundle).
  Re-verify when the capture isn't covered by the bigger fixes above.

## Broader sweep — additional findings

### G-L1 [Low] — Capture/dev hot-reload races during multi-route capture
- **Where:** `apps/web/scripts/ui-audit/capture.mjs`.
- **What:** When a hot-reload happens mid-capture, the script will get an empty
  page (saved as `<slug>-<width>-error.png`). Cosmetic for this loop;
  re-capturing the affected routes resolved it.
- **Fix vector:** None this loop. Documented for future maintainers.

## Routes scanned (clean — no new H/M findings beyond above)

- `/dashboard` (post-fix capture): icon tile rebalanced; otherwise polished.
- `/profile`: empty state intact, hero spacing consistent.
- `/bank` (renders as Documents page): empty state polished, CTAs clear.
- `/answer-bank`: page header consistent.
- `/analytics`: stat tiles, pipeline list, skills overview all readable.
- `/salary`: tool tabs + calculator card balanced.
- `/calendar`: month grid + event list aligned.
- `/emails`: template grid balanced (after re-capture).
- `/interview`: practice cards grid balanced.
- `/opportunities/review`: card detail readable; tech-stack chips, decision
  buttons (Dismiss/Apply/Save) at the footer feel right.
- `/settings`: BYOK + provider grid consistent.

## Console signature triage

Almost every route logs:
```
Failed to <fetch>: 500 ... (LLM / NextAuth env missing)
```

These are dev-env data noise per the goal doc. No new error signatures
discovered. **Out of scope.**

## Severity counts

| Severity | Count |
| -------- | ----- |
| High     | 3 (S-H1, S-H2, S-H3) |
| Medium   | 2 (S-M1, S-M2) |
| Low      | 2 (S-L1, G-L1) |

## Tier plan

**Tier A — ship this loop:**
- S-H1 — line-clamp opportunity summary.
- S-H2 — toast surface fix.
- S-H3 — save-status pill nowrap.
- S-M1 — Studio H1 nowrap.
- S-M2 — PageIconTile size shrink.

**Tier B — deferred:**
- S-L1 — AI panel select-vs-icon alignment. Bundle with affordance polish in
  polish-loop-002.

**Tier C — deferred:**
- G-L1 — capture race. Tooling polish, not user-facing.
