import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(extensionRoot, "../..");
const distFirefox = path.join(extensionRoot, "dist-firefox");
const demoFormPath = path.join(extensionRoot, "demo", "job-form.html");
const firefoxBinary =
  process.env.FIREFOX_BIN || "/home/anonabento/.local/bin/firefox";

const profile = {
  id: "profile-firefox-smoke",
  contact: {
    name: "Riley Chen",
    email: "riley.chen@example.com",
    phone: "+1 555 010 1200",
    location: "Seattle, WA, United States",
    linkedin: "https://www.linkedin.com/in/rileychen",
    github: "https://github.com/rileychen",
    website: "https://rileychen.example.com",
  },
  summary: "Platform engineer focused on reliable product infrastructure.",
  experiences: [
    {
      id: "exp-1",
      company: "Northwind Labs",
      title: "Staff Software Engineer",
      location: "Seattle, WA",
      startDate: "2021-01",
      current: true,
      description: "Leads platform engineering for customer-facing systems.",
      highlights: ["Built deployment automation", "Mentored engineers"],
      skills: ["TypeScript", "React", "Node.js"],
    },
  ],
  education: [],
  skills: [
    {
      id: "skill-1",
      name: "TypeScript",
      category: "technical",
      proficiency: "expert",
    },
  ],
  projects: [],
  certifications: [],
  computed: {
    firstName: "Riley",
    lastName: "Chen",
    currentCompany: "Northwind Labs",
    currentTitle: "Staff Software Engineer",
    yearsExperience: 9,
    skillsList: "TypeScript, React, Node.js",
  },
};

const settings = {
  autoFillEnabled: true,
  showConfidenceIndicators: true,
  minimumConfidence: 0.5,
  learnFromAnswers: true,
  notifyOnJobDetected: true,
  autoTrackApplicationsEnabled: true,
  captureScreenshotEnabled: false,
};

