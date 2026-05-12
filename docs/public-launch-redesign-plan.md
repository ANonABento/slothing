# Slothing — Public Launch Redesign Plan

> Audit + visual direction for the public launch of slothing.work.
> Authored 2026-05-12 by overnight Claude worker. Read this before any T-prefixed redesign tasks.
> This is a **plan**, not an implementation. Files and ranges are pointers for follow-up tickets.

## TL;DR

Slothing is a well-architected app stuck inside generic violet-on-cream SaaS chrome. The product is named after a sloth, but **nowhere in the product or marketing is there a sloth** — the logomark is a Lucide `Sparkles` glyph inside an orange→red gradient (`apps/web/src/app/icon.svg`). For a public launch the redesign must give the brand a face, a voice, and a conversion story:

1. Adopt a **calm-but-confident** visual language: warm cream + deep violet, layered cards with deliberate shadow rhythm, a single editorial display typeface, and a friendly hand-drawn sloth as recurring illustration anchor.
2. Replace the synthetic "10,000+ users / 4.9 rating" hero block with **product proof** — live ATS Scanner demo and a real screenshot of `/dashboard`.
3. Drive the funnel through one CTA — *Scan your resume free* — and follow it with a frictionless account-creation moment immediately after scoring.

Acceptance for this task: design plan exists ✅, top 5 surfaces ranked ✅, risks + verification listed ✅.

---

## Audit findings

### Marketing site (`apps/web/src/app/[locale]/(marketing)/**`)

| Surface | File | What's there | Issues |
|---|---|---|---|
| Hero | `components/hero.tsx` | Centered "You're not lazy. Your system is." + ATS-scan CTA + faux avatar row + faux 4.9★ + faux dashboard preview built with divs | Faux social proof followed by "Stats are illustrative" caveat (lines 80–113) corrodes trust. App preview is hand-drawn divs, not real product. Two CTAs of similar weight. No sloth, no illustration. |
| Features | `components/features.tsx` | 4-card grid with Lucide icons in 4 different sparkly tailwind gradients (violet→purple, rose→orange, blue→indigo, amber→orange) | Gradient chips clash with each other and with the brand violet. Reads like a 2021 startup template. Copy is OK but feature names are generic ("Career profile", "Smart Parser"). |
| How It Works | `components/how-it-works.tsx` | 3-step horizontal flow with the same 4-color gradient chips | Step numbers (01/02/03) muted to ghost weight; connector line is a 1px hairline that disappears on mobile. No illustration. |
| Testimonials | `components/testimonials.tsx` | Mis-named: actually a "How Slothing Helps" outcomes block. No actual testimonials. | Section header literally apologizes ("without relying on fabricated social proof"). For a launch page this self-deprecation reads as defensive. Replace with credible scarcity (waitlist count, hand-curated user quotes from Pro waitlist, screenshots of real generations). |
| CTA | `components/cta-section.tsx` | Two nested cards (ATS-scanner repeat + "Get Started Free") | Duplicates Hero CTA. Benefits list ("Free ATS scanner included", "5 free tailored resumes/month") buried. |
| Navbar | `components/navbar.tsx` | Sparkles-in-violet-gradient-square + gradient-text "Slothing" wordmark | Logo is a generic Lucide glyph. Tagline whisper "Resume Intelligence 怠惰" is clever but unreadable at default text-2xs (10px). |
| Footer | `components/footer.tsx` | 4-column footer with shrunk Sparkles logo | Same logo problem. "Built for job seekers who value their time." is a tagline, but it's filed as filler text. |
| Pricing | `pricing/page.tsx` | Free / Pro (waitlist) / Student (waitlist) with a comparison table and 9 FAQs | Pro and Student are both **mailto:** links. For a launch page this is a believability problem. Either ship a real waitlist signup or hide Student until verification flow exists. |
| ATS Scanner | `ats-scanner/page.tsx` | Shield-check icon hero + 3 benefit columns + `ScannerForm` | The actual money page. Currently buried. Hero CTA is correct to point here but the page itself is a wall of inputs with no sample, no preview, no "see what you'll get". |
| Extension | `extension/page.tsx` | 3 screenshot blocks in `apps/web/public/marketing/extension/` | Only place where real product screenshots ship today. Good template for other surfaces. |

### App surfaces (`apps/web/src/app/[locale]/(app)/**`)

