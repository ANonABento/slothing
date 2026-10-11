/**
 * Env loading + validation. Two required vars:
 *   - SLOTHING_TOKEN: extension token minted via /api/extension/auth.
 *   - SLOTHING_API_URL: base URL of the Slothing web app.
 *
 * For backwards compatibility with the original design doc, we also accept
 * SLOTHING_EXTENSION_TOKEN and SLOTHING_BASE_URL as aliases.
 */
export interface ServerConfig {
  baseUrl: string;
  token: string;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const token = env.SLOTHING_TOKEN ?? env.SLOTHING_EXTENSION_TOKEN;
  const baseUrl = env.SLOTHING_API_URL ?? env.SLOTHING_BASE_URL;

  const missing: string[] = [];
  if (!token) missing.push("SLOTHING_TOKEN");
  if (!baseUrl) missing.push("SLOTHING_API_URL");

  if (missing.length > 0) {
    throw new ConfigError(
      `Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. ` +
        `Mint a token via POST /api/extension/auth on your Slothing instance and set both vars before starting the MCP server.`,
    );
  }

  // We've validated they exist above; the explicit `!` is just to narrow
  // the type for TypeScript.
  return {
    baseUrl: baseUrl!.trim(),
    token: token!.trim(),
  };
}