async function main() {
  if (!existsSync(path.join(distFirefox, "manifest.json"))) {
    throw new Error("Missing dist-firefox/manifest.json. Run build:firefox first.");
  }
  if (!existsSync(firefoxBinary)) {
    throw new Error(`Firefox binary not found: ${firefoxBinary}`);
  }

  const apiRequests = [];
  const fixtureServer = await startFixtureServer(apiRequests);
  const fixturePort = fixtureServer.address().port;
  const remotePort = await getFreePort();
  const profileDir = await mkdtemp(path.join(tmpdir(), "slothing-firefox-smoke-"));
  const webExt = spawnWebExt(profileDir, remotePort);

  try {
    await waitForWebExtInstall(webExt);
    const extensionUuid = await waitForExtensionUuid(profileDir);
    const bidi = await connectBidi(remotePort);
    const context = await bidi.firstContext();
    const extensionBase = `moz-extension://${extensionUuid}`;
    const apiBaseUrl = `http://127.0.0.1:${fixturePort}`;

    await bidi.navigate(context, `${extensionBase}/popup.html`);
    await bidi.waitForJson(context, () =>
      JSON.stringify({
        hasConnect: [...document.querySelectorAll("button")].some((button) =>
          /Connect account/i.test(button.textContent || ""),
        ),
        title: document.querySelector("h1")?.textContent || "",
      }),
    );

    await bidi.navigate(context, `${extensionBase}/options.html`);
    await bidi.waitForJson(context, () =>
      JSON.stringify({
        heading: document.querySelector("h1")?.textContent || "",
        hasApiInput: !!document.querySelector('input[type="url"]'),
        githubHref:
          document.querySelector('a[href*="github.com"]')?.getAttribute("href") ||
          "",
      }),
      (value) =>
        value.heading === "Slothing Settings" &&
        value.hasApiInput &&
        value.githubHref === "https://github.com/ANonABento/slothing",
    );

    await bidi.navigate(
      context,
      `${apiBaseUrl}/extension/connect?extensionId=slothing@slothing.work`,
    );
    await bidi.waitForJson(
      context,
      () =>
        JSON.stringify({
          status: document.querySelector("#status")?.textContent || "",
          tokenPending: !!localStorage.getItem("slothing_extension_token"),
        }),
      (value) => value.status === "connected" && !value.tokenPending,
      12_000,
    );

    await bidi.navigate(context, `${extensionBase}/popup.html`);
    await bidi.waitForJson(
      context,
      () =>
        new Promise((resolve) => {
          chrome.storage.local.get("slothing_extension", (result) => {
            const storage = result?.slothing_extension || {};
            resolve(
              JSON.stringify({
                text: document.body.textContent || "",
                hasDisconnect: [...document.querySelectorAll("button")].some(
                  (button) => /Disconnect/i.test(button.textContent || ""),
                ),
                hasToken: !!storage.authToken,
                apiBaseUrl: storage.apiBaseUrl || "",
              }),
            );
          });
        }),
      (value) =>
        value.text.includes("Connected") &&
        value.text.includes("Riley Chen") &&
        value.hasDisconnect,
    );

    await bidi.navigate(context, `${apiBaseUrl}/job-form.html`);
    await bidi.waitForJson(
      context,
      () =>
        JSON.stringify({
          hostCount: document.querySelectorAll("#slothing-job-page-sidebar-host")
            .length,
          sidebarText:
            document.querySelector("#slothing-job-page-sidebar-host")?.shadowRoot
              ?.textContent || "",
        }),
      (value) =>
        value.hostCount === 1 &&
        value.sidebarText.includes("Senior Software Engineer") &&
        value.sidebarText.includes("Tailor resume") &&
        value.sidebarText.includes("Auto-fill"),
      12_000,
    );

    await bidi.evaluate(
      context,
      `(() => {
        const host = document.querySelector("#slothing-job-page-sidebar-host");
        const button = [...(host?.shadowRoot?.querySelectorAll("button") || [])]
          .find((candidate) => /Auto-fill/.test(candidate.textContent || ""));
        if (!button) throw new Error("Auto-fill button not found");
        button.click();
      })()`,
    );

    await bidi.waitForJson(
      context,
      () =>
        JSON.stringify({
          firstName: document.querySelector("#firstName")?.value || "",
          lastName: document.querySelector("#lastName")?.value || "",
          email: document.querySelector("#email")?.value || "",
          salary: document.querySelector("#salary")?.value || "",
        }),
      (value) =>
        value.firstName === "Riley" &&
        value.lastName === "Chen" &&
        value.email === "riley.chen@example.com" &&
        value.salary === "",
    );

    await bidi.evaluate(
      context,
      `(() => {
        const host = document.querySelector("#slothing-job-page-sidebar-host");
        const button = [...(host?.shadowRoot?.querySelectorAll("button") || [])]
          .find((candidate) => /Save job/.test(candidate.textContent || ""));
        if (!button) throw new Error("Save job button not found");
        button.click();
      })()`,
    );

    await waitFor(() => apiRequests.length > 0, 8_000, "save-job API request");

    await bidi.navigate(context, `${extensionBase}/popup.html`);
    await bidi.waitForJson(
      context,
      () =>
        JSON.stringify({
          text: document.body.textContent || "",
          hasDisconnect: [...document.querySelectorAll("button")].some(
            (button) => /Disconnect/i.test(button.textContent || ""),
          ),
        }),
      (value) => value.text.includes("Connected") && value.hasDisconnect,
    );
    await bidi.evaluate(
      context,
      `(() => {
        const button = [...document.querySelectorAll("button")]
          .find((candidate) => /Disconnect/.test(candidate.textContent || ""));
        if (!button) throw new Error("Disconnect button not found");
        button.click();
      })()`,
    );
    await bidi.evaluate(
      context,
      `(() => {
        const button = [...document.querySelectorAll("button")]
          .find((candidate) => /disconnect/i.test(candidate.textContent || ""));
        if (!button) throw new Error("Confirm disconnect button not found");
        button.click();
      })()`,
    );
    await bidi.waitForJson(
      context,
      () =>
        JSON.stringify({
          hasConnect: [...document.querySelectorAll("button")].some((button) =>
            /Connect account/i.test(button.textContent || ""),
          ),
        }),
      (value) => value.hasConnect,
    );

    await bidi.close();
    console.log(
      JSON.stringify(
        {
          ok: true,
          firefox: firefoxBinary,
          extensionUuid,
          verified: [
            "temporary add-on load",
            "popup unauthenticated state",
            "options page",
            "localStorage connect callback",
            "authenticated popup state",
            "job-page sidebar",
            "sidebar autofill",
            "save-job import request",
            "disconnect flow",
          ],
          apiRequests: apiRequests.length,
        },
        null,
        2,
      ),
    );
  } finally {
    await stopProcessTree(webExt);
    await new Promise((resolve) => fixtureServer.close(resolve));
    await rmWithRetry(profileDir);
  }
}

