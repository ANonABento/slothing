/**
 * @route GET /api/opportunities/templates
 * @description List all built-in and custom resume templates
 * @auth Required
 * @response ResumeTemplatesResponse from @/types/api
 */
import { NextRequest } from "next/server";
import { TEMPLATES } from "@/lib/resume/pdf";
import {
  listResumeTemplates,
  migrateV4ToCollapsed,
} from "@/lib/db/resume-templates";
import { requireAuth, isAuthError } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    try {
      migrateV4ToCollapsed();
    } catch {
      // best-effort
    }
    const builtIn = TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      type: "built-in" as const,
    }));

    const custom = listResumeTemplates(authResult.userId).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description ?? "Imported template",
      type: "custom" as const,
      sourceFilename: t.sourceFilename,
      sourceType: t.sourceType,
    }));

    return successResponse({ templates: [...builtIn, ...custom] });
  } catch (error) {
    console.error("List templates error:", error);
    return errorResponse("internal_error", "Failed to list templates");
  }
}
