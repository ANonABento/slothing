import type { LayoutGrammar } from "./grammar";
import type { StyleTokens } from "./tokens";
import type { ResumeTemplate } from "./template";

/**
 * The preview + NUDGE primitive (spec §3 Decision 4 trust loop). A single, pure way
 * to layer live user overrides (accent, font, density, columns, …) on top of a base
 * template, used by BOTH the playground and the Studio import dialog (Phase 4) so the
 * nudge semantics can't diverge between the two surfaces.
 */

export interface TemplateNudges {
  grammar?: Partial<LayoutGrammar>;
  tokens?: Partial<StyleTokens>;
}

/** Apply partial grammar/token overrides over a base template (immutably). */
export function applyNudges(
  base: ResumeTemplate,
  nudges: TemplateNudges,
): ResumeTemplate {
  return {
    ...base,
    grammar: { ...base.grammar, ...(nudges.grammar ?? {}) },
    tokens: { ...base.tokens, ...(nudges.tokens ?? {}) },
  };
}
