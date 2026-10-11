/**
 * @route GET /api/templates
 * @route POST /api/templates
 * @route DELETE /api/templates
 * @route PATCH /api/templates
 * @description List templates (GET), create a template (POST), delete a template (DELETE), or update template metadata (PATCH)
 * @auth Required
 * @request { name: string, content: string } (POST) | { id: string } (DELETE) | { id: string, name?: string, description?: string | null } (PATCH)
 * @response TemplatesResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteResumeTemplate,
  listResumeTemplates,
  migrateV4ToCollapsed,
  updateResumeTemplateMetadata,
} from "@/lib/db/resume-templates";
import { TEMPLATES } from "@/lib/resume/templates";
import { requireAuth, isAuthError } from "@/lib/auth";
import {
  ApiErrors,
  successResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api-utils";

export const dynamic = "force-dynamic";

const patchTemplateSchema = z
  .object({
    id: z.string().min(1, "Template ID is required"),
    name: z
      .string()
      .trim()
      .min(1, "Template name is required")
      .max(100)
      .optional(),
    description: z.string().trim().max(300).nullable().optional(),
  })
  .refine(
    (value) => value.name !== undefined || value.description !== undefined,
    {
      message: "Template name or description is required",
    },
  );

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    // Fold any committed legacy V4 templates into the collapsed store on read.
    try {
      migrateV4ToCollapsed();
    } catch {
      // best-effort
    }
    const customRows = listResumeTemplates(authResult.userId);

    const builtIn = TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      type: "built-in" as const,
    }));

    const custom = customRows.map((t) => ({
      id: t.id,
      name: t.name,
      description:
        t.description ??
        (t.sourceType
          ? `Imported template from ${t.sourceType.toUpperCase()}`
          : "Imported template"),
      type: "custom" as const,
      customDescription: t.description,
      sourceFilename: t.sourceFilename,
      sourceType: t.sourceType,
      layout:
        t.template.grammar.columns === "single"
          ? "single-column"
          : "two-column",
      template: t.template,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return successResponse({ templates: [...builtIn, ...custom] });
  } catch (error) {
    console.error("List templates error:", error);
    return errorResponse("internal_error", "Failed to list templates");
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    return NextResponse.json(
      {
        error: "Use /api/templates/import to clone a résumé into a template.",
        code: "legacy_template_creation_disabled",
      },
      { status: 410 },
    );
  } catch (error) {
    console.error("Create template error:", error);
    return errorResponse("internal_error", "Failed to create template");
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return ApiErrors.badRequest("Template ID is required");
    }

    const deleted = deleteResumeTemplate(id, authResult.userId);
    if (!deleted) {
      return ApiErrors.notFound("Template");
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error("Delete template error:", error);
    return errorResponse("internal_error", "Failed to delete template");
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const parseResult = patchTemplateSchema.safeParse(body);

    if (!parseResult.success) {
      return validationErrorResponse(parseResult.error);
    }

    const { id, name, description } = parseResult.data;
    const updated = updateResumeTemplateMetadata(id, authResult.userId, {
      name,
      description,
    });
    if (!updated) {
      return ApiErrors.notFound("Template");
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error("Update template error:", error);
    return errorResponse("internal_error", "Failed to update template");
  }
}