Source: `docs/visual-audit-assets/2026-05-03/after-t3/*.png` (5 weeks old but still representative of default-light theme; commit `ad47bf8` confirms violet is the active default).

| Surface | File | State observed |
|---|---|---|
| `/dashboard` | `dashboard/page.tsx` (1295 lines) | Empty state asks user to upload resume; once filled, shows StreakHeroCard + 4-stat strip + Today + Readiness + Pipeline + Recent Opportunities. Functional, but flat — five stacked white cards with identical bg-card, no surface variation. |
| `/studio` | `studio/page.tsx` (233 lines) + `components/studio/*` | Three-pane editor (Files / Preview / AI). First-run preview reads "Get started" with three bullets; AI sidebar has "Tailor to JD" and "Generate from Bank" buttons. Visually dense, no illustration, no mode-distinct chrome (resume vs cover letter feel identical). |
| `/opportunities` | `opportunities/page.tsx` (1204 lines) | Filter rail (6 facets) + big empty state with briefcase icon. Header "Jobs and hackathons" — should become brand-voice "Your pipeline". |
| `/analytics` | `analytics/page.tsx` | 4 KPI cards, all 0% at zero state. "No pipeline data yet" / "No jobs tracked yet" repeated. Empty state copy is dry. |
| `/calendar`, `/salary`, `/emails` | per `after-t9c/*.png` | Same KPI-card-grid + empty-state pattern. |
| Sign-in | `(auth)/sign-in/sign-in-card.tsx` | Rocket icon (not sloth) inside violet square + Google button. Same logo problem as navbar. |
| Sidebar | `components/layout/sidebar.tsx` | Grouped nav (Home / Documents / Pipeline / …) — solid structure, but visually identical to every shadcn sidebar shipped in 2024. |

### Design tokens (`apps/web/src/lib/theme/**` + `apps/web/src/app/globals.css`)

What's already healthy:

- Centralized `ThemeTokens` interface (`tokens.ts`), 7 presets in `presets/*.ts`, single source of truth in `registry.ts`. Adding a new look is a one-file change.
- Strict semantic-token lint: `scripts/forbidden-color-lint.cjs` hard-fails CI on any `bg-white`, `bg-black`, `text-gray-*`, hex/rgb inline color.
- Dark mode is per-preset, not a hack on top of light.
- Status colors (`destructive`, `success`, `warning`, `info`) are WCAG-AA tuned against white card + tinted bg (per `presets/shared.ts`).
- A `premium` preset already exists (`presets/premium.ts`) using blue `221 83% 53%` with tight letter-spacing `-0.025em` and layered shadows — a strong reference for the premium feel.

What's weak:

- **Type system** is system-stack only (`"Aptos", "Segoe UI", "Helvetica Neue", system-ui` in `presets/shared.ts`). No display face, no editorial moment. Every preset's `fontFamily` and `fontHeading` are identical.
- **Spacing scale** in `BASE_SPACING_VARIABLES` jumps from 12 → 16 → 18 → 24 → 88 with no rhythm — there's no `--spacing-32`, `--spacing-40`, or `--spacing-64` for hero/section padding.
- **Shadows** are good for cards but there's no `--shadow-xl-violet` for branded hero glows. Hero today fakes glow with `bg-gradient-to-bl from-primary/8` blurred blobs (`hero.tsx:27`).
- **Gradients** are defined globally as `--gradient-primary`, `--gradient-hero`, `--gradient-success`. The 4 different gradient chips in `features.tsx` and `how-it-works.tsx` are hardcoded violet/rose/blue/amber and **bypass the token system** — they will not retune with theme presets and are arbitrary brand noise.
- **No illustration layer.** No `--illustration-stroke`, `--illustration-fill-primary` tokens, no SVG sprite system. Marketing assets are PNGs in `apps/web/public/marketing/extension/` only.

### Brand identity gap

`apps/web/src/app/icon.svg` is an orange→red gradient square with a generic "trail of light" — built before the Slothing name was adopted (legacy from "get-me-job"). The product:

- Is **named Slothing**
- Tagline is **"You're not lazy. Your system is."**
- Uses **Japanese 怠惰 ("sloth/laziness")** as a navbar whisper
- Yet has **zero sloth visuals anywhere**

The redesign cannot launch without resolving this. A friendly low-saturation hand-drawn sloth mascot is the single highest-leverage brand move available.

---

## Redesign direction

