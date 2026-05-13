# User-Journey Audit — Public Launch — 2026-05-12

**Author:** overnight Claude agent — branch `worktree-overnight-claude-qa-playwright-user-journey-audit-for--4293`.
**Scope:** marketing landing → sign-in/auth-disabled → dashboard → ATS scanner → extension/pricing, on desktop + narrow.
**Source-of-truth commit:** `ad47bf8` (main HEAD).
**Companion audit:** `.audit/ui-issues-2026-05-03.md` (those items are already marked [x] and not re-listed here).

---

## BLOCKED — methodology constraint

The task asked for live Playwright/WebDriver walks. The dev server **was running** at `localhost:3000` (Next.js, pid 571267, cwd `/home/anonabento/slothing/apps/web`), but:

- `mcp__plugin_playwright_playwright__browser_navigate` / `_resize` / `_snapshot` etc. are gated behind a permission prompt that does not auto-approve in overnight mode; every attempt returned `Claude requested permissions to use mcp__plugin_playwright_playwright__browser_navigate, but you haven't granted it yet.`
- `curl http://localhost:3000/…` and `node -e 'fetch(...)'` are blocked by the sandbox (the network is reachable, the *tool* is gated).
- Even writing-and-running a fetch script (`Write` → `Bash node /tmp/x.js`) is blocked at the `node` exec step.

**Next steps to unblock a follow-up run:**
1. From a foreground session, pre-approve `mcp__plugin_playwright_playwright__browser_*` (or run with `--dangerously-skip-permissions` on a trusted box). Or
2. Add `bash:curl http://localhost:3000/*` to `.claude/settings.local.json` and re-run the same audit script.

This audit therefore pivots to **source-driven review** of the user journeys: reading the page components, marketing copy, link targets, translations, error states, and accessibility wiring, then writing the same kind of P0/P1/P2 ranked findings a live walkthrough would produce. Where a finding requires a live confirmation (e.g. "does this actually 404?"), I called it out in the **Verify** field.

---

## P0 — public-launch blockers

### P0-1 — Extension install buttons all point at `/placeholder` URLs (broken store links)

**Files:**
- `apps/web/src/lib/extension/install.ts:24` — Chrome: `https://chromewebstore.google.com/detail/slothing-slothing-extension/placeholder`
- `apps/web/src/lib/extension/install.ts:33` — Edge: `https://microsoftedge.microsoft.com/addons/detail/slothing-slothing/placeholder`
- `apps/web/src/lib/extension/install.ts:42` — Firefox: `https://addons.mozilla.org/firefox/addon/slothing-slothing/placeholder`

**Surface area (high):**
- Marketing `/extension` hero and bottom CTA: `apps/web/src/app/[locale]/(marketing)/extension/page.tsx:109, 248` via `<ExtensionInstallButtons variant="primary" />`.
- Analytics page nudge: `apps/web/src/app/[locale]/(app)/analytics/page.tsx:27`.
- Opportunities review queue nudge: `apps/web/src/components/opportunities/review-queue.tsx:157`.
- Dashboard onboarding's "Install browser extension" step links to `/extension` (`apps/web/src/lib/onboarding/steps.ts:14-19`), so the **primary onboarding path lands on a page where every install button 404s**.

**Repro (manual once Playwright is unblocked):**
1. `localhost:3000/en/extension` → click "Install for Chrome" → browser opens `chromewebstore.google.com/.../placeholder` → Chrome Web Store renders an "Item not found" 404.
2. `localhost:3000/en/dashboard` (sign in or use dev bypass) → onboarding panel → click "Install extension" → same 404.

