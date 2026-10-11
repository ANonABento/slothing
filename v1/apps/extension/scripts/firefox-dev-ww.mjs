// Headed Firefox + Slothing extension dev session focused on debugging the
// WaterlooWorks bulk-card path. Launches Firefox via web-ext (so the
// temporary add-on loads, no signing needed), opens a BiDi WebSocket to
// stream every page console message + every Slothing log line back to this
// terminal, and exposes a `dump` REPL command that asks the WW tab's content
// script what it sees right now.
//
// Run from apps/extension:
//   node scripts/firefox-dev-ww.mjs
//
// The browser opens. Log in to WaterlooWorks. Navigate to /jobs.htm. Watch
// this terminal for `[Slothing][WW] rows matched` / `row scan` lines and
// type `dump` at any time to query state on demand.

import { createServer } from "node:http";
import { mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import readline from "node:readline";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(extensionRoot, "../..");
const distFirefox = path.join(extensionRoot, "dist-firefox");

const firefoxBinary =
  process.env.FIREFOX_BIN || "/home/anonabento/.local/bin/firefox";
const startUrl =
  process.argv[2] ||
  "https://waterlooworks.uwaterloo.ca/myAccount/co-op/full/jobs.htm";

if (!existsSync(path.join(distFirefox, "manifest.json"))) {
  throw new Error(
    "Missing dist-firefox/manifest.json. Run `pnpm build:firefox` first.",
  );
}
if (!existsSync(firefoxBinary)) {
  throw new Error(`Firefox binary not found: ${firefoxBinary}`);
}

const remotePort = await getFreePort();
const profileDir = await mkdtemp(path.join(tmpdir(), "slothing-firefox-dev-"));
console.log(`[dev] firefox      ${firefoxBinary}`);
console.log(`[dev] extension    ${distFirefox}`);
console.log(`[dev] profile      ${profileDir}`);
console.log(`[dev] bidi port    ${remotePort}`);
console.log(`[dev] start url    ${startUrl}`);
console.log();

const webExt = spawn(
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
    "--browser-console",
    "--start-url",
    startUrl,
    `--arg=--remote-debugging-port=${remotePort}`,
    "--arg=--remote-allow-hosts=localhost,127.0.0.1",
  ],
  { cwd: repoRoot, detached: true, stdio: ["ignore", "pipe", "pipe"] },
);
webExt.stdout.on("data", (chunk) => process.stdout.write(`[web-ext] ${chunk}`));
webExt.stderr.on("data", (chunk) => process.stderr.write(`[web-ext] ${chunk}`));
webExt.on("exit", (code) => {
  console.log(`[dev] web-ext exited code=${code}`);
  process.exit(code ?? 0);
});

// Wait for BiDi to come up.
console.log("[dev] waiting for BiDi endpoint ...");
const ws = await waitForBidi(remotePort);
console.log("[dev] connected BiDi");

