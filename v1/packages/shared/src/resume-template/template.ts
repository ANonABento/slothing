import { z } from "zod";

import { layoutGrammarSchema, type LayoutGrammar } from "./grammar";
import { styleTokensSchema, type StyleTokens } from "./tokens";

/**
 * A ResumeTemplate is ONE declarative definition (grammar + tokens) consumed by
 * the shared render adapters (renderHtml / renderTypeset). New design = one
 * definition; both backends render it automatically. See spec §6.
 */

export interface TemplateMeta {
  description?: string;
  /** Recognizable OSS design this was ported from, for attribution (§9). */
  inspiredBy?: string;
  /** License of the source design (e.g. "MIT", "Apache-2.0", "LPPL-1.3c"). */
  license?: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  grammar: LayoutGrammar;
  tokens: StyleTokens;
  meta?: TemplateMeta;
}

export const resumeTemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  grammar: layoutGrammarSchema,
  tokens: styleTokensSchema,
  meta: z
    .object({
      description: z.string().optional(),
      inspiredBy: z.string().optional(),
      license: z.string().optional(),
    })
    .optional(),
});
