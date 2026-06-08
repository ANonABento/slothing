/**
 * @route GET /api/extension/agent-policy
 * @description Return the user's agent autonomy policy so an external agent can
 *   self-govern (it must not act beyond the configured level). Read-only.
 * @auth Extension token via X-Extension-Token
 */
import { NextRequest, NextResponse } from "next/server";
import { requireExtensionAuth } from "@/lib/extension-auth";
import { getAgentSettings } from "@/lib/db/agent-settings";
import {
  allowsSubmission,
  allowsUnattendedSubmission,
} from "@/lib/agent/policy";

export async function GET(request: NextRequest) {
  const authResult = await requireExtensionAuth(request);
  if (!authResult.success) {
    return authResult.response;
  }

  try {
    const policy = await getAgentSettings(authResult.userId);
    return NextResponse.json({
      policy,
      // Convenience flags so simple agents don't re-derive the ladder.
      capabilities: {
        canSubmit: allowsSubmission(policy.autonomy) && !policy.dryRun,
        canSubmitUnattended:
          allowsUnattendedSubmission(policy.autonomy) && !policy.dryRun,
      },
    });
  } catch (error) {
    console.error("Agent policy fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent policy" },
      { status: 500 },
    );
  }
}
