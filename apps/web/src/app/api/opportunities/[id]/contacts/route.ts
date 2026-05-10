import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getJob } from "@/lib/db/jobs";
import {
  addContactToOpportunity,
  getContactsForOpportunity,
} from "@/lib/db/opportunity-contacts";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  title: z.string().trim().optional(),
  source: z.enum(["google", "manual"]).default("manual"),
  googleResourceName: z.string().trim().optional(),
});

export async function GET(_request: NextRequest, { params }: RouteContext) {
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

    const contacts = getContactsForOpportunity(params.id, authResult.userId);
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("List opportunity contacts error:", error);
    return NextResponse.json(
      { error: "Failed to list opportunity contacts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 },
      );
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: parsed.error.issues },
        { status: 400 },
      );
    }

    const contact = addContactToOpportunity(
      {
        opportunityId: params.id,
        ...parsed.data,
      },
      authResult.userId,
    );

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Create opportunity contact error:", error);
    return NextResponse.json(
      { error: "Failed to create opportunity contact" },
      { status: 500 },
    );
  }
}
