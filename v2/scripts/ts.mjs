// Runs a TypeScript script that uses the app's code: `node scripts/ts.mjs scripts/seed-search.ts [args…]`.
// Bundled with esbuild (already a dev dependency) next to node_modules, so native modules still resolve.
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [entry, ...args] = process.argv.slice(2);
const out = join(root, "node_modules/.cache/slothing-scripts", `${Date.now()}.mjs`);
mkdirSync(dirname(out), { recursive: true });
await esbuild.build({
  entryPoints: [resolve(entry)],
  outfile: out,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  alias: { "@": join(root, "src") },
  logLevel: "warning",
});
process.argv = [process.argv[0], entry, ...args];
await import(pathToFileURL(out).href);
