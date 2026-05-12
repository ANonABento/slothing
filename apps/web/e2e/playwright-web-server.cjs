const { spawn } = require("child_process");
const { mkdirSync, rmSync } = require("fs");
const path = require("path");

const distDir = ".next/e2e";
const port = process.env.PORT || "8888";
const sqlitePath =
  process.env.GET_ME_JOB_SQLITE_PATH ||
  path.join(process.cwd(), "data", "get-me-job-e2e.db");
const sqliteUrl = process.env.TURSO_DATABASE_URL || `file:${sqlitePath}`;
const nextBin = require.resolve("next/dist/bin/next");
let child;

function getServerEnv() {
  const env = {
    ...process.env,
    NEXT_DIST_DIR: distDir,
    GET_ME_JOB_SQLITE_PATH: sqlitePath,
    TURSO_DATABASE_URL: sqliteUrl,
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET || "slothing-playwright-e2e-secret",
    SLOTHING_SUPPRESS_OPTIONAL_ENV_WARNINGS: "1",
  };

  if (env.FORCE_COLOR) {
    delete env.NO_COLOR;
  }

  return env;
}

function run(command, args) {
  const spawned = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: getServerEnv(),
  });

  return new Promise((resolve, reject) => {
    spawned.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(`${command} ${args.join(" ")} exited with ${code ?? signal}`),
      );
    });
  });
}

function start(command, args) {
  child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: getServerEnv(),
  });

  return new Promise((_, reject) => {
    child.once("exit", (code, signal) => {
      child = undefined;
      reject(
        new Error(`${command} ${args.join(" ")} exited with ${code ?? signal}`),
      );
    });
  });
}

function stop() {
  if (child) {
    child.kill("SIGTERM");
  }
}

process.once("SIGINT", stop);
process.once("SIGTERM", stop);

(async () => {
  rmSync(distDir, { recursive: true, force: true });
  rmSync(sqlitePath, { force: true });
  rmSync(`${sqlitePath}-shm`, { force: true });
  rmSync(`${sqlitePath}-wal`, { force: true });
  mkdirSync(path.dirname(sqlitePath), { recursive: true });
  await run("pnpm", [
    "exec",
    "drizzle-kit",
    "push",
    "--config",
    "drizzle.config.ts",
    "--force",
  ]);
  await run("node", [nextBin, "build"]);
  await start("node", [nextBin, "start", "-p", port]);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
