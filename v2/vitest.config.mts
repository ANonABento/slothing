import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  test: {
    teardownTimeout: 5000,
    // Tests must never open the real v2/data database.
    env: { SLOTHING_DATA_DIR: mkdtempSync(join(tmpdir(), "slothing-test-")) },
  },
});
