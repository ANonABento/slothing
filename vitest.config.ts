import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import path from "path";

const nodeRequire = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    server: {
      // next-auth (v5 beta) uses extensionless ESM imports of `next/server`
      // which break the strict node resolver. Force vite to bundle it so the
      // resolver pipeline goes through the alias defined below.
      deps: {
        inline: ["next-auth", "@auth/core", "@auth/drizzle-adapter"],
      },
    },
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "evals/**/*.{test,spec}.ts",
      "tests/parsing/**/*.{test,spec}.ts",
      "tests/fixtures/**/*.{test,spec}.ts",
      "tests/stress/**/*.{test,spec}.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/test/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // next-auth (v5 beta) imports `next/server` without a file extension; the
      // vitest jsdom resolver is strict about extensions, so map it explicitly.
      "next/server": nodeRequire.resolve("next/server"),
    },
  },
});
