#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DIST_DIR =
  process.env.TARGET === "firefox"
    ? path.join(__dirname, "../dist-firefox")
    : path.join(__dirname, "../dist");

const BUDGETS = {
  "background.js": 890 * 1024,
  "content.js": 1225 * 1024,
  "sharedUi.js": 405 * 1024,
  "popup.js": 220 * 1024,
  "options.js": 80 * 1024,
};

const TOTAL_JS_BUDGET = 2800 * 1024;

const formatKiB = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

let failed = false;
let totalJsBytes = 0;
const jsFiles = fs
  .readdirSync(DIST_DIR)
  .filter((fileName) => fileName.endsWith(".js"))
  .sort();

for (const fileName of jsFiles) {
  totalJsBytes += fs.statSync(path.join(DIST_DIR, fileName)).size;
  if (!Object.prototype.hasOwnProperty.call(BUDGETS, fileName)) {
    console.error(`[bundle-size] Missing budget for emitted JS: ${fileName}`);
    failed = true;
  }
}

for (const [fileName, budget] of Object.entries(BUDGETS)) {
  const filePath = path.join(DIST_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`[bundle-size] Missing ${fileName} in ${DIST_DIR}`);
    failed = true;
    continue;
  }

  const size = fs.statSync(filePath).size;
  const status = size <= budget ? "ok" : "over";
  console.log(
    `[bundle-size] ${fileName}: ${formatKiB(size)} / ${formatKiB(budget)} ${status}`,
  );
  if (size > budget) failed = true;
}

const totalStatus = totalJsBytes <= TOTAL_JS_BUDGET ? "ok" : "over";
console.log(
  `[bundle-size] total JS: ${formatKiB(totalJsBytes)} / ${formatKiB(
    TOTAL_JS_BUDGET,
  )} ${totalStatus}`,
);
if (totalJsBytes > TOTAL_JS_BUDGET) failed = true;

if (failed) {
  process.exit(1);
}
