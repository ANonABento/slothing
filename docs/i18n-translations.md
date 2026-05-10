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
