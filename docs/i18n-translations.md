# i18n Message Translations

The web app message catalogs live in `apps/web/src/messages`. English is the
source of truth, and every non-English locale should be refreshed from
`en.json` with the translation script.

## Provider

`apps/web/scripts/translate-messages.ts` uses Anthropic by default:

```sh
cd apps/web
ANTHROPIC_API_KEY=... pnpm translate:messages
```

The default model is `claude-haiku-4-5-20251001`. Override it with
`TRANSLATE_ANTHROPIC_MODEL` when needed.

If `ANTHROPIC_API_KEY` is not set, the script falls back to OpenAI:

```sh
cd apps/web
OPENAI_API_KEY=... pnpm translate:messages
```

The OpenAI fallback model is `gpt-4o-mini`, configurable through
`TRANSLATE_OPENAI_MODEL`.

The script refuses to run without either API key so it cannot silently rewrite
locale files as English fallback copies.

## Refreshing

Before using a provider key, make sure the local validators are healthy:

```sh
cd apps/web
pnpm check:translations:preflight
```

`check:translations` may warn about existing `[locale] ...` placeholders until
the provider refresh is complete, but it should report zero missing keys, zero
extra keys, and zero ICU errors. `check:translations:generator` exercises the
provider-output validator without calling a provider. `check:translations:report`
keeps the markdown placeholder audit in sync with the catalog files.

Refresh all non-English locale files:

```sh
cd apps/web
pnpm translate:messages
```

Refresh one or more locales:

```sh
cd apps/web
pnpm translate:messages --locales=fr
pnpm translate:messages --locales=es,pt-BR,hi
```

Preview the changed-string counts without writing files:

```sh
cd apps/web
pnpm translate:messages --dry-run
```

After translating, review the locale JSON diffs before accepting them. A safe
refresh must satisfy all of these:

- `_meta.source`, `_meta.model`, and `_meta.generatedAt` are present in each
  changed locale.
- Brand terms and pinned passthrough keys stayed unchanged.
- ICU arguments such as `{count}`, `{name}`, `{title}`, and plural/select
  selectors stayed structurally valid.
- The translations read like in-product UI text, not literal machine output.
- No `[locale] ...` placeholder prefixes remain.
- No unexpected target string is still identical to the English source. Brand
  terms and pinned passthrough keys are allowlisted by the checker.
- No wrong-language fragments are present in locales with known bleed risks,
  such as Portuguese words in Spanish or Spanish words in Brazilian Portuguese.

Then run the release gate:

```sh
cd apps/web
pnpm check:translations:update-report
pnpm check:translations:release
pnpm test:run
```

`check:translations:strict` is expected to fail before a provider refresh while
placeholder strings remain. `check:translations:release` runs strict
placeholder enforcement, strict identical-to-English enforcement, generator
validation, and placeholder-report verification. It must pass before treating
localization as release-ready.
Commit the updated locale JSON files together with the refreshed
`docs/audits/dogfood-2026-05-13/translation-placeholders.md` report.

Expected latency is usually 5-15 seconds per locale. Expected cost is roughly
$0.02-$0.10 per locale with the default Anthropic model.

## Pinned Phrases

Some phrases should not be translated. The script always preserves:

- `nav.brand`
- `settings.language.options.*`
- Brand and integration names such as Slothing, ATS, GitHub, WaterlooWorks,
  LinkedIn, Indeed, Greenhouse, Lever, Devpost, URL, Kanban, and LLM

To pin a locale-specific wording, add a dot-path entry to `localeOverrides` in
`apps/web/scripts/translate-messages.ts`. Overrides are applied after the LLM
translation, so human-reviewed phrasing wins.

Each generated locale file records `_meta.source`, `_meta.model`, and
`_meta.generatedAt` for auditability.

## Drift Checks

Run the standalone guardrail before sending translation-related changes:

```sh
cd apps/web
pnpm check:translations
```

The check compares every non-English catalog against `en.json`. Missing or
extra keys fail the command. ICU argument mismatches also fail the command so a
translated catalog cannot drop or invent runtime placeholders. Strings that are
still identical to English are reported as warnings, excluding pinned
passthrough paths, standalone brand terms, and strings with no translatable
letters. Known wrong-language fragments, such as Portuguese copy in Spanish,
also fail the command.

Additional guardrails:

```sh
cd apps/web
pnpm check:translations:generator
pnpm check:translations:update-report
pnpm check:translations:report
pnpm check:translations:strict
pnpm check:translations:release
```

- `check:translations:generator` self-tests the provider-output validator. It
  fails if missing ICU arguments, invented ICU arguments, unbalanced braces,
  changed passthrough keys, or missing protected brand terms would be accepted.
- `check:translations:report` verifies
  `docs/audits/dogfood-2026-05-13/translation-placeholders.md` is current.
- `check:translations:update-report` regenerates that markdown audit after a
  provider refresh.
- `check:translations:strict` fails while any `[locale] ...` placeholder string
  remains.
- `check:translations:release` also fails while any unexpected target string is
  identical to the English source, so a provider refresh cannot pass by merely
  stripping placeholder prefixes.
- `check:translations:release` combines strict placeholder enforcement with the
  strict identical-string check, generator and report checks for the final
  post-refresh gate.

`pnpm test` also runs the drift check before Vitest, and CI has a dedicated
translation drift job. If CI fails with missing or extra keys, refresh the
catalogs with `pnpm translate:messages`, commit the changed locale JSON files,
and re-run `pnpm check:translations`.

## Automatic Fanout

Changes to `apps/web/src/messages/en.json` trigger the `i18n fanout` GitHub
Actions workflow. The workflow runs `pnpm translate:messages` with
`ANTHROPIC_API_KEY` or `OPENAI_API_KEY`, validates the result, and then:

- commits the generated locale changes back to same-repository pull request
  branches, or
- opens an `i18n-fanout` pull request after `main` receives an English catalog
  change.

Add `[skip-i18n]` to a commit message, pull request title, or pull request body
to skip the fanout workflow for a known-safe change. Forked pull requests still
rely on the CI drift check because repository secrets are not exposed there.
