import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getJob } from "@/lib/db/jobs";
import {
  deleteOpportunityContact,
  getContactsForOpportunity,
} from "@/lib/db/opportunity-contacts";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string; contactId: string };
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const opportunity = getJob(params.id, authResult.userId);
    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      );
    }

    const existing = getContactsForOpportunity(params.id, authResult.userId);
    if (!existing.some((contact) => contact.id === params.contactId)) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const deleted = deleteOpportunityContact(
      params.contactId,
      authResult.userId,
    );
    if (!deleted) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete opportunity contact error:", error);
    return NextResponse.json(
      { error: "Failed to delete opportunity contact" },
      { status: 500 },
    );
  }
}
