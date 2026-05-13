# `privacy` — `/en/privacy`

**Source:** `apps/web/src/app/[locale]/privacy/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/privacy-1280.png`
- 1440: `../screenshots/privacy-1440.png`
- 1920: `../screenshots/privacy-1920.png`

## Findings

### High

- **[H1]** Page renders with **no navbar and no footer**. Privacy/terms routes live at `apps/web/src/app/[locale]/privacy/` (not under `(marketing)`) so they inherit only the root `[locale]/layout.tsx` (`apps/web/src/app/[locale]/layout.tsx`) which provides no chrome. The only navigation is a single `<Link href="/">Back to home</Link>` at the top of the document (`privacy/page.tsx:13-18`). Users landing here from a search engine or a footer link have no way to discover Slothing's product, pricing, sign-in, locale switching, or legal sibling page (Terms). This is a serious cross-marketing UX regression and likely an unintended consequence of the route living outside `(marketing)`. Width: all.
- **[H2]** Footer links from marketing pages (`apps/web/src/app/[locale]/(marketing)/components/footer.tsx:14-18`) point to `/privacy` and `/terms` — clicking them effectively "exits" the marketing chrome. The user gets stripped of the navbar/footer mid-flow. Width: all.

### Medium

- **[M1]** Content cap at `max-w-3xl` (`privacy/page.tsx:11`) is reasonable for prose, but at 1920 leaves ~1150px of unbalanced whitespace because there's no wider hero or footer to anchor the page. Without surrounding chrome the page looks like a Notion export. Width: 1440, 1920.
- **[M2]** No locale switcher means users on Spanish/Chinese/etc. locales who land on `/en/privacy` cannot switch to their language version even if it exists. Width: all.
- **[M3]** No `Last updated` versioning UI beyond a single static date paragraph (`privacy/page.tsx:22-24`); compare to a typical SaaS privacy page which links to a change-log. Cosmetic. Width: all.

### Low

- **[L1]** Section structure is just sequential `<h2>` + `<p>` pairs (`privacy/page.tsx:28-200`). Could use a sticky table-of-contents at lg+ for skimmability. Width: 1440, 1920.
- **[L2]** "Back to home" link sits at the very top without an icon or `< Back` chevron. Other "back" links across the app use `<ArrowLeft className="h-4 w-4" />`. Width: all.

## Cross-cutting observations

- **Privacy + Terms are missing the marketing layout entirely.** Both `privacy/page.tsx:9-203` and `terms/page.tsx:8-244` wrap themselves in `<main className="min-h-screen bg-background">` and assume nothing else surrounds them. Easiest fix: move both directories under `(marketing)/` so they inherit the `Navbar` / `Footer` from `(marketing)/layout.tsx`. Alternatively, the `[locale]/layout.tsx` could conditionally render the marketing chrome for these two routes, but the route-group move is cleaner.
- **Prose styling is hand-rolled per section.** Every `<section>` uses `text-xl font-semibold text-foreground` for the heading and `text-sm leading-7 text-muted-foreground` for the body. Could be replaced with a `<MarketingProse>` wrapper using Tailwind's `@tailwindcss/typography` plugin (`prose prose-slate dark:prose-invert`) for consistent prose styling site-wide.
- **No structured metadata callout pattern.** The "Source: Harvard Business School" callout on ATS scanner, the "Pre-launch draft" callout on terms, and the various inline `<strong>` callouts in privacy are all styled differently. A shared `<Callout>` primitive would unify them.

## Console / runtime

(None observed.)
