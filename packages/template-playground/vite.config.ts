import { defineConfig } from "vite";

// Dev-only harness. Resolves `@slothing/shared/*` straight from TS source via the
// workspace symlink (no build step needed). See docs/resume-template-cloning-spec.md §11.
export default defineConfig({
  server: { port: 5180, open: true },
});