function startFixtureServer(apiRequests) {
  return new Promise((resolve) => {
    const server = createServer((request, response) => {
      if (request.method === "GET" && request.url === "/job-form.html") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        createReadStream(demoFormPath).pipe(response);
        return;
      }
      if (request.method === "GET" && request.url === "/api/extension/auth/verify") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ ok: true }));
        return;
      }
      if (request.method === "GET" && request.url === "/api/extension/profile") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(profile));
        return;
      }
      if (
        request.method === "GET" &&
        request.url?.startsWith("/extension/connect")
      ) {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(`<!doctype html>
          <html>
            <body>
              <h1>Connect Slothing Extension</h1>
              <p id="status">connecting</p>
              <script>
                setTimeout(() => {
                  localStorage.setItem("slothing_extension_token", JSON.stringify({
                    token: "test-token",
                    expiresAt: "2099-01-01T00:00:00.000Z",
                    apiBaseUrl: window.location.origin
                  }));
                  document.getElementById("status").textContent = "connected";
                }, 3000);
              </script>
            </body>
          </html>`);
        return;
      }
      if (
        request.method === "POST" &&
        request.url === "/api/opportunities/from-extension"
      ) {
        let body = "";
        request.on("data", (chunk) => {
          body += chunk;
        });
        request.on("end", () => {
          apiRequests.push(JSON.parse(body || "{}"));
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({
              imported: 1,
              opportunityIds: ["firefox-smoke-opportunity"],
              pendingCount: 0,
            }),
          );
        });
        return;
      }
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "not found" }));
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function spawnWebExt(profileDir, remotePort) {
  return spawn(
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
      "about:blank",
      "--arg=--headless",
      `--arg=--remote-debugging-port=${remotePort}`,
      "--arg=--remote-allow-hosts=localhost,127.0.0.1",
    ],
    {
      cwd: repoRoot,
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
}

async function stopProcessTree(child) {
  if (!child.pid || child.exitCode !== null) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGTERM");
    } catch {
      // ignore
    }
  }
  const exited = await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(() => resolve(false), 2_000)),
  ]);
  if (exited === false) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore
      }
    }
  }
}

async function rmWithRetry(target) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(target, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
}

async function waitForWebExtInstall(child) {
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });
  await waitFor(
    () => output.includes("Installed") || output.includes("Automatic extension"),
    20_000,
    () => `web-ext install output. Last output:\n${output}`,
  );
}

async function waitForExtensionUuid(profileDir) {
  const prefsPath = path.join(profileDir, "prefs.js");
  return waitFor(async () => {
    if (!existsSync(prefsPath)) return false;
    const prefs = await readFile(prefsPath, "utf8");
    const match = prefs.match(
      /user_pref\("extensions\.webextensions\.uuids", "((?:\\.|[^"])*)"\);/,
    );
    if (!match) return false;
    const decoded = JSON.parse(`"${match[1]}"`);
    const uuids = JSON.parse(decoded);
    return uuids["slothing@slothing.work"] || false;
  }, 20_000, "extension UUID");
}

async function connectBidi(port) {
  const socket = await waitFor(async () => {
    try {
      return await new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://127.0.0.1:${port}/session`);
        ws.onopen = () => resolve(ws);
        ws.onerror = () => reject(new Error("BiDi not ready"));
      });
    } catch {
      return false;
    }
  }, 20_000, "Firefox BiDi endpoint");

  let id = 0;
  const pending = new Map();
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };

  async function send(method, params = {}) {
    const response = await new Promise((resolve) => {
      const messageId = ++id;
      pending.set(messageId, resolve);
      socket.send(JSON.stringify({ id: messageId, method, params }));
    });
    if (response.type === "error") {
      throw new Error(`${method}: ${response.error} ${response.message || ""}`);
    }
    return response.result;
  }

  await send("session.new", { capabilities: { alwaysMatch: {} } });

  return {
    async firstContext() {
      const tree = await send("browsingContext.getTree");
      return tree.contexts[0].context;
    },
    async navigate(context, url) {
      await send("browsingContext.navigate", { context, url, wait: "complete" });
    },
    async evaluate(context, expression) {
      const result = await send("script.evaluate", {
        target: { context },
        expression,
        awaitPromise: true,
        resultOwnership: "none",
      });
      if (result.type !== "success") {
        throw new Error(result.exceptionDetails?.text || "script failed");
      }
      return unwrapRemoteValue(result.result);
    },
    async waitForJson(context, fn, predicate = (value) => !!value, timeout = 8_000) {
      let lastValue;
      return waitFor(async () => {
        const value = JSON.parse(await this.evaluate(context, `(${fn.toString()})()`));
        lastValue = value;
        return predicate(value) ? value : false;
      }, timeout, () => `Firefox page assertion. Last value: ${JSON.stringify(lastValue)}`);
    },
    async close() {
      socket.close();
    },
  };
}

function unwrapRemoteValue(value) {
  if (Object.hasOwn(value, "value")) return value.value;
  if (value.type === "undefined") return undefined;
  return value;
}

function getFreePort() {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitFor(check, timeoutMs, label) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const result = await check();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  const suffix = typeof label === "function" ? label() : label;
  throw new Error(`Timed out waiting for ${suffix}${lastError ? `: ${lastError.message}` : ""}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
