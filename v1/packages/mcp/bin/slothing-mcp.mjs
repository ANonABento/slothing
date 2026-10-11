#!/usr/bin/env node
/**
 * `pnpm dlx @slothing/mcp` entry shim. Loads the compiled server and starts
 * the stdio transport. Keeping this tiny so the published `bin` does not
 * depend on TypeScript at runtime.
 */
import { main } from "../dist/index.js";

main().catch((error) => {
  process.stderr.write(`[slothing-mcp] fatal: ${String(error)}\n`);
  process.exit(1);
});
