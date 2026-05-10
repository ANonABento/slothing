# Eval Harness

The eval harness runs deterministic resume-tailoring and cover-letter checks against the benchmark dataset in `evals/data/`.

## Dataset

The default dataset has 50 anonymized resumes, 250 job descriptions, and 250 resume-to-job benchmark cases. Each resume has five job descriptions, one for each scenario:

- `direct_match`
- `stretch_up`
- `adjacent_role`
- `lateral_industry`
- `reach`

`evals/data/cases.json` is the source of truth for harness runs. The legacy `evals/test-cases.ts` fixture remains only as a fallback if the benchmark JSON files are missing.

## Running Evals

Use offline mode for deterministic local runs:

```sh
EVAL_OFFLINE=1 npm run eval
EVAL_OFFLINE=1 npm run eval -- --cases=20
EVAL_OFFLINE=1 npm run eval -- --case-ids=c-001
EVAL_OFFLINE=1 npm run eval -- --mode=cover-letter --cases=10
```

Flags:

- `--cases=N`: run the first N benchmark cases. Defaults to 20 and caps at 250.
- `--case-ids=c-001,c-002`: run specific benchmark cases by ID. This overrides `--cases`.
- `--mode=resume|cover-letter|both`: choose which generator path to run. Defaults to `both`.
- `--cases-file=path`: load a legacy flat `EvalCase[]` JSON or TypeScript module.
- `--out=path`: choose the report output directory.

Reports are written to `evals/reports/` by default in JSON, CSV, and Markdown formats. Markdown reports include the sampled count, for example `Cases: 20 of 250`.

## Adding Cases

Follow the add-a-case workflow in `evals/data/README.md`. In short, update `resumes.json`, add exactly five matching jobs in `jobs.json`, add the pairings in `cases.json`, optionally add gold references in `references.json`, then run:

```sh
npm run test:run -- evals/__tests__/dataset.test.ts
```

Keep the loader counts, IDs, and scenario coverage aligned with the dataset tests.
