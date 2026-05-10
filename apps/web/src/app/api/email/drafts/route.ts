/**
 * @route GET /api/email/drafts
 * @route POST /api/email/drafts
 * @description List email drafts (GET) or create a new draft (POST)
 * @auth Required
 * @request { subject: string, body: string, to?: string, jobId?: string } (POST)
 * @response EmailDraftsResponse | EmailDraftResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api-utils";
import {
  createEmailDraft,
  listEmailDraftsPaginated,
} from "@/lib/db/email-drafts";
import { getJob } from "@/lib/db/jobs";
import { requireAuth, isAuthError } from "@/lib/auth";
import { createEmailDraftSchema } from "@/lib/schemas";
import {
  buildPaginationResult,
  decodeCursor,
  InvalidCursorError,
  PaginationParamsSchema,
} from "@/lib/pagination";

export const dynamic = "force-dynamic";

const emailDraftCursorSchema = z.object({
  lastId: z.string(),
  lastCreatedAt: z.string(),
});

const emailDraftsQuerySchema = PaginationParamsSchema.extend({
  type: createEmailDraftSchema.shape.type.optional(),
});

// GET - List all email drafts
export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = emailDraftsQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const cursor = decodeCursor(parsed.data.cursor, emailDraftCursorSchema);
    const rows = listEmailDraftsPaginated({
      userId: authResult.userId,
      type: parsed.data.type,
      cursor,
      limit: parsed.data.limit,
    });
    const page = buildPaginationResult(rows, parsed.data.limit, (draft) => ({
      lastId: draft.id,
      lastCreatedAt: draft.updatedAt,
    }));

    return NextResponse.json({
      drafts: page.items,
      items: page.items,
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    });
  } catch (error) {
    if (error instanceof InvalidCursorError) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400 });
    }
    console.error("Get drafts error:", error);
    return NextResponse.json(
      { error: "Failed to get email drafts" },
      { status: 500 },
    );
  }
}

// POST - Create a new email draft
export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = await parseJsonBody(request, createEmailDraftSchema);
    if (!parsed.ok) return parsed.response;
    const { type, jobId, subject, body, context } = parsed.data;

    if (jobId && !getJob(jobId, authResult.userId)) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const draft = createEmailDraft(
      {
        type,
        jobId,
        subject,
        body,
        context,
      },
      authResult.userId,
    );

    return NextResponse.json({ draft });
  } catch (error) {
    console.error("Create draft error:", error);
    return NextResponse.json(
      { error: "Failed to create email draft" },
      { status: 500 },
    );
  }
}
