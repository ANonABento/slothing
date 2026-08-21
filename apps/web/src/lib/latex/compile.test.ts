import { randomBytes } from "crypto";
import { existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { beforeAll, describe, expect, it } from "vitest";

import {
  CompileError,
  compile,
  isEngineAvailable,
  parseCompileLog,
  resolveEngine,
  warmBundle,
} from "./compile";

const FIXTURE = String.raw`\documentclass[11pt,letterpaper]{article}
\usepackage{slothing}
\slothingcontract{1}
\slothingset{ font = LatinModern, accent = {20,40,90} }
\begin{document}
\slothingHeader[id=hdr-000001]{Kevin Jiang}{kevin@example.com}
\slothingSection[id=sec-a3f91c]{Experience}
\slothingEntry[id=ent-7b21e4]{Bracket Bot}{Robotics Engineer}{2025--2026}{
  \begin{slothingItems}
    \slothingItem[id=itm-c4d883]{Cut calibration time 40\% by rewriting the solver.}
  \end{slothingItems}
}
\end{document}`;

/**
 * Compile tests need a real engine. The unit Test job in CI has no browser and no TeX
 * engine, so they gate rather than fail — mirroring the existing chromium precedent. The
 * dedicated LaTeX CI job installs Tectonic so these genuinely run there; a permanently
 * skipped gate is not a gate.
 */
const describeWithEngine = isEngineAvailable() ? describe : describe.skip;

describe("parseCompileLog", () => {
  it("extracts an error and the source line TeX reports a few lines later", () => {
    const raw = [
      "! LaTeX Error: File `nope.sty' not found.",
      "\\@missingfileerror ...",
      "l.18 \\RequirePackage",
    ].join("\n");
    const log = parseCompileLog(raw, false);
    expect(log.ok).toBe(false);
    expect(log.entries[0].severity).toBe("error");
    expect(log.entries[0].message).toContain("not found");
    expect(log.entries[0].line).toBe(18);
  });

  it("records warnings without inventing a line number", () => {
    const log = parseCompileLog("LaTeX Warning: Reference undefined", true);
    expect(log.entries[0]).toEqual({
      severity: "warning",
      message: "Reference undefined",
      line: null,
    });
  });
});

describeWithEngine("compile (requires Tectonic)", () => {
  // Sealed compiles cannot fetch, so the cache must be primed once. On a warm cache this
  // returns in well under a second; on a cold CI runner it does the one-time download.
  beforeAll(async () => {
    await warmBundle();
  }, 300_000);

  it("resolves an engine binary", () => {
    expect(resolveEngine()).toBeTruthy();
  });

  it("compiles a contract document to a PDF", async () => {
    const result = await compile({ source: FIXTURE, mode: "export" });
    expect(result.log.ok).toBe(true);
    // %PDF- magic bytes.
    expect(Buffer.from(result.pdf.slice(0, 5)).toString()).toBe("%PDF-");
    expect(result.pdf.byteLength).toBeGreaterThan(1000);
  }, 60_000);

  it("emits SyncTeX in preview mode and not in export mode", async () => {
    const preview = await compile({ source: FIXTURE, mode: "preview" });
    const exported = await compile({ source: FIXTURE, mode: "export" });
    expect(preview.synctex).not.toBeNull();
    expect(exported.synctex).toBeNull();
  }, 60_000);

  it("reports a compile failure with a parsed log rather than throwing raw", async () => {
    const broken = FIXTURE.replace(
      "\\end{document}",
      "\\undefinedmacro\n\\end{document}",
    );
    await expect(compile({ source: broken, mode: "export" })).rejects.toThrow(
      CompileError,
    );
  }, 60_000);

  // --- sandbox: each limit gets a test that trips it (spec §16) ---

  it("neutralises shell-escape — the command never runs", async () => {
    // Tectonic under --untrusted does not error on \write18; it disables it. So the
    // property under test is the ABSENCE of the side effect, not a thrown error.
    const marker = join(
      tmpdir(),
      `slothing-pwned-${randomBytes(4).toString("hex")}`,
    );
    const attack = FIXTURE.replace(
      "\\end{document}",
      `\\write18{touch ${marker}}\n\\end{document}`,
    );
    await compile({ source: attack, mode: "export" }).catch(() => undefined);
    expect(existsSync(marker)).toBe(false);
  }, 60_000);

  it("kills a runaway document at the timeout instead of hanging", async () => {
    const bomb = FIXTURE.replace(
      "\\end{document}",
      "\\newcount\\i \\loop \\advance\\i by 1 \\ifnum\\i<2147483647 \\repeat\n\\end{document}",
    );
    await expect(
      compile({ source: bomb, mode: "export", timeoutMs: 3000 }),
    ).rejects.toThrow(/exceeded 3000ms/);
  }, 60_000);

  it("cannot read a file outside its jail", async () => {
    const attack = FIXTURE.replace(
      "\\end{document}",
      "\\input{/etc/passwd}\n\\end{document}",
    );
    await expect(compile({ source: attack, mode: "export" })).rejects.toThrow(
      CompileError,
    );
  }, 60_000);
});