### Visual language: "Slow on purpose"

- **Mood:** calm, confident, anti-hustle. The opposite of the "Apply to 800 jobs/month" auto-apply crowd (per `docs/COMPETITOR-ANALYSIS.md` AIApply.co).
- **Negative space:** every section gets at least `py-32 lg:py-40` (vs current `py-20 lg:py-32`). Slower pace, bigger breathing room. Hero gets a `max-w-2xl` for headline.
- **Surface hierarchy:** three distinct surfaces, not one bg-card repeated.
  - `bg-background` — page canvas, warm cream
  - `bg-card` — primary content cards, deep paper white with subtle warm tint
  - `bg-paper` — editorial blocks (resume preview, knowledge bank entries), slightly inset, paperier
  Use `shadow-card` for cards, `shadow-elevated` for hover/lifted, and a new `shadow-hero` for the dashboard preview lift.
- **Motion:** existing `animate-in fade-in slide-in-from-bottom-4` is fine. Add a 2-frame mascot blink loop and a slow `float` for the hero sloth (4s ease-in-out, 8px translateY).

### Color

Keep violet primary; sharpen the warmth around it.

| Token | Light (HSL) | Dark (HSL) | Use |
|---|---|---|---|
| `--background` | `36 30% 96%` (warm cream, slightly warmer than current `40 23% 97%`) | `253 20% 9%` | Page canvas |
| `--card` | `0 0% 100%` | `253 22% 14%` | Cards |
| `--paper` | `36 28% 98%` (already in `--surface-paper` but unused for sections) | `253 18% 11%` | Editorial / knowledge bank |
| `--primary` | `259 50% 42%` (deeper, more saturated violet — current `262 39% 48%` is a touch dusty) | `261 65% 72%` | CTAs, links |
| `--primary-2` (new) | `28 88% 58%` (warm amber) | `33 90% 64%` | Secondary CTA, "free" callouts, sloth highlights |
| `--accent` | `259 50% 42%` | `261 65% 72%` | Same as primary for consistency |
| `--foreground` | `253 27% 14%` (keep) | `260 29% 92%` (keep) | Body text |
| `--muted-foreground` | `253 14% 38%` (slightly darker — current `0 0% 40%` is neutral and clashes with the violet tint) | `260 14% 65%` | Secondary text |
| `--success`, `--warning`, `--destructive`, `--info` | keep existing (already WCAG-tuned) | keep | |

**Gradient cleanup:** delete the 4 hardcoded gradients in `features.tsx` and `how-it-works.tsx`. All feature icon chips become `bg-primary/10 text-primary` (consistent with `testimonials.tsx`). Brand gradient stays exactly one place: hero CTA + headline second-line text via `gradient-text`.

### Typography

Introduce one editorial display face for headings; keep the rest of the system stack.

| Role | Family | Weight | Use |
|---|---|---|---|
| Display | **Fraunces** (variable, Google Fonts) | 400 / 600 | H1, H2 in marketing; KPI card values in app |
| Heading | Aptos / system | 600 | H3+, section labels |
| Body | Aptos / system | 400 / 500 | Default `body`, paragraphs |
| Mono | SFMono-Regular (already in `BASE_FONT_VARIABLES`) | 400 | Code, IDs |

Fraunces is editorial but warm — pairs with the sloth mascot and doesn't read luxury-watch-cold like Playfair. Variable axis lets us animate weight on hover (subtle on hero only).

Add new theme tokens `fontDisplay` and `--font-display` so the rest of the preset system stays consistent. Add `letterSpacing.display: "-0.015em"` and `lineHeight.display: "1.05"`.

### Spacing

Add the missing scale steps so hero sections don't have to compose `py-20 lg:py-32` manually:

```
--spacing-20: 5rem
--spacing-32: 8rem
--spacing-40: 10rem
--spacing-64: 16rem
```

### Sloth mascot

Single illustration system. Friendly, low-saturation, hand-drawn-feel SVG.

