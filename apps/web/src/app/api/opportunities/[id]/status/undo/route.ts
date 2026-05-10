/**
 * @route POST /api/opportunities/[id]/status/undo
 * @description Restore a previous opportunity status after an automatic update
 * @auth Required
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth";
import { validationErrorResponse } from "@/lib/api-utils";
import { changeOpportunityStatus, getOpportunity } from "@/lib/opportunities";
import { opportunityStatusSchema } from "@/types/opportunity";

export const dynamic = "force-dynamic";

const undoStatusSchema = z.object({
  previousStatus: opportunityStatusSchema,
  currentStatus: opportunityStatusSchema.optional(),
});

interface UndoStatusRouteContext {
  params: { id: string };
}

export async function POST(
  request: NextRequest,
  { params }: UndoStatusRouteContext,
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parseResult = undoStatusSchema.safeParse(await request.json());
    if (!parseResult.success) {
      return validationErrorResponse(parseResult.error);
    }

    const existing = getOpportunity(params.id, authResult.userId);
    if (!existing) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      );
    }

    const { previousStatus, currentStatus } = parseResult.data;
    if (currentStatus && existing.status !== currentStatus) {
      return NextResponse.json(
        { error: "Opportunity status changed since this update" },
        { status: 409 },
      );
    }

    const opportunity = changeOpportunityStatus(
      params.id,
      previousStatus,
      authResult.userId,
    );

    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error("Undo opportunity status error:", error);
    return NextResponse.json(
      { error: "Failed to undo opportunity status" },
      { status: 500 },
    );
  }
}
