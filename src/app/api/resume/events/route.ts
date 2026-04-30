/**
 * @route POST /api/resume/events
 * @description Record resume engagement events such as share clicks.
 * @auth Required
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, isAuthError } from "@/lib/auth";
import { RESUME_EVENT_TYPES, recordResumeEvent } from "@/lib/db/resume-events";

const eventSchema = z.object({
  resumeId: z.string().min(1),
  eventType: z.enum(RESUME_EVENT_TYPES),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const body = await request.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid resume event" },
      { status: 400 },
    );
  }

  try {
    const event = recordResumeEvent(
      parsed.data.resumeId,
      parsed.data.eventType,
      authResult.userId,
      parsed.data.metadata,
    );
    return NextResponse.json({ event });
  } catch (error) {
    if (error instanceof Error && error.message === "Resume not found") {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    console.error("Resume event error:", error);
    return NextResponse.json(
      { error: "Failed to record resume event" },
      { status: 500 },
    );
  }
}
