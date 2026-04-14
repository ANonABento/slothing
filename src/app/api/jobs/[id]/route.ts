import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob, deleteJob } from "@/lib/db/drizzle/queries/jobs";
import { updateJobSchema } from "@/lib/constants";
import { recordJobStatusChange } from "@/lib/db/analytics";
import { requireAuth, isAuthError } from "@/lib/auth";

function tryRecordStatusChange(
  jobId: string,
  oldStatus: string | null,
  newStatus: string | undefined
) {
  if (newStatus && newStatus !== oldStatus) {
    try {
      recordJobStatusChange(jobId, oldStatus, newStatus);
    } catch (err) {
      console.error("Failed to record status change:", err);
    }
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const job = await getJob(authResult.userId, params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ job });
  } catch (error) {
    console.error("Get job error:", error);
    return NextResponse.json({ error: "Failed to get job" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    // Check if job exists and get current status
    const existingJob = await getJob(authResult.userId, params.id);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    const oldStatus = existingJob.status || null;

    const rawData = await request.json();

    // Validate input with Zod
    const parseResult = updateJobSchema.safeParse(rawData);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const job = await updateJob(authResult.userId, params.id, data);

    tryRecordStatusChange(params.id, oldStatus, data.status);

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

// PATCH for partial updates (e.g., status changes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    // Get the job's current status before updating
    const existingJob = await getJob(authResult.userId, params.id);

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    const oldStatus = existingJob.status || null;

    const rawData = await request.json();
    const parseResult = updateJobSchema.safeParse(rawData);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const job = await updateJob(authResult.userId, params.id, data);

    tryRecordStatusChange(params.id, oldStatus, data.status);

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Patch job error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    await deleteJob(authResult.userId, params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
