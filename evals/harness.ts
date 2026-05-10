import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { loadEvalCasesFromBenchmark } from "./data/to-eval-cases.js";
import {
  createCoverLetterGenerator,
  createTailorGenerator,
} from "./generators/index.js";
import { getEvalLLMConfig, hasJudgeKey } from "./llm-config.js";
import { judgeSingle } from "./judge.js";
import { writeReports } from "./report.js";
import { runEval } from "./run.js";
import type { EvalCase, EvalMode, EvalRunReport } from "./types.js";

const DEFAULT_CASE_LIMIT = 20;
const MAX_CASE_LIMIT = 250;

interface CliOptions {
  mode: EvalMode | "both";
  judge: boolean;
  casesFile?: string;
  caseIds?: string[];
  outDir: string;
  casesLimit: number;
  casesLimitProvided: boolean;
}

interface LoadedCases {
  cases: EvalCase[];
  datasetTotal: number;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    mode: "both",
    judge: process.env.EVAL_JUDGE === "1",
    outDir: path.join(path.dirname(fileURLToPath(import.meta.url)), "reports"),
    casesLimit: DEFAULT_CASE_LIMIT,
    casesLimitProvided: false,
  };

  for (const arg of argv) {
    if (arg === "--judge") options.judge = true;
    else if (arg.startsWith("--mode=")) {
      options.mode = arg.slice("--mode=".length) as CliOptions["mode"];
    } else if (arg.startsWith("--cases=")) {
      options.casesLimit = parseCasesLimit(
        arg.slice("--cases=".length),
        "--cases",
      );
      options.casesLimitProvided = true;
    } else if (arg.startsWith("--cases-file=")) {
      options.casesFile = arg.slice("--cases-file=".length);
    } else if (arg.startsWith("--case-ids=")) {
      options.caseIds = parseCaseIds(arg.slice("--case-ids=".length));
    } else if (arg.startsWith("--out=")) {
      options.outDir = arg.slice("--out=".length);
    } else if (arg.startsWith("--limit=")) {
      console.warn("--limit is deprecated; use --cases=N instead.");
      options.casesLimit = parseCasesLimit(
        arg.slice("--limit=".length),
        "--limit",
      );
      options.casesLimitProvided = true;
    }
  }

  if (!["resume", "cover-letter", "both"].includes(options.mode)) {
    throw new Error("--mode must be resume, cover-letter, or both");
  }

  return options;
}

function parseCasesLimit(value: string, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

function parseCaseIds(value: string): string[] {
  const ids = value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (ids.length === 0) {
    throw new Error("--case-ids must include at least one case id");
  }
  return ids;
}

function normalizeCaseId(id: string): string {
  return id.replace(/^tc-(\d{3})$/, "c-$1");
}

function isMissingDatasetError(error: unknown): boolean {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT",
  );
}

async function loadFallbackCases(): Promise<EvalCase[]> {
  const mod = await import("./test-cases.js");
  return mod.RESUME_EVAL_CASES;
}

async function loadCases(casesFile?: string): Promise<LoadedCases> {
  if (!casesFile) {
    try {
      const cases = loadEvalCasesFromBenchmark();
      return { cases, datasetTotal: cases.length };
    } catch (error) {
      if (!isMissingDatasetError(error)) throw error;
      console.warn(
        "Benchmark dataset is missing; falling back to deprecated evals/test-cases.ts.",
      );
      const cases = await loadFallbackCases();
      return { cases, datasetTotal: cases.length };
    }
  }

  const absolutePath = path.resolve(casesFile);
  if (absolutePath.endsWith(".json")) {
    const cases = JSON.parse(
      fs.readFileSync(absolutePath, "utf8"),
    ) as EvalCase[];
    return { cases, datasetTotal: cases.length };
  }

  const mod = (await import(pathToFileURL(absolutePath).href)) as {
    default?: EvalCase[];
    TEST_CASES?: EvalCase[];
    RESUME_EVAL_CASES?: EvalCase[];
  };
  const cases = mod.default ?? mod.RESUME_EVAL_CASES ?? mod.TEST_CASES ?? [];
  return { cases, datasetTotal: cases.length };
}

function selectCases(cases: EvalCase[], options: CliOptions): EvalCase[] {
  if (options.caseIds) {
    if (options.casesLimitProvided) {
      console.warn("--case-ids was provided; ignoring --cases/--limit.");
    }

    const requested = new Set(options.caseIds.map(normalizeCaseId));
    const selected = cases.filter((testCase) => requested.has(testCase.id));
    const selectedIds = new Set(selected.map((testCase) => testCase.id));
    const missing = options.caseIds.filter(
      (id) => !selectedIds.has(normalizeCaseId(id)),
    );

    if (missing.length > 0) {
      throw new Error(`Unknown case id(s): ${missing.join(", ")}`);
    }

    return selected;
  }

  if (options.casesLimit > MAX_CASE_LIMIT) {
    console.warn(
      `--cases=${options.casesLimit} exceeds ${MAX_CASE_LIMIT}; running ${MAX_CASE_LIMIT} case(s).`,
    );
  }

  return cases.slice(
    0,
    Math.min(options.casesLimit, MAX_CASE_LIMIT, cases.length),
  );
}

async function runMode(
  mode: EvalMode,
  cases: EvalCase[],
  datasetTotal: number,
  options: CliOptions,
): Promise<EvalRunReport> {
  const llmConfig = getEvalLLMConfig();
  const generator =
    mode === "resume"
      ? createTailorGenerator(llmConfig)
      : createCoverLetterGenerator(llmConfig);
  const generatorName = mode === "resume" ? "tailor" : "cover-letter";
  const judge =
    options.judge && hasJudgeKey()
      ? (testCase: EvalCase, output: Awaited<ReturnType<typeof generator>>) =>
          judgeSingle(testCase, output)
      : undefined;

  if (options.judge && !hasJudgeKey()) {
    console.warn(
      "Judge requested, but ANTHROPIC_API_KEY is not set. Continuing with deterministic metrics only.",
    );
  }

  console.log(
    `Running ${mode} eval on ${cases.length} of ${datasetTotal} case(s)...`,
  );
  const report = await runEval({
    cases,
    mode,
    generatorName,
    generator,
    judge,
    datasetTotal,
  });
  const paths = writeReports(report, options.outDir);
  console.log(
    `${mode}: avg=${report.summary.avgOverallScore} errors=${report.summary.errorCount} JSON=${paths.jsonPath}`,
  );
  console.log(`CSV=${paths.csvPath}`);
  console.log(`Markdown=${paths.mdPath}`);
  return report;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const loaded = await loadCases(options.casesFile);
  const cases = selectCases(loaded.cases, options);
  const modes: EvalMode[] =
    options.mode === "both" ? ["resume", "cover-letter"] : [options.mode];

  for (const mode of modes) {
    await runMode(mode, cases, loaded.datasetTotal, options);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
