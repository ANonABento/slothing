import { getProfileTool } from "./get-profile.js";
import { listOpportunitiesTool } from "./list-opportunities.js";
import { getOpportunityDetailTool } from "./get-opportunity-detail.js";
import { searchAnswerBankTool } from "./search-answer-bank.js";
import { saveAnswerTool } from "./save-answer.js";
import type { AnyToolDefinition, ToolDefinition } from "./types.js";

// Each tool is type-erased to `AnyToolDefinition` for the dispatcher. The
// underlying handlers keep their own strict argument types; the cast happens
// once here at the registry boundary.
export const allTools: ReadonlyArray<AnyToolDefinition> = [
  getProfileTool as unknown as AnyToolDefinition,
  listOpportunitiesTool as unknown as AnyToolDefinition,
  getOpportunityDetailTool as unknown as AnyToolDefinition,
  searchAnswerBankTool as unknown as AnyToolDefinition,
  saveAnswerTool as unknown as AnyToolDefinition,
] as const;

export {
  getProfileTool,
  listOpportunitiesTool,
  getOpportunityDetailTool,
  searchAnswerBankTool,
  saveAnswerTool,
};
export type { ToolDefinition, AnyToolDefinition };
