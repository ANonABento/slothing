#!/usr/bin/env node

const ANSI = {
  reset: "\u001b[0m",
  bold: "\u001b[1m",
  dim: "\u001b[2m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
};

const COMMANDS = [
  {
    cwd: "/workspace/get-me-job",
    command: "npm run type-check",
    stdout: [
      "> slothing@0.1.0 type-check",
      "> tsc -p tsconfig.typecheck.json --noEmit",
      "",
      "Type check completed without errors.",
    ],
    stderr: [],
    exitCode: 0,
  },
  {
    cwd: "/workspace/get-me-job",
    command: "node scripts/codex-terminal-probe.cjs --raw",
    stdout: [
      "alpha beta gamma",
      "progress: 100%",
      "table: id | status | owner",
    ],
    stderr: ["warning: raw stream includes ANSI SGR and carriage returns"],
    exitCode: 0,
  },
];

function buildSemanticTranscript(commands = COMMANDS) {
  const lines = ["# Codex Terminal Probe", "", "## Semantic transcript"];

  for (const [index, entry] of commands.entries()) {
    lines.push("", `### Command ${index + 1}`, `cwd: ${entry.cwd}`, `$ ${entry.command}`);

    if (entry.stdout.length > 0) {
      lines.push("", "stdout:");
      lines.push(...entry.stdout.map((line) => `  ${line}`));
    }

    if (entry.stderr.length > 0) {
      lines.push("", "stderr:");
      lines.push(...entry.stderr.map((line) => `  ${line}`));
    }

    lines.push("", `exit: ${entry.exitCode}`);
  }

  return `${lines.join("\n")}\n`;
}

function buildRawTerminalProbe() {
  return [
    `${ANSI.bold}${ANSI.blue}codex terminal raw rendering probe${ANSI.reset}`,
    `${ANSI.dim}$ npm run type-check${ANSI.reset}`,
    `${ANSI.green}ok${ANSI.reset} type-check passed`,
    `${ANSI.yellow}warn${ANSI.reset} transcript renderer should preserve stderr`,
    `${ANSI.red}err${ANSI.reset} simulated stderr sample only`,
    "columns: name        status      elapsed",
    "columns: type-check  passed      01.2s",
    "progress: [#####.....] 50%\rprogress: [##########] 100%",
    `${ANSI.magenta}ansi-reset-check${ANSI.reset} plain text resumes here`,
    "",
  ].join("\n");
}

function printUsage() {
  process.stdout.write(
    [
      "Usage: node scripts/codex-terminal-probe.cjs [--semantic|--raw|--all]",
      "",
      "Emits deterministic terminal output for Codex transcript rendering checks.",
      "",
    ].join("\n")
  );
}

function run(argv = process.argv.slice(2)) {
  const mode = argv[0] ?? "--all";

  if (mode === "--help" || mode === "-h") {
    printUsage();
    return 0;
  }

  if (mode === "--semantic") {
    process.stdout.write(buildSemanticTranscript());
    return 0;
  }

  if (mode === "--raw") {
    process.stdout.write(buildRawTerminalProbe());
    return 0;
  }

  if (mode === "--all") {
    process.stdout.write(buildSemanticTranscript());
    process.stdout.write("\n--- raw terminal stream ---\n\n");
    process.stdout.write(buildRawTerminalProbe());
    return 0;
  }

  process.stderr.write(`Unknown option: ${mode}\n`);
  printUsage();
  return 1;
}

if (require.main === module) {
  process.exitCode = run();
}

module.exports = {
  ANSI,
  COMMANDS,
  buildRawTerminalProbe,
  buildSemanticTranscript,
  run,
};
