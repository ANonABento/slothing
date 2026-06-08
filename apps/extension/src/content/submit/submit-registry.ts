// P3 — Submit-adapter registry. Pick the adapter for a host, or null when the
// ATS isn't supported (the caller then marks the draft `needs_human`).

import type { SubmitAdapter } from "./submit-adapter";
import { greenhouseAdapter } from "./greenhouse-adapter";
import { leverAdapter } from "./lever-adapter";

export const SUBMIT_ADAPTERS: readonly SubmitAdapter[] = [
  greenhouseAdapter,
  leverAdapter,
];

export function pickSubmitAdapter(host: string): SubmitAdapter | null {
  return SUBMIT_ADAPTERS.find((adapter) => adapter.matches(host)) ?? null;
}
