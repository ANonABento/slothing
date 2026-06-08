import { createHash } from "crypto";

/**
 * Deterministic A/B experiment assignment.
 *
 * Slothing has no third-party experiment platform. This is the minimal
 * substrate: a stable hash of `experimentKey:unitId` into a `[0, 1)` bucket,
 * mapped onto weighted variants. Same (experiment, unit) always lands in the
 * same variant — no stored assignment table needed.
 *
 * Pure + DB-free on purpose, so it unit-tests cleanly and runs on either side
 * of the wire. The settings-override + registry layer lives in `index.ts`.
 */

export interface ExperimentDefinition {
  /** Stable storage key, e.g. `exp_profile_picker`. Used for hashing + events. */
  key: string;
  /** Variant ids. `variants[0]` is the control / default. */
  variants: readonly string[];
  /**
   * Relative weights, same length as `variants`. Omit for an even split.
   * Need not sum to 1 — they're normalised.
   */
  weights?: readonly number[];
  /** When false, everyone gets the control (`variants[0]`). */
  enabled: boolean;
  /** Human-readable note for the registry. */
  description?: string;
}

/**
 * Hash `experimentKey:unitId` into a stable float in `[0, 1)`.
 * The experiment key is part of the hash so a single user falls into
 * independent buckets across different experiments.
 */
export function bucket(experimentKey: string, unitId: string): number {
  const digest = createHash("sha256")
    .update(`${experimentKey}:${unitId}`)
    .digest();
  // First 4 bytes as an unsigned int, normalised to [0, 1).
  return digest.readUInt32BE(0) / 0x1_0000_0000;
}

/**
 * Deterministically assign `unitId` to one of `def.variants`.
 * DB-free: callers that want a per-user override should use `getVariant`.
 */
export function assignVariant(
  def: ExperimentDefinition,
  unitId: string,
): string {
  if (def.variants.length === 0) {
    throw new Error(`Experiment "${def.key}" has no variants`);
  }
  if (!def.enabled) {
    return def.variants[0];
  }

  const weights =
    def.weights && def.weights.length === def.variants.length
      ? def.weights
      : def.variants.map(() => 1);
  const total = weights.reduce((sum, w) => sum + Math.max(0, w), 0);
  if (total <= 0) {
    return def.variants[0];
  }

  const point = bucket(def.key, unitId) * total;
  let cumulative = 0;
  for (let i = 0; i < def.variants.length; i += 1) {
    cumulative += Math.max(0, weights[i]);
    if (point < cumulative) {
      return def.variants[i];
    }
  }
  // Floating-point safety net.
  return def.variants[def.variants.length - 1];
}