- **Style ref:** mid-2010s indie illustration — clean strokes, simple shapes, two-tone fill, no anatomical correctness. Think "Notion Friends" or Linear's pre-redesign mascot — not Duolingo's high-energy owl.
- **Color:** body in `hsl(35 25% 60%)` (warm taupe), highlights in `--primary` (violet), eye in `--foreground`. Works in both light and dark mode without re-coloring.
- **Poses (ship these 5 for launch):**
  1. **Hero sloth** — hanging from a branch (the headline is the branch), eyes half-closed, smiling. SVG, 320×320 desktop / 200×200 mobile. Floats subtly.
  2. **Reading sloth** — holding a resume. Used in empty state for `/bank`, `/documents`.
  3. **Typing sloth** — at a laptop. Used in empty state for `/studio` first-run + `/interview`.
  4. **Stretching sloth** — yawn pose. Used for `/analytics` "No data yet" + onboarding "Take it slow".
  5. **Climbing sloth** — small inline icon for the navbar logomark (replaces the Sparkles glyph).
- **Format:** raw SVG, inline (not `<img>`), so it inherits CSS variables for color. Build a `<Sloth pose="hero" />` component in `apps/web/src/components/brand/sloth.tsx`. Source files in `apps/web/public/brand/sloth-{pose}.svg` for marketing OG images.
- **OG image:** rebuild `opengraph-image.tsx` to compose the hero sloth + headline. Today it's a generic gradient (`opengraph-image.tsx`).

**Don't over-mascot.** Sloths in marketing + empty states only. The dashboard, opportunities list, and studio editor stay focused; the sloth is a guide, not a co-pilot.

### Conversion strategy

Public launch funnel:

```
[ Marketing home ]
   │  (single primary CTA: "Scan your resume free")
   ▼
[ /ats-scanner ]  ← no login. Upload PDF or paste, get score in <5s
   │  (after-score moment: "Want to save this & track applications?")
   ▼
[ Inline sign-up modal — Google OAuth ]
   │
   ▼
[ /dashboard ]
```

Changes required:

1. **Drop the second hero CTA** ("or Create a free account"). One CTA, one path. Account creation belongs at the *result* moment, not the *intent* moment.
2. **Add an after-score conversion block** to `/ats-scanner`: when the scanner returns a result, show a sticky banner: *"This scan + your fixes are gone when you close the tab. Save them?"* with a one-click Google sign-in. New component: `apps/web/src/components/ats/post-scan-cta.tsx`. Track conversion via existing analytics.
3. **Replace fake social proof.** Delete the avatar+rating block in `hero.tsx:80–113`. Replace with one of:
   - Live counter of *resumes scanned this month* (read from `ats_scan_history` table — `lib/db/schema.ts`)
   - Three real, named, asked-permission user quotes (curate from Pro waitlist mailto:)
   - A "Trusted by candidates at" company-logo strip — only if 5+ real opt-ins exist
   - If none of the above are available **at launch day**, ship nothing. Silence beats a caveat.
4. **Pricing page:** turn Pro waitlist mailto into a real `<form>` POST to `/api/waitlist` (new). Save email + UTM to a `waitlist` table. Student tier stays mailto until verification path ships.
5. **Marketing nav reordering:** Features → How It Works → Pricing. Drop Extension from primary nav (move to footer). The extension is a power-user upsell, not a launch hook.

### App-side polish (post-launch follow-up tasks, not launch-blocking)

- Dashboard: introduce a 3-row layout — Streak hero / Today + Readiness / Pipeline + Recent Opportunities (already exists), but use the new `bg-paper` for Today and Readiness so they read as a single editorial block.
- Studio: distinguish resume vs cover-letter mode via a subtle header color tint (`bg-primary/3` for resume, `bg-primary-2/3` for cover letter) and the corresponding mascot pose in the empty preview.
- Empty states: every "No X yet" block gets a sloth + a primary action button. Remove the briefcase-in-circle icon.
- Sidebar: redo the logomark to the climbing sloth. Keep nav structure as-is — it's well-organized (`sidebar.tsx`).

---

## Top 5 surfaces — prioritized

Ranked by *impact at launch* × *current quality gap*.

