import { logEnvValidation } from "@/lib/env";

export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  logEnvValidation();
}
