import { getSetting } from "@/lib/db/queries";
import { assignVariant, bucket, type ExperimentDefinition } from "./assign";

export { assignVariant, bucket };
export type { ExperimentDefinition };

/**
 * Active experiment registry. Add an entry here, gate the relevant code on
 * `getVariant(...)`, and emit exposure + outcome events via
 * `@/lib/db/product-analytics` to measure it.
 *
 * `key`s are also used as the `source` column on `product_events`, so keep
 * them stable once an experiment is live.
 */
export const EXPERIMENTS = {
  /** SpeedyApply-style multi-profile picker + AI best-fit badge in the extension. */
  profilePicker: {
    key: "exp_profile_picker",
    variants: ["control", "treatment"] as const,
    enabled: true,
    description:
      "Show a resume/profile selector + AI best-fit badge in the extension.",
  },
  /** Push answer-bank matches into warm-zone fields during autofill. */
  answerPrefill: {
    key: "exp_answer_prefill",
    variants: ["control", "treatment"] as const,
    enabled: false,
    description: "Auto pre-fill matched answer-bank responses during autofill.",
  },
  /** Hardened generic field detector for unsupported ATSs. */
  genericAutofill: {
    key: "exp_generic_autofill",
    variants: ["control", "treatment"] as const,
    enabled: false,
    description: "Hardened generic autofill detector for non-supported ATSs.",
  },
} satisfies Record<string, ExperimentDefinition>;

export type ExperimentName = keyof typeof EXPERIMENTS;

/** Suffix appended to an experiment key to look up a forced per-user override. */
export function overrideSettingKey(experimentKey: string): string {
  return `${experimentKey}_override`;
}

/**
 * Resolve the variant for a user. A per-user override stored in the `settings`
 * table (key `<experimentKey>_override`) wins when it names a valid variant —
 * this is the dogfooding/QA escape hatch. Otherwise falls back to deterministic
 * hash assignment.
 */
export function getVariant(name: ExperimentName, userId: string): string {
  const def = EXPERIMENTS[name];
  const override = getSetting(overrideSettingKey(def.key), userId);
  if (override && (def.variants as readonly string[]).includes(override)) {
    return override;
  }
  return assignVariant(def, userId);
}

/** Convenience: is the user in any non-control variant for this experiment? */
export function isInTreatment(name: ExperimentName, userId: string): boolean {
  return getVariant(name, userId) !== EXPERIMENTS[name].variants[0];
}
