# Global / cross-cutting findings — loop 001

Bugs that affect every route or appear in framework-level files (middleware, locale layout, shared providers). These are deduped here so per-route findings can stay focused.

## High

### [G-H1] CSP nonce hydration mismatch on every page render

**Where:** `apps/web/src/app/[locale]/layout.tsx:78,93` + `apps/web/src/middleware.ts:74-99` + `apps/web/src/lib/security/headers.ts:21-25`

**Symptom:** Every captured route emits a console error:
```
Warning: Prop `nonce` did not match. Server: "<32-char hex>" Client: "null"
```

**Root cause:** Middleware generates a fresh nonce per request and stuffs it in a request header (`x-csp-nonce`). The locale layout (`layout.tsx:78`) reads `headers().get(CSP_NONCE_HEADER)` and passes it to a `<script nonce={nonce}>` tag. On the client during hydration, React reads the live DOM nonce attribute and compares it against the nonce React used during server render — but Next 14 strips/rewrites the nonce attribute on inline scripts in dev mode, so the client sees `null` while the server printed a real nonce.

The CSP itself doesn't even use the nonce in dev (`headers.ts:23-25` falls back to `'unsafe-inline'` + `'unsafe-eval'` when `NODE_ENV !== production`), so emitting the nonce in dev contributes nothing while polluting every page with a hydration warning that masks real warnings.

**Fix:** Only set the `nonce` prop on the inline script when running in production (where the CSP actually uses it). In dev, omit the prop entirely:

```tsx
const nonce = process.env.NODE_ENV === "production"
  ? requestHeaders.get(CSP_NONCE_HEADER) ?? undefined
  : undefined;
// ...
<script {...(nonce ? { nonce } : {})} dangerouslySetInnerHTML={...} />
```

Production behavior is preserved; the dev hydration warning disappears and we recover the signal value of the console.

---

### [G-H2] `hreflang` lowercase DOM prop — invalid React attribute warning on every page

**Where:** `apps/web/src/app/[locale]/layout.tsx:62`

**Symptom:**
```
Warning: Invalid DOM property `hreflang`. Did you mean `hrefLang`?
```

**Root cause:**
```tsx
{...({ hreflang: language } as Record<string, string>)}
```

The cast was added specifically to suppress TypeScript so a lowercase `hreflang` could be spread onto `<link>`. React only recognizes the camelCase `hrefLang` prop and warns when an unknown lowercase one is set. The cast was working around the wrong end of the problem.

**Fix:** Use the proper React prop. The cast becomes unnecessary:
```tsx
<link
  key={`hreflang-${language}`}
  rel="alternate"
  href={new URL(href, metadataBase).toString()}
  hrefLang={language}
/>
```

React serializes `hrefLang` to the lowercase `hreflang` attribute automatically — that's the entire point of the camelCase mapping.

---

## Medium

### [G-M1] Missing intl messages: `interview.quickPractice.categories.cultural-fit`

**Where:**
- Caller: `apps/web/src/components/interview/quick-practice-dialog.tsx:83` does `t(\`categories.${category}\`)`.
- Source of `category` enum: `apps/web/src/lib/constants/interview.ts:65,85` — `["behavioral", "technical", "situational", "general", "cultural-fit"]`.
- Translation files: `apps/web/src/messages/en.json:484-491` plus 7 other locale files.

**Symptom:** Loading `/en/interview` and opening Quick Practice with the `cultural-fit` category prints `IntlError: MISSING_MESSAGE: Could not resolve interview.quickPractice.categories.cultural-fit in messages for locale en` and renders the raw key as fallback text.

**Root cause:** The translation map and the code enum drifted. Translations contain `behavioral, technical, situational, company, system-design, general` (6 keys, 2 unused). Code uses `behavioral, technical, situational, general, cultural-fit` (5 keys). `cultural-fit` is missing from translations; `company` and `system-design` are orphan translations the runtime will never look up.

**Fix:** Reconcile to the single source of truth (`SESSION_QUESTION_CATEGORIES` in `lib/constants/interview.ts`). Add `cultural-fit` to all 8 locale files; remove `company` and `system-design` from the `interview.quickPractice.categories` block in all 8 locales.

A unit test that asserts `Object.keys(messages.interview.quickPractice.categories).sort()` matches `[...SESSION_QUESTION_CATEGORIES].sort()` would prevent the next drift.

---

### [G-M2] Routes load with high background API failure noise (dev-env only)

**Where:** Console errors across the app pages — 75 `500 Internal Server Error` on `/dashboard`, 45 on `/settings`, 27 on `/calendar`, 22 on `/upload`, etc.

**Symptom:** In a fresh dev environment without LLM API keys, Google credentials, or seeded data, app pages aggressively poll APIs that 500. The user-visible UI still renders (status: ok in `run-summary.json`), but the console is flooded.

**Root cause:** Likely a combination of: missing env vars short-circuiting API handlers, missing user data causing query joins to fail, and unconditional client-side polling for stats/insights/notifications.

**Fix decision:** Out of scope for the visual UI loop. Capture as a TODO in `docs/ui-audit/loop-001/summary.md` for the dogfood loop (separate workstream, see `docs/audits/dogfood-2026-05-13/`). The visual loop will continue to ignore these.

We *will* care if any of these 500s manifest as broken UI states (missing skeleton, broken empty card, eternal spinner). Per-route audit agents will flag those individually.

---

## Low

(none for global)
