/**
 * @route GET /api/extension/opportunities/[id]
 * @description Fetch a single opportunity by id, scoped to the authenticated extension token user.
 * @auth Extension token
 * @response JobDescription
 *
 * Read-side companion to POST /api/opportunities/from-extension. Used by the
 * @slothing/mcp server's `get_opportunity_detail` tool.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { getJob } from "@/lib/db/queries/jobs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Opportunity id is required" },
        { status: 400 },
      );
    }

    const opportunity = await getJob(authResult.userId, id);
    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error("Extension opportunity detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunity" },
      { status: 500 },
    );
  }
}