let nextId = 0;
const pending = new Map();
ws.on("message", (raw) => {
  const message = JSON.parse(raw.toString());
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message);
    pending.delete(message.id);
    return;
  }
  if (message.method === "log.entryAdded") {
    const e = message.params;
    const text = (e.args || [])
      .map((a) => stringifyRemoteValue(a))
      .join(" ");
    // Filter to Slothing-relevant lines but show errors regardless.
    if (
      e.level === "error" ||
      /\[Slothing\]/.test(text) ||
      /Slothing/i.test(text)
    ) {
      console.log(`[fx:${e.level}] ${text}`);
    }
    return;
  }
  if (message.method === "browsingContext.contextCreated") {
    const ctx = message.params;
    console.log(
      `[fx:nav] context created ${ctx.context} url=${ctx.url || "about:blank"}`,
    );
  }
  if (message.method === "browsingContext.navigationStarted") {
    console.log(`[fx:nav] -> ${message.params.url}`);
  }
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, (response) => {
      if (response.type === "error") {
        reject(
          new Error(`${method}: ${response.error} ${response.message || ""}`),
        );
        return;
      }
      resolve(response.result);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send("session.new", { capabilities: { alwaysMatch: {} } });
await send("session.subscribe", {
  events: [
    "log.entryAdded",
    "browsingContext.contextCreated",
    "browsingContext.navigationStarted",
  ],
});

async function dump() {
  const tree = await send("browsingContext.getTree");
  const wwCtx = tree.contexts.find((c) =>
    /waterlooworks\.uwaterloo\.ca/.test(c.url || ""),
  );
  if (!wwCtx) {
    console.log("[dev:dump] no WaterlooWorks tab open yet");
    return;
  }
  const expression = `(${(async () => {
    const tables = document.querySelectorAll("table").length;
    const tbodyTr = document.querySelectorAll("table tbody tr").length;
    const dataViewer = document.querySelectorAll(
      "table.data-viewer-table",
    ).length;
    const rowsBody = document.querySelectorAll(".table__row--body").length;
    const rowsAny = document.querySelectorAll(".table__row").length;
    const roleRow = document.querySelectorAll('[role="row"]').length;
    const jsLinks = document.querySelectorAll(
      "a[href='javascript:void(0)']",
    ).length;
    const buttons = document.querySelectorAll("button").length;
    const dashHeader = Array.from(
      document.querySelectorAll(".dashboard-header__posting-title"),
    ).length;
    const url = window.location.href;
    const bodyClass = document.body?.className || null;
    // Try to send WW_GET_PAGE_STATE to the content script via our own
    // chrome.runtime sender — but content scripts don't expose this to the
    // page. Instead just return DOM-level stats; the orchestrator already
    // logs its own row-scan results via console.log.
    return JSON.stringify({
      url,
      bodyClass,
      tables,
      tbodyTr,
      dataViewer,
      rowsBody,
      rowsAny,
      roleRow,
      jsLinks,
      buttons,
      dashHeader,
    });
  }).toString()})()`;
  const result = await send("script.evaluate", {
    target: { context: wwCtx.context },
    expression,
    awaitPromise: true,
    resultOwnership: "none",
  });
  if (result.type !== "success") {
    console.log("[dev:dump:error]", result.exceptionDetails?.text);
    return;
  }
  const json = JSON.parse(result.result.value);
  console.log("[dev:dump]", JSON.stringify(json, null, 2));
}

console.log();
console.log("Type `dump` to query the WaterlooWorks tab DOM state.");
console.log("Type `q` (or Ctrl+C) to quit.");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on("line", async (line) => {
  const cmd = line.trim();
  if (cmd === "dump") {
    try {
      await dump();
    } catch (err) {
      console.log("[dev:dump:error]", err.message);
    }
  } else if (cmd === "q" || cmd === "quit") {
    shutdown();
  } else if (cmd) {
    console.log("[dev] unknown command:", cmd);
  }
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("[dev] shutting down");
  try {
    if (webExt.pid) process.kill(-webExt.pid, "SIGTERM");
  } catch {}
  process.exit(0);
}

async function getFreePort() {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForBidi(port) {
  // Use Node's global WebSocket (Node 22+). We wrap it in a small adapter
  // that exposes the `.on()` and `.once()` API the rest of this script uses,
  // so we don't have to depend on the `ws` npm package.
  const deadline = Date.now() + 30_000;
  let lastErr;
  while (Date.now() < deadline) {
    try {
      const ws = await new Promise((resolve, reject) => {
        const socket = new WebSocket(`ws://127.0.0.1:${port}/session`);
        socket.onopen = () => resolve(socket);
        socket.onerror = (err) => reject(err);
      });
      const listeners = { message: [], close: [] };
      ws.onmessage = (event) =>
        listeners.message.forEach((fn) => fn(event.data));
      ws.onclose = () => listeners.close.forEach((fn) => fn());
      return {
        on(event, fn) {
          (listeners[event] ||= []).push(fn);
        },
        send(payload) {
          ws.send(payload);
        },
        close() {
          ws.close();
        },
      };
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error(`BiDi did not come up on ${port}: ${lastErr?.message}`);
}

function stringifyRemoteValue(v) {
  if (!v) return String(v);
  if (Object.hasOwn(v, "value")) return String(v.value);
  if (v.type === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return "[object]";
    }
  }
  return v.type || "?";
}
