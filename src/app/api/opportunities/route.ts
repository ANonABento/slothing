import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isAuthError } from "@/lib/auth";
import { listOpportunities } from "@/lib/opportunities";
import { createJob } from "@/lib/db/jobs";
import { createOpportunitySchema } from "@/types/opportunity";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const statuses = request.nextUrl.searchParams
    .get("status")
    ?.split(",")
    .map((status) => status.trim())
    .filter(Boolean);

  try {
    return NextResponse.json({
      opportunities: listOpportunities(authResult.userId, statuses),
    });
  } catch (error) {
    console.error("List opportunities error:", error);
    return NextResponse.json(
      { error: "Failed to list opportunities" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const parseResult = createOpportunitySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
    }
    const data = parseResult.data;
    const job = createJob({
      title: data.title,
      company: data.company,
      description: data.summary,
      location: data.city,
      url: data.sourceUrl,
      requirements: data.requiredSkills ?? [],
      responsibilities: data.responsibilities ?? [],
      keywords: data.tags ?? [],
      status: "pending",
      notes: data.notes,
      deadline: data.deadline,
    }, authResult.userId);
    return NextResponse.json({ opportunity: job }, { status: 201 });
  } catch (error) {
    console.error("Create opportunity error:", error);
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 });
  }
}
