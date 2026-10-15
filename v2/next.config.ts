import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  // A second server (e.g. one on a copy of the data) needs its own build folder: two sharing .next corrupt it.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  serverExternalPackages: ["better-sqlite3", "unpdf", "mammoth"],
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
};

export default config;
