#!/usr/bin/env node
// UI audit screenshot + console capture.
//
// Usage (from apps/web):
//   node scripts/ui-audit/capture.mjs --loop 1
//   node scripts/ui-audit/capture.mjs --loop 1 --base http://localhost:3010
//
// Output (relative to repo root):
//   docs/ui-audit/loop-NNN/screenshots/<slug>-<width>.png
//   docs/ui-audit/loop-NNN/console-errors.json
//   docs/ui-audit/loop-NNN/run-summary.json

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// scripts/ui-audit/ -> apps/web/ -> repo root (../../..)
const repoRoot = resolve(__dirname, "..", "..", "..", "..");

function parseArgs(argv) {
  const args = {
    loop: null,
    base: "http://localhost:3010",
    widths: null,
    only: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--loop") args.loop = argv[++i];
    else if (a === "--base") args.base = argv[++i];
    else if (a === "--widths")
      args.widths = argv[++i].split(",").map((n) => Number(n.trim()));
    else if (a === "--only")
      args.only = argv[++i].split(",").map((s) => s.trim());
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!args.loop) throw new Error("--loop <N> is required");
  args.loop = String(args.loop).padStart(3, "0");
  return args;
}

function pad(num, width = 3) {
  return String(num).padStart(width, "0");
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function main() {
  const args = parseArgs(process.argv);

  const routesConfig = JSON.parse(
    await readFile(resolve(__dirname, "routes.json"), "utf8"),
  );
  const widths = args.widths ?? routesConfig.widths;
  const viewportHeight = routesConfig.viewportHeight ?? 900;

  const allRoutes = routesConfig.groups.flatMap((g) =>
    g.routes.map((r) => ({ ...r, group: g.name })),
  );
  const routes = args.only
    ? allRoutes.filter((r) => args.only.includes(r.slug))
    : allRoutes;

  const loopDir = resolve(repoRoot, "docs", "ui-audit", `loop-${args.loop}`);
  const shotsDir = resolve(loopDir, "screenshots");
  await ensureDir(shotsDir);

  const consoleErrors = []; // [{ slug, width, level, text, stack }]
  const runResults = []; // [{ slug, path, width, status, ms, errors, finalUrl }]

  console.log(
    `[ui-audit] loop=${args.loop} base=${args.base} routes=${routes.length} widths=${widths.join(",")} repoRoot=${repoRoot}`,
  );

  const browser = await chromium.launch();
  let captureCount = 0;
  const totalCaptures = routes.length * widths.length;
  try {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: viewportHeight },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      let currentSlug = null;
      page.on("console", (msg) => {
        const t = msg.type();
        if (t === "error" || t === "warning") {
          consoleErrors.push({
            slug: currentSlug,
            width,
            level: t,
            text: msg.text().slice(0, 1500),
          });
        }
      });
      page.on("pageerror", (err) => {
        consoleErrors.push({
          slug: currentSlug,
          width,
          level: "pageerror",
          text: String(err.message ?? err),
          stack: err.stack
            ? String(err.stack).split("\n").slice(0, 8).join("\n")
            : undefined,
        });
      });

      for (const r of routes) {
        const url = `${args.base}${r.path}`;
        currentSlug = r.slug;
        const startedAt = Date.now();
        let status = "ok";
        let finalUrl = url;
        try {
          const resp = await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 30_000,
          });
          finalUrl = page.url();
          if (!resp || !resp.ok()) {
            status = `http_${resp?.status() ?? "unknown"}`;
          }
          // Settle hydration + any animations.
          await page.waitForTimeout(750);
          await page.screenshot({
            path: resolve(shotsDir, `${r.slug}-${width}.png`),
            fullPage: true,
            scale: "css",
            type: "png",
          });
        } catch (err) {
          status = `error: ${err.message}`;
          try {
            await page.screenshot({
              path: resolve(shotsDir, `${r.slug}-${width}-error.png`),
              fullPage: false,
              type: "png",
            });
          } catch {}
        }
        const ms = Date.now() - startedAt;
        const errsForThis = consoleErrors.filter(
          (e) => e.slug === r.slug && e.width === width,
        ).length;
        runResults.push({
          slug: r.slug,
          path: r.path,
          group: r.group,
          width,
          status,
          ms,
          errors: errsForThis,
          finalUrl,
        });
        captureCount += 1;
        console.log(
          `  ${pad(captureCount)}/${totalCaptures} [${width}] ${r.slug} -> ${status} (${ms}ms, ${errsForThis} console issues)`,
        );
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  await writeFile(
    resolve(loopDir, "console-errors.json"),
    JSON.stringify(consoleErrors, null, 2),
  );
  await writeFile(
    resolve(loopDir, "run-summary.json"),
    JSON.stringify(
      {
        loop: args.loop,
        base: args.base,
        widths,
        viewportHeight,
        startedAt: new Date().toISOString(),
        routesAudited: routes.length,
        results: runResults,
        consoleErrorTotal: consoleErrors.length,
      },
      null,
      2,
    ),
  );

  const failed = runResults.filter((r) => r.status !== "ok");
  console.log(
    `\n[ui-audit] done. ${runResults.length} captures, ${consoleErrors.length} console issues, ${failed.length} non-OK.`,
  );
  if (failed.length) {
    console.log(`[ui-audit] non-OK:`);
    failed.forEach((f) =>
      console.log(`  - ${f.slug} @ ${f.width}: ${f.status}`),
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