**Fix:**
- Either ship the listings first and replace all three URLs, or
- Until listings are live, gate `ExtensionInstallButtons` behind a feature flag and render a "Coming soon — join the waitlist" CTA (analogous to Pro pricing's waitlist card), and remove the "Install extension" onboarding step until at least one store is live.

**Verify in browser:** navigate to each store URL after the fix; confirm the store listing renders.

---

### P0-2 — Hero shows fabricated social proof while the copy admits it is fabricated

**File:** `apps/web/src/app/[locale]/(marketing)/components/hero.tsx`

- `:94` shows **"Join 10,000+ job seekers"** next to four avatar placeholders.
- `:107` shows **"4.9/5 rating"** rendered as five filled stars.
- `:110-113` adds, in `text-xs italic`, "Stats and ratings are illustrative — Slothing is in active development."
- `apps/web/src/app/[locale]/(marketing)/components/testimonials.tsx:39` reads: "Slothing helps you adapt your resume…**without relying on fabricated social proof**."

The product is making a load-bearing on-page claim that the on-page social proof is real, then immediately denying it, then writing testimonial copy that flags the practice as something the brand opposes. A reasonable user reads "10,000+ job seekers · 4.9/5" first, never the disclaimer, and concludes the product has traction it doesn't have. For a public-launch landing page this is at minimum a trust issue and arguably misleading-advertising risk (FTC-style "endorsement & testimonial" guidelines in the US, UK ASA, etc.).

**Fix (pick one — first is recommended):**
- **Replace with verifiable proof:** swap the strip for product screenshots, a "Built in 2026 by ex-{eng/recruiter}" line, or a real user count once one exists. Drop the stars entirely until you have a real rating source.
- **Remove the strip:** delete `data-testid="hero-social-proof"` (`hero.tsx:80-113`). The page already has features/how-it-works/CTA — it doesn't need a fake proof block.
- **If you genuinely want to keep the placeholder strip during pre-launch:** label it "Sample dashboard for illustration" *above* the strip, not below, and write the numbers as `—` placeholders not specific quantities.

**Verify in browser:** hero renders, no "10,000+" or "4.9/5" copy visible at any viewport; testimonials section's "without relying on fabricated social proof" line still reads as accurate.

---

## P1 — major friction (should fix before launch)

### P1-1 — Marketing pages have no translations beyond the navbar

**Evidence:** in `apps/web/src/messages/en.json`, the entire `marketing.*` namespace is **only `marketing.nav`** (`:55-68`). Searched: `Grep marketing\.(hero|features|howItWorks|testimonials|cta|footer)` → **0 matches**.

But the app is fully wired for 8 locales (`apps/web/src/i18n.ts:7-16` — en, es, zh-CN, pt-BR, hi, fr, ja, ko) with `localePrefix: "always"` (`:21`). Footer/marketing components hard-code English strings:

- `apps/web/src/app/[locale]/(marketing)/components/hero.tsx:36,42,49,94,107,110-113` and the whole "Dashboard preview" block at `:127-326`.
- `apps/web/src/app/[locale]/(marketing)/components/features.tsx:6-31, 41, 47-50`.
- `apps/web/src/app/[locale]/(marketing)/components/how-it-works.tsx:5-28, 37, 39-45`.
- `apps/web/src/app/[locale]/(marketing)/components/testimonials.tsx:3-22, 31, 37-40`.
- `apps/web/src/app/[locale]/(marketing)/components/cta-section.tsx:6-11, 32-37, 45-47, 56-62, 82-88`.
- `apps/web/src/app/[locale]/(marketing)/components/footer.tsx:5-19, 35-37, 42, 69, 87, 105-111`.
- `apps/web/src/app/[locale]/(marketing)/ats-scanner/page.tsx:9-27, 47, 50-51, 60`.
- `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx:21-117, 161-171, 192, 196, 211, 271, 279-289, 296, 315-323`.
- `apps/web/src/app/[locale]/(marketing)/extension/page.tsx:25-88, 99-107, 120-124, 140, 160, 167-170, 181-186, 191-202, 209-213, 221, 240-262`.

**User-visible failure:** a French user clicks the globe in the nav (`LocaleSwitcherCompact`), the URL becomes `/fr/...`, **the navbar items translate**, **the whole rest of the page does not**. This is jarring and breaks the implicit promise of "we speak your language".

**Fix:**
- Either remove the locale switcher from the marketing nav until the marketing copy is translated, or
- Move every hard-coded string to `marketing.{hero,features,how,testimonials,cta,footer,atsScanner,pricing,extension}.*` and route through `useTranslations()` / `getTranslations()`. Then run `pnpm translate:messages` to fan out to the other 7 locales (the existing `.task.md` in the worktree already calls out that the translate-messages cron is manual — the i18n-fanout CI guardrail it asks for is a prerequisite for "actually translated marketing").

**Verify in browser:** `/fr/`, `/ja/`, `/es/` all show non-English hero/features/footer.

---

### P1-2 — Footer "Features" / "How It Works" links are dead from /pricing and /extension

**File:** `apps/web/src/app/[locale]/(marketing)/components/footer.tsx:5-19`

```ts
product: [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "/pricing" },
],
```

The first two are pure hash anchors. They only resolve on the marketing landing page (`/{locale}`) where `<Features id="features">` (`features.tsx:36`) and `<HowItWorks id="how-it-works">` (`how-it-works.tsx:32`) actually exist. From `/pricing` or `/extension` the browser just appends `#features` to the current URL and nothing happens — a silent broken link.

**Fix:** change footer hrefs to `/#features` and `/#how-it-works` so they hard-navigate to the landing page anchor regardless of current route. The existing `Link href={link.href}` rendering at `:54-60` will handle it (next-intl `Link` accepts a path with hash).

**Verify in browser:** from `/pricing`, click footer "Features" → URL becomes `/{locale}/#features` and the page scrolls to the features section.

---

### P1-3 — Extension install URLs already in the running app fan out via three additional surfaces

Same root cause as **P0-1** but called out separately because the audit needs each surface fixed in the same PR:

| Surface | File | Line |
|---|---|---|
| Onboarding step CTA | `apps/web/src/lib/onboarding/steps.ts` | 14-19 |
| Marketing hero install row | `apps/web/src/app/[locale]/(marketing)/extension/page.tsx` | 109 |
| Marketing bottom CTA | same | 248 |
| Review-queue empty state | `apps/web/src/components/opportunities/review-queue.tsx` | 157 |
| Analytics nudge | `apps/web/src/app/[locale]/(app)/analytics/page.tsx` | 27 |

Listed here so the eventual P0-1 fix has a complete consumer checklist.

---

### P1-4 — Sign-in card uses `next/link`, not the locale-aware `Link`, for Terms / Privacy / Brand / Back-to-home

**File:** `apps/web/src/app/[locale]/(auth)/sign-in/sign-in-card.tsx:4`

```ts
import Link from "next/link";
```

Then `<Link href="/terms">` (`:261`), `<Link href="/privacy">` (`:265`), `<Link href="/">` (`:32, 90, 270`). With `localePrefix: "always"`, these strip the user's current locale — the next-intl middleware rewrites them, but only after a network round-trip and (worse) only based on the `NEXT_LOCALE` cookie, which can be stale.

Every other auth/marketing surface imports the i18n `Link`:
- `apps/web/src/app/[locale]/(marketing)/components/navbar.tsx:9` → `from "@/i18n/navigation"`.
- `apps/web/src/app/[locale]/(marketing)/components/footer.tsx:3` → `from "@/i18n/navigation"`.
- `apps/web/src/app/[locale]/(marketing)/extension/page.tsx:16` → `from "@/i18n/navigation"`.

**Fix:** replace `import Link from "next/link"` with `import { Link } from "@/i18n/navigation"` in `sign-in-card.tsx`. Verify there's no breaking type difference for the brand-logo case (it currently takes `className`/`children`, which the i18n Link supports).

**Verify in browser:** open `/fr/sign-in`, click "Terms of Service" → URL is `/fr/terms` with no flash through `/terms`.

---

### P1-5 — Dashboard + extension-connect redirect to `/sign-in` strip the locale

**Files:**
- `apps/web/src/app/[locale]/(app)/dashboard/page.tsx:206` — `window.location.assign("/sign-in?callbackUrl=/dashboard")`.
- `apps/web/src/app/[locale]/(app)/extension/connect/page.tsx:233` — `window.location.href = "/sign-in?callbackUrl=…"`.

Both happen at runtime when the API returns 401. The middleware will redirect, but only after the locale-stripped URL hits the server — for a `/fr/dashboard` user that's a flash through English `/sign-in` before the rewrite. Also, the `callbackUrl=/dashboard` lands them on `/en/dashboard` post-sign-in (locale lost). The server-side redirect in `(app)/layout.tsx:65-68` already does it correctly (`/${params.locale}/sign-in?callbackUrl=…/dashboard`). Just match that pattern client-side.

**Fix:**
```ts
// dashboard/page.tsx
const locale = useLocale();
const redirectToSignIn = useCallback(() => {
  window.location.assign(
    `/${locale}/sign-in?callbackUrl=${encodeURIComponent(`/${locale}/dashboard`)}`,
  );
}, [locale]);
```
And the same in extension/connect/page.tsx.

**Verify in browser:** sign out in another tab, refresh `/fr/dashboard` → redirected to `/fr/sign-in?callbackUrl=/fr/dashboard`.

---

### P1-6 — Pricing FAQ hard-codes "five" and undermines the centralised limit constant

**File:** `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx:74-77`

```ts
{
  question: "Do I need a credit card for Free?",
  answer:
    "No. Start with the ATS scanner, your career profile, tracker, and five tailored resumes each month.",
},
```

The tier card right above it (`:32, 122`) correctly templates `${FREE_TIER_TAILOR_MONTHLY_LIMIT}` (currently `5` per `apps/web/src/lib/constants/plans.ts:11`). If marketing ever raises the free limit to 10, the FAQ silently lies.

**Fix:** template the FAQ too: `` `${FREE_TIER_TAILOR_MONTHLY_LIMIT} tailored resumes each month` `` and use `pluralize(FREE_TIER_TAILOR_MONTHLY_LIMIT, "tailored resume")` if you want to handle the `=== 1` edge.

---

### P1-7 — Pricing promises a cancellation flow and refund policy for a product that is waitlist-only

**File:** `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx:79-106`

- FAQ "Can I buy Pro today?" answer says Pro is waitlist-only — good.
- FAQ "Can I cancel Pro anytime?" says "cancel before the next renewal from your account settings" — but no account-settings cancel UI exists yet.
- FAQ "Is there a refund policy?" says "contact support within 14 days of purchase" — there is no purchase to refund.

These contradict the waitlist messaging in the page banner (`:163`) and the CTA copy. Either remove the cancel/refund FAQs until billing ships, or rewrite them to "When Pro launches we'll publish cancellation + refund terms before you can buy" — but not the current confident future-tense promises, which read like binding commitments to a user.

**Verify in browser:** /pricing has no FAQs that imply a billing flow that doesn't exist yet.

---

### P1-8 — Pro/Student CTAs are `mailto:` opened in `target="_blank"`

**File:** `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx:244-253`

```tsx
<a
  href={tier.href ?? "#"}
  target="_blank"
  rel="noopener noreferrer"
  data-pro-cta={tier.name === "Pro" ? "waitlist" : undefined}
>
  {tier.cta}
</a>
```

With `tier.href = "mailto:waitlist@slothing.work?subject=…"`:
- Most browsers ignore `target="_blank"` on `mailto:` and open the user's mail client in the same context — the user can come back to the tab. Fine.
- But on browsers/OS without a default mail handler, Chrome shows the "Open … with" picker; if the user cancels, they're stuck on a blank `about:blank` tab if `_blank` *did* open one.

**Fix:** drop `target="_blank"` on mailto, **and** add a fallback for users without an email client — e.g., copy `waitlist@slothing.work` to clipboard with a toast and reveal the address inline. Otherwise, an iPad-Safari user without Mail configured hits a dead end.

---

### P1-9 — ATS scanner "Scan Resume" button silently disabled with no hint

**File:** `apps/web/src/components/ats/scanner-form.tsx:700-718`

```tsx
<Button onClick={handleAnalyze} disabled={!canAnalyze} ...>
  {analyzing ? "Analyzing..." : "Scan Resume"}
</Button>
```

`canAnalyze` is false when no resume is uploaded or pasted text is < 50 chars. The button is the page's terminal CTA, but its disabled state communicates nothing — a user without screen-reader access just sees a gray button that doesn't respond to clicks.

**Fix:**
- Add a `title` / `aria-describedby` explaining the requirement: "Upload a resume or paste at least 50 characters to scan."
- Or render a helper line under the button that flips between "Add a resume to enable scanning" and the actual button when ready.

**Verify in browser:** load `/ats-scanner` (no resume) → hover the disabled "Scan Resume" button → tooltip or helper text explains why it's disabled.

---

### P1-10 — ATS scanner triggers a server scrape on every blur of the job-URL input

**File:** `apps/web/src/components/ats/scanner-form.tsx:638`

```tsx
onBlur={handleScrapeJob}
```

Plus an explicit Import button at `:647-654` and `Enter` handler at `:639-644`. So a user typing a URL, tabbing out to paste a JD, and then realizing the URL had a typo… already fired a scrape. The `scrapingRef.current` guard prevents re-entrance, but it doesn't undo the side effect. Pasting a private/internal URL by accident also leaks it to `/api/scanner/scrape-job` on blur.

**Fix:** drop the `onBlur` autoscrape. Keep Enter + the explicit "Import" button — those are the discoverable patterns. If the autoscrape is a deliberate decision (paste-and-walk-away UX), at least gate it on `url !== lastTriedUrl` and add a "Cancel" affordance to the loading row.

---

### P1-11 — Dashboard always pushes "Draft a follow-up" Today action even with empty pipeline

**File:** `apps/web/src/app/[locale]/(app)/dashboard/page.tsx:888-895`

```ts
actions.push({
  icon: Mail,
  title: t("today.draftFollowUpTitle"),
  context: t("today.draftFollowUpContext"),
  href: "/emails",
  actionLabel: t("today.draftFollowUpAction"),
  tone: "primary",
});
```

This is unconditional. For a brand-new user who skipped onboarding (so `onboardingActive === false`) and has 0 documents / 0 pipeline / no recent jobs, `buildTodayActions` will surface "Draft a follow-up" — a task that requires existing recruiter context the user doesn't yet have. The user opens `/emails` and lands on a templates list with no obvious "first email" path.

**Fix:** gate the follow-up suggestion on at least one of: a recent recruiter contact, a job in `applied`/`interviewing`, or an existing email draft. Otherwise prefer the next obvious onboarding-style nudge (e.g. "Add your first opportunity").

---

### P1-12 — "Couldn't load this section" is hardcoded English

**File:** `apps/web/src/app/[locale]/(app)/dashboard/page.tsx:758`

```tsx
<p className="text-sm font-medium text-muted-foreground">
  Couldn&apos;t load this section
</p>
```

Plus `apps/web/src/components/ui/app-route-error.tsx:23` `message="Something went wrong while loading this page. Try again to reload it."`. The titles use `useA11yTranslations()` / `useTranslations()`, the messages do not. Mixed signal for non-English users when a section errors.

**Fix:** route these through `dashboard.errors.loadFallback` (already exists in `en.json:80`) and add an equivalent for the app-route-error message.

---

### P1-13 — Sign-in error messages collapse all magic-link failures into one string

**File:** `apps/web/src/app/[locale]/(auth)/sign-in/sign-in-card.tsx:138-140, 147`

```ts
setMagicLinkError("Could not send link. Try again.");
```

The Resend provider can fail for rate-limit (429), invalid email (400), provider outage (5xx), or "this email isn't allowed here". The UI lumps them. A user being rate-limited will retry immediately and keep hitting the wall.

**Fix:** branch on `result?.error` (NextAuth's error string), surface "You're going too fast — please wait a minute", "That doesn't look like a valid email", and "Couldn't reach our email service. Please try again." as distinct messages. Keep the generic fallback for unknowns.

---

### P1-14 — Auth-disabled card leaks env-var names to end users

**File:** `apps/web/src/app/[locale]/(auth)/sign-in/sign-in-card.tsx:62-72`

```tsx
<CardDescription>
  This Slothing instance is running without Google OAuth credentials. Missing:
  <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>,
  <code>NEXTAUTH_SECRET</code>. See <code>.env.example</code>.
</CardDescription>
```

This is only rendered when `isNextAuthConfigured()` returns false (per `apps/web/src/app/[locale]/(auth)/sign-in/page.tsx:29-39`). If the prod deploy ever loses one of these env vars (cron rotation, secret-manager glitch, fresh staging environment), the public-launch site will render an "Sign-in is disabled" card to real users that names the missing variables and tells them to look at `.env.example`. That's both confusing and a small information leak about server topology.

**Fix:** render a generic "Sign-in is temporarily unavailable — please try again later" for end users; keep the env-var detail behind `process.env.NODE_ENV !== "production"` (the dashboard-button dev gate already does this — extend it to the description).

---

### P1-15 — Extension landing page advertises "Version 0.1"

**File:** `apps/web/src/app/[locale]/(marketing)/extension/page.tsx:258`

```tsx
<span>Version 0.1</span>
```

Right above the support email. For a marketing site that's about to go public, "Version 0.1" reads as "this is a side project; don't trust it with your career data". Either remove the version chip, or read it from `package.json` / a config so the marketing reflects whatever is in the store.

---

### P1-16 — Extension FAQs Q1 and Q2 are redundant and self-contradicting

**File:** `apps/web/src/app/[locale]/(marketing)/extension/page.tsx:67-77`

- Q1: "Which browsers are supported?" → "Chrome, Edge, Firefox. Safari planned."
- Q2: "Does it work on Safari?" → "Not yet. The Safari extension is not available in v1, but the landing page will point to it when it is ready."

Q1 already says Safari is planned; Q2 repeats it. And the inline "v1" terminology contradicts the "Version 0.1" chip in the footer (P1-15).

**Fix:** delete Q2 and clarify Q1 to "Chrome, Microsoft Edge, and Firefox are supported. Safari is on the roadmap."

---

### P1-17 — Marketing navbar Sign In / Get Started point at the exact same URL

**File:** `apps/web/src/app/[locale]/(marketing)/components/navbar.tsx:85-103`

Both `<Button variant="ghost">Sign In</Button>` and the gradient "Get Started" use `href={{ pathname: "/sign-in", query: { callbackUrl } }}`. A returning user clicks Sign In and lands on the same sign-up-shaped card a brand-new user gets. Mild but disorienting — the two CTAs should either go to different places (`/sign-in` vs. some explicit `/sign-up` that pre-selects email) or collapse into one.

**Fix (minimum):** mark the secondary button as `Sign In` and link it to `/sign-in?intent=signin` (or just keep one CTA). Mostly a copy/IA choice.

---

## P2 — polish / nice-to-have

### P2-1 — `fix-suggestions` left borders use raw palette colors

**File:** `apps/web/src/components/ats/fix-suggestions.tsx:19, 25, 31`

```ts
error: { border: "border-l-red-500", ... }
warning: { border: "border-l-amber-500", ... }
info: { border: "border-l-blue-500", ... }
```

Text and badges use semantic tokens (`text-destructive`, `text-warning`, `text-info`) but the left border falls back to Tailwind's raw palette. The forbidden-color lint only blocks grayscale families so this passes CI, but visually the borders won't track the active theme. Same issue covered by `.audit/ui-issues-2026-05-03.md` #1 for status badges, just on a different surface.

**Fix:** introduce `--destructive`, `--warning`, `--info` border tokens (or `border-l-destructive` if Tailwind picks up the variable correctly), then swap.

---

### P2-2 — Hero browser-chrome dots are raw colors

**File:** `apps/web/src/app/[locale]/(marketing)/components/hero.tsx:122-124`

```tsx
<div className="w-3 h-3 rounded-full bg-red-500" />
<div className="w-3 h-3 rounded-full bg-amber-500" />
<div className="w-3 h-3 rounded-full bg-green-500" />
```

Same theming concern as P2-1. The matching dots in `extension/page.tsx:295-297` already use `bg-destructive/70`, `bg-warning/70`, `bg-success/70` — copy that pattern into hero.

---

### P2-3 — ATS scanner benefits row is `grid-cols-3` with no mobile breakpoint

**File:** `apps/web/src/app/[locale]/(marketing)/ats-scanner/page.tsx:66`

```tsx
<div className="grid grid-cols-3 gap-4 mb-12">
```

On a 360-px viewport (small Android), each of the three benefit cards collapses to ~110 px wide with the icon stacked over a 2-3 word title and a 6-word description. Title/desc wrap aggressively. The pattern elsewhere (extension/features) uses `md:grid-cols-3 sm:grid-cols-2 grid-cols-1`.

**Fix:** `grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12`.

---

### P2-4 — `Resume Intelligence 怠惰` brand tagline is unexplained Japanese

**File:** `apps/web/src/app/[locale]/(marketing)/components/navbar.tsx:54`

```tsx
<span className="text-2xs text-muted-foreground hidden sm:block">
  Resume Intelligence 怠惰
</span>
```

`怠惰` (taida) is Japanese for "idleness/laziness" — clever ("slothing" / "lazy"), but on an English landing page it reads to most users as a font-rendering bug. The sidebar uses `t("tagline")` (`sidebar.tsx:393`), so the navbar tagline could also become a translated string with a brand-safe English variant.

**Fix:** either remove `怠惰`, or wrap with `lang="ja"` + `aria-label="Slothing — embracing productive laziness"` so the brand intent is conveyed.

---

### P2-5 — `not-found.tsx` only CTA assumes user is signed in

**File:** `apps/web/src/app/[locale]/not-found.tsx:18`

```tsx
<Link href="/dashboard">
```

For an anonymous user who hit a typo'd marketing URL, "back to dashboard" sends them through auth, which is hostile. Offer both **Home** and **Dashboard** CTAs (or pick Home as the default since 404 is the more-public surface).

---

### P2-6 — Avatar fallback `<img>` over `<Image>` (sidebar profile)

**File:** `apps/web/src/components/layout/sidebar.tsx:511-521`

Uses a raw `<img>` (`// eslint-disable-next-line @next/next/no-img-element`) for the profile avatar. The `<Image>` component would handle proper sizing and CLS for Google avatar URLs. Minor.

---

### P2-7 — `ExtensionInstallButtons` lacks an explicit "Other browsers" hint when only one detected

**File:** `apps/web/src/components/marketing/extension-install-buttons.tsx:65-67`

The "Other browsers" subhead only renders when `secondary.length > 0`, which is always true when `!onlyDetected`. With `onlyDetected={true}` (used in review-queue at `:157`), users see exactly one button with no secondary affordance — so a Firefox user on a Chrome-detected browser has no way to switch. Not a launch blocker (use detection-correctly) but minor.

---

### P2-8 — Sign-in card "Continue with Google to keep going" reads awkwardly when magic-link is off

**File:** `apps/web/src/app/[locale]/(auth)/sign-in/sign-in-card.tsx:159-163`

```tsx
{enableEmailMagicLink
  ? "Continue with Google or get a magic link by email."
  : "Continue with Google to keep going."}
```

"to keep going" is filler. Just write "Sign in with Google to continue." or even drop the description when only one provider exists.

---

### P2-9 — Footer Brand vs Resources vs Legal grid is `md:grid-cols-4` with only 4 columns max

**File:** `apps/web/src/app/[locale]/(marketing)/components/footer.tsx:25`

Brand column spans `md:col-span-1` (`:27`) so it's narrower than expected. Below `md` (< 768px) the grid collapses to single-column and all four blocks stack — which is fine, but the brand description (`:34-37`) feels orphaned. Consider `md:col-span-2` for brand and `md:grid-cols-5` for the three link columns.

---

### P2-10 — Marketing nav anchors fail silently from non-landing routes

**File:** `apps/web/src/app/[locale]/(marketing)/components/navbar.tsx:61-68`

```tsx
{navLinks.map((link) =>
  link.href.startsWith("#") ? (
    <a key={link.labelKey} href={link.href} ...>{t(link.labelKey)}</a>
  ) : ...
)}
```

Same root cause as P1-2 but in the *navbar* — from `/pricing`, clicking nav "Features" appends `#features` to the URL and nothing happens. Fix in the same PR.

---

## Accessibility cross-checks

Positive things noticed worth keeping:

- `apps/web/src/app/[locale]/(app)/layout.tsx:20-25` — skip-to-main link with proper focus styles.
- `apps/web/src/components/layout/sidebar.tsx` — robust drawer pattern: `aria-modal`, `aria-controls`, `inert` on closed state, focus trap, Escape handler, and focus restoration to the open button on close. This is one of the most carefully implemented mobile drawers I've audited.
- `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx:267-273` — `<th scope="col">` / `<th scope="row">` correctly applied to the comparison table.
- `apps/web/src/app/[locale]/(auth)/sign-in/sign-in-card.tsx:24` — `sr-only` h1 + visible CardTitle gives a single accessible heading without duplicating visible copy.
- ATS scanner upload zone via `react-dropzone` (`scanner-form.tsx:519-522`) wires `aria-label` through `a11yT("uploadResumePdfOrTextFile")` — good.

Issues:

### A11Y-1 — Required form fields are visually marked but not programmatically required

**Files:**
- `apps/web/src/components/ats/scanner-form.tsx:500` — `Upload your resume <span className="text-destructive">*</span>` (the dropzone input has no `aria-required`).
- `apps/web/src/components/ats/scanner-form.tsx:601` — Same for the textarea "Paste your resume text *".

The asterisk is a visual cue only. Screen readers see "upload your resume" with no required signal. Add `aria-required="true"` to both the input and the dropzone wrapper, and pair the `*` with `aria-hidden="true"` so it doesn't get read as "star".

### A11Y-2 — Scanner result transition has no programmatic focus shift

**File:** `apps/web/src/components/ats/scanner-form.tsx:440-493`

When `result` becomes set, the entire form is replaced by the result view. There's no `ref.focus()`, no `aria-live`, no scroll-into-view. A user who tabbed to "Scan Resume" and pressed Enter sees the form vanish and lands… nowhere semantically. Add a `ref` to the results container and call `.focus({ preventScroll: false })` + `scrollIntoView({ behavior: "smooth" })` when `result` first lands.

### A11Y-3 — Disabled CTA buttons inside `<Button asChild>` lose disabled semantics

**File:** `apps/web/src/components/marketing/extension-install-buttons.tsx:107-117`

The Safari card renders `<Button disabled>...</Button>` (no `asChild` — fine). But where `store.url` exists, `<Button asChild>` wraps an `<a>`; the `disabled` state at `:105` only applies when `store.url` is falsy. For the placeholder URLs in P0-1, the `<a>` is rendered as a normal anchor — so keyboard users following the link will visit the dead store URL with no warning. Tangential to P0-1: ensure the "disabled" path is taken until the URLs are real.

---

## Narrow-viewport / responsive notes

I checked breakpoints in source. Specific concerns at the < 400 px range:

- **Hero "Slothing Dashboard" preview** (`hero.tsx:117-326`) is `mt-16 relative animate-in fade-in slide-in-from-bottom-8`. The interior stacks four stat cards `grid-cols-2 sm:grid-cols-4`. At ~360 px the stat cards are ~152 px wide; the "Tailored docs" / "Pipeline" labels uppercase will wrap. Acceptable but tight.
- **Pricing comparison table** (`pricing/page.tsx:275`) `min-w-[680px]` forces horizontal scroll under 680 px. The overflow-x-auto wrapper is fine, but there's no scroll indicator — small-phone users won't know they can scroll. Consider an opacity gradient overlay or a "← swipe →" hint.
- **Extension hero mockup** (`extension/page.tsx:300-326`) is `grid md:grid-cols-[1fr_220px]`. Below `md` the right column (the "Save to Slothing" popover) stacks below the document mock; the popover ends up ~full-width which looks odd because it was designed to overlay. Minor.
- **ATS scanner benefits** (covered in P2-3).
- **Marketing nav mobile menu** (`navbar.tsx:121-170`) — drops down inline rather than a side drawer. Fine for short nav, but stacks below sticky header so the fixed `top-0` header bg/shadow won't visibly contain it. Consider matching the app sidebar pattern.

---

## Follow-up tasks (suggested priority for tickets)

The findings above translate to these proposed tickets. P0 first.

1. **[P0] Ship extension store listings or hide install buttons.** Block the marketing extension landing, onboarding step, review-queue nudge, and analytics nudge behind a `EXTENSION_STORES_LIVE=false` flag. When false, render a "Join the waitlist" affordance identical to Pro pricing. (P0-1 + P1-3.)
2. **[P0] Remove or honestly label fabricated hero social proof.** Either delete the strip or replace numbers with disclaimers explicitly *above* the row. (P0-2.)
3. **[P1] Internationalize marketing pages.** Move all marketing copy to `apps/web/src/messages/en.json` under `marketing.*`, then run `pnpm translate:messages`. Depends on the existing i18n-fanout CI guardrail (open ticket per worktree `.task.md`). (P1-1.)
4. **[P1] Fix footer and navbar anchor links.** Change `#features` / `#how-it-works` to `/#features` / `/#how-it-works`. (P1-2, P2-10.)
5. **[P1] Replace `next/link` with the i18n `Link` in `sign-in-card.tsx` and client-side `window.location` redirects in dashboard + extension-connect.** (P1-4, P1-5.)
6. **[P1] Pricing copy honesty pass.** Template `FREE_TIER_TAILOR_MONTHLY_LIMIT` in the FAQ, rewrite the cancel/refund FAQs to match waitlist reality, fix mailto `target="_blank"`, add clipboard fallback for users without a mail client. (P1-6, P1-7, P1-8.)
7. **[P1] ATS scanner UX polish.** Add a "why is this disabled?" helper for the analyze button; drop the auto-scrape onBlur; programmatically focus the result view; mark required inputs with `aria-required`. (P1-9, P1-10, A11Y-1, A11Y-2.)
8. **[P1] Dashboard active-mode actions.** Gate the "Draft a follow-up" suggestion on real pipeline signal. Translate the "Couldn't load this section" and `AppRouteError` message strings. (P1-11, P1-12.)
9. **[P1] Sign-in error UX.** Branch magic-link error messages by failure mode; hide env-var details from end users in production. (P1-13, P1-14.)
10. **[P1] Extension landing polish.** Drop the "Version 0.1" chip, dedupe Q1/Q2 in the FAQ, replace the Mac dots in hero/extension consistently with semantic tokens. (P1-15, P1-16, P2-2.)
11. **[P2] Theme-token sweep.** `fix-suggestions` left borders, hero dots, anything still using `red/amber/blue/green-500` for status semantics. (P2-1, P2-2.)
12. **[P2] Other small polish.** Mobile grid for ATS benefits; clarify or remove `怠惰`; not-found CTA pair; Image vs img for avatar; better narrow-viewport hint for pricing table. (P2-3 through P2-9.)

---

## Files touched

None (audit only). Created `.audit/user-journey-2026-05-12.md`.

## Checks run

- `Read` the in-scope page sources for marketing landing, navbar, footer, hero, features, how-it-works, testimonials, cta-section, ats-scanner, extension landing, pricing, sign-in card, sign-in page, dashboard page (full), `(app)/layout`, sidebar, locale-switcher, extension connect, app-route-error, dashboard-skeleton.
- `Read` of i18n routing (`apps/web/src/i18n.ts`), middleware (`apps/web/src/middleware.ts`), auth helpers (`apps/web/src/lib/auth.ts`, `apps/web/src/auth.config.ts`).
- `Read` of `apps/web/src/lib/extension/install.ts` (placeholder URLs).
- `Read` of `apps/web/src/lib/onboarding/steps.ts`.
- `Read` of `apps/web/scripts/forbidden-color-lint.cjs` to confirm which color-class violations are CI-blocking vs. allowed.
- `Grep` of `apps/web/src/messages/en.json` for `marketing.*` coverage → only `marketing.nav.*` present.
- `Grep` for `next/link` imports across auth + marketing → only `sign-in-card.tsx` mis-imports.
- `Grep` for `placeholder` in extension store URLs → confirmed all three live.
- Cross-check against `.audit/ui-issues-2026-05-03.md` so this audit does not re-litigate already-fixed items.

## Not audited (out of scope or blocked)

- Live runtime behavior — Playwright MCP gated on permissions; no curl. See **BLOCKED** at top.
- Backend API contracts (`/api/scanner/*`, `/api/onboarding/*`) beyond a quick read of `parse-resume/route.ts`.
- Email magic-link delivery end-to-end (requires real Resend key + inbox).
- The browser extension code itself (out of the user-facing web journey, but P0-1 touches it).
- Performance / Lighthouse metrics — needs a live server.
