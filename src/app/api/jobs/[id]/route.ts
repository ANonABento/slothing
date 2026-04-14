import { NextRequest, NextResponse } from "next/server";
import { getJob, updateJob, deleteJob } from "@/lib/db/drizzle/queries";
import { updateJobSchema } from "@/lib/constants";
import { recordJobStatusChange } from "@/lib/db/analytics";
import { requireAuth, isAuthError } from "@/lib/auth";

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

async function handleJobUpdate(
  request: NextRequest,
  userId: string,
  jobId: string
): Promise<NextResponse> {
  const existingJob = await getJob(userId, jobId);
  if (!existingJob) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const oldStatus = existingJob.status;
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
  const job = await updateJob(userId, jobId, data);

  if (data.status && data.status !== oldStatus) {
    try {
      recordJobStatusChange(jobId, oldStatus ?? null, data.status);
    } catch (statusError) {
      console.error("Failed to record status change:", statusError);
    }
  }

  return NextResponse.json({ job });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    return await handleJobUpdate(request, authResult.userId, params.id);
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
    return await handleJobUpdate(request, authResult.userId, params.id);
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
