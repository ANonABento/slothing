# `sign-in` — `/en/sign-in`

**Source:** `apps/web/src/app/[locale]/(auth)/sign-in/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/sign-in-1280.png`
- 1440: `../screenshots/sign-in-1440.png`
- 1920: `../screenshots/sign-in-1920.png`

## Findings

> Audited screenshots show the **`AuthDisabledCard`** state (running without Google OAuth credentials configured). The `SignInCard` (configured-auth state) was not exercised; the visual layout primitives are similar (`max-w-md` card on a gradient bg).

### High

- _None._ The disabled-auth card centers correctly, the CTA (`Continue to dashboard (dev mode)`) is visible, and the `Back to home` link is present.

### Medium

- **[M1]** Auth route has no navbar/footer — same as privacy/terms. `(auth)/` route group has no `layout.tsx` (`apps/web/src/app/[locale]/(auth)/`), so it falls through to `[locale]/layout.tsx` which has none. Less critical than privacy/terms because the sign-in page is a focused-task screen (intentional design), but still: there's no "Slothing" wordmark/logo in the chrome — the only branding is the in-card `<Rocket /> Slothing` block (`sign-in-card.tsx:30-43`). Users can't tell they're on slothing.work without reading the logo. Width: all.
- **[M2]** Sign-in card uses `Rocket` icon (`sign-in-card.tsx:36`) for the Slothing wordmark; the marketing navbar uses `Sparkles` (`navbar.tsx:48`); the marketing footer uses `Sparkles` (`footer.tsx:30`). Three "logo icon" choices in three places. Pick one. Width: all.
- **[M3]** Ambient-blur background (`bg-gradient-to-br from-background via-background to-muted` plus two blurred `bg-gradient-to-bl from-primary/8` blobs, `sign-in/page.tsx:23-28`) is a duplicate of the home hero's ambient washes (`hero.tsx:34-35`). Should be a shared `<AmbientBackground />` component. Width: all.
- **[M4]** "Continue to dashboard (dev mode)" button in `AuthDisabledCard` is the only marketing/auth surface where a destructive-looking warning (red triangle, "Sign-in is disabled") leads into a primary CTA. The CTA reads as the recommended action even though it's a dev-only escape hatch. In production this card should arguably not render at all — but if it does, the CTA should be `variant="outline"` not the primary purple. Width: all.

### Low

- **[L1]** The hero subhead in `AuthDisabledCard` (`sign-in-card.tsx:59-72`) lists env var names in inline `<code>` style, but the wrapping is `inline-flex flex-wrap justify-center gap-x-1` — at 1280 this wraps awkwardly between `GOOGLE_CLIENT_ID` and the comma. Cosmetic. Width: 1280, 1440.
- **[L2]** At 1920 the card sits at vertical center of a 900px-tall viewport, leaving a large empty page below. No issue (this is the intended sign-in design), but mentioning here to confirm it's intentional rather than a layout bug. Width: 1920.

## Cross-cutting observations

- **Auth routes don't share the marketing `<Navbar />` but should at least have a thin branded header.** Right now the only way to confirm you're on Slothing is the in-card logo. A minimal `(auth)/layout.tsx` with a centered logo + "Back to slothing.work" link would unify the experience.
- **Logo icon inconsistency (`Sparkles` vs `Rocket`)** is repeated across the codebase. Worth grepping for `<Rocket` and `<Sparkles` inside header/logo contexts and standardizing on one.
- **Ambient background gradient is replicated in 3+ places** (`hero.tsx:34-35`, `sign-in/page.tsx:25-28`, `cta-section.tsx:22-25`). Extract to `<AmbientGradient variant="primary|hero|auth" />`.

## Console / runtime

(None observed; auth disabled is the running state.)