| Rank | Surface | Why now | Files to edit |
|---|---|---|---|
| **1** | **Marketing hero** (`/`) | First impression for every press / Product Hunt / social referral. Currently undercut by faux stats + generic Sparkles logo + zero brand personality. | `apps/web/src/app/[locale]/(marketing)/components/hero.tsx`, `components/navbar.tsx`, `apps/web/src/app/icon.svg`, new `components/brand/sloth.tsx` |
| **2** | **Brand mark + mascot system** | Foundational — unblocks every other surface. Without a sloth, "Slothing" is just a word. | New `apps/web/src/components/brand/sloth.tsx`, new `apps/web/public/brand/sloth-{pose}.svg` (×5), `apps/web/src/app/icon.svg`, `apps/web/src/app/opengraph-image.tsx`, marketing `opengraph-image.tsx` files |
| **3** | **ATS scanner result + post-scan conversion** | This is the funnel. Per `docs/COMPETITOR-ANALYSIS.md`, free ATS scanner is the highest-converting acquisition channel in this category. Today the form is bare and the post-result conversion moment is missing. | `apps/web/src/app/[locale]/(marketing)/ats-scanner/page.tsx`, `apps/web/src/components/ats/scanner-form.tsx` (extend), new `apps/web/src/components/ats/post-scan-cta.tsx` |
| **4** | **Dashboard empty + first-run state** | First impression *inside* the app. New signups who land on a blank dashboard with 0/0/0/0 KPI cards bounce. Sloth + clear next action fixes it. | `apps/web/src/app/[locale]/(app)/dashboard/page.tsx`, `apps/web/src/lib/onboarding/steps.ts`, `apps/web/src/components/skeletons/dashboard-skeleton.tsx` |
| **5** | **Pricing page** | Mailto-only Pro and Student tiers read as a single-person operation. Replacing the Pro mailto with a real waitlist form is the cheapest credibility win. | `apps/web/src/app/[locale]/(marketing)/pricing/page.tsx`, new `apps/web/src/app/api/waitlist/route.ts` (or stub), new `lib/db/schema.ts` `waitlist` table |

Surfaces 6–10 (deliberately out of scope for the launch sprint): Studio, Opportunities, Analytics empty states, Calendar, Sign-in. Polish after launch; structural redesign of these is a Q3 effort.

---

## Implementation checklist (in order)

Foundations first. **No surface work starts until step 1–3 ship.**

- [ ] **1. Tokens** — extend `apps/web/src/lib/theme/tokens.ts`: add `fontDisplay`, `primary2`, `primary2Foreground`. Add spacing steps 20/32/40/64 to `BASE_SPACING_VARIABLES`. Update `tailwind.config.ts` font + spacing extension blocks. Update existing presets in `presets/*.ts` to fill the new fields (default to current `primary` for `primary2` if not yet redesigned).
- [ ] **2. Type** — wire Fraunces via `next/font/google` in `apps/web/src/app/[locale]/layout.tsx`. Expose as `--font-display`. Update `default.ts` and `premium.ts` presets to set `fontDisplay: "var(--font-display)"`.
- [ ] **3. Sloth SVG system** — design 5 poses (hero, reading, typing, stretching, climbing). Inline-SVG React component at `apps/web/src/components/brand/sloth.tsx` with `pose` and `size` props, color inherits from CSS variables. Public SVGs in `apps/web/public/brand/`.
- [ ] **4. Logomark swap** — replace `apps/web/src/app/icon.svg` with the climbing-sloth pose, violet primary on cream rounded-square. Replace Sparkles in `navbar.tsx`, `footer.tsx`, `sign-in-card.tsx` with `<Sloth pose="climbing" size={24} />`.
- [ ] **5. Hero rewrite** — `components/hero.tsx`: hero sloth on the right (desktop) / above headline (mobile), drop second CTA, delete faux avatar block + caveat, replace synthetic dashboard preview with a real PNG screenshot of `/dashboard` captured against seed data. Keep `gradient-text` on "Your system is." line.
- [ ] **6. Features cleanup** — `components/features.tsx`: remove all 4 hardcoded gradients, switch every icon chip to `bg-primary/10 text-primary`. Tighten copy: "Career Profile / Smart Parser / AI Tailoring / ATS Scanner" → "One Profile, Every Resume / Parses What Matters / Tailors To The Job / Scores Before You Apply".
- [ ] **7. How It Works cleanup** — same gradient removal in `components/how-it-works.tsx`. Add a single illustration anchor (reading sloth).
- [ ] **8. Testimonials → Outcomes** — `components/testimonials.tsx`: drop the self-deprecating header. Replace with three plain outcome cards (no gradients). If real quotes exist, swap to quote layout; if not, keep outcomes and rename section to "What Slothing does for you".
- [ ] **9. CTA section** — `components/cta-section.tsx`: collapse to one card. Keep ATS scanner CTA; drop the duplicate "Get Started Free" card (the post-scan flow handles that now).
- [ ] **10. ATS scanner result polish** — `ats-scanner/page.tsx` + `components/ats/scanner-form.tsx`: add a result-card layout with the score breakdown laid out editorially. Show the stretching sloth on initial empty form. Add `post-scan-cta.tsx`.
- [ ] **11. Dashboard empty state** — `(app)/dashboard/page.tsx`: replace generic icon-in-circle empty state with reading-sloth + a single CTA ("Upload your first resume"). Re-use the existing onboarding step machinery (`lib/onboarding/steps.ts`).
- [ ] **12. Pricing waitlist** — replace Pro mailto with `<WaitlistForm />` posting to `/api/waitlist`. Stub `waitlist` table in `lib/db/schema.ts`.
- [ ] **13. OG images** — regenerate `apps/web/src/app/opengraph-image.tsx`, `(marketing)/opengraph-image.tsx`, and `(marketing)/pricing/opengraph-image.tsx` with hero sloth + violet/cream background.
- [ ] **14. Forbidden-color lint pass** — run `pnpm lint` after every step. The lint hard-fails CI on `bg-white`, `bg-black`, `text-gray-*`, hex/rgb inline. Use semantic tokens only.

