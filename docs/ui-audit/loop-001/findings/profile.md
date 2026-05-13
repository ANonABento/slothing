# `profile` — `/en/profile`

**Source:** `apps/web/src/app/[locale]/(app)/profile/page.tsx`
**Widths audited:** 1280 / 1440 / 1920
**Loop:** 001

## Screenshots

- 1280: `../screenshots/profile-1280.png`
- 1440: `../screenshots/profile-1440.png`
- 1920: `../screenshots/profile-1920.png`

## Cross-cutting observations

- **Profile is the only authenticated app page that mixes `<Card>` / `<CardHeader>` / `<CardTitle>` for its section wrappers** (`apps/web/src/app/[locale]/(app)/profile/page.tsx:571-999`). Every Identity / Contact / Summary / Saved signals / Career details / Work style / Target roles / Salary / Privacy block is a hand-rolled `<Card><CardHeader><CardTitle><CardDescription>...<CardContent>...` — ~10 copies of the same pattern in one file. Settings, by contrast, uses `<PageSection>` / `<PagePanel>` consistently (see `settings.md`). There is a `PageSection` primitive already in `apps/web/src/components/ui/page-layout.tsx:311-340` that takes `title` / `description` / `icon` / `action` and would collapse all of these into one-liners. This is the single biggest DRY opportunity in the audit set.
- **Profile uses `<PageHeader>` (the bordered banner)** — consistent with settings and most app pages, inconsistent with `dashboard` which uses `InsetPageHeader`. See `_global.md`.
- The page-level layout (sidebar 320px + content `minmax(0,1fr)` at `lg`) is sound; the sidebar/main split holds at all 3 widths.
- The same `max-w-screen-2xl` (no `mx-auto`) cap from `PageContent` leaves a wide right gutter at 1920 — same systemic issue as dashboard/settings.

## Findings

### High

- **[H1]** "Could not load profile" red alert is rendered alongside the full editor at all 3 widths. `apps/web/src/app/[locale]/(app)/profile/page.tsx:448-452` — when `error` is set and `loading === false`, the page still renders the entire form with empty fields plus a red error band. With dev 500s this looks like a half-broken form: discard/save buttons enabled, completeness card showing `0% complete · 9 quick wins available` as if real, identity/avatar tile reading "Your name". A first-time user would think the app is broken. Either the error state should replace the form (matching the empty state) or the action buttons + sidebar should be disabled and the completeness card hidden. Visible at 1280, 1440, 1920.

### Medium

- **[M1]** ~10 copies of the same `<Card><CardHeader><CardTitle class="text-xl"><CardDescription>...</CardHeader><CardContent>` wrapper in one file — Identity (line 571), Contact (615), Summary (698), Saved Signals (721), Career Details (776), Work Style (837), Target Roles (866), Salary (894), Privacy (945). Replace with the existing `<PageSection>` primitive. `apps/web/src/app/[locale]/(app)/profile/page.tsx:571-999`. Affects all widths.
- **[M2]** Section "card" styling is visually different from settings sections. Profile uses base `<Card>` (no left icon tile, h2 only); settings sections built on `<PageSection>` consistently render an icon tile + title (`apps/web/src/components/ui/page-layout.tsx:323-334`). Result: profile sections feel "older" than settings sections in the same app shell. Pick one section pattern and use it everywhere.
- **[M3]** "Want richer profile details? Save reusable stories…" prompt is a hand-rolled bar with `border bg-card/70 p-4` (`apps/web/src/app/[locale]/(app)/profile/page.tsx:453-458`) sitting between the page header and the body. It's effectively a fourth header element after `PageHeader`, the error band, and the CompletenessCard — visually it stacks. At 1280 the row collapses to two stacked rows (label + button). Could either become a `PagePanel` with a callout variant, or be promoted into the `PageHeader` `actions` slot.
- **[M4]** At 1920, the entire profile content is left-aligned because `PageContent`'s `wide` cap (`max-w-screen-2xl`, no `mx-auto`) leaves a wide right gutter. Same systemic issue as dashboard/settings — see `_global.md`.
- **[M5]** Tab list is built ad-hoc (`role="tablist"` + 3 `<button role="tab">`s in a `grid gap-2 rounded-md border bg-card p-2`) at `apps/web/src/app/[locale]/(app)/profile/page.tsx:539-565`. There is no shared `Tabs` primitive used here, even though Settings doesn't use tabs and the rest of the app sometimes uses inline tab patterns too. Not a render bug, but it's the kind of thing that should live in `components/ui/tabs.tsx` if it doesn't already, since the styling will inevitably drift.

### Low

- **[L1]** "Save changes" button is in `disabled` state (`!isDirty || saving`) at first paint and uses primary styling. Combined with the red error band immediately below it, the disabled-but-prominent button reads slightly oddly. Cosmetic.
- **[L2]** The sidebar avatar circle (`h-24 w-24 rounded-full border bg-primary text-3xl ... text-primary-foreground`, `apps/web/src/app/[locale]/(app)/profile/page.tsx:491`) fills with a giant solid `bg-primary` "P" before the user has typed a name. At 1280 this is a striking purple disc above empty form fields — could fall back to a softer `bg-muted` when initials are derived from the placeholder.

## Console / runtime

- React hydration `nonce` mismatch (cross-cutting — see `_global.md`). One per width.
- 3× `Failed to load resource: 500` per width (profile + streak fetches in dev). These produce H1's "Could not load profile" banner, but the UI bug (still showing the full editor) is not just a dev artefact — it would happen for any 500.
- No `IntlError` missing-message warnings observed for `profile` namespace.
