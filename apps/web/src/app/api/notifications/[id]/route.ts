/**
 * @route PATCH /api/notifications/[id]
 * @route DELETE /api/notifications/[id]
 * @description PATCH: Mark notification as read. DELETE: Remove notification.
 * @auth Required
 * @response DeleteResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import {
  markNotificationRead,
  deleteNotification,
} from "@/lib/db/notifications";
import {
  getSuggestedStatusUpdateByNotification,
  updateSuggestedStatusUpdateState,
} from "@/lib/db/suggested-status-updates";
import { requireAuth, isAuthError } from "@/lib/auth";
import { changeOpportunityStatus } from "@/lib/opportunities";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = params;
    const { action } = await request.json();

    switch (action) {
      case "markRead":
        markNotificationRead(id, authResult.userId);
        return NextResponse.json({ success: true, action: "markedRead" });

      case "acceptSuggestedStatus": {
        const suggestion = getSuggestedStatusUpdateByNotification(
          id,
          authResult.userId,
        );
        if (!suggestion || suggestion.state !== "pending") {
          return NextResponse.json(
            { error: "Suggested update not found" },
            { status: 404 },
          );
        }
        const opportunity = changeOpportunityStatus(
          suggestion.opportunityId,
          suggestion.suggestedStatus,
          authResult.userId,
        );
        if (!opportunity) {
          return NextResponse.json(
            { error: "Opportunity not found" },
            { status: 404 },
          );
        }
        const updatedSuggestion = updateSuggestedStatusUpdateState(
          id,
          authResult.userId,
          "accepted",
        );
        markNotificationRead(id, authResult.userId);
        return NextResponse.json({
          success: true,
          action: "acceptedSuggestedStatus",
          opportunity,
          suggestedStatusUpdate: updatedSuggestion,
        });
      }

      case "dismissSuggestedStatus": {
        const updatedSuggestion = updateSuggestedStatusUpdateState(
          id,
          authResult.userId,
          "dismissed",
        );
        markNotificationRead(id, authResult.userId);
        return NextResponse.json({
          success: true,
          action: "dismissedSuggestedStatus",
          suggestedStatusUpdate: updatedSuggestion,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = params;
    deleteNotification(id, authResult.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}
