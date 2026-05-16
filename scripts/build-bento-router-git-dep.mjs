import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const packageRoot = join(
  process.cwd(),
  "apps",
  "web",
  "node_modules",
  "@anonabento",
  "bento-router",
);
const packageJsonPath = join(packageRoot, "package.json");
const distIndexPath = join(packageRoot, "dist", "src", "index.js");

if (!existsSync(packageJsonPath) || existsSync(distIndexPath)) {
  process.exit(0);
}

const manifest = JSON.parse(readFileSync(packageJsonPath, "utf8"));
if (
  manifest.name !== "@anonabento/bento-router" ||
  manifest.version !== "0.2.0"
) {
  process.exit(0);
}

const result = spawnSync("pnpm", ["exec", "tsc", "-p", "tsconfig.json"], {
  cwd: packageRoot,
  stdio: "inherit",
  env: process.env,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
