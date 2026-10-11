# Visual QA — Slothing mascot hero + pricing integration — 2026-05-12

**Branch:** `followup/slothing-visual-qa` (based on `integration/overnight-claude-slothing`).
**Tip:** `c2ef12e` (docs: add Slothing extension follow-up roadmap).
**Scope:** verify the integrated landing hero (mascot variant), pricing tiers, and security/trust section render correctly on desktop and mobile, with no fabricated metrics and correct CTA targets.
**Methodology:** Vitest unit suites + Playwright screenshots at 1440×900 (desktop), 768×1024 (tablet), and 390×844 (mobile) against a dev server in this worktree at `http://localhost:3100`.

## Verdict

**Ship as-is.** The mascot hero is canonical (the conflict winner over the bare-pricing hero variant), CTAs are correct on both pages, the trust cues replace the prior fabricated social proof, and the pricing page surfaces honest waitlist/verification mailto CTAs alongside a security-and-data-handling section. No regressions blocking public launch in this slice — pre-existing items already tracked in `docs/audits/user-journey-2026-05-12.md` (extension placeholder URLs, full hero/CTA translation drift) remain out of scope here.

## Artifacts

| File | Viewport | Page |
| --- | --- | --- |
| [landing-desktop-hero.png](./landing-desktop-hero.png) | 1440×900 viewport | `/en` (hero only) |
| [landing-desktop-full.png](./landing-desktop-full.png) | 1440 full-page | `/en` |
| [landing-tablet-hero.png](./landing-tablet-hero.png) | 768×1024 viewport | `/en` (hero only) |
| [landing-mobile-hero.png](./landing-mobile-hero.png) | 390×844 viewport | `/en` (hero only) |
| [landing-mobile-full.png](./landing-mobile-full.png) | 390 full-page | `/en` |
| [pricing-desktop-full.png](./pricing-desktop-full.png) | 1440 full-page | `/en/pricing` |
| [pricing-mobile-full.png](./pricing-mobile-full.png) | 390 full-page | `/en/pricing` |

## Hero (`apps/web/src/app/[locale]/(marketing)/components/hero.tsx`)

### Desktop (≥ `lg`, 1024+)

- ✅ Two-column layout — copy left, product preview right.
- ✅ `SlothMascot` peeks from the top-right of the dashboard preview card (`-top-12 -right-4 z-20 hidden ... sm:block lg:-top-16 lg:-right-8 lg:h-56 lg:w-56`). Mascot is the **canonical hero element**, not the pricing hero alternative.
- ✅ Floating accent cards: "Cover letter — Drafted in 38s" (md+) and "Match score — 92 / 100" (lg+). These are dashboard preview decorations, not user-facing metrics.
- ✅ Headline: "You're not lazy. / Your system is." (gradient on the second line).
- ✅ Subhead: "Slothing remembers your full career history…".
- ✅ Primary CTA "Scan your resume free" → `/en/ats-scanner`.
- ✅ Secondary CTA "Create a free account" → `/en/sign-in?callbackUrl=%2Fen%2Fdashboard`.
- ✅ Trust cues row contains only **honest** cues: Free ATS scan · No credit card · Open early access · Your data, your control. None of the previously flagged "10,000+ job seekers" or "4.9/5 rating" fabrications appear (`hero.test.tsx:89-100` enforces this).
- ✅ "Slothing is in active development — features ship weekly." disclaimer present beneath the trust cues.

### Tablet (`sm` ≤ width < `lg`, ~640–1023)

- ✅ Single column (copy first, preview below) — `lg:grid-cols-[…]` doesn't kick in yet.
- ✅ The decorative mascot is visible at `-top-12 -right-4` above the preview card; it does not overlap the copy/CTAs.
- ✅ Inline `sm:hidden` mascot at the top is hidden, so we don't see two mascots at once.

### Mobile (< `sm`, < 640)

- ✅ Inline mascot at the top of the copy column (`sm:hidden`), giving the page a clear identity above the fold.
- ✅ Trust cues wrap into a 2-wide grid inside a `bg-card/80` capsule with stronger text contrast (`text-foreground`); covered by `hero.test.tsx:102-110`.
- ✅ CTAs stack to full-width.

## Pricing (`apps/web/src/app/[locale]/(marketing)/pricing/page.tsx`)

### Tiers

| Tier | Price | CTA | Target |
| --- | --- | --- | --- |
| Free | `$0 forever` | "Start free" | `/en/sign-in?callbackUrl=%2Fen%2Fdashboard` |
| **Pro (highlighted)** | `$8/mo waitlist` | "Email us for waitlist access" | `mailto:waitlist@slothing.work?subject=Pro%20waitlist` (target=_blank, rel=noopener noreferrer, `data-pro-cta="waitlist"`) |
| Student | `$3/mo with verification` | "Email us to verify student status" | `mailto:students@slothing.work?subject=Student%20verification` |