Each numbered item is sized for one PR. None of them require schema migrations except #12 (waitlist table).

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Mascot illustration takes too long.** Custom SVG work is the only non-engineering blocker. | High | High — every other surface depends on it | Time-box the illustration to 2 days. If unfinished, ship launch with **just the climbing-sloth logomark** (simplest pose) and stretch mascot poses to a v1.1 follow-up. Hero falls back to typographic-only layout. |
| **New typography (Fraunces) hurts LCP / CLS.** Variable fonts are larger; web-font loading shifts layout. | Medium | Medium — affects Core Web Vitals on the launch page | Use `next/font/google` with `display: "swap"` and preload the display weight. Subset to Latin. Test Lighthouse on `/`, `/pricing`, `/ats-scanner` against current numbers. |
| **Theme preset migration breaks existing user themes.** Slothing has 7 theme presets and users can pick any. New `primary2` token would be undefined in user-saved themes. | Medium | Medium — visual regressions for users on `bloxy`, `glass`, `minimal`, `neon`, `earth`, `premium` | Make `primary2` optional in `ThemeTokens`. Fall back to `primary` in `apply.ts` if undefined. Update all 7 preset files in the same PR. |
| **Empty-state sloth backfires** — mascots in productivity apps can feel infantilizing (Clippy 2.0). | Medium | Medium — bounce rate up if mascot feels in-the-way | Mascot is decorative-only, never speaks, never blocks input. A11y: `aria-hidden="true"` on all decorative sloth SVGs. Mascot disappears once the user has data; it's not a permanent character. |
| **Real dashboard screenshot in hero leaks user data.** | Low | High — privacy incident if real-name profile shown | Generate screenshot against a seed dataset committed at `apps/web/scripts/seed-marketing.ts`. Names/emails are clearly fictional ("Aria Chen", "alex@example.com"). Document the seed in `docs/og-images.md`. |
| **Waitlist DB table without a billing path** — collecting emails we can't act on. | Low | Low — minor trust issue if Pro never ships | Send an auto-response from `EMAIL_FROM` confirming receipt; deliver weekly product-update emails until Pro lands. Existing `lib/email/transactional.ts` handles this. |
| **Bypass of forbidden-color lint** during the redesign push (developers reaching for `bg-white` to ship faster). | Low | High — silent regression of the T3 token migration | Don't disable the lint. Don't add `// page-width-lint-allow:` style escape hatches. Each PR runs `pnpm lint` in pre-commit + CI. |
| **Conversion redesign hurts metrics in A/B.** Removing the second CTA / faux social proof may dip top-funnel sign-ups in week 1. | Medium | Medium — but recoverable | Ship redesign as the default, but keep a `?old=1` query param feature flag for one month to allow comparison. Track `/sign-in` arrivals from `/` vs `/ats-scanner` separately. |

---

## Verification

After each step the redesign is "verified" by all of:

