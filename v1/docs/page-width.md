# App Page Widths

Authenticated app pages should use the shared page-layout primitives at their default wide width. `PageHeader`, `PageContent`, and `PageShell` already default to `wide`, which maps to `max-w-screen-2xl`.

Use `narrow` only for intentionally centered flows such as auth, onboarding, or single-card setup screens. For long-form copy inside an otherwise wide page, keep the page wide and apply `max-w-prose` to the text container.

`npm run lint` runs `scripts/page-width-lint.cjs`, which flags `width="narrow"` in `src/app/(app)/**/page.tsx`. If a page must opt out, add a same-line directive with the reason:

```tsx
<PageContent width="narrow" /* page-width-lint-allow: intentional reading mode */>
```

Follow-up: after the interview width task lands, extend the lint to flag inline `max-w-2xl` through `max-w-7xl` page caps and prefer `max-w-prose` for prose blocks.

## Width Audit

| Route file | Current PageHeader/Content width | Recommended | Action |
|---|---|---|---|
| `analytics/page.tsx` | wide (default) | wide | keep |
| `answer-bank/page.tsx` | wide (default) | wide | keep |
| `bank/page.tsx` | wide (default) | wide | keep |
| `builder/page.tsx` | redirect to /studio | NA | keep |
| `calendar/page.tsx` | wide (default) | wide | keep |
| `cover-letter/page.tsx` | redirect to /studio | NA | keep |
| `dashboard/page.tsx` | `PageShell` wide default plus `CenteredPagePanel` for onboarding-needed branch | wide / narrow centered | keep |
| `documents/page.tsx` | redirect to /bank | NA | keep |
| `emails/page.tsx` | wide (default) | wide | keep |
| `extension/connect/page.tsx` | `CenteredPagePanel` intentionally narrow centered card | narrow | keep |
| `interview/page.tsx` | wide explicit plus inline `max-w-4xl` on PageContent | wide, no inline cap | NA, owned by task `bd2c2cee` |
| `jobs/page.tsx` | redirect to /opportunities | NA | keep |
| `opportunities/page.tsx` | wide (default) | wide | keep |
| `opportunities/[id]/page.tsx` | wide on main; previously narrow on not-found empty state | wide everywhere | changed |
| `opportunities/[id]/research/page.tsx` | previously narrow on header, main content, and not-found empty state | wide | changed |
| `opportunities/review/page.tsx` | previously narrow on disabled empty state; main custom layout | wide on empty state | changed |
| `profile/page.tsx` | wide explicit | wide | keep |
| `salary/page.tsx` | wide (default) | wide | keep |
| `settings/page.tsx` | wide explicit | wide | keep |
| `studio/page.tsx` | `PageWorkspace` full-screen, no width prop | full-screen | keep |
| `tailor/page.tsx` | redirect to /studio | NA | keep |
| `upload/page.tsx` | redirect to /bank | NA | keep |
| `(auth)/sign-in/page.tsx` | `CenteredPagePanel` | narrow | keep, outside `(app)` lint scope |
| `(marketing)/**` | per-section custom max widths | varies | keep, outside `(app)` lint scope |
| `privacy/page.tsx`, `terms/page.tsx`, `not-found.tsx` | static legal/error pages with narrow custom containers | narrow | keep, outside `(app)` lint scope |