- ✅ The waitlist banner ("Pro is invite-only while billing ships. Email us for early access.") is at the top.
- ✅ Each non-free tier has a `ctaNote` reinforcing "No payment … to join" / "No payment until verification is complete." — honest about billing not being live.
- ✅ Free tier copy uses the `FREE_TIER_TAILOR_MONTHLY_LIMIT` constant (5/month), consistent with the landing CTA section.

### Compare-plans table

- ✅ Rows render `Tailored resumes`, `Generation priority`, `Resume variants`, `New tools`, `Best for`.
- ✅ Pro column highlights via `text-primary font-medium`.
- ✅ On mobile (390 wide), the table is horizontally scrollable (`overflow-x-auto`, `min-w-[680px]`) — visible scroll affordance is the table edge, no overflow into layout.

### Plan questions (FAQ)

- ✅ Covers card requirement, billing live status, cancellation, USD pricing, free-tier carryover, launch timing, refund policy, annual pricing, and student verification.
- ✅ Refund row reads "Cancellation stops future renewal; it does not automatically refund past use." — honest, no over-promise.

### Security and data handling

- ✅ Three cards (Lock icon — "Encrypted in transit"; ShieldCheck — "No data selling"; Trash2 — "Delete anytime").
- ✅ Delete-anytime card links to `/en/privacy`.
- ✅ Footer disclaimer: "AI outputs are assistive: … Slothing does not guarantee hiring outcomes, interview results, or offer decisions." — honest framing.

## Tests

All targeted Vitest suites pass:

```
src/app/[locale]/(marketing)/components/hero.test.tsx            12 tests ✓
src/app/[locale]/(marketing)/components/testimonials.test.tsx     4 tests ✓
src/app/[locale]/(marketing)/components/features.test.tsx         5 tests ✓
src/app/[locale]/(marketing)/components/cta-section.test.tsx      8 tests ✓
src/app/[locale]/(marketing)/pricing/page.test.tsx               11 tests ✓
Total: 40/40 passing
```

The hero suite explicitly enforces "no fabricated user counts or star ratings" (lines 119-124) and the presence of the four honest trust cues (lines 89-100). The pricing suite enforces tier prices, mailto CTA semantics, the waitlist banner, comparison rows, FAQ headings, and the security/trust section.

## CTA target audit (live DOM, `/en`)

```
Hero primary       Scan your resume free       → /en/ats-scanner
Hero secondary     Create a free account       → /en/sign-in?callbackUrl=%2Fen%2Fdashboard
Navbar Sign In                                  → /en/sign-in?callbackUrl=%2Fen%2Fdashboard
Navbar Get Started                              → /en/sign-in?callbackUrl=%2Fen%2Fdashboard
CTA section        Scan My Resume              → /en/ats-scanner
CTA section        Get Started Free            → /en/sign-in?callbackUrl=%2Fen%2Fdashboard
Footer             ATS Scanner                 → /en/ats-scanner
Footer             Browser Extension           → /en/extension
Footer             Privacy Policy              → /en/privacy
Footer             Terms of Service            → /en/terms
```

Spanish locale check (`/es`) preserves localized prefixes on the same CTAs (`/es/ats-scanner`, `/es/sign-in?callbackUrl=%2Fes%2Fdashboard`).

## CTA target audit (live DOM, `/en/pricing`)

```
Free tier      Start free                          → /en/sign-in?callbackUrl=%2Fen%2Fdashboard
Pro tier       Email us for waitlist access        → mailto:waitlist@slothing.work?subject=Pro%20waitlist  (target=_blank rel=noopener noreferrer data-pro-cta=waitlist)
Student tier   Email us to verify student status   → mailto:students@slothing.work?subject=Student%20verification  (target=_blank rel=noopener noreferrer)
Security card  Privacy Policy                      → /en/privacy
```

## Console diagnostics observed

- 1 console **error** per page load: React hydration mismatch on the inline theme-preload `<script nonce>` (server emits `null`, client receives a CSP nonce). This is a layout-level SSR/CSR issue in `apps/web/src/app/[locale]/layout.tsx:90-95` and is **not introduced by the hero/pricing integration**. Suggest tracking separately; non-blocking for visual QA.
- The dev server logs `[env] NextAuth (Google) disabled` and `[env] LLM Providers disabled` because no `.env.local` is present in the worktree — expected in this isolated checkout.

## Out-of-scope, pre-existing

These show up while doing a full hero/pricing pass but were already flagged in `docs/audits/user-journey-2026-05-12.md` and are **not** within the scope of this visual QA:

- Extension install buttons still point at `/placeholder` store URLs (`P0-1` in the user-journey audit).
- `<html lang>` is hard-coded to `en` in the dev server output even on `/es`; the layout uses `lang={locale}` so this looks like a hydration/middleware artifact in this dev session. Worth confirming on a fresh build before launch.
- The hero, features, how-it-works, testimonials, and CTA sections render in English regardless of `[locale]` — the marketing-page i18n migration is still partial (the task brief explicitly said to avoid broad locale edits).

## Fixes applied

None. The integration is clean for the slice under review.
