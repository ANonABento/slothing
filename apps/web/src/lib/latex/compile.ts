/**
 * The compile service — docs/specs/latex-single-source-rebuild.md §5.
 *
 * ONE function, ONE module. No caller reaches around it. The transport is an
 * implementation detail so the subprocess can become a sidecar container later without
 * touching a single call site.
 *
 * Compiling user-supplied LaTeX is arbitrary-code-execution territory, so the sandbox
 * ships WITH the service, not as later hardening:
 *   1. `--untrusted` — Tectonic disables known-dangerous features (incl. shell-escape)
 *      regardless of any other flag.
 *   2. Process limits — wall-clock timeout, output size cap, killed on breach.
 *   3. Filesystem jail — a fresh temp dir per compile holding only main.tex + slothing.sty,
 *      removed afterwards even on failure.
 *   4. `--only-cached` — no network reachable during a compile; the bundle is pre-warmed.
 */
import { spawn } from "child_process";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { extractHitMap, type HitMap } from "./hitmap";
import { SLOTHING_STY, STY_VERSION } from "./slothing-sty";

export type CompileMode = "preview" | "export";

export { STY_VERSION };

export interface CompileInput {
  source: string;
  mode: CompileMode;
  timeoutMs?: number;
  /**
   * Allow Tectonic to fetch packages it does not already have cached.
   *
   * Every routine compile runs sealed (`--only-cached`), because a preview loop must never
   * depend on the network. An IMPORTED document is different: it is someone else's .tex and
   * may legitimately use a package our warm bundle has never seen, which would otherwise
   * fail with a confusing missing-file error.
   *
   * The reasoning for why this is safe: a LaTeX document cannot direct Tectonic at an
   * arbitrary URL. Without shell-escape — which `--untrusted` disables unconditionally —
   * the only thing a document influences is which PACKAGE NAMES get looked up in
   * Tectonic's own bundle. Every other sandbox layer (untrusted mode, the temp-dir jail,
   * the wall-clock timeout, the output cap) still applies.
   *
   * Use it ONLY for one-off, user-initiated imports. Never for the preview loop.
   */
  allowFetch?: boolean;
}

export interface CompileLogEntry {
  severity: "error" | "warning";
  message: string;
  /** 1-indexed source line, when the log names one. */
  line: number | null;
}

export interface CompileLog {
  ok: boolean;
  entries: CompileLogEntry[];
  raw: string;
}

export interface CompileResult {
  pdf: Uint8Array;
  synctex: Uint8Array | null;
  log: CompileLog;
  /**
   * Span rectangles for click-to-select. Populated for `preview` compiles only —
   * `export` compiles carry no anchors, so there is nothing to extract.
   */
  hitMap: HitMap | null;
}

export class CompileError extends Error {
  constructor(
    message: string,
    readonly log: CompileLog,
  ) {
    super(message);
    this.name = "CompileError";
  }
}

export class EngineUnavailableError extends Error {
  constructor() {
    super(
      "No LaTeX engine is available. Download the .tex + slothing.sty bundle and compile it in Overleaf.",
    );
    this.name = "EngineUnavailableError";
  }
}

const DEFAULT_TIMEOUT_MS = 20_000;
/** A resume that renders to more than this is a runaway document, not a resume. */
const MAX_PDF_BYTES = 10 * 1024 * 1024;

/** Resolve the engine binary. `SLOTHING_TECTONIC_BIN` wins for pinned deployments. */
export function resolveEngine(): string | null {
  const configured = process.env.SLOTHING_TECTONIC_BIN;
  if (configured) return existsSync(configured) ? configured : null;

  const candidates = [
    join(process.env.HOME ?? "", ".local/bin/tectonic"),
    "/usr/local/bin/tectonic",
    "/usr/bin/tectonic",
  ];
  return candidates.find((c) => existsSync(c)) ?? null;
}

export function isEngineAvailable(): boolean {
  return resolveEngine() !== null;
}

/**
 * Parse Tectonic/TeX output into something a human can act on. LaTeX logs are hostile;
 * the inspector needs a severity, a message, and — where available — a line number it can
 * map back to a span.
 */
export function parseCompileLog(raw: string, ok: boolean): CompileLog {
  const entries: CompileLogEntry[] = [];
  const lines = raw.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const error = /^(?:!|error:)\s*(.+)$/.exec(line.trim());
    if (error) {
      // TeX reports the offending line a few lines later as `l.<n> <context>`.
      let lineNumber: number | null = null;
      for (let j = i; j < Math.min(i + 6, lines.length); j += 1) {
        const at = /^l\.(\d+)/.exec(lines[j].trim());
        if (at) {
          lineNumber = Number(at[1]);
          break;
        }
      }
      entries.push({
        severity: "error",
        message: error[1].trim(),
        line: lineNumber,
      });
      continue;
    }
    const warning = /^(?:warning:|LaTeX Warning:)\s*(.+)$/.exec(line.trim());
    if (warning) {
      entries.push({
        severity: "warning",
        message: warning[1].trim(),
        line: null,
      });
    }
  }

  return { ok, entries, raw };
}

/**
 * Compile a Slothing document to PDF.
 *
 * `mode` is load-bearing: preview compiles may later carry the span hit-map layer
 * (spec §6), export compiles never do — a downloaded resume must contain nothing but the
 * resume.
 */
