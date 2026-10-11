import { createClient, type Client } from "@libsql/client";

let clientInstance: Client | undefined;

export function getLibsqlConfig(
  env: Record<string, string | undefined> = process.env,
) {
  const url = env.TURSO_DATABASE_URL?.trim() || "file:./.local.db";
  const authToken = env.TURSO_AUTH_TOKEN?.trim();
  return authToken ? { url, authToken } : { url };
}

export function getClient(): Client {
  clientInstance ??= createClient(getLibsqlConfig());
  return clientInstance;
}
