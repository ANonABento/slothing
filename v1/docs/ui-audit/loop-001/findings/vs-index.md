# `vs-index` — `/en/vs`

**Source:** `apps/web/src/app/[locale]/(marketing)/vs/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/vs-index-1280.png`
- 1440: `../screenshots/vs-index-1440.png`
- 1920: `../screenshots/vs-index-1920.png`

## Findings

### High

- **[H1]** Page is "dead on arrival" feeling — content density is extremely low. The page contains only a hero (title + 1 short paragraph + 1 floating shield icon) and 3 small comparator cards in a single row, and then ~600px of empty whitespace before the footer. At 1920 the entire purpose of the page is "click one of three cards to compare". This is a stub-quality landing page wearing a real-page layout. (`vs/page.tsx:32-69`). Width: all, worst at 1920.
- **[H2]** Locale switcher in marketing navbar is rendering a truncated text label "Engl" inside an icon-sized trigger. Visible clearly on `vs-index-1280.png`, `vs-index-1440.png`, `vs-index-1920.png` next to the "Sign In" link. The compact switcher (`apps/web/src/components/i18n/locale-switcher.tsx:84-103`) sets `<SelectValue className="sr-only" />` and `[&>svg:last-child]:hidden`, but the SelectValue text is leaking through visually inside an `h-11 w-11` square — the result is a clipped "Engl" label. This appears on all marketing routes (the navbar is shared via `(marketing)/layout.tsx:24`); flagged here because vs-index has the most empty space around it, making the bug obvious. Width: all.

### Medium

- **[M1]** Hero shield icon (`<ShieldCheck className="h-10 w-10 text-primary" />`, `vs/page.tsx:38`) sits alone above the title with no badge/eyebrow context. Compare to ATS scanner (icon inside a `bg-primary/10 rounded-2xl` chip) and home (no icon, badge eyebrow). Three routes, three "icon styling" approaches in heroes. Width: all.
- **[M2]** Comparator cards `rounded-lg border p-5` with no `bg-card` (`vs/page.tsx:52`). Other marketing cards on the same site use `rounded-2xl border bg-card p-6`. These cards visually disappear into the page background — they have no fill at all. Width: all.
- **[M3]** Cards lack a competitor logo / icon / visual differentiator. Just title + 1-sentence summary + button. Compared with the home page's feature/outcome cards which have iconified headers, these look unfinished. Width: all.
- **[M4]** No "Slothing wins because…" or comparison preview on the index. The page asks the user to click into a per-competitor page with no preview of what the comparison contains. UX issue, not strictly visual, but causes the dead-page feel. Width: all.

### Low

- **[L1]** `tracking-normal` on the h1 (`vs/page.tsx:39`) is the default — could be omitted. Other marketing h1s use `tracking-tight`. Width: all.
- **[L2]** Hero section uses `border-b bg-card/40` outer wrapper (`vs/page.tsx:35`) — a one-off pattern not used by other marketing routes. Width: all.

## Cross-cutting observations

- **Locale switcher visual bug is global.** All 5 marketing routes (`home`, `pricing`, `ats-scanner`, `extension`, `vs`) use the same `Navbar` with `LocaleSwitcherCompact` — verify whether the "Engl" text leak is a Radix-Select rendering quirk or an actual CSS regression. Hard to see on dense pages, very visible on `vs-index`.
- **Comparator card pattern needs to be a shared `<ComparatorCard>` (or generic `<MarketingCard>`).** If each `vs/[competitor]` route renders comparison-table-style cards, the index page should preview them with the same primitive instead of rolling its own minimal card.
- **Page is a strong candidate for SEO content (long-tail "vs" queries).** Right now there's effectively no content on the index — search engines can crawl 1 paragraph. Consider adding a per-competitor table preview, a feature-checkmark grid, or "Why Slothing" sections.

## Console / runtime

(None observed.)