1. `pnpm run type-check` — strict TS across workspaces.
2. `pnpm run test:run` — full Vitest run. Existing tests for `hero.test.tsx`, `features.test.tsx`, `cta-section.test.tsx`, `pricing/page.test.tsx`, `ats-scanner/page.test.tsx`, `navbar.test.tsx`, `footer.test.tsx` will need to be updated alongside the implementation.
3. `pnpm run lint` — `next lint` + `scripts/forbidden-color-lint.cjs`. Must be zero.
4. `pnpm --filter @slothing/web test:e2e -- e2e/accessibility.spec.ts` — axe-core scan must remain zero `critical` / `serious` violations on all `AUDIT_ROUTES` (per `docs/a11y-audit-2026-05-04.md`).
5. **Manual visual review** — open `pnpm dev`, capture screenshots into `docs/visual-audit-assets/2026-05-XX/launch/` for `/`, `/pricing`, `/ats-scanner`, `/dashboard`, `/sign-in`, in both light and dark mode. Diff against the after-t9c set.
6. **Lighthouse on `/`** — must not regress more than 5 points on LCP / CLS / Performance vs baseline. Run on slow-3G profile.
7. **Real-user smoke** — on staging, complete the funnel: marketing home → ATS scanner → upload sample resume → see score → sign in via Google → land on dashboard. Should take under 90 seconds.

---

## Out of scope (intentionally)

- Studio redesign — keep the current 3-pane editor; ship cosmetic surface tints only.
- Opportunities kanban redesign — works today; rebrand later.
- Analytics chart styling — empty states get sloths, charts stay.
- Interview Prep UI — internal feature, not on the launch path.
- Mobile app — none exists; not a launch concern.
- Internationalization of new mascot copy — English-only mascot strings at launch; translation fan-out comes after the strings settle (`docs/i18n-translations.md`).

---

## Open questions for the team

1. **Is Fraunces the right display face?** Alternative: Tobias Frere-Jones's *Roslindale* (paid), or *Source Serif 4* (free, more conservative). Decide before step 2 starts.
2. **Hand-drawn vs vector-clean sloth?** Hand-drawn implies hiring an illustrator. Vector-clean can be done in-house. The plan assumes vector-clean.
3. **Real testimonials by launch day, or none?** If none, the testimonials section probably becomes a "Built for X / Y / Z" outcome block (current state, minus the apology).
4. **Slothing OR slothing.work in the wordmark?** Today the navbar shows `Slothing` only. The footer reads the same. OG title is "Slothing". Domain isn't visible anywhere except the URL bar. Consider adding `.work` as a faded suffix in the wordmark — a small commitment to the brand commitment.

---

## Appendix: file map summary

```
apps/web/
├── src/
│   ├── app/
│   │   ├── icon.svg                                          # 4: logomark swap
│   │   ├── opengraph-image.tsx                               # 13: OG regen
│   │   └── [locale]/
│   │       ├── layout.tsx                                    # 2: wire Fraunces
│   │       ├── (marketing)/
│   │       │   ├── opengraph-image.tsx                       # 13
│   │       │   ├── components/
│   │       │   │   ├── hero.tsx                              # 5
│   │       │   │   ├── features.tsx                          # 6
│   │       │   │   ├── how-it-works.tsx                      # 7
│   │       │   │   ├── testimonials.tsx                      # 8
│   │       │   │   ├── cta-section.tsx                       # 9
│   │       │   │   ├── navbar.tsx                            # 4
│   │       │   │   └── footer.tsx                            # 4
│   │       │   ├── ats-scanner/page.tsx                      # 10
│   │       │   └── pricing/page.tsx                          # 12
│   │       ├── (auth)/sign-in/sign-in-card.tsx               # 4
│   │       └── (app)/dashboard/page.tsx                      # 11
│   ├── components/
│   │   ├── brand/sloth.tsx                                   # 3: NEW
│   │   └── ats/
│   │       ├── scanner-form.tsx                              # 10
│   │       └── post-scan-cta.tsx                             # 10: NEW
│   ├── lib/
│   │   ├── theme/
│   │   │   ├── tokens.ts                                     # 1: token additions
│   │   │   └── presets/{default,bloxy,glass,minimal,neon,earth,premium}.ts  # 1
│   │   └── db/schema.ts                                      # 12: waitlist table
│   └── app/api/waitlist/route.ts                             # 12: NEW
├── public/
│   └── brand/sloth-{hero,reading,typing,stretching,climbing}.svg  # 3: NEW
└── tailwind.config.ts                                        # 1: spacing + font
```

---

*This plan is intentionally concrete — every section names files, line numbers, and acceptance criteria. The next agent or human picking it up should be able to start at step 1 without re-litigating any decision documented here.*
