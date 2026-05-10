# Evals

The eval framework exercises resume and cover-letter generation against reusable candidate/job-description cases. It runs deterministic metrics on every output and can optionally add an Anthropic judge score.

## Commands

```bash
npm run eval -- --mode=resume --limit=5
npm run eval -- --mode=cover-letter --limit=5
npm run eval -- --mode=both --limit=5
EVAL_OFFLINE=1 npm run eval -- --mode=resume --limit=5
```

Reports are written to `evals/reports/` as JSON, CSV, and Markdown.

## Environment

- `EVAL_PROVIDER`: `openai`, `anthropic`, `openrouter`, or `ollama`; defaults to `openai`.
- `EVAL_MODEL`: optional model override.
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `OPENROUTER_API_KEY`: required for remote providers.
- `EVAL_OFFLINE=1`: runs the framework without a remote LLM, using the existing deterministic resume fallback and a simple cover-letter fallback.
- `EVAL_JUDGE=1` or `--judge`: enables the optional judge. Requires `ANTHROPIC_API_KEY`; if missing, the run continues with deterministic metrics only.

## Cases And Metrics

The default cases are in `evals/test-cases.ts`. A custom JSON case file can be passed with `--cases=path/to/cases.json`.

Metrics include keyword overlap, missing-keyword coverage, output length, action-verb usage, and generator error status. Per-case generator errors are recorded in the report and do not stop the run.

## CSV Columns

The CSV report contains:

```text
case_id, case_label, mode, generator, metric, score, details, error, latency_ms
```
