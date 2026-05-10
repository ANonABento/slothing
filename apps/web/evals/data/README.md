# Tailoring Quality Benchmark Dataset

This directory contains a normalized benchmark dataset for evaluating resume tailoring quality. It includes 50 anonymized resumes, 250 job descriptions, 250 resume-to-job cases, and 25 hand-rated reference outputs.

## Files

- `resumes.json`: 50 anonymized candidate resumes.
- `jobs.json`: 250 job descriptions, five authored for each resume.
- `cases.json`: 250 pairings of `resumeId` and `jdId`.
- `references.json`: 25 gold reference outputs with rubric scores and notes.
- `schema.ts`: Zod schemas and TypeScript types for the JSON files.
- `loader.ts`: file loader plus integrity validation.

The data is normalized so resume and job text are edited once and joined by stable IDs.

## ID Conventions

- Resumes use `r-NNN`, for example `r-001`.
- Jobs use `j-NNN`, for example `j-001`.
- Cases use `c-NNN`, for example `c-001`.
- References point to cases by `caseId`.

IDs are zero-padded for stable sorting and readable diffs.

## Resume Schema

Each resume includes:

- `id`, `label`, `field`, `subfield`
- `seniorityLevel`: `new_grad`, `junior`, `mid`, `senior`, or `principal`
- `seniorityYears`
- `candidateName`, `location`
- `summary`
- `skills`
- `experience`: title, company, start/end years, and bullets
- `education`
- `projects`

The dataset covers software, data, product, design, marketing, sales, finance, operations, people, healthcare, education, legal, and media profiles across all five seniority levels.

## Job Schema

Each job description includes:

- `id`
- `resumeId`: the owning resume for the five-scenario set
- `scenario`
- `title`, `company`, `seniorityLevel`, `industry`
- `description`
- `mustHaves`
- `niceToHaves`

Every resume has exactly one job for each scenario.

## Scenario Taxonomy

- `direct_match`: same role family and seniority. Good tailoring should preserve the strongest obvious match.
- `stretch_up`: one seniority level above. Good tailoring should emphasize leadership, ownership, and scope without inventing experience.
- `adjacent_role`: sibling specialization in the same broad field. Good tailoring should recombine existing skills for a nearby role.
- `lateral_industry`: similar role in a different industry. Good tailoring should foreground transferable outcomes and domain-learning signals.
- `reach`: meaningful gap in role or seniority. Good tailoring should stay credible, avoid overclaiming, and make transferable strengths explicit.

## Reference Schema

Each reference includes:

- `caseId`
- `idealOutput`: a hand-authored summary plus 3-5 experience bullets, matching the format requested by `evals/generators.ts`
- `rubric`
- `notes`
- `ratedBy`
- `ratedAt`

The 25 references are stratified across the five scenarios, with five references per scenario.

## Rubric

Scores are integers from 1 to 5.

- `keywordAlignment`: important JD keywords appear naturally.
- `relevanceEmphasis`: the most relevant candidate evidence is promoted.
- `specificity`: bullets use concrete details and metrics where available.
- `clarity`: output is concise, readable, and recruiter-friendly.
- `atsOptimization`: role title, skills, and scenario-relevant terms are easy to parse.

Reference outputs are target examples, so the majority have all rubric scores at 4 or higher.

## Anonymization Policy

- Candidate names are synthetic.
- Companies are synthetic and intentionally generic.
- Schools use broad descriptors such as `State University` or `Regional Polytechnic`.
- Locations are city-level only.
- The dataset contains no emails, phone numbers, street addresses, personal URLs, or social handles.
- Metrics are plausible but anonymized and should not be treated as factual claims about real people or employers.

When adding data, avoid real public figures, recognizable real company names, and specific real schools.

## Loader Usage

```ts
import { loadBenchmarkDataset } from "./evals/data/loader.js";

const dataset = loadBenchmarkDataset();
console.log(dataset.resumes.length); // 50
```

`loadBenchmarkDataset(rootDir?)` reads the four JSON files, validates them with Zod, verifies counts, checks ID uniqueness, and enforces referential integrity. It throws precise errors for malformed JSON, schema failures, missing IDs, duplicate IDs, duplicate case pairs, and scenario mismatches.

## Adding A Case

1. Add or edit the resume in `resumes.json`.
2. Add exactly five jobs for that resume in `jobs.json`, one per scenario.
3. Add matching entries in `cases.json`.
4. If adding a gold reference, add it to `references.json` with rubric scores and notes.
5. Run `npm run test:run -- evals/__tests__/dataset.test.ts`.

Keep final benchmark counts aligned with the loader and tests. A future harness task can wire this dataset into `evals/harness.ts`; the current benchmark files are intentionally additive.