/**
 * Populate the Tectonic bundle cache for the contract's preamble.
 *
 * Every real compile runs with `--only-cached` so it can never reach the network. That
 * makes warming a prerequisite, not an optimisation: on a cold cache a sealed compile
 * fails with a missing-package error. Deployments call this at build time; the test suite
 * calls it once before the compile tests so a cold CI runner is self-healing.
 */
export async function warmBundle(timeoutMs = 300_000): Promise<void> {
  const engine = resolveEngine();
  if (!engine) throw new EngineUnavailableError();

  const dir = await mkdtemp(join(tmpdir(), "slothing-warm-"));
  try {
    await writeFile(join(dir, "main.tex"), WARMUP_DOC, "utf8");
    await writeFile(join(dir, "slothing.sty"), styleFor("preview"), "utf8");
    // Deliberately WITHOUT --only-cached: this is the one place we fetch.
    await run(
      engine,
      ["-X", "compile", "--untrusted", "--outfmt", "pdf", "main.tex"],
      dir,
      timeoutMs,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** Exercises every package the contract's preamble pulls in. */
const WARMUP_DOC = String.raw`\documentclass[11pt,letterpaper]{article}
\usepackage{slothing}
\slothingcontract{1}
\slothingset{ font = LatinModern, accent = {0,0,0} }
\begin{document}
\slothingHeader[id=hdr-000000]{Warm Up}{warm@example.com}
\slothingSection[id=sec-000000]{Section}
\slothingEntry[id=ent-000000]{Org}{Role}{2025}{
  \begin{slothingItems}
    \slothingItem[id=itm-000000]{Item with \slothingB{bold} and 40\%.}
  \end{slothingItems}
}
\end{document}`;

/**
 * The style sheet for a compile mode. Preview appends the anchors flag; export does not.
 *
 * Flipping it here rather than rewriting the document keeps the compiled source
 * byte-identical between modes, so a log line number always refers to the same line of
 * the stored document.
 */
export function styleFor(mode: CompileMode): string {
  if (mode !== "preview") return SLOTHING_STY;
  return SLOTHING_STY.replace(
    "\\endinput",
    "\\slothing@anchorstrue\n\\endinput",
  );
}

export async function compile(input: CompileInput): Promise<CompileResult> {
  const engine = resolveEngine();
  if (!engine) throw new EngineUnavailableError();

  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const dir = await mkdtemp(join(tmpdir(), "slothing-tex-"));

  try {
    await writeFile(join(dir, "main.tex"), input.source, "utf8");
    await writeFile(join(dir, "slothing.sty"), styleFor(input.mode), "utf8");

    const args = ["-X", "compile", "--untrusted"];
    // Sealed by default; see CompileInput.allowFetch for why import is the one exception.
    if (!input.allowFetch) args.push("--only-cached");
    args.push("--outfmt", "pdf", "--keep-logs");
    if (input.mode === "preview") args.push("--synctex");
    args.push("main.tex");

    const { stdout, stderr, timedOut, code } = await run(
      engine,
      args,
      dir,
      timeoutMs,
    );
    const raw = `${stdout}\n${stderr}`.trim();

    if (timedOut) {
      throw new CompileError(
        `Compile exceeded ${timeoutMs}ms and was stopped.`,
        parseCompileLog(raw, false),
      );
    }

    const pdfPath = join(dir, "main.pdf");
    if (code !== 0 || !existsSync(pdfPath)) {
      throw new CompileError(
        "The document did not compile.",
        parseCompileLog(raw, false),
      );
    }

    const pdf = await readFile(pdfPath);
    if (pdf.byteLength > MAX_PDF_BYTES) {
      throw new CompileError(
        "The compiled document is unreasonably large and was rejected.",
        parseCompileLog(raw, false),
      );
    }

    const synctexPath = join(dir, "main.synctex.gz");
    const synctex = existsSync(synctexPath)
      ? new Uint8Array(await readFile(synctexPath))
      : null;

    const bytes = new Uint8Array(pdf);
    // Only preview compiles carry anchors, so only they have a map to extract.
    const hitMap = input.mode === "preview" ? await extractHitMap(bytes) : null;

    return {
      pdf: bytes,
      synctex,
      log: parseCompileLog(raw, true),
      hitMap,
    };
  } finally {
    // The jail goes away even when the compile threw.
    await rm(dir, { recursive: true, force: true });
  }
}

function run(
  bin: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
): Promise<{
  stdout: string;
  stderr: string;
  code: number | null;
  timedOut: boolean;
}> {
  return new Promise((resolve) => {
    // A deliberately minimal environment — the compile gets a PATH, a HOME for the
    // bundle cache, and nothing else of ours. NODE_ENV is carried only because Next
    // augments ProcessEnv to require it. The cast is needed for that augmentation, not to
    // widen anything.
    const env = {
      PATH: process.env.PATH ?? "",
      HOME: process.env.HOME ?? "",
      // Defence in depth: even if a flag were dropped, untrusted mode still applies.
      TECTONIC_UNTRUSTED_MODE: "1",
      NODE_ENV: process.env.NODE_ENV,
    } as NodeJS.ProcessEnv;

    const child = spawn(bin, args, { cwd, env });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => {
      stdout += String(d);
    });
    child.stderr.on("data", (d) => {
      stderr += String(d);
    });
    child.on("error", () => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code: null, timedOut });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code, timedOut });
    });
  });
}
