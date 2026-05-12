# Testing

## Playwright Suites

This repo has two Playwright suites that must stay isolated:

- The root app suite runs from `e2e/` and `tests/e2e/` with the root `@playwright/test` install.
- The Chrome extension suite runs from `columbus-extension/tests/` with the extension package's own `@playwright/test` install.

Playwright throws `Requiring @playwright/test second time` when one Node process loads two copies of the package. Any subproject with a nested `node_modules/@playwright/test` must be added to the root `playwright.config.ts` `testIgnore` list. Today that list excludes `columbus-extension/`; add a new glob there before introducing another Playwright workspace.

## Smoke E2E

CI runs a small Chromium-only root smoke set with `npm run test:e2e -- --project=chromium --grep "@smoke"`. Keep the smoke set to about five tests so the gate stays fast. Add or remove a smoke test by editing the leaf test title to include or remove `@smoke`.

Current smoke coverage:

- `homepage loads successfully @smoke` checks the public landing route boots.
- `protected pages are accessible with auth bypass (no NextAuth keys) @smoke` checks app routes do not redirect to sign-in in the local auth-bypass mode.
- `should navigate to Document Studio page @smoke` checks sidebar navigation reaches Studio.
- `should navigate to Settings page @smoke` checks sidebar navigation reaches Settings.

## Local Commands

- `npm run test:e2e` runs the full root Playwright suite across all configured projects.
- `npm run test:e2e -- --grep "@smoke"` runs the root smoke set locally.
- `npm run test:e2e -- --list` verifies root spec discovery; it should list zero `columbus-extension/` specs.
- From `columbus-extension/`, `npm run test:e2e` runs the extension suite separately.

## CI Gates

`.github/workflows/ci.yml` runs the `quality-gates` matrix for type-check, Vitest, and lint. It also runs `e2e-smoke` for the root Playwright smoke gate. `.github/workflows/extension-e2e.yml` owns the extension Playwright suite. The full root E2E suite remains a local or manual check.
