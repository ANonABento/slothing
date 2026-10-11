# `sign-in` — `/en/sign-in`

**Source:** `apps/web/src/app/[locale]/(auth)/sign-in/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 004

## Screenshots

- 1280: `../screenshots/sign-in-1280.png`
- 1440: `../screenshots/sign-in-1440.png`
- 1920: `../screenshots/sign-in-1920.png`

> Audited screenshots show the **`AuthDisabledCard`** state (no Google OAuth credentials configured).

## Findings

### High

- _None._

### Medium

- **[M1]** [FIXED] Auth route now has minimal branded chrome — a Slothing wordmark (Rocket icon + "Slothing") sits above the card on all 3 widths, addressing the "no branding outside the card" complaint.
- **[M2]** [STILL] Logo icon inconsistency persists — sign-in uses `Rocket` while marketing nav/footer use `Sparkles`. Three places, two icons.
- **[M3]** [STILL] Ambient-blur background gradient in sign-in still duplicates the home hero's washes; no shared `<AmbientBackground />` component.
- **[M4]** [FIXED] The "Continue to dashboard (dev mode)" primary CTA is no longer rendered as a primary purple button — `AuthDisabledCard` now shows neutral "Contact your administrator" copy with a separate outline-styled `← Back to home` link below the card. Read order no longer encourages the dev-only escape hatch.

### Low

- **[L1]** [STILL] Env-var inline `<code>` wrapping still awkward at 1280 (`GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET , NEXTAUTH_SECRET . See .env.example`) — visible space-comma artifacts and breaks mid-list.
- **[L2]** [STILL] At 1920 card sits at vertical center with empty viewport below — intentional design.

## Cross-cutting observations

- The minimal branded header is exactly what the loop-001 cross-cutting note recommended.
- `Rocket` vs `Sparkles` standardization still pending.
- No dialogs render on sign-in (loop-003 dialog-animation fix N/A here).

## Console / runtime

(0 console errors at all 3 widths.)
