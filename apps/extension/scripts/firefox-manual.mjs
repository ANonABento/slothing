import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(extensionRoot, "../..");
const distFirefox = path.join(extensionRoot, "dist-firefox");

const firefoxBinary =
  process.env.FIREFOX_BIN || "/home/anonabento/.local/bin/firefox";
const profileDir =
  process.env.SLOTHING_FIREFOX_PROFILE_DIR ||
  path.join(tmpdir(), "slothing-firefox-manual");
const startUrl = process.argv[2] || "https://www.linkedin.com/jobs/search/";

if (!existsSync(path.join(distFirefox, "manifest.json"))) {
  throw new Error("Missing dist-firefox/manifest.json. Run build:firefox first.");
}
if (!existsSync(firefoxBinary)) {
  throw new Error(`Firefox binary not found: ${firefoxBinary}`);
}

mkdirSync(profileDir, { recursive: true });

console.log("Launching Firefox with Slothing extension");
console.log(`  firefox: ${firefoxBinary}`);
console.log(`  extension: ${distFirefox}`);
console.log(`  profile: ${profileDir}`);
console.log(`  start URL: ${startUrl}`);
console.log();
console.log("Connect URL after Firefox opens:");
console.log("  https://slothing.work/extension/connect?extensionId=slothing@slothing.work");
console.log();
console.log("Press Ctrl+C in this terminal to close Firefox.");

const child = spawn(
  "pnpm",
  [
    "dlx",
    "web-ext@latest",
    "run",
    "-s",
    distFirefox,
    "--firefox",
    firefoxBinary,
    "--firefox-profile",
    profileDir,
    "--keep-profile-changes",
    "--no-input",
    "--no-reload",
    "--start-url",
    startUrl,
  ],
  {
    cwd: repoRoot,
    stdio: "inherit",
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 0;
});
