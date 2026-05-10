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
http://localhost:3000/dashboard/opengraph-image
```

The response should be an `image/png` at `1200x630`. For a saved opportunity,
visit `/opportunities/<id>/opengraph-image` and confirm the title and company
appear in the generated image.
