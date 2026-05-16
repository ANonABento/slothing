/**
 * @route GET /api/settings
 * @route PUT /api/settings
 * @route POST /api/settings
 * @description Fetch and update user settings. LLM provider management lives under /api/settings/llm.
 * @auth Required
 * @response SettingsResponse | SettingsUpdateResponse from @/types/api
 */
import { NextRequest, NextResponse } from "next/server";
import { updateSettingsSchema } from "@/lib/constants";
import { requireAuth, isAuthError } from "@/lib/auth";
import {
  getOpportunityReviewEnabled,
  setOpportunityReviewEnabled,
} from "@/lib/settings/opportunity-review";
import { getDigestEnabled, setDigestEnabled } from "@/lib/settings/digest";
import {
  getKanbanVisibleLanes,
  setKanbanVisibleLanes,
} from "@/lib/settings/kanban-lanes";
import {
  getStoredLocaleSetting,
  setLocaleSetting,
} from "@/lib/settings/locale";
import {
  getGmailAutoStatusEnabled,
  getGmailLastScannedAt,
  setGmailAutoStatusEnabled,
} from "@/lib/settings/gmail-auto-status";
import {
  getCalendarLastPulledAt,
  getCalendarPullEnabled,
  setCalendarPullEnabled,
} from "@/lib/settings/calendar-sync";
import { LOCALE_COOKIE_NAME } from "@/lib/format/time";

export const dynamic = "force-dynamic";

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    return NextResponse.json({
      locale: getStoredLocaleSetting(authResult.userId),
      opportunityReview: {
        enabled: getOpportunityReviewEnabled(authResult.userId),
      },
      digest: {
        enabled: getDigestEnabled(authResult.userId),
      },
      gmailAutoStatus: {
        enabled: getGmailAutoStatusEnabled(authResult.userId),
        lastScannedAt: getGmailLastScannedAt(authResult.userId),
      },
      calendarSync: {
        pullEnabled: getCalendarPullEnabled(authResult.userId),
        lastPulledAt: getCalendarLastPulledAt(authResult.userId),
      },
      kanbanVisibleLanes: getKanbanVisibleLanes(authResult.userId),
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Failed to get settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const rawData = await request.json();

    // Validate input with Zod
    const parseResult = updateSettingsSchema.safeParse(rawData);
    if (!parseResult.success) {
      const errors = parseResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 },
      );
    }

    const data = parseResult.data;
    let locale: string | undefined;
    if (data.opportunityReview) {
      setOpportunityReviewEnabled(
        data.opportunityReview.enabled,
        authResult.userId,
      );
    }
    if (data.digest) {
      setDigestEnabled(data.digest.enabled, authResult.userId);
    }
    if (data.gmailAutoStatus) {
      setGmailAutoStatusEnabled(
        data.gmailAutoStatus.enabled,
        authResult.userId,
      );
    }
    if (data.calendarSync) {
      setCalendarPullEnabled(data.calendarSync.pullEnabled, authResult.userId);
    }
    if (data.kanbanVisibleLanes) {
      setKanbanVisibleLanes(data.kanbanVisibleLanes, authResult.userId);
    }
    if (data.locale) {
      locale = setLocaleSetting(data.locale, authResult.userId);
    }

    const response = NextResponse.json({ success: true });
    if (locale) {
      response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}

export async function POST(_request: NextRequest) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  return NextResponse.json(
    {
      error:
        "LLM provider validation moved to /api/settings/llm/providers/{id}/validate.",
    },
    { status: 410 },
  );
}
