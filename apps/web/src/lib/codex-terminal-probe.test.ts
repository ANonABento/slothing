import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const probe = require("../../scripts/codex-terminal-probe.cjs") as {
  buildRawTerminalProbe: () => string;
  buildSemanticTranscript: () => string;
};

const scriptPath = path.join(
  process.cwd(),
  "scripts",
  "codex-terminal-probe.cjs"
);

describe("codex terminal probe", () => {
  it("builds a semantic transcript with command metadata and streams", () => {
    const transcript = probe.buildSemanticTranscript();

    expect(transcript).toContain("## Semantic transcript");
    expect(transcript).toContain("cwd: /workspace/get-me-job");
    expect(transcript).toContain("$ npm run type-check");
    expect(transcript).toContain("stdout:");
    expect(transcript).toContain("stderr:");
    expect(transcript).toContain("exit: 0");
  });

  it("builds a raw terminal sample with ANSI color and carriage return output", () => {
    const raw = probe.buildRawTerminalProbe();

    expect(raw).toContain("\u001b[1m");
    expect(raw).toContain("\u001b[32m");
    expect(raw).toContain("\rprogress: [##########] 100%");
    expect(raw).toContain("\u001b[0m plain text resumes here");
  });

  it("exposes semantic and raw modes through the CLI", () => {
    const semantic = spawnSync(process.execPath, [scriptPath, "--semantic"], {
      encoding: "utf8",
    });
    const raw = spawnSync(process.execPath, [scriptPath, "--raw"], {
      encoding: "utf8",
    });

    expect(semantic.status).toBe(0);
    expect(semantic.stdout).toContain("# Codex Terminal Probe");
    expect(semantic.stderr).toBe("");

    expect(raw.status).toBe(0);
    expect(raw.stdout).toContain("\u001b[34m");
    expect(raw.stdout).toContain("columns: type-check");
    expect(raw.stderr).toBe("");
  });
});
