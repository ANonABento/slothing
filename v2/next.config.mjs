// Plain JS, not .ts: `next start` would need the typescript package just to read a .ts config (the Docker image has no dev deps).
/** @type {import("next").NextConfig} */
const config = {
  devIndicators: false,
  // A second server (e.g. one on a copy of the data) needs its own build folder: two sharing .next corrupt it.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["better-sqlite3", "unpdf", "mammoth"],
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
};

export default config;
