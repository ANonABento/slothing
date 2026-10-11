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
    next: false,
    prefix: "loop",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--loop") args.loop = argv[++i];
    else if (a === "--next") args.next = true;
    else if (a === "--base") args.base = argv[++i];
    else if (a === "--prefix") args.prefix = argv[++i];
    else if (a === "--widths")
      args.widths = argv[++i].split(",").map((n) => Number(n.trim()));
    else if (a === "--only")
      args.only = argv[++i].split(",").map((s) => s.trim());
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (!args.loop && !args.next)
    throw new Error("Pass --loop <N> or --next (auto-detect next iteration)");
  return args;
}

async function detectNextLoopNumber(prefix) {
  const { readdir } = await import("node:fs/promises");
  const auditDir = resolve(repoRoot, "docs", "ui-audit");
  const re = new RegExp(`^${prefix}-(\\d{3})$`);
  let max = 0;
  try {
    const entries = await readdir(auditDir);
    for (const name of entries) {
      const m = re.exec(name);
      if (m) max = Math.max(max, Number(m[1]));
    }
  } catch {}
  return String(max + 1).padStart(3, "0");
}

function pad(num, width = 3) {
  return String(num).padStart(width, "0");
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.next) {
    args.loop = await detectNextLoopNumber(args.prefix);
  } else {
    args.loop = String(args.loop).padStart(3, "0");
  }

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

  const loopDir = resolve(
    repoRoot,
    "docs",
    "ui-audit",
    `${args.prefix}-${args.loop}`,
  );
  const shotsDir = resolve(loopDir, "screenshots");
  await ensureDir(shotsDir);

  const consoleErrors = []; // [{ slug, width, level, text, stack }]
  const runResults = []; // [{ slug, path, width, status, ms, errors, finalUrl }]

  console.log(
    `[ui-audit] dir=${args.prefix}-${args.loop} base=${args.base} routes=${routes.length} widths=${widths.join(",")} repoRoot=${repoRoot}`,
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
        let attempt = 0;
        while (true) {
          attempt += 1;
          try {
            const resp = await page.goto(url, {
              waitUntil: "networkidle",
              timeout: 30_000,
            });
            finalUrl = page.url();
            if (!resp || !resp.ok()) {
              status = `http_${resp?.status() ?? "unknown"}`;
            } else {
              status = "ok";
            }
            await page.waitForTimeout(750);
            await page.screenshot({
              path: resolve(shotsDir, `${r.slug}-${width}.png`),
              fullPage: true,
              scale: "css",
              type: "png",
            });
            break;
          } catch (err) {
            const msg = String(err.message ?? err);
            const isConnRefused =
              msg.includes("ERR_CONNECTION_REFUSED") ||
              msg.includes("ECONNREFUSED");
            // Dev-server crashes (HMR memory pressure) tend to manifest as
            // ECONNREFUSED. Wait + retry once; the calling shell is expected
            // to have restarted dev-server out-of-band.
            if (isConnRefused && attempt < 3) {
              console.log(
                `    [retry ${attempt}/2] ${r.slug} ECONNREFUSED — waiting 15s for dev to recover`,
              );
              await new Promise((r) => setTimeout(r, 15_000));
              continue;
            }
            status = `error: ${msg}`;
            try {
              await page.screenshot({
                path: resolve(shotsDir, `${r.slug}-${width}-error.png`),
                fullPage: false,
                type: "png",
              });
            } catch {}
            break;
          }
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
