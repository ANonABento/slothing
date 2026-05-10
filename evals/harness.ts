import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { RESUME_EVAL_CASES } from "./test-cases.js";
import { createCoverLetterGenerator, createTailorGenerator } from "./generators/index.js";
import { getEvalLLMConfig, hasJudgeKey } from "./llm-config.js";
import { judgeSingle } from "./judge.js";
import { writeReports } from "./report.js";
import { runEval } from "./run.js";
import type { EvalCase, EvalMode, EvalRunReport } from "./types.js";

interface CliOptions {
  mode: EvalMode | "both";
  judge: boolean;
  casesPath?: string;
  outDir: string;
  limit?: number;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    mode: "both",
    judge: process.env.EVAL_JUDGE === "1",
    outDir: path.join(path.dirname(fileURLToPath(import.meta.url)), "reports"),
  };

  for (const arg of argv) {
    if (arg === "--judge") options.judge = true;
    else if (arg.startsWith("--mode=")) {
      options.mode = arg.slice("--mode=".length) as CliOptions["mode"];
    } else if (arg.startsWith("--cases=")) {
      options.casesPath = arg.slice("--cases=".length);
    } else if (arg.startsWith("--out=")) {
      options.outDir = arg.slice("--out=".length);
    } else if (arg.startsWith("--limit=")) {
      options.limit = Number(arg.slice("--limit=".length));
    }
  }

  if (!["resume", "cover-letter", "both"].includes(options.mode)) {
    throw new Error("--mode must be resume, cover-letter, or both");
  }

  return options;
}

async function loadCases(casesPath?: string): Promise<EvalCase[]> {
  if (!casesPath) return RESUME_EVAL_CASES;

  const absolutePath = path.resolve(casesPath);
  if (absolutePath.endsWith(".json")) {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8")) as EvalCase[];
  }

  const mod = (await import(pathToFileURL(absolutePath).href)) as {
    default?: EvalCase[];
    TEST_CASES?: EvalCase[];
    RESUME_EVAL_CASES?: EvalCase[];
  };
  return mod.default ?? mod.RESUME_EVAL_CASES ?? mod.TEST_CASES ?? [];
}

function selectCases(cases: EvalCase[], limit?: number): EvalCase[] {
  if (!limit || !Number.isFinite(limit) || limit <= 0) return cases;
  return cases.slice(0, Math.min(limit, cases.length));
}

async function runMode(
  mode: EvalMode,
  cases: EvalCase[],
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
    console.warn("Judge requested, but ANTHROPIC_API_KEY is not set. Continuing with deterministic metrics only.");
  }

  console.log(`Running ${mode} eval on ${cases.length} case(s)...`);
  const report = await runEval({
    cases,
    mode,
    generatorName,
    generator,
    judge,
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
  const cases = selectCases(await loadCases(options.casesPath), options.limit);
  const modes: EvalMode[] =
    options.mode === "both" ? ["resume", "cover-letter"] : [options.mode];

  for (const mode of modes) {
    await runMode(mode, cases, options);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
