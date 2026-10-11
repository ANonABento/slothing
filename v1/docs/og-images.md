# Open Graph Images

Slothing generates Open Graph images with Next.js metadata image routes. Each
`opengraph-image.tsx` exports `size`, `contentType`, and a default image
function that returns the shared `renderOgImage()` template from
`src/lib/og/template.tsx`.

## Copy Source

Route image copy comes from `src/lib/seo.ts` through `getOgSeo()`. Update the
page title or description there and the generated social image uses the same
copy as the page metadata.

## Adding A Route

1. Add or update the route entry in `src/lib/seo.ts`.
2. Create `opengraph-image.tsx` next to the route's `page.tsx`.
3. Export `size = OG_SIZE` and `contentType = OG_CONTENT_TYPE`.
4. Return `renderOgImage({ ...getOgSeo("routeKey"), accentIcon })`.
5. Run `npm run type-check`, `npm run test:run`, and `npm run build`.

## Locale Routing

Most app routes live under `src/app/[locale]/`. Metadata image routes in that
segment are load-bearing on `[locale]/layout.tsx` exporting
`generateStaticParams()` for every supported locale from `src/i18n.ts`. If that
function returns an empty list, Next skips the locale-specific metadata image
artifacts and URLs like `/en/dashboard/opengraph-image` 404 after a build.

Each public route should either own an `opengraph-image.tsx` next to its
`page.tsx` or intentionally inherit from a parent segment:

| Route | OG image source |
| --- | --- |
| `/` | `opengraph-image.tsx` |
| `/en` | `[locale]/(marketing)/opengraph-image.tsx` |
| `/en/ats-scanner` | `[locale]/(marketing)/ats-scanner/opengraph-image.tsx` |
| `/en/pricing` | `[locale]/(marketing)/pricing/opengraph-image.tsx` |
| `/en/dashboard` | `[locale]/(app)/dashboard/opengraph-image.tsx` |
| `/en/profile` | `[locale]/(app)/profile/opengraph-image.tsx` |
| `/en/studio` | `[locale]/(app)/studio/opengraph-image.tsx` |
| `/en/bank` | `[locale]/(app)/bank/opengraph-image.tsx` |
| `/en/answer-bank` | `[locale]/(app)/answer-bank/opengraph-image.tsx` |
| `/en/calendar` | `[locale]/(app)/calendar/opengraph-image.tsx` |
| `/en/emails` | `[locale]/(app)/emails/opengraph-image.tsx` |
| `/en/interview` | `[locale]/(app)/interview/opengraph-image.tsx` |
| `/en/salary` | `[locale]/(app)/salary/opengraph-image.tsx` |
| `/en/analytics` | `[locale]/(app)/analytics/opengraph-image.tsx` |
| `/en/settings` | `[locale]/(app)/settings/opengraph-image.tsx` |
| `/en/opportunities` | `[locale]/(app)/opportunities/opengraph-image.tsx` |
| `/en/opportunities/review` | `[locale]/(app)/opportunities/review/opengraph-image.tsx` |
| `/en/opportunities/<id>` | `[locale]/(app)/opportunities/[id]/opengraph-image.tsx` |
| `/en/privacy` | `[locale]/privacy/opengraph-image.tsx` |
| `/en/terms` | `[locale]/terms/opengraph-image.tsx` |
| `/en/sign-in` | Inherits from the locale root image |

## Dynamic Opportunity Images

`/opportunities/[id]/opengraph-image` looks up the opportunity title and
company with `getJobByIdAnyUser()` so shared URLs render useful previews for
social crawlers. It intentionally falls back to the generic Opportunities image
when an ID is missing or stale.

## Color Lint Exemption

`next/og` renders JSX with Satori. It cannot read Tailwind classes, CSS
variables, or app stylesheets, so the OG template must use inline color values.
`scripts/forbidden-color-lint.cjs` exempts only `opengraph-image.tsx`,
`twitter-image.tsx`, and `src/lib/og/` files.

## Local Verification

After `npm run dev`, visit:

```txt
http://localhost:3000/en/dashboard/opengraph-image
```

The response should be an `image/png` at `1200x630`. For a saved opportunity,
visit `/en/opportunities/<id>/opengraph-image` and confirm the title and
company appear in the generated image.
