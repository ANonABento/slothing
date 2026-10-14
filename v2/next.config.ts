import type { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["better-sqlite3", "playwright-core", "unpdf", "mammoth"],
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
};

export default config;
