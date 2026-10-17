// Builds the extension into extension/dist: `npm run extension` (add --watch while working on it).
// Load it in Chrome from chrome://extensions → Developer mode → Load unpacked → v2/extension/dist.
import { execFileSync, spawn } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = join(here, "dist");
const watch = process.argv.includes("--watch");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const manifest = JSON.parse(readFileSync(join(here, "manifest.json"), "utf8"));
writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
copyFileSync(join(root, "public/brand/slothing-mark.png"), join(out, "icon.png"));
copyFileSync(join(here, "src/panel.html"), join(out, "panel.html"));

const options = {
  entryPoints: {
    panel: join(here, "src/panel.tsx"),
    background: join(here, "src/background.ts"),
    watch: join(here, "src/watch.ts"),
    page: join(here, "src/page.ts"),
    pair: join(here, "src/pair.ts"),
  },
  outdir: out,
  bundle: true,
  format: "iife",
  target: "chrome120",
  jsx: "automatic",
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  define: { "process.env.NODE_ENV": JSON.stringify(watch ? "development" : "production"), __VERSION__: JSON.stringify(manifest.version) },
  tsconfig: join(root, "tsconfig.json"),
  logLevel: "info",
};

const tailwind = ["-c", join(here, "tailwind.config.ts"), "-i", join(root, "src/app/globals.css"), "-o", join(out, "panel.css")];
const bin = join(root, "node_modules/.bin/tailwindcss");

if (watch) {
  await (await esbuild.context(options)).watch();
  spawn(bin, [...tailwind, "--watch"], { cwd: root, stdio: "inherit" });
} else {
  await esbuild.build(options);
  execFileSync(bin, [...tailwind, "--minify"], { cwd: root, stdio: "inherit" });
  console.log(`\nBuilt ${out}`);
}
