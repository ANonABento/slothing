import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

function runPnpmScript(args: string[]) {
  return spawnSync("pnpm", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      ANTHROPIC_API_KEY: "",
      OPENAI_API_KEY: "",
    },
  });
}

describe("translation maintenance scripts", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("keeps the default drift check clean after placeholders are cleared", () => {
    const result = runPnpmScript(["check:translations"]);

    expect(result.status).toBe(0);
    expect(result.stderr).toContain(
      "| Locale | Missing | Extra | ICU errors | Locale quality issues | Identical-to-en warnings | Placeholders |",
    );
    expect(result.stderr).toContain("| es | 0 | 0 | 0 | 0 | 0 | 0 |");
    expect(result.stderr).not.toContain("placeholder string(s)");
  });

  it("passes strict placeholder mode after generated placeholders are cleared", () => {
    const result = runPnpmScript(["check:translations:strict"]);

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("| es | 0 | 0 | 0 | 0 | 0 | 0 |");
    expect(result.stderr).not.toContain("placeholder string(s)");
  });

  it("passes strict identical mode once literal English carryover is cleared", () => {
    const result = runPnpmScript([
      "exec",
      "tsx",
      "scripts/check-translations.ts",
      "--strict-identical",
    ]);

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("| es | 0 | 0 | 0 | 0 | 0 | 0 |");
    expect(result.stderr).not.toContain("identical-to-English string(s)");
  });

  it("fails when Spanish catalog contains known Portuguese fragments", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "translation-messages-"));
    tempDirs.push(dir);
    const messagesDir = path.join(dir, "messages");
    cpSync(path.join(process.cwd(), "src/messages"), messagesDir, {
      recursive: true,
    });

    const esPath = path.join(messagesDir, "es.json");
    const messages = JSON.parse(readFileSync(esPath, "utf8")) as {
      profile: {
        privacy: {
          openToRecruiters: { title: string };
        };
      };
    };
    messages.profile.privacy.openToRecruiters.title =
      "Aberto a contato de recrutadores";
    writeFileSync(esPath, `${JSON.stringify(messages, null, 2)}\n`);

    const result = runPnpmScript([
      "exec",
      "tsx",
      "scripts/check-translations.ts",
      `--messages-dir=${messagesDir}`,
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Locale quality issues");
    expect(result.stderr).toContain(
      'profile.privacy.openToRecruiters.title: contains "aberto a"',
    );
  });

  it("fails when Brazilian Portuguese catalog contains known Spanish fragments", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "translation-messages-"));
    tempDirs.push(dir);
    const messagesDir = path.join(dir, "messages");
    cpSync(path.join(process.cwd(), "src/messages"), messagesDir, {
      recursive: true,
    });

    const ptPath = path.join(messagesDir, "pt-BR.json");
    const messages = JSON.parse(readFileSync(ptPath, "utf8")) as {
      profile: {
        privacy: {
          shareContactInfo: { title: string };
        };
      };
    };
    messages.profile.privacy.shareContactInfo.title =
      "Compartir información de contacto por defecto";
    writeFileSync(ptPath, `${JSON.stringify(messages, null, 2)}\n`);

    const result = runPnpmScript([
      "exec",
      "tsx",
      "scripts/check-translations.ts",
      `--messages-dir=${messagesDir}`,
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Locale quality issues");
    expect(result.stderr).toContain(
      'profile.privacy.shareContactInfo.title: contains "compartir"',
    );
  });

  it("refuses to translate without a provider key", () => {
    const result = runPnpmScript([
      "translate:messages",
      "--dry-run",
      "--locales=es",
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Set ANTHROPIC_API_KEY or OPENAI_API_KEY before running translate:messages",
    );
  });

  it("self-tests translation output validation without provider keys", () => {
    const result = runPnpmScript(["check:translations:generator"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Translation validator self-test passed.");
  });

  it("runs the aggregate translation preflight", () => {
    const result = runPnpmScript(["check:translations:preflight"]);

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("| es | 0 | 0 | 0 | 0 | 0 | 0 |");
    expect(result.stderr).not.toContain("placeholder string(s)");
    expect(result.stdout).toContain("Translation validator self-test passed.");
  }, 30_000);

  it("lets the aggregate release gate pass after placeholders are cleared", () => {
    const result = runPnpmScript(["check:translations:release"]);

    expect(result.status).toBe(0);
    expect(result.stderr).toContain("| es | 0 | 0 | 0 | 0 | 0 | 0 |");
    expect(result.stderr).not.toContain("placeholder string(s)");
    expect(result.stdout).toContain("Translation validator self-test passed.");
  }, 30_000);

  it("can write a markdown placeholder report", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "translation-report-"));
    tempDirs.push(dir);
    const reportPath = path.join(dir, "placeholders.md");

    const result = runPnpmScript([
      "check:translations",
      `--markdown-report=${reportPath}`,
    ]);

    expect(result.status).toBe(0);
    const report = readFileSync(reportPath, "utf8");
    expect(report).toContain("# Translation Placeholder Audit");
    expect(report).toContain("| `es` | 0 |");
    expect(report).toContain("| **Total** | **0** |");
    expect(report).toContain("## Identical-to-English Review");
    expect(report).toContain("| **Total** | **0** |");
    expect(report).toContain("## Locale Quality Review");
  }, 30_000);

  it("verifies a current markdown placeholder report", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "translation-report-"));
    tempDirs.push(dir);
    const reportPath = path.join(dir, "placeholders.md");

    const writeResult = runPnpmScript([
      "check:translations",
      `--markdown-report=${reportPath}`,
    ]);
    expect(writeResult.status).toBe(0);

    const verifyResult = runPnpmScript([
      "check:translations",
      `--verify-markdown-report=${reportPath}`,
    ]);

    expect(verifyResult.status).toBe(0);
  }, 30_000);

  it("fails when the markdown placeholder report is stale", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "translation-report-"));
    tempDirs.push(dir);
    const reportPath = path.join(dir, "placeholders.md");
    writeFileSync(reportPath, "# Translation Placeholder Audit\n\nstale\n");

    const result = runPnpmScript([
      "check:translations",
      `--verify-markdown-report=${reportPath}`,
    ]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Markdown placeholder report is stale");
  }, 30_000);
});
